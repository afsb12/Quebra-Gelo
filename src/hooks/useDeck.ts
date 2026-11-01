import { useCallback, useEffect, useMemo } from 'react';

import { getCategory, getQuestion } from '../data/content';
import { createDeck, currentQuestionId } from '../data/deck';
import { MIXED_DECK_ID, type Category, type DeckId, type DeckProgress, type Question } from '../data/types';
import { strings } from '../i18n/strings';
import { useProgressStore } from '../store/progress';

export interface UseDeckResult {
  deckId: DeckId;
  /** Header title: the category name, or "Tudo Misturado". */
  title: string;
  /** The deck's category; `undefined` for the mixed deck. */
  deckCategory: Category | undefined;
  /** `undefined` once every card was shown → show the "Fim do Baralho" screen. */
  current: Question | undefined;
  /** Category the current question comes from (equals `deckCategory` in a category deck). */
  currentCategory: Category | undefined;
  position: { index: number; total: number };
  /** False only on the very first render, before the deck is created. */
  ready: boolean;
  discard: () => void;
  reshuffle: () => void;
}

const EMPTY_DECK: DeckProgress = createDeck([]);

export const useDeck = (deckId: DeckId): UseDeckResult => {
  const deck = useProgressStore((state) => state.decks[deckId]);
  const ensureDeck = useProgressStore((state) => state.ensureDeck);
  const discardInStore = useProgressStore((state) => state.discard);
  const reshuffleInStore = useProgressStore((state) => state.reshuffle);

  // Create the shuffled deck on first entry; keep it (resume) on later entries.
  useEffect(() => {
    ensureDeck(deckId);
  }, [deckId, ensureDeck]);

  const mixed = deckId === MIXED_DECK_ID;
  const deckCategory = mixed ? undefined : getCategory(deckId);
  if (!mixed && !deckCategory) throw new Error(`Unknown category: ${deckId}`);

  const active = deck ?? EMPTY_DECK;
  const id = currentQuestionId(active);
  const current = id ? getQuestion(id) : undefined;
  const currentCategory = current ? getCategory(current.categoryId) : undefined;

  const discard = useCallback(() => discardInStore(deckId), [deckId, discardInStore]);
  const reshuffle = useCallback(() => reshuffleInStore(deckId), [deckId, reshuffleInStore]);

  const position = useMemo(
    () => ({ index: Math.min(active.cursor + 1, active.order.length), total: active.order.length }),
    [active.cursor, active.order.length],
  );

  return {
    deckId,
    title: deckCategory?.title ?? strings.mixed.title,
    deckCategory,
    current,
    currentCategory,
    position,
    ready: deck !== undefined,
    discard,
    reshuffle,
  };
};
