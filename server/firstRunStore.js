const fs = require('fs/promises');
const path = require('path');
const { getConfigDir } = require('./configDir');
const { ensureConfigDir } = require('./providerSettingsStore');

const FIRST_RUN_STATE_FILE = 'setup.json';

function getFirstRunStatePath() {
  return path.join(getConfigDir(), FIRST_RUN_STATE_FILE);
}

function sanitizeFirstRunState(parsed) {
  return {
    firstRunCompleted: Boolean(parsed?.firstRunCompleted)
  };
}

async function loadFirstRunState() {
  try {
    const raw = await fs.readFile(getFirstRunStatePath(), 'utf8');
    return sanitizeFirstRunState(JSON.parse(raw));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { firstRunCompleted: false };
    }

    throw error;
  }
}

async function saveFirstRunState(state) {
  await ensureConfigDir();
  const filePath = getFirstRunStatePath();
  await fs.writeFile(filePath, JSON.stringify(sanitizeFirstRunState(state), null, 2), {
    mode: 0o600
  });

  try {
    await fs.chmod(filePath, 0o600);
  } catch {
    // Best effort. Some filesystems may not support chmod.
  }
}

async function setFirstRunCompleted(completed) {
  const state = { firstRunCompleted: Boolean(completed) };
  await saveFirstRunState(state);
  return state;
}

module.exports = {
  FIRST_RUN_STATE_FILE,
  getFirstRunStatePath,
  loadFirstRunState,
  saveFirstRunState,
  sanitizeFirstRunState,
  setFirstRunCompleted
};
