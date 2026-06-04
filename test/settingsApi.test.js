const test = require('node:test');
const assert = require('node:assert/strict');

const { createApp } = require('../server/index');

async function withServer(app, run) {
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, () => resolve(listener));
  });

  try {
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

test('settings API does not return raw provider secrets', async () => {
  const app = createApp({
    loadProviderSettings: async () => ({
      providers: {
        openai: {
          apiKey: 'stored-secret-key',
          baseUrl: 'https://stored.openai/v1'
        }
      }
    }),
    getGitHubCopilotStatus: async () => ({ configured: false, login: null, connectedAt: null })
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/settings/providers`);
    const payload = await response.json();

    assert.equal(response.ok, true);
    assert.equal(payload.ok, true);
    assert.equal(JSON.stringify(payload).includes('stored-secret-key'), false);
  });
});

test('/api/chat uses persisted provider settings before env fallback', async () => {
  const originalApiKey = process.env.OPENAI_API_KEY;
  const originalBaseUrl = process.env.OPENAI_BASE_URL;
  process.env.OPENAI_API_KEY = 'env-key';
  process.env.OPENAI_BASE_URL = 'https://env.openai/v1';

  let receivedAuth = null;
  const app = createApp({
    loadProviderSettings: async () => ({
      providers: {
        openai: {
          apiKey: 'stored-key',
          baseUrl: 'https://stored.openai/v1'
        }
      }
    }),
    dispatchChat: async ({ auth }) => {
      receivedAuth = auth;
      return { ok: true, message: 'ok', raw: { ok: true } };
    }
  });

  try {
    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'openai',
          model: 'gpt-4o',
          messages: [{ role: 'user', content: 'hello' }]
        })
      });
      const payload = await response.json();

      assert.equal(response.ok, true);
      assert.equal(payload.ok, true);
      assert.equal(receivedAuth.apiKey, 'stored-key');
      assert.equal(receivedAuth.baseUrl, 'https://stored.openai/v1');
    });
  } finally {
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalApiKey;
    }

    if (originalBaseUrl === undefined) {
      delete process.env.OPENAI_BASE_URL;
    } else {
      process.env.OPENAI_BASE_URL = originalBaseUrl;
    }
  }
});
