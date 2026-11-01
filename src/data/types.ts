export const CATEGORY_IDS = [
  'casual',
  'profundo',
  'casais',
  'happy-hour',
  'dilemas',
  'viagens',
  'nostalgia',
  'futuro',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

/** The "Tudo Misturado" deck: questions of every category shuffled together (004). */
export const MIXED_DECK_ID = 'mixed' as const;

/** Key of a playable deck: one category, or the mixed deck. */
export type DeckId = CategoryId | typeof MIXED_DECK_ID;

export interface Category {
  id: CategoryId;
  title: string;
  /** Icon name from the MaterialCommunityIcons set bundled with @expo/vector-icons. */
  icon: string;
  /** Hex `#RRGGBB`; background of the card back. */
  color: string;
  description: string;
}

export interface Question {
  id: string;
  categoryId: CategoryId;
  text: string;
}

export interface Favorite {
  questionId: string;
  /** Epoch ms when the question was favorited. */
  savedAt: number;
}

export interface DeckProgress {
  /** Permutation of all question IDs of the category. */
  order: string[];
  /** Index of the current card in `order`; `order.length` means completed. */
  cursor: number;
}

export interface Content {
  categories: Category[];
  questions: Question[];
}
