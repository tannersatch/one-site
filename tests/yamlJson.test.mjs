import assert from "node:assert/strict";
import { test } from "node:test";
import { JsonFormattingError } from "../app/utils/jsonFormatter.ts";
import { jsonToYaml, yamlToJson } from "../app/utils/yamlJson.ts";

test("converts nested YAML mappings and sequences to JSON", () => {
  const result = yamlToJson(
    "name: Tanner\nactive: true\nprojects:\n  - Portfolio\n  - Developer tools\nprofile:\n  location: null",
  );
  assert.deepEqual(JSON.parse(result), {
    name: "Tanner",
    active: true,
    projects: ["Portfolio", "Developer tools"],
    profile: { location: null },
  });
});

test("converts JSON to YAML and back without changing data", () => {
  const source = "{\"name\":\"Tanner\",\"active\":true,\"projects\":[{\"id\":1}],\"location\":null}";
  assert.deepEqual(JSON.parse(yamlToJson(jsonToYaml(source))), JSON.parse(source));
});

test("preserves large integers exactly in both directions", () => {
  const source = "{\"id\":9007199254740993,\"negative\":-9007199254740993}";
  const yaml = jsonToYaml(source);
  assert.match(yaml, /9007199254740993/);
  const result = yamlToJson(yaml);
  assert.match(result, /"id": 9007199254740993/);
  assert.match(result, /"negative": -9007199254740993/);
});

test("keeps YAML 1.2 boolean-like words and dates as strings", () => {
  assert.deepEqual(JSON.parse(yamlToJson("yesWord: yes\nonWord: on\ndate: 2026-10-30\nquoted: '42'")), {
    yesWord: "yes",
    onWord: "on",
    date: "2026-10-30",
    quoted: "42",
  });
});

test("supports primitive, sequence, and empty collection roots", () => {
  for (const source of ["\"hello\"", "42", "true", "null", "[1,\"two\",null]", "{}", "[]"]) {
    assert.deepEqual(JSON.parse(yamlToJson(jsonToYaml(source))), JSON.parse(source));
  }
});

test("supports two- and four-space indentation", () => {
  assert.match(yamlToJson("profile:\n  active: true", "4"), /\n    "profile":/);
  assert.match(jsonToYaml("{\"profile\":{\"active\":true}}", "4"), /profile:\n    active: true/);
});

test("expands ordinary aliases and merge keys", () => {
  const result = JSON.parse(
    yamlToJson("defaults: &defaults\n  active: true\n  name: Original\nitem:\n  <<: *defaults\n  name: Override"),
  );
  assert.deepEqual(result.item, { active: true, name: "Override" });
  assert.deepEqual(result.defaults, { active: true, name: "Original" });
});

test("rejects recursive aliases and excessive expansion", () => {
  assert.throws(() => yamlToJson("root: &root\n  self: *root"), /Circular YAML aliases/);
  const source =
    "a: &a [x,x,x,x,x,x,x,x,x]\nb: &b [*a,*a,*a,*a,*a,*a,*a,*a,*a]\nc: &c [*b,*b,*b,*b,*b,*b,*b,*b,*b]\nd: [*c,*c,*c,*c,*c,*c,*c,*c,*c]";
  assert.throws(() => yamlToJson(source), /alias/i);
});

test("rejects duplicate keys in both directions", () => {
  assert.throws(() => yamlToJson("name: A\nname: B"), /unique/i);
  assert.throws(() => jsonToYaml("{\"name\":\"A\",\"name\":\"B\"}"), /unique/i);
});

test("rejects non-string and complex mapping keys", () => {
  assert.throws(() => yamlToJson("1: one"), /keys must be strings/);
  assert.throws(() => yamlToJson("? [a, b]\n: value"), /keys must be strings/);
});

test("rejects non-finite numeric values and unsupported tags", () => {
  for (const source of ["value: .nan", "value: .inf", "value: -.inf"]) {
    assert.throws(() => yamlToJson(source), /finite/);
  }
  assert.throws(() => jsonToYaml("{\"value\":1e400}"), /finite/);
  assert.throws(() => yamlToJson("value: !custom data"), /tag/i);
  assert.throws(() => yamlToJson("!!set {a, b}"));
});

test("rejects multiple YAML documents and reports parse locations", () => {
  assert.throws(() => yamlToJson("a: 1\n---\nb: 2"), /document/i);
  assert.throws(() => yamlToJson("values: [1, 2"), /line|column/i);
  assert.throws(() => yamlToJson("%YAML 1.1\n---\nname: Tanner"), /YAML 1.2/);
});

test("uses strict JSON parsing rather than accepting YAML as JSON", () => {
  for (const source of ["{bad:1}", "{\"id\":1,}", "// comment\n{}", "{} {}"]) {
    assert.throws(() => jsonToYaml(source), JsonFormattingError);
  }
});

test("preserves special string content and prototype-like property names safely", () => {
  const actualSource = JSON.stringify({
    ...JSON.parse("{\"__proto__\":{\"polluted\":true}}"),
    constructor: "name",
    control: "\u0007",
    text: "hello \"world\"",
  });
  assert.deepEqual(JSON.parse(yamlToJson(jsonToYaml(actualSource))), JSON.parse(actualSource));
  assert.equal(Object.prototype.polluted, undefined);
});

test("clears whitespace input and treats a YAML empty document as null", () => {
  assert.equal(yamlToJson(" \n\t "), "");
  assert.equal(jsonToYaml(""), "");
  assert.equal(yamlToJson("---"), "null");
});
