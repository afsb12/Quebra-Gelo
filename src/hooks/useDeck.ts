import { useCallback, useEffect, useMemo } from 'react';

import { getCategory, getQuestion } from '../data/content';
import { canGoBack, canReshuffleRemaining, createDeck, currentQuestionId } from '../data/deck';
import { MIXED_DECK_ID, type Category, type DeckId, type DeckProgress, type Question } from '../data/types';
import { strings } from '../i18n/strings';
import { useMixCategories } from '../store/mixFilter';
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
  /** Next card (swipe left). */
  discard: () => void;
  /** True while a card is on the table and it is not the first (009). */
  canGoBack: boolean;
  /** Previous card (swipe right); no-op on the first card (009). */
  goBack: () => void;
  /** Full restart from card 1 (used by the "Fim do Baralho" screen). */
  reshuffle: () => void;
  /** True while a card is on the table and at least 2 cards were never shown (008, 009). */
  canReshuffleRemaining: boolean;
  /** Reorders only the never-shown cards; keeps the current card, counter and history (008, 009). */
  reshuffleRemaining: () => void;
}

const EMPTY_DECK: DeckProgress = createDeck([]);

export const useDeck = (deckId: DeckId): UseDeckResult => {
  const deck = useProgressStore((state) => state.decks[deckId]);
  const ensureDeck = useProgressStore((state) => state.ensureDeck);
  const discardInStore = useProgressStore((state) => state.discard);
  const goBackInStore = useProgressStore((state) => state.goBack);
  const reshuffleInStore = useProgressStore((state) => state.reshuffle);
  const reshuffleRemainingInStore = useProgressStore((state) => state.reshuffleRemaining);
  const mixed = deckId === MIXED_DECK_ID;
  const mixFilter = useMixCategories();
  const mixCategories = mixed ? mixFilter : undefined;
  const missing = deck === undefined;

  // Create the shuffled deck on first entry (or after the mix filter reset it); keep it (resume)
  // on later entries.
  useEffect(() => {
    if (missing) ensureDeck(deckId, mixCategories);
  }, [deckId, ensureDeck, missing, mixCategories]);

  const deckCategory = mixed ? undefined : getCategory(deckId);
  if (!mixed && !deckCategory) throw new Error(`Unknown category: ${deckId}`);

  const active = deck ?? EMPTY_DECK;
  const id = currentQuestionId(active);
  const current = id ? getQuestion(id) : undefined;
  const currentCategory = current ? getCategory(current.categoryId) : undefined;

  const discard = useCallback(() => discardInStore(deckId), [deckId, discardInStore]);
  const goBack = useCallback(() => goBackInStore(deckId), [deckId, goBackInStore]);
  const reshuffle = useCallback(() => reshuffleInStore(deckId, mixCategories), [deckId, mixCategories, reshuffleInStore]);
  const reshuffleRemaining = useCallback(() => reshuffleRemainingInStore(deckId), [deckId, reshuffleRemainingInStore]);

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
    canGoBack: current !== undefined && canGoBack(active),
    goBack,
    reshuffle,
    canReshuffleRemaining: current !== undefined && canReshuffleRemaining(active),
    reshuffleRemaining,
  };
};
