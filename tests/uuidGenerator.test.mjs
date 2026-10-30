import assert from "node:assert/strict";
import { test } from "node:test";
import { validate, version } from "uuid";
import { generateUuids } from "../app/utils/uuidGenerator.ts";

test("generates unique RFC version 4 and 7 UUIDs", () => {
  for (const [variant, expectedVersion] of [["v4", 4], ["v7", 7]]) {
    const values = generateUuids(variant, 100);
    assert.equal(new Set(values).size, values.length);
    assert.ok(values.every(value => validate(value) && version(value) === expectedVersion));
  }
});

test("supports bulk limits and uppercase formatting", () => {
  const values = generateUuids("v7", 100, true);
  assert.equal(values.length, 100);
  assert.ok(values.every(value => value === value.toUpperCase()));
  for (const [version, count] of [["v3", 1], ["v4", 0], ["v7", 101], ["v7", 1.5]]) {
    assert.throws(() => generateUuids(version, count));
  }
});
