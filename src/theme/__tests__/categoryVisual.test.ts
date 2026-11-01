import type { Category, CategoryId } from '../../data/types';
import { CATEGORY_IDS } from '../../data/types';
import { CATEGORY_INK, getCategoryVisual } from '../categoryVisual';
import { contrastRatio } from '../color';
import { tokens } from '../tokens';

// 002 research R1: color (back), onColor, ink (on cream).
const TABLE: Record<CategoryId, { color: string; onColor: 'dark' | 'white'; ink: string }> = {
  casual: { color: '#F5C230', onColor: 'dark', ink: '#8A6100' },
  profundo: { color: '#3D3FA6', onColor: 'white', ink: '#3D3FA6' },
  casais: { color: '#C41E3A', onColor: 'white', ink: '#B01A34' },
  'happy-hour': { color: '#F27A1F', onColor: 'dark', ink: '#A84F00' },
  dilemas: { color: '#7A3EB1', onColor: 'white', ink: '#6E35A3' },
  viagens: { color: '#14A39E', onColor: 'dark', ink: '#0B6B67' },
  nostalgia: { color: '#F28CB4', onColor: 'dark', ink: '#A6316B' },
  futuro: { color: '#167A4C', onColor: 'white', ink: '#167A4C' },
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
});
