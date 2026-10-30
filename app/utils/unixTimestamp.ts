export type TimestampUnit = "seconds" | "milliseconds";
export type TimeZoneMode = "utc" | "local";

const maxMilliseconds = 8640000000000000;

function validateMilliseconds(value: number): number {
  if (!Number.isInteger(value) || Math.abs(value) > maxMilliseconds) {
    throw new Error("This timestamp is outside the supported date range.");
  }
  return value;
}

export function parseUnixTimestamp(source: string, unit: TimestampUnit = "seconds"): number | null {
  const value = source.trim();
  if (!value) return null;
  const match = /^([+-]?)(\d+)(?:\.(\d{1,3}))?$/.exec(value);
  if (!match || (unit === "milliseconds" && match[3] !== undefined)) {
    throw new Error(
      unit === "seconds" ? "Enter seconds with up to 3 decimal places." : "Enter a whole number of milliseconds.",
    );
  }
  const sign = match[1] === "-" ? -1n : 1n;
  const whole = BigInt(match[2]!);
  const magnitude = unit === "seconds" ? whole * 1000n + BigInt((match[3] ?? "").padEnd(3, "0")) : whole;
  const milliseconds = sign * magnitude;
  if (milliseconds < -BigInt(maxMilliseconds) || milliseconds > BigInt(maxMilliseconds)) {
    throw new Error("This timestamp is outside the supported date range.");
  }
  return Number(milliseconds);
}

export function formatUnixTimestamp(milliseconds: number, unit: TimestampUnit = "seconds"): string {
  validateMilliseconds(milliseconds);
  if (unit === "milliseconds") return String(milliseconds);
  const magnitude = BigInt(Math.abs(milliseconds));
  const fraction = String(magnitude % 1000n).padStart(3, "0").replace(/0+$/, "");
  return `${milliseconds < 0 ? "-" : ""}${magnitude / 1000n}${fraction ? `.${fraction}` : ""}`;
}

export function formatDateTime(milliseconds: number, zone: TimeZoneMode = "utc"): string {
  const date = new Date(validateMilliseconds(milliseconds));
  if (zone === "utc") return date.toISOString().slice(0, -1);
  const year = date.getFullYear();
  const yearText = year < 0
    ? `-${String(-year).padStart(6, "0")}`
    : year > 9999
    ? `+${String(year).padStart(6, "0")}`
    : String(year).padStart(4, "0");
  const pad = (value: number, length = 2) => String(value).padStart(length, "0");
  return `${yearText}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${
    pad(date.getMinutes())
  }:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

export function parseDateTime(source: string, zone: TimeZoneMode = "utc"): number | null {
  const value = source.trim();
  if (!value) return null;
  const match = /^(\d{4}|[+-]\d{6})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(value);
  if (!match) throw new Error("Use YYYY-MM-DDTHH:mm:ss.SSS, without a time-zone suffix.");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6] ?? 0);
  const millisecond = Number((match[7] ?? "").padEnd(3, "0"));
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) {
    throw new Error("Enter a real calendar date and time.");
  }

  const date = new Date(0);
  if (zone === "utc") {
    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(hour, minute, second, millisecond);
  } else {
    date.setFullYear(year, month - 1, day);
    date.setHours(hour, minute, second, millisecond);
  }
  const expected = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${String(second).padStart(2, "0")}.${
    String(millisecond).padStart(3, "0")
  }`;
  const milliseconds = date.getTime();
  if (!Number.isFinite(milliseconds)) throw new Error("This date is outside the supported date range.");
  if (formatDateTime(milliseconds, zone) !== expected) {
    throw new Error(
      zone === "local"
        ? "This local date/time does not exist. Check the calendar date and daylight-saving transition."
        : "Enter a real calendar date and time.",
    );
  }
  return milliseconds;
}
