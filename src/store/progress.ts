import { create } from 'zustand';

import { getDeckQuestionIds } from '../data/content';
import { advance, createDeck } from '../data/deck';
import type { DeckId, DeckProgress } from '../data/types';

/**
 * Per-deck progress (each category and the mixed deck, 004). In memory only (no persist):
 * survives leaving the deck screen and backgrounding, resets when the app process is closed
 * (spec 001 FR-016, constitution v2.1.0).
 */
interface ProgressState {
  decks: Partial<Record<DeckId, DeckProgress>>;
  ensureDeck: (deckId: DeckId) => void;
  discard: (deckId: DeckId) => void;
  reshuffle: (deckId: DeckId) => void;
}

const newDeck = (deckId: DeckId): DeckProgress => createDeck(getDeckQuestionIds(deckId));

export const useProgressStore = create<ProgressState>()((set, get) => ({
  decks: {},
  ensureDeck: (deckId) => {
    if (get().decks[deckId]) return;
    set((state) => ({ decks: { ...state.decks, [deckId]: newDeck(deckId) } }));
  },
  discard: (deckId) =>
    set((state) => {
      const deck = state.decks[deckId];
      return deck ? { decks: { ...state.decks, [deckId]: advance(deck) } } : state;
    }),
  reshuffle: (deckId) => set((state) => ({ decks: { ...state.decks, [deckId]: newDeck(deckId) } })),
}));
