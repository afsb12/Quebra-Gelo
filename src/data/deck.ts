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

/** Category of a question id; `undefined` when unknown (such cards are never picked, 011). */
export type CategoryOf = (questionId: string) => string | undefined;

/** The newest card is on the table: not reviewing history (009) and not completed. */
const atFrontier = (deck: DeckProgress): boolean => deck.cursor === deck.furthest && deck.cursor < deck.order.length;

/**
 * Categories other than the current card's that still have never-shown cards, in the order they
 * first appear in the never-shown tail (011 research R3).
 */
export const moodCategories = (deck: DeckProgress, categoryOf: CategoryOf): string[] => {
  const id = currentQuestionId(deck);
  const currentCategory = id === undefined ? undefined : categoryOf(id);
  const categories: string[] = [];
  for (const tailId of deck.order.slice(deck.furthest + 1)) {
    const category = categoryOf(tailId);
    if (category !== undefined && category !== currentCategory && !categories.includes(category)) {
      categories.push(category);
    }
  }
  return categories;
};

/** "Mudar o clima" is possible on the newest card while another category has cards left (011). */
export const canChangeMood = (deck: DeckProgress, categoryOf: CategoryOf): boolean =>
  atFrontier(deck) && moodCategories(deck, categoryOf).length > 0;

/**
 * "Mudar o clima" (011): picks one of `moodCategories` with equal odds, moves that category's
 * first never-shown card right after the newest card and advances to it. History, the set of ids
 * and the order of the other never-shown cards are kept, so no card ever repeats. Returns `deck`
 * itself when the mood cannot change. See specs/011-mixed-change-mood/data-model.md.
 */
export const changeMood = (deck: DeckProgress, categoryOf: CategoryOf, random: () => number = Math.random): DeckProgress => {
  if (!atFrontier(deck)) return deck;
  const categories = moodCategories(deck, categoryOf);
  if (categories.length === 0) return deck;
  const category = categories[Math.min(Math.floor(random() * categories.length), categories.length - 1)];
  const prefix = deck.order.slice(0, deck.furthest + 1);
  const tail = deck.order.slice(deck.furthest + 1);
  const index = tail.findIndex((id) => categoryOf(id) === category);
  const moved = tail[index];
  return advance({ ...deck, order: [...prefix, moved, ...tail.slice(0, index), ...tail.slice(index + 1)] });
};

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
