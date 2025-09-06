// preload.js: Expose startGame to renderer via contextBridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startGame: (gameId, exePath) => ipcRenderer.invoke('start-game', gameId, exePath),
  lanBroadcast: (data) => ipcRenderer.invoke('lan-broadcast', data),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback)
});
