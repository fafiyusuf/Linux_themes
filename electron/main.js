/**
 * electron/main.js
 * Electron main process entry point.
 *
 * In development: loads the Vite dev server at localhost:5173
 * In production: loads the built index.html from dist/
 */

'use strict';

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { registerHandlers } = require('./ipc/handlers.js');

const isDev = process.env.NODE_ENV !== 'production';
const DEV_URL = 'http://localhost:5173';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 900,
    minHeight: 600,
    title: 'Aura',
    backgroundColor: '#111114',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,    // renderer never gets Node.js access
      sandbox: false,            // preload needs require()
    },
    // Platform window chrome
    titleBarStyle: process.platform === 'linux' ? 'default' : 'hiddenInset',
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    // Uncomment to open DevTools by default during development:
    // win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  return win;
}

function setupMenu() {
  // Minimal menu — remove the default Electron menu in production
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }
}

app.whenReady().then(() => {
  registerHandlers();
  setupMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
