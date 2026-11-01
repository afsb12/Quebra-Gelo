import { create } from 'zustand';

import { getQuestionsByCategory } from '../data/content';
import { advance, createDeck } from '../data/deck';
import type { CategoryId, DeckProgress } from '../data/types';

/**
 * Per-category deck progress. In memory only (no persist): survives leaving the deck screen and
 * backgrounding, resets when the app process is closed (spec 001 FR-016, constitution v2.1.0).
 */
interface ProgressState {
  decks: Partial<Record<CategoryId, DeckProgress>>;
  ensureDeck: (categoryId: CategoryId) => void;
  discard: (categoryId: CategoryId) => void;
  reshuffle: (categoryId: CategoryId) => void;
}

const newDeck = (categoryId: CategoryId): DeckProgress =>
  createDeck(getQuestionsByCategory(categoryId).map((q) => q.id));

export const useProgressStore = create<ProgressState>()((set, get) => ({
  decks: {},
  ensureDeck: (categoryId) => {
    if (get().decks[categoryId]) return;
    set((state) => ({ decks: { ...state.decks, [categoryId]: newDeck(categoryId) } }));
  },
  discard: (categoryId) =>
    set((state) => {
      const deck = state.decks[categoryId];
      return deck ? { decks: { ...state.decks, [categoryId]: advance(deck) } } : state;
    }),
  reshuffle: (categoryId) => set((state) => ({ decks: { ...state.decks, [categoryId]: newDeck(categoryId) } })),
}));
