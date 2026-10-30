export type UrlEncodingMode = "component" | "uri";

export function encodeUrl(value: string, mode: UrlEncodingMode): string {
  return mode === "component" ? encodeURIComponent(value) : encodeURI(value);
}

export function decodeUrl(value: string, mode: UrlEncodingMode): string {
  return mode === "component" ? decodeURIComponent(value) : decodeURI(value);
}
