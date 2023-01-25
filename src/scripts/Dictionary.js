const variable_keywords = ["INTEGER", "STRING", "REAL", "CHAR", "BOOLEAN"];

const modifiers = ["DECLARE", "CONSTANT", "STATIC", "PUBLIC", "PRIVATE"];

const statements = ["false", "true", "break", "continue", "return"];

const structures = ["ARRAY", "LIST", "MAP"];

const console_functions = ["INPUT", "OUTPUT", "PRINT"];

const conditions = [
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
  "OF"
];

const loops = [
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
];

const library_functions = [
  "MOD",
  "DIV",
  "ROUND",
  "RANDOM",
  "LENGTH",
  "SUBSTRING",
  "UPPER",
  "LOWER",
  "UPPERCASE",
  "LOWERCASE",
  "OPEN",
  "WRITE",
  "READ",
  "OPENFILE",
  "WRITEFILE",
  "READFILE",
  "CLOSEFILE",
];

const class_keywords = [
  "PROCEDURE",
  "ENDPROCEDURE",
  "CALL",
  "FUNCTION",
  "ENDFUNCTION",
  "RETURNS",
];

const all_keywords = variable_keywords.concat(
  modifiers,
  statements,
  structures,
  console_functions,
  conditions,
  loops,
  library_functions,
  class_keywords
);
