import { advance, canChangeMood, changeMood, createDeck, currentQuestionId, goBack, isCompleted, moodCategories } from '../deck';
import type { DeckProgress } from '../types';

/** Deterministic pseudo-random generator for reproducible runs. */
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

/** Category = the id's first letter (`a1` → `a`); `x` ids have no known category. */
const categoryOf = (id: string) => (id.startsWith('x') ? undefined : id[0]);
const deckOf = (order: string[], cursor = 0, furthest = cursor): DeckProgress => ({ order, cursor, furthest });
const current = (deck: DeckProgress) => currentQuestionId(deck) ?? '';

describe('changeMood (011)', () => {
  it('deals a never-shown card of another category and advances one position', () => {
    const deck = deckOf(['a1', 'b1', 'a2', 'c1', 'a3'], 1);
    const next = changeMood(deck, categoryOf, seeded(4));
    expect(next).toMatchObject({ cursor: 2, furthest: 2 });
    expect(categoryOf(current(next))).not.toBe(categoryOf(current(deck)));
    expect(['a2', 'c1', 'a3']).toContain(current(next));
  });

  it('keeps the history, the set of ids and the order of the other never-shown cards', () => {
    const deck = deckOf(['a1', 'b1', 'b2', 'a2', 'c1', 'b3', 'c2'], 1);
    for (let seed = 1; seed <= 50; seed += 1) {
      const next = changeMood(deck, categoryOf, seeded(seed));
      expect(next.order.slice(0, 2)).toEqual(['a1', 'b1']);
      expect([...next.order].sort()).toEqual([...deck.order].sort());
      const moved = next.order[2];
      expect(categoryOf(moved)).not.toBe('b');
      expect(next.order.slice(3)).toEqual(deck.order.slice(2).filter((id) => id !== moved));
      // The first never-shown card of the chosen category is the one that moves.
      expect(moved).toBe(deck.order.slice(2).find((id) => categoryOf(id) === categoryOf(moved)));
    }
  });

  it('gives every other category the same chance, whatever its size (SC-002)', () => {
    const tail = [...Array.from({ length: 10 }, (_, i) => `b${i}`), 'c1', 'd1'];
    const deck = deckOf(['a1', ...tail]);
    const random = seeded(2026);
    const counts: Record<string, number> = { b: 0, c: 0, d: 0 };
    for (let i = 0; i < 1000; i += 1) {
      const category = categoryOf(current(changeMood(deck, categoryOf, random))) ?? '';
      counts[category] += 1;
    }
    for (const count of Object.values(counts)) {
      expect(count).toBeGreaterThanOrEqual(250);
      expect(count).toBeLessThanOrEqual(420);
    }
  });

  it('any mix of next/back/change mood shows every card exactly once (SC-003)', () => {
    const ids = ['a', 'b', 'c', 'd'].flatMap((c) => [1, 2, 3].map((n) => `${c}${n}`));
    const random = seeded(11);
    let deck = createDeck(ids, seeded(8));
    const shown = [current(deck)];
    let guard = 0;
    while (!isCompleted(deck) && guard < 1000) {
      const history = deck.order.slice(0, deck.furthest + 1);
      const roll = random();
      const next = roll < 0.25 ? goBack(deck) : roll < 0.6 ? changeMood(deck, categoryOf, random) : advance(deck);
      expect(next.order.slice(0, deck.furthest + 1)).toEqual(history);
      if (next.furthest > deck.furthest) {
        expect(shown).not.toContain(current(next));
        shown.push(current(next));
      }
      deck = next;
      guard += 1;
    }
    expect(isCompleted(deck)).toBe(true);
    expect([...shown].sort()).toEqual([...ids].sort());
  });

  it('does nothing when it cannot change the mood', () => {
    const reviewing = goBack(deckOf(['a1', 'b1', 'c1', 'd1'], 1));
    const sameCategoryLeft = deckOf(['a1', 'b1', 'a2', 'a3'], 2);
    const lastCard = deckOf(['a1', 'b1'], 1);
    const completed = deckOf(['a1', 'b1'], 2, 1);
    for (const deck of [reviewing, sameCategoryLeft, lastCard, completed]) {
      expect(canChangeMood(deck, categoryOf)).toBe(false);
      expect(changeMood(deck, categoryOf, seeded(1))).toBe(deck);
    }
    expect(canChangeMood(deckOf(['a1', 'a2', 'b1']), categoryOf)).toBe(true);
  });

  it('never picks cards without a known category', () => {
    const deck = deckOf(['a1', 'x1', 'x2', 'b1']);
    expect(moodCategories(deck, categoryOf)).toEqual(['b']);
    expect(current(changeMood(deck, categoryOf, seeded(3)))).toBe('b1');
    expect(canChangeMood(deckOf(['a1', 'x1', 'a2']), categoryOf)).toBe(false);
  });
});
