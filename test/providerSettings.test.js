const test = require('node:test');
const assert = require('node:assert/strict');

const { providerCatalog } = require('../server/providers');
const { buildProviderSettingsResponse } = require('../server/providerSettings');

test('provider settings response is safe and does not expose secrets', () => {
  const providers = buildProviderSettingsResponse({
    providers: providerCatalog,
    providerSettings: {
      providers: {
        openai: {
          apiKey: 'stored-secret-key',
          baseUrl: 'https://stored.openai/v1'
        }
      }
    },
    copilotStatus: { configured: false },
    env: {}
  });

  const openai = providers.find((provider) => provider.id === 'openai');
  assert.equal(openai.configured, true);
  assert.equal(openai.hasStoredApiKey, true);
  assert.equal(openai.effectiveBaseUrl, 'https://stored.openai/v1');
  assert.equal('apiKey' in openai, false);
  assert.equal(JSON.stringify(openai).includes('stored-secret-key'), false);
});

test('provider settings response keeps github copilot configured status', () => {
  const providers = buildProviderSettingsResponse({
    providers: providerCatalog,
    providerSettings: { providers: {} },
    copilotStatus: { configured: true, login: 'techzt13' },
    env: {}
  });

  const copilot = providers.find((provider) => provider.id === 'github-copilot');
  assert.equal(copilot.configured, true);
});
