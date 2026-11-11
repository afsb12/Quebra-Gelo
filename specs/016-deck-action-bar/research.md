# Research: Tela de Jogo com Barra de Ações

## R1. Triggering the card exit from a button

- **Decision**: `SwipeCard` takes `ref?: Ref<SwipeCardHandle>` and exposes `swipe(direction)` via
  `useImperativeHandle`. It ignores the call while `isAnimating`, and ignores 'right' when
  `canGoBack` is false; otherwise it calls `onSwipeConfirmed` (haptic) and starts the same
  `withTiming` exit (or fade under reduced motion) whose completion calls `onDiscard`.
- **Rationale**: one exit path for gesture and button; animation stays on the UI thread.
- **Alternatives**: a `command` prop with a nonce (effect-driven, harder to read); calling
  `discard()` in `useDeck` directly (no exit animation, breaks FR-002).

## R2. Progress color

- **Decision**: `progressColor(color, background = appBackground)`: return the color if contrast
  ≥ 3:1, else raise HSL lightness in 0.01 steps until it is; mixed deck uses `iceBlue`.
- **Rationale**: WCAG non-text contrast; mirrors `inkOnCream`.

## R3. Stack behind the card

- **Decision**: absolute, `pointerEvents="none"`, hidden from accessibility; two rounded cream-framed
  faces (offset/rotation −6,8,−2.5° and 10,14,4°, opacity 0.85/0.55) in the category color or
  `surface` in the mix; count = min(2, total − index).
- **Rationale**: static decoration, zero animation cost; no category leak in the mix (004).

## R4. Reserved height

- **Decision**: `DECK_RESERVED_HEIGHT` 170 → 190 (the largest value that keeps the 320×568 text-fit rule; side buttons 56 pt tall, tight paddings; header + 4 pt bar ≈ 68, action bar 56 + hint row
  44 + paddings ≈ 124, stack offset 14). The 320×568 text-fit test is the guard (SC-003).

## R5. Hint visibility

- **Decision**: DeckScreen counts cards shown (`shownCount`, starts at 1, +1 on every discard
  either way); hint visible while `shownCount ≤ 3`. Toast still replaces the line.
