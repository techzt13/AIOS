const crypto = require('crypto');
const { normalizeBaseUrl, parseProviderResponse } = require('./utils');

function normalizeCopilotApiModel(model) {
  return String(model || '').trim().replace(/^github-copilot\//, '');
}

function buildRequest({ model, messages }) {
  return {
    model: normalizeCopilotApiModel(model),
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
    'Copilot-Integration-Id': process.env.AIOS_COPILOT_INTEGRATION_ID || 'vscode-chat',
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
  const apiModel = normalizeCopilotApiModel(model);
  const response = await fetchImpl(resolveChatUrl({ provider, auth }), {
    method: 'POST',
    headers: buildHeaders({ accessToken: auth.accessToken }),
    body: JSON.stringify(buildRequest({ model: apiModel, messages }))
  });

  const data = await parseProviderResponse(response);

  if (!response.ok) {
    const providerMessage = data?.error?.message || data?.message || '';
    const isUnsupportedChatModel = /not accessible via the \/chat\/completions endpoint|requested model is not supported/i.test(providerMessage);
    const message = isUnsupportedChatModel
      ? `GitHub Copilot model "${model}" is not available through AIOS chat. Pick a model from the refreshed live Copilot model list.`
      : response.status === 404
      ? `GitHub Copilot model "${model}" is unavailable for this account. Pick a model from the live Copilot model list or try github-copilot/gpt-4o.`
      : (providerMessage || `GitHub Copilot request failed with status ${response.status}.`);
    return { ok: false, status: response.status, error: message, raw: data };
  }

  return {
    ok: true,
    message: data?.choices?.[0]?.message?.content || '',
    raw: data
  };
}

module.exports = { buildHeaders, buildRequest, normalizeCopilotApiModel, resolveChatUrl, sendChat };
