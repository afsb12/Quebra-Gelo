# Research: Física da Pilha de Cartas (021)

## R1 — One progress value, continuous slots

- **Decision**: a single `stackProgress` shared value p ∈ [0, 1] owned by `DeckScreen`. Layer *i*
  (1…3, nearest first) is drawn at slot `s = i − p`; poses are linear between the slots:

| slot | scale | translateX | translateY | rotate | opacity |
|---|---|---|---|---|---|
| 0 top | 1 | 0 | 0 | 0° | 1 |
| 1 middle | 0.95 | −8 | 8 | −3.5° | 0.9 |
| 2 base | 0.90 | 8 | 16 | +3.5° | 0.75 |
| 3 hidden | 0.85 | 0 | 24 | 0° | 0 |

- **Rationale**: one number drives every layer, so drag, exit, spring-back and the next card's settle
  are all continuous. At p = 1 the stack looks exactly like "the deck one card later", and when the next
  card mounts the progress springs back to 0 under it: the visible middle/base positions are occupied
  at every frame (no jumps, SC-002). The middle-to-base move flips the tilt (−3.5° → +3.5°) through 0°.
- **Alternatives**: per-layer shared values with explicit hand-off (more state, and a jump on
  re-mount); `interpolate` (fine on device, but a no-op in the Jest mock, so the math would go untested).

## R2 — Visibility near the end of the deck

- **Decision**: `stackVisibility(s, remaining) = clamp(remaining + 1 − s, 0, 1)`, multiplied into the
  slot opacity; `remaining` = cards after the current one. Render `min(3, remaining + 1)` layers; none
  when `remaining = 0`. The layers visible at rest (`i ≤ min(2, remaining)`) keep the testID
  `deck-stack-card`; the one invisible at rest is `deck-stack-incoming`.
- **Rationale**: FR-008; a layer standing for a card that does not exist is invisible at rest but can
  fade in/out while moving through the slots.

## R3 — Who writes the progress

- **Decision**: `SwipeCard` (optional `stackProgress` prop), always on the UI thread:
  - left drag (`onUpdate`): `p = stackDragProgress(tx, screenWidth) = clamp(−tx / (0.3 × screenWidth), 0, 1)`;
  - release past the threshold to the left (gesture or "Próxima"): `withTiming(1, EXIT_MS)` with the exit;
  - spring-back: `withSpring(0)` with the card's spring;
  - mount: `withSpring(0)` (settle after an advance; no-op at rest);
  - mount with `enterFrom="left"`: `p = 1`, then `withSpring(0)`, while `translateX` springs from
    `−0.6 × screenWidth` to 0.
- **Rationale**: the card already owns the gesture and its timing; the screen only shares the value.
- **Alternatives**: `useAnimatedReaction` on `translateX` (a no-op in the mock, and it would also
  react to the right-exit, moving the stack the wrong way).

## R4 — Going back

- **Decision**: right drags do not change p (spec Clarifications). When the previous card mounts
  (`enterFrom="left"`), p jumps to 1 under the incoming card and springs to 0: the old top (now index+1)
  recedes to the middle and the old middle to the base. The right exit of the current card is unchanged
  (009 tests and haptic timing stay valid).
- **Rationale**: FR-004/FR-005; the first-card resistance never writes p, so the stack stays still.

## R5 — Reduced motion and other paths

- **Decision**: with reduced motion, `SwipeCard` sets p to 0 directly and never writes animated values;
  `enterFrom` is ignored (the card fades in as today). Accessibility actions and "Mudar o clima" mount a
  new card normally (settle to 0).
