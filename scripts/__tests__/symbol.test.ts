import { contrastRatio } from '../../src/theme/color';
import { tokens } from '../../src/theme/tokens';
import { SYMBOL, coverageAt, extent, layout, maxRadius, toSvg } from '../icon/symbol';

const SIZE = 1024;
const SAFE_RADIUS = 0.3056 * SIZE; // Android adaptive icon: 66 dp safe circle on a 108 dp canvas

describe('icon symbol (003 data-model IconSymbol)', () => {
  it('uses the planned geometry', () => {
    expect(SYMBOL).toMatchObject({ side: 1, offset: 0.42, radius: 0.24, stroke: 0.085 });
    expect(SYMBOL.radius).toBeGreaterThan(0);
    expect(SYMBOL.radius).toBeLessThan(SYMBOL.side / 2);
    expect(extent(SYMBOL)).toBeCloseTo(1.505, 6);
  });

  it('uses the app identity colors plus the coral accent (FR-008)', () => {
    expect(SYMBOL.colors.background).toBe(tokens.colors.appBackground);
    expect(SYMBOL.colors.outline).toBe(tokens.colors.cream);
    expect(SYMBOL.colors.accent).toBe('#FF6B4A');
  });

  it('keeps the planned contrast between its three colors (research R4)', () => {
    const { background, outline, accent } = SYMBOL.colors;
    expect(contrastRatio(accent, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(outline, background)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(accent, outline)).toBeGreaterThanOrEqual(2.2);
  });

  it('fits the Android safe zone with the radius fit (FR-010)', () => {
    const fit = layout(SYMBOL, SIZE, { kind: 'radius', ratio: 0.3 });
    expect(maxRadius(SYMBOL) * fit.scale).toBeCloseTo(0.3 * SIZE, 6);
    const step = SIZE / 64;
    for (let y = step / 2; y < SIZE; y += step) {
      for (let x = step / 2; x < SIZE; x += step) {
        const { fill, outline } = coverageAt(x, y, fit, SYMBOL);
        if (fill > 0 || outline > 0) {
          expect(Math.hypot(x - SIZE / 2, y - SIZE / 2)).toBeLessThanOrEqual(SAFE_RADIUS);
        }
      }
    }
  });

  it('fills the intersection center and leaves the canvas corner empty', () => {
    const fit = layout(SYMBOL, SIZE, { kind: 'bbox', ratio: 0.6 });
    expect(coverageAt(SIZE / 2, SIZE / 2, fit, SYMBOL)).toEqual({ fill: 1, outline: 0 });
    expect(coverageAt(0.5, 0.5, fit, SYMBOL)).toEqual({ fill: 0, outline: 0 });
  });

  it('exports an SVG master with no text and exactly three colors (FR-007, FR-013)', () => {
    const svg = toSvg(SYMBOL, SIZE, { kind: 'bbox', ratio: 0.6 }, true);
    expect(svg).not.toContain('<text');
    const colors = new Set(svg.match(/#[0-9A-F]{6}/gi)?.map((c) => c.toUpperCase()));
    expect(colors).toEqual(new Set(['#16131C', '#F7F0E3', '#FF6B4A']));
  });
});
