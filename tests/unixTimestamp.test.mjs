import assert from "node:assert/strict";
import { test } from "node:test";
import { formatDateTime, formatUnixTimestamp, parseDateTime, parseUnixTimestamp } from "../app/utils/unixTimestamp.ts";

test("supports epoch zero, seconds, and milliseconds", () => {
  assert.equal(parseUnixTimestamp("0"), 0);
  assert.equal(parseUnixTimestamp("1700000000"), 1700000000000);
  assert.equal(parseUnixTimestamp("1700000000123", "milliseconds"), 1700000000123);
  assert.equal(formatUnixTimestamp(1700000000123), "1700000000.123");
  assert.equal(formatUnixTimestamp(1700000000123, "milliseconds"), "1700000000123");
});

test("preserves fractional seconds exactly, including before the epoch", () => {
  for (
    const [source, expected] of [["0.001", 1], ["-0.001", -1], ["-1.001", -1001], ["1700000000.123", 1700000000123]]
  ) {
    assert.equal(parseUnixTimestamp(source), expected);
    assert.equal(formatUnixTimestamp(expected), source);
  }
  assert.equal(parseUnixTimestamp("  +001.20  "), 1200);
  assert.equal(formatUnixTimestamp(1200), "1.2");
});

test("rejects unsupported numeric syntax and sub-millisecond precision", () => {
  for (const source of ["NaN", "Infinity", "1e3", "0x10", "123abc", ".5", "1.0001", "1,000"]) {
    assert.throws(() => parseUnixTimestamp(source));
  }
  assert.throws(() => parseUnixTimestamp("1.2", "milliseconds"), /whole number/);
});

test("checks native date limits without numeric rounding", () => {
  for (const value of [-8640000000000000, 8640000000000000]) {
    assert.equal(parseUnixTimestamp(String(value), "milliseconds"), value);
    assert.equal(parseUnixTimestamp(formatUnixTimestamp(value)), value);
  }
  assert.throws(() => parseUnixTimestamp("8640000000000001", "milliseconds"), /range/);
  assert.throws(() => parseUnixTimestamp("-8640000000000.001"), /range/);
  assert.throws(() => parseUnixTimestamp("9999999999999999999999999"), /range/);
});

test("formats UTC dates and parses milliseconds or omitted seconds", () => {
  assert.equal(formatDateTime(0), "1970-01-01T00:00:00.000");
  assert.equal(parseDateTime("1970-01-01T00:00"), 0);
  assert.equal(parseDateTime("1970-01-01 00:00:00.1"), 100);
  assert.equal(parseDateTime("1969-12-31T23:59:59.999"), -1);
  assert.equal(formatDateTime(1700000000123), "2023-11-14T22:13:20.123");
});

test("validates leap years and rejects normalized invalid calendar dates", () => {
  assert.notEqual(parseDateTime("2024-02-29T12:30"), null);
  for (
    const source of [
      "2025-02-29T12:30",
      "2026-04-31T00:00",
      "2026-13-01T00:00",
      "2026-00-01T00:00",
      "2026-01-00T00:00",
      "2026-01-01T24:00",
      "2026-01-01T00:60",
      "2026-01-01T00:00:60",
    ]
  ) {
    assert.throws(() => parseDateTime(source));
  }
});

test("uses the requested year literally, including years below 100", () => {
  for (
    const source of [
      "0000-02-29T00:00:00.000",
      "0099-01-01T00:00:00.000",
      "+275760-09-13T00:00:00.000",
      "-271821-04-20T00:00:00.000",
    ]
  ) {
    const instant = parseDateTime(source);
    assert.equal(formatDateTime(instant), source);
  }
});

test("rejects ambiguous format guessing and timezone suffixes", () => {
  for (
    const source of [
      "10/30/2026",
      "2026-10-30",
      "2026-10-30T12:00Z",
      "2026-10-30T12:00+02:00",
      "2026-10-30T12:00:00.0001",
    ]
  ) {
    assert.throws(() => parseDateTime(source), /YYYY-MM-DD/);
  }
});

test("applies browser-local calendar rules and handles daylight-saving gaps and folds", () => {
  const previous = process.env.TZ;
  process.env.TZ = "America/New_York";
  try {
    assert.equal(parseDateTime("1970-01-01T00:00", "local"), 18000000);
    assert.equal(formatDateTime(0, "local"), "1969-12-31T19:00:00.000");
    assert.throws(() => parseDateTime("2026-03-08T02:30", "local"), /does not exist/);
    assert.equal(new Date(parseDateTime("2026-11-01T01:30", "local")).toISOString(), "2026-11-01T05:30:00.000Z");
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

test("returns null for blank input rather than the epoch", () => {
  assert.equal(parseUnixTimestamp(""), null);
  assert.equal(parseUnixTimestamp("  "), null);
  assert.equal(parseDateTime(" \n "), null);
});

test("rejects invalid millisecond values passed to formatters", () => {
  for (const value of [NaN, Infinity, 1.1, 8640000000000001]) {
    assert.throws(() => formatUnixTimestamp(value));
    assert.throws(() => formatDateTime(value));
  }
});
