const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Allow loading local files
    }
  });

  win.loadFile(path.join(__dirname, 'dist/index.html'))
    .catch(e => console.error('Failed to load app:', e));

  // Open dev tools and handle errors
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Uncomment next line to open DevTools on start
  win.webContents.openDevTools();

  // Prevent window from closing immediately
  win.on('close', (e) => {
    console.log('Window closing...');
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});