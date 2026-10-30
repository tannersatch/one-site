import romanNumerals from "roman-numerals";

export function decimalToRoman(input: string): string {
  const normalized = input.trim();
  if (!normalized) return "";
  const value = Number(normalized);
  if (!/^\d+$/.test(normalized) || !Number.isInteger(value) || value < 1 || value > 3999) {
    throw new Error("Enter a whole number from 1 to 3999.");
  }
  return romanNumerals.toRoman(value);
}

export function romanToDecimal(input: string): string {
  const normalized = input.trim().toUpperCase();
  if (!normalized) return "";
  if (!/^[IVXLCDM]+$/.test(normalized)) {
    throw new Error("Use only Roman letters: I, V, X, L, C, D, M.");
  }

  try {
    const value = romanNumerals.toArabic(normalized);
    if (value >= 1 && value <= 3999 && romanNumerals.toRoman(value) === normalized) {
      return String(value);
    }
  } catch {
    throw new Error("Use standard Roman notation, such as IV instead of IIII. Supported range: 1 to 3999.");
  }
  throw new Error("Use standard Roman notation, such as IV instead of IIII. Supported range: 1 to 3999.");
}
