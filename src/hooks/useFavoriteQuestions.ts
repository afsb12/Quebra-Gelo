import { useMemo } from 'react';

import { getCategory, getQuestion } from '../data/content';
import type { Category, Favorite, Question } from '../data/types';
import { useFavoritesStore } from '../store/favorites';

export interface FavoriteEntry {
  favorite: Favorite;
  question: Question;
  category: Category;
}

/** Favorites joined with their question and category, newest first; unknown ids are skipped. */
export const useFavoriteQuestions = (): FavoriteEntry[] => {
  const favorites = useFavoritesStore((state) => state.favorites);
  return useMemo(
    () =>
      [...favorites]
        .sort((a, b) => b.savedAt - a.savedAt)
        .flatMap((favorite) => {
          const question = getQuestion(favorite.questionId);
          const category = question ? getCategory(question.categoryId) : undefined;
          return question && category ? [{ favorite, question, category }] : [];
        }),
    [favorites],
  );
};
