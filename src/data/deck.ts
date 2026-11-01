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
});

export const advance = (deck: DeckProgress): DeckProgress => ({
  ...deck,
  cursor: Math.min(deck.cursor + 1, deck.order.length),
});

/** Current question id, or `undefined` when the deck is completed. */
export const currentQuestionId = (deck: DeckProgress): string | undefined => deck.order[deck.cursor];

export const isCompleted = (deck: DeckProgress): boolean => deck.cursor >= deck.order.length;
