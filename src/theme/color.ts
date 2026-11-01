import { tokens } from './tokens';

type Rgb = [number, number, number];

const parseHex = (hex: string): Rgb => {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) throw new Error(`Invalid hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16)) as Rgb;
};

const toHex = ([r, g, b]: Rgb): string =>
  `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

const relativeLuminance = (hex: string): number => {
  const [r, g, b] = parseHex(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2.1 contrast ratio between two hex colors (1–21). */
export const contrastRatio = (a: string, b: string): number => {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Text/icon color for content drawn on top of `color`: whichever of light/dark contrasts more. */
export const pickOnColor = (color: string): string => {
  const { onColorLight, onColorDark } = tokens.colors;
  return contrastRatio(onColorLight, color) >= contrastRatio(onColorDark, color) ? onColorLight : onColorDark;
};

const rgbToHsl = ([r, g, b]: Rgb): Rgb => {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === rn ? ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6 : max === gn ? ((bn - rn) / d + 2) / 6 : ((rn - gn) / d + 4) / 6;
  return [h, s, l];
};

const hslToRgb = ([h, s, l]: Rgb): Rgb => {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const hue = (p: number, q: number, t: number) => {
    const tt = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue(p, q, h + 1 / 3) * 255, hue(p, q, h) * 255, hue(p, q, h - 1 / 3) * 255];
};

/**
 * A variant of `color` usable on the cream card front: returns `color` when it already reaches
 * 4.5:1 against cream, otherwise darkens it in HSL lightness steps until it does.
 */
export const inkOnCream = (color: string, cream: string = tokens.colors.cream): string => {
  if (contrastRatio(color, cream) >= 4.5) return color.toUpperCase();
  const [h, s, l] = rgbToHsl(parseHex(color));
  for (let lightness = l; lightness >= 0; lightness -= 0.01) {
    const candidate = toHex(hslToRgb([h, s, lightness]));
    if (contrastRatio(candidate, cream) >= 4.5) return candidate;
  }
  return tokens.colors.questionInk;
};
