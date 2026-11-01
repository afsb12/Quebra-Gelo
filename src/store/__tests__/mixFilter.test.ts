import AsyncStorage from '@react-native-async-storage/async-storage';

import { CATEGORY_IDS } from '../../data/types';
import { MIX_FILTER_STORAGE_KEY, useMixFilterStore } from '../mixFilter';
import { useProgressStore } from '../progress';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const six = CATEGORY_IDS.filter((id) => id !== 'happy-hour' && id !== 'dilemas');

describe('useMixFilterStore (006)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useMixFilterStore.setState({ excluded: [] });
    useProgressStore.setState({ decks: {} });
  });

  it('starts with every category on', () => {
    expect(useMixFilterStore.getState().excluded).toEqual([]);
  });

  it('rejects fewer than 2 categories and changes nothing', () => {
    expect(useMixFilterStore.getState().save(['casais'])).toBe(false);
    expect(useMixFilterStore.getState().save([])).toBe(false);
    expect(useMixFilterStore.getState().excluded).toEqual([]);
  });

  it('a valid save persists the excluded IDs under quebra-gelo/mix-filter (version 1)', async () => {
    expect(useMixFilterStore.getState().save(six)).toBe(true);
    expect(useMixFilterStore.getState().excluded).toEqual(['happy-hour', 'dilemas']);
    await flush();
    expect(MIX_FILTER_STORAGE_KEY).toBe('quebra-gelo/mix-filter');
    expect(JSON.parse((await AsyncStorage.getItem(MIX_FILTER_STORAGE_KEY)) ?? 'null')).toEqual({
      version: 1,
      state: { excluded: ['happy-hour', 'dilemas'] },
    });
  });

  it('a different set resets the mixed deck; the same set keeps its progress', () => {
    useProgressStore.getState().ensureDeck('mixed');
    useProgressStore.getState().discard('mixed');
    useMixFilterStore.getState().save([...CATEGORY_IDS].reverse());
    expect(useProgressStore.getState().decks.mixed?.cursor).toBe(1);

    useMixFilterStore.getState().save(six);
    expect(useProgressStore.getState().decks.mixed).toBeUndefined();
  });

  it('rehydrates the saved filter on the next launch', async () => {
    await AsyncStorage.setItem(MIX_FILTER_STORAGE_KEY, JSON.stringify({ version: 1, state: { excluded: ['casais'] } }));
    await useMixFilterStore.persist.rehydrate();
    expect(useMixFilterStore.getState().excluded).toEqual(['casais']);
  });

  it('drops unknown IDs and falls back to all on when stored data leaves fewer than 2', async () => {
    await AsyncStorage.setItem(MIX_FILTER_STORAGE_KEY, JSON.stringify({ version: 1, state: { excluded: ['casais', 'trabalho'] } }));
    await useMixFilterStore.persist.rehydrate();
    expect(useMixFilterStore.getState().excluded).toEqual(['casais']);

    await AsyncStorage.setItem(MIX_FILTER_STORAGE_KEY, JSON.stringify({ version: 1, state: { excluded: CATEGORY_IDS.slice(1) } }));
    await useMixFilterStore.persist.rehydrate();
    expect(useMixFilterStore.getState().excluded).toEqual([]);
  });
});
