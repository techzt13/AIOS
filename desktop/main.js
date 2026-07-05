const path = require('path');
const fs = require('fs');
const { app: electronApp, BrowserWindow, ipcMain, shell, desktopCapturer } = require('electron');
const { createApp, attachWebSockets } = require('../server/index');
const { normalizeBrowserUrl } = require('../server/browserLauncher');

let server = null;
let mainWindow = null;
const browserWindows = new Set();
let workspaceRoot = path.join(process.cwd(), 'workspace');

async function fetchWorkspaceRoot() {
  try {
    const address = server?.address?.();
    if (!address) return;
    const res = await fetch(`http://127.0.0.1:${address.port}/api/runtime`);
    const payload = await res.json();
    if (payload.ok && payload.runtime?.workspaceRoot) {
      workspaceRoot = payload.runtime.workspaceRoot;
    }
  } catch {
    // Best effort.
  }
}

function startAiosServer() {
  return new Promise((resolve, reject) => {
    const expressApp = createApp();
    const listener = expressApp.listen(0, '127.0.0.1', () => {
      server = listener;
      attachWebSockets(server);
      const address = listener.address();
      resolve(`http://127.0.0.1:${address.port}`);
    });
    listener.once('error', reject);
  });
}

function createMainWindow(baseUrl) {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 650,
    title: 'AIOS',
    backgroundColor: '#111827',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true
    }
  });

  mainWindow.loadURL(baseUrl);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    routeUrlIntoShellBrowser(url);
    return { action: 'deny' };
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createBrowserWindow(value) {
  const url = normalizeBrowserUrl(value);
  const browserWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 760,
    minHeight: 520,
    title: 'AIOS Browser',
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  browserWindows.add(browserWindow);
  browserWindow.on('closed', () => {
    browserWindows.delete(browserWindow);
  });
  browserWindow.webContents.setWindowOpenHandler(({ url: popupUrl }) => {
    openBrowserOrExternal(popupUrl);
    return { action: 'deny' };
  });
  browserWindow.webContents.on('page-title-updated', (_event, title) => {
    browserWindow.setTitle(title ? `AIOS Browser - ${title}` : 'AIOS Browser');
  });
  browserWindow.loadURL(url);

  return {
    ok: true,
    url,
    mode: 'electron-browser-window',
    windowCount: browserWindows.size
  };
}

function openBrowserOrExternal(url) {
  try {
    createBrowserWindow(url);
  } catch {
    let protocol = '';
    try {
      protocol = new URL(url).protocol;
    } catch {
      console.error('Blocked malformed popup URL.');
      return;
    }

    if (!['mailto:', 'tel:'].includes(protocol)) {
      console.error(`Blocked unsupported popup protocol: ${protocol}`);
      return;
    }

    shell.openExternal(url).catch((error) => {
      console.error(`Failed to open external URL: ${error.message}`);
    });
  }
}

function routeUrlIntoShellBrowser(url) {
  let protocol = '';
  try {
    protocol = new URL(url).protocol;
  } catch {
    console.error('Blocked malformed popup URL.');
    return;
  }

  if (['mailto:', 'tel:'].includes(protocol)) {
    shell.openExternal(url).catch((error) => {
      console.error(`Failed to open external URL: ${error.message}`);
    });
    return;
  }

  if (!['http:', 'https:'].includes(protocol)) {
    console.error(`Blocked unsupported popup protocol: ${protocol}`);
    return;
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('aios:browser-navigate', url);
    mainWindow.focus();
  } else {
    openBrowserOrExternal(url);
  }
}

ipcMain.handle('aios:native-browser-open', async (_event, value) => createBrowserWindow(value));
ipcMain.handle('aios:external-open', async (_event, value) => {
  const url = normalizeBrowserUrl(value);
  await shell.openExternal(url);
  return { ok: true, url, mode: 'system-external-browser' };
});

electronApp.whenReady().then(async () => {
  const baseUrl = await startAiosServer();
  await fetchWorkspaceRoot();
  createMainWindow(baseUrl);
});

// Keep popups from the in-shell <webview> browser inside the AIOS shell
// instead of spawning separate Electron windows.
electronApp.on('web-contents-created', (_event, contents) => {
  if (contents.getType() === 'webview') {
    // Present as plain Chrome so sites don't block the embedded browser.
    contents.setUserAgent(contents.getUserAgent().replace(/\sElectron\/[\d.]+/i, '').replace(/\sAIOS\/[\d.]+/i, ''));
    contents.setWindowOpenHandler(({ url }) => {
      routeUrlIntoShellBrowser(url);
      return { action: 'deny' };
    });

    // Track downloads from the in-shell browser and save them to the workspace.
    contents.session.on('will-download', (_event, item) => {
      const downloadsDir = path.join(workspaceRoot, 'Downloads');
      fs.mkdirSync(downloadsDir, { recursive: true });
      const savePath = path.join(downloadsDir, item.getFilename());
      item.setSavePath(savePath);

      const downloadId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const send = (payload) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('aios:download-update', payload);
        }
      };

      send({
        id: downloadId,
        filename: item.getFilename(),
        url: item.getURL(),
        state: 'progressing',
        received: 0,
        total: item.getTotalBytes(),
        path: savePath
      });

      item.on('updated', (_evt, state) => {
        send({
          id: downloadId,
          filename: item.getFilename(),
          url: item.getURL(),
          state,
          received: item.getReceivedBytes(),
          total: item.getTotalBytes(),
          path: savePath
        });
      });

      item.once('done', (_evt, state) => {
        send({
          id: downloadId,
          filename: item.getFilename(),
          url: item.getURL(),
          state,
          received: item.getReceivedBytes(),
          total: item.getTotalBytes(),
          path: savePath,
          done: true
        });
      });
    });
  }
});

ipcMain.handle('aios:screenshot', async (_event, { sourceId } = {}) => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    const source = sourceId
      ? sources.find((s) => s.id === sourceId)
      : sources[0];
    if (!source) {
      return { ok: false, error: 'No screen source available.' };
    }
    const screenshotsDir = path.join(workspaceRoot, 'Screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });
    const filename = `Screenshot-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    const savePath = path.join(screenshotsDir, filename);
    fs.writeFileSync(savePath, source.thumbnail.toPNG());
    const relativePath = path.relative(workspaceRoot, savePath);
    return { ok: true, path: savePath, relativePath, filename };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

electronApp.on('activate', async () => {
  if (!mainWindow) {
    const baseUrl = server ? `http://127.0.0.1:${server.address().port}` : await startAiosServer();
    createMainWindow(baseUrl);
  }
});

electronApp.on('before-quit', () => {
  if (server) {
    server.close();
    server = null;
  }
});

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electronApp.quit();
  }
});
