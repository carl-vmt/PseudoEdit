function formatLine(line) {
  getVariables();
  if (line.innerText.length === 0) return null;

  let words = splitIntoWords(line.innerText);
  let elements = [];

  if (words.length === 0 || words === undefined || words === null) return null;

  for (let x = 0; x < words.length; x++) {
    let word = words[x];
    let upperWord = word.toUpperCase();
    let type = getType(word);
    let lastType = getLastType(elements, x);

    if (words.length > x + 1 && word === "<" && words[x + 1] === "-") {
      word = "&#8592;";
      type = "arrow";
      words[x + 1] = "&nbsp;";
    }

    if (lastType === "comment") {
      if (x === words.length - 1) elements.push([word + "</span>", "comment"]);
      else elements.push([word, "comment"]);

      continue;
    }

    if (type === "quotation") {
      if (lastType === "string-open" || lastType === "string-inner")
        elements.push([word + "</span>", "string-close"]);
      else
        elements.push([
          '<span id="c-code" class="c-string">' + word,
          "string-open",
        ]);

      continue;
    }

    if (lastType === "string-open" || lastType === "string-inner") {
      elements.push([word, "string-inner"]);
      continue;
    }

    if (lastType === "string-open" || lastType === "string-inner") {
      elements.push([word, "string-inner"]);
      continue;
    }

    if (type === "slash") {
      if (x + 1 < words.length && getType(words[x + 1]) === "slash")
        elements.push([
          '<span id="c-code" class="c-comment">' + word,
          "comment",
        ]);
      else elements.push(createArray(word, "slash"));

      continue;
    }

    if (type === "space") {
      elements.push(createArray("&nbsp;", "space"));
      continue;
    }

    if (type === "statement") {
      elements.push(createArray(word.toLowerCase(), type));
      continue;
    }

    if (lastType === "variable-keyword") {
      if (/^[a-zA-Z0-9_]+$/.test(word) && !/^[0-9]+$/.test(word)) {
        if (type === "default" || type === "number")
          elements.push(createArray(word, "declarator"));
        else
          elements.push([
            '<span id="c-code" class="c-' +
              type +
              ' c-error">' +
              upperWord +
              "</span>",
            "error",
          ]);
      } else {
        elements.push([
          '<span id="c-code" class="c-declarator c-error">' + word + "</span>",
          "error",
        ]);
      }

      continue;
    }

    switch (type) {
      case "variable-keyword":
      case "modifier":
      case "structure":
      case "console-function":
      case "condition":
      case "loop":
      case "library-function":
      case "class-keyword":
        elements.push(createArray(upperWord, type));
        continue;
    }

    if (getVariableValues().includes(word)) {
      elements.push(createArray(word, "variable"));
      continue;
    }

    if (word === "&") elements.push(createArray("&amp;", type));
    else if (word === "<") elements.push(createArray("&lt;", type));
    else if (word === ">") elements.push(createArray("&gt;", type));
    else elements.push(createArray(word, type));
  }

  let newHTML = "";

  for (let y = 0; y < elements.length; y++) {
    newHTML += elements[y][0];
  }

  if (!newHTML.endsWith("</span>")) newHTML += "</span>";

  return newHTML;
}

function createArray(word, className) {
  return [
    '<span id="c-code" class="c-' + className + '">' + word + "</span>",
    className,
  ];
}

function getType(word) {
  if (word.trim().length === 0) return "space";
  else if (/^[0-9.]+$/.test(word) && !/^[.]+$/.test(word)) return "number";
  else if (word === '"' || word === "'") return "quotation";
  else if (word === "/") return "slash";

  if (statements.includes(word.toLowerCase())) return "statement";

  let upperWord = word.toUpperCase();

  if (!all_keywords.includes(upperWord)) return "default";

  if (variable_keywords.includes(upperWord)) return "variable-keyword";
  else if (modifiers.includes(upperWord)) return "modifier";
  else if (structures.includes(upperWord)) return "structure";
  else if (console_functions.includes(upperWord)) return "console-function";
  else if (conditions.includes(upperWord)) return "condition";
  else if (loops.includes(upperWord)) return "loop";
  else if (library_functions.includes(upperWord)) return "library-function";
  else if (class_keywords.includes(upperWord)) return "class-keyword";
}

function getLastType(word, index) {
  if (word.length === 0 || index === 0) return "null";

  for (x = index - 1; x >= 0; x--) {
    let type = word[x][1];

    if (type !== "space") return type;
  }

  return "null";
}

function splitIntoWords(text) {
  if (text === null) return;
  if (text.length === 0) return;

  let result = [];
  let currentElement = "";

  for (let x = 0; x < text.length; x++) {
    let char = text.charAt(x);

    if (
      x + 5 < text.length &&
      char === "&" &&
      text.charAt(x + 1) === "n" &&
      text.charAt(x + 2) === "b" &&
      text.charAt(x + 3) === "s" &&
      text.charAt(x + 4) === "p" &&
      text.charAt(x + 5) === ";"
    ) {
      x += 5;
      currentElement = "&nbsp;";
      result.push(currentElement);
      currentElement = "";
      continue;
    }

    if (/^[a-zA-Z0-9_]+$/.test(char)) {
      currentElement += char;
      continue;
    }

    if (/^[0-9]+$/.test(currentElement) && char === ".") {
      currentElement += char;
      continue;
    }

    result.push(currentElement);
    result.push(char.toString());
    currentElement = "";
  }

  result.push(currentElement);
  return result.filter((word) => word.length > 0 && word !== "\n");
}

function getVariables() {
  let variables = Array.from(codeBox.getElementsByTagName("*")).filter(
    (element) => element.className === "c-declarator"
  );

  let results = [];

  for (let i = 0; i < variables.length; i++) {
    let element = variables[i];
    let variable = element.innerText;
    let lineIndex =
      Array.from(codeBox.children).indexOf(element.parentElement) + 1;

    results.push([variable, lineIndex]);
  }

  return results;
}

function getVariableValues() {
  let variables = getVariables();
  let results = [];
  for (let i = 0; i < variables.length; i++) {
    results.push(variables[i][0]);
  }
  return results;
}
