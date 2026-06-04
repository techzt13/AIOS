const fs = require('fs/promises');
const path = require('path');
const { getConfigDir } = require('./configDir');

const PROVIDER_SETTINGS_FILE = 'providers.json';

function getProviderSettingsPath() {
  return path.join(getConfigDir(), PROVIDER_SETTINGS_FILE);
}

async function ensureConfigDir() {
  const configDir = getConfigDir();
  await fs.mkdir(configDir, { recursive: true, mode: 0o700 });

  try {
    await fs.chmod(configDir, 0o700);
  } catch {
    // Best effort. Some filesystems may not support chmod.
  }
}

function sanitizeSettingsShape(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { providers: {} };
  }

  const providers = parsed.providers;
  if (!providers || typeof providers !== 'object' || Array.isArray(providers)) {
    return { providers: {} };
  }

  return { providers };
}

async function loadProviderSettings() {
  try {
    const raw = await fs.readFile(getProviderSettingsPath(), 'utf8');
    return sanitizeSettingsShape(JSON.parse(raw));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { providers: {} };
    }

    throw error;
  }
}

async function saveProviderSettings(settings) {
  await ensureConfigDir();
  const filePath = getProviderSettingsPath();
  await fs.writeFile(filePath, JSON.stringify(sanitizeSettingsShape(settings), null, 2), {
    mode: 0o600
  });

  try {
    await fs.chmod(filePath, 0o600);
  } catch {
    // Best effort. Some filesystems may not support chmod.
  }
}

function normalizeStoredValue(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

async function upsertProviderSettings(providerId, values = {}) {
  const settings = await loadProviderSettings();
  const current = settings.providers[providerId] && typeof settings.providers[providerId] === 'object'
    ? settings.providers[providerId]
    : {};

  const next = {
    ...current,
    ...(Object.prototype.hasOwnProperty.call(values, 'apiKey') ? { apiKey: normalizeStoredValue(values.apiKey) } : {}),
    ...(Object.prototype.hasOwnProperty.call(values, 'apiSecret') ? { apiSecret: normalizeStoredValue(values.apiSecret) } : {}),
    ...(Object.prototype.hasOwnProperty.call(values, 'baseUrl') ? { baseUrl: normalizeStoredValue(values.baseUrl) } : {})
  };

  const compact = Object.fromEntries(Object.entries(next).filter(([, value]) => value));

  if (Object.keys(compact).length > 0) {
    settings.providers[providerId] = compact;
  } else {
    delete settings.providers[providerId];
  }

  await saveProviderSettings(settings);
  return settings;
}

async function clearProviderSettings(providerId) {
  const settings = await loadProviderSettings();
  delete settings.providers[providerId];
  await saveProviderSettings(settings);
  return settings;
}

module.exports = {
  PROVIDER_SETTINGS_FILE,
  clearProviderSettings,
  ensureConfigDir,
  getProviderSettingsPath,
  loadProviderSettings,
  saveProviderSettings,
  upsertProviderSettings
};
