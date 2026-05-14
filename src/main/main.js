const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 200,
    height: 280,
    frame: false,
    transparent: true,
    hasShadow: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    type: 'toolbar', // macOS behavior
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Open DevTools in development if needed
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// IPC Handlers for Window Controls
ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('move-window', (event, { x, y }) => {
  if (mainWindow) {
    const { x: currentX, y: currentY } = mainWindow.getBounds();
    mainWindow.setBounds({
      x: currentX + x,
      y: currentY + y,
      width: 200,
      height: 280
    });
  }
});

ipcMain.handle('get-settings', async () => {
  // TODO: Implement settings store (electron-store)
  return {};
});

ipcMain.on('save-settings', (event, settings) => {
  // TODO: Implement settings store
});

ipcMain.on('copy-to-clipboard', (event, text) => {
  const { clipboard } = require('electron');
  clipboard.writeText(text);
});
