import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCronSchedule } from "../app/utils/cronSchedule.ts";

test("describes standard schedules and computes upcoming runs deterministically", () => {
  const result = parseCronSchedule("*/5 * * * *", { currentDate: new Date("2026-01-01T00:00:00Z"), count: 3 });
  assert.equal(result.description, "Every 5 minutes");
  assert.deepEqual(result.nextRuns.map(date => date.toISOString()), [
    "2026-01-01T00:05:00.000Z",
    "2026-01-01T00:10:00.000Z",
    "2026-01-01T00:15:00.000Z",
  ]);
  assert.deepEqual(result.fields.map(field => field.name), ["Minute", "Hour", "Day of month", "Month", "Day of week"]);
});

test("supports seconds, presets, named weekdays, and time zones", () => {
  const seconds = parseCronSchedule("*/10 * * * * *", { currentDate: new Date("2026-01-01T00:00:00Z"), count: 1 });
  assert.equal(seconds.fields[0].name, "Second");
  assert.equal(seconds.nextRuns[0].toISOString(), "2026-01-01T00:00:10.000Z");
  const preset = parseCronSchedule("@weekly", { currentDate: new Date("2026-01-01T00:00:00Z"), count: 1 });
  assert.equal(preset.fields[0].name, "Preset");
  const local = parseCronSchedule("0 9 * * 1-5", {
    currentDate: new Date("2026-01-01T00:00:00Z"),
    timeZone: "America/Los_Angeles",
    count: 1,
  });
  assert.equal(local.nextRuns[0].toISOString(), "2026-01-01T17:00:00.000Z");
});

test("rejects invalid expressions, zones, and result counts", () => {
  for (const expression of ["", "not cron", "60 * * * *"]) assert.throws(() => parseCronSchedule(expression));
  assert.throws(() => parseCronSchedule("* * * * *", { timeZone: "Not/AZone" }));
  for (const count of [0, 11, 1.5]) assert.throws(() => parseCronSchedule("* * * * *", { count }));
});
