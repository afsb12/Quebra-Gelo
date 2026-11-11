# Tasks: Favoritos com Filtro e Baralho de Favoritas

**Input**: `/specs/017-favorites-filter-play/` · **Tests**: included.

## Phase 1: Setup

No setup needed.

## Phase 2: Foundational

- [ ] T001 Strings in `src/i18n/strings.ts`: `favorites.count(n)` ("1 pergunta" / "<n> perguntas"), `favorites.all` "Todas", `favorites.play` "Jogar com as favoritas", `favorites.deckTitle` "Favoritas", `favorites.filterLabel` "Filtrar por categoria"

## Phase 3: User Story 1 - Jogar com as favoritas (P1) 🎯 MVP

- [ ] T002 [US1] `src/data/types.ts`: `FAVORITES_DECK_ID = 'favorites'`, `DeckId` includes it; `src/data/content.ts`: `isDeckId` accepts it, `getDeckQuestionIds(deckId, mixCategories, favoriteIds)` returns the existing favorite IDs for it; tests in `src/data/__tests__/` (unknown IDs dropped, category/mixed unchanged)
- [ ] T003 [US1] `src/store/progress.ts`: `newDeck` passes the favorites store's question IDs for the favorites deck; tests in `src/store/__tests__/progress.test.ts` (deck = favorites, reshuffle uses the current list, resetDeck + ensureDeck rebuilds)
- [ ] T004 [US1] `src/hooks/useDeck.ts`: favorites deck → `deckCategory` undefined, title `favorites.deckTitle`, `canChangeMood` false; `src/screens/DeckScreen.tsx`: card `mode` 'mixed' for it, no mood button, end-screen visual `MIXED_VISUAL` with icon `star`
- [ ] T005 [US1] `src/screens/FavoritesScreen.tsx`: footer button "Jogar com as favoritas" (coral `BRAND_SYMBOL.colors.accent`, dark text, play icon, 56 pt, testID `favorites-play`) shown only with ≥ 1 favorite; press → `resetDeck(FAVORITES_DECK_ID)` then `router.push({ pathname: '/deck/[deckId]', params: { deckId: 'favorites' } })`

## Phase 4: User Story 2 - Filtrar por categoria (P2)

- [ ] T006 [P] [US2] Create `src/components/FilterChips.tsx` per contracts (horizontal `ScrollView`, 36 pt chips with 8 pt dot, selected = cream bg + dark text, others outlined; `accessibilityRole="button"` + `accessibilityState.selected`; hitSlop to 44 pt) with test
- [ ] T007 [US2] `src/screens/FavoritesScreen.tsx`: chips = Todas + categories with favorites in content order (dot = `progressColor(category.color)`); single-select state; effective filter falls back to 'all' when the selected category has no entries; list filtered

## Phase 5: User Story 3 - Itens no estilo da carta (P3)

- [ ] T008 [US3] `src/components/FavoriteListItem.tsx`: cream card, header row (`CategoryIcon` 18 in `visual.ink` + uppercase category in `visual.ink` + remove star button 44×44 testID `favorite-remove`), question below; remove the side stripe; update `src/components/__tests__/Consistency.test.tsx`
- [ ] T009 [US3] `src/screens/FavoritesScreen.tsx`: header right `favorites.count(n)`; tests in new `src/screens/__tests__/FavoritesScreen.test.tsx` (count, chips, filter fallback, play button builds the deck, empty state)

## Phase 6: Polish

- [ ] T010 Run `npm run typecheck`, `npm run lint`, `npm test`; fix failures
- [ ] T011 Run `graphify update .`

## Dependencies

T001 → all; T002 → T003 → T004 → T005; T005/T007/T009 same file in order; T006, T008 parallel.
