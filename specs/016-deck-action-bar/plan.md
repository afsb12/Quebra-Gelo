# Implementation Plan: Tela de Jogo com Barra de Ações

**Branch**: `016-deck-action-bar` | **Date**: 2026-11-11 | **Spec**: [spec.md](./spec.md)

## Summary

`SwipeCard` gains an imperative handle (`ref.swipe(direction)`) that runs the same exit animation +
haptic + `onDiscard` as a released gesture. A new dumb `DeckActionBar` (Anterior / Favoritar /
Próxima) calls it from `DeckScreen`. The header gets a short counter "n / total" (label "Carta n de
total") and a new `DeckProgress` bar whose color comes from a new theme helper
`progressColor(color)` (lightens until ≥ 3:1 on the app background; ice blue for the mix). A new
`DeckStack` draws up to 2 static face-down cards behind the current one (category color, or neutral
surface in the mix). The hint line shows the new short hint only for the first 3 cards shown in the
screen session; "Mudar o clima" moves to the right of that line in the mixed deck.
`DECK_RESERVED_HEIGHT` grows to fit the taller controls while keeping the 002 text-fit rule.

## Technical Context

**Language/Version**: TypeScript 6 strict, React 19 / RN 0.88
**Primary Dependencies**: Reanimated 4 + worklets, Gesture Handler 3, NativeWind 4, expo-haptics
**Storage**: none
**Testing**: Jest + RNTL 14 (Reanimated/Worklets mocks)
**Target Platform**: Android + iOS · **Project Type**: mobile app
**Performance Goals**: card animation stays on the UI thread; the stack is static (no per-frame work)
**Constraints**: 009 directions, 004 hidden backs in the mix, 011 mood rules, 002 text fit at 320×568
**Scale/Scope**: SwipeCard, DeckScreen, 3 new components, 1 theme helper, strings, tests

## Constitution Check

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção | ✅ | No new steps; buttons are optional alternatives |
| II. Imersão Tátil (UI-thread physics, haptics, reduced motion) | ✅ | Buttons reuse the worklet exit animation and `onSwipeConfirmed` haptic; reduced motion keeps the fade |
| III. Tipagem Estrita | ✅ | `SwipeCardHandle` typed; `Ref<SwipeCardHandle>` prop |
| IV. Arquitetura Limpa | ✅ | New components dumb; DeckScreen wires `useDeck` + ref |
| Stack: StyleSheet only in animated card components, never mixed | ✅ | `DeckStack` StyleSheet (card-face geometry); `DeckActionBar`/`DeckProgress` NativeWind |
| Jogo: one card at a time, skip any card, no scoreboard | ✅ | Progress shows position in the deck, not a score |
| 004: mixed backs never hint the category | ✅ | Stack and bar neutral in the mix |
| Acessibilidade | ✅ | ≥ 44 pt buttons with labels/disabled state; stack hidden from readers |
| Qualidade gates | ✅ | typecheck, lint, test (+ textFit at 320×568) |

**Post-design re-check**: all ✅.

## Project Structure

```text
src/components/SwipeCard.tsx        # ref handle swipe(direction)
src/components/DeckActionBar.tsx    # NEW
src/components/DeckProgress.tsx     # NEW
src/components/DeckStack.tsx        # NEW
src/theme/color.ts                  # progressColor()
src/theme/geometry.ts               # DECK_RESERVED_HEIGHT
src/i18n/strings.ts                 # deck.counter, deck.swipeHint, deck.previous, deck.next
src/screens/DeckScreen.tsx          # wiring
tests: SwipeCard, DeckActionBar, DeckProgress/DeckStack, color, DeckScreen
```

## Complexity Tracking

None.
