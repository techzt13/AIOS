const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const store = require('../server/providerSettingsStore');

test('provider settings store persists and clears provider config', async () => {
  const originalConfigDir = process.env.AIOS_CONFIG_DIR;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aios-provider-settings-'));
  process.env.AIOS_CONFIG_DIR = tempDir;

  try {
    const settingsPath = store.getProviderSettingsPath();
    assert.equal(settingsPath.startsWith(tempDir), true);

    await store.upsertProviderSettings('openai', {
      apiKey: 'stored-openai-key',
      baseUrl: 'https://stored.openai/v1'
    });

    let settings = await store.loadProviderSettings();
    assert.equal(settings.providers.openai.apiKey, 'stored-openai-key');
    assert.equal(settings.providers.openai.baseUrl, 'https://stored.openai/v1');

    await store.clearProviderSettings('openai');
    settings = await store.loadProviderSettings();
    assert.equal(Boolean(settings.providers.openai), false);
  } finally {
    if (originalConfigDir === undefined) {
      delete process.env.AIOS_CONFIG_DIR;
    } else {
      process.env.AIOS_CONFIG_DIR = originalConfigDir;
    }
  }
});
