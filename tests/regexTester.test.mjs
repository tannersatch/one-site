import assert from "node:assert/strict";
import { test } from "node:test";
import { Worker } from "node:worker_threads";
import { evaluateRegex, regexSegments } from "../app/utils/regexTester.ts";

const run = (pattern, text, flags = "g") => evaluateRegex({ pattern, text, flags });

test("supports global matches and UTF-16 match offsets", () => {
  const result = run("cat", "cat dog cat");
  assert.deepEqual(result.matches.map(match => [match.index, match.end, match.value]), [[0, 3, "cat"], [8, 11, "cat"]]);
  assert.equal(result.truncated, false);
});

test("returns only the first match without the global flag", () => {
  assert.equal(run("a", "aaa", "").matches.length, 1);
  assert.equal(run("z", "aaa").matches.length, 0);
});

test("supports case-insensitive, multiline, and dot-all flags", () => {
  assert.equal(run("alpha", "ALPHA", "gi").matches.length, 1);
  assert.equal(run("^word$", "word\nword", "gm").matches.length, 2);
  assert.equal(run("a.b", "a\nb", "gs").matches.length, 1);
});

test("returns positional/named captures and distinguishes unmatched from empty captures", () => {
  const result = run("(?<letter>a)(b)?()", "a");
  assert.deepEqual(result.matches[0].groups.map(group => group.value), ["a", null, ""]);
  assert.deepEqual(result.matches[0].namedGroups, { letter: "a" });
});

test("includes capture offsets when the d flag is enabled", () => {
  assert.deepEqual(run("(ab)", "xab", "gd").matches[0].groups[0], { number: 1, value: "ab", start: 1, end: 3 });
});

test("advances correctly after zero-length matches", () => {
  assert.deepEqual(run("(?=a)", "aaa").matches.map(match => match.index), [0, 1, 2]);
  assert.deepEqual(run("", "ab").matches.map(match => match.index), [0, 1, 2]);
});

test("does not split surrogate pairs when advancing Unicode zero-length matches", () => {
  assert.deepEqual(run("(?:)", "\u{1F600}", "gu").matches.map(match => match.index), [0, 2]);
  assert.deepEqual(run("(?:)", "\u{1F600}", "gv").matches.map(match => match.index), [0, 2]);
});

test("supports sticky matching at the current position", () => {
  assert.equal(run("a", "baa", "gy").matches.length, 0);
  assert.equal(run("a", "aa b", "gy").matches.length, 2);
});

test("reports invalid patterns and flags", () => {
  for (const [pattern, flags] of [["(", "g"], ["a", "gg"], ["a", "q"], ["a", "uv"]]) {
    assert.throws(() => run(pattern, "a", flags));
  }
});

test("bounds input size, match count, and captured output", () => {
  assert.throws(() => run("x".repeat(5001), "x"), /5,000/);
  assert.throws(() => run("x", "x".repeat(100001)), /100,000/);
  const many = run("a", "a".repeat(1001));
  assert.equal(many.matches.length, 1000);
  assert.equal(many.truncated, true);
  const captures = run("(?=(a+))", "a".repeat(10000));
  assert.ok(captures.matches.length < 1000);
  assert.equal(captures.truncated, true);
  const emptyCaptures = run("()".repeat(1000), "a".repeat(20));
  assert.ok(emptyCaptures.matches.length <= 5);
  assert.equal(emptyCaptures.truncated, true);
});

test("builds highlights without HTML and preserves the exact source text", () => {
  const text = "<img src=x onerror=\"alert(1)\">";
  const parts = regexSegments(text, run("img|alert", text).matches);
  assert.equal(parts.map(part => part.text).join(""), text);
  assert.equal(parts.filter(part => part.matched).length, 2);
  assert.ok(regexSegments("ab", run("(?=b)", "ab").matches).some(part => part.empty));
});

test("a disposable worker can terminate catastrophic backtracking without blocking the test process", async () => {
  const moduleUrl = new URL("../app/utils/regexTester.ts", import.meta.url).href;
  const worker = new Worker(
    `
    const { parentPort, workerData } = require('node:worker_threads');
    import(workerData.moduleUrl).then(({ evaluateRegex }) => {
      parentPort.on('message', request => parentPort.postMessage(evaluateRegex(request)));
      parentPort.postMessage('ready');
    });
  `,
    { eval: true, workerData: { moduleUrl } },
  );
  let timer;
  let startupTimer;
  try {
    const result = await new Promise((resolve, reject) => {
      startupTimer = setTimeout(() => reject(new Error("Worker failed to start")), 5000);
      worker.on("error", reject);
      worker.on("message", message => {
        if (message === "ready") {
          clearTimeout(startupTimer);
          timer = setTimeout(() => resolve("timed out"), 200);
          worker.postMessage({ pattern: "^(a+)+$", flags: "", text: "a".repeat(30000) + "!" });
        } else reject(new Error("Pathological pattern unexpectedly completed"));
      });
    });
    assert.equal(result, "timed out");
  } finally {
    clearTimeout(timer);
    clearTimeout(startupTimer);
    await worker.terminate();
  }
});
