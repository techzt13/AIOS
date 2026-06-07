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
