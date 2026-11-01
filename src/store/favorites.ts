import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getQuestion } from '../data/content';
import type { Favorite } from '../data/types';

export const FAVORITES_STORAGE_KEY = 'quebra-gelo/favorites';

interface FavoritesState {
  favorites: Favorite[];
  toggle: (questionId: string) => void;
  remove: (questionId: string) => void;
  isFavorite: (questionId: string) => boolean;
}

interface PersistedFavorites {
  favorites: Favorite[];
}

const isFavoriteRecord = (value: unknown): value is Favorite =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Record<string, unknown>).questionId === 'string' &&
  typeof (value as Record<string, unknown>).savedAt === 'number';

/** Keeps only well-formed favorites whose question still exists in the bundled content. */
const sanitize = (value: unknown): Favorite[] => {
  if (typeof value !== 'object' || value === null) return [];
  const list = (value as Record<string, unknown>).favorites;
  if (!Array.isArray(list)) return [];
  return list.filter(isFavoriteRecord).filter((f) => getQuestion(f.questionId) !== undefined);
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (questionId) =>
        set((state) =>
          state.favorites.some((f) => f.questionId === questionId)
            ? { favorites: state.favorites.filter((f) => f.questionId !== questionId) }
            : { favorites: [...state.favorites, { questionId, savedAt: Date.now() }] },
        ),
      remove: (questionId) => set((state) => ({ favorites: state.favorites.filter((f) => f.questionId !== questionId) })),
      isFavorite: (questionId) => get().favorites.some((f) => f.questionId === questionId),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): PersistedFavorites => ({ favorites: state.favorites }),
      merge: (persisted, current) => ({ ...current, favorites: sanitize(persisted) }),
    },
  ),
);

/** True once favorites have been read from storage (used to hold the splash screen). */
export const useFavoritesHydrated = (): boolean =>
  useSyncExternalStore(
    (onChange) => useFavoritesStore.persist.onFinishHydration(onChange),
    () => useFavoritesStore.persist.hasHydrated(),
  );
