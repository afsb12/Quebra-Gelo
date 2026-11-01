---

description: "Task list for 006 — Seleção de categorias no modo Tudo Misturado"
---

# Tasks: Seleção de Categorias no Modo "Tudo Misturado"

**Input**: Design documents from `/specs/006-mixed-mode-category-filter/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-components.md, quickstart.md

**Tests**: included (constitution: filtering/progress logic MUST have tests).

**Organization**: US1 = choose categories for the mix, US2 = minimum of 2, US3 = remember the filter.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [ ] T001 [P] Add `iceBlue: "#9ED8F0"` to `src/theme/tokens.json` and the `ice` color to `tailwind.config.js`
- [ ] T002 [P] Add `strings.mixFilter` to `src/i18n/strings.ts`: `title` "Categorias da mistura", `open` "Escolher categorias da mistura", `save` "Salvar", `minimum` "Escolha pelo menos 2 categorias", `summary(active, total)` → "{active} de {total} categorias"

---

## Phase 2: Foundational (pure rules, store, deck composition)

- [ ] T003 Create `src/data/mixFilter.ts`: `MIN_MIX_CATEGORIES = 2`, `activeMixCategories(excluded, all)`, `isValidMixSelection(active)` (`active.length >= 2`), `sanitizeExcluded(value: unknown, all)` (known unique IDs; if fewer than 2 would stay active → `[]`), `sameSelection(a, b)` (set equality)
- [ ] T004 [P] Add `src/data/__tests__/mixFilter.test.ts` covering each rule (order preserved, unknown/duplicate IDs dropped, < 2 active → `[]`, non-array → `[]`)
- [ ] T005 Extend `getDeckQuestionIds(deckId, mixCategories?)` in `src/data/content.ts` (mixed → only questions whose `categoryId` is in `mixCategories`, all when omitted) and add cases to `src/data/__tests__/deckIds.test.ts`
- [ ] T006 Change `src/store/progress.ts`: `ensureDeck(deckId, mixCategories?)`, `reshuffle(deckId, mixCategories?)`, new `resetDeck(deckId)`; update `src/store/__tests__/progress.test.ts` mock and add a `resetDeck` test
- [ ] T007 Create `src/store/mixFilter.ts`: `persist` over AsyncStorage, key `MIX_FILTER_STORAGE_KEY = 'quebra-gelo/mix-filter'`, `version: 1`, state `{ excluded: CategoryId[]; save(active): boolean }`, `partialize` → `{ excluded }`, `merge` → `sanitizeExcluded(persisted.excluded, CATEGORY_IDS)`; `save` rejects invalid selections, stores `all − active`, calls `useProgressStore.getState().resetDeck('mixed')` when the set changed; export `useMixFilterHydrated()` and `useMixCategories()`
- [ ] T008 [P] Add `src/store/__tests__/mixFilter.test.ts`: default all on; `save` < 2 returns false and changes nothing; valid save persists `{"state":{"excluded":[...]},"version":1}`; changed set resets the mixed deck, same set keeps it; rehydrate restores; unknown IDs dropped; stored data leaving < 2 active → all on
- [ ] T009 Pass `useMixCategories()` to `ensureDeck`/`reshuffle` for `'mixed'` in `src/hooks/useDeck.ts` (re-run `ensureDeck` when the filter changes) and add a filtered-deck test to `src/hooks/__tests__/useDeck.test.ts`
- [ ] T010 Hold the splash in `src/app/_layout.tsx` until `useMixFilterHydrated()` is also true

**Checkpoint**: a saved filter shapes the mixed deck; gates green.

---

## Phase 3: User Story 1 — Escolher quais categorias entram na mistura (P1) 🎯 MVP

- [ ] T011 [P] [US1] Create `src/components/MixFilterSheet.tsx` per contract (controlled; `Modal` slide / `none` on reduced motion; backdrop `onClose`; `onRequestClose` → `onClose`; rows with icon in `visual.color`, title, `Switch`; "Salvar" → `onSave`)
- [ ] T012 [P] [US1] Add `onOpenFilter` + optional `summary` to `src/components/MixedHeroCard.tsx`: 44 pt funnel button (`filter-variant`, `iceBlue`, `testID="mix-filter-button"`, label `strings.mixFilter.open`) top right inside the hero
- [ ] T013 [P] [US1] Add `src/components/__tests__/MixFilterSheet.test.tsx` (8 rows/switches reflect `selected` and are labeled with the category title; toggling calls `onToggle(id)`; Salvar calls `onSave`; backdrop and `requestClose` call `onClose`) and extend `src/components/__tests__/MixedHeroCard.test.tsx` (button calls `onOpenFilter` and not `onPress`)
- [ ] T014 [US1] Wire the sheet in `src/screens/HomeScreen.tsx`: `sheetOpen` + `draft` state, open copies `useMixCategories()`, toggle edits the draft, save calls `useMixFilterStore.getState().save(draft)` and closes, close discards
- [ ] T015 [US1] Add to `src/screens/__tests__/HomeScreen.test.tsx`: open → switch off 2 → Salvar → store active = 6; reopen → those 2 are off; change + backdrop → filter unchanged; button press never pushes a route
- [ ] T016 [US1] Add to `src/screens/__tests__/DeckScreen.test.tsx`: with a saved 2-category filter the mixed deck has exactly their questions and ends after them; a category deck excluded from the mix still has all its questions (FR-011)

---

## Phase 4: User Story 2 — Garantir que a mistura sempre faça sentido (P1)

- [ ] T017 [US2] Compute `canSave = isValidMixSelection(draft)` in `src/screens/HomeScreen.tsx`; the sheet shows `strings.mixFilter.minimum` and disables "Salvar" (`accessibilityState.disabled`) when false
- [ ] T018 [US2] Add tests: `MixFilterSheet` with `canSave={false}` shows the message and a disabled Salvar that doesn't call `onSave`; Home with 1 switch on can't save, turning another on re-enables it

---

## Phase 5: User Story 3 — Lembrar o filtro entre aberturas (P2)

- [ ] T019 [US3] Show `strings.mixFilter.summary(active, total)` on the hero from `src/screens/HomeScreen.tsx` only when fewer than all categories are active (`testID="mix-filter-summary"`)
- [ ] T020 [US3] Add tests: summary "6 de 8 categorias" after saving 6; no summary with all 8; rehydrated filter shows the same switches (store test T008 covers persistence)

---

## Phase 6: Polish

- [ ] T021 Run `npm run typecheck`, `npm run lint`, `npm test`; fix failures
- [ ] T022 Walk through `specs/006-mixed-mode-category-filter/quickstart.md` automated checks

## Dependencies & Execution Order

Setup → Foundational (T003 → T005 → T006 → T007 → T009 → T010; tests alongside) → US1 → US2 → US3 → Polish.
US2 and US3 only touch Home/sheet/hero props already introduced in US1.

## Parallel Examples

T001/T002; T004 with T005; T011/T012/T013.

## Implementation Strategy

MVP = Phases 1–4 (filter + minimum, both P1). US3 adds the summary. Commit when gates are green.
