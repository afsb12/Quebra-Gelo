# Research: "Mudar o Clima" no Modo Misturado

## R1. Why the 008 reshuffle has no perceivable effect

- **Finding**: `createDeck` uses Fisher–Yates, so every order of the deck is equally likely.
  Conditioned on the cards already shown, the never-shown tail is a uniformly random order of the
  remaining cards; reshuffling it yields another uniformly random order. The probability that any
  given card comes next is `1 / remaining` either way.
- **Decision**: remove the reshuffle-remaining feature and replace it, in the mixed deck, with an
  action that changes the distribution of the next card (R2).

## R2. Where the new card goes (history and no-repeat)

- **Decision**: with `prefix = order[0..furthest]` (history, 009) and `tail = order[furthest+1..]`
  (never shown), pick index `i` in `tail` (R3), build
  `order = [...prefix, tail[i], ...tail without i]` and then `advance`.
- **Rationale**: the replaced card stays in the history (swipe right brings it back), the moved
  card was never shown, and the set of ids is unchanged → each card still appears exactly once
  (SC-003). The other never-shown cards keep their shuffled order.
- **Alternatives**: swap `tail[0]` and `tail[i]` (also valid, but reorders one more card for no
  gain); filter out the current category for the rest of the session (changes the deck contract).

## R3. Choosing the card (odds)

- **Decision**: categories = distinct `categoryOf(id)` over `tail`, minus the current card's
  category, in first-appearance order; pick `categories[floor(random() * length)]`; take the first
  `tail` index with that category.
- **Rationale**: equal odds per category (clarify Q2); "first in the tail" keeps the shuffle's
  randomness inside the category. Deterministic with an injected `random` → testable (SC-002).
- **Alternatives**: random card among other categories (biased to big categories, weak "change
  of mood" near the end of an unbalanced mix).

## R4. Availability

- **Decision**: `canChangeMood(deck, categoryOf)` is true when `cursor === furthest`,
  `cursor < order.length` and at least one tail card has another category. The screen adds
  `face === 'up'` and "mixed deck" (the hook returns `false` for category decks).
- **Rationale**: spec FR-006; the face state lives in the screen (009 pattern for the favorite
  button), the data rules live in `deck.ts`.

## R5. Category lookup without impurity

- **Decision**: `changeMood` receives `categoryOf: (id: string) => string | undefined`; the store
  passes `(id) => getQuestion(id)?.categoryId`. Unknown ids count as no category and are never
  chosen.
- **Rationale**: keeps `deck.ts` free of content imports (pure, like `shuffle(random)`).

## R6. Button look and feedback

- **Decision**: `ChangeMoodButton` copies the 008 disc (44pt, `rgba(34,30,43,0.6)`, ice-blue icon,
  opacity 0.4 when disabled) with icon `weather-partly-cloudy`. On press: a short "pop" (scale
  1 → 1.2 → 1, 300 ms total with `withSequence`) on the UI thread, skipped under
  `useReducedMotion()`. Haptic: `Haptics.notificationAsync(Success)` (renamed `changeMood` in
  `useHaptics`). Toast "Clima trocado" in the `HintLine` for 2 s plus
  `AccessibilityInfo.announceForAccessibility` — the 008 mechanism, reused.
- **Alternatives**: animate the card out like a discard (needs an imperative API into
  `SwipeCard`; rejected in clarify Q5).

## R7. Removing 008

- **Decision**: delete `reshuffleRemaining`, `canReshuffleRemaining`, `remainingCount`,
  `MAX_SHUFFLE_ATTEMPTS`, `sameOrder` (deck.ts), the store action, the hook fields, the
  `ReshuffleButton` component, its strings and every 008 test. `DeckComplete`'s "Embaralhar de
  novo" (store `reshuffle`) stays.
- **Rationale**: FR-011; no dead code.
