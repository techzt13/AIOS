const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const DATA_DIR_NAME = '.aios-data';
const SHELL_STATE_FILE = 'shell-state.json';
const IMPORTS_FILE = 'imports.json';
const API_KEY_AUDIT_FILE = 'api-key-audit.json';
const NOTES_FILE = 'notes.json';
const CHAT_HISTORY_FILE = 'chat-history.json';
const TRASH_FILE = 'trash.json';
const TRASH_DIR = 'trash';
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

function getChatHistoryPath() {
  return path.join(getDataDir(), CHAT_HISTORY_FILE);
}

function getTrashIndexPath() {
  return path.join(getDataDir(), TRASH_FILE);
}

function getTrashDir() {
  return path.join(getDataDir(), TRASH_DIR);
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

const WALLPAPERS_DIR = 'wallpapers';

function getWallpapersDir() {
  return path.join(getDataDir(), WALLPAPERS_DIR);
}

async function ensureWallpapersDir() {
  await ensureDataDir();
  await fs.mkdir(getWallpapersDir(), { recursive: true, mode: 0o700 });
}

async function saveWallpaper(buffer, originalName) {
  await ensureWallpapersDir();
  const ext = path.extname(originalName || '').toLowerCase() || '.png';
  const safeExt = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'].includes(ext) ? ext : '.png';
  const storedFilename = `${crypto.randomUUID()}${safeExt}`;
  const targetPath = path.join(getWallpapersDir(), storedFilename);
  await fs.writeFile(targetPath, buffer, { mode: 0o600 });
  return { storedFilename, targetPath };
}

async function listWallpapers() {
  await ensureWallpapersDir();
  try {
    const files = await fs.readdir(getWallpapersDir());
    return files.filter((f) => /\.(png|jpe?g|gif|webp|bmp)$/i.test(f));
  } catch {
    return [];
  }
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
    preferences: state.preferences && typeof state.preferences === 'object' ? state.preferences : {},
    browserHistory: Array.isArray(state.browserHistory) ? state.browserHistory : [],
    bookmarks: Array.isArray(state.bookmarks) ? state.bookmarks : [],
    downloads: Array.isArray(state.downloads) ? state.downloads : [],
    browserTabs: Array.isArray(state.browserTabs) ? state.browserTabs : [],
    activeBrowserTab: typeof state.activeBrowserTab === 'string' ? state.activeBrowserTab : null,
    editorTabs: Array.isArray(state.editorTabs) ? state.editorTabs : [],
    activeEditorTab: typeof state.activeEditorTab === 'string' ? state.activeEditorTab : null,
    notifications: Array.isArray(state.notifications) ? state.notifications : [],
    alarms: Array.isArray(state.alarms) ? state.alarms : []
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

const MAX_CONVERSATIONS = 100;
const MAX_CONVERSATION_MESSAGES = 200;

function normalizeConversation(conversation) {
  if (!conversation || typeof conversation !== 'object') return null;
  const id = typeof conversation.id === 'string' && conversation.id.trim()
    ? conversation.id.trim().slice(0, 80)
    : crypto.randomUUID();
  const messages = Array.isArray(conversation.messages)
    ? conversation.messages
        .filter((message) => message && typeof message === 'object')
        .map((message) => ({
          role: ['user', 'assistant', 'system'].includes(message.role) ? message.role : 'user',
          content: sanitizeNoteText(message.content, 40000)
        }))
        .slice(-MAX_CONVERSATION_MESSAGES)
    : [];
  return {
    id,
    title: sanitizeNoteText(conversation.title, 200),
    createdAt: typeof conversation.createdAt === 'string' ? conversation.createdAt : new Date().toISOString(),
    updatedAt: typeof conversation.updatedAt === 'string' ? conversation.updatedAt : new Date().toISOString(),
    provider: sanitizeNoteText(conversation.provider, 100),
    model: sanitizeNoteText(conversation.model, 100),
    messages
  };
}

async function loadChatConversations() {
  const parsed = await readJson(getChatHistoryPath(), { conversations: [] });
  const conversations = Array.isArray(parsed.conversations)
    ? parsed.conversations.map(normalizeConversation).filter(Boolean)
    : [];
  return { conversations };
}

async function saveChatConversations(nextConversations) {
  const conversations = (Array.isArray(nextConversations) ? nextConversations : [])
    .map(normalizeConversation)
    .filter(Boolean)
    .slice(0, MAX_CONVERSATIONS);
  await writeJson(getChatHistoryPath(), { conversations });
  return { conversations };
}

async function ensureTrashDir() {
  await ensureDataDir();
  await fs.mkdir(getTrashDir(), { recursive: true, mode: 0o700 });
}

function normalizeTrashItem(item) {
  if (!item || typeof item === 'string' || typeof item !== 'object') return null;
  if (typeof item.id !== 'string' || typeof item.storedName !== 'string') return null;
  return {
    id: item.id,
    storedName: item.storedName,
    name: sanitizeNoteText(item.name, 300),
    originalPath: sanitizeNoteText(item.originalPath, 1000),
    type: item.type === 'directory' ? 'directory' : 'file',
    size: Number.isFinite(item.size) ? item.size : 0,
    deletedAt: typeof item.deletedAt === 'string' ? item.deletedAt : new Date().toISOString()
  };
}

async function loadTrashIndex() {
  const parsed = await readJson(getTrashIndexPath(), { items: [] });
  return Array.isArray(parsed.items) ? parsed.items.map(normalizeTrashItem).filter(Boolean) : [];
}

async function saveTrashIndex(items) {
  await writeJson(getTrashIndexPath(), { items });
}

async function listTrashItems() {
  return loadTrashIndex();
}

async function moveToTrash({ absolutePath, relativePath }) {
  await ensureTrashDir();
  const stat = await fs.stat(absolutePath);
  const id = crypto.randomUUID();
  const storedName = `${id}${path.extname(absolutePath)}`;
  await fs.rename(absolutePath, path.join(getTrashDir(), storedName));
  const item = {
    id,
    storedName,
    name: path.basename(absolutePath),
    originalPath: relativePath,
    type: stat.isDirectory() ? 'directory' : 'file',
    size: stat.isDirectory() ? 0 : stat.size,
    deletedAt: new Date().toISOString()
  };
  const items = await loadTrashIndex();
  items.unshift(item);
  await saveTrashIndex(items);
  return item;
}

async function restoreFromTrash(id, resolveTarget) {
  const items = await loadTrashIndex();
  const item = items.find((entry) => entry.id === id);
  if (!item) {
    return { ok: false, error: 'Trash item not found.' };
  }
  const target = resolveTarget(item.originalPath || item.name);
  if (!target.ok) {
    return { ok: false, error: target.error };
  }
  const storedPath = path.join(getTrashDir(), item.storedName);
  let destination = target.targetPath;
  try {
    await fs.access(destination);
    const ext = path.extname(destination);
    const base = destination.slice(0, destination.length - ext.length);
    destination = `${base}-restored-${Date.now()}${ext}`;
  } catch {
    // Destination free; restore to the original path.
  }
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.rename(storedPath, destination);
  await saveTrashIndex(items.filter((entry) => entry.id !== id));
  return { ok: true, item, restoredPath: destination };
}

async function removeTrashItem(id) {
  const items = await loadTrashIndex();
  const item = items.find((entry) => entry.id === id);
  if (!item) {
    return { ok: false, error: 'Trash item not found.' };
  }
  await fs.rm(path.join(getTrashDir(), item.storedName), { recursive: true, force: true });
  await saveTrashIndex(items.filter((entry) => entry.id !== id));
  return { ok: true };
}

async function emptyTrash() {
  const items = await loadTrashIndex();
  for (const item of items) {
    await fs.rm(path.join(getTrashDir(), item.storedName), { recursive: true, force: true });
  }
  await saveTrashIndex([]);
  return { removed: items.length };
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
  return store.packages
    .filter((item) => Number(item.sizeBytes) >= LINUX_PACKAGE_MIN_BYTES)
    .map((item) => ({
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

async function getLinuxPackage(packageId) {
  const id = typeof packageId === 'string' ? packageId.trim() : '';
  if (!id) {
    throw new Error('Linux package id is required.');
  }

  const store = await loadLinuxAppsStore();
  const item = store.packages.find((entry) => entry.id === id);
  if (!item || Number(item.sizeBytes) < LINUX_PACKAGE_MIN_BYTES) {
    return null;
  }

  return {
    ...item,
    archivePath: path.join(getLinuxPackagesDir(), item.storedFilename)
  };
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
  emptyTrash,
  ensureDataDir,
  getApiKeyAuditPath,
  getDataDir,
  getInstalledAppsPath,
  getImportsPath,
  getLinuxAppsPath,
  getLinuxPackage,
  getLinuxPackagesDir,
  getNotesPath,
  getShellStatePath,
  getWallpapersDir,
  installApp,
  installLinuxPackage,
  listImports,
  listInstalledApps,
  listLinuxPackages,
  listTrashItems,
  listWallpapers,
  loadApiKeyAuditEvents,
  loadChatConversations,
  loadNotes,
  loadShellState,
  maskSecret,
  moveToTrash,
  removeInstalledApp,
  removeLinuxPackage,
  removeTrashItem,
  restoreFromTrash,
  saveChatConversations,
  saveNotes,
  saveShellState,
  saveWallpaper
};
