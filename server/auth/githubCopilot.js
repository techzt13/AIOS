const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { normalizeBaseUrl, parseProviderResponse } = require('../adapters/utils');

const CONFIG_DIR = process.env.AIOS_CONFIG_DIR || path.join(os.homedir(), '.config', 'aios');
const TOKEN_PATH = path.join(CONFIG_DIR, 'github-copilot.json');
const DEFAULT_DEVICE_SCOPE = process.env.GITHUB_COPILOT_OAUTH_SCOPE || 'read:user copilot';
// GitHub Copilot device-login support in AIOS is opt-in and uses undocumented/private
// Copilot token exchange behavior. It may break if GitHub changes their APIs, and each
// user remains responsible for making sure their Copilot plan allows this usage.

async function ensureConfigDir() {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
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
  return {
    configured: Boolean(session.oauthToken),
    login: session.login || null,
    connectedAt: session.connectedAt || null
  };
}

async function getStatus() {
  return getSafeStatus(await loadSession());
}

async function startDeviceFlow({ fetchImpl = fetch } = {}) {
  const clientId = process.env.GITHUB_COPILOT_CLIENT_ID;
  if (!clientId) {
    throw new Error('Missing GITHUB_COPILOT_CLIENT_ID. Configure your GitHub OAuth app with device flow enabled.');
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
    throw new Error('Missing GITHUB_COPILOT_CLIENT_ID. Configure your GitHub OAuth app with device flow enabled.');
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
  if (!session.oauthToken) {
    throw new Error('GitHub Copilot is not connected yet. Use “Sign in with GitHub” in AIOS first.');
  }

  const expiresAt = session.copilotTokenExpiresAt ? new Date(session.copilotTokenExpiresAt).getTime() : 0;
  if (session.copilotToken && expiresAt > Date.now() + 60_000) {
    return {
      accessToken: session.copilotToken,
      chatCompletionsUrl: session.copilotChatUrl || `${normalizeBaseUrl(baseUrl)}/chat/completions`
    };
  }

  const refreshed = await exchangeCopilotToken({ oauthToken: session.oauthToken, baseUrl, fetchImpl });
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

module.exports = {
  CONFIG_DIR,
  TOKEN_PATH,
  exchangeCopilotToken,
  getChatSession,
  getStatus,
  loadSession,
  pollDeviceFlow,
  saveSession,
  startDeviceFlow
};
