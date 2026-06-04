const registry = {
  openai: require('./openai'),
  anthropic: require('./anthropic'),
  'gemini-native': require('./gemini-native'),
  baidu: require('./baidu'),
  'github-copilot': require('./github-copilot')
};

function getAdapter(adapterType) {
  return registry[adapterType];
}

async function dispatchChat({ provider, model, messages, auth, fetchImpl }) {
  const adapter = getAdapter(provider.adapterType);

  if (!adapter) {
    return {
      ok: false,
      error: `No chat adapter is registered for ${provider.name} (${provider.adapterType}).`
    };
  }

  return adapter.sendChat({ provider, model, messages, auth, fetchImpl });
}

module.exports = { dispatchChat, getAdapter, registry };
