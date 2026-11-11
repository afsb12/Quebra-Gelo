import rawData from './data.json';
import type { Category, CategoryId, Content, DeckId, Question } from './types';
import { CATEGORY_IDS, FAVORITES_DECK_ID, MIXED_DECK_ID } from './types';

const CATEGORY_ID_SET: ReadonlySet<string> = new Set(CATEGORY_IDS);

export const isCategoryId = (value: string): value is CategoryId => CATEGORY_ID_SET.has(value);

export const isDeckId = (value: string): value is DeckId =>
  value === MIXED_DECK_ID || value === FAVORITES_DECK_ID || isCategoryId(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isCategory = (value: unknown): value is Category =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  isCategoryId(value.id) &&
  typeof value.title === 'string' &&
  typeof value.icon === 'string' &&
  typeof value.color === 'string' &&
  typeof value.description === 'string';

const isQuestion = (value: unknown): value is Question =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.categoryId === 'string' &&
  isCategoryId(value.categoryId) &&
  typeof value.text === 'string';

/** Narrows the bundled JSON from `unknown` to typed content, dropping malformed entries. */
export const parseContent = (data: unknown): Content => {
  if (!isRecord(data)) return { categories: [], questions: [] };
  const categories = Array.isArray(data.categories) ? data.categories.filter(isCategory) : [];
  const known = new Set(categories.map((c) => c.id));
  const questions = Array.isArray(data.questions)
    ? data.questions.filter(isQuestion).filter((q) => known.has(q.categoryId))
    : [];
  return { categories, questions };
};

const content = parseContent(rawData as unknown);

const questionsById = new Map(content.questions.map((q) => [q.id, q]));
const questionsByCategory = new Map<CategoryId, readonly Question[]>(
  CATEGORY_IDS.map((id) => [id, content.questions.filter((q) => q.categoryId === id)]),
);

export const getCategories = (): readonly Category[] => content.categories;

export const getCategory = (id: string): Category | undefined => content.categories.find((c) => c.id === id);

/**
 * Next-deck suggestions for the end screen (018): the `count` categories after `id` in content
 * order, wrapping around, never `id` itself.
 */
export const getNextCategories = (id: CategoryId, count = 2): Category[] => {
  const all = content.categories;
  const start = all.findIndex((c) => c.id === id);
  if (start < 0) return [];
  const picks: Category[] = [];
  for (let step = 1; step < all.length && picks.length < count; step += 1) {
    picks.push(all[(start + step) % all.length]);
  }
  return picks;
};

export const getQuestionsByCategory = (id: CategoryId): readonly Question[] => questionsByCategory.get(id) ?? [];

export const getQuestion = (id: string): Question | undefined => questionsById.get(id);

export const getAllQuestions = (): readonly Question[] => content.questions;

/**
 * Question IDs that make up a deck: one category's; for the mixed deck those of `mixCategories`
 * (every category when omitted, 006); for the favorites deck the `favoriteIds` whose question still
 * exists, once each (017). Category decks ignore both lists.
 */
export const getDeckQuestionIds = (
  deckId: DeckId,
  mixCategories?: readonly CategoryId[],
  favoriteIds: readonly string[] = [],
): string[] => {
  if (deckId === FAVORITES_DECK_ID) return [...new Set(favoriteIds)].filter((id) => questionsById.has(id));
  if (deckId !== MIXED_DECK_ID) return getQuestionsByCategory(deckId).map((q) => q.id);
  const allowed = mixCategories ? new Set(mixCategories) : undefined;
  return getAllQuestions()
    .filter((q) => !allowed || allowed.has(q.categoryId))
    .map((q) => q.id);
};
