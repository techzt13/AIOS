const {
  joinTextBlocks,
  normalizeBaseUrl,
  normalizeTextContent,
  parseProviderResponse,
  toTextBlocks
} = require('./utils');

function buildRequest({ model, messages, maxTokens = Number(process.env.ANTHROPIC_MAX_TOKENS || 2048) }) {
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
      content: toTextBlocks(text)
    });
  }

  return {
    model,
    max_tokens: maxTokens,
    ...(systemSegments.length ? { system: systemSegments.join('\n\n') } : {}),
    messages: conversation
  };
}

async function sendChat({ provider, model, messages, auth, fetchImpl = fetch }) {
  const baseUrl = normalizeBaseUrl(auth.baseUrl || provider.defaultBaseUrl);
  const response = await fetchImpl(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': auth.apiKey,
      'anthropic-version': provider.anthropicVersion || process.env.ANTHROPIC_VERSION || '2023-06-01'
    },
    body: JSON.stringify(buildRequest({ model, messages }))
  });

  const data = await parseProviderResponse(response);

  if (!response.ok) {
    const message = data?.error?.message || `Anthropic request failed with status ${response.status}.`;
    return { ok: false, status: response.status, error: message, raw: data };
  }

  return {
    ok: true,
    message: joinTextBlocks(data?.content),
    raw: data
  };
}

module.exports = { buildRequest, sendChat };
