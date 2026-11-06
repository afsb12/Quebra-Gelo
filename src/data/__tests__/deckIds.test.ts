import { getAllQuestions, getDeckQuestionIds, getQuestionsByCategory, isDeckId } from '../content';
import { CATEGORY_IDS } from '../types';

describe('deck IDs (004)', () => {
  it('isDeckId accepts the 8 categories and "mixed" only', () => {
    for (const id of CATEGORY_IDS) expect(isDeckId(id)).toBe(true);
    expect(isDeckId('mixed')).toBe(true);
    expect(isDeckId('trabalho')).toBe(false);
    expect(isDeckId('')).toBe(false);
  });

  it('the mixed deck lists every question exactly once, from all 8 categories', () => {
    const ids = getDeckQuestionIds('mixed');
    expect(ids).toHaveLength(getAllQuestions().length);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(getAllQuestions().map((q) => q.categoryId)).size).toBe(CATEGORY_IDS.length);
  });

  it('a category deck lists only that category', () => {
    expect(getDeckQuestionIds('futuro')).toEqual(getQuestionsByCategory('futuro').map((q) => q.id));
  });

  it('a filtered mixed deck lists only the chosen categories (006)', () => {
    const ids = getDeckQuestionIds('mixed', ['casais', 'futuro']);
    const expected = [...getQuestionsByCategory('casais'), ...getQuestionsByCategory('futuro')].map((q) => q.id);
    expect([...ids].sort()).toEqual([...expected].sort());
  });

  it('category decks ignore the mix filter (006 FR-011)', () => {
    expect(getDeckQuestionIds('dilemas', ['casais', 'futuro'])).toEqual(getQuestionsByCategory('dilemas').map((q) => q.id));
  });
});
