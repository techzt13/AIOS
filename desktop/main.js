const path = require('path');
const { app: electronApp, BrowserWindow, ipcMain, shell } = require('electron');
const { createApp, attachWebSockets } = require('../server/index');
const { normalizeBrowserUrl } = require('../server/browserLauncher');

let server = null;
let mainWindow = null;
const browserWindows = new Set();

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
  createMainWindow(baseUrl);
});

// Keep popups from the in-shell <webview> browser inside the AIOS shell
// instead of spawning separate Electron windows.
electronApp.on('web-contents-created', (_event, contents) => {
  if (contents.getType() === 'webview') {
    contents.setWindowOpenHandler(({ url }) => {
      routeUrlIntoShellBrowser(url);
      return { action: 'deny' };
    });
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
