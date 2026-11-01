---

description: "Task list for 005 — Mini-tutorial de primeira viagem"
---

# Tasks: Mini-Tutorial de Primeira Viagem (Onboarding)

**Input**: Design documents from `/specs/005-onboarding-tutorial/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-components.md, quickstart.md

**Tests**: included (constitution: data-layer logic MUST have tests; UI SHOULD).

**Organization**: US1 = understand the controls (overlay content), US2 = close it and never see it again (persistence + closing paths).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 [P] Add `strings.tutorial` to `src/i18n/strings.ts`: `skip` "Pular", `skipLabel` "Pular tutorial", `title` "Como jogar", `hintSwipe` "Deslize para os lados para a próxima carta", `hintFlip` "Toque na carta para revelar a pergunta", `hintDeck` "Toque em um baralho para começar" (each ≤ 50 chars)

---

## Phase 2: Foundational

- [X] T002 Create `src/store/onboarding.ts`: Zustand `persist` over AsyncStorage, key `ONBOARDING_STORAGE_KEY = 'quebra-gelo/onboarding'`, `version: 1`, state `{ hasSeenTutorial: boolean; readFailed: boolean; markSeen(): void }`, `partialize` → `{ hasSeenTutorial }`, `merge` → `hasSeenTutorial = persisted?.hasSeenTutorial === true` (narrowing `unknown`), `onRehydrateStorage` → on error set `readFailed: true`; export `useOnboardingHydrated()` and `useShowTutorial()` (= hydrated && !hasSeenTutorial && !readFailed)
- [X] T003 [P] Add `src/store/__tests__/onboarding.test.ts`: default not seen; `markSeen` writes `{"state":{"hasSeenTutorial":true},"version":1}` under the key; rehydrating a stored `true` → `useShowTutorial` false; malformed stored data → not seen; a failing `getItem` → `readFailed` true and tutorial hidden; a failing `setItem` still leaves `hasSeenTutorial` true in memory (overlay closes)
- [X] T004 Hold the splash in `src/app/_layout.tsx` until `useOnboardingHydrated()` is also true

---

## Phase 3: User Story 1 — Entender os controles na primeira abertura (P1) 🎯 MVP

**Goal**: first launch shows the overlay over Home with the example card and the 3 hints.

**Independent test**: render the overlay; the 3 hint texts, icons and the brand card are there; pressing the card changes nothing.

- [X] T005 [P] [US1] Create `src/components/TutorialHintIcon.tsx` (StyleSheet + Reanimated): props `{ name; size; color; motion: 'pulse' | 'nudge-x' | 'nudge-y' | 'none' }`; `pulse` scale 1→1.15→1, `nudge-x`/`nudge-y` translate 0→8→0, `withRepeat(withSequence(withTiming))` ~900 ms, `cancelAnimation` on unmount, static when `useReducedMotion()`; `testID="tutorial-icon-{name}"`
- [X] T006 [US1] Create `src/components/TutorialOverlay.tsx` (NativeWind): `TutorialOverlayProps { visible; onClose }`; transparent `Modal` (`statusBarTranslucent`, `onRequestClose={onClose}`, fade, `none` under reduced motion); full-screen backdrop `Pressable` `testID="tutorial-backdrop"` with `rgba(0,0,0,0.8)` → `onClose`; "Pular" top right (`testID="tutorial-skip"`, label `skipLabel`) → `onClose`; center `Pressable` `testID="tutorial-card"` with empty handler wrapping `BrandCardBack variant="full"` at `min(width × 0.5, 220)`; hints `tutorial-hint-swipe` (text above the card, chevron-left/right beside it, `nudge-x`), `tutorial-hint-flip` (`gesture-tap` over the card center, `pulse`, text below the card), `tutorial-hint-deck` (`chevron-double-down`, `nudge-y`, text at the bottom); `accessibilityViewIsModal`
- [X] T007 [P] [US1] Add `src/components/__tests__/TutorialOverlay.test.tsx`: nothing when `visible={false}`; the 3 hints with the exact texts (each ≤ 50 chars) and icons; brand card rendered; pressing the card does not call `onClose`; the content container has `accessibilityViewIsModal`
- [X] T008 [US1] Render `<TutorialOverlay visible={useShowTutorial()} onClose={markSeen} />` in `src/screens/HomeScreen.tsx`
- [X] T009 [US1] Add to `src/screens/__tests__/HomeScreen.test.tsx`: with a fresh onboarding store the overlay is visible; with `hasSeenTutorial: true` it isn't (reset the store in `beforeEach`; existing tests run with the tutorial already seen)

**Checkpoint**: the tutorial appears on first launch.

---

## Phase 4: User Story 2 — Fechar o tutorial e não vê-lo de novo (P1)

**Goal**: "Pular", tap outside and Android back close it and mark it seen; it never comes back.

**Independent test**: each closing path calls `onClose`; on Home, closing hides the overlay, stores the flag, and a deck is one tap away.

- [X] T010 [P] [US2] Extend `src/components/__tests__/TutorialOverlay.test.tsx`: "Pular" press, backdrop press and the Modal `onRequestClose` each call `onClose` once
- [X] T011 [US2] Add to `src/screens/__tests__/HomeScreen.test.tsx`: pressing "Pular" hides the overlay, sets `hasSeenTutorial` and persists it; afterwards pressing a mini card pushes the deck route (≤ 2 taps to the first card)

**Checkpoint**: US1 + US2 complete.

---

## Phase 5: Polish

- [X] T012 Run `npm run typecheck`, `npm run lint`, `npm test`; fix failures
- [X] T013 Walk through `specs/005-onboarding-tutorial/quickstart.md` automated checks

## Dependencies & Execution Order

Setup → Foundational (T002 → T003/T004) → US1 (T005 → T006 → T007; T008 → T009) → US2 (T010, T011) → Polish.

## Parallel Examples

T001 with T002; T003 with T004; T005 with T007 test scaffolding.

## Implementation Strategy

MVP = Phases 1–3; US2 closes the loop. Commit after the feature passes the gates.
