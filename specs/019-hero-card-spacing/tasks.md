# Tasks: Respiro e Margens do Card "Tudo Misturado"

**Input**: `/specs/019-hero-card-spacing/` · **Tests**: included.

## Phase 1: Setup

No setup needed.

## Phase 2: Foundational

- [X] T001 `HERO_LAYOUT` (`as const`: marginTop 16, marginBottom 24, padding 20, gap 8, filterInset 14, filterHitSlop 10, filterSize 36, titleReserve 36) and `heroHeight(width, fontScale = 1)` (R2) exported from `src/components/MixedHeroCard.tsx`, with unit tests in `src/components/__tests__/MixedHeroCard.test.tsx` (floor on 272 pt, ratio on wide cards, grows with font scale, capped at 1.3)

## Phase 3: User Story 1 - Um card de destaque que respira (P1) 🎯 MVP

- [X] T002 [US1] `src/components/MixedHeroCard.tsx`: optional `fontScale` prop; height = `heroHeight`; content row `mixed-hero-content` with `padding: 20`, `gap: 8` (symbol · text column), text column `gap: 8` (title · description · "Jogar" row)
- [X] T003 [US1] `src/screens/HomeScreen.tsx`: header question without bottom padding; card wrapper `marginTop: HERO_LAYOUT.marginTop`, `marginBottom: HERO_LAYOUT.marginBottom`; pass `window.fontScale`; test in `src/screens/__tests__/HomeScreen.test.tsx` (wrapper margins, card width = grid content width)

## Phase 4: User Story 2 - Filtro sem toque acidental (P1)

- [X] T004 [US2] `src/components/MixedHeroCard.tsx`: icon-only `mix-filter-button` (36 pt round, outlined, `cog-outline`) absolute at `top/right: HERO_LAYOUT.filterInset`, `hitSlop` 10 on each side, same accessibility label; title wrapper `mixed-hero-title` with `paddingRight: 36` and `adjustsFontSizeToFit`; summary `mix-filter-summary` as text beside "Jogar"
- [X] T005 [US2] Update `src/components/__tests__/MixedHeroCard.test.tsx`: corner position + hit slop, cog icon, title reserve, filter press never starts the game, summary visible (10 and 8 de 10)

## Phase 5: Polish

- [X] T006 Run `npm run typecheck`, `npm run lint`, `npm test`; fix failures
- [X] T007 Run `graphify update .`

## Dependencies

T001 → T002 → T003; T004 shares `MixedHeroCard.tsx` with T002 (do together) → T005.
