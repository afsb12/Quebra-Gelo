# Research: Onboarding tutorial (005)

## R1 — Where the "seen" flag lives

- **Decision**: a dedicated Zustand store with `persist` + `createJSONStorage(() => AsyncStorage)`,
  key `quebra-gelo/onboarding`, `partialize` → `{ hasSeenTutorial }`, `merge` narrowing the
  persisted `unknown` to a boolean (anything else → `false`).
- **Rationale**: same pattern as favorites (constitution: Zustand + `persist` for data that
  survives restarts); keeps AsyncStorage inside `src/store`.
- **Alternatives**: raw `AsyncStorage.getItem` in a hook (duplicates hydration logic); adding the
  flag to the favorites store (mixes unrelated data and versions).

## R2 — Never flash, never block

- **Decision**: the root layout keeps the splash until fonts, favorites **and** onboarding are
  hydrated. If the read fails (`onRehydrateStorage` callback receives an error), a non-persisted
  `readFailed: true` hides the tutorial for this run. A failed write is ignored: the overlay
  closes from in-memory state.
- **Rationale**: spec edge cases "falha ao ler" (prefer not showing) and "não piscar"; the extra
  read runs in parallel with the font load, so SC-005 holds.

## R3 — Overlay container

- **Decision**: React Native `Modal` (`transparent`, `animationType` `fade` or `none` under
  reduced motion, `statusBarTranslucent`, `onRequestClose` → close). Full-screen `Pressable`
  backdrop `rgba(0,0,0,0.8)` closes; the example card sits in a `Pressable` with an empty handler
  so its touches don't reach the backdrop; "Pular" at the top right (safe-area inset).
- **Rationale**: a modal is its own window: Home can't receive touches (FR-005), screen readers
  stay inside (FR-016) and Android back closes it (FR-009) without touching navigation.
- **Alternatives**: an absolutely positioned `View` over Home (needs manual a11y focus trapping and
  a `BackHandler`).

## R4 — Hint animation

- **Decision**: `TutorialHintIcon` with `motion: 'pulse' | 'nudge-x' | 'nudge-y' | 'none'`; `pulse` = scale 1 →
  1.15 → 1 (`withRepeat(withSequence(withTiming…))`, 900 ms), `nudge-x`/`nudge-y` = translate 0 → 8 → 0 on that axis.
  `useReducedMotion()` → no animation. Icons: `gesture-tap` (flip), `chevron-left`/`chevron-right`
  (swipe), `chevron-double-down` (deck).
- **Rationale**: FR-017; UI-thread loop, cancelled on unmount (`cancelAnimation`).

## R5 — Example card

- **Decision**: `BrandCardBack variant="full"` at `min(screenWidth × 0.5, 220)` pt wide (clarification Q2).
- **Rationale**: neutral, already built in 004, never suggests a category.
