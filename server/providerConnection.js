const { resolveProviderAuth } = require('./chatAuth');

async function testProviderConnection({
  provider,
  model,
  providerSettings,
  dispatchChat,
  getGitHubCopilotChatSession
}) {
  const authResult = await resolveProviderAuth({
    provider,
    providerSettings,
    getGitHubCopilotChatSession
  });

  if (!authResult.ok) {
    return { ok: false, status: 400, error: authResult.error };
  }

  const selectedModel = typeof model === 'string' && model.trim()
    ? model.trim()
    : provider.models?.[0];

  if (!selectedModel) {
    return {
      ok: false,
      status: 400,
      error: `No model is available for ${provider.name}.`
    };
  }

  const result = await dispatchChat({
    provider,
    model: selectedModel,
    auth: authResult.auth,
    messages: [
      {
        role: 'system',
        content: 'You are running a connection check for AIOS. Reply briefly.'
      },
      {
        role: 'user',
        content: 'Reply with a short confirmation that the AIOS provider connection is working.'
      }
    ]
  });

  if (!result.ok) {
    return {
      ok: false,
      status: result.status || 502,
      error: result.error || `Unable to reach ${provider.name}.`,
      provider: provider.id,
      model: selectedModel,
      raw: result.raw
    };
  }

  return {
    ok: true,
    provider: provider.id,
    model: selectedModel,
    message: result.message || `${provider.name} connection verified.`,
    raw: result.raw
  };
}

module.exports = { testProviderConnection };
