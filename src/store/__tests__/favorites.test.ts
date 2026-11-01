import AsyncStorage from '@react-native-async-storage/async-storage';

import { getQuestionsByCategory } from '../../data/content';
import { FAVORITES_STORAGE_KEY, useFavoritesStore } from '../favorites';

jest.mock('../../data/content', () => {
  const ids = (cat: string, n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `${cat}-${String(i + 1).padStart(3, '0')}`, categoryId: cat, text: `Pergunta ${i + 1}` }));
  const questions = [...ids('casual', 3), ...ids('profundo', 5), ...ids('casais', 4), ...ids('futuro', 6)];
  return {
    getQuestionsByCategory: (cat: string) => questions.filter((q) => q.categoryId === cat),
    getQuestion: (id: string) => questions.find((q) => q.id === id),
  };
});

const [first, second] = getQuestionsByCategory('casual');

describe('useFavoritesStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useFavoritesStore.setState({ favorites: [] });
  });

  it('toggle adds then removes a favorite with savedAt', () => {
    useFavoritesStore.getState().toggle(first.id);
    const [fav] = useFavoritesStore.getState().favorites;
    expect(fav.questionId).toBe(first.id);
    expect(typeof fav.savedAt).toBe('number');
    expect(useFavoritesStore.getState().isFavorite(first.id)).toBe(true);

    useFavoritesStore.getState().toggle(first.id);
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    expect(useFavoritesStore.getState().isFavorite(first.id)).toBe(false);
  });

  it('remove deletes only the given favorite', () => {
    useFavoritesStore.getState().toggle(first.id);
    useFavoritesStore.getState().toggle(second.id);
    useFavoritesStore.getState().remove(first.id);
    expect(useFavoritesStore.getState().favorites.map((f) => f.questionId)).toEqual([second.id]);
  });

  it('persists under quebra-gelo/favorites with version 1', async () => {
    useFavoritesStore.getState().toggle(first.id);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    expect(FAVORITES_STORAGE_KEY).toBe('quebra-gelo/favorites');
    expect(raw).not.toBeNull();
    const parsed: unknown = JSON.parse(raw ?? 'null');
    expect(parsed).toMatchObject({ version: 1, state: { favorites: [{ questionId: first.id }] } });
  });

  it('drops favorites whose questionId no longer exists on rehydrate', async () => {
    await AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: {
          favorites: [
            { questionId: first.id, savedAt: 1 },
            { questionId: 'casual-999', savedAt: 2 },
          ],
        },
      }),
    );
    await useFavoritesStore.persist.rehydrate();
    expect(useFavoritesStore.getState().favorites.map((f) => f.questionId)).toEqual([first.id]);
  });
});
