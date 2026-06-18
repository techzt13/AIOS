require('dotenv').config();

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { dispatchChat } = require('./adapters');
const {
  getCopilotModels,
  getChatSession,
  getStatus: getGitHubCopilotStatus,
  pollDeviceFlow,
  startDeviceFlow
} = require('./auth/githubCopilot');
const { getConfigDir } = require('./configDir');
const { resolveProviderAuth } = require('./chatAuth');
const { loadFirstRunState, setFirstRunCompleted } = require('./firstRunStore');
const { providerCatalog, getProviderById } = require('./providers');
const { testProviderConnection } = require('./providerConnection');
const { buildProviderSettingsResponse } = require('./providerSettings');
const {
  clearProviderSettings,
  loadProviderSettings,
  upsertProviderSettings
} = require('./providerSettingsStore');
const {
  appendApiKeyAuditEvent,
  appendImportRecord,
  ensureDataDir,
  getDataDir,
  installApp,
  listImports,
  listInstalledApps,
  loadApiKeyAuditEvents,
  loadNotes,
  loadShellState,
  maskSecret,
  removeInstalledApp,
  saveNotes,
  saveShellState
} = require('./appDataStore');
const { resolveSandboxPath } = require('./sandbox');
const { validateExecCommand, runExecCommand, startExecCommand } = require('./exec');
const { ProcessRegistry } = require('./processRegistry');
const { getRuntimeInfo } = require('./runtime');

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.AIOS_HOST || process.env.HOST || '127.0.0.1';
const WORKSPACE_ROOT = path.resolve(process.env.WORKSPACE_ROOT || process.env.SANDBOX_DIR || path.join(process.cwd(), 'workspace'));
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 120);
const ENABLE_EXEC_API = String(process.env.ENABLE_EXEC_API || '').toLowerCase() === 'true';
const EXEC_TIMEOUT_MS = Number(process.env.EXEC_TIMEOUT_MS || 15000);
const EXEC_MAX_OUTPUT_BYTES = Number(process.env.EXEC_MAX_OUTPUT_BYTES || 256000);
const FS_READ_MAX_BYTES = Number(process.env.FS_READ_MAX_BYTES || 1048576);

