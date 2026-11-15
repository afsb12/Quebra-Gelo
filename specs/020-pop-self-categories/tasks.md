# Tasks: 12 Categorias — Cultura Pop e Autoconhecimento

**Input**: `/specs/020-pop-self-categories/` · **Tests**: included.

## Phase 1: Setup

No setup needed.

## Phase 2: Foundational

- [ ] T001 `src/data/types.ts`: append `'cultura-pop'`, `'autoconhecimento'` to `CATEGORY_IDS`
- [ ] T002 `src/theme/categoryVisual.ts`: `CATEGORY_INK` `cultura-pop: '#CF1972'`, `autoconhecimento: '#0072AD'` (R2); `src/theme/__tests__/categoryVisual.test.ts`: TABLE rows (dark onColor) + new test "new categories are distinct from every other back (ΔE ≥ 25, 020)"

## Phase 3: User Story 1 - Dois baralhos novos na Home (P1) 🎯 MVP

- [ ] T003 [US1] `src/data/data.json`: the 2 categories after `futuro` (data-model table)
- [ ] T004 [US1] `src/data/__tests__/content.test.ts`: PALETTE + pinned icons (4c) for the new ones
- [ ] T005 [US1] `src/screens/__tests__/HomeScreen.test.tsx`: 12 mini cards, 4 full rows of 3 (12 % 3 === 0 and `homeColumns` 3), counts "12 categorias" / "10 de 12 categorias"; update other tests that assume 10 categories (`MixFilterSheet`, `mixFilter`, `DeckScreen`/`content` counts if any)

## Phase 4: User Story 2 - As novas entram na mistura (P1)

- [ ] T006 [US2] `src/store/__tests__/mixFilter.test.ts`: hydrating a filter saved with the old IDs (`{ excluded: ['dilemas'] }`) keeps Dilemas off and both new categories on (11 of 12)

## Phase 5: User Story 3 - Perguntas que valem a conversa (P1)

- [ ] T007 [US3] `src/data/data.json`: 30 Cultura Pop questions `cultura-pop-001…030` (R5)
- [ ] T008 [US3] `src/data/data.json`: 30 Autoconhecimento questions `autoconhecimento-001…030` (R5)
- [ ] T009 [US3] `src/data/__tests__/content.test.ts`: rule 16 — Autoconhecimento is self-safe (`SELF_UNSAFE`, R5)

## Phase 6: Polish

- [ ] T010 Run `npm run typecheck`, `npm run lint`, `npm test`; fix failures
- [ ] T011 Manual content review of the 60 questions (originality, inclusion, open, no sensitive topics)
- [ ] T012 Run `graphify update .`

## Dependencies

T001 → T002, T003 → T004, T005, T006; T007/T008 after T003 → T009 → T010 → T011.
