import type { DeckProgress } from './types';

/** Fisher–Yates shuffle; returns a new array and never mutates the input. */
export const shuffle = <T>(items: readonly T[], random: () => number = Math.random): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const createDeck = (questionIds: readonly string[], random?: () => number): DeckProgress => ({
  order: shuffle(questionIds, random),
  cursor: 0,
  furthest: 0,
});

/** Next card. `furthest` only grows when a never-shown card reaches the table (009). */
export const advance = (deck: DeckProgress): DeckProgress => {
  const cursor = Math.min(deck.cursor + 1, deck.order.length);
  return { ...deck, cursor, furthest: Math.max(deck.furthest, Math.min(cursor, deck.order.length - 1)) };
};

/** A previous card exists while a card is on the table and it is not the first (009). */
export const canGoBack = (deck: DeckProgress): boolean => deck.cursor > 0 && deck.cursor < deck.order.length;

/** Previous card; returns `deck` itself on the first card. History stays in `order` (009). */
export const goBack = (deck: DeckProgress): DeckProgress => (canGoBack(deck) ? { ...deck, cursor: deck.cursor - 1 } : deck);

/** Current question id, or `undefined` when the deck is completed. */
export const currentQuestionId = (deck: DeckProgress): string | undefined => deck.order[deck.cursor];

export const isCompleted = (deck: DeckProgress): boolean => deck.cursor >= deck.order.length;

/** Cards never shown yet (after `furthest`); 0 once every card has reached the table. */
export const remainingCount = (deck: DeckProgress): number => Math.max(0, deck.order.length - deck.furthest - 1);

/** A reshuffle only makes sense with at least 2 never-shown cards (008 FR-006, 009 FR-011). */
export const canReshuffleRemaining = (deck: DeckProgress): boolean => remainingCount(deck) >= 2;

const MAX_SHUFFLE_ATTEMPTS = 8;

const sameOrder = (a: readonly string[], b: readonly string[]): boolean => a.every((id, i) => id === b[i]);

/**
 * Reorders only the cards never shown yet (008, narrowed by 009). Keeps the history
 * (`order[0..furthest]`), the cursor and `furthest`, so the counter, going back and the
 * no-repeat rule are untouched. With 2+ cards left the new tail always differs from the old one:
 * Fisher–Yates with rejection of the old order, then a one-step rotation if a degenerate `random`
 * keeps returning it. Returns `deck` itself when there is nothing to reorder.
 * See specs/008-reshuffle-remaining-cards/data-model.md and specs/009-directional-swipe-navigation/data-model.md.
 */
export const reshuffleRemaining = (deck: DeckProgress, random: () => number = Math.random): DeckProgress => {
  if (!canReshuffleRemaining(deck)) return deck;
  const prefix = deck.order.slice(0, deck.furthest + 1);
  const tail = deck.order.slice(deck.furthest + 1);
  let next = tail;
  for (let attempt = 0; attempt < MAX_SHUFFLE_ATTEMPTS && sameOrder(next, tail); attempt += 1) {
    next = shuffle(tail, random);
  }
  if (sameOrder(next, tail)) next = [...tail.slice(1), tail[0]];
  return { ...deck, order: [...prefix, ...next] };
};
