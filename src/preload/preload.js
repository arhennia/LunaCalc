const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('luna', {
  minimize: () => ipcRenderer.send('minimize-window'),
  quit: () => ipcRenderer.send('close-app'),
  moveWindow: (x, y) => ipcRenderer.send('move-window', { x, y }),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  copyToClipboard: (text) => ipcRenderer.send('copy-to-clipboard', text),
});
