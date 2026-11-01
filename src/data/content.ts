import rawData from './data.json';
import type { Category, CategoryId, Content, Question } from './types';
import { CATEGORY_IDS } from './types';

const CATEGORY_ID_SET: ReadonlySet<string> = new Set(CATEGORY_IDS);

export const isCategoryId = (value: string): value is CategoryId => CATEGORY_ID_SET.has(value);

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

export const getQuestionsByCategory = (id: CategoryId): readonly Question[] => questionsByCategory.get(id) ?? [];

export const getQuestion = (id: string): Question | undefined => questionsById.get(id);
