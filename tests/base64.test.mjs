import assert from "node:assert/strict";
import { test } from "node:test";
import { decodeBase64, decodeBase64Text, encodeBase64, encodeBase64Text } from "../app/utils/base64.ts";

test("round-trips UTF-8 including supplementary and non-Latin characters", () => {
  const source = "Hello, 世界 🌎";
  assert.equal(decodeBase64Text(encodeBase64Text(source)), source);
  assert.equal(encodeBase64Text(""), "");
});

test("decodes whitespace and valid unpadded Base64", () => {
  assert.equal(decodeBase64Text(" SGV sbG8 "), "Hello");
  assert.equal(decodeBase64Text("SGVsbG8"), "Hello");
});

test("round-trips arbitrary binary bytes", () => {
  const bytes = Uint8Array.of(0, 255, 195, 40, 0, 128);
  assert.deepEqual(decodeBase64(encodeBase64(bytes)), bytes);
});

test("rejects malformed base64 and invalid UTF-8 as text", () => {
  for (const value of ["a", "SGV=sbG8", "%%%", "SGVsbG8==="]) assert.throws(() => decodeBase64(value));
  assert.throws(() => decodeBase64Text("/w=="), /not valid UTF-8/);
});

test("bounds text and binary payloads", () => {
  assert.throws(() => encodeBase64Text("x".repeat(1_000_001)), /1,000,000/);
  assert.throws(() => encodeBase64(new Uint8Array(5 * 1024 * 1024 + 1)), /5 MB/);
  assert.throws(() => decodeBase64("A".repeat(7_000_000)), /5 MB/);
  assert.throws(() => decodeBase64(" ".repeat(7_000_000)), /5 MB/);
});
