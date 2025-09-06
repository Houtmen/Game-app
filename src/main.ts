import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import './lan-main';
import './lan-broadcast';

function createWindow() {
  // Log app start
  log.info('Lobby App started');
  // Auto-update logic
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.logger = log;
  autoUpdater.on('update-available', () => {
  log.info('Update available');
    win.webContents.send('update-available');
  });
  autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded');
    win.webContents.send('update-downloaded');
  });
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadFile(path.join(__dirname, 'index.html'));

  // Prevent navigation to external URLs
  win.webContents.on('will-navigate', (event, url) => {
  log.warn('Blocked navigation to:', url);
    if (url !== win.webContents.getURL()) {
      event.preventDefault();
    }
  });
  win.webContents.setWindowOpenHandler(() => {
  log.warn('Blocked window open attempt');
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
