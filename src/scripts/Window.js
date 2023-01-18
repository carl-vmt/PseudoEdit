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
    
    updateEditor();

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
      // autoComplete();
    }
  });
  //#endregion

  //#region MouseDown Event
  document.onmousedown = function (event) {
    updateEditor();

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

    if (target.className === "line-number") {
      let index = Array.from(numberBox.children).indexOf(target);
      let line = codeBox.children[index];
      let range = document.createRange();

      range.setStart(line, 0);

      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      range.collapse(true);

      updateEditor();

      range.collapse(false);
      range.setEndAfter(line, line.childElementCount);
      selection.removeAllRanges();
      selection.addRange(range);

      updateEditor();
    }

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

  //#region Paste Event
  codeBox.onpaste = function (event) {
    //#region Get the pasted text
    event.preventDefault();

    let pastedData = (event.originalEvent || event).clipboardData.getData(
      "text/plain"
    );

    if (pastedData.length === 0) {
      return;
    }

    pastedLines = Array.from(pastedData.split("\n")).filter(
      (line) => line.length > 0
    );

    for (let i = 0; i < pastedLines.length; i++) {
      pastedLines[i] = pastedLines[i].replaceAll("\r", "");
    }

    //#endregion

    //#region Manage the first line
    let activeLine = getActiveLine();
    if (activeLine === null || activeLine === undefined) {
      return;
    }

    let selection = window.getSelection();

    let caretPosition = getCaretPosition(activeLine, selection, {
      pos: 0,
      done: false,
    }).pos;
    let firstHalf = activeLine.innerText.substring(0, caretPosition);
    let secondHalf = activeLine.innerText.substring(caretPosition);

    if (pastedLines.length === 1) {
      activeLine.innerHTML = firstHalf + pastedLines[0] + secondHalf;
      activeLine.innerHTML = formatLine(activeLine);

      selection.removeAllRanges();
      let range = setCaretPosition(activeLine, document.createRange(), {
        pos: firstHalf.length + pastedLines[0].length,
        done: false,
      });
      range.collapse(true);
      selection.addRange(range);

      return;
    } else {
      activeLine.innerHTML = firstHalf + pastedLines[0];
      activeLine.innerHTML = formatLine(activeLine);
    }
    //#endregion

    //#region Manage all lines except first and last one
    let lastLine = activeLine;

    for (let i = 1; i < pastedLines.length - 1; i++) {
      let text = pastedLines[i];

      let line = document.createElement("div");
      line.className = "line";
      line.innerHTML = text;
      line.innerHTML = formatLine(line);
      codeBox.appendChild(line);
      codeBox.insertBefore(line, lastLine.nextSibling);
      lastLine = line;
    }
    //#endregion

    //#region Manage last line
    let line = document.createElement("div");
    line.className = "line";
    let text = pastedLines[pastedLines.length - 1];
    line.innerHTML = text + secondHalf;
    line.innerHTML = formatLine(line);
    codeBox.appendChild(line);
    codeBox.insertBefore(line, lastLine.nextSibling);
    lastLine = line;

    selection.removeAllRanges();
    let range = setCaretPosition(lastLine, document.createRange(), {
      pos: text.length,
      done: false,
    });
    range.collapse(true);
    selection.addRange(range);
    //#endregion

    cleanEditorUp();
    cleanLinesUp();

    updateLineNumbers();
    updateGraphics();
    updateEditor();
  };
  //#endregion

  //#region Cut and Copy Events
  codeBox.oncut = function (event) {
    selectedText = window.getSelection().toString();
    navigator.clipboard.writeText(selectedText);
  };

  codeBox.oncopy = function (event) {
    selectedText = window.getSelection().toString();
    navigator.clipboard.writeText(selectedText);
  };
  //#endregion
}

registerEventListeners();
//#endregion
