# Implementation Plan: Navegação Direcional por Gestos e Tutorial Atualizado

**Branch**: `009-directional-swipe-navigation` | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-directional-swipe-navigation/spec.md`

## Summary

Swiping left advances and swiping right goes back to the previous card, which returns face up. On
card 1 a right drag resists (at most 40 pt) and springs back.

- **Data model:** `DeckProgress` gains `furthest`, the highest index ever shown. Going back only
  moves `cursor`, so advancing again replays the seen cards in order. The 008 reshuffle now
  reorders only `order[furthest + 1..]`.
- **SwipeCard:** gets `canGoBack` (mirrored to a shared value for the worklets), `initialFace` and
  a `previous` accessibility action.
- **Tutorial:** shows 4 hints, each text next to its arrow, with the tap icon in the center of
  the card. It shows once more to people who saw the old version (`tutorialVersion` 2 in the
  persisted flag).
- **Version:** 1.3.0 (versionCode 4).

## Technical Context

**Language/Version**: TypeScript 6 (`strict`), React 19 / React Native 0.88

**Primary Dependencies**: Expo SDK 58, Gesture Handler 3 (`usePanGesture`), Reanimated 4
(`useSharedValue`, `withSpring`, `withTiming`), react-native-worklets, Zustand (+ `persist` for
onboarding), NativeWind 4

**Storage**: deck progress in memory (adds `furthest`); onboarding flag in AsyncStorage (adds
`tutorialVersion`, same key, same persist version)

**Testing**: Jest + RNTL 14

**Target Platform**: Android and iOS, from 320 pt

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: gestures stay on the UI thread at 60 fps; no per-frame `setState`

**Constraints**: offline; no new dependencies; existing flip/discard physics unchanged

**Scale/Scope**: `types.ts`, `deck.ts`, `progress.ts`, `useDeck.ts`, `onboarding.ts`,
`SwipeCard.tsx`, `TutorialOverlay.tsx`, `DeckScreen.tsx`, `strings.ts`; ~8 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção | ✅ | Tutorial is still a single screen; first card still ≤ 2 taps; nothing collected |
| II. Imersão Tátil | ✅ | Pan/spring stay in worklets; `canGoBack` read from a shared value; discard haptic on both directions; reduced motion keeps the fade path |
| III. Tipagem Estrita | ✅ | `DeckProgress.furthest`, new props and hook fields typed and exported |
| IV. Arquitetura Limpa | ✅ | Navigation rules are pure functions in `deck.ts`; `SwipeCard`/`TutorialOverlay` stay prop-driven; `DeckScreen` wires them |
| Stack: StyleSheet only in animated components | ✅ | `SwipeCard` stays StyleSheet; `TutorialOverlay` stays NativeWind |
| Stack: Zustand, persist only for what must survive restarts | ✅ | Deck history in memory; only the tutorial flag is persisted (already was) |
| Jogo: no repeat until all cards shown | ✅ (interpreted) | The deal order never repeats a card; seeing a card again only happens through an explicit "back" by the player (spec Assumptions). The never-shown cards are each dealt once (FR-005, unit-tested) |
| Jogo: every player can skip any card | ✅ | Left swipe / "próxima" action |
| Conteúdo: strings centralized, a11y labels | ✅ | New hint/action strings in `strings.ts`; `previous` action labelled |
| Onboarding ≤ 1 screen | ✅ | Still a single overlay |

**Post-design re-check**: all ✅; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/009-directional-swipe-navigation/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/navigation.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── data/types.ts, data/deck.ts (+ tests)          # furthest, canGoBack, goBack, narrowed reshuffle
├── store/progress.ts, store/onboarding.ts (+ tests) # goBack action; tutorialVersion
├── hooks/useDeck.ts (+ tests)                     # canGoBack, goBack
├── components/SwipeCard.tsx (+ new test)          # direction semantics, resistance, initialFace, a11y
├── components/TutorialOverlay.tsx (+ tests)       # 4 hints
├── screens/DeckScreen.tsx (+ tests)               # left/right wiring, face on return
└── i18n/strings.ts
```

**Structure Decision**: single Expo project, existing three layers, no new folders.
