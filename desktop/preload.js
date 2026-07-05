const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aiosNative', {
  runtime: 'electron-desktop',
  openBrowserUrl: (url) => ipcRenderer.invoke('aios:native-browser-open', url),
  openExternalUrl: (url) => ipcRenderer.invoke('aios:external-open', url),
  onBrowserNavigate: (callback) => {
    ipcRenderer.on('aios:browser-navigate', (_event, url) => callback(url));
  },
  onDownloadUpdate: (callback) => {
    ipcRenderer.on('aios:download-update', (_event, payload) => callback(payload));
  },
  takeScreenshot: (options) => ipcRenderer.invoke('aios:screenshot', options || {})
});
