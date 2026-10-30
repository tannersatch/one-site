import { v4, v7 } from "uuid";

export type UuidVersion = "v4" | "v7";

export function generateUuids(version: UuidVersion, count: number, uppercase = false): string[] {
  if (version !== "v4" && version !== "v7") throw new Error("Choose UUID version 4 or 7.");
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error("Generate between 1 and 100 UUIDs.");
  }
  const generate = version === "v4" ? v4 : v7;
  return Array.from({ length: count }, () => {
    const uuid = generate();
    return uppercase ? uuid.toUpperCase() : uuid;
  });
}
