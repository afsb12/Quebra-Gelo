# Contract: "Mudar o clima"

## C1. Store (`useProgressStore`)

- `changeMood(deckId: DeckId): void` — applies `changeMood` from `deck.ts` with
  `categoryOf = (id) => getQuestion(id)?.categoryId`; no-op (same state object) when the deck is
  missing or `canChangeMood` is false.
- `reshuffleRemaining` is removed. `reshuffle` (full restart) is unchanged.

## C2. Hook (`useDeck`)

| Field | Category deck | Mixed deck |
|---|---|---|
| `canChangeMood: boolean` | always `false` | `current !== undefined && canChangeMood(deck)` |
| `changeMood: () => void` | no-op | store `changeMood('mixed')` |

`canReshuffleRemaining` / `reshuffleRemaining` are removed.

## C3. `ChangeMoodButton` props

```ts
interface ChangeMoodButtonProps {
  disabled: boolean;
  /** Never called while disabled. */
  onPress: () => void;
}
```

`testID="change-mood-button"`, `accessibilityRole="button"`,
`accessibilityLabel = strings.deck.changeMoodLabel`, `accessibilityState.disabled`.

## C4. Screen (`DeckScreen`)

- Mixed deck: button right of the favorite button; `disabled = face === 'down' || !canChangeMood`.
  On press: `changeMood()`, `setFace('down')`, success haptic, toast `strings.deck.moodChanged`
  for 2 s (one at a time), screen-reader announcement.
- Category deck: no button; the favorite button stays centered.

## C5. Strings (`strings.deck`)

- `changeMoodLabel: 'Mudar o clima: próxima carta de outra categoria'`
- `moodChanged: 'Clima trocado'`
- removed: `reshuffleLabel`, `reshuffled`
