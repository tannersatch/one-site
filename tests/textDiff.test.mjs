import { applyPatch } from "diff";
import assert from "node:assert/strict";
import { test } from "node:test";
import { compareText } from "../app/utils/textDiff.ts";

test("compares identical and empty inputs without changes", () => {
  for (const source of ["", "same", "same\n", "\n"]) {
    const result = compareText(source, source);
    assert.equal(result.hasChanges, false);
    assert.equal(result.added, 0);
    assert.equal(result.removed, 0);
    assert.equal(result.patch, "");
  }
});

test("reports line replacements and correct line numbers", () => {
  const result = compareText("alpha\nbeta\n", "alpha\ngamma\n");
  assert.equal(result.added, 1);
  assert.equal(result.removed, 1);
  assert.deepEqual(result.lines.map(line => [line.kind, line.originalLine, line.modifiedLine, line.value]), [
    ["unchanged", 1, 1, "alpha"],
    ["removed", 2, null, "beta"],
    ["added", null, 2, "gamma"],
  ]);
});

test("supports insertion and deletion from otherwise empty text", () => {
  assert.equal(compareText("", "new\n").added, 1);
  assert.equal(compareText("old\n", "").removed, 1);
});

test("preserves blank lines and detects missing final newlines", () => {
  const result = compareText("alpha\n\nbeta", "alpha\n\nbeta\n");
  assert.ok(result.lines.some(line => line.value === ""));
  assert.ok(result.lines.some(line => line.missingNewline));
  assert.equal(result.hasChanges, true);
  assert.match(result.patch, /No newline at end of file/);
});

test("normalizes CRLF and CR line endings", () => {
  assert.equal(compareText("alpha\r\nbeta\r", "alpha\nbeta\n").hasChanges, false);
});

test("word mode isolates text changes and preserves spaces", () => {
  const result = compareText("Hello world!", "Hello there!", { mode: "words" });
  assert.ok(result.parts.some(part => part.kind === "removed" && part.value === "world"));
  assert.ok(result.parts.some(part => part.kind === "added" && part.value === "there"));
  assert.equal(result.parts.filter(part => part.kind !== "added").map(part => part.value).join(""), "Hello world!");
  assert.equal(result.parts.filter(part => part.kind !== "removed").map(part => part.value).join(""), "Hello there!");
});

test("exact mode includes space and tab differences", () => {
  for (const mode of ["lines", "words"]) {
    assert.equal(compareText("alpha beta\n", "alpha  beta\n", { mode }).hasChanges, true);
  }
});

test("trim mode ignores only line-edge spaces and tabs", () => {
  for (const mode of ["lines", "words"]) {
    assert.equal(compareText(" \talpha beta \n", "alpha beta\n", { mode, whitespace: "trim" }).hasChanges, false);
    assert.equal(compareText("alpha beta\n", "alpha  beta\n", { mode, whitespace: "trim" }).hasChanges, true);
  }
});

test("ignore mode removes spaces and tabs but retains line boundaries", () => {
  for (const mode of ["lines", "words"]) {
    assert.equal(compareText("alpha \t beta\n", "alphabeta\n", { mode, whitespace: "ignore" }).hasChanges, false);
    assert.equal(compareText("alpha\nbeta\n", "alphabeta\n", { mode, whitespace: "ignore" }).hasChanges, true);
  }
});

test("supports optional case-insensitive comparison in both modes", () => {
  for (const mode of ["lines", "words"]) {
    assert.equal(compareText("Hello\n", "hello\n", { mode }).hasChanges, true);
    assert.equal(compareText("Hello\n", "hello\n", { mode, ignoreCase: true }).hasChanges, false);
  }
});

test("produces a valid unified patch of the compared text", () => {
  const source = "first\nold\nlast\n";
  const target = "first\nnew\nlast\n";
  const result = compareText(source, target);
  assert.equal(applyPatch(source, result.patch), target);
});

test("patches use normalized comparison text when whitespace is ignored", () => {
  const result = compareText(" a b\n", " a c\n", { whitespace: "ignore" });
  assert.equal(applyPatch("ab\n", result.patch), "ac\n");
});

test("keeps Unicode and markup as plain comparison text", () => {
  const result = compareText("<script>old</script>\n", "<script>new</script>\n");
  assert.ok(result.lines.some(line => line.value === "<script>new</script>"));
  assert.equal(compareText("caf\u00e9", "caf\u00e9").hasChanges, false);
});

test("limits input size, edit distance, and rendered line count", () => {
  assert.throws(() => compareText("a".repeat(100001), ""), /100,000/);
  assert.throws(() => compareText("a\n".repeat(2100), "b\n".repeat(2100)), /computation limit/);
  assert.throws(() => compareText("\n".repeat(3001), "\n".repeat(3001)), /3,000 display lines/);
});
