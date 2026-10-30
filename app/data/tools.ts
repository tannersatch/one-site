export interface DeveloperTool {
  id: string;
  title: string;
  navigationLabel?: string;
  description: string;
  category: string;
  icon: string;
  to: string;
  keywords: string[];
  tags: string[];
}

export const tools: DeveloperTool[] = [
  {
    id: "unix-timestamp",
    title: "Unix Timestamp",
    description: "Convert Unix seconds and milliseconds to UTC or local dates and back.",
    category: "Dates & time",
    icon: "i-lucide-clock-3",
    to: "/tools/unix-timestamp",
    keywords: ["unix", "timestamp", "epoch", "date", "time", "seconds", "milliseconds", "utc", "timezone"],
    tags: ["UTC / Local", "Milliseconds"],
  },
  {
    id: "yaml-json-converter",
    title: "JSON / YAML Converter",
    description: "Convert YAML and JSON in either direction with safe alias handling and exact integers.",
    category: "Data conversion",
    icon: "i-lucide-file-code",
    to: "/tools/yaml-json-converter",
    keywords: ["yaml", "yml", "json", "convert", "configuration", "config", "serialize"],
    tags: ["YAML 1.2", "Two-way"],
  },
  {
    id: "json-to-typescript",
    title: "JSON to TypeScript",
    description: "Infer TypeScript types from JSON with nested objects, arrays, and optional properties.",
    category: "Code generation",
    icon: "i-lucide-file-code",
    to: "/tools/json-to-typescript",
    keywords: ["json", "typescript", "types", "interfaces", "infer", "generate", "ts"],
    tags: ["TypeScript", "Inference"],
  },
  {
    id: "sql-formatter",
    title: "SQL Formatter",
    description: "Format SQL for your dialect with keyword case and indentation options.",
    category: "Formatting & validation",
    icon: "i-lucide-database",
    to: "/tools/sql-formatter",
    keywords: ["sql", "database", "query", "format", "postgresql", "mysql", "sql server", "tsql", "sqlite", "bigquery"],
    tags: ["6 dialects", "SQL"],
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, minify, and validate JSON without changing numeric values.",
    category: "Formatting & validation",
    icon: "i-lucide-braces",
    to: "/tools/json-formatter",
    keywords: ["json", "pretty", "print", "format", "minify", "validate", "indent"],
    tags: ["JSON", "Lossless"],
  },
  {
    id: "jwt",
    title: "JWT Encode / Decode",
    navigationLabel: "JWT Decoder",
    description: "Inspect token headers and payloads, or sign a new HS256 token.",
    category: "Tokens & encoding",
    icon: "i-lucide-braces",
    to: "/tools/jwt-decode",
    keywords: ["json", "web", "token", "secret", "signature", "encode", "decode"],
    tags: ["JSON", "HS256"],
  },
  {
    id: "roman-numerals",
    title: "Roman Numeral Converter",
    description: "Convert whole numbers and Roman numerals in either direction.",
    category: "Numbers & conversion",
    icon: "i-lucide-landmark",
    to: "/tools/roman-numeral-converter",
    keywords: ["decimal", "integer", "number", "roman", "convert", "calculator"],
    tags: ["1-3999", "Two-way"],
  },
];
