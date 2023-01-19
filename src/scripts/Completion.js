const intelliBox = document.getElementById("intelli-box");
const keywords = [
  "INTEGER",
  "STRING",
  "REAL",
  "CHAR",
  "BOOLEAN",

  "DECLARE",
  "CONSTANT",
  "STATIC",
  "PUBLIC",
  "PRIVATE",

  "FALSE",
  "TRUE",
  "BREAK",
  "CONTINUE",
  "RETURN",

  "ARRAY",
  "LIST",
  "MAP",

  "INPUT",
  "OUTPUT",
  "PRINT",

  "IF",
  "ELSE",
  "THEN",
  "ENDIF",
  "AND",
  "OR",
  "NOT",
  "CASE",
  "ENDCASE",
  "OTHERWISE",

  "FOR",
  "TO",
  "STEP",
  "NEXT",
  "WHILE",
  "DO",
  "ENDWHILE",
  "REPEAT",
  "UNTIL",
  "LOOP",
  "ENDLOOP",

  "MOD",
  "DIV",
  "ROUND",
  "RANDOM",
  "LENGTH",
  "SUBSTRING",
  "UPPER",
  "LOWER",
  "UCASE",
  "LCASE",
  "OPEN",
  "WRITE",
  "READ",
  "OPENFILE",
  "WRITEFILE",
  "READFILE",
  "CLOSEFILE",

  "PROCEDURE",
  "ENDPROCEDURE",
  "CALL",
  "FUNCTION",
  "ENDFUNCTION",
  "RETURNS",

  "<-",
];
var selectionIndex = 0;

function updateIntelliBox() {
  let results = [];
  let sel = window.getSelection();
  let target = sel.focusNode;

  //#region Find target div.
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
  //#endregion

  let text = target.innerText.toUpperCase();

  //#region Return if Content of target is emtpy
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
  //#endregion

  results = keywords.filter((word) => word.startsWith(text));
  let newHTML = "";

  //#region Set the innerHTML of intelliBox
  let firstHalf = text;

  for (let i = 0; i < results.length; i++) {
    let secondHalf = results[i].substring(text.length, results[i].length);

    let inner = createSpan("blue", firstHalf);
    inner += createSpan("white", secondHalf);

    newHTML += createSpan("prediction", inner);
    newHTML += "<br>";
  }

  intelliBox.innerHTML = newHTML;
  //#endregion

  let content = intelliBox.innerText;

  if (content === text || content.length === 0) {
    intelliBox.style.display = "none";
    selectionIndex = 0;
    return;
  }

  let topOffset = target.getBoundingClientRect().top;
  let bottomOffset = target.getBoundingClientRect().bottom;
  let rightOffset = target.getBoundingClientRect().right;

  if (topOffset <= window.innerHeight / 2)
    intelliBox.style.top = topOffset + 20 + "px";
  else
    intelliBox.style.top = bottomOffset - 22 - intelliBox.offsetHeight + "px";

  intelliBox.style.left = rightOffset + 3 + "px";

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
