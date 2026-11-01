import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { inflateSync } from 'zlib';

const ROOT = join(__dirname, '..', '..');
const asset = (name: string) => join(ROOT, 'Assets', 'app', name);

interface Png {
  width: number;
  height: number;
  colorType: number;
  /** RGBA of a pixel (alpha 255 for RGB images). */
  pixel: (x: number, y: number) => [number, number, number, number];
}

/** Minimal PNG reader for the generator's output: 8-bit RGB/RGBA, filter 0 rows. */
const readPng = (name: string): Png => {
  const data = readFileSync(asset(name));
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat: Buffer[] = [];
  while (offset < data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.toString('ascii', offset + 4, offset + 8);
    const body = data.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      colorType = body[9];
    } else if (type === 'IDAT') {
      idat.push(body);
    }
    offset += 12 + length;
  }
  const channels = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels + 1;
  return {
    width,
    height,
    colorType,
    pixel: (x, y) => {
      if (raw[y * stride] !== 0) throw new Error(`${name}: unsupported filter on row ${y}`);
      const i = y * stride + 1 + x * channels;
      return [raw[i], raw[i + 1], raw[i + 2], channels === 4 ? raw[i + 3] : 255];
    },
  };
};

const hex = ([r, g, b]: number[]) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

const SAFE = 0.3056; // Android adaptive icon safe circle radius / canvas

const expectInsideSafeZone = (png: Png) => {
  const c = png.width / 2;
  for (let y = 0; y < png.height; y += 2) {
    for (let x = 0; x < png.width; x += 2) {
      if (png.pixel(x, y)[3] > 0) expect(Math.hypot(x + 0.5 - c, y + 0.5 - c)).toBeLessThanOrEqual(SAFE * png.width);
    }
  }
};

describe('generated app icon assets (contracts/app-icon-assets.md)', () => {
  it('icon.png: 1024² opaque RGB, dark background, coral intersection', () => {
    const png = readPng('icon.png');
    expect([png.width, png.height, png.colorType]).toEqual([1024, 1024, 2]);
    expect(hex(png.pixel(0, 0))).toBe('#16131C');
    expect(hex(png.pixel(512, 512))).toBe('#FF6B4A');
  });

  it('android-icon-foreground.png: 1024² RGBA inside the safe zone', () => {
    const png = readPng('android-icon-foreground.png');
    expect([png.width, png.height, png.colorType]).toEqual([1024, 1024, 6]);
    expect(png.pixel(0, 0)[3]).toBe(0);
    expect(hex(png.pixel(512, 512))).toBe('#FF6B4A');
    expectInsideSafeZone(png);
  });

  it('android-icon-monochrome.png: 1024² white-only RGBA inside the safe zone', () => {
    const png = readPng('android-icon-monochrome.png');
    expect([png.width, png.height, png.colorType]).toEqual([1024, 1024, 6]);
    for (let y = 0; y < png.height; y += 4) {
      for (let x = 0; x < png.width; x += 4) {
        const [r, g, b, a] = png.pixel(x, y);
        if (a > 0) expect([r, g, b]).toEqual([255, 255, 255]);
      }
    }
    expectInsideSafeZone(png);
  });

  it('favicon.png: 48² opaque RGB', () => {
    const png = readPng('favicon.png');
    expect([png.width, png.height, png.colorType]).toEqual([48, 48, 2]);
    expect(hex(png.pixel(0, 0))).toBe('#16131C');
  });

  it('splash-icon.png: 1024² RGBA with transparent corners and coral center', () => {
    const png = readPng('splash-icon.png');
    expect([png.width, png.height, png.colorType]).toEqual([1024, 1024, 6]);
    expect(png.pixel(0, 0)[3]).toBe(0);
    expect(png.pixel(1023, 1023)[3]).toBe(0);
    expect(hex(png.pixel(512, 512))).toBe('#FF6B4A');
  });

  it('keeps an editable SVG master without text and drops the redundant background image', () => {
    expect(readFileSync(asset('icon-source.svg'), 'utf8')).not.toContain('<text');
    expect(existsSync(asset('android-icon-background.png'))).toBe(false);
  });

  it('app.json points at the new assets', () => {
    const { expo } = JSON.parse(readFileSync(join(ROOT, 'app.json'), 'utf8')) as {
      expo: {
        icon: string;
        android: { adaptiveIcon: Record<string, string> };
        plugins: (string | [string, Record<string, unknown>])[];
      };
    };
    expect(expo.icon).toBe('./Assets/app/icon.png');
    expect(expo.android.adaptiveIcon.backgroundImage).toBeUndefined();
    expect(expo.android.adaptiveIcon.backgroundColor).toBe('#16131C');
    const splash = expo.plugins.find((p): p is [string, Record<string, unknown>] => Array.isArray(p) && p[0] === 'expo-splash-screen');
    expect(splash?.[1]).toMatchObject({ image: './Assets/app/splash-icon.png', imageWidth: 128, backgroundColor: '#16131C' });
  });
});
