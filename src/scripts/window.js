const { ipcRenderer } = require("electron");

function registerAppButtons() {
  let minBtn = document.getElementById("min-button");
  let maxBtn = document.getElementById("max-button");
  let closeBtn = document.getElementById("close-button");

  minBtn.addEventListener("click", min);
  maxBtn.addEventListener("click", max);
  closeBtn.addEventListener("click", close);
}

function min() {
  ipcRenderer.send("min-window");
}
function max() {
  ipcRenderer.send("max-window");
}
function close() {
  ipcRenderer.send("close-window");
}

registerAppButtons();

