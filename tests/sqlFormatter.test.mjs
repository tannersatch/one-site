import assert from "node:assert/strict";
import { test } from "node:test";
import { formatSql, sqlDialects, sqlExamples } from "../app/utils/sqlFormatter.ts";

test("formats SQL with uppercase keywords and two-space indentation", () => {
  const result = formatSql("select id,name from users where active=1;");
  assert.match(result, /^SELECT\n/);
  assert.match(result, /\n  id,/);
  assert.match(result, /\nFROM\n/);
  assert.match(result, /\nWHERE\n/);
});

test("supports every listed dialect and its matching example", () => {
  for (const { value } of sqlDialects) {
    const result = formatSql(sqlExamples[value], { dialect: value });
    assert.ok(result.includes("SELECT"), value);
    assert.equal(formatSql(result, { dialect: value }), result, value);
  }
});

test("changes keyword case without changing identifier or string case", () => {
  const source = "select DisplayName from UserAccounts where Status = 'Active';";
  const upper = formatSql(source);
  const lower = formatSql(source, { keywordCase: "lower" });
  const preserve = formatSql(source, { keywordCase: "preserve" });
  assert.match(upper, /^SELECT/);
  assert.match(lower, /^select/);
  assert.match(preserve, /^select/);
  for (const result of [upper, lower, preserve]) {
    assert.match(result, /DisplayName/);
    assert.match(result, /UserAccounts/);
    assert.match(result, /'Active'/);
  }
});

test("supports four spaces and tabs", () => {
  assert.match(formatSql("select id,name from users;", { indentation: "4" }), /\n    id,/);
  assert.match(formatSql("select id,name from users;", { indentation: "tab" }), /\n\tid,/);
});

test("preserves comments, numeric literals, escaped strings, and multiple statements", () => {
  const source =
    "-- Keep this comment\nselect 9007199254740993 as id, 'O''Brien' as name; /* second query */ select 'hello world';";
  const result = formatSql(source);
  assert.match(result, /-- Keep this comment/);
  assert.match(result, /\/\* second query \*\//);
  assert.match(result, /9007199254740993/);
  assert.match(result, /'O''Brien'/);
  assert.match(result, /'hello world'/);
  assert.equal((result.match(/;/g) ?? []).length, 2);
});

test("preserves dialect-specific quoting and placeholders", () => {
  assert.match(formatSql("select \"Display Name\" from users where id=$1;", { dialect: "postgresql" }), /\$1/);
  assert.match(formatSql("select \"Display Name\" from users;", { dialect: "postgresql" }), /"Display Name"/);
  assert.match(formatSql("select `name` from users where id=?;", { dialect: "mysql" }), /\?/);
  assert.match(formatSql("select [Name] from [dbo].[Users] where [Id]=@id;", { dialect: "transactsql" }), /@id/);
});

test("surfaces unsupported or malformed input rather than returning stale results", () => {
  assert.throws(() => formatSql("select 'unterminated"));
  assert.throws(() => formatSql("select (1"));
});

test("returns an empty result for whitespace-only input", () => {
  assert.equal(formatSql(""), "");
  assert.equal(formatSql(" \n\t "), "");
});
