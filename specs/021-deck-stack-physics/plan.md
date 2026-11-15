# Implementation Plan: Física da Pilha de Cartas

**Branch**: `021-deck-stack-physics` | **Date**: 2026-11-15 | **Spec**: [spec.md](./spec.md)

## Summary

`DeckScreen` owns one shared value, `stackProgress` (0 = rest, 1 = "one layer up"), and passes it to
both `SwipeCard` (writer) and `DeckStack` (reader). `DeckStack` draws 3 layers; layer *i* sits at the
continuous slot `s = i − progress` and takes its pose from a pure worklet `stackSlotPose(s)` (linear
between the slot poses of the spec: 0 = top, 1 = middle, 2 = base, 3 = hidden below), times a
visibility factor `clamp(remaining + 1 − s, 0, 1)` so layers without a card stay invisible.
`SwipeCard` writes the progress on the UI thread: during a left drag `stackDragProgress(tx, screenWidth)`
(0…1 at the 30 % threshold), `withTiming(1)` with the exit, `withSpring(0)` on spring-back, and on
mount `withSpring(0)` (the promoted stack settles under the new card). A card brought back
(`enterFrom="left"`) mounts at `translateX = −0.6 × screenWidth` and springs to 0 while the progress
goes 1 → 0 (old top recedes to the middle). Right drags never touch the progress, so the first card's
elastic resistance leaves the stack still. Reduced motion: progress pinned to 0, no slide-in.

## Technical Context

**Language/Version**: TypeScript 6 strict, React 19 / RN 0.88
**Primary Dependencies**: Reanimated 4 + react-native-worklets, Gesture Handler 3 (hook API)
**Storage**: none · **Testing**: Jest + RNTL 14 (Reanimated mock: `interpolate` is a no-op, so poses
come from our own pure math) · **Target**: Android + iOS · **Type**: mobile app
**Performance Goals**: 60 fps; zero `setState` per frame (shared values + `useAnimatedStyle`)
**Constraints**: StyleSheet in animated components (no NativeWind mixing); `.get()/.set()` only
**Scale/Scope**: DeckStack, SwipeCard, DeckScreen, tests

## Constitution Check

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção | ✅ | No flow change |
| II. Imersão Tátil | ✅ | Gesture-driven physics (springs), UI thread only; haptics unchanged (flip/discard); reduced motion → static stack + fade |
| III. Tipagem Estrita | ✅ | `SharedValue<number>` props, typed `StackPose`, no `any` |
| IV. Arquitetura Limpa | ✅ | DeckStack/SwipeCard stay props-only UI; the screen owns the shared value; pose math pure |
| Stack (StyleSheet in animated comps, no mixing) | ✅ | DeckStack and SwipeCard stay StyleSheet-only |
| Jogo: uma carta por vez | ✅ | Stack is decorative, hidden from screen readers, no touches |
| 004 hidden backs | ✅ | Stack faces stay plain/neutral in the mix |
| Qualidade gates | ✅ | typecheck, lint, test |

**Post-design re-check**: all ✅.

## Project Structure

```text
src/components/DeckStack.tsx    # STACK_SLOTS, stackSlotPose, stackVisibility, 3 animated layers
src/components/SwipeCard.tsx    # stackProgress + enterFrom props, stackDragProgress, writes on UI thread
src/screens/DeckScreen.tsx      # useSharedValue stackProgress, remaining count, enterFrom after "voltar"
tests: DeckActionBar.test.tsx (DeckStack block), SwipeCard.test.tsx, DeckScreen.test.tsx, new DeckStack.test.tsx
```

See [research.md](./research.md), [contracts/deck-stack.md](./contracts/deck-stack.md),
[quickstart.md](./quickstart.md). No data model (presentation only).

## Complexity Tracking

None.
