# Implementation Plan: "Mudar o Clima" no Modo Misturado

**Branch**: `011-mixed-change-mood` | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-mixed-change-mood/spec.md`

## Summary

Replace the 008 "reshuffle the remaining cards" button with a "Mudar o clima" button that exists
only in the mixed deck. A new pure function `changeMood(deck, categoryOf, random)` in
`src/data/deck.ts` picks, with equal odds, one category (different from the current card's) that
still has never-shown cards, moves that category's first never-shown card to right after the most
recent card (`furthest + 1`) and advances to it; the rest of the shuffled tail keeps its order, so
history (009) and no-repeat stay intact. `canChangeMood` gates it (on the most recent card, a
different category left). The store swaps `reshuffleRemaining` for `changeMood`; `useDeck`
exposes `canChangeMood`/`changeMood` (mixed only); `DeckScreen` renders a new `ChangeMoodButton`
(icon `weather-partly-cloudy`, same translucent disc) only in the mixed deck, disabled while the
card is face down, and shows the "Clima trocado" toast. All 008 reshuffle code, strings and tests
are removed; "Embaralhar de novo" on "Fim do Baralho" is unchanged.

## Technical Context

**Language/Version**: TypeScript 6 (`strict`), React 19 / React Native 0.88

**Primary Dependencies**: Expo SDK 58 (Managed), Reanimated 4 (button icon animation),
`expo-haptics`, `@expo/vector-icons` (MaterialCommunityIcons), Zustand, NativeWind 4

**Storage**: none new; deck progress stays in memory (no persist)

**Testing**: Jest + RNTL 14 (`npm test`)

**Target Platform**: Android and iOS

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: `changeMood` is O(n) over ≤ 270 ids per tap; no per-frame work

**Constraints**: pure data functions (injected `categoryOf` and `random`), no new dependencies,
no category hints before the card is flipped (004), reduced motion honored

**Scale/Scope**: 1 new component (replaces 1), ~6 source files, ~6 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção | ✅ | Removes a control without perceivable effect from category decks; one tap to change mood; offline |
| II. Imersão Tátil (haptics, UI thread, reduced motion) | ✅ | Success haptic on change; icon animation runs on the UI thread via shared values; skipped under reduced motion. The swap is a state change (no per-frame `setState`) |
| III. Tipagem Estrita | ✅ | `changeMood`/`canChangeMood` typed over `DeckProgress`; `categoryOf: (id: string) => string \| undefined`; no `any` |
| IV. Arquitetura Limpa | ✅ | Rule in Data (`deck.ts`, store, hook); `ChangeMoodButton` is a dumb prop-driven component; screen wires them |
| Stack (StyleSheet only in animated component, not mixed) | ✅ | `ChangeMoodButton` uses StyleSheet only (like `ReshuffleButton`) |
| Jogo: no repeat until all shown, any card skippable | ✅ | The moved card is taken from the never-shown tail; replaced card stays in history (R2) |
| Jogo: one card at a time, no timer/score | ✅ | Unchanged |
| UI strings centralized | ✅ | `strings.deck.changeMoodLabel`, `strings.deck.moodChanged` |
| Data-layer logic tested first | ✅ | `deck.test.ts` (rules, odds, no-repeat property), store and hook tests |
| Qualidade gates | ✅ | quickstart |

**Post-design re-check**: all ✅, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/011-mixed-change-mood/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── change-mood.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── data/
│   ├── deck.ts                        # + canChangeMood, changeMood; − reshuffleRemaining, canReshuffleRemaining, remainingCount
│   └── __tests__/deck.test.ts         # changeMood suite; 008 suite removed
├── store/
│   ├── progress.ts                    # changeMood(deckId) replaces reshuffleRemaining
│   └── __tests__/progress.test.ts
├── hooks/
│   ├── useDeck.ts                     # canChangeMood / changeMood (mixed only)
│   ├── useHaptics.ts                  # reshuffle → changeMood (same success pattern)
│   └── __tests__/useDeck.test.ts
├── components/
│   ├── ChangeMoodButton.tsx           # new (replaces ReshuffleButton.tsx, deleted)
│   └── __tests__/ChangeMoodButton.test.tsx  # replaces ReshuffleButton.test.tsx
├── i18n/strings.ts                    # changeMoodLabel, moodChanged; − reshuffleLabel, reshuffled
└── screens/
    ├── DeckScreen.tsx                 # button only in mixed deck; face-up gate; toast
    └── __tests__/DeckScreen.test.tsx  # 008 block → 011 block
```

**Structure Decision**: single Expo project (existing layout).

## Complexity Tracking

No violations.
