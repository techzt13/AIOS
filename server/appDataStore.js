const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const DATA_DIR_NAME = '.aios-data';
const SHELL_STATE_FILE = 'shell-state.json';
const IMPORTS_FILE = 'imports.json';
const API_KEY_AUDIT_FILE = 'api-key-audit.json';
const NOTES_FILE = 'notes.json';
const INSTALLED_APPS_FILE = 'installed-apps.json';
const LINUX_APPS_FILE = 'linux-apps.json';
const LINUX_PACKAGES_DIR = 'linux-packages';
const LINUX_PACKAGE_MIN_BYTES = 1024;

function getDataDir() {
  return path.resolve(process.env.AIOS_DATA_DIR || path.join(process.cwd(), 'workspace', DATA_DIR_NAME));
}

function getShellStatePath() {
  return path.join(getDataDir(), SHELL_STATE_FILE);
}

function getImportsPath() {
  return path.join(getDataDir(), IMPORTS_FILE);
}

function getApiKeyAuditPath() {
  return path.join(getDataDir(), API_KEY_AUDIT_FILE);
}

function getNotesPath() {
  return path.join(getDataDir(), NOTES_FILE);
}

function getInstalledAppsPath() {
  return path.join(getDataDir(), INSTALLED_APPS_FILE);
}

function getLinuxAppsPath() {
  return path.join(getDataDir(), LINUX_APPS_FILE);
}

function getLinuxPackagesDir() {
  return path.join(getDataDir(), LINUX_PACKAGES_DIR);
}

async function ensureDataDir() {
  const dataDir = getDataDir();
  await fs.mkdir(dataDir, { recursive: true, mode: 0o700 });
  try {
    await fs.chmod(dataDir, 0o700);
  } catch {
    // Best effort.
  }
}

async function readJson(filePath, fallbackValue) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallbackValue;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return fallbackValue;
    }
    throw error;
  }
}

async function writeJson(filePath, value) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), { mode: 0o600 });
  try {
    await fs.chmod(filePath, 0o600);
  } catch {
    // Best effort.
  }
}

async function ensureLinuxPackagesDir() {
  await ensureDataDir();
  const packagesDir = getLinuxPackagesDir();
  await fs.mkdir(packagesDir, { recursive: true, mode: 0o700 });
  try {
    await fs.chmod(packagesDir, 0o700);
  } catch {
    // Best effort.
  }
}

function sanitizeShellState(value) {
  const state = value && typeof value === 'object' ? value : {};
  return {
    windows: state.windows && typeof state.windows === 'object' ? state.windows : {},
    preferences: state.preferences && typeof state.preferences === 'object' ? state.preferences : {}
  };
}

async function loadShellState() {
  const parsed = await readJson(getShellStatePath(), { windows: {}, preferences: {} });
  return sanitizeShellState(parsed);
}

async function saveShellState(nextState) {
  const sanitized = sanitizeShellState(nextState);
  await writeJson(getShellStatePath(), sanitized);
  return sanitized;
}

async function loadImportsStore() {
  const parsed = await readJson(getImportsPath(), { items: [] });
  return {
    items: Array.isArray(parsed.items) ? parsed.items : []
  };
}

function summarizeImportedPayload(payload) {
  if (Array.isArray(payload)) {
    return { recordCount: payload.length };
  }

  if (payload && typeof payload === 'object') {
    return { recordCount: Object.keys(payload).length };
  }

  return { recordCount: payload == null ? 0 : 1 };
}

async function appendImportRecord({ type, name, payload, containsSensitiveData = false }) {
  const store = await loadImportsStore();
  const summary = summarizeImportedPayload(payload);
  const item = {
    id: crypto.randomUUID(),
    importedAt: new Date().toISOString(),
    type,
    name,
    containsSensitiveData: Boolean(containsSensitiveData),
    ...summary,
    payload
  };

  store.items.unshift(item);
  await writeJson(getImportsPath(), store);
  return item;
}

function listImportSummaries(store) {
  return store.items.map((item) => ({
    id: item.id,
    importedAt: item.importedAt,
    type: item.type,
    name: item.name,
    containsSensitiveData: Boolean(item.containsSensitiveData),
    recordCount: Number(item.recordCount) || 0
  }));
}

async function listImports() {
  const store = await loadImportsStore();
  return listImportSummaries(store);
}

function maskSecret(secret) {
  if (typeof secret !== 'string') {
    return null;
  }

  const trimmed = secret.trim();
  if (!trimmed) {
    return null;
  }

  const digest = trimmed.split('').reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 7)
    .toString(16)
    .padStart(8, '0');
  return {
    last4: trimmed.slice(-4),
    fingerprint: `chk:${digest}`
  };
}

async function loadApiKeyAuditStore() {
  const parsed = await readJson(getApiKeyAuditPath(), { events: [] });
  return {
    events: Array.isArray(parsed.events) ? parsed.events : []
  };
}

