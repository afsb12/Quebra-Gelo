# Tasks: Fim do Baralho com Sugestões

**Input**: `/specs/018-deck-complete-suggestions/` · **Tests**: included.

## Phase 1: Setup

No setup needed.

## Phase 2: Foundational

- [ ] T001 Strings in `src/i18n/strings.ts`: `deckComplete.suggestions` "Que tal continuar com", `deckComplete.chooseAnother` → "Ver todos os baralhos", `deckComplete.suggestionLabel(title)` "Jogar <title>"
- [ ] T002 `getNextCategories(id, count = 2)` in `src/data/content.ts` (next categories in content order, wrapping, never `id`) with tests in `src/data/__tests__/deckIds.test.ts` (middle, last wraps, never the same)

## Phase 3: User Story 1 - Continuar com outro baralho (P1) 🎯 MVP

- [ ] T003 [US1] `src/components/DeckComplete.tsx`: optional `suggestions` + `onSuggest`; "Que tal continuar com" caption and a 2-column grid of buttons (72 pt, surface bg, 36×50 mini back in the category color with its `CategoryIcon`, name), testID `deck-suggestion-<id>`, label `suggestionLabel`
- [ ] T004 [US1] `src/screens/DeckScreen.tsx`: category decks pass `getNextCategories(deckCategory.id)` mapped with `getCategoryVisual`; `onSuggest` → `router.replace({ pathname: '/deck/[deckId]', params: { deckId } })`; mixed/favorites pass none; tests in `src/screens/__tests__/DeckScreen.test.tsx`

## Phase 4: User Story 2 - Um fim que comemora (P2)

- [ ] T005 [US2] `src/components/DeckComplete.tsx`: full-width column (no colored box): decorative fan (3 cards 96×134, ±18°/±48 pt, front one `deck-complete-face` in `visual.color` with the icon in `visual.onColor`, hidden from accessibility), header title, message, cream "Embaralhar de novo" with shuffle icon, "Ver todos os baralhos" text button in ice blue; update `src/components/__tests__/Consistency.test.tsx` (face color) and the DeckScreen end-screen test (new link text)

## Phase 5: Polish

- [ ] T006 Run `npm run typecheck`, `npm run lint`, `npm test`; fix failures
- [ ] T007 Run `graphify update .`

## Dependencies

T001, T002 → T003 → T004; T005 shares `DeckComplete.tsx` with T003 (do together).
