# Implementation Plan: Re-embaralhar as Cartas Restantes Durante o Jogo

**Branch**: `008-reshuffle-remaining-cards` | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-reshuffle-remaining-cards/spec.md`

## Summary

Add an ice-blue shuffle button to the bottom-right of the deck screen, on the same row as the
favorite button. Pressing it reorders only the cards not shown yet. The card on the table, the
counter and the seen cards are kept, so the no-repeat rule holds. When 2 or more cards remain, the
new order is always different from the old one. The press also gives a system "success" vibration,
a one-turn icon spin (skipped under reduced motion), a 2-second "Cartas embaralhadas" pill shown
in the gesture-hint line, and a screen-reader announcement.

The rule is a pure function, `reshuffleRemaining(deck, random)`, over the existing
`DeckProgress { order, cursor }`: it shuffles the tail after `cursor` with Fisher–Yates, rejects
a result equal to the old tail and falls back to a rotation. It is exposed through a new
`useProgressStore.reshuffleRemaining` action and `useDeck`. Two new dumb components carry the UI:
`ReshuffleButton` (animated, StyleSheet) and `HintLine` (hint/toast, fixed height). No new
dependencies, no persisted data, no change to the existing end-of-deck "Embaralhar de novo"
restart.

## Technical Context

**Language/Version**: TypeScript 6 (`strict`), React 19 / React Native 0.88

**Primary Dependencies**: Expo SDK 58 (Managed), `expo-haptics` (`notificationAsync`), Reanimated 4
(`useSharedValue`, `withTiming`, `useReducedMotion`), `@expo/vector-icons`
(MaterialCommunityIcons `shuffle-variant`), NativeWind 4, Zustand

**Storage**: none new; deck progress stays in memory (`useProgressStore`, no `persist`)

**Testing**: Jest + RNTL 14 (`npm test`); fake timers for the 2 s toast

**Target Platform**: Android and iOS (Expo Go / local builds), screens from 320 pt wide

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: reshuffle is O(n) on ≤ 180 IDs, well under 1 ms; feedback ≤ 100 ms
(SC-004); the spin runs on the UI thread at 60 fps

**Constraints**: offline; no new packages; must not change gestures, counter or restart behavior

**Scale/Scope**: ~4 source files changed (`deck.ts`, `progress.ts`, `useDeck.ts`,
`useHaptics.ts`), 2 new components, `DeckScreen.tsx`, `FavoriteButton.tsx` (shrink/truncate),
`strings.ts`, `jest.setup.ts`; ~6 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (offline, no account, no data collection) | ✅ | Local in-memory operation; nothing sent or stored |
| II. Imersão Tátil: UI-thread animation, haptics, reduced motion | ✅ | Spin is a Reanimated shared value + `withTiming`; `useReducedMotion` skips it; success haptic via `expo-haptics`; card gestures untouched (button is outside the gesture area) |
| III. Tipagem Estrita | ✅ | New props/hook/store fields explicitly typed and exported; no `any` |
| IV. Arquitetura Limpa | ✅ | Rule in `src/data/deck.ts` (pure, tested); store/hook in Data layer; `ReshuffleButton`/`HintLine` are prop-driven; `DeckScreen` wires them and owns toast timing and the accessibility announcement |
| Stack: NativeWind default, StyleSheet only in animated components, never mixed | ✅ | `ReshuffleButton` and `HintLine` (both animated) use StyleSheet only; `DeckScreen` keeps `className` |
| Stack: Zustand, deck progress in memory | ✅ | New action on the existing store; no persist |
| Stack: new dependencies justified | ✅ | None added |
| Jogo: one card at a time, no scoreboard/timer/ads/notifications | ✅ | The toast is a 2 s in-screen confirmation, not a notification; no timer imposed on players |
| Jogo: no repeat until all cards shown; skip any card | ✅ | Seen prefix untouched (data-model invariants, unit-tested); swipe/skip unchanged |
| Conteúdo: UI strings centralized, pt-BR | ✅ | `strings.deck.reshuffleLabel`, `strings.deck.reshuffled` |
| Conteúdo: a11y labels, AA contrast | ✅ | Label + disabled state + announcement; ice-blue on surface ≈ 11:1 (R6) |
| Qualidade: data-layer logic tested; gates | ✅ | R9 test plan; quickstart gates |

**Post-design re-check**: all ✅, no violations; Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/008-reshuffle-remaining-cards/
├── plan.md              # This file
├── research.md          # Phase 0 (R1–R9)
├── data-model.md        # Phase 1: DeckProgress invariants and transitions
├── quickstart.md        # Phase 1: gates + manual checks
├── contracts/
│   └── deck-reshuffle.md  # data/store/hook/haptics/component/string contracts
├── checklists/
│   └── requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── data/
│   ├── deck.ts                      # + remainingCount, canReshuffleRemaining, reshuffleRemaining
│   └── __tests__/deck.test.ts       # + invariants
├── store/
│   ├── progress.ts                  # + reshuffleRemaining(deckId)
│   └── __tests__/progress.test.ts
├── hooks/
│   ├── useDeck.ts                   # + canReshuffleRemaining, reshuffleRemaining
│   ├── useHaptics.ts                # + reshuffle (notification success)
│   └── __tests__/useDeck.test.ts
├── components/
│   ├── ReshuffleButton.tsx          # new (StyleSheet, Reanimated spin)
│   ├── HintLine.tsx                 # new (hint / toast pill, fixed height)
│   ├── FavoriteButton.tsx           # label numberOfLines=1, shrink
│   └── __tests__/{ReshuffleButton,HintLine}.test.tsx
├── screens/
│   ├── DeckScreen.tsx               # bottom row layout, toast timing, announcement
│   └── __tests__/DeckScreen.test.tsx
└── i18n/strings.ts                  # + deck.reshuffleLabel, deck.reshuffled
jest.setup.ts                        # expo-haptics mock: notificationAsync, NotificationFeedbackType
```

**Structure Decision**: single Expo project; the feature follows the existing three-layer layout
(Data → UI → Screens) with no new folders.
