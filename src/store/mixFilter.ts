import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo, useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { activeMixCategories, isValidMixSelection, sameSelection, sanitizeExcluded } from '../data/mixFilter';
import { CATEGORY_IDS, MIXED_DECK_ID, type CategoryId } from '../data/types';
import { useProgressStore } from './progress';

export const MIX_FILTER_STORAGE_KEY = 'quebra-gelo/mix-filter';

interface MixFilterState {
  /** Categories left out of "Tudo Misturado"; `[]` = all on, so new categories start on (006 R1). */
  excluded: CategoryId[];
  /** Applies a selection; returns false (and changes nothing) with fewer than 2 categories. */
  save: (active: readonly CategoryId[]) => boolean;
}

interface PersistedMixFilter {
  excluded: CategoryId[];
}

const persistedExcluded = (value: unknown): unknown =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>).excluded : undefined;

export const useMixFilterStore = create<MixFilterState>()(
  persist(
    (set, get) => ({
      excluded: [],
      save: (active) => {
        if (!isValidMixSelection(active)) return false;
        const previous = activeMixCategories(get().excluded, CATEGORY_IDS);
        const keep = new Set(active);
        set({ excluded: CATEGORY_IDS.filter((id) => !keep.has(id)) });
        // A different set of categories gets a fresh shuffled deck (FR-010).
        if (!sameSelection(previous, active)) useProgressStore.getState().resetDeck(MIXED_DECK_ID);
        return true;
      },
    }),
    {
      name: MIX_FILTER_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): PersistedMixFilter => ({ excluded: state.excluded }),
      merge: (persisted, current) => ({ ...current, excluded: sanitizeExcluded(persistedExcluded(persisted), CATEGORY_IDS) }),
    },
  ),
);

/** True once the filter has been read from storage (used to hold the splash screen). */
export const useMixFilterHydrated = (): boolean =>
  useSyncExternalStore(
    (onChange) => useMixFilterStore.persist.onFinishHydration(onChange),
    () => useMixFilterStore.persist.hasHydrated(),
  );

/** Categories currently in the mix, in content order. */
export const useMixCategories = (): CategoryId[] => {
  const excluded = useMixFilterStore((state) => state.excluded);
  return useMemo(() => activeMixCategories(excluded, CATEGORY_IDS), [excluded]);
};
