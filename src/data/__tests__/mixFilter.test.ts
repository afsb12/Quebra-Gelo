import { activeMixCategories, isValidMixSelection, MIN_MIX_CATEGORIES, sameSelection, sanitizeExcluded } from '../mixFilter';
import { CATEGORY_IDS } from '../types';

describe('mix filter rules (006)', () => {
  it('needs at least 2 categories', () => {
    expect(MIN_MIX_CATEGORIES).toBe(2);
    expect(isValidMixSelection([])).toBe(false);
    expect(isValidMixSelection(['casais'])).toBe(false);
    expect(isValidMixSelection(['casais', 'futuro'])).toBe(true);
  });

  it('active = all minus excluded, in content order', () => {
    expect(activeMixCategories(['dilemas', 'casual'], CATEGORY_IDS)).toEqual(
      CATEGORY_IDS.filter((id) => id !== 'dilemas' && id !== 'casual'),
    );
    expect(activeMixCategories([], CATEGORY_IDS)).toEqual([...CATEGORY_IDS]);
  });

  it('sanitizes persisted data: unknown/duplicate IDs dropped, non-arrays → all on', () => {
    expect(sanitizeExcluded(['casais', 'casais', 'trabalho', 3], CATEGORY_IDS)).toEqual(['casais']);
    expect(sanitizeExcluded('casais', CATEGORY_IDS)).toEqual([]);
    expect(sanitizeExcluded(undefined, CATEGORY_IDS)).toEqual([]);
  });

  it('falls back to all on when fewer than 2 would stay active', () => {
    expect(sanitizeExcluded(CATEGORY_IDS.slice(1), CATEGORY_IDS)).toEqual([]);
    expect(sanitizeExcluded(CATEGORY_IDS.slice(2), CATEGORY_IDS)).toEqual(CATEGORY_IDS.slice(2));
  });

  it('a category that did not exist when saving stays on', () => {
    const before = CATEGORY_IDS.slice(0, 7);
    expect(activeMixCategories(sanitizeExcluded(['casual'], before), CATEGORY_IDS)).toContain('futuro');
  });

  it('compares selections as sets', () => {
    expect(sameSelection(['casais', 'futuro'], ['futuro', 'casais'])).toBe(true);
    expect(sameSelection(['casais', 'futuro'], ['casais'])).toBe(false);
    expect(sameSelection(['casais', 'futuro'], ['casais', 'dilemas'])).toBe(false);
  });
});
