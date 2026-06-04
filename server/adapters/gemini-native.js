const {
  normalizeBaseUrl,
  normalizeTextContent,
  parseProviderResponse
} = require('./utils');

function buildRequest({ messages }) {
  const systemSegments = [];
  const contents = [];

  for (const message of messages) {
    const text = normalizeTextContent(message?.content);
    if (!text) {
      continue;
    }

    if (message.role === 'system') {
      systemSegments.push(text);
      continue;
    }

    contents.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text }]
    });
  }

  return {
    ...(systemSegments.length
      ? {
          systemInstruction: {
            parts: [{ text: systemSegments.join('\n\n') }]
          }
        }
      : {}),
    contents
  };
}

async function sendChat({ provider, model, messages, auth, fetchImpl = fetch }) {
  const baseUrl = normalizeBaseUrl(auth.baseUrl || provider.defaultBaseUrl);
  const response = await fetchImpl(`${baseUrl}/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth.apiKey ? { 'x-goog-api-key': auth.apiKey } : {})
    },
    body: JSON.stringify(buildRequest({ messages }))
  });

  const data = await parseProviderResponse(response);

  if (!response.ok) {
    const message = data?.error?.message || `Gemini request failed with status ${response.status}.`;
    return { ok: false, status: response.status, error: message, raw: data };
  }

  const message = (data?.candidates?.[0]?.content?.parts || [])
    .map((part) => part?.text || '')
    .filter(Boolean)
    .join('\n\n');

  return { ok: true, message, raw: data };
}

module.exports = { buildRequest, sendChat };
