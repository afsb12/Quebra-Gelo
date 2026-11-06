import type { CategoryId } from './types';

/** A "mixed" deck needs at least two categories to be a mix (006 FR-007, FR-009). */
export const MIN_MIX_CATEGORIES = 2;

/** Categories in the mix: `all` minus `excluded`, keeping the order of `all`. */
export const activeMixCategories = (excluded: readonly CategoryId[], all: readonly CategoryId[]): CategoryId[] => {
  const out = new Set(excluded);
  return all.filter((id) => !out.has(id));
};

export const isValidMixSelection = (active: readonly CategoryId[]): boolean => active.length >= MIN_MIX_CATEGORIES;

/**
 * Narrows persisted data to known, unique excluded IDs. Anything that would leave fewer than
 * `MIN_MIX_CATEGORIES` active falls back to "all on" (`[]`, FR-013). Unknown IDs (removed
 * categories) are dropped; categories that didn't exist when saving stay on (FR-014).
 */
export const sanitizeExcluded = (value: unknown, all: readonly CategoryId[]): CategoryId[] => {
  if (!Array.isArray(value)) return [];
  const known = new Set<string>(all);
  const excluded = [...new Set(value.filter((v): v is CategoryId => typeof v === 'string' && known.has(v)))];
  return isValidMixSelection(activeMixCategories(excluded, all)) ? excluded : [];
};

export const sameSelection = (a: readonly CategoryId[], b: readonly CategoryId[]): boolean => {
  const set = new Set(a);
  return set.size === new Set(b).size && b.every((id) => set.has(id));
};
