import { parseDocument, stringify } from "yaml";
import { formatJson } from "./jsonFormatter.ts";

export type ConversionIndentation = "2" | "4";
type ConvertibleValue = null | boolean | string | number | bigint | ConvertibleValue[] | {
  [key: string]: ConvertibleValue;
};

function normalizeValue(value: unknown, ancestors = new Set<object>()): ConvertibleValue {
  if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Numbers must be finite within JavaScript's floating-point range.");
    return value;
  }
  if (typeof value !== "object") throw new Error("This YAML value cannot be represented in JSON.");
  if (ancestors.has(value)) throw new Error("Circular YAML aliases cannot be represented in JSON.");
  ancestors.add(value);
  try {
    if (Array.isArray(value)) return value.map(item => normalizeValue(item, ancestors));
    if (value instanceof Map) {
      const result: { [key: string]: ConvertibleValue } = Object.create(null);
      for (const [key, item] of value) {
        if (typeof key !== "string") throw new Error("YAML mapping keys must be strings to convert to JSON.");
        result[key] = normalizeValue(item, ancestors);
      }
      return result;
    }
    throw new Error("This YAML value cannot be represented in JSON.");
  } finally {
    ancestors.delete(value);
  }
}

function parseValue(source: string, schema: "core" | "json"): ConvertibleValue {
  const document = parseDocument(source, {
    version: "1.2",
    schema,
    merge: schema === "core",
    intAsBigInt: true,
    uniqueKeys: true,
    strict: true,
    prettyErrors: true,
  });
  const issue = document.errors[0] ?? document.warnings[0];
  if (issue) throw new Error(issue.message);
  if (document.directives?.yaml.version !== "1.2") throw new Error("Only YAML 1.2 documents are supported.");
  return normalizeValue(document.toJS({ mapAsMap: true, maxAliasCount: 100 }));
}

export function yamlToJson(source: string, indentation: ConversionIndentation = "2"): string {
  if (!source.trim()) return "";
  const value = parseValue(source, "core");
  const json = stringify(value, {
    schema: "json",
    collectionStyle: "flow",
    defaultStringType: "QUOTE_DOUBLE",
    defaultKeyType: "QUOTE_DOUBLE",
    doubleQuotedAsJSON: true,
    lineWidth: 0,
  });
  return formatJson(json, { indentation });
}

export function jsonToYaml(source: string, indentation: ConversionIndentation = "2"): string {
  if (!source.trim()) return "";
  formatJson(source);
  return stringify(parseValue(source, "json"), {
    version: "1.2",
    schema: "core",
    indent: Number(indentation),
    lineWidth: 0,
    aliasDuplicateObjects: false,
  }).trimEnd();
}
