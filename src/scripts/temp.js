const { ipcRenderer } = require("electron");

//#region App Buttons
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
//#endregion

//#region MutationObserver
function initChildObserver() {
  let config = { childList: true };
  let callback = (mutationList, _observer) => {
    for (let _mutation of mutationList) {
      cleanEditorUp();
      if (codeBox.childElementCount === 0) {
        resetEditor();
        return;
      }
      cleanLinesUp();

      updateLineNumbers();
      updateGraphics();

      let activeLine = getActiveLine();
      if (activeLine === undefined) {
        return;
      }
      setActiveLine(activeLine);
    }
  };

  let observer = new MutationObserver(callback);
  observer.observe(codeBox, config);
}

initChildObserver();
//#endregion

//#region Event Listeners
function registerEventListeners() {
  window.addEventListener("resize", updateGraphics);

  codeBox.addEventListener("mouseup", updateEditor);
  codeBox.addEventListener("keyup", updateEditor);

  //#region KeyDown Event
  codeBox.addEventListener("keydown", (event) => {
    if (event.isComposing) {
      return;
    }

    if (event.key.includes("Arrow")) {
      let activeLine = getActiveLine();
      if (activeLine === undefined) {
        return;
      }
      let index = Array.from(codeBox.children).indexOf(activeLine);
      let selection = window.getSelection();
      let offset = selection.focusOffset;

      if (event.key === "ArrowDown") {
        index += 1;
        if (index > codeBox.children.length - 1) {
          return;
        }
      } else if (event.key === "ArrowRight") {
        if (
          offset === activeLine.innerText.length ||
          activeLine.innerHTML === "<br>"
        ) {
          index += 1;
          if (index > codeBox.children.length - 1) {
            return;
          }
        }
      } else if (event.key === "ArrowUp") {
        index -= 1;
        if (index < 0) {
          return;
        }
      } else if (event.key === "ArrowLeft") {
        if (offset === 0) {
          index -= 1;
          if (index < 0) {
            return;
          }
        }
      }

      updateEditor(codeBox.children[index], false);
    } else if (event.key === "Tab") {
      event.preventDefault();
      // autoComplete();
    }
  });
  //#endregion

  //#region MouseDown Event
  document.onmousedown = function (event) {
    let target = "target" in event ? event.target : event.srcElement;

    let bannedClasses = [
      "content",
      "editor-container",
      "line-number-container",
      "line-number-box",
      "line-number",
      "buffer",
      "code-box-container",
      "app-button",
      "app-button-box",
    ];

    if (bannedClasses.includes(target.className)) {
      event.preventDefault();
    } else if (codeBox.contains(target)) {
      while (target.className === null || target.className !== "line") {
        if (target === null) {
          return;
        }
        if (target.parentElement === null) {
          return;
        }

        target = target.parentElement;
      }

      updateEditor(target, false);
    }
  };
  //#endregion
}

registerEventListeners();
//#endregion
