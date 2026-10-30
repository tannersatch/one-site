import assert from "node:assert/strict";
import { test } from "node:test";
import { decodeUrl, encodeUrl } from "../app/utils/urlCodec.ts";

test("component mode encodes reserved and Unicode text as one value", () => {
  assert.equal(encodeUrl("hello world/a?b=1&name=雪", "component"), "hello%20world%2Fa%3Fb%3D1%26name%3D%E9%9B%AA");
  assert.equal(decodeUrl("hello%20world%2Fa%3Fb%3D1%26name%3D%E9%9B%AA", "component"), "hello world/a?b=1&name=雪");
});

test("URI mode preserves URL delimiters while encoding unsafe characters", () => {
  const source = "https://example.com/a path?q=hello world&lang=雪#part";
  assert.equal(encodeUrl(source, "uri"), "https://example.com/a%20path?q=hello%20world&lang=%E9%9B%AA#part");
  assert.equal(decodeUrl(encodeUrl(source, "uri"), "uri"), source);
});

test("reports malformed escapes and lone surrogate input", () => {
  assert.throws(() => decodeUrl("%E0%A4%A", "component"), URIError);
  assert.throws(() => encodeUrl("\ud800", "component"), URIError);
});
