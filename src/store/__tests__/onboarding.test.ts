import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook } from '@testing-library/react-native';

import { ONBOARDING_STORAGE_KEY, TUTORIAL_VERSION, useOnboardingStore, useShowTutorial } from '../onboarding';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('useOnboardingStore (005)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
    useOnboardingStore.setState({ hasSeenTutorial: false, readFailed: false });
  });

  it('a fresh install has not seen the tutorial, so it is shown', async () => {
    await useOnboardingStore.persist.rehydrate();
    expect(useOnboardingStore.getState().hasSeenTutorial).toBe(false);
    const { result } = await renderHook(() => useShowTutorial());
    expect(result.current).toBe(true);
  });

  it('markSeen persists the flag and the tutorial version under quebra-gelo/onboarding (009)', async () => {
    useOnboardingStore.getState().markSeen();
    await flush();
    const raw = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    expect(ONBOARDING_STORAGE_KEY).toBe('quebra-gelo/onboarding');
    expect(JSON.parse(raw ?? 'null')).toEqual({ version: 1, state: { hasSeenTutorial: true, tutorialVersion: TUTORIAL_VERSION } });
    expect(TUTORIAL_VERSION).toBe(2);
  });

  it('a stored "seen" flag for the current tutorial hides it on the next launch', async () => {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ version: 1, state: { hasSeenTutorial: true, tutorialVersion: 2 } }));
    await useOnboardingStore.persist.rehydrate();
    const { result } = await renderHook(() => useShowTutorial());
    expect(result.current).toBe(false);
  });

  it('someone who closed the old tutorial (no tutorialVersion) sees the new one once (009)', async () => {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ version: 1, state: { hasSeenTutorial: true } }));
    await useOnboardingStore.persist.rehydrate();
    const { result } = await renderHook(() => useShowTutorial());
    expect(result.current).toBe(true);
  });

  it('malformed stored data counts as not seen', async () => {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ version: 1, state: { hasSeenTutorial: 'yes' } }));
    await useOnboardingStore.persist.rehydrate();
    expect(useOnboardingStore.getState().hasSeenTutorial).toBe(false);
  });

  it('when storage cannot be read, the tutorial stays hidden instead of blocking the app', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('disk'));
    await useOnboardingStore.persist.rehydrate();
    expect(useOnboardingStore.getState().readFailed).toBe(true);
    const { result } = await renderHook(() => useShowTutorial());
    expect(result.current).toBe(false);
  });

  it('when storage cannot be written, closing still hides the tutorial for this run', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValue(new Error('disk'));
    useOnboardingStore.getState().markSeen();
    await flush();
    expect(useOnboardingStore.getState().hasSeenTutorial).toBe(true);
  });
});
