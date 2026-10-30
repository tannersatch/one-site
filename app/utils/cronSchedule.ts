import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";

export interface CronSchedule {
  description: string;
  fields: { name: string; value: string }[];
  nextRuns: Date[];
}

const fieldNames = ["Second", "Minute", "Hour", "Day of month", "Month", "Day of week"];

export function parseCronSchedule(
  expression: string,
  options: { timeZone?: string; currentDate?: Date; count?: number } = {},
): CronSchedule {
  const source = expression.trim();
  if (!source) throw new Error("Enter a cron expression.");
  const count = options.count ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 10) throw new Error("Choose between 1 and 10 upcoming runs.");
  const interval = CronExpressionParser.parse(source, {
    currentDate: options.currentDate ?? new Date(),
    tz: options.timeZone ?? "UTC",
  });
  const description = cronstrue.toString(source, { use24HourTimeFormat: true });
  const fields = source.startsWith("@")
    ? [{ name: "Preset", value: source }]
    : source.split(/\s+/).map((value, index, values) => ({
      name: fieldNames[index + (values.length === 5 ? 1 : 0)] ?? `Field ${index + 1}`,
      value,
    }));
  return { description, fields, nextRuns: interval.take(count) };
}
