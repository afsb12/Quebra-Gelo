# Implementation Plan: Mini-Tutorial de Primeira Viagem (Onboarding)

**Branch**: `005-onboarding-tutorial` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-onboarding-tutorial/spec.md`

## Summary

A one-screen, first-launch tutorial over Home:

1. **Data**: `useOnboardingStore` (Zustand + `persist` over AsyncStorage, key
   `quebra-gelo/onboarding`) holds `hasSeenTutorial` (persisted) and `markSeen()`. A non-persisted
   `readFailed` flag set by `onRehydrateStorage` suppresses the tutorial when storage can't be
   read. `useShowTutorial()` = hydrated && !hasSeenTutorial && !readFailed.
2. **No flash**: the root layout already holds the splash until favorites hydrate; it now also
   waits for the onboarding store, so the tutorial is either there from the first frame or never.
3. **UI**: `TutorialOverlay` (dumb, props `visible`, `onClose`) is a transparent RN `Modal`
   (own window for screen readers, Android back → `onRequestClose`) with an 80 % black backdrop
   that closes on press, a "Pular" button top-right, the 004 `BrandCardBack` in the center (a
   press-absorbing area that doesn't close) and three hints: swipe (arrows left/right of the card,
   oscillating), flip (tap icon pulsing over the card) and deck (arrow down, below the card).
   `TutorialHintIcon` runs the loops on the UI thread and is static under reduced motion.
4. **Wiring**: `HomeScreen` renders the overlay with `useShowTutorial()` and `markSeen`.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: no new ones. Zustand 5 `persist`, `@react-native-async-storage/async-storage`
2.2, Reanimated 4 (`withRepeat`/`withSequence`, `useReducedMotion`), RN `Modal`, `@expo/vector-icons`

**Storage**: AsyncStorage key `quebra-gelo/onboarding` → `{ state: { hasSeenTutorial: boolean }, version: 1 }`

**Testing**: Jest + RNTL 14 (AsyncStorage mock): store tests (default, persist, rehydrate, read
failure), `TutorialOverlay` component tests, `HomeScreen` integration

**Target Platform**: Android and iOS phones (≥ 320 pt), portrait

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: hint loops on the UI thread (shared values), no per-frame `setState`;
splash wait adds one small AsyncStorage read, done in parallel with fonts/favorites

**Constraints**: one onboarding screen, ≤ 2 taps to the first card (constitution I); offline; only
the boolean is stored; tutorial never blocks the app on storage errors

**Scale/Scope**: 1 store, 2 components, 3 files touched; ~4 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção: onboarding ≤ 1 screen; ≤ 2 taps to the first card | ✅ | Single overlay; close (1) + deck (1) = 2 |
| I. No personal data / tracking; offline | ✅ | One local boolean |
| II. Animations on UI thread, simplified under reduced motion | ✅ | `TutorialHintIcon` uses shared values; static when `useReducedMotion()` |
| II. Haptics on flip/discard | ✅ | N/A (no card is flipped or discarded in the tutorial) |
| III. Tipagem Estrita | ✅ | Typed store state, props; persisted data narrowed from `unknown` in `merge` |
| IV. Arquitetura Limpa | ✅ | AsyncStorage only in `src/store/onboarding.ts`; overlay is prop-driven; Home wires it |
| Stack: Zustand `persist` for data that survives restarts | ✅ | Same pattern as favorites |
| Stack: NativeWind default; StyleSheet in animated components, never mixed | ✅ | `TutorialOverlay` NativeWind; `TutorialHintIcon` StyleSheet + animated style |
| Conteúdo: centralized pt-BR strings, a11y labels, AA contrast | ✅ | `strings.tutorial`; cream text on ≥ 80 % black |
| Qualidade gates | ✅ | quickstart |

**Post-design re-check**: all ✅, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/005-onboarding-tutorial/
├── plan.md
├── research.md          # R1–R5
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-components.md
└── tasks.md
```

### Source Code

```text
src/
├── store/onboarding.ts            # NEW: persisted hasSeenTutorial, markSeen, readFailed, useShowTutorial
├── components/
│   ├── TutorialOverlay.tsx        # NEW: modal, backdrop, Pular, example card, 3 hints
│   └── TutorialHintIcon.tsx       # NEW: icon with pulse | nudge | none loop
├── screens/HomeScreen.tsx         # renders the overlay
├── app/_layout.tsx                # splash waits for onboarding hydration
└── i18n/strings.ts                # + tutorial strings
```

**Structure Decision**: existing three-layer layout; no new folders.

## Complexity Tracking

No constitution violations to justify.
