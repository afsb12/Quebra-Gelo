import type { Category, CategoryId } from '../../data/types';
import { CATEGORY_IDS } from '../../data/types';
import { CATEGORY_INK, getCategoryVisual } from '../categoryVisual';
import { contrastRatio } from '../color';
import { tokens } from '../tokens';

// 002 research R1: color (back), onColor, ink (on cream).
const TABLE: Record<CategoryId, { color: string; onColor: 'dark' | 'white'; ink: string }> = {
  casual: { color: '#F5C230', onColor: 'dark', ink: '#8A6100' },
  'primeiros-encontros': { color: '#FF8A80', onColor: 'dark', ink: '#D71100' },
  profundo: { color: '#3D3FA6', onColor: 'white', ink: '#3D3FA6' },
  casais: { color: '#C41E3A', onColor: 'white', ink: '#B01A34' },
  'happy-hour': { color: '#F27A1F', onColor: 'dark', ink: '#A84F00' },
  dilemas: { color: '#7A3EB1', onColor: 'white', ink: '#6E35A3' },
  viagens: { color: '#14A39E', onColor: 'dark', ink: '#0B6B67' },
  nostalgia: { color: '#F28CB4', onColor: 'dark', ink: '#A6316B' },
  familia: { color: '#27AE60', onColor: 'dark', ink: '#007A15' },
  futuro: { color: '#167A4C', onColor: 'white', ink: '#167A4C' },
};

// CIE76 ΔE between two `#RRGGBB` colors (sRGB → linear → XYZ D65 → Lab).
const toLab = (hex: string): [number, number, number] => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047);
  const y = f(r * 0.2126 + g * 0.7152 + b * 0.0722);
  const z = f((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};

const deltaE = (a: string, b: string): number => {
  const [l1, a1, b1] = toLab(a);
  const [l2, a2, b2] = toLab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
};

const category = (id: CategoryId): Category => ({
  id,
  title: id,
  icon: 'star',
  color: TABLE[id].color,
  description: '',
});

describe('category visuals (palette)', () => {
  it.each(CATEGORY_IDS)('%s matches the R1 table and passes contrast', (id) => {
    const visual = getCategoryVisual(category(id));
    const expectedOn = TABLE[id].onColor === 'dark' ? tokens.colors.onColorDark : tokens.colors.onColorLight;
    expect(visual.color).toBe(TABLE[id].color);
    expect(visual.onColor).toBe(expectedOn);
    expect(visual.ink).toBe(TABLE[id].ink);
    expect(CATEGORY_INK[id]).toBe(TABLE[id].ink);
    expect(contrastRatio(visual.onColor, visual.color)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(visual.ink, tokens.colors.cream)).toBeGreaterThanOrEqual(4.5);
  });

  it('question text on cream reaches 4.5:1', () => {
    expect(contrastRatio(tokens.colors.questionInk, tokens.colors.cream)).toBeGreaterThanOrEqual(4.5);
  });

  it('has no pattern and a distinct back color per category (003 FR-001, FR-005)', () => {
    const visuals = CATEGORY_IDS.map((id) => getCategoryVisual(category(id)));
    for (const visual of visuals) expect('pattern' in visual).toBe(false);
    expect(new Set(visuals.map((v) => v.color)).size).toBe(CATEGORY_IDS.length);
  });

  // 013 research R2: scoped to familia; older pairs below 25 (Profundo/Dilemas) are out of scope.
  it('familia is distinct from every other category on both faces (ΔE ≥ 25, 013)', () => {
    for (const id of CATEGORY_IDS.filter((other) => other !== 'familia')) {
      const back = Math.round(deltaE(TABLE.familia.color, TABLE[id].color) * 10) / 10;
      const ink = Math.round(deltaE(CATEGORY_INK.familia, CATEGORY_INK[id]) * 10) / 10;
      expect({ id, back: back >= 25, ink: ink >= 25 }).toEqual({ id, back: true, ink: true });
    }
  });
});
