/// <reference types="node" />
/**
 * Generates every app icon asset from the parametric symbol in `scripts/icon/symbol.ts`
 * (003 research R5/R6). Run with `node scripts/generate-icons.ts`; output is deterministic.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { crc32, deflateSync } from 'node:zlib';

import { SYMBOL, coverageAt, layout, toSvg, type IconFit } from './icon/symbol.ts';

type Rgb = [number, number, number];

interface Variant {
  file: string;
  size: number;
  fit: IconFit;
  background: 'opaque' | 'transparent';
  mode: 'color' | 'mono';
}

const OUT = join(import.meta.dirname, '..', 'Assets', 'app');
const MAIN_FIT: IconFit = { kind: 'bbox', ratio: 0.6 };
const SAFE_ZONE_FIT: IconFit = { kind: 'radius', ratio: 0.3 };

const VARIANTS: Variant[] = [
  { file: 'icon.png', size: 1024, fit: MAIN_FIT, background: 'opaque', mode: 'color' },
  { file: 'android-icon-foreground.png', size: 1024, fit: SAFE_ZONE_FIT, background: 'transparent', mode: 'color' },
  { file: 'android-icon-monochrome.png', size: 1024, fit: SAFE_ZONE_FIT, background: 'transparent', mode: 'mono' },
  { file: 'favicon.png', size: 48, fit: { kind: 'bbox', ratio: 0.7 }, background: 'opaque', mode: 'color' },
  // Splash: symbol fills the image, leaving about one stroke of margin on each side.
  { file: 'splash-icon.png', size: 1024, fit: { kind: 'bbox', ratio: 0.9 }, background: 'transparent', mode: 'color' },
];

const SUBSAMPLES = 4;

const rgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;

/** Fill and outline coverage of one pixel, supersampled only where an edge crosses it. */
const pixelCoverage = (x: number, y: number, l: ReturnType<typeof layout>) => {
  const center = coverageAt(x + 0.5, y + 0.5, l, SYMBOL, 1.5);
  const solid = (v: number) => v === 0 || v === 1;
  if (solid(center.fill) && solid(center.outline)) return center;
  let fill = 0;
  let outline = 0;
  for (let sy = 0; sy < SUBSAMPLES; sy += 1) {
    for (let sx = 0; sx < SUBSAMPLES; sx += 1) {
      const c = coverageAt(x + (sx + 0.5) / SUBSAMPLES, y + (sy + 0.5) / SUBSAMPLES, l, SYMBOL, 1 / SUBSAMPLES);
      fill += c.fill;
      outline += c.outline;
    }
  }
  const n = SUBSAMPLES * SUBSAMPLES;
  return { fill: fill / n, outline: outline / n };
};

/** Renders a variant to raw 8-bit RGB or RGBA rows (without PNG filter bytes). */
const render = (v: Variant): { channels: 3 | 4; pixels: Uint8Array } => {
  const l = layout(SYMBOL, v.size, v.fit);
  const channels = v.background === 'opaque' ? 3 : 4;
  const pixels = new Uint8Array(v.size * v.size * channels);
  const bg = rgb(SYMBOL.colors.background);
  const accent: Rgb = v.mode === 'mono' ? [255, 255, 255] : rgb(SYMBOL.colors.accent);
  const outline: Rgb = v.mode === 'mono' ? [255, 255, 255] : rgb(SYMBOL.colors.outline);

  for (let y = 0; y < v.size; y += 1) {
    for (let x = 0; x < v.size; x += 1) {
      const c = pixelCoverage(x, y, l);
      // Premultiplied "over": background → fill → outline.
      let alpha = channels === 3 ? 1 : 0;
      let color: number[] = channels === 3 ? [...bg] : [0, 0, 0];
      for (const [layer, a] of [
        [accent, c.fill],
        [outline, c.outline],
      ] as const) {
        color = color.map((ch, i) => layer[i] * a + ch * (1 - a));
        alpha = a + alpha * (1 - a);
      }
      const i = (y * v.size + x) * channels;
      for (let k = 0; k < 3; k += 1) pixels[i + k] = Math.round(alpha > 0 ? color[k] / alpha : 0);
      if (channels === 4) pixels[i + 3] = Math.round(alpha * 255);
    }
  }
  return { channels, pixels };
};

const chunk = (type: string, data: Buffer): Buffer => {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
};

/** Minimal deterministic PNG: IHDR + one IDAT (filter 0 rows) + IEND, no metadata chunks. */
const encodePng = (size: number, channels: 3 | 4, pixels: Uint8Array): Buffer => {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = channels === 4 ? 6 : 2; // RGBA : RGB
  const stride = size * channels;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y += 1) {
    Buffer.from(pixels.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

const write = (file: string, data: string | Buffer) => {
  writeFileSync(join(OUT, file), data);
  console.log(`wrote Assets/app/${file}`);
};

write('icon-source.svg', toSvg(SYMBOL, 1024, MAIN_FIT, true));
for (const variant of VARIANTS) {
  const { channels, pixels } = render(variant);
  write(variant.file, encodePng(variant.size, channels, pixels));
}
