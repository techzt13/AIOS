const { WebSocketServer } = require('ws');
const { setupPtySocket } = require('./ptySocket');

function attachWebSockets(server) {
  const wss = new WebSocketServer({ server });
  setupPtySocket(wss);
}

require('dotenv').config();

const { execFile } = require('child_process');
const express = require('express');
const fs = require('fs/promises');
const os = require('os');
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
  emptyTrash,
  ensureDataDir,
  getDataDir,
  getLinuxPackage,
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
} = require('./appDataStore');
const { resolveSandboxPath } = require('./sandbox');
const { validateExecCommand, runExecCommand, startExecCommand } = require('./exec');
const { openNativeBrowserUrl } = require('./browserLauncher');
const { ensureLinuxRuntimeImage, startLinuxPackage } = require('./linuxRunner');
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
const WEB_APP_MANIFEST_MAX_BYTES = Number(process.env.WEB_APP_MANIFEST_MAX_BYTES || 524288);
const LINUX_APP_PACKAGE_MAX_BYTES = Number(process.env.LINUX_APP_PACKAGE_MAX_BYTES || 104857600);
const LINUX_DOWNLOAD_USER_AGENT = process.env.LINUX_DOWNLOAD_USER_AGENT
  || 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) AIOS/1.0 Chrome/120 Safari/537.36';

function resolveHttpUrl(value, baseUrl = undefined) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) {
    throw new Error('A valid http:// or https:// URL is required.');
  }

  let url;
  try {
    url = new URL(raw, baseUrl);
  } catch {
    throw new Error('A valid http:// or https:// URL is required.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only http:// and https:// URLs are supported.');
  }

  return url.toString();
}

function parseManifestLink(html, pageUrl) {
  const linkPattern = /<link\b[^>]*>/gi;
  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    const tag = match[0];
    const relMatch = tag.match(/\brel\s*=\s*["']?([^"'\s>]+)/i);
    if (!relMatch || !relMatch[1].split(/\s+/).some((value) => value.toLowerCase() === 'manifest')) {
      continue;
    }

    const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i) || tag.match(/\bhref\s*=\s*([^\s>]+)/i);
    if (hrefMatch?.[1]) {
      return resolveHttpUrl(hrefMatch[1], pageUrl);
    }
  }

  return null;
}

