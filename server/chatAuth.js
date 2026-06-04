const { normalizeBaseUrl } = require('./adapters/utils');
const { getStoredConfig, trimString } = require('./providerSettings');

async function resolveProviderAuth({
  provider,
  providerSettings,
  getGitHubCopilotChatSession,
  env = process.env
}) {
  const storedConfig = getStoredConfig(providerSettings, provider.id);
  const baseUrl = normalizeBaseUrl(
    trimString(storedConfig.baseUrl)
      || trimString(env[provider.baseUrlEnv])
      || provider.defaultBaseUrl
  );

  if (!baseUrl) {
    return {
      ok: false,
      error: `Missing base URL for ${provider.name}. Set ${provider.baseUrlEnv} in provider settings or .env.`
    };
  }

  if (provider.authMethod === 'none') {
    return { ok: true, auth: { baseUrl } };
  }

  if (provider.authMethod === 'oauth-device') {
    try {
      const session = await getGitHubCopilotChatSession({ baseUrl });
      return {
        ok: true,
        auth: {
          baseUrl,
          accessToken: session.accessToken,
          chatCompletionsUrl: session.chatCompletionsUrl
        }
      };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  const apiKey = trimString(storedConfig.apiKey) || trimString(env[provider.apiKeyEnv]);
  const apiSecret = provider.apiSecretEnv
    ? trimString(storedConfig.apiSecret) || trimString(env[provider.apiSecretEnv])
    : '';

  if (provider.requiresApiKey !== false && !apiKey) {
    return {
      ok: false,
      error: `Missing API key for ${provider.name}. Configure ${provider.apiKeyEnv} in provider settings or .env.`
    };
  }

  if (provider.apiSecretEnv && !apiSecret) {
    return {
      ok: false,
      error: `Missing secret for ${provider.name}. Configure ${provider.apiSecretEnv} in provider settings or .env.`
    };
  }

  return { ok: true, auth: { baseUrl, apiKey, apiSecret } };
}

module.exports = { resolveProviderAuth };
