const crypto = require('crypto');
const { normalizeBaseUrl, parseProviderResponse } = require('./utils');

function buildRequest({ model, messages }) {
  return {
    model,
    messages,
    stream: false
  };
}

function buildHeaders({ accessToken }) {
  return {
    Accept: 'application/json',
    Authorization: 'Bearer ' + accessToken,
    'Content-Type': 'application/json',
    'editor-plugin-version': process.env.AIOS_EDITOR_PLUGIN_VERSION || 'AIOS/1.0.0',
    'editor-version': process.env.AIOS_EDITOR_VERSION || 'AIOS/1.0.0',
    'user-agent': process.env.AIOS_USER_AGENT || 'AIOS/1.0.0',
    'x-request-id': crypto.randomUUID()
  };
}

function resolveChatUrl({ provider, auth }) {
  if (auth.chatCompletionsUrl) {
    return auth.chatCompletionsUrl;
  }

  const baseUrl = normalizeBaseUrl(auth.baseUrl || provider.defaultBaseUrl);
  return baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;
}

async function sendChat({ provider, model, messages, auth, fetchImpl = fetch }) {
  const response = await fetchImpl(resolveChatUrl({ provider, auth }), {
    method: 'POST',
    headers: buildHeaders({ accessToken: auth.accessToken }),
    body: JSON.stringify(buildRequest({ model, messages }))
  });

  const data = await parseProviderResponse(response);

  if (!response.ok) {
    const message = data?.error?.message || `GitHub Copilot request failed with status ${response.status}.`;
    return { ok: false, status: response.status, error: message, raw: data };
  }

  return {
    ok: true,
    message: data?.choices?.[0]?.message?.content || '',
    raw: data
  };
}

module.exports = { buildHeaders, buildRequest, resolveChatUrl, sendChat };