function createApp(deps = {}) {
  const app = express();
  const dispatchChatImpl = deps.dispatchChat || dispatchChat;
  const getGitHubCopilotStatusImpl = deps.getGitHubCopilotStatus || getGitHubCopilotStatus;
  const startDeviceFlowImpl = deps.startDeviceFlow || startDeviceFlow;
  const pollDeviceFlowImpl = deps.pollDeviceFlow || pollDeviceFlow;
  const getChatSessionImpl = deps.getChatSession || getChatSession;
  const loadFirstRunStateImpl = deps.loadFirstRunState || loadFirstRunState;
  const setFirstRunCompletedImpl = deps.setFirstRunCompleted || setFirstRunCompleted;
  const loadProviderSettingsImpl = deps.loadProviderSettings || loadProviderSettings;
  const upsertProviderSettingsImpl = deps.upsertProviderSettings || upsertProviderSettings;
  const clearProviderSettingsImpl = deps.clearProviderSettings || clearProviderSettings;
  const processRegistry = deps.processRegistry || new ProcessRegistry();

  const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: 'Rate limit exceeded. Please retry in a moment.' }
  });

  async function loadSettingsContext() {
    const [providerSettings, copilotStatus] = await Promise.all([
      loadProviderSettingsImpl(),
      getGitHubCopilotStatusImpl()
    ]);

    let providers = buildProviderSettingsResponse({
      providers: providerCatalog,
      providerSettings,
      copilotStatus
    });

    const copilotProvider = providers.find((provider) => provider.id === 'github-copilot');
    if (copilotProvider) {
      const copilotModels = await getCopilotModels({
        baseUrl: copilotProvider.effectiveBaseUrl || copilotProvider.defaultBaseUrl
      });

      providers = providers.map((provider) => {
        if (provider.id !== 'github-copilot') {
          return provider;
        }

        return {
          ...provider,
          models: copilotModels.models,
          defaultModel: copilotModels.models.includes(provider.defaultModel)
            ? provider.defaultModel
            : (copilotModels.models[0] || provider.defaultModel),
          modelSource: copilotModels.source
        };
      });
    }

    return { providerSettings, copilotStatus, providers };
  }

  app.use(express.json({ limit: '1mb' }));
  app.use('/api', apiLimiter);
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, app: 'AIOS' });
  });

  app.get('/api/runtime', (_req, res) => {
    res.json({
      ok: true,
      runtime: getRuntimeInfo({
        host: HOST,
        port: PORT,
        workspaceRoot: WORKSPACE_ROOT,
        dataDir: getDataDir(),
        configDir: getConfigDir(),
        execEnabled: ENABLE_EXEC_API,
        execTimeoutMs: EXEC_TIMEOUT_MS,
        execMaxOutputBytes: EXEC_MAX_OUTPUT_BYTES,
        processRegistry
      })
    });
  });

  app.get('/api/processes', (_req, res) => {
    res.json({ ok: true, processes: processRegistry.listProcesses() });
  });

  app.post('/api/processes/exec', apiLimiter, async (req, res) => {
    if (!ENABLE_EXEC_API) {
      return res.status(403).json({
        ok: false,
        error: 'Command execution is disabled. Set ENABLE_EXEC_API=true to enable in trusted environments.'
      });
    }

    const validation = validateExecCommand(req.body?.command);
    if (!validation.ok) {
      return res.status(400).json({ ok: false, error: validation.error });
    }

    try {
      const { process: trackedProcess, done } = startExecCommand({
        command: validation.command,
        cwd: WORKSPACE_ROOT,
        timeoutMs: EXEC_TIMEOUT_MS,
        maxBuffer: EXEC_MAX_OUTPUT_BYTES,
        processRegistry
      });
      done.catch((error) => processRegistry.failProcess(trackedProcess.id, error));

      return res.status(202).json({ ok: true, process: trackedProcess });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to start command: ${error.message}` });
    }
  });

  app.get('/api/processes/:processId', (req, res) => {
    const trackedProcess = processRegistry.getProcess(req.params.processId);
    if (!trackedProcess) {
      return res.status(404).json({ ok: false, error: 'Process not found.' });
    }

    return res.json({ ok: true, process: trackedProcess });
  });

  app.delete('/api/processes/:processId', (req, res) => {
    const result = processRegistry.cancelProcess(req.params.processId);
    return res.status(result.ok ? 200 : 400).json(result);
  });

  app.get('/api/local-data/info', async (_req, res) => {
    await ensureDataDir();
    res.json({
      ok: true,
      dataDir: getDataDir(),
      localOnly: true
    });
  });

  app.get('/api/local-data/shell-state', async (_req, res) => {
    const state = await loadShellState();
    res.json({ ok: true, state });
  });

  app.post('/api/local-data/shell-state', async (req, res) => {
    const state = await saveShellState(req.body?.state || {});
    res.json({ ok: true, state });
  });

  app.get('/api/local-data/notes', async (_req, res) => {
    const { notes } = await loadNotes();
    res.json({ ok: true, notes });
  });

  app.post('/api/local-data/notes', async (req, res) => {
    const incoming = Array.isArray(req.body?.notes) ? req.body.notes : [];
    const { notes } = await saveNotes(incoming);
    res.json({ ok: true, notes });
  });

  app.get('/api/apps', async (_req, res) => {
    const apps = await listInstalledApps();
    res.json({ ok: true, apps });
  });

  app.post('/api/apps', async (req, res) => {
    try {
      const app = await installApp({
        name: req.body?.name,
        url: req.body?.url,
        glyph: req.body?.glyph,
        description: req.body?.description,
        version: req.body?.version
      });
      return res.status(201).json({ ok: true, app });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.delete('/api/apps/:appId', async (req, res) => {
    try {
      const removed = await removeInstalledApp(req.params.appId);
      if (!removed) {
        return res.status(404).json({ ok: false, error: 'App not found.' });
      }

      return res.json({ ok: true, removed });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.get('/api/local-data/imports', async (_req, res) => {
    const imports = await listImports();
    res.json({ ok: true, imports });
  });

  app.post('/api/local-data/imports', async (req, res) => {
    const type = typeof req.body?.type === 'string' ? req.body.type.trim().toLowerCase() : '';
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const payload = req.body?.payload;
    const allowedTypes = new Set(['apps', 'settings', 'bookmarks', 'history', 'cookies']);

    if (!allowedTypes.has(type)) {
      return res.status(400).json({ ok: false, error: 'Unsupported import type.' });
    }

    if (!name) {
      return res.status(400).json({ ok: false, error: 'Import name is required.' });
    }

    const item = await appendImportRecord({
      type,
      name,
      payload,
      containsSensitiveData: type === 'cookies'
    });

    return res.json({
      ok: true,
      import: {
        id: item.id,
        importedAt: item.importedAt,
        type: item.type,
        name: item.name,
        containsSensitiveData: item.containsSensitiveData,
        recordCount: item.recordCount
      }
    });
  });

  app.get('/api/providers', async (_req, res) => {
    const { providers } = await loadSettingsContext();
    res.json({
      providers: providers.map((provider) => ({
        ...provider,
        defaultBaseUrl: provider.effectiveBaseUrl
      }))
    });
  });

  app.get('/api/settings/providers', async (_req, res) => {
    const { providers, copilotStatus } = await loadSettingsContext();
    res.json({
      ok: true,
      configDir: getConfigDir(),
      providers,
      copilot: copilotStatus
    });
  });

  app.get('/api/settings/first-run', async (_req, res) => {
    const state = await loadFirstRunStateImpl();
    res.json({ ok: true, completed: Boolean(state.firstRunCompleted) });
  });

  app.post('/api/settings/first-run', async (req, res) => {
    if (typeof req.body?.completed !== 'boolean') {
      return res.status(400).json({ ok: false, error: 'completed must be a boolean.' });
    }

    const state = await setFirstRunCompletedImpl(req.body.completed);
    return res.json({ ok: true, completed: Boolean(state.firstRunCompleted) });
  });

  app.delete('/api/settings/first-run', async (_req, res) => {
    const state = await setFirstRunCompletedImpl(false);
    return res.json({ ok: true, completed: Boolean(state.firstRunCompleted) });
  });

  app.post('/api/settings/providers/:providerId', async (req, res) => {
    try {
      const provider = getProviderById(req.params.providerId);
      if (!provider) {
        return res.status(404).json({ ok: false, error: `Unknown provider: ${req.params.providerId}` });
      }

      const updates = {};
      if (Object.prototype.hasOwnProperty.call(req.body || {}, 'baseUrl')) {
        updates.baseUrl = req.body.baseUrl;
      }

      if (provider.authMethod === 'static-key') {
        if (Object.prototype.hasOwnProperty.call(req.body || {}, 'apiKey')) {
          updates.apiKey = req.body.apiKey;
        }

        if (provider.apiSecretEnv && Object.prototype.hasOwnProperty.call(req.body || {}, 'apiSecret')) {
          updates.apiSecret = req.body.apiSecret;
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ ok: false, error: 'No provider settings were provided.' });
      }

      await upsertProviderSettingsImpl(provider.id, updates);
      await appendApiKeyAuditEvent({
        providerId: provider.id,
        action: 'saved',
        maskedKey: maskSecret(updates.apiKey)
      });
      const { providers } = await loadSettingsContext();
      const updated = providers.find((item) => item.id === provider.id);
      return res.json({ ok: true, provider: updated });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.delete('/api/settings/providers/:providerId', async (req, res) => {
    try {
      const provider = getProviderById(req.params.providerId);
      if (!provider) {
        return res.status(404).json({ ok: false, error: `Unknown provider: ${req.params.providerId}` });
      }

      await clearProviderSettingsImpl(provider.id);
      await appendApiKeyAuditEvent({
        providerId: provider.id,
        action: 'cleared',
        maskedKey: null
      });
      const { providers } = await loadSettingsContext();
      const updated = providers.find((item) => item.id === provider.id);
      return res.json({ ok: true, provider: updated });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post('/api/settings/providers/:providerId/test', async (req, res) => {
    try {
      const provider = getProviderById(req.params.providerId);
      if (!provider) {
        return res.status(404).json({ ok: false, error: `Unknown provider: ${req.params.providerId}` });
      }

      const providerSettings = await loadProviderSettingsImpl();
      const result = await testProviderConnection({
        provider,
        model: req.body?.model,
        providerSettings,
        dispatchChat: dispatchChatImpl,
        getGitHubCopilotChatSession: getChatSessionImpl
      });

      await appendApiKeyAuditEvent({
        providerId: provider.id,
        action: 'tested',
        maskedKey: maskSecret(providerSettings.providers?.[provider.id]?.apiKey || null)
      });

      return res.status(result.ok ? 200 : (result.status || 400)).json(result);
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Connection test failed: ${error.message}` });
    }
  });

  app.get('/api/auth/github-copilot/status', async (_req, res) => {
    res.json({ ok: true, ...(await getGitHubCopilotStatusImpl()) });
  });

  app.post('/api/auth/github-copilot/start', async (_req, res) => {
    try {
      const flow = await startDeviceFlowImpl();
      return res.json({
        ok: true,
        ...flow,
        message: 'Open the GitHub verification URL, enter the code, then return to AIOS to finish sign-in.'
      });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post('/api/auth/github-copilot/poll', async (req, res) => {
    try {
      const deviceCode = String(req.body?.deviceCode || '').trim();
      if (!deviceCode) {
        return res.status(400).json({ ok: false, error: 'deviceCode is required.' });
      }

      const result = await pollDeviceFlowImpl({ deviceCode });
      return res.status(result.pending ? 202 : 200).json(result);
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.get('/api/settings/provider-audit', async (_req, res) => {
    const events = await loadApiKeyAuditEvents();
    return res.json({ ok: true, events });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { providerId, model, messages } = req.body || {};

      if (!providerId || !model || !Array.isArray(messages)) {
        return res.status(400).json({ ok: false, error: 'providerId, model, and messages[] are required.' });
      }

      const provider = getProviderById(providerId);
      if (!provider) {
        return res.status(400).json({ ok: false, error: `Unknown provider: ${providerId}` });
      }

      const providerSettings = await loadProviderSettingsImpl();
      const authResult = await resolveProviderAuth({
        provider,
        providerSettings,
        getGitHubCopilotChatSession: getChatSessionImpl
      });
      if (!authResult.ok) {
        return res.status(400).json({ ok: false, error: authResult.error });
      }

      const result = await dispatchChatImpl({
        provider,
        model,
        messages,
        auth: authResult.auth
      });

      if (!result.ok) {
        return res.status(result.status || 500).json({
          ok: false,
          error: result.error,
          provider: provider.id,
          details: result.raw
        });
      }

      return res.json({ ok: true, provider: provider.id, model, message: result.message, raw: result.raw });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Chat request failed: ${error.message}` });
    }
  });

  app.post('/api/exec', apiLimiter, async (req, res) => {
    if (!ENABLE_EXEC_API) {
      return res.status(403).json({
        ok: false,
        error: 'Command execution is disabled. Set ENABLE_EXEC_API=true to enable in trusted environments.'
      });
    }

    const validation = validateExecCommand(req.body?.command);
    if (!validation.ok) {
      return res.status(400).json({ ok: false, error: validation.error });
    }

    try {
      const result = await runExecCommand({
        command: validation.command,
        cwd: WORKSPACE_ROOT,
        timeoutMs: EXEC_TIMEOUT_MS,
        maxBuffer: EXEC_MAX_OUTPUT_BYTES,
        processRegistry
      });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ ok: false, stdout: '', stderr: String(error.message || error), code: -1 });
    }
  });

  app.post('/api/fs/write', apiLimiter, async (req, res) => {
    try {
      const { path: requestedPath, content } = req.body || {};
      const resolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath);

      if (!resolved.ok) {
        return res.status(400).json({ ok: false, error: resolved.error });
      }

      await fs.mkdir(path.dirname(resolved.targetPath), { recursive: true });
      await fs.writeFile(resolved.targetPath, String(content ?? ''), 'utf8');

      return res.json({
        ok: true,
        message: `Wrote file to sandbox path: ${path.relative(resolved.sandboxRoot, resolved.targetPath)}`
      });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to write file: ${error.message}` });
    }
  });

  app.post('/api/fs/read', apiLimiter, async (req, res) => {
    try {
      const { path: requestedPath } = req.body || {};
      const resolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath);

      if (!resolved.ok) {
        return res.status(400).json({ ok: false, error: resolved.error });
      }

      const stat = await fs.stat(resolved.targetPath);
      if (!stat.isFile()) {
        return res.status(400).json({ ok: false, error: 'Path is not a file.' });
      }

      if (stat.size > FS_READ_MAX_BYTES) {
        return res.status(400).json({ ok: false, error: `File too large to read (>${FS_READ_MAX_BYTES} bytes).` });
      }

      const content = await fs.readFile(resolved.targetPath, 'utf8');
      return res.json({ ok: true, path: path.relative(resolved.sandboxRoot, resolved.targetPath), content });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to read file: ${error.message}` });
    }
  });

  app.post('/api/fs/list', apiLimiter, async (req, res) => {
    try {
      const requestedPath = typeof req.body?.path === 'string' && req.body.path.trim() ? req.body.path : '.';
      const resolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath, { allowRoot: true });

      if (!resolved.ok) {
        return res.status(400).json({ ok: false, error: resolved.error });
      }

      const stat = await fs.stat(resolved.targetPath);
      if (!stat.isDirectory()) {
        return res.status(400).json({ ok: false, error: 'Path is not a directory.' });
      }

      const entries = await fs.readdir(resolved.targetPath, { withFileTypes: true });
      const items = entries
        .map((entry) => ({
          name: entry.name,
          type: entry.isDirectory() ? 'directory' : 'file'
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return res.json({
        ok: true,
        path: path.relative(resolved.sandboxRoot, resolved.targetPath) || '.',
        entries: items
      });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to list directory: ${error.message}` });
    }
  });

  app.use(apiLimiter, (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(PORT, HOST, () => {
    const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
    console.log(`AIOS running on http://${displayHost}:${PORT}`);
    console.log(`Runtime mode: local-daemon (${HOST === '127.0.0.1' || HOST === 'localhost' ? 'local-only' : `bound to ${HOST}`})`);
    console.log(`Workspace root: ${WORKSPACE_ROOT}`);
  });
}

module.exports = { createApp };
