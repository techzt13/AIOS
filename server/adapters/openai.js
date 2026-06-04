const { normalizeBaseUrl, parseProviderResponse } = require('./utils');

function buildRequest({ model, messages }) {
  return {
    model,
    messages,
    stream: false
  };
}

function buildHeaders({ provider, apiKey }) {
  return {
    'Content-Type': 'application/json',
    ...(apiKey ? { Authorization: 'Bearer ' + apiKey } : {}),
    ...(provider.id === 'openrouter'
      ? {
          'HTTP-Referer': process.env.OPENROUTER_REFERER || 'http://localhost:8080',
          'X-Title': process.env.OPENROUTER_TITLE || 'AIOS'
        }
      : {})
  };
}

async function sendChat({ provider, model, messages, auth, fetchImpl = fetch }) {
  const baseUrl = normalizeBaseUrl(auth.baseUrl || provider.defaultBaseUrl);
  const response = await fetchImpl(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: buildHeaders({ provider, apiKey: auth.apiKey }),
    body: JSON.stringify(buildRequest({ model, messages }))
  });

  const data = await parseProviderResponse(response);

  if (!response.ok) {
    const message = data?.error?.message || `Provider request failed with status ${response.status}.`;
    return { ok: false, status: response.status, error: message, raw: data };
  }

  return {
    ok: true,
    message: data?.choices?.[0]?.message?.content || '',
    raw: data
  };
}

module.exports = { buildHeaders, buildRequest, sendChat };
