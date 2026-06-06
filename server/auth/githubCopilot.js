const fs = require('fs/promises');
const path = require('path');
const { normalizeBaseUrl, parseProviderResponse } = require('../adapters/utils');
const { getConfigDir } = require('../configDir');

const TOKEN_PATH = path.join(getConfigDir(), 'github-copilot.json');
const DEFAULT_DEVICE_SCOPE = process.env.GITHUB_COPILOT_OAUTH_SCOPE || 'read:user copilot';
const COPILOT_TOKEN_ENV_VARS = ['COPILOT_GITHUB_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN'];
const COPILOT_SETUP_HINT = 'Set COPILOT_GITHUB_TOKEN, GH_TOKEN, or GITHUB_TOKEN, or configure GITHUB_COPILOT_CLIENT_ID to use device login.';
const FALLBACK_COPILOT_MODELS = [
  'github-copilot/claude-opus-4.7',
  'github-copilot/claude-sonnet-4.6',
  'github-copilot/claude-3.5-sonnet',
  'github-copilot/gpt-5.5',
  'github-copilot/gpt-5.4',
  'github-copilot/gpt-5.3-codex',
  'github-copilot/gpt-4o',
  'github-copilot/o3-mini'
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

  return {
    configured: Boolean(resolvedToken),
    login: session.login || null,
    connectedAt: session.connectedAt || null,
    authSource: configuredViaEnv ? 'env' : (session.oauthToken ? 'oauth-device' : 'not-configured'),
    canDeviceLogin: Boolean(process.env.GITHUB_COPILOT_CLIENT_ID),
    guidance: COPILOT_SETUP_HINT
  };
}

async function getStatus() {
  return getSafeStatus(await loadSession());
}

async function startDeviceFlow({ fetchImpl = fetch } = {}) {
  const clientId = process.env.GITHUB_COPILOT_CLIENT_ID;
  if (!clientId) {
    throw new Error(COPILOT_SETUP_HINT);
  }

  const response = await fetchImpl('https://github.com/login/device/code', {
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
    verificationUri: data.verification_uri || data.verification_uri_complete || 'https://github.com/login/device',
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
  const clientId = process.env.GITHUB_COPILOT_CLIENT_ID;
  if (!clientId) {
    throw new Error(COPILOT_SETUP_HINT);
  }

  const response = await fetchImpl('https://github.com/login/oauth/access_token', {
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
  const response = await fetchImpl(`${normalizeBaseUrl(baseUrl)}/copilot_internal/v2/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + oauthToken,
      'User-Agent': 'AIOS'
    }
  });
  const data = await parseProviderResponse(response);

  if (!response.ok) {
    throw new Error(data?.error?.message || data?.message || 'Failed to exchange GitHub OAuth token for a Copilot token.');
  }

  const accessToken = data?.token || data?.access_token;
  if (!accessToken) {
    throw new Error('Copilot token response did not include a token.');
  }

  const expiresAt = typeof data?.expires_at === 'number'
    ? new Date(data.expires_at * 1000).toISOString()
    : new Date(Date.now() + Number(data?.expires_in || 1500) * 1000).toISOString();
  const chatUrl = data?.chat_completions_url
    || data?.chat_url
    || data?.endpoints?.chat_completions
    || `${normalizeBaseUrl(baseUrl)}/chat/completions`;

  return {
    accessToken,
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
      chatCompletionsUrl: session.copilotChatUrl || `${normalizeBaseUrl(baseUrl)}/chat/completions`
    };
  }

  const refreshed = await exchangeCopilotToken({ oauthToken, baseUrl, fetchImpl });
  await saveSession({
    ...session,
    copilotToken: refreshed.accessToken,
    copilotTokenExpiresAt: refreshed.expiresAt,
    copilotChatUrl: refreshed.chatUrl
  });

  return {
    accessToken: refreshed.accessToken,
    chatCompletionsUrl: refreshed.chatUrl
  };
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
  const response = await fetchImpl(`${normalizeBaseUrl(baseUrl)}/models`, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + chatSession.accessToken,
      'User-Agent': 'AIOS'
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
  getCopilotModels,
  getChatSession,
  getStatus,
  loadSession,
  pollDeviceFlow,
  resolveEnvGitHubToken,
  resolveGitHubOAuthToken,
  saveSession,
  startDeviceFlow
};
