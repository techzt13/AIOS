const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

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

test('local data APIs persist shell state and explicit imports in AIOS_DATA_DIR', async () => {
  const originalDataDir = process.env.AIOS_DATA_DIR;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aios-local-data-'));
  process.env.AIOS_DATA_DIR = tempDir;

  try {
    const app = createApp({
      getGitHubCopilotStatus: async () => ({ configured: false, login: null, connectedAt: null })
    });

    await withServer(app, async (baseUrl) => {
      let response = await fetch(`${baseUrl}/api/local-data/shell-state`);
      let payload = await response.json();
      assert.equal(response.ok, true);
      assert.deepEqual(payload.state.preferences, {});

      response = await fetch(`${baseUrl}/api/local-data/shell-state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: {
            preferences: { accent: 'violet', wallpaper: 'dusk' },
            windows: { chat: { open: true, top: 50, left: 20 } }
          }
        })
      });
      payload = await response.json();
      assert.equal(response.ok, true);
      assert.equal(payload.state.preferences.accent, 'violet');

      response = await fetch(`${baseUrl}/api/local-data/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: [
            { id: 'note-1', title: 'Ideas', content: 'Ship polished dock' },
            { id: 'note-2', title: 'Bugs', content: 'Fix stutter' }
          ]
        })
      });
      payload = await response.json();
      assert.equal(response.ok, true);
      assert.equal(Array.isArray(payload.notes), true);
      assert.equal(payload.notes.length, 2);

      response = await fetch(`${baseUrl}/api/local-data/notes`);
      payload = await response.json();
      assert.equal(response.ok, true);
      assert.equal(Array.isArray(payload.notes), true);
      assert.equal(payload.notes[0].id, 'note-1');

      response = await fetch(`${baseUrl}/api/local-data/imports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cookies',
          name: 'cookies-export.json',
          payload: [{ domain: 'example.com', name: 'sid' }]
        })
      });
      payload = await response.json();
      assert.equal(response.ok, true);
      assert.equal(payload.import.containsSensitiveData, true);

      response = await fetch(`${baseUrl}/api/local-data/imports`);
      payload = await response.json();
      assert.equal(response.ok, true);
      assert.equal(payload.imports.length, 1);
      assert.equal(payload.imports[0].name, 'cookies-export.json');
    });
  } finally {
    if (originalDataDir === undefined) {
      delete process.env.AIOS_DATA_DIR;
    } else {
      process.env.AIOS_DATA_DIR = originalDataDir;
    }
  }
});

test('provider audit endpoint returns masked key metadata only', async () => {
  const originalDataDir = process.env.AIOS_DATA_DIR;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aios-audit-data-'));
  process.env.AIOS_DATA_DIR = tempDir;

  try {
    const app = createApp({
      loadProviderSettings: async () => ({ providers: {} }),
      getGitHubCopilotStatus: async () => ({ configured: false, login: null, connectedAt: null })
    });

    await withServer(app, async (baseUrl) => {
      const saveResponse = await fetch(`${baseUrl}/api/settings/providers/openai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: 'super-secret-key-value' })
      });
      const savePayload = await saveResponse.json();
      assert.equal(saveResponse.ok, true);
      assert.equal(savePayload.ok, true);

      const auditResponse = await fetch(`${baseUrl}/api/settings/provider-audit`);
      const auditPayload = await auditResponse.json();
      assert.equal(auditResponse.ok, true);
      assert.equal(auditPayload.ok, true);
      assert.equal(Array.isArray(auditPayload.events), true);
      assert.equal(auditPayload.events.length > 0, true);
      assert.equal(JSON.stringify(auditPayload).includes('super-secret-key-value'), false);
      assert.equal(typeof auditPayload.events[0].maskedKey?.fingerprint, 'string');
      assert.equal(auditPayload.events[0].maskedKey.last4, 'alue');
    });
  } finally {
    if (originalDataDir === undefined) {
      delete process.env.AIOS_DATA_DIR;
    } else {
      process.env.AIOS_DATA_DIR = originalDataDir;
    }
  }
});

