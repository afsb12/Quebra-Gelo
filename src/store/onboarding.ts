import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const ONBOARDING_STORAGE_KEY = 'quebra-gelo/onboarding';

interface OnboardingState {
  /** Persisted: the first-launch tutorial was closed at least once (005). */
  hasSeenTutorial: boolean;
  /** Not persisted: storage could not be read this run, so the tutorial stays hidden. */
  readFailed: boolean;
  markSeen: () => void;
}

interface PersistedOnboarding {
  hasSeenTutorial: boolean;
}

/** AsyncStorage whose write failures are ignored: the tutorial closes anyway and may show again next launch. */
const tolerantStorage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value).catch(() => undefined),
  removeItem: (key: string) => AsyncStorage.removeItem(key).catch(() => undefined),
};

const readSeen = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && (value as Record<string, unknown>).hasSeenTutorial === true;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      readFailed: false,
      markSeen: () => set({ hasSeenTutorial: true }),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => tolerantStorage),
      partialize: (state): PersistedOnboarding => ({ hasSeenTutorial: state.hasSeenTutorial }),
      merge: (persisted, current) => ({ ...current, hasSeenTutorial: readSeen(persisted) }),
      // Rather not show the tutorial than block or flash it when the flag can't be read.
      onRehydrateStorage: () => (_state, error) => {
        if (error) useOnboardingStore.setState({ readFailed: true });
      },
    },
  ),
);

/** True once the flag has been read from storage (used to hold the splash screen). */
export const useOnboardingHydrated = (): boolean =>
  useSyncExternalStore(
    (onChange) => useOnboardingStore.persist.onFinishHydration(onChange),
    () => useOnboardingStore.persist.hasHydrated(),
  );

/** Whether the first-launch tutorial should be on screen now. */
export const useShowTutorial = (): boolean => {
  const hydrated = useOnboardingHydrated();
  const seen = useOnboardingStore((state) => state.hasSeenTutorial);
  const readFailed = useOnboardingStore((state) => state.readFailed);
  return hydrated && !seen && !readFailed;
};
