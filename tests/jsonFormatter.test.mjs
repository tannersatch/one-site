import assert from "node:assert/strict";
import { test } from "node:test";
import { formatJson, JsonFormattingError } from "../app/utils/jsonFormatter.ts";

test("formats nested JSON using two spaces by default", () => {
  assert.equal(
    formatJson("{\"user\":{\"name\":\"Tanner\"},\"items\":[1,true,null]}"),
    "{\n  \"user\": {\n    \"name\": \"Tanner\"\n  },\n  \"items\": [\n    1,\n    true,\n    null\n  ]\n}",
  );
});

test("supports four spaces and tabs", () => {
  assert.equal(formatJson("{\"ok\":true}", { indentation: "4" }), "{\n    \"ok\": true\n}");
  assert.equal(formatJson("{\"ok\":true}", { indentation: "tab" }), "{\n\t\"ok\": true\n}");
});

test("minifies without removing spaces or escapes inside strings", () => {
  const compact = "{\"message\":\"hello world\",\"escaped\":\"line\\nnext\",\"values\":[true,null]}";
  assert.equal(formatJson(formatJson(compact), { minify: true }), compact);
});

test("preserves unsafe integers, number spelling, exponent values, and negative zero", () => {
  const source = "{\"id\":9007199254740993,\"tiny\":1.2300e-400,\"huge\":1e400,\"zero\":-0}";
  assert.equal(formatJson(formatJson(source), { minify: true }), source);
});

test("accepts primitive and collection root values", () => {
  for (const source of ["true", "false", "null", "7", "\"hello\"", "[1,2]", "{}", "[]"]) {
    assert.equal(formatJson(source, { minify: true }), source);
  }
});

test("rejects malformed JSON, comments, trailing commas, and multiple roots", () => {
  for (
    const source of [
      "{bad:1}",
      "{\"ok\":}",
      "{\"a\":1,}",
      "[1,]",
      "// comment\n{}",
      "{/* comment */}",
      "{} {}",
      "\"unterminated",
      "undefined",
    ]
  ) {
    assert.throws(() => formatJson(source), JsonFormattingError);
    assert.throws(() => formatJson(source, { minify: true }), JsonFormattingError);
  }
});

test("reports the first error's line and column", () => {
  assert.throws(() => formatJson("{\n  \"bad\": }"), error => {
    assert.ok(error instanceof JsonFormattingError);
    assert.equal(error.line, 2);
    assert.equal(error.column, 10);
    return true;
  });
});

test("keeps duplicate properties rather than silently dropping data", () => {
  const source = "{\"key\":1,\"key\":2}";
  assert.equal(formatJson(formatJson(source), { minify: true }), source);
});

test("clears empty or whitespace-only input", () => {
  assert.equal(formatJson(""), "");
  assert.equal(formatJson(" \n\t ", { minify: true }), "");
});
