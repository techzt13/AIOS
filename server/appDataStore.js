const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const DATA_DIR_NAME = '.aios-data';
const SHELL_STATE_FILE = 'shell-state.json';
const IMPORTS_FILE = 'imports.json';
const API_KEY_AUDIT_FILE = 'api-key-audit.json';
const NOTES_FILE = 'notes.json';

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

module.exports = {
  appendApiKeyAuditEvent,
  appendImportRecord,
  ensureDataDir,
  getApiKeyAuditPath,
  getDataDir,
  getImportsPath,
  getNotesPath,
  getShellStatePath,
  listImports,
  loadApiKeyAuditEvents,
  loadNotes,
  loadShellState,
  maskSecret,
  saveNotes,
  saveShellState
};
