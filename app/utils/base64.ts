const maximumTextLength = 1_000_000;
const maximumBytes = 5 * 1024 * 1024;
const maximumEncodedLength = Math.ceil(maximumBytes / 3) * 4;

export function encodeBase64(bytes: Uint8Array): string {
  if (bytes.length > maximumBytes) throw new Error("Input must be 5 MB or smaller.");
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

export function decodeBase64(value: string): Uint8Array {
  if (value.length > maximumEncodedLength) throw new Error("Input must decode to 5 MB or less.");
  const compact = value.replace(/\s/g, "");
  if (compact.length > maximumEncodedLength) {
    throw new Error("Input must decode to 5 MB or less.");
  }
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(compact)) {
    if (compact.includes("=") || compact.length % 4 === 1 || !/^[A-Za-z0-9+/]*$/.test(compact)) {
      throw new Error("Enter valid standard Base64 text.");
    }
  }
  const padded = compact.padEnd(Math.ceil(compact.length / 4) * 4, "=");
  let binary: string;
  try {
    binary = atob(padded);
  } catch {
    throw new Error("Enter valid standard Base64 text.");
  }
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  if (bytes.length > maximumBytes) throw new Error("Input must decode to 5 MB or less.");
  return bytes;
}

export function encodeBase64Text(value: string): string {
  if (value.length > maximumTextLength) throw new Error("Text must be 1,000,000 characters or fewer.");
  return encodeBase64(new TextEncoder().encode(value));
}

export function decodeBase64Text(value: string): string {
  const bytes = decodeBase64(value);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("Decoded bytes are not valid UTF-8. Use file mode for binary data.");
  }
}
