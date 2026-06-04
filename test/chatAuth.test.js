const test = require('node:test');
const assert = require('node:assert/strict');

const { getProviderById } = require('../server/providers');
const { resolveProviderAuth } = require('../server/chatAuth');

test('chat auth prefers persisted provider settings over env values', async () => {
  const provider = getProviderById('openai');

  const result = await resolveProviderAuth({
    provider,
    providerSettings: {
      providers: {
        openai: {
          apiKey: 'stored-key',
          baseUrl: 'https://stored.openai/v1'
        }
      }
    },
    getGitHubCopilotChatSession: async () => ({ accessToken: 'unused' }),
    env: {
      OPENAI_API_KEY: 'env-key',
      OPENAI_BASE_URL: 'https://env.openai/v1'
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.auth.apiKey, 'stored-key');
  assert.equal(result.auth.baseUrl, 'https://stored.openai/v1');
});

test('chat auth falls back to env when persisted settings are missing', async () => {
  const provider = getProviderById('openai');

  const result = await resolveProviderAuth({
    provider,
    providerSettings: { providers: {} },
    getGitHubCopilotChatSession: async () => ({ accessToken: 'unused' }),
    env: {
      OPENAI_API_KEY: 'env-key',
      OPENAI_BASE_URL: 'https://env.openai/v1'
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.auth.apiKey, 'env-key');
  assert.equal(result.auth.baseUrl, 'https://env.openai/v1');
});

test('custom openai provider allows no-key mode when configured that way', async () => {
  const provider = getProviderById('custom-openai');

  const result = await resolveProviderAuth({
    provider,
    providerSettings: {
      providers: {
        'custom-openai': {
          baseUrl: 'https://custom.gateway/v1'
        }
      }
    },
    getGitHubCopilotChatSession: async () => ({ accessToken: 'unused' }),
    env: {}
  });

  assert.equal(result.ok, true);
  assert.equal(result.auth.apiKey, '');
  assert.equal(result.auth.baseUrl, 'https://custom.gateway/v1');
});
