export interface RegexRequest {
  pattern: string;
  flags: string;
  text: string;
}
export interface RegexCapture {
  number: number;
  value: string | null;
  start: number | null;
  end: number | null;
}
export interface RegexMatch {
  index: number;
  end: number;
  value: string;
  groups: RegexCapture[];
  namedGroups: Record<string, string | null>;
}
export interface RegexResult {
  matches: RegexMatch[];
  truncated: boolean;
  flags: string;
}
export type RegexResponse = { result: RegexResult; error?: never } | { error: string; result?: never };
export interface RegexSegment {
  text: string;
  matched: boolean;
  empty: boolean;
  number: number;
}

export const regexFlags = [
  { value: "g", label: "Global", description: "Find all matches" },
  { value: "i", label: "Ignore case", description: "Case-insensitive matching" },
  { value: "m", label: "Multiline", description: "Anchors match each line" },
  { value: "s", label: "Dot all", description: "Dot matches line breaks" },
  { value: "u", label: "Unicode", description: "Unicode-aware matching" },
  { value: "y", label: "Sticky", description: "Match only at the current position" },
  { value: "d", label: "Indices", description: "Include capture offsets" },
  { value: "v", label: "Unicode sets", description: "Extended Unicode sets; replaces u" },
];

export function validateRegexRequest(request: RegexRequest): void {
  if (request.pattern.length > 5000) throw new Error("Patterns must be 5,000 characters or fewer.");
  if (request.text.length > 100000) throw new Error("Test text must be 100,000 characters or fewer.");
}

export function evaluateRegex(request: RegexRequest): RegexResult {
  validateRegexRequest(request);
  const expression = new RegExp(request.pattern, request.flags);
  const matches: RegexMatch[] = [];
  let characters = 0;
  let captures = 0;
  let truncated = false;

  while (true) {
    const match = expression.exec(request.text);
    if (!match) break;
    const size = match.reduce((total, value) => total + (value?.length ?? 0), 0)
      + Object.values(match.groups ?? {}).reduce((total, value) => total + (value?.length ?? 0), 0);
    const captureCount = match.length - 1 + Object.keys(match.groups ?? {}).length;
    if (matches.length >= 1000 || characters + size > 200000 || captures + captureCount > 5000) {
      truncated = true;
      break;
    }
    characters += size;
    captures += captureCount;
    matches.push({
      index: match.index,
      end: match.index + match[0].length,
      value: match[0],
      groups: match.slice(1).map((value, index) => ({
        number: index + 1,
        value: value ?? null,
        start: match.indices?.[index + 1]?.[0] ?? null,
        end: match.indices?.[index + 1]?.[1] ?? null,
      })),
      namedGroups: Object.fromEntries(Object.entries(match.groups ?? {}).map(([name, value]) => [name, value ?? null])),
    });
    if (!expression.global) break;
    if (match[0].length === 0) {
      const codePoint = request.text.codePointAt(expression.lastIndex);
      expression.lastIndex +=
        (expression.unicode || request.flags.includes("v")) && codePoint !== undefined && codePoint > 0xffff ? 2 : 1;
    }
  }
  return { matches, truncated, flags: expression.flags };
}

export function regexSegments(text: string, matches: RegexMatch[]): RegexSegment[] {
  const segments: RegexSegment[] = [];
  let cursor = 0;
  matches.forEach((match, index) => {
    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), matched: false, empty: false, number: 0 });
    }
    segments.push({
      text: text.slice(match.index, match.end),
      matched: true,
      empty: match.index === match.end,
      number: index + 1,
    });
    cursor = match.end;
  });
  if (cursor < text.length) segments.push({ text: text.slice(cursor), matched: false, empty: false, number: 0 });
  return segments;
}
