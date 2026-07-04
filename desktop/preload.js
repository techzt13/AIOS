const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aiosNative', {
  runtime: 'electron-desktop',
  openBrowserUrl: (url) => ipcRenderer.invoke('aios:native-browser-open', url),
  openExternalUrl: (url) => ipcRenderer.invoke('aios:external-open', url),
  onBrowserNavigate: (callback) => {
    ipcRenderer.on('aios:browser-navigate', (_event, url) => callback(url));
  }
});