test('third-party app APIs persist safe web app launchers locally', async () => {
  const originalDataDir = process.env.AIOS_DATA_DIR;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aios-app-data-'));
  process.env.AIOS_DATA_DIR = tempDir;

  try {
    const app = createApp({
      getGitHubCopilotStatus: async () => ({ configured: false, login: null, connectedAt: null })
    });

    await withServer(app, async (baseUrl) => {
      let response = await fetch(`${baseUrl}/api/apps`);
      let payload = await response.json();
      assert.equal(response.ok, true);
      assert.deepEqual(payload.apps, []);

      response = await fetch(`${baseUrl}/api/apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Linear',
          short_name: 'LN',
          url: 'https://linear.app',
          description: 'Project tracker',
          manifestUrl: 'https://linear.app/manifest.webmanifest'
        })
      });
      payload = await response.json();
      assert.equal(response.status, 201);
      assert.equal(payload.ok, true);
      assert.equal(payload.app.name, 'Linear');
      assert.equal(payload.app.url, 'https://linear.app/');
      assert.equal(payload.app.glyph, 'LN');
      assert.equal(payload.app.description, 'Project tracker');
      assert.equal(payload.app.format, 'web-manifest');
      assert.equal(payload.app.manifestUrl, 'https://linear.app/manifest.webmanifest');

      const appId = payload.app.id;
      response = await fetch(`${baseUrl}/api/apps`);
      payload = await response.json();
      assert.equal(response.ok, true);
      assert.equal(payload.apps.length, 1);
      assert.equal(payload.apps[0].id, appId);

      response = await fetch(`${baseUrl}/api/apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Bad',
          url: 'javascript:alert(1)'
        })
      });
      payload = await response.json();
      assert.equal(response.status, 400);
      assert.equal(payload.ok, false);

      response = await fetch(`${baseUrl}/api/apps/${encodeURIComponent(appId)}`, { method: 'DELETE' });
      payload = await response.json();
      assert.equal(response.ok, true);
      assert.equal(payload.ok, true);

      response = await fetch(`${baseUrl}/api/apps`);
      payload = await response.json();
      assert.equal(response.ok, true);
      assert.deepEqual(payload.apps, []);
    });
  } finally {
    if (originalDataDir === undefined) {
      delete process.env.AIOS_DATA_DIR;
    } else {
      process.env.AIOS_DATA_DIR = originalDataDir;
    }
  }
});

test('third-party app API can import a standard web app manifest from a site URL', async () => {
  const originalDataDir = process.env.AIOS_DATA_DIR;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aios-pwa-data-'));
  process.env.AIOS_DATA_DIR = tempDir;

  const responses = new Map([
    ['https://example.test/', {
      ok: true,
      status: 200,
      headers: new Map(),
      body: '<html><head><link rel="manifest" href="/manifest.webmanifest"></head></html>'
    }],
    ['https://example.test/manifest.webmanifest', {
      ok: true,
      status: 200,
      headers: new Map([['content-length', '120']]),
      body: JSON.stringify({
        name: 'Example PWA',
        short_name: 'EX',
        start_url: '/app',
        description: 'Imported from a standard Web App Manifest'
      })
    }]
  ]);

  try {
    const app = createApp({
      getGitHubCopilotStatus: async () => ({ configured: false, login: null, connectedAt: null }),
      fetch: async (url) => {
        const fixture = responses.get(url);
        assert.ok(fixture, `unexpected fetch ${url}`);
        return {
          ok: fixture.ok,
          status: fixture.status,
          headers: {
            get: (key) => fixture.headers.get(key.toLowerCase()) || null
          },
          text: async () => fixture.body
        };
      }
    });

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/apps/import-web-manifest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.test/' })
      });
      const payload = await response.json();
      assert.equal(response.status, 201);
      assert.equal(payload.ok, true);
      assert.equal(payload.app.name, 'Example PWA');
      assert.equal(payload.app.url, 'https://example.test/app');
      assert.equal(payload.app.glyph, 'EX');
      assert.equal(payload.app.format, 'web-manifest');
      assert.equal(payload.manifestUrl, 'https://example.test/manifest.webmanifest');
    });
  } finally {
    if (originalDataDir === undefined) {
      delete process.env.AIOS_DATA_DIR;
    } else {
      process.env.AIOS_DATA_DIR = originalDataDir;
    }
  }
});
