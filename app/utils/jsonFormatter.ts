import * as jsonc from "jsonc-parser";

export type JsonIndentation = "2" | "4" | "tab";

export class JsonFormattingError extends Error {
  readonly line: number;
  readonly column: number;

  constructor(message: string, line: number, column: number) {
    super(`${message} (line ${line}, column ${column}).`);
    this.name = "JsonFormattingError";
    this.line = line;
    this.column = column;
  }
}

export function formatJson(
  source: string,
  options: { minify?: boolean; indentation?: JsonIndentation } = {},
): string {
  if (!source.trim()) return "";

  const errors: jsonc.ParseError[] = [];
  jsonc.parseTree(source, errors, { disallowComments: true, allowTrailingComma: false });
  const error = errors[0];
  if (error) {
    const messages: Partial<Record<jsonc.ParseErrorCode, string>> = {
      [jsonc.ParseErrorCode.InvalidSymbol]: "Invalid JSON symbol",
      [jsonc.ParseErrorCode.PropertyNameExpected]: "Expected a double-quoted property name",
      [jsonc.ParseErrorCode.ValueExpected]: "Expected a JSON value",
      [jsonc.ParseErrorCode.ColonExpected]: "Expected a colon after the property name",
      [jsonc.ParseErrorCode.CommaExpected]: "Expected a comma between values",
      [jsonc.ParseErrorCode.CloseBraceExpected]: "Expected a closing brace",
      [jsonc.ParseErrorCode.CloseBracketExpected]: "Expected a closing bracket",
      [jsonc.ParseErrorCode.EndOfFileExpected]: "Unexpected content after the JSON value",
      [jsonc.ParseErrorCode.InvalidCommentToken]: "Comments are not allowed in JSON",
    };
    const lines = source.slice(0, error.offset).split(/\r\n|\r|\n/);
    throw new JsonFormattingError(
      messages[error.error] ?? "Invalid JSON syntax",
      lines.length,
      (lines.at(-1)?.length ?? 0) + 1,
    );
  }

  if (options.minify) {
    const scanner = jsonc.createScanner(source);
    const tokens: string[] = [];
    for (let token = scanner.scan(); token !== jsonc.SyntaxKind.EOF; token = scanner.scan()) {
      if (token !== jsonc.SyntaxKind.Trivia && token !== jsonc.SyntaxKind.LineBreakTrivia) {
        tokens.push(source.slice(scanner.getTokenOffset(), scanner.getTokenOffset() + scanner.getTokenLength()));
      }
    }
    return tokens.join("");
  }

  const indentation = options.indentation ?? "2";
  return jsonc.applyEdits(
    source,
    jsonc.format(source, undefined, {
      insertSpaces: indentation !== "tab",
      tabSize: indentation === "4" ? 4 : 2,
      eol: "\n",
    }),
  ).trim();
}
