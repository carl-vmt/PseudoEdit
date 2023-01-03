const codeBox = document.getElementById("code-box");
const numberBox = document.getElementById("line-number-box");

//#region UpdateEditor
function updateEditor(activeLine, validation) {
  if (validation === undefined) {
    activeLine = getActiveLine();
    if (activeLine === undefined) {
      return;
    }
  }

  setActiveLine(activeLine);

  activeLine = getActiveLine();
  if (activeLine === undefined) {
    return;
  }

  let selection = window.getSelection();
  let position = getCaretPosition(activeLine, selection, {
    pos: 0,
    done: false,
  });

  let newHTML = formatLine(activeLine);
  if (newHTML === null || newHTML === activeLine.innerHTML) {
    return;
  }
  activeLine.innerHTML = newHTML;

  selection.removeAllRanges();
  let range = setCaretPosition(activeLine, document.createRange(), {
    pos: position.pos,
    done: false,
  });
  range.collapse(true);
  selection.addRange(range);
}

function updateLineNumbers() {
  let numbers = numberBox.childElementCount;
  let lines = codeBox.childElementCount;

  if (lines === numbers) {
    return;
  }

  if (lines > numbers) {
    for (let x = numbers + 1; x <= lines; x++) {
      numberBox.innerHTML += '<div class="line-number">' + x + "</div>";
    }
  } else {
    let newHTML = numberBox.innerHTML;

    for (let x = numbers; x > lines; x--) {
      newHTML = newHTML.replace('<div class="line-number">' + x + "</div>", "");
      newHTML = newHTML.replace(
        '<div class="line-number" id="active-number">' + x + "</div>",
        ""
      );
    }

    numberBox.innerHTML = newHTML;
  }
}

function updateGraphics() {
  let buffer = document.getElementById("buffer");
  let content = document.getElementById("content");
  let winHeight = window.innerHeight;

  buffer.style.marginTop = winHeight - 92 + "px";
  content.style.height = winHeight - 65 + "px";
}
//#endregion

//#region Clean Up
function cleanEditorUp() {
  let trash = Array.from(codeBox.children).filter(
    (line) => line.className !== "line"
  );
  for (let x = 0; x < trash.length; x++) {
    trash[x].remove();
  }
}

function cleanLinesUp() {
  let lines = Array.from(codeBox.children).filter(
    (line) => line.className === "line"
  );

  for (let x = 0; x < lines.length; x++) {
    if (lines[x].innerText.length === 0) {
      lines[x].innerHTML = "<br>";
    }
  }
}

function resetEditor() {
  let line = document.createElement("div");
  line.className = "line";
  line.id = "active-line";

  let breakElement = document.createElement("br");

  line.appendChild(breakElement);
  codeBox.appendChild(line);
}
//#endregion

//#region Active Line
function getActiveLine() {
  let sel = window.getSelection();
  let node = sel.focusNode;

  if (node === null) {
    return;
  }

  while (node.className === null || node.className !== "line") {
    if (node === null) {
      return;
    }
    if (node.parentElement === null) {
      return;
    }

    node = node.parentElement;
  }

  return node;
}

function setActiveLine(line) {
  let activeline = document.getElementById("active-line");
  let activeNumber = document.getElementById("active-number");

  if (activeline === line) {
    return;
  }
  if (activeline !== undefined && activeline !== null) {
    activeline.removeAttribute("id");
  }
  if (activeNumber !== undefined && activeNumber !== null) {
    activeNumber.removeAttribute("id");
  }

  line.id = "active-line";

  let index = Array.from(codeBox.children).indexOf(line);
  let number = numberBox.children[index];
  number.id = "active-number";
}
//#endregion

//#region Caret Position
function setCaretPosition(parent, range, stat) {
  if (stat.done) {
    return range;
  }
  if (parent.childNodes.length == 0) {
    if (parent.textContent.length >= stat.pos) {
      range.setStart(parent, stat.pos);
      stat.done = true;
    } else {
      stat.pos = stat.pos - parent.textContent.length;
    }
  } else {
    for (var i = 0; i < parent.childNodes.length && !stat.done; i++) {
      currentNode = parent.childNodes[i];
      setCaretPosition(currentNode, range, stat);
    }
  }
  return range;
}

function getCaretPosition(parent, sel, stat) {
  let node = sel.focusNode;
  let offset = sel.focusOffset;
  if (stat.done) {
    return stat;
  }
  let currentNode = null;
  if (parent.childNodes.length == 0) {
    stat.pos += parent.textContent.length;
  } else {
    for (var i = 0; i < parent.childNodes.length && !stat.done; i++) {
      currentNode = parent.childNodes[i];
      if (currentNode === node) {
        stat.pos += offset;
        stat.done = true;
        return stat;
      } else getCaretPosition(currentNode, sel, stat);
    }
  }
  return stat;
}
//#endregion
