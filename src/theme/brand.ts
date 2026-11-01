import { tokens } from './tokens';

/**
 * App symbol (two rounded squares overlapping on the diagonal, intersection in the accent) used on
 * the neutral "Tudo Misturado" card back. Mirrors `scripts/icon/symbol.ts` (`SYMBOL`), which the
 * app must not import; `brand.test.ts` keeps both in sync. Units: the square side is 1.
 */
export const BRAND_SYMBOL = {
  side: 1,
  offset: 0.42,
  radius: 0.24,
  stroke: 0.085,
  colors: { background: '#16131C', outline: '#F7F0E3', accent: '#FF6B4A' },
} as const;

/** Colors of the screens of the mixed deck that have no category (e.g. "Fim do Baralho"). */
export const MIXED_VISUAL = {
  color: tokens.colors.surface,
  onColor: tokens.colors.textPrimary,
  icon: 'shuffle-variant',
} as const;