async function fetchTextWithinLimit(fetchImpl, url) {
  const response = await fetchImpl(url, {
    headers: {
      Accept: 'application/manifest+json, application/json, text/html;q=0.9, */*;q=0.8',
      'User-Agent': 'AIOS'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (HTTP ${response.status}).`);
  }

  const contentLength = Number(response.headers?.get?.('content-length') || 0);
  if (contentLength > WEB_APP_MANIFEST_MAX_BYTES) {
    throw new Error('Response is too large to inspect as a web app manifest.');
  }

  const text = await response.text();
  if (Buffer.byteLength(text, 'utf8') > WEB_APP_MANIFEST_MAX_BYTES) {
    throw new Error('Response is too large to inspect as a web app manifest.');
  }

  return text;
}

async function resolveWebAppManifest({ url, fetchImpl = fetch }) {
  const inputUrl = resolveHttpUrl(url);
  const firstText = await fetchTextWithinLimit(fetchImpl, inputUrl);

  try {
    return {
      manifest: JSON.parse(firstText),
      manifestUrl: inputUrl
    };
  } catch {
    const manifestUrl = parseManifestLink(firstText, inputUrl);
    if (!manifestUrl) {
      throw new Error('No <link rel="manifest"> was found at that site.');
    }

    const manifestText = await fetchTextWithinLimit(fetchImpl, manifestUrl);
    return {
      manifest: JSON.parse(manifestText),
      manifestUrl
    };
  }
}

function appFromWebManifest(manifest, manifestUrl) {
  const startUrl = resolveHttpUrl(manifest.start_url || manifest.startUrl || '/', manifestUrl);
  return {
    name: manifest.name || manifest.short_name,
    short_name: manifest.short_name,
    url: startUrl,
    glyph: manifest.short_name,
    description: manifest.description,
    manifestUrl
  };
}

function filenameFromDownloadResponse(response, url) {
  const disposition = response.headers?.get?.('content-disposition') || '';
  const filenameMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i) || disposition.match(/filename="?([^";]+)"?/i);
  if (filenameMatch?.[1]) {
    return decodeURIComponent(filenameMatch[1]).trim();
  }

  const pathname = new URL(url).pathname;
  return path.basename(pathname) || 'linux-package.tar.gz';
}

async function fetchLinuxPackage({ url, fetchImpl = fetch }) {
  const packageUrl = resolveHttpUrl(url);
  const response = await fetchImpl(packageUrl, {
    headers: {
      Accept: 'application/gzip, application/x-gzip, application/x-tar, application/octet-stream, */*',
      'User-Agent': LINUX_DOWNLOAD_USER_AGENT
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download Linux package (HTTP ${response.status}).`);
  }

  const contentLength = Number(response.headers?.get?.('content-length') || 0);
  if (contentLength > LINUX_APP_PACKAGE_MAX_BYTES) {
    throw new Error('Linux package is too large.');
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (buffer.length > LINUX_APP_PACKAGE_MAX_BYTES) {
    throw new Error('Linux package is too large.');
  }

  return {
    filename: filenameFromDownloadResponse(response, packageUrl),
    buffer
  };
}

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
  const fetchImpl = deps.fetch || fetch;
  const openNativeBrowserUrlImpl = deps.openNativeBrowserUrl || openNativeBrowserUrl;
  const startLinuxPackageImpl = deps.startLinuxPackage || startLinuxPackage;

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

  app.post('/api/local-data/wallpaper', express.raw({ type: ['image/*', 'application/octet-stream'], limit: '8mb' }), async (req, res) => {
    try {
      const filename = String(req.get('x-aios-filename') || 'wallpaper.png').trim();
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ ok: false, error: 'Image body is required.' });
      }
      const { storedFilename } = await saveWallpaper(req.body, filename);
      return res.json({ ok: true, filename: storedFilename, url: `/api/local-data/wallpapers/${storedFilename}` });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.get('/api/local-data/wallpapers/:filename', async (req, res) => {
    try {
      const targetPath = path.join(getWallpapersDir(), path.basename(req.params.filename));
      const stat = await fs.stat(targetPath);
      if (!stat.isFile()) {
        return res.status(404).json({ ok: false, error: 'Wallpaper not found.' });
      }
      const ext = path.extname(targetPath).toLowerCase();
      const contentType = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp'
      }[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(targetPath);
    } catch (error) {
      return res.status(404).json({ ok: false, error: 'Wallpaper not found.' });
    }
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

  app.get('/api/local-data/chat-history', async (_req, res) => {
    const { conversations } = await loadChatConversations();
    res.json({ ok: true, conversations });
  });

  app.post('/api/local-data/chat-history', async (req, res) => {
    const incoming = Array.isArray(req.body?.conversations) ? req.body.conversations : [];
    const { conversations } = await saveChatConversations(incoming);
    res.json({ ok: true, conversations });
  });

  app.post('/api/fs/trash', apiLimiter, async (req, res) => {
    try {
      const resolved = resolveSandboxPath(WORKSPACE_ROOT, req.body?.path);
      if (!resolved.ok) {
        return res.status(400).json({ ok: false, error: resolved.error });
      }
      const relativePath = path.relative(resolved.sandboxRoot, resolved.targetPath);
      if (relativePath.startsWith('.aios-data')) {
        return res.status(400).json({ ok: false, error: 'Cannot trash AIOS data files.' });
      }
      const item = await moveToTrash({ absolutePath: resolved.targetPath, relativePath });
      return res.json({ ok: true, item });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to move to trash: ${error.message}` });
    }
  });

  app.get('/api/trash', async (_req, res) => {
    try {
      const items = await listTrashItems();
      res.json({ ok: true, items });
    } catch (error) {
      res.status(500).json({ ok: false, error: `Failed to list trash: ${error.message}` });
    }
  });

  app.post('/api/trash/restore', async (req, res) => {
    try {
      const result = await restoreFromTrash(String(req.body?.id || ''), (originalPath) =>
        resolveSandboxPath(WORKSPACE_ROOT, originalPath)
      );
      if (!result.ok) {
        return res.status(400).json({ ok: false, error: result.error });
      }
      return res.json({
        ok: true,
        item: result.item,
        restoredPath: path.relative(WORKSPACE_ROOT, result.restoredPath)
      });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to restore: ${error.message}` });
    }
  });

  app.delete('/api/trash/:itemId', async (req, res) => {
    try {
      const result = await removeTrashItem(String(req.params.itemId || ''));
      if (!result.ok) {
        return res.status(404).json({ ok: false, error: result.error });
      }
      return res.json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to delete trash item: ${error.message}` });
    }
  });

  app.post('/api/trash/empty', async (_req, res) => {
    try {
      const result = await emptyTrash();
      res.json({ ok: true, removed: result.removed });
    } catch (error) {
      res.status(500).json({ ok: false, error: `Failed to empty trash: ${error.message}` });
    }
  });

  app.get('/api/system/stats', async (_req, res) => {
    try {
      const cpus = os.cpus() || [];
      const loadAvg = os.loadavg();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const memoryUsage = process.memoryUsage();
      const processes = processRegistry.listProcesses();

      let containers = [];
      try {
        const dockerResult = await runExecCommand({
          command: "docker stats --no-stream --format '{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}'",
          cwd: WORKSPACE_ROOT,
          timeoutMs: 5000,
          maxBuffer: 1024 * 1024
        });
        if (dockerResult.ok && dockerResult.stdout) {
          containers = dockerResult.stdout
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
              const [name, cpu, mem, net] = line.split('\t');
              return { name, cpu, mem, net };
            });
        }
      } catch {
        // Docker unavailable; report AIOS stats only.
      }

      res.json({
        ok: true,
        stats: {
          platform: `${os.platform()} ${os.release()}`,
          cpuCount: cpus.length,
          cpuModel: cpus[0]?.model || 'Unknown',
          loadAvg: loadAvg.map((value) => Number(value.toFixed(2))),
          totalMem,
          freeMem,
          usedMem: totalMem - freeMem,
          uptime: os.uptime(),
          serverProcess: {
            pid: process.pid,
            rss: memoryUsage.rss,
            heapUsed: memoryUsage.heapUsed,
            uptime: process.uptime()
          },
          processes,
          containers
        }
      });
    } catch (error) {
      res.status(500).json({ ok: false, error: `Failed to collect stats: ${error.message}` });
    }
  });

  app.get('/api/system/volume', async (_req, res) => {
    if (process.platform !== 'darwin') {
      return res.json({ ok: true, supported: false });
    }
    execFile('osascript', ['-e', 'get volume settings'], { timeout: 3000 }, (error, stdout) => {
      if (error) {
        return res.json({ ok: true, supported: false });
      }
      const volumeMatch = /output volume:(\d+)/.exec(stdout);
      const mutedMatch = /output muted:(true|false)/.exec(stdout);
      return res.json({
        ok: true,
        supported: true,
        volume: volumeMatch ? Number(volumeMatch[1]) : 50,
        muted: mutedMatch ? mutedMatch[1] === 'true' : false
      });
    });
  });

  app.post('/api/system/volume', async (req, res) => {
    if (process.platform !== 'darwin') {
      return res.json({ ok: true, supported: false });
    }
    const volume = Math.max(0, Math.min(100, Math.round(Number(req.body?.volume))));
    if (!Number.isFinite(volume)) {
      return res.status(400).json({ ok: false, error: 'A volume between 0 and 100 is required.' });
    }
    execFile('osascript', ['-e', `set volume output volume ${volume}`], { timeout: 3000 }, (error) => {
      if (error) {
        return res.json({ ok: true, supported: false });
      }
      return res.json({ ok: true, supported: true, volume });
    });
  });

  app.get('/api/fs/raw', apiLimiter, async (req, res) => {
    try {
      const resolved = resolveSandboxPath(WORKSPACE_ROOT, String(req.query.path || ''));
      if (!resolved.ok) {
        return res.status(400).json({ ok: false, error: resolved.error });
      }
      const stat = await fs.stat(resolved.targetPath);
      if (!stat.isFile()) {
        return res.status(400).json({ ok: false, error: 'Path is not a file.' });
      }
      if (stat.size > 32 * 1024 * 1024) {
        return res.status(400).json({ ok: false, error: 'File too large to preview.' });
      }
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.bmp': 'image/bmp',
        '.ico': 'image/x-icon',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.m4a': 'audio/mp4',
        '.flac': 'audio/flac',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mov': 'video/quicktime',
        '.pdf': 'application/pdf',
        '.json': 'application/json',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.md': 'text/markdown',
        '.txt': 'text/plain'
      };
      const ext = path.extname(resolved.targetPath).toLowerCase();
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return res.sendFile(resolved.targetPath);
    } catch (error) {
      return res.status(404).json({ ok: false, error: 'File not found.' });
    }
  });

  app.get('/api/apps', async (_req, res) => {
    const apps = await listInstalledApps();
    res.json({ ok: true, apps });
  });

  app.post('/api/apps', async (req, res) => {
    try {
      const app = await installApp({
        name: req.body?.name,
        short_name: req.body?.short_name,
        url: req.body?.url,
        start_url: req.body?.start_url,
        startUrl: req.body?.startUrl,
        glyph: req.body?.glyph,
        description: req.body?.description,
        version: req.body?.version,
        manifestUrl: req.body?.manifestUrl
      });
      return res.status(201).json({ ok: true, app });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post('/api/apps/import-web-manifest', async (req, res) => {
    try {
      const { manifest, manifestUrl } = await resolveWebAppManifest({
        url: req.body?.url,
        fetchImpl
      });
      const app = await installApp(appFromWebManifest(manifest, manifestUrl));
      return res.status(201).json({ ok: true, app, manifestUrl });
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

  app.get('/api/linux-apps', async (_req, res) => {
    const packages = await listLinuxPackages();
    res.json({
      ok: true,
      packages,
      runtime: 'pending-linux-runtime',
      supportedArchives: ['.tar.gz', '.tgz', '.tar']
    });
  });

  app.post(
    '/api/linux-apps',
    express.raw({
      type: ['application/gzip', 'application/x-gzip', 'application/x-tar', 'application/octet-stream'],
      limit: LINUX_APP_PACKAGE_MAX_BYTES
    }),
    async (req, res) => {
      try {
        const app = await installLinuxPackage({
          name: req.get('x-aios-package-name'),
          filename: req.get('x-aios-package-filename'),
          buffer: req.body
        });
        return res.status(201).json({
          ok: true,
          package: app,
          message: 'Linux package stored. Running it will require the AIOS Linux runtime.'
        });
      } catch (error) {
        return res.status(400).json({ ok: false, error: error.message });
      }
    }
  );

  app.post('/api/linux-apps/import-url', async (req, res) => {
    try {
      const downloaded = await fetchLinuxPackage({
        url: req.body?.url,
        fetchImpl
      });
      const app = await installLinuxPackage({
        name: req.body?.name,
        filename: downloaded.filename,
        buffer: downloaded.buffer
      });
      return res.status(201).json({
        ok: true,
        package: app,
        linuxUserAgent: LINUX_DOWNLOAD_USER_AGENT,
        message: 'Linux package downloaded with a Linux user-agent and stored. Running it will require the AIOS Linux runtime.'
      });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post('/api/browser/open', async (req, res) => {
    try {
      const result = await openNativeBrowserUrlImpl(req.body?.url);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.post('/api/linux-apps/:packageId/run', async (req, res) => {
    try {
      const linuxPackage = await getLinuxPackage(req.params.packageId);
      if (!linuxPackage) {
        return res.status(404).json({ ok: false, error: 'Linux package not found.' });
      }

      const result = await startLinuxPackageImpl({
        linuxPackage,
        executablePath: req.body?.executablePath,
        args: req.body?.args,
        processRegistry
      });
      return res.status(202).json(result);
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  });

  app.delete('/api/linux-apps/:packageId', async (req, res) => {
    try {
      const removed = await removeLinuxPackage(req.params.packageId);
      if (!removed) {
        return res.status(404).json({ ok: false, error: 'Linux package not found.' });
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

  app.post('/api/fs/mkdir', apiLimiter, async (req, res) => {
    try {
      const { path: requestedPath } = req.body || {};
      const resolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath);

      if (!resolved.ok) {
        return res.status(400).json({ ok: false, error: resolved.error });
      }

      await fs.mkdir(resolved.targetPath, { recursive: true });
      return res.status(201).json({
        ok: true,
        path: path.relative(resolved.sandboxRoot, resolved.targetPath) || '.'
      });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to create folder: ${error.message}` });
    }
  });

  app.post(
    '/api/fs/upload',
    apiLimiter,
    express.raw({ type: ['*/*'], limit: FS_READ_MAX_BYTES }),
    async (req, res) => {
      try {
        const filename = String(req.get('x-aios-filename') || '').trim();
        if (!filename || filename.includes('/') || filename.includes('\\')) {
          return res.status(400).json({ ok: false, error: 'A safe filename is required.' });
        }
        const directory = typeof req.query.path === 'string' && req.query.path.trim() ? req.query.path : '.';
        const resolved = resolveSandboxPath(WORKSPACE_ROOT, path.posix.join(directory, filename));

        if (!resolved.ok) {
          return res.status(400).json({ ok: false, error: resolved.error });
        }

        await fs.mkdir(path.dirname(resolved.targetPath), { recursive: true });
        await fs.writeFile(resolved.targetPath, req.body);
        return res.status(201).json({
          ok: true,
          path: path.relative(resolved.sandboxRoot, resolved.targetPath)
        });
      } catch (error) {
        return res.status(500).json({ ok: false, error: `Failed to upload file: ${error.message}` });
      }
    }
  );

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

  app.post('/api/fs/rename', apiLimiter, async (req, res) => {
    try {
      const { path: requestedPath, name } = req.body || {};
      const safeName = String(name || '').trim();
      if (!safeName || safeName.includes('/') || safeName.includes('\\')) {
        return res.status(400).json({ ok: false, error: 'A safe new name is required.' });
      }
      const resolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath);

      if (!resolved.ok) {
        return res.status(400).json({ ok: false, error: resolved.error });
      }

      const targetPath = path.join(path.dirname(resolved.targetPath), safeName);
      const targetResolved = resolveSandboxPath(resolved.sandboxRoot, path.relative(resolved.sandboxRoot, targetPath));
      if (!targetResolved.ok) {
        return res.status(400).json({ ok: false, error: targetResolved.error });
      }

      try {
        await fs.access(targetResolved.targetPath);
        return res.status(409).json({ ok: false, error: 'A file or folder with that name already exists.' });
      } catch {
        // Destination is available.
      }

      await fs.rename(resolved.targetPath, targetResolved.targetPath);
      return res.json({
        ok: true,
        path: path.relative(resolved.sandboxRoot, targetResolved.targetPath)
      });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to rename item: ${error.message}` });
    }
  });

  app.post('/api/fs/copy', apiLimiter, async (req, res) => {
    try {
      const { path: requestedPath, target } = req.body || {};
      const sourceResolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath);
      const targetResolved = resolveSandboxPath(WORKSPACE_ROOT, target || '.', { allowRoot: true });

      if (!sourceResolved.ok) {
        return res.status(400).json({ ok: false, error: sourceResolved.error });
      }
      if (!targetResolved.ok) {
        return res.status(400).json({ ok: false, error: targetResolved.error });
      }

      const targetStat = await fs.stat(targetResolved.targetPath);
      if (!targetStat.isDirectory()) {
        return res.status(400).json({ ok: false, error: 'Copy target must be a folder.' });
      }

      const destinationPath = path.join(targetResolved.targetPath, path.basename(sourceResolved.targetPath));
      try {
        await fs.access(destinationPath);
        return res.status(409).json({ ok: false, error: 'An item with that name already exists in the target folder.' });
      } catch {
        // Destination is available.
      }

      await fs.cp(sourceResolved.targetPath, destinationPath, { recursive: true, errorOnExist: true, force: false });
      return res.json({
        ok: true,
        path: path.relative(sourceResolved.sandboxRoot, destinationPath)
      });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to copy item: ${error.message}` });
    }
  });

  app.post('/api/fs/move', apiLimiter, async (req, res) => {
    try {
      const { path: requestedPath, target } = req.body || {};
      const sourceResolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath);
      const targetResolved = resolveSandboxPath(WORKSPACE_ROOT, target || '.', { allowRoot: true });

      if (!sourceResolved.ok) {
        return res.status(400).json({ ok: false, error: sourceResolved.error });
      }
      if (!targetResolved.ok) {
        return res.status(400).json({ ok: false, error: targetResolved.error });
      }

      const targetStat = await fs.stat(targetResolved.targetPath);
      if (!targetStat.isDirectory()) {
        return res.status(400).json({ ok: false, error: 'Move target must be a folder.' });
      }

      const destinationPath = path.join(targetResolved.targetPath, path.basename(sourceResolved.targetPath));
      try {
        await fs.access(destinationPath);
        return res.status(409).json({ ok: false, error: 'An item with that name already exists in the target folder.' });
      } catch {
        // Destination is available.
      }

      await fs.rename(sourceResolved.targetPath, destinationPath);
      return res.json({
        ok: true,
        path: path.relative(sourceResolved.sandboxRoot, destinationPath)
      });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to move item: ${error.message}` });
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

  app.post('/api/fs/search', apiLimiter, async (req, res) => {
    try {
      const query = String(req.body?.query || '').trim().toLowerCase();
      if (!query) {
        return res.status(400).json({ ok: false, error: 'Search query is required.' });
      }
      const resolved = resolveSandboxPath(WORKSPACE_ROOT, '.', { allowRoot: true });
      const results = [];
      const maxResults = 50;

      async function searchDir(dirPath, relPath) {
        if (results.length >= maxResults) return;
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (results.length >= maxResults) return;
          if (entry.name.startsWith('.')) continue;
          const entryRel = relPath ? `${relPath}/${entry.name}` : entry.name;
          if (entry.name.toLowerCase().includes(query)) {
            results.push({ path: entryRel, type: entry.isDirectory() ? 'directory' : 'file' });
          }
          if (entry.isDirectory()) {
            await searchDir(path.join(dirPath, entry.name), entryRel);
          }
        }
      }

      await searchDir(resolved.targetPath, '');
      return res.json({ ok: true, query, results });
    } catch (error) {
      return res.status(500).json({ ok: false, error: `Failed to search files: ${error.message}` });
    }
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ ok: false, error: 'Unknown AIOS API endpoint.' });
  });

  app.use((_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const server = app.listen(PORT, HOST, () => {
    const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
    console.log(`AIOS running on http://${displayHost}:${PORT}`);
    console.log(`Runtime mode: local-daemon (${HOST === '127.0.0.1' || HOST === 'localhost' ? 'local-only' : `bound to ${HOST}`})`);
    console.log(`Workspace root: ${WORKSPACE_ROOT}`);

    ensureLinuxRuntimeImage().then((result) => {
      if (result.pulled) {
        console.log(`Linux runtime image ready: ${result.image}`);
      } else if (result.ok) {
        console.log(`Linux runtime image already present: ${result.image}`);
      } else {
        console.log(`Linux runtime image not ready: ${result.error || 'unknown'}`);
      }
    }).catch((error) => {
      console.log(`Linux runtime image warmup failed: ${error.message}`);
    });
  });
  attachWebSockets(server);
}

module.exports = { createApp, attachWebSockets };
