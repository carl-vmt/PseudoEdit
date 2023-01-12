const {
  app,
  BrowserWindow,
  ipcMain,
  session,
  globalShortcut,
} = require("electron");
const path = require("path");

app.whenReady().then(() => {
  globalShortcut.register("CommandOrControl+T", () => {
    let windows = BrowserWindow.getAllWindows();
    for (i in windows) {
      windows[i].webContents.openDevTools();
    }
  });
  setSecurityPolicy();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function createWindow() {
  const window = new BrowserWindow({
    show: false,
    title: "PseudoEdit",
    tabbingIdentifier: "PseudoEdit",
    frame: false,
    minWidth: 576,
    minHeight: 325,
    width: 1000,
    height: 560,
    icon: path.join(__dirname, "..", "resources", "icon.ico"),
    backgroundColor: "#151515",
    webPreferences: {
      disableBlinkFeatures: "Auxclick",
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadFile(path.join(__dirname, "..", "index.html"));
  enableIpcCallbacks(window);

  window.once("ready-to-show", () => {
    window.show();
    window.focus();
  });
}

function setSecurityPolicy() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["default-src 'self';"],
      },
    });
  });
}

function enableIpcCallbacks(window) {
  ipcMain.on("min-window", () => {
    window.minimize();
  });

  ipcMain.on("max-window", () => {
    if (window.isFullScreen()) {
      window.setFullScreen(false);
      window.unmaximize();
    } else if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    window.close();
  });
}
