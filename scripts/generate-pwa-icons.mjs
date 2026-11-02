import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const directory = new URL("../public/tools/", import.meta.url);
const source = new URL("../public/favicon-black.svg", import.meta.url);
await mkdir(directory, { recursive: true });

for (
  const [filename, size, scale] of [
    ["icon-192.png", 192, 0.8],
    ["icon-512.png", 512, 0.8],
    ["icon-maskable-512.png", 512, 0.56],
    ["apple-touch-icon.png", 180, 0.8],
  ]
) {
  const artwork = await sharp(source.pathname).resize(Math.round(size * scale)).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#f8fafc" } })
    .composite([{ input: artwork, gravity: "centre" }])
    .png()
    .toFile(new URL(filename, directory).pathname);
}
