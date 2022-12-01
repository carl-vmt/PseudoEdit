const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");

app.whenReady().then(() => {
  setSecurityPolicy();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "PseudoEdit",
    backgroundColor: "#151515",
    show: false,
    width: 576,
    height: 325,
    minWidth: 576,
    minHeight: 325,
    frame: false,
    icon: path.join(__dirname, "..", "resources", "icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  
  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));

  enableIpcCallbacks(mainWindow);

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.openDevTools();
  });
}

function setSecurityPolicy() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'; style-src-elem 'self' https://fonts.googleapis.com/; font-src https://fonts.gstatic.com/",
        ],
      },
    });
  });
}

function enableIpcCallbacks(mainWindow) {
  ipcMain.on("min-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("max-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    mainWindow.close();
  });
}
