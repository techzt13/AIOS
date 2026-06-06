const fs = require('fs/promises');
const path = require('path');
const { normalizeBaseUrl, parseProviderResponse } = require('../adapters/utils');
const { getConfigDir } = require('../configDir');

const TOKEN_PATH = path.join(getConfigDir(), 'github-copilot.json');
const DEFAULT_COPILOT_CLIENT_ID = 'Iv1.b507a08c87ecfe98';
const DEFAULT_DEVICE_SCOPE = process.env.GITHUB_COPILOT_OAUTH_SCOPE || 'read:user';
const GITHUB_DEVICE_CODE_URL = 'https://github.com/login/device/code';
const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_DEVICE_VERIFICATION_URL = 'https://github.com/login/device';
const GITHUB_COPILOT_TOKEN_URL = process.env.GITHUB_COPILOT_TOKEN_URL || 'https://api.github.com/copilot_internal/v2/token';
const COPILOT_TOKEN_ENV_VARS = ['COPILOT_GITHUB_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN'];
const COPILOT_SETUP_HINT = 'Use Sign in with GitHub, or set COPILOT_GITHUB_TOKEN, GH_TOKEN, or GITHUB_TOKEN in .env.';
const FALLBACK_COPILOT_MODELS = [
  'github-copilot/gpt-4o',
  'github-copilot/claude-opus-4.7',
  'github-copilot/claude-sonnet-4.6',
  'github-copilot/claude-3.5-sonnet',
  'github-copilot/gpt-5.5',
  'github-copilot/gpt-5.4',
  'github-copilot/gpt-5.3-codex'
];
// GitHub Copilot device-login support in AIOS is opt-in and uses undocumented/private
// Copilot token exchange behavior. It may break if GitHub changes their APIs, and each
// user remains responsible for making sure their Copilot plan allows this usage.

async function ensureConfigDir() {
  const configDir = getConfigDir();
  await fs.mkdir(configDir, { recursive: true, mode: 0o700 });
  try {
    await fs.chmod(configDir, 0o700);
  } catch {
    // Best effort. Some filesystems may not support chmod.
  }
}

async function loadSession() {
  try {
    const raw = await fs.readFile(TOKEN_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }

    throw error;
  }
}

async function saveSession(session) {
  await ensureConfigDir();
  await fs.writeFile(TOKEN_PATH, JSON.stringify(session, null, 2), { mode: 0o600 });
}

function getSafeStatus(session) {
  const resolvedToken = resolveGitHubOAuthToken({ session });
  const configuredViaEnv = Boolean(resolveEnvGitHubToken());
  const customClientId = Boolean(String(process.env.GITHUB_COPILOT_CLIENT_ID || '').trim());

  return {
    configured: Boolean(resolvedToken),
    login: session.login || null,
    connectedAt: session.connectedAt || null,
    authSource: configuredViaEnv ? 'env' : (session.oauthToken ? 'oauth-device' : 'not-configured'),
    canDeviceLogin: true,
    deviceLoginClient: customClientId ? 'custom' : 'bundled',
    hasCustomClientId: customClientId,
    guidance: COPILOT_SETUP_HINT
  };
}

async function getStatus() {
  return getSafeStatus(await loadSession());
}

async function startDeviceFlow({ fetchImpl = fetch } = {}) {
  const clientId = resolveDeviceClientId();

  const response = await fetchImpl(GITHUB_DEVICE_CODE_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      scope: DEFAULT_DEVICE_SCOPE
    }).toString()
  });
  const data = await parseProviderResponse(response);

  if (!response.ok) {
    throw new Error(data?.error_description || data?.error || 'Failed to start GitHub device flow.');
  }

  return {
    deviceCode: data.device_code,
    expiresIn: data.expires_in,
    interval: data.interval,
    userCode: data.user_code,
    verificationUri: normalizeVerificationUri(data.verification_uri || data.verification_uri_complete),
    verificationUriComplete: data.verification_uri_complete || null
  };
}

