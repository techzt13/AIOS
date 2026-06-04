const {
  normalizeBaseUrl,
  normalizeTextContent,
  parseProviderResponse
} = require('./utils');

function buildRequest({ model, messages }) {
  const systemSegments = [];
  const conversation = [];

  for (const message of messages) {
    const text = normalizeTextContent(message?.content);
    if (!text) {
      continue;
    }

    if (message.role === 'system') {
      systemSegments.push(text);
      continue;
    }

    conversation.push({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: text
    });
  }

  return {
    model,
    ...(systemSegments.length ? { system: systemSegments.join('\n\n') } : {}),
    messages: conversation
  };
}

async function getAccessToken({ apiKey, apiSecret, tokenUrl, fetchImpl = fetch }) {
  const response = await fetchImpl(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret
    }).toString()
  });

  const data = await parseProviderResponse(response);

  if (!response.ok || !data?.access_token) {
    const message = data?.error_description || data?.error?.message || 'Failed to obtain Baidu access token.';
    throw new Error(message);
  }

  return data.access_token;
}

async function sendChat({ provider, model, messages, auth, fetchImpl = fetch }) {
  try {
    const accessToken = await getAccessToken({
      apiKey: auth.apiKey,
      apiSecret: auth.apiSecret,
      tokenUrl: provider.tokenUrl || process.env.BAIDU_TOKEN_URL || 'https://aip.baidubce.com/oauth/2.0/token',
      fetchImpl
    });
    const url = new URL(`${normalizeBaseUrl(auth.baseUrl || provider.defaultBaseUrl)}/chat/completions`);
    url.searchParams.set('access_token', accessToken);

    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequest({ model, messages }))
    });
    const data = await parseProviderResponse(response);

    if (!response.ok) {
      const message = data?.error?.message || data?.error_msg || `Baidu request failed with status ${response.status}.`;
      return { ok: false, status: response.status, error: message, raw: data };
    }

    return {
      ok: true,
      message: data?.result || data?.choices?.[0]?.message?.content || '',
      raw: data
    };
  } catch (error) {
    return {
      ok: false,
      error: `Baidu authentication failed: ${error.message}`,
      raw: { error: { message: error.message } }
    };
  }
}

module.exports = { buildRequest, getAccessToken, sendChat };
