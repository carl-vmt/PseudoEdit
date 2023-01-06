function formatLine(line) {
  const words = splitUp(line.innerText);
  const elements = [];

  if (words.length === 0) return null;

  for (var x = 0; x < words.length; x++) {
    const el = words[x];
    const uel = el.toUpperCase();
    const type = getType(el);
    const lastType = getLastType(elements, x);

    // COMMENTS
    if (lastType === "comment") {
      if (x === words.length - 1) {
        elements.push([el + "</span>", "comment"]);
        continue;
      }

      elements.push([el, "comment"]);
      continue;
    }

    // STRINGS
    if (type === "quotation") {
      if (lastType === "string-open" || lastType === "string-inner") {
        elements.push([el + "</span>", "string-close"]);
        continue;
      }

      elements.push([
        '<span id="c-code" class="c-string">' + el,
        "string-open",
      ]);
      continue;
    }

    if (lastType === "string-open" || lastType === "string-inner") {
      elements.push([el, "string-inner"]);
      continue;
    }

    if (lastType === "string-open" || lastType === "string-inner") {
      elements.push([el, "string-inner"]);
      continue;
    }

    // COMMENTS
    if (type === "slash") {
      if (x + 1 < words.length && getType(words[x + 1]) === "slash") {
        elements.push(['<span id="c-code" class="c-comment">' + el, "comment"]);
        continue;
      }

      elements.push(createArray("slash", el));
      continue;
    }

    switch (type) {
      case "space":
        elements.push(createArray("space", "&nbsp;"));
        continue;

      case "bool-value":
        elements.push(createArray(type, el));
        continue;
    }

    if (lastType === "keyword") {
      if (
        /^[a-zA-Z0-9_]+$/.test(el) &&
        !/^[0-9]+$/.test(el)
      ) {
        if (type === "default" || type === "number") {
          elements.push(createArray("declarator", el));
          continue;
        }
      }

      elements.push([
        '<span id="c-code" class="c-error">' + el + "</span>",
        "error",
      ]);
      continue;
    }

    // Handle Keywords, Modifiers, Structures, Console Statements, Conditions, Library functions and Loops
    switch (type) {
      case "keyword":
      case "modifier":
      case "structure":
      case "console":
      case "condition":
      case "loop":
      case "library":
      case "procedure":
        elements.push(createArray(type, uel));
        continue;
    }

    //default
    elements.push(createArray(type, el));
  }

  var newHTML = "";

  for (var y = 0; y < elements.length; y++) {
    newHTML += elements[y][0];
  }

  return newHTML;
}

function createArray(type, el) {
  return ['<span id="c-code" class="c-' + type + '">' + el + "</span>", type];
}

function getType(el) {
  // WHITE SPACE
  if (el.trim().length === 0) {
    return "space";
  }

  // NUMBER
  if (/^\d+$/.test(el)) {
    return "number";
  }

  switch (el.toUpperCase()) {
    case '"':
      return "quotation";

    case "/":
      return "slash";

    case "INTEGER":
    case "STRING":
    case "REAL":
    case "CHAR":
    case "BOOLEAN":
      return "keyword";

    case "DECLARE":
    case "CONSTANT":
    case "STATIC":
    case "PUBLIC":
    case "PRIVATE":
      return "modifier";

    case "FALSE":
    case "TRUE":
    case "BREAK":
    case "CONTINUE":
    case "RETURN":
      return "bool-value";

    case "ARRAY":
    case "LIST":
    case "MAP":
      return "structure";

    case "INPUT":
    case "OUTPUT":
    case "PRINT":
      return "console";

    case "IF":
    case "ELSE":
    case "THEN":
    case "ENDIF":
    case "AND":
    case "OR":
    case "NOT":
    case "CASE":
    case "ENDCASE":
    case "OTHERWISE":
      return "condition";

    case "FOR":
    case "TO":
    case "STEP":
    case "NEXT":
    case "WHILE":
    case "DO":
    case "ENDWHILE":
    case "REPEAT":
    case "UNTIL":
    case "LOOP":
    case "ENDLOOP":
      return "loop";

    case "MOD":
    case "DIV":
    case "ROUND":
    case "RANDOM":
    case "LENGTH":
    case "SUBSTRING":
    case "UPPER":
    case "LOWER":
    case "UCASE":
    case "LCASE":
    case "OPEN":
    case "WRITE":
    case "READ":
    case "OPENFILE":
    case "WRITEFILE":
    case "READFILE":
    case "CLOSEFILE":
      return "library";

    case "PROCEDURE":
    case "ENDPROCEDURE":
    case "CALL":
    case "FUNCTION":
    case "ENDFUNCTION":
    case "RETURNS":
      return "procedure";
  }

  return "default";
}

function getLastType(elements, i) {
  if (elements.length === 0 || i === 0) {
    return "null";
  }

  for (x = i - 1; x >= 0; x--) {
    const type = elements[x][1];

    if (type === "space") continue;

    return type;
  }

  return "null";
}

function splitUp(text) {
  if (text === null) return;
  if (text.length === 0) return;

  const result = [];
  var currentElement = "";

  for (var x = 0; x < text.length; x++) {
    const char = text.charAt(x);

    if (/^[a-zA-Z0-9_]+$/.test(char)) {
      currentElement += char;
      continue;
    }

    result.push(currentElement);
    currentElement = char.toString();

    result.push(currentElement);
    currentElement = "";
  }

  result.push(currentElement);
  return result.filter((word) => word.length > 0 && word !== "\n");
}
