import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = 'C:/Users/inhal/Desktop/RAwebsite authority icons.png';
const OUT = path.join(__dirname, '..', 'public', 'assets', 'images', 'authority-icons');

// Source: 1080x1080. 5x2 grid. Per-icon centres (some icons are slightly
// offset within their cells, so coords are tuned individually).
const W = 200, H = 200;

const icons = [
  { name: '01-seal',           cx: 156, cy: 320 },
  { name: '02-column',         cx: 368, cy: 320 },
  { name: '03-magnifier-doc',  cx: 560, cy: 320 },
  { name: '04-stamped-doc',    cx: 752, cy: 320 },
  { name: '05-scales',         cx: 944, cy: 320 },
  { name: '06-archive',        cx: 140, cy: 695 },
  { name: '07-laurel-doc',     cx: 348, cy: 695 },
  { name: '08-compass',        cx: 560, cy: 695 },
  { name: '09-fingerprint',    cx: 752, cy: 695 },
  { name: '10-stamp',          cx: 944, cy: 695 },
];

// Threshold: pixels with R, G, B all >= this are made fully transparent.
// Source icons are dark navy on white, so a high threshold preserves linework.
const WHITE_THRESHOLD = 240;

// Final canvas size for output. Icons get auto-trimmed to content,
// then centred on this square canvas.
const CANVAS = 240;

for (const { name, cx, cy } of icons) {
  const left = Math.round(cx - W / 2);
  const top = Math.round(cy - H / 2);

  // Step 1: extract the rough region, convert near-white to transparent.
  const { data, info } = await sharp(SRC)
    .extract({ left, top, width: W, height: H })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let p = 0; p < data.length; p += 4) {
    if (
      data[p] >= WHITE_THRESHOLD &&
      data[p + 1] >= WHITE_THRESHOLD &&
      data[p + 2] >= WHITE_THRESHOLD
    ) {
      data[p + 3] = 0;
    }
  }

  // Step 2: trim the transparent border (auto-removes empty space on
  // any side), giving a tight bounding box around the icon content.
  // Encode to PNG so metadata is readable downstream.
  const { data: trimmed, info: trimmedInfo } = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });

  // Step 3: re-pad to a uniform square canvas, centred.
  const padX = Math.floor((CANVAS - trimmedInfo.width) / 2);
  const padY = Math.floor((CANVAS - trimmedInfo.height) / 2);

  // Transparent variant.
  const transparentPath = path.join(OUT, `${name}-transparent.png`);
  await sharp(trimmed)
    .extend({
      top: padY,
      bottom: CANVAS - trimmedInfo.height - padY,
      left: padX,
      right: CANVAS - trimmedInfo.width - padX,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(transparentPath);

  // Opaque variant (white background, centred).
  const opaquePath = path.join(OUT, `${name}.png`);
  await sharp(trimmed)
    .extend({
      top: padY,
      bottom: CANVAS - trimmedInfo.height - padY,
      left: padX,
      right: CANVAS - trimmedInfo.width - padX,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(opaquePath);

  console.log(`wrote ${name} (content ${trimmedInfo.width}x${trimmedInfo.height})`);
}