async function appendApiKeyAuditEvent({ providerId, action, maskedKey = null }) {
  const store = await loadApiKeyAuditStore();
  const event = {
    timestamp: new Date().toISOString(),
    providerId,
    action,
    maskedKey: maskedKey || null
  };
  store.events.unshift(event);
  await writeJson(getApiKeyAuditPath(), store);
  return event;
}

async function loadApiKeyAuditEvents() {
  const store = await loadApiKeyAuditStore();
  return store.events;
}

function sanitizeNoteText(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.slice(0, maxLength);
  return trimmed;
}

function normalizeNote(note) {
  if (!note || typeof note !== 'object') {
    return null;
  }
  const id = typeof note.id === 'string' && note.id.trim() ? note.id : crypto.randomUUID();
  return {
    id,
    title: sanitizeNoteText(note.title, 200),
    content: sanitizeNoteText(note.content, 100000),
    createdAt: typeof note.createdAt === 'string' ? note.createdAt : new Date().toISOString(),
    updatedAt: typeof note.updatedAt === 'string' ? note.updatedAt : new Date().toISOString()
  };
}

async function loadNotes() {
  const parsed = await readJson(getNotesPath(), { notes: [] });
  const notes = Array.isArray(parsed.notes) ? parsed.notes.map(normalizeNote).filter(Boolean) : [];
  return { notes };
}

async function saveNotes(nextNotes) {
  const notes = Array.isArray(nextNotes) ? nextNotes.map(normalizeNote).filter(Boolean) : [];
  await writeJson(getNotesPath(), { notes });
  return { notes };
}

function sanitizeAppName(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, 80);
}

function normalizeAppGlyph(value, name) {
  const glyph = typeof value === 'string' ? value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
  if (glyph) {
    return glyph.slice(0, 3);
  }

  return sanitizeAppName(name).slice(0, 2).toUpperCase() || 'APP';
}

function sanitizeAppDescription(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, 240);
}

function sanitizeAppVersion(value) {
  if (typeof value !== 'string') {
    return '1.0.0';
  }

  const version = value.trim().slice(0, 40);
  return version || '1.0.0';
}

function normalizeAppUrl(value) {
  if (typeof value !== 'string') {
    throw new Error('App URL is required.');
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('App URL is required.');
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error('App URL must be a valid http:// or https:// URL.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('App URL must use http:// or https://.');
  }

  url.hash = url.hash.slice(0, 512);
  return url.toString().slice(0, 2048);
}

function normalizeInstalledApp(app) {
  if (!app || typeof app !== 'object') {
    return null;
  }

  const name = sanitizeAppName(app.name || app.short_name);
  if (!name) {
    return null;
  }

  let url;
  try {
    url = normalizeAppUrl(app.url || app.start_url || app.startUrl);
  } catch {
    return null;
  }

  let manifestUrl = '';
  if (typeof app.manifestUrl === 'string' && app.manifestUrl.trim()) {
    try {
      manifestUrl = normalizeAppUrl(app.manifestUrl);
    } catch {
      manifestUrl = '';
    }
  }

  const timestamp = new Date().toISOString();
  return {
    id: typeof app.id === 'string' && app.id.trim() ? app.id : crypto.randomUUID(),
    name,
    url,
    glyph: normalizeAppGlyph(app.glyph || app.short_name, name),
    description: sanitizeAppDescription(app.description),
    version: sanitizeAppVersion(app.version),
    format: 'web-manifest',
    manifestUrl,
    installedAt: typeof app.installedAt === 'string' ? app.installedAt : timestamp,
    updatedAt: typeof app.updatedAt === 'string' ? app.updatedAt : timestamp
  };
}

async function loadInstalledAppsStore() {
  const parsed = await readJson(getInstalledAppsPath(), { apps: [] });
  return {
    apps: Array.isArray(parsed.apps) ? parsed.apps.map(normalizeInstalledApp).filter(Boolean) : []
  };
}

async function listInstalledApps() {
  const store = await loadInstalledAppsStore();
  return store.apps;
}

async function installApp({ name, short_name, url, start_url, startUrl, glyph, description, version, manifestUrl }) {
  const app = normalizeInstalledApp({
    name,
    short_name,
    url,
    start_url,
    startUrl,
    glyph,
    description,
    version,
    manifestUrl
  });
  if (!app) {
    throw new Error('A valid app name and URL are required.');
  }

  const store = await loadInstalledAppsStore();
  const existingIndex = store.apps.findIndex((item) => item.url === app.url || item.name.toLowerCase() === app.name.toLowerCase());
  if (existingIndex >= 0) {
    app.id = store.apps[existingIndex].id;
    app.installedAt = store.apps[existingIndex].installedAt;
    store.apps.splice(existingIndex, 1);
  }

  app.updatedAt = new Date().toISOString();
  store.apps.unshift(app);
  await writeJson(getInstalledAppsPath(), store);
  return app;
}

async function removeInstalledApp(appId) {
  const id = typeof appId === 'string' ? appId.trim() : '';
  if (!id) {
    throw new Error('App id is required.');
  }

  const store = await loadInstalledAppsStore();
  const nextApps = store.apps.filter((app) => app.id !== id);
  if (nextApps.length === store.apps.length) {
    return null;
  }

  await writeJson(getInstalledAppsPath(), { apps: nextApps });
  return { id };
}

function sanitizePackageFilename(value) {
  const filename = path.basename(typeof value === 'string' ? value.trim() : '');
  return filename.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 160);
}

