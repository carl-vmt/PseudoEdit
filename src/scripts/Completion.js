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
  "END",

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
var results = [];

function updateIntelliBox() {
  results = [];

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
      return;
    }
  }

  let text = target.innerText;

  if (
    text === "" ||
    text.trim().length === 0 ||
    text === "nbsp;" ||
    text === " "
  ) {
    intelliBox.style.display = "none";
    return;
  }

  results = keywords.filter((word) => word.startsWith(text.toUpperCase()));
  intelliBox.innerHTML = "";

  for (let i = 0; i < results.length; i++) {
    let keyStart = text.toUpperCase();
    let keyEnd = results[i].substring(text.length, results[i].length);

    if (i === 0) {
      intelliBox.innerHTML += createSpan("blue-strong", keyStart);
      intelliBox.innerHTML += createSpan("white-strong", keyEnd);
    } else {
      intelliBox.innerHTML += createSpan("blue", keyStart);
      intelliBox.innerHTML += createSpan("white", keyEnd);
    }
    intelliBox.innerHTML += "<br>";
  }

  let content = intelliBox.innerText.toUpperCase().replace(/\s/g, "");

  if (content === text.toUpperCase() || content.length === 0) {
    intelliBox.style.display = "none";
    return;
  }

  intelliBox.style.display = "block";

  let topOffset = target.getBoundingClientRect().top;
  let bottomOffset = target.getBoundingClientRect().bottom;
  let rightOffset = target.getBoundingClientRect().right;

  if (topOffset <= window.innerHeight / 2)
    intelliBox.style.top = topOffset + 20 + "px";
  else
    intelliBox.style.top = bottomOffset - 22 - intelliBox.offsetHeight + "px";

  intelliBox.style.left = rightOffset + 3 + "px";
  intelliBox.style.position = "absolute";
}

function createSpan(type, el) {
  return '<span class="' + type + '">' + el + "</span>";
}

function autoComplete() {
  let sel = window.getSelection();
  let node = sel.focusNode;
  let target = getTarget(node);

  if (target === undefined) return;

  let offset = sel.focusOffset;
  let pos = getCaretPosition(target, node, offset, {
    pos: 0,
    done: false,
  });

  if (results.length === 0) {
    if (node.id === "") {
      target.innerText = "tab";
    }
    if (node.parentElement.id === "c-code") {
    }
    updateEditor();
    return;
  }

  let span = node.parentElement;
  let oldLength = span.innerText.length;
  span.innerHTML = results[0];
  span.innerHTML += "&nbsp;";
  let newLength = span.innerText.length;

  sel.removeAllRanges();
  let range = setCaretPosition(target, document.createRange(), {
    pos: pos.pos - oldLength + newLength,
    done: false,
  });
  range.collapse(true);
  sel.addRange(range);

  updateEditor();
}
