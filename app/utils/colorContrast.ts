import { normalizeHex } from "./cssGradient.ts";

function luminance(hex: string): number {
  const color = normalizeHex(hex);
  const channels = [0, 2, 4].map(offset => Number.parseInt(color.slice(offset + 1, offset + 3), 16) / 255);
  const linear = channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
}

export function contrastRatio(foreground: string, background: string): number {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function contrastResults(ratio: number) {
  if (!Number.isFinite(ratio) || ratio < 1 || ratio > 21) throw new Error("Contrast ratio must be between 1 and 21.");
  return {
    ratio: Number(ratio.toFixed(2)),
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}