function linuxPackageType(filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.tar.gz')) return 'tar.gz';
  if (lower.endsWith('.tgz')) return 'tgz';
  if (lower.endsWith('.tar')) return 'tar';
  return '';
}

function assertLinuxPackageBuffer({ filename, buffer }) {
  const packageType = linuxPackageType(filename);
  if (!packageType) {
    throw new Error('Linux package must be a .tar.gz, .tgz, or .tar archive.');
  }

  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('Linux package file is empty.');
  }

  if (buffer.length < LINUX_PACKAGE_MIN_BYTES) {
    throw new Error('Linux package archive is too small to be valid.');
  }

  if ((packageType === 'tar.gz' || packageType === 'tgz') && (buffer[0] !== 0x1f || buffer[1] !== 0x8b)) {
    throw new Error('Linux package does not look like a gzip archive.');
  }

  return packageType;
}

function sanitizeLinuxPackageName(value, filename) {
  const explicitName = sanitizeAppName(value);
  if (explicitName) {
    return explicitName;
  }

  return sanitizePackageFilename(filename)
    .replace(/\.tar\.gz$/i, '')
    .replace(/\.tgz$/i, '')
    .replace(/\.tar$/i, '')
    .slice(0, 80) || 'Linux package';
}

async function loadLinuxAppsStore() {
  const parsed = await readJson(getLinuxAppsPath(), { packages: [] });
  return {
    packages: Array.isArray(parsed.packages) ? parsed.packages.filter((item) => item && typeof item === 'object') : []
  };
}

async function listLinuxPackages() {
  const store = await loadLinuxAppsStore();
  return store.packages.map((item) => ({
    id: item.id,
    name: item.name,
    filename: item.filename,
    packageType: item.packageType,
    sizeBytes: Number(item.sizeBytes) || 0,
    status: item.status || 'stored-for-linux-runtime',
    installedAt: item.installedAt,
    updatedAt: item.updatedAt
  }));
}

async function installLinuxPackage({ name, filename, buffer }) {
  const safeFilename = sanitizePackageFilename(filename);
  const packageType = assertLinuxPackageBuffer({ filename: safeFilename, buffer });
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const storedFilename = `${id}.${packageType === 'tar.gz' ? 'tar.gz' : packageType}`;

  await ensureLinuxPackagesDir();
  await fs.writeFile(path.join(getLinuxPackagesDir(), storedFilename), buffer, { mode: 0o600 });

  const item = {
    id,
    name: sanitizeLinuxPackageName(name, safeFilename),
    filename: safeFilename,
    storedFilename,
    packageType,
    sizeBytes: buffer.length,
    status: 'stored-for-linux-runtime',
    installedAt: timestamp,
    updatedAt: timestamp
  };

  const store = await loadLinuxAppsStore();
  store.packages.unshift(item);
  await writeJson(getLinuxAppsPath(), store);
  return {
    id: item.id,
    name: item.name,
    filename: item.filename,
    packageType: item.packageType,
    sizeBytes: item.sizeBytes,
    status: item.status,
    installedAt: item.installedAt,
    updatedAt: item.updatedAt
  };
}

async function removeLinuxPackage(packageId) {
  const id = typeof packageId === 'string' ? packageId.trim() : '';
  if (!id) {
    throw new Error('Linux package id is required.');
  }

  const store = await loadLinuxAppsStore();
  const item = store.packages.find((entry) => entry.id === id);
  if (!item) {
    return null;
  }

  store.packages = store.packages.filter((entry) => entry.id !== id);
  await writeJson(getLinuxAppsPath(), store);

  if (item.storedFilename) {
    try {
      await fs.unlink(path.join(getLinuxPackagesDir(), item.storedFilename));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return { id };
}

module.exports = {
  appendApiKeyAuditEvent,
  appendImportRecord,
  ensureDataDir,
  getApiKeyAuditPath,
  getDataDir,
  getInstalledAppsPath,
  getImportsPath,
  getLinuxAppsPath,
  getLinuxPackagesDir,
  getNotesPath,
  getShellStatePath,
  installApp,
  installLinuxPackage,
  listImports,
  listInstalledApps,
  listLinuxPackages,
  loadApiKeyAuditEvents,
  loadNotes,
  loadShellState,
  maskSecret,
  removeInstalledApp,
  removeLinuxPackage,
  saveNotes,
  saveShellState
};
