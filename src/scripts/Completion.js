const intelliBox = document.getElementById("intelli-box");
var selectionIndex = 0;

function updateIntelliBox() {
  let results = [];
  let sel = window.getSelection();
  let target = sel.focusNode;

  while (
    target === undefined ||
    target === null ||
    target.id !== "c-code" ||
    target.className === "c-declarator" ||
    target.className === "c-string" ||
    target.className === "c-comment" ||
    target.className === "c-number"
  ) {
    target = target.parentElement;

    if (target.parentElement === undefined || target.parentElement === null) {
      intelliBox.style.display = "none";
      selectionIndex = 0;
      return;
    }
  }
  let text = target.innerText.toUpperCase();

  if (
    text === "" ||
    text.trim().length === 0 ||
    text === "nbsp;" ||
    text === " "
  ) {
    intelliBox.style.display = "none";
    selectionIndex = 0;
    return;
  }

  results = all_keywords
    .concat(getVariableValues())
    .filter((word) => word.toUpperCase().startsWith(text));
  let newHTML = "";

  for (let i = 0; i < results.length; i++) {
    let secondHalf = results[i].substring(text.length);
    let inner = "";

    if (statements.includes(results[i]))
      inner += createSpan("blue", text.toLowerCase());
    else if (getVariableValues().includes(results[i]))
      inner += createSpan("blue", results[i].substring(0, text.length));
    else inner += createSpan("blue", text);

    inner += createSpan("white", secondHalf);

    newHTML += createSpan("prediction", inner);
    newHTML += "<br>";
  }

  intelliBox.innerHTML = newHTML;

  let content = intelliBox.innerText;

  if (content === text || content.length === 0) {
    intelliBox.style.display = "none";
    selectionIndex = 0;
    return;
  }

  let topOffset = target.getBoundingClientRect().top;
  let rightOffset = target.getBoundingClientRect().right;

  if (topOffset <= window.innerHeight / 2) {
    intelliBox.style.top = topOffset + 20 + "px";
    intelliBox.style.bottom = "auto";
  } else {
    intelliBox.style.bottom = window.innerHeight - topOffset + 5 + "px";
    intelliBox.style.top = "auto";
  }

  if (rightOffset <= (window.innerWidth / 3) * 2) {
    intelliBox.style.left = rightOffset + 3 + "px";
    intelliBox.style.right = "auto";
  } else {
    intelliBox.style.right = window.innerWidth - rightOffset + 3 + "px";
    intelliBox.style.left = "auto";
  }

  updateSelection();
  intelliBox.style.display = "block";
}

function createSpan(type, el) {
  return '<span class="' + type + '">' + el + "</span>";
}

function updateSelection() {
  let active = document.getElementsByClassName("active-prediction")[0];
  if (active !== null && active !== undefined) {
    active.className = "prediction";
  }

  getPredictions()[selectionIndex].className = "active-prediction";
}

function getPredictions() {
  return Array.from(intelliBox.children).filter(
    (elem) => elem.innerHTML.length > 0
  );
}

function autoComplete() {
  let selection = window.getSelection();
  let target = selection.focusNode;

  while (
    target === undefined ||
    target === null ||
    target.id !== "c-code" ||
    target.className === "c-declarator" ||
    target.className === "c-string" ||
    target.className === "c-comment" ||
    target.className === "c-number"
  ) {
    target = target.parentElement;

    if (target.parentElement === undefined || target.parentElement === null) {
      return;
    }
  }

  let activeLine = getActiveLine();
  let position = getCaretPosition(activeLine, selection, {
    pos: 0,
    done: false,
  });

  let oldLength = target.innerText.length;
  target.innerHTML = getPredictions()[selectionIndex].innerText;
  target.innerHTML += "&nbsp;";
  let newLength = target.innerText.length;

  selection.removeAllRanges();
  let range = setCaretPosition(activeLine, document.createRange(), {
    pos: position.pos + (newLength - oldLength),
    done: false,
  });
  range.collapse(true);
  selection.addRange(range);

  updateEditor();
}
