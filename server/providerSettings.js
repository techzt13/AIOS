const { normalizeBaseUrl } = require('./adapters/utils');

const COPILOT_TOKEN_ENV_VARS = ['COPILOT_GITHUB_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN'];

function trimString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getStoredConfig(providerSettings, providerId) {
  const providers = providerSettings?.providers;
  if (!providers || typeof providers !== 'object') {
    return {};
  }

  const stored = providers[providerId];
  return stored && typeof stored === 'object' ? stored : {};
}

function resolveEffectiveBaseUrl({ provider, storedConfig = {}, env = process.env }) {
  return normalizeBaseUrl(
    trimString(storedConfig.baseUrl)
      || trimString(env[provider.baseUrlEnv])
      || provider.defaultBaseUrl
  );
}

function hasStoredCredential(storedConfig, key) {
  return trimString(storedConfig?.[key]).length > 0;
}

function hasEnvCredential(env, key) {
  return key ? trimString(env[key]).length > 0 : false;
}

function hasCopilotEnvToken(env = process.env) {
  return COPILOT_TOKEN_ENV_VARS.some((envKey) => trimString(env[envKey]).length > 0);
}

function isProviderConfigured({ provider, storedConfig = {}, copilotStatus = {}, env = process.env }) {
  if (provider.authMethod === 'none') {
    return true;
  }

  if (provider.authMethod === 'oauth-device') {
    return Boolean(copilotStatus.configured) || hasCopilotEnvToken(env);
  }

  const hasApiKey = hasStoredCredential(storedConfig, 'apiKey') || hasEnvCredential(env, provider.apiKeyEnv);
  const hasApiSecret = provider.apiSecretEnv
    ? hasStoredCredential(storedConfig, 'apiSecret') || hasEnvCredential(env, provider.apiSecretEnv)
    : true;

  if (provider.requiresApiKey === false) {
    return hasApiSecret;
  }

  return hasApiKey && hasApiSecret;
}

function getAuthSource({ provider, storedConfig = {}, copilotStatus = {}, env = process.env }) {
  if (provider.authMethod === 'none') {
    return 'none';
  }

  if (provider.authMethod === 'oauth-device') {
    if (hasCopilotEnvToken(env)) {
      return 'env';
    }

    return copilotStatus.configured ? 'oauth-device' : 'not-configured';
  }

  if (hasStoredCredential(storedConfig, 'apiKey') || hasStoredCredential(storedConfig, 'apiSecret')) {
    return 'settings';
  }

  if (hasEnvCredential(env, provider.apiKeyEnv) || hasEnvCredential(env, provider.apiSecretEnv)) {
    return 'env';
  }

  return 'not-configured';
}

function buildProviderSettingsResponse({ providers, providerSettings, copilotStatus, env = process.env }) {
  return providers.map((provider) => {
    const storedConfig = getStoredConfig(providerSettings, provider.id);
    const effectiveBaseUrl = resolveEffectiveBaseUrl({ provider, storedConfig, env });

    return {
      id: provider.id,
      name: provider.name,
      category: provider.category,
      adapterType: provider.adapterType,
      authMethod: provider.authMethod,
      requiresApiKey: provider.requiresApiKey,
      allowUserApiKey: Boolean(provider.allowUserApiKey),
      allowUserBaseUrl: Boolean(provider.allowUserBaseUrl),
      apiKeyEnv: provider.apiKeyEnv,
      apiSecretEnv: provider.apiSecretEnv,
      baseUrlEnv: provider.baseUrlEnv,
      models: provider.models,
      configured: isProviderConfigured({ provider, storedConfig, copilotStatus, env }),
      effectiveBaseUrl,
      authSource: getAuthSource({ provider, storedConfig, copilotStatus, env }),
      hasStoredApiKey: hasStoredCredential(storedConfig, 'apiKey'),
      hasStoredApiSecret: hasStoredCredential(storedConfig, 'apiSecret'),
      hasStoredBaseUrl: hasStoredCredential(storedConfig, 'baseUrl')
    };
  });
}

module.exports = {
  buildProviderSettingsResponse,
  getStoredConfig,
  isProviderConfigured,
  resolveEffectiveBaseUrl,
  trimString
};
