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