async function fetchGitHubLogin(oauthToken, fetchImpl = fetch) {
  const response = await fetchImpl('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + oauthToken,
      'User-Agent': 'AIOS'
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await parseProviderResponse(response);
  return data?.login || null;
}

async function pollDeviceFlow({ deviceCode, fetchImpl = fetch }) {
  const clientId = resolveDeviceClientId();

  const response = await fetchImpl(GITHUB_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
    }).toString()
  });
  const data = await parseProviderResponse(response);

  if (data?.error === 'authorization_pending' || data?.error === 'slow_down') {
    return {
      ok: true,
      pending: true,
      interval: data.interval || null,
      message: data.error_description || data.error
    };
  }

  if (!response.ok || data?.error) {
    throw new Error(data?.error_description || data?.error || 'GitHub OAuth device login failed.');
  }

  const session = await loadSession();
  const login = await fetchGitHubLogin(data.access_token, fetchImpl);
  await saveSession({
    ...session,
    oauthToken: data.access_token,
    login,
    connectedAt: new Date().toISOString(),
    copilotToken: null,
    copilotTokenExpiresAt: null,
    copilotApiBaseUrl: null,
    copilotChatUrl: null
  });

  return {
    ok: true,
    pending: false,
    configured: true,
    login
  };
}

async function exchangeCopilotToken({ oauthToken, baseUrl, fetchImpl = fetch }) {
  const response = await fetchImpl(GITHUB_COPILOT_TOKEN_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + oauthToken,
      ...buildCopilotHeaders({ includeApiVersion: true })
    }
  });
  const data = await parseProviderResponse(response);

  if (!response.ok) {
    const detail = data?.error?.message || data?.message || data?.error;
    throw new Error(detail || `GitHub Copilot token exchange failed with HTTP ${response.status}. Reconnect GitHub Copilot and make sure the signed-in account has an active Copilot plan.`);
  }

  const accessToken = data?.token || data?.access_token;
  if (!accessToken) {
    throw new Error('Copilot token response did not include a token.');
  }

  const expiresAt = typeof data?.expires_at === 'number'
    ? new Date(data.expires_at * 1000).toISOString()
    : new Date(Date.now() + Number(data?.expires_in || 1500) * 1000).toISOString();
  const apiBaseUrl = data?.base_url
    || data?.endpoints?.api
    || getCopilotApiBaseUrlFromToken(accessToken)
    || normalizeBaseUrl(baseUrl)
    || 'https://api.individual.githubcopilot.com';
  const chatUrl = data?.chat_completions_url
    || data?.chat_url
    || data?.endpoints?.chat_completions
    || `${normalizeBaseUrl(apiBaseUrl)}/chat/completions`;

  return {
    accessToken,
    apiBaseUrl: normalizeBaseUrl(apiBaseUrl),
    chatUrl,
    expiresAt
  };
}

async function getChatSession({ baseUrl, fetchImpl = fetch }) {
  const session = await loadSession();
  const oauthToken = resolveGitHubOAuthToken({ session });
  if (!oauthToken) {
    throw new Error(`GitHub Copilot is not connected yet. ${COPILOT_SETUP_HINT}`);
  }

  const expiresAt = session.copilotTokenExpiresAt ? new Date(session.copilotTokenExpiresAt).getTime() : 0;
  if (session.copilotToken && expiresAt > Date.now() + 60_000) {
    return {
      accessToken: session.copilotToken,
      apiBaseUrl: session.copilotApiBaseUrl || deriveApiBaseUrlFromChatUrl(session.copilotChatUrl) || normalizeBaseUrl(baseUrl),
      chatCompletionsUrl: session.copilotChatUrl || `${normalizeBaseUrl(baseUrl)}/chat/completions`
    };
  }

  const refreshed = await exchangeCopilotToken({ oauthToken, baseUrl, fetchImpl });
  await saveSession({
    ...session,
    copilotToken: refreshed.accessToken,
    copilotTokenExpiresAt: refreshed.expiresAt,
    copilotApiBaseUrl: refreshed.apiBaseUrl,
    copilotChatUrl: refreshed.chatUrl
  });

  return {
    accessToken: refreshed.accessToken,
    apiBaseUrl: refreshed.apiBaseUrl,
    chatCompletionsUrl: refreshed.chatUrl
  };
}

function resolveDeviceClientId(env = process.env) {
  return String(env.GITHUB_COPILOT_CLIENT_ID || '').trim() || DEFAULT_COPILOT_CLIENT_ID;
}

function normalizeVerificationUri(raw) {
  const value = String(raw || GITHUB_DEVICE_VERIFICATION_URL).trim();
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return GITHUB_DEVICE_VERIFICATION_URL;
  }

  if (parsed.protocol !== 'https:' || parsed.hostname !== 'github.com' || parsed.pathname !== '/login/device') {
    return GITHUB_DEVICE_VERIFICATION_URL;
  }

  return GITHUB_DEVICE_VERIFICATION_URL;
}

