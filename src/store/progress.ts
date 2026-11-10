import { create } from 'zustand';

import { getDeckQuestionIds, getQuestion } from '../data/content';
import { advance, changeMood, createDeck, goBack } from '../data/deck';
import type { CategoryId, DeckId, DeckProgress } from '../data/types';

/**
 * Per-deck progress (each category and the mixed deck, 004). In memory only (no persist):
 * survives leaving the deck screen and backgrounding, resets when the app process is closed
 * (spec 001 FR-016, constitution v2.1.0). `mixCategories` restricts the mixed deck (006).
 */
interface ProgressState {
  decks: Partial<Record<DeckId, DeckProgress>>;
  ensureDeck: (deckId: DeckId, mixCategories?: readonly CategoryId[]) => void;
  discard: (deckId: DeckId) => void;
  /** Previous card (swipe right); no-op on the first card (009). */
  goBack: (deckId: DeckId) => void;
  /** Full restart: a new shuffled deck from card 1 ("Fim do Baralho" → "Embaralhar de novo"). */
  reshuffle: (deckId: DeckId, mixCategories?: readonly CategoryId[]) => void;
  /** "Mudar o clima": next card from another category, keeping history and no-repeat (011). */
  changeMood: (deckId: DeckId) => void;
  /** Drops a deck so the next `ensureDeck` builds a fresh one (mix filter changed, 006 FR-010). */
  resetDeck: (deckId: DeckId) => void;
}

const categoryOfQuestion = (id: string): string | undefined => getQuestion(id)?.categoryId;

const newDeck = (deckId: DeckId, mixCategories?: readonly CategoryId[]): DeckProgress =>
  createDeck(getDeckQuestionIds(deckId, mixCategories));

export const useProgressStore = create<ProgressState>()((set, get) => ({
  decks: {},
  ensureDeck: (deckId, mixCategories) => {
    if (get().decks[deckId]) return;
    set((state) => ({ decks: { ...state.decks, [deckId]: newDeck(deckId, mixCategories) } }));
  },
  discard: (deckId) =>
    set((state) => {
      const deck = state.decks[deckId];
      return deck ? { decks: { ...state.decks, [deckId]: advance(deck) } } : state;
    }),
  goBack: (deckId) =>
    set((state) => {
      const deck = state.decks[deckId];
      if (!deck) return state;
      const next = goBack(deck);
      return next === deck ? state : { decks: { ...state.decks, [deckId]: next } };
    }),
  reshuffle: (deckId, mixCategories) =>
    set((state) => ({ decks: { ...state.decks, [deckId]: newDeck(deckId, mixCategories) } })),
  changeMood: (deckId) =>
    set((state) => {
      const deck = state.decks[deckId];
      if (!deck) return state;
      const next = changeMood(deck, categoryOfQuestion);
      return next === deck ? state : { decks: { ...state.decks, [deckId]: next } };
    }),
  resetDeck: (deckId) =>
    set((state) => {
      if (!state.decks[deckId]) return state;
      const decks = { ...state.decks };
      delete decks[deckId];
      return { decks };
    }),
}));
