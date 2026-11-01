import { renderHook } from '@testing-library/react-native';

import { getQuestionsByCategory } from '../../data/content';
import { useFavoritesStore } from '../../store/favorites';
import { useFavoriteQuestions } from '../useFavoriteQuestions';

const [casual] = getQuestionsByCategory('casual');
const [futuro] = getQuestionsByCategory('futuro');

describe('useFavoriteQuestions', () => {
  it('joins favorites with question and category, newest first, skipping unknown ids', async () => {
    useFavoritesStore.setState({
      favorites: [
        { questionId: casual.id, savedAt: 100 },
        { questionId: 'casual-999', savedAt: 300 },
        { questionId: futuro.id, savedAt: 200 },
      ],
    });
    const { result } = await renderHook(() => useFavoriteQuestions());
    expect(result.current.map((e) => e.question.id)).toEqual([futuro.id, casual.id]);
    expect(result.current[0].category.id).toBe('futuro');
    expect(result.current[1].category.title).toBe('Descontraído');
  });
});