function buildCopilotHeaders({ includeApiVersion = false } = {}) {
  const headers = {
    'User-Agent': process.env.AIOS_USER_AGENT || 'GitHubCopilotChat/0.35.0',
    'Editor-Version': process.env.AIOS_EDITOR_VERSION || 'vscode/1.107.0',
    'Editor-Plugin-Version': process.env.AIOS_EDITOR_PLUGIN_VERSION || 'copilot-chat/0.35.0',
    'Copilot-Integration-Id': process.env.AIOS_COPILOT_INTEGRATION_ID || 'vscode-chat'
  };

  if (includeApiVersion) {
    headers['GitHub-Api-Version'] = process.env.AIOS_COPILOT_GITHUB_API_VERSION || '2025-04-01';
  }

  return headers;
}

function getCopilotApiBaseUrlFromToken(token) {
  const match = String(token || '').match(/(?:^|;)proxy-ep=([^;]+)/);
  if (!match) {
    return null;
  }

  const apiHost = match[1].trim().replace(/^proxy\./, 'api.');
  return apiHost ? `https://${apiHost}` : null;
}

function deriveApiBaseUrlFromChatUrl(chatUrl) {
  if (!chatUrl) {
    return '';
  }

  try {
    const parsed = new URL(chatUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return '';
  }
}

function resolveEnvGitHubToken(env = process.env) {
  for (const envKey of COPILOT_TOKEN_ENV_VARS) {
    const value = String(env[envKey] || '').trim();
    if (value) {
      return value;
    }
  }

  return '';
}

function resolveGitHubOAuthToken({ session = {}, env = process.env } = {}) {
  return resolveEnvGitHubToken(env) || String(session.oauthToken || '').trim();
}

function normalizeCopilotModelId(id) {
  const trimmed = String(id || '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('github-copilot/') ? trimmed : `github-copilot/${trimmed}`;
}

function isAllowedCopilotModel(item) {
  const id = String(item?.id || '').trim().toLowerCase();
  if (!id) return false;
  if (id.includes('embedding') || id.includes('embed')) return false;
  if (id.includes('router') || id.includes('internal')) return false;
  if (item?.object && !String(item.object).toLowerCase().includes('model')) return false;
  return true;
}

function dedupeModels(models = []) {
  return [...new Set(models.filter(Boolean))];
}

async function discoverModels({ baseUrl, fetchImpl = fetch }) {
  const chatSession = await getChatSession({ baseUrl, fetchImpl });
  const apiBaseUrl = chatSession.apiBaseUrl
    || deriveApiBaseUrlFromChatUrl(chatSession.chatCompletionsUrl)
    || normalizeBaseUrl(baseUrl);
  const response = await fetchImpl(`${normalizeBaseUrl(apiBaseUrl)}/models`, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + chatSession.accessToken,
      ...buildCopilotHeaders()
    }
  });

  const data = await parseProviderResponse(response);
  if (!response.ok) {
    throw new Error(data?.error?.message || data?.message || 'Failed to fetch GitHub Copilot model catalog.');
  }

  const entries = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const models = dedupeModels(
    entries
      .filter(isAllowedCopilotModel)
      .map((item) => normalizeCopilotModelId(item.id))
  );

  return models.length > 0 ? models : FALLBACK_COPILOT_MODELS;
}

async function getCopilotModels({ baseUrl, fetchImpl = fetch } = {}) {
  try {
    const discovered = await discoverModels({ baseUrl, fetchImpl });
    return { models: discovered, source: 'live' };
  } catch {
    return { models: [...FALLBACK_COPILOT_MODELS], source: 'fallback' };
  }
}

module.exports = {
  CONFIG_DIR: getConfigDir(),
  COPILOT_SETUP_HINT,
  COPILOT_TOKEN_ENV_VARS,
  FALLBACK_COPILOT_MODELS,
  TOKEN_PATH,
  discoverModels,
  exchangeCopilotToken,
  getCopilotApiBaseUrlFromToken,
  getCopilotModels,
  getChatSession,
  getStatus,
  loadSession,
  pollDeviceFlow,
  resolveEnvGitHubToken,
  resolveGitHubOAuthToken,
  resolveDeviceClientId,
  saveSession,
  startDeviceFlow
};
