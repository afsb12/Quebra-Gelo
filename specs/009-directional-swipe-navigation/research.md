# Research: Navegação direcional e tutorial atualizado (009)

## R1. History model: `furthest` on `DeckProgress`

- **Decision**: add `furthest: number` to `DeckProgress`: the highest index ever shown (clamped
  to `order.length - 1`). `cursor` is the card on the table. History = `order[0..furthest]`; never
  shown = `order[furthest + 1..]`.
  - `advance`: `cursor + 1` (clamped to `order.length`), `furthest = max(furthest, min(cursor + 1, order.length - 1))`.
  - `goBack`: `cursor - 1` when `canGoBack` (`0 < cursor < order.length`); otherwise the **same object**.
  - `createDeck`: `furthest: 0`.
- **Rationale**: the order array already is the history, so going back is just moving the cursor.
  Advancing after going back walks the same cards in the same order (FR-005) for free. `furthest`
  is the only new field needed to tell the 008 reshuffle which cards were never shown (FR-011).
- **Alternatives considered**: a separate history stack of IDs (duplicates `order`, and drifts out
  of sync with reshuffle); a "seen" set (loses the order).

## R2. Reshuffle (008) after going back

- **Decision**: `remainingCount = max(0, order.length - furthest - 1)`, and
  `reshuffleRemaining` shuffles `order.slice(furthest + 1)`. Without going back, `furthest === cursor`,
  so 008's behavior and tests are unchanged.

## R3. Gesture: left advances, right goes back, elastic block on card 1

- **Decision**: `SwipeCard` gets `canGoBack: boolean`, mirrored into a shared value
  (`useEffect` → `.set()`), so the worklets read the current value. In `onUpdate`, when
  `!canGoBack` and `translationX > 0`, use `translateX = min(translationX × 0.2, 40)`: it follows
  the finger a little and stops at 40 pt. In `onDeactivate`, a right swipe or flick with
  `!canGoBack` always springs back (`withSpring(0)`) and calls nothing. Otherwise the existing
  `discard(direction)` runs: left → `onDiscard('left')`, right → `onDiscard('right')`.
- **Rationale**: this keeps the existing UI-thread physics (constitution II) and adds no new
  animation primitive. A linear damping with a cap is predictable, easy to test (pure helper
  `resistX`) and reads as "resistance".
- **Alternatives considered**: an exponential rubber band (nicer curve, harder to reason about
  and test); disabling the right pan entirely (no feedback, the gesture feels broken).

## R4. Returning card face

- **Decision**: `SwipeCard` gets `initialFace?: CardFace` (default `'down'`), read only at mount
  (rotation 180 and `faceUp` true when `'up'`). `DeckScreen` sets `face` to `'up'` before calling
  `goBack()` and to `'down'` before `discard()`, and passes `initialFace={face}`, so the remounted
  card (`key={question.id}`) starts on the right side. The favorite button state follows `face`.

## R5. Haptics

- **Decision**: `onSwipeConfirmed` stays wired to `haptics.discard` (medium impact) for both
  directions. A blocked swipe never calls it.

## R6. Accessibility actions

- **Decision**: rename the `skip` action label to "próxima" (`strings.card.actions.next`) and make
  it call `onDiscard('left')`. Add a `previous` action ("voltar"), listed only when `canGoBack`,
  which calls `onDiscard('right')`. The action name `skip` is kept, so existing tests and the
  screen-reader muscle memory stay valid.

## R7. Tutorial layout (4 hints)

- **Decision**: above the card, a two-column row: left column "Deslize para a esquerda para passar
  a carta" (left-aligned), right column "Deslize para a direita para voltar à carta anterior"
  (right-aligned). The `chevron-left` / `chevron-right` icons stay at the sides of the card.
  Below it, the tap icon moves to the **center** of the card (it was at the bottom) and the flip
  hint sits under the card. At the bottom, the deck hint with `chevron-double-down`. testIDs:
  `tutorial-hint-next`, `tutorial-hint-back`, `tutorial-hint-flip`, `tutorial-hint-deck`, which
  is also the reading order (FR-013, US2-4).
- **Rationale**: at 320 pt each column gets about 130 pt, so 3–4 lines of 16 pt text with no
  overlap. Putting each text by its arrow makes the direction unambiguous.
- **Length**: the longest hint has 51 characters → limit raised to 55 (spec FR-013).

## R8. Show the new tutorial once to previous users

- **Decision**: `TUTORIAL_VERSION = 2`. Persist `{ hasSeenTutorial, tutorialVersion }`; on
  rehydrate, `hasSeenTutorial = stored.hasSeenTutorial === true && stored.tutorialVersion === 2`.
  An old `{ hasSeenTutorial: true }` (no version) counts as not seen, so the tutorial shows once.
  `markSeen` writes version 2. The zustand `persist` version stays 1 (the custom `merge` already
  validates the shape, so no `migrate` is needed).
- **Rationale**: this is the smallest change. Consumers keep reading `hasSeenTutorial`, and the
  tolerant read/write behavior from 005 is unchanged.

## R9. Deck hint text

- **Decision**: `strings.deck.tapHint = 'Toque para virar · ← próxima · anterior →'` (FR-010).
  It also serves as the card's `accessibilityHint`.
