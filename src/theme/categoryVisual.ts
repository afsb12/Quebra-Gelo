import type { Category, CategoryId } from '../data/types';
import { inkOnCream, pickOnColor } from './color';

export type PatternKind = 'dots' | 'concentric' | 'diamonds' | 'bubbles' | 'checker' | 'waves' | 'stripes' | 'chevrons';

/** One distinct tone-on-tone geometric pattern per category (002 research R2). */
export const CATEGORY_PATTERNS: Record<CategoryId, PatternKind> = {
  casual: 'dots',
  profundo: 'concentric',
  casais: 'diamonds',
  'happy-hour': 'bubbles',
  dilemas: 'checker',
  viagens: 'waves',
  nostalgia: 'stripes',
  futuro: 'chevrons',
};

/**
 * Category color used on the cream front (frame, icon, footer), fixed by 002 research R1 and
 * validated (≥ 4.5:1 on cream) by tests. `inkOnCream` is the fallback for any other color.
 */
export const CATEGORY_INK: Record<CategoryId, string> = {
  casual: '#8A6100',
  profundo: '#3D3FA6',
  casais: '#B01A34',
  'happy-hour': '#A84F00',
  dilemas: '#6E35A3',
  viagens: '#0B6B67',
  nostalgia: '#A6316B',
  futuro: '#167A4C',
};

export interface CategoryVisual {
  categoryId: CategoryId;
  /** Card back background. */
  color: string;
  /** Text/icon color on the back. */
  onColor: string;
  /** Category color on the cream front. */
  ink: string;
  pattern: PatternKind;
  icon: string;
}

const cache = new Map<string, CategoryVisual>();

export const getCategoryVisual = (category: Category): CategoryVisual => {
  const key = `${category.id}|${category.color}|${category.icon}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const color = category.color.toUpperCase();
  const visual: CategoryVisual = {
    categoryId: category.id,
    color,
    onColor: pickOnColor(color),
    ink: CATEGORY_INK[category.id] ?? inkOnCream(color),
    pattern: CATEGORY_PATTERNS[category.id],
    icon: category.icon,
  };
  cache.set(key, visual);
  return visual;
};
