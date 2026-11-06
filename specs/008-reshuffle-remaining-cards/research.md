# Research: Re-embaralhar as cartas restantes (008)

No `NEEDS CLARIFICATION` remained in the Technical Context; the items below record the design
decisions taken while reading the existing code (`src/data/deck.ts`, `src/store/progress.ts`,
`src/hooks/useDeck.ts`, `src/screens/DeckScreen.tsx`).

## R1. Where the "remaining queue" lives

- **Decision**: Reuse `DeckProgress { order, cursor }` unchanged. Re-shuffling replaces
  `order.slice(cursor + 1)` with a permutation of itself; `order.slice(0, cursor + 1)` (seen cards
  plus the card on the table) and `cursor` stay identical.
- **Rationale**: the cursor is the "control index" of the request. Keeping it fixed means the
  counter, the discard flow and the "Fim do Baralho" screen need no change (FR-003, FR-009), and the
  no-repeat rule holds because the seen prefix is untouched (FR-004).
- **Alternatives considered**: a separate "seen set" + random draw per card (rewrites the deck
  model and every test, for no user-visible gain); rebuilding the whole deck and re-inserting the
  current card at index 0 (changes the counter to "Carta 1", violating FR-003).

## R2. Guaranteeing a different order (FR-005)

- **Decision**: `reshuffleRemaining(deck, random)` runs the existing Fisher–Yates `shuffle` on the
  tail and **rejects** a result equal to the old tail, retrying up to 8 times; if every attempt is
  equal (only possible with a degenerate injected `random`), it rotates the tail by one position,
  which always differs for ≥ 2 distinct IDs.
- **Rationale**: rejection sampling keeps the result uniform over all orders except the old one;
  with 2 cards the chance of a retry is 1/2, with 3 it is 1/6, so the expected cost is negligible.
  The rotation fallback guarantees termination and keeps the function total and testable with
  constant random sources.
- **Alternatives considered**: Sattolo's algorithm (always differs, but only produces cyclic
  permutations, so not uniform; with 3 cards it can never swap just two); comparing only the next
  card (a "new order" with the same next card would look like the tap did nothing — but the next
  card is hidden anyway, so full-order inequality is enough and simpler).

## R3. Disabled threshold (FR-006)

- **Decision**: `canReshuffleRemaining(deck) = order.length - cursor - 1 >= 2`. With fewer than 2
  cards after the current one, `reshuffleRemaining` returns the **same object** (no store update,
  no re-render) and the button is rendered disabled.
- **Rationale**: 0 or 1 remaining cards have exactly one order; FR-005 cannot be satisfied, so the
  action is meaningless. Returning the same reference makes "no change" cheap and assertable.

## R4. Store and hook API

- **Decision**: add `reshuffleRemaining(deckId)` to `useProgressStore` (no `mixCategories` needed:
  the mixed deck's `order` already holds only the filtered cards, FR-007). `useDeck` exposes
  `reshuffleRemaining` and `canReshuffleRemaining`. The existing `reshuffle` (full restart used by
  "Fim do Baralho") keeps its name and behavior.
- **Rationale**: the data layer owns the rule (constitution IV); screens only wire it. Naming the
  new action distinctly avoids changing the restart semantics covered by existing tests.

## R5. Haptic (FR-010)

- **Decision**: `useHaptics().reshuffle = Haptics.notificationAsync(NotificationFeedbackType.Success)`,
  fire-and-forget like the others; fired by the screen only when the button is enabled. The Jest
  mock of `expo-haptics` gains `notificationAsync` and `NotificationFeedbackType`.
- **Rationale**: matches the clarification (system "success" pattern, distinct from flip = light
  impact and discard = medium impact). Available in `expo-haptics` on both platforms; no new
  dependency.

## R6. Spin animation (FR-012)

- **Decision**: new dumb component `ReshuffleButton` (StyleSheet only, animated). On an enabled
  press it calls `onPress` and runs a UI-thread rotation `0 → 360°` with `withTiming(…, 400 ms)`
  on a shared value, reset to 0 at the start of each press; under `useReducedMotion()` the rotation
  is skipped. Icon: MaterialCommunityIcons `shuffle-variant`, color `tokens.colors.iceBlue`,
  44×44 pt touch target, translucent dark background (`surface` at ~60 % opacity), `opacity 0.4`
  when disabled (same convention as `FavoriteButton`).
- **Rationale**: Reanimated shared values keep the animation off the JS thread (constitution II);
  StyleSheet is allowed in animated components and the component does not mix it with NativeWind.
  The animation is presentational, so it may live in the UI component without breaking the
  "dumb component" rule.
- **Contrast**: `#9ED8F0` on `#221E2B` ≈ 11:1; disabled at 40 % opacity is still above the 3:1
  non-text guideline against `#16131C`.

## R7. Toast "Cartas embaralhadas" (FR-011, FR-015)

- **Decision**: new dumb component `HintLine` (StyleSheet only, since it is animated) that
  renders, in a fixed-height row (28 pt), either
  the gestures hint text or — when `toast` is set — a small pill with the toast text, fading in
  and out via Reanimated opacity (`withTiming`, 150 ms), `pointerEvents="none"`. The screen owns
  the timing: `toastNonce` state bumped on each enabled press, a `useEffect` clears it after
  2000 ms (restarted by every bump, so toasts never stack). The screen also calls
  `AccessibilityInfo.announceForAccessibility(strings.deck.reshuffled)`.
- **Rationale**: the hint row is outside the card area and already reserved in
  `DECK_RESERVED_HEIGHT`, so the toast can never cover the card nor shift the layout. Fades are not
  "motion", so they stay under reduced motion. No toast library needed (YAGNI).
- **Alternatives considered**: absolute overlay above the controls (may touch the card on short
  screens); a toast package (new dependency, global provider).

## R8. Bottom row layout at 320 pt (FR-013, SC-006)

- **Decision**: the favorite button sits in a row `[flex-1 spacer][FavoriteButton][flex-1 items-end
  → ReshuffleButton]` with `px-3`. Both side slots have `flex-1`, so the favorite button stays
  centered; the right slot has a 44 pt minimum width, so on very narrow layouts (320 pt with large
  fonts) the favorite button shifts slightly left instead of overlapping. The favorite label gets
  `numberOfLines={1}` and the button `shrink`, so it truncates rather than overflowing.
- **Rationale**: at 320 pt, 320 − 24 (padding) − 44 − 8 = 244 pt for the favorite button, which
  fits "Remover dos favoritos" at the default font size; the shrink rule covers larger fonts.
  `DECK_RESERVED_HEIGHT` is unchanged because the row height (56 pt) does not change.

## R9. Testing approach

- Pure function tests in `src/data/__tests__/deck.test.ts` (prefix preserved, tail is a
  permutation, differs from old tail, constant-random fallback, no-op below threshold, same
  reference returned).
- Store test: `reshuffleRemaining` keeps cursor/current/length, mixed deck keeps only filtered IDs.
- Hook test: `canReshuffleRemaining` true/false at the right positions.
- Component tests: `ReshuffleButton` (label, disabled state, onPress not called when disabled);
  `HintLine` (hint vs toast).
- Screen test: pressing the button keeps "Carta N de T" and the current question, fires
  `notificationAsync`, shows "Cartas embaralhadas", announces it, and the toast disappears after
  2 s (fake timers); the button is disabled on the second-to-last card; it is absent on
  "Fim do Baralho".
