# Tasks: Início em Grade de 3 Colunas

**Input**: `/specs/015-home-grid-redesign/` (plan, spec, research, contracts, quickstart)

**Tests**: included (existing Home/MiniCard/MixedHeroCard/geometry tests are updated).

## Phase 1: Setup

No setup needed.

## Phase 2: Foundational

- [X] T001 Add `homeColumns: 3` and `homeGridGap: 12` to `tokens.layout` in `src/theme/tokens.ts`; compute `miniWidth = (screen.width − 2·screenPadding − (homeColumns − 1)·homeGridGap) / homeColumns` in `src/theme/geometry.ts` (update its doc comment) and the expectations in `src/theme/__tests__/geometry.test.ts`
- [X] T002 Add strings in `src/i18n/strings.ts`: `home.question` "Sobre o que vamos conversar?", `home.decksLabel` "Ou escolha um baralho", `mixed.play` "Jogar", `mixFilter.chip(active,total)` → "<total> categorias" | "<active> de <total> categorias"; remove the now-unused `home.subtitle`

## Phase 3: User Story 1 - Ver os baralhos de relance (P1) 🎯 MVP

- [X] T003 [US1] `src/components/MiniCard.tsx`: render only the mini `CardBack`; keep the `Pressable`, its `accessibilityLabel` "<title>. <description>" and `onPress(id)`; update `src/components/__tests__/MiniCard.test.tsx` (no visible name/description; label unchanged)
- [X] T004 [US1] `src/screens/HomeScreen.tsx`: grid with `gap: tokens.layout.homeGridGap`, tiles at `miniWidth`, preceded by the `home.decksLabel` caption (12 pt, uppercase, letter-spaced, secondary color); update `src/screens/__tests__/HomeScreen.test.tsx` (descriptions are no longer visible text; check each tile's label instead)

## Phase 4: User Story 2 - Tudo Misturado com Jogar e chip (P2)

- [X] T005 [US2] `src/components/MixedHeroCard.tsx`: replace `summary?` with required `filterLabel: string`; layout = symbol (≈ 0.55 × height) + column (title, description, row of a non-interactive "Jogar" pill in `BRAND_SYMBOL.colors.accent` with dark text and a play icon, and the nested filter `Pressable` chip: `filter-variant` icon + `filterLabel` text with testID `mix-filter-summary`, ice-blue, outlined, ≥ 44 pt hit area via `hitSlop`); remove the absolute corner button
- [X] T006 [US2] `src/screens/HomeScreen.tsx`: pass `filterLabel={strings.mixFilter.chip(mixCategories.length, categories.length)}`; update `src/components/__tests__/MixedHeroCard.test.tsx` and the 006 Home tests ("10 categorias" unfiltered, "8 de 10 categorias" filtered; chip never starts the game; "Jogar" text visible)

## Phase 5: User Story 3 - Convite no topo (P3)

- [X] T007 [US3] `src/screens/HomeScreen.tsx`: top row = `BrandSymbol` (28) + "Quebra-Gelo" (display, 20 pt, plain text) on the left and the Favoritos pill on the right; then `home.question` as the screen header (`accessibilityRole="header"`, display, 30 pt); add a Home test that the header is the question

## Phase 6: Polish

- [X] T008 Run `npm run typecheck`, `npm run lint`, `npm test`; fix failures
- [X] T009 Run `graphify update .`

## Dependencies

T001, T002 → all stories; T004 and T006 and T007 touch `HomeScreen.tsx` → run in order T004 → T006 → T007; T003 and T005 are [P] with each other.
