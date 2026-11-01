---

description: "Task list for 004 — Modo Tudo Misturado com verso oculto e etiqueta de categoria"
---

# Tasks: Modo "Tudo Misturado" com Verso Oculto e Etiqueta de Categoria

**Input**: Design documents from `/specs/004-mixed-mode-hidden-backs/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-components.md, quickstart.md

**Tests**: included. The constitution requires automated tests for data-layer logic (deck
composition, progress) and recommends RNTL tests for UI components.

**Organization**: tasks are grouped by user story (US1 = mixed mode with hidden back, US2 = origin
badge on the revealed front).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: user story the task belongs to

---

## Phase 1: Setup

**Purpose**: centralized strings and brand tokens used by every later task

- [ ] T001 [P] Add pt-BR strings to `src/i18n/strings.ts`: `mixed.title` "Tudo Misturado", `mixed.description` "Todas as categorias num só baralho.", `mixed.heroLabel` (title + description), `card.faceDownMixedLabel` "Carta do Quebra-Gelo, virada para baixo", `card.faceUpMixedLabel(category, question)` → "{category}: {question}"
- [ ] T002 [P] Create `src/theme/brand.ts` exporting `BRAND_SYMBOL` (`side: 1, offset: 0.42, radius: 0.24, stroke: 0.085`, colors `background '#16131C'`, `outline '#F7F0E3'`, `accent '#FF6B4A'`) and `MIXED_VISUAL` (`color: tokens.colors.surface`, `onColor: tokens.colors.textPrimary`, `icon: 'shuffle-variant'`); re-export from `src/theme/index.ts`
- [ ] T003 [P] Add `src/theme/__tests__/brand.test.ts` asserting `BRAND_SYMBOL` equals `SYMBOL` from `scripts/icon/symbol.ts` (same side, offset, radius, stroke and colors)

---

## Phase 2: Foundational (DeckId across data, store, hook and route)

**Purpose**: every deck (8 categories + mixed) shares one key type and code path. Blocks US1/US2.

- [ ] T004 Add `MIXED_DECK_ID = 'mixed' as const` and `export type DeckId = CategoryId | typeof MIXED_DECK_ID` to `src/data/types.ts`
- [ ] T005 Add `isDeckId(value: string): value is DeckId`, `getAllQuestions(): readonly Question[]` and `getDeckQuestionIds(deckId: DeckId): string[]` (category → its question IDs; `'mixed'` → all question IDs) to `src/data/content.ts`
- [ ] T006 [P] Extend `src/data/__tests__/content.test.ts`: `isDeckId` accepts the 8 categories and `'mixed'`, rejects others; `getDeckQuestionIds('mixed')` has every question ID exactly once; category lists unchanged
- [ ] T007 Key `src/store/progress.ts` by `DeckId` (`decks: Partial<Record<DeckId, DeckProgress>>`; `ensureDeck/discard/reshuffle(deckId)` build decks from `getDeckQuestionIds`)
- [ ] T008 [P] Update `src/store/__tests__/progress.test.ts` (mock `getDeckQuestionIds`): mixed deck has all questions; discarding in `'mixed'` does not move a category deck and vice versa; still no `persist`
- [ ] T009 Update `src/hooks/useDeck.ts` to take a `DeckId` and return `deckId`, `title` (category title or `strings.mixed.title`), `deckCategory` (`undefined` for mixed), `current`, `currentCategory` (category of `current`), `position`, `ready`, `discard`, `reshuffle`
- [ ] T010 [P] Update `src/hooks/__tests__/useDeck.test.ts`: category deck unchanged; mixed deck exposes `title` "Tudo Misturado", `deckCategory` undefined and `currentCategory.id === current.categoryId`
- [ ] T011 Rename `src/app/deck/[categoryId].tsx` to `src/app/deck/[deckId].tsx`, validate with `isDeckId` (redirect to `/` otherwise) and pass `deckId` to `DeckScreen`
- [ ] T012 Change `src/components/DeckComplete.tsx` props to `{ deckTitle: string; visual: DeckCompleteVisual; onReshuffle; onChooseAnother }` with exported `DeckCompleteVisual { color; onColor; icon }`; message uses `deckTitle`
- [ ] T013 Update `src/screens/DeckScreen.tsx` to take `deckId: DeckId`, use `useDeck(deckId)`, show `title` in the header, render the card with `currentCategory` and pass `DeckComplete` the category visual or `MIXED_VISUAL`; update `src/screens/HomeScreen.tsx` to push `{ pathname: '/deck/[deckId]', params: { deckId } }`
- [ ] T014 Update existing screen tests in `src/screens/__tests__/DeckScreen.test.tsx` and `src/screens/__tests__/HomeScreen.test.tsx` for the `deckId` prop/route param

**Checkpoint**: all category decks behave exactly as before; typecheck/lint/tests green.

---

## Phase 3: User Story 1 — Jogar misturado sem saber o tom antes de virar (P1) 🎯 MVP

**Goal**: "Tudo Misturado" on Home opens a deck of all questions whose cards all share the
neutral brand back; nothing reveals the category while face down.

**Independent test**: open the mode, skip/flip several cards: identical backs, no category text
or label face down, questions from several categories, end of deck after all questions.

- [ ] T015 [P] [US1] Create `src/components/BrandSymbol.tsx` (StyleSheet/SVG): `BrandSymbolProps { size: number }`, draws clip path + accent intersection + two cream outline rects from `BRAND_SYMBOL`, `testID="brand-symbol"`
- [ ] T016 [US1] Create `src/components/BrandCardBack.tsx` (StyleSheet): `BrandCardBackProps { width; height?; variant: 'full' | 'mini' | 'wide'; children? }`; cream frame, `appBackground` face, subtle `Vignette`, symbol centered at 46 % width for `full`/`mini`, `children` slot for `wide`; `testID="brand-card-back"`; no text
- [ ] T017 [P] [US1] Add `src/components/__tests__/BrandCardBack.test.tsx`: renders the symbol, no `Text` nodes in `full`/`mini`, frame/face colors
- [ ] T018 [US1] Add `mode?: 'category' | 'mixed'` to `src/components/SwipeCard.tsx`: mixed → `BrandCardBack variant="full"`, face-down label `strings.card.faceDownMixedLabel`, face-up label `strings.card.faceUpMixedLabel(category.title, question.text)`; category mode unchanged
- [ ] T019 [P] [US1] Create `src/components/MixedHeroCard.tsx`: `MixedHeroCardProps { width; onPress }`, full-width `Pressable` (`testID="mixed-hero-card"`, role button, label `strings.mixed.heroLabel`) with a `wide` `BrandCardBack` (height ≈ 0.42 × width) holding the symbol left and title + description right
- [ ] T020 [P] [US1] Add `src/components/__tests__/MixedHeroCard.test.tsx`: shows "Tudo Misturado" and the description, press calls `onPress`
- [ ] T021 [US1] Render `MixedHeroCard` above the grid in `src/screens/HomeScreen.tsx`, pressing it pushes `/deck/[deckId]` with `deckId: 'mixed'`
- [ ] T022 [US1] Pass `mode="mixed"` to `SwipeCard` in `src/screens/DeckScreen.tsx` when `deckId === MIXED_DECK_ID`
- [ ] T023 [US1] Add mixed tests to `src/screens/__tests__/DeckScreen.test.tsx`: header "Tudo Misturado"; brand back rendered; face-down label contains no category title; skipping through all questions shows no repeated question IDs and ends in "Fim do Baralho"; flipping triggers the flip haptic (`Haptics.impactAsync`) as in category decks
- [ ] T024 [US1] Add to `src/screens/__tests__/HomeScreen.test.tsx`: hero card rendered before the first mini card; press pushes `{ pathname: '/deck/[deckId]', params: { deckId: 'mixed' } }`

**Checkpoint**: US1 works on its own (badge not yet shown).

---

## Phase 4: User Story 2 — Saber de onde veio a pergunta (P2)

**Goal**: after the flip, a pill with the content `icon` + title in the content `color` shows the
question's origin, without changing the rest of the front.

**Independent test**: reveal questions of each category in mixed mode; the badge matches each
category's icon, title and color and never overlaps text.

- [ ] T025 [P] [US2] Create `src/components/CategoryBadge.tsx` (StyleSheet): `CategoryBadgeProps { category; visual }`, pill background `visual.color`, `visual.icon` (14 pt) + `category.title` (body font 12 pt, 1 line, `adjustsFontSizeToFit`, `maxFontSizeMultiplier` 1.3) in `visual.onColor`, `testID="category-badge"`, accessibility label = title
- [ ] T026 [US2] Add `showOriginBadge?: boolean` to `src/components/CardFront.tsx`: badge centered in the top row between the corner icon and the star slot (`flexShrink`, fixed-width slots so it never overlaps them); corner icon, footer and inner frame unchanged
- [ ] T027 [P] [US2] Add `src/components/__tests__/CategoryBadge.test.tsx` and extend `src/components/__tests__/CardFront.test.tsx`: for all 8 categories the badge shows `icon-{category.icon}`, the title and background = category color; no badge without `showOriginBadge`; corner icon and footer still present with it; badge text has `numberOfLines={1}` and `maxFontSizeMultiplier` 1.3
- [ ] T028 [US2] Pass `showOriginBadge` from `SwipeCard` to `CardFront` in mixed mode in `src/components/SwipeCard.tsx`
- [ ] T029 [US2] Add to `src/screens/__tests__/DeckScreen.test.tsx`: after flipping in mixed mode the badge shows the current question's category; favoriting stores the question ID (origin kept via the question)

**Checkpoint**: US1 + US2 complete.

---

## Phase 5: Polish & Cross-Cutting

- [ ] T030 [P] Update the doc comment of `src/screens/HomeScreen.tsx` and `CLAUDE.md` route/architecture notes if they mention `[categoryId]`
- [ ] T031 Run `npm run typecheck`, `npm run lint`, `npm test`; fix any failure
- [ ] T032 Walk through `specs/004-mixed-mode-hidden-backs/quickstart.md` automated checks and mark tasks done

---

## Dependencies & Execution Order

- Setup (T001–T003) → Foundational (T004–T014) → US1 (T015–T024) → US2 (T025–T029) → Polish.
- Inside Foundational: T004 → T005 → T007 → T009 → T011/T012 → T013 → T014; tests T006/T008/T010 right after their subject.
- US2 depends only on Foundational + T018 (SwipeCard `mode`).

## Parallel Examples

- Setup: T001, T002, T003 together.
- US1: T015 and T019 (different files) while T016 is reviewed; tests T017/T020 in parallel.
- US2: T025 and T027 in parallel.

## Implementation Strategy

MVP = Phases 1–3 (mixed mode with hidden back). Then US2 adds the badge. Commit after each phase.
