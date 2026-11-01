import { useCallback, useEffect, useMemo } from 'react';

import { getCategory, getQuestion } from '../data/content';
import { createDeck, currentQuestionId } from '../data/deck';
import type { Category, CategoryId, DeckProgress, Question } from '../data/types';
import { useProgressStore } from '../store/progress';

export interface UseDeckResult {
  category: Category;
  /** `undefined` once every card was shown → show the "Fim do Baralho" screen. */
  current: Question | undefined;
  position: { index: number; total: number };
  /** False only on the very first render, before the deck is created. */
  ready: boolean;
  discard: () => void;
  reshuffle: () => void;
}

const EMPTY_DECK: DeckProgress = createDeck([]);

export const useDeck = (categoryId: CategoryId): UseDeckResult => {
  const deck = useProgressStore((state) => state.decks[categoryId]);
  const ensureDeck = useProgressStore((state) => state.ensureDeck);
  const discardInStore = useProgressStore((state) => state.discard);
  const reshuffleInStore = useProgressStore((state) => state.reshuffle);

  // Create the shuffled deck on first entry; keep it (resume) on later entries.
  useEffect(() => {
    ensureDeck(categoryId);
  }, [categoryId, ensureDeck]);

  const category = getCategory(categoryId);
  if (!category) throw new Error(`Unknown category: ${categoryId}`);

  const active = deck ?? EMPTY_DECK;
  const id = currentQuestionId(active);
  const current = id ? getQuestion(id) : undefined;

  const discard = useCallback(() => discardInStore(categoryId), [categoryId, discardInStore]);
  const reshuffle = useCallback(() => reshuffleInStore(categoryId), [categoryId, reshuffleInStore]);

  const position = useMemo(
    () => ({ index: Math.min(active.cursor + 1, active.order.length), total: active.order.length }),
    [active.cursor, active.order.length],
  );

  return { category, current, position, ready: deck !== undefined, discard, reshuffle };
};
