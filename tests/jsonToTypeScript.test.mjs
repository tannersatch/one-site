import assert from "node:assert/strict";
import { stripTypeScriptTypes } from "node:module";
import { test } from "node:test";
import { JsonFormattingError } from "../app/utils/jsonFormatter.ts";
import { jsonToTypeScript } from "../app/utils/jsonToTypeScript.ts";

test("generates an exported named root and nested definitions", async () => {
  const result = await jsonToTypeScript(
    "{\"name\":\"Tanner\",\"active\":true,\"address\":{\"city\":\"Salt Lake City\"}}",
    "ApiResponse",
  );
  assert.match(result, /export type ApiResponse = ApiResponseTypes\.Sample\["value"\];/);
  assert.match(result, /name:\s+string;/);
  assert.match(result, /active:\s+boolean;/);
  assert.match(result, /city:\s+string;/);
  assert.doesNotThrow(() => stripTypeScriptTypes(result));
});

test("preserves arrays at the root and infers optional fields from array samples", async () => {
  const result = await jsonToTypeScript("[{\"id\":1,\"name\":\"A\"},{\"id\":2}]");
  assert.match(result, /value:\s+\w+\[\];/);
  assert.match(result, /name\?:\s+string;/);
  assert.match(result, /id:\s+number;/);
});

test("infers unions in mixed arrays and retains the array container", async () => {
  const result = await jsonToTypeScript("[1,\"two\",null]");
  assert.match(result, /value:\s+\w+\[\];/);
  assert.match(result, /number/);
  assert.match(result, /string/);
  assert.match(result, /null/);
  assert.doesNotThrow(() => stripTypeScriptTypes(result));
});

test("handles primitive roots including null", async () => {
  for (const [source, type] of [["\"hello\"", "string"], ["42", "number"], ["true", "boolean"], ["null", "null"]]) {
    const result = await jsonToTypeScript(source);
    assert.match(result, new RegExp(`value:\\s+${type};`));
  }
});

test("keeps ISO dates and numeric/boolean-looking strings as strings", async () => {
  const result = await jsonToTypeScript("{\"created\":\"2026-10-30T12:00:00Z\",\"id\":\"123\",\"enabled\":\"true\"}");
  for (const property of ["created", "id", "enabled"]) assert.match(result, new RegExp(`${property}:\\s+string;`));
  assert.doesNotMatch(result, /Date|enum /);
});

test("quotes property names that are not valid identifiers", async () => {
  const result = await jsonToTypeScript("{\"first-name\":\"Tanner\",\"some key\":1}");
  assert.match(result, /"first-name":\s+string;/);
  assert.match(result, /"some key":\s+number;/);
});

test("represents empty arrays using unknown instead of guessing an element type", async () => {
  const result = await jsonToTypeScript("{\"items\":[]}");
  assert.match(result, /items:\s+unknown\[\];/);
});

test("validates root names and does not inject arbitrary code into generated output", async () => {
  for (const name of ["", "user", "1Root", "class", "Root;alert(1)", "Bad Name"]) {
    await assert.rejects(() => jsonToTypeScript("{}", name), /uppercase letter/);
  }
  assert.match(await jsonToTypeScript("{}", "  Api_Response  "), /export type Api_Response =/);
});

test("uses strict JSON parsing with useful error locations", async () => {
  for (const source of ["{bad:1}", "{\"id\":1,}", "// comment\n{}", "{} {}"]) {
    await assert.rejects(() => jsonToTypeScript(source), JsonFormattingError);
  }
});

test("avoids collisions between the root alias and inferred nested names", async () => {
  const result = await jsonToTypeScript(
    "{\"root\":{\"id\":1},\"sample\":{\"name\":\"A\"},\"rootTypes\":{\"ok\":true}}",
  );
  assert.match(result, /export type Root = RootTypes\.Sample\["value"\];/);
  assert.doesNotThrow(() => stripTypeScriptTypes(result));
  assert.doesNotMatch(result, /class Convert|JSON\.parse/);
});

test("returns empty output for blank input", async () => {
  assert.equal(await jsonToTypeScript(""), "");
  assert.equal(await jsonToTypeScript("  \n\t"), "");
});
