import assert from "node:assert/strict";
import { test } from "node:test";
import { contrastRatio, contrastResults } from "../app/utils/colorContrast.ts";

test("calculates WCAG contrast extremes and common values", () => {
  assert.equal(contrastRatio("#000", "#fff"), 21);
  assert.equal(contrastRatio("#fff", "#fff"), 1);
  assert.equal(Number(contrastRatio("#777", "#fff").toFixed(2)), 4.48);
});

test("classifies normal and large text against AA and AAA thresholds", () => {
  assert.deepEqual(contrastResults(4.5), {
    ratio: 4.5,
    aaNormal: true,
    aaLarge: true,
    aaaNormal: false,
    aaaLarge: true,
  });
  assert.deepEqual(contrastResults(3), { ratio: 3, aaNormal: false, aaLarge: true, aaaNormal: false, aaaLarge: false });
  assert.equal(contrastResults(7).aaaNormal, true);
});

test("normalizes hex colors and rejects invalid colors and ratios", () => {
  assert.equal(contrastRatio(" #ABC ", "#aabbcc"), 1);
  assert.throws(() => contrastRatio("red", "#fff"));
  for (const value of [0.9, 21.1, NaN, Infinity]) assert.throws(() => contrastResults(value));
});
