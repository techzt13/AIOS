function normalizeBaseUrl(baseUrl) {
  let normalized = String(baseUrl || '').trim();

  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

async function parseProviderResponse(response) {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { error: { message: rawText } };
  }
}

function normalizeTextContent(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item && typeof item.text === 'string') {
          return item.text;
        }

        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  if (content && typeof content.text === 'string') {
    return content.text;
  }

  if (content == null) {
    return '';
  }

  return String(content);
}

function toTextBlocks(content) {
  const text = normalizeTextContent(content);
  return text ? [{ type: 'text', text }] : [];
}

function joinTextBlocks(blocks) {
  return (Array.isArray(blocks) ? blocks : [])
    .filter((block) => block && block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n\n');
}

module.exports = {
  joinTextBlocks,
  normalizeBaseUrl,
  normalizeTextContent,
  parseProviderResponse,
  toTextBlocks
};
