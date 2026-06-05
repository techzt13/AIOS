const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const store = require('../server/firstRunStore');

test('first-run store persists and resets setup completion state', async () => {
  const originalConfigDir = process.env.AIOS_CONFIG_DIR;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aios-first-run-'));
  process.env.AIOS_CONFIG_DIR = tempDir;

  try {
    const statePath = store.getFirstRunStatePath();
    assert.equal(statePath.startsWith(tempDir), true);

    let state = await store.loadFirstRunState();
    assert.equal(state.firstRunCompleted, false);

    await store.setFirstRunCompleted(true);
    state = await store.loadFirstRunState();
    assert.equal(state.firstRunCompleted, true);

    await store.setFirstRunCompleted(false);
    state = await store.loadFirstRunState();
    assert.equal(state.firstRunCompleted, false);
  } finally {
    if (originalConfigDir === undefined) {
      delete process.env.AIOS_CONFIG_DIR;
    } else {
      process.env.AIOS_CONFIG_DIR = originalConfigDir;
    }
  }
});
