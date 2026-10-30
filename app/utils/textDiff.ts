import { createTwoFilesPatch, diffLines, diffWordsWithSpace } from "diff";

export type DiffMode = "lines" | "words";
export type DiffWhitespace = "exact" | "trim" | "ignore";
export type DiffKind = "added" | "removed" | "unchanged";
export interface DiffPart {
  kind: DiffKind;
  value: string;
  count: number;
}
export interface DiffLine {
  kind: DiffKind;
  value: string;
  originalLine: number | null;
  modifiedLine: number | null;
  missingNewline: boolean;
}
export interface TextDiffResult {
  parts: DiffPart[];
  lines: DiffLine[];
  added: number;
  removed: number;
  hasChanges: boolean;
  patch: string;
}

function normalizeText(source: string, whitespace: DiffWhitespace): string {
  const text = source.replace(/\r\n?/g, "\n");
  if (whitespace === "ignore") return text.replace(/[ \t]+/g, "");
  if (whitespace === "trim") return text.replace(/^[ \t]+|[ \t]+$/gm, "");
  return text;
}

export function compareText(original: string, modified: string, options: {
  mode?: DiffMode;
  whitespace?: DiffWhitespace;
  ignoreCase?: boolean;
} = {}): TextDiffResult {
  if (original.length > 100000 || modified.length > 100000) {
    throw new Error("Each input must be 100,000 characters or fewer.");
  }
  const mode = options.mode ?? "lines";
  const before = normalizeText(original, options.whitespace ?? "exact");
  const after = normalizeText(modified, options.whitespace ?? "exact");
  const limits = { timeout: 250, maxEditLength: 2000, ignoreCase: options.ignoreCase ?? false };
  const changes = mode === "lines" ? diffLines(before, after, limits) : diffWordsWithSpace(before, after, limits);
  if (!changes) {
    throw new Error("This comparison exceeded the computation limit. Shorten the inputs or reduce the differences.");
  }
  const parts: DiffPart[] = changes.map(change => ({
    kind: change.added ? "added" : change.removed ? "removed" : "unchanged",
    value: change.value,
    count: change.count ?? 0,
  }));
  const hasChanges = parts.some(part => part.kind !== "unchanged");
  let patch = "";
  if (hasChanges) {
    const result = createTwoFilesPatch("original.txt", "modified.txt", before, after, undefined, undefined, {
      ...limits,
      context: 3,
    });
    if (result === undefined) throw new Error("Patch generation exceeded the computation limit. Shorten the inputs.");
    patch = result;
  }

  const lines: DiffLine[] = [];
  let originalLine = 1;
  let modifiedLine = 1;
  if (mode === "lines") {
    for (const part of parts) {
      for (const value of part.value.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
        if (lines.length >= 3000) {
          throw new Error("The result exceeds 3,000 display lines. Shorten the inputs or use word mode.");
        }
        const missingNewline = !value.endsWith("\n");
        lines.push({
          kind: part.kind,
          value: missingNewline ? value : value.slice(0, -1),
          originalLine: part.kind === "added" ? null : originalLine++,
          modifiedLine: part.kind === "removed" ? null : modifiedLine++,
          missingNewline,
        });
      }
    }
  }

  return {
    parts,
    lines,
    added: parts.filter(part => part.kind === "added").reduce((total, part) => total + part.count, 0),
    removed: parts.filter(part => part.kind === "removed").reduce((total, part) => total + part.count, 0),
    hasChanges,
    patch,
  };
}
