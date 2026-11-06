# Contract: reshuffle of the remaining cards (008)

Internal app interfaces only (no network, no persisted format change).

## Data layer — `src/data/deck.ts`

```ts
export const remainingCount: (deck: DeckProgress) => number;
export const canReshuffleRemaining: (deck: DeckProgress) => boolean; // remainingCount >= 2
export const reshuffleRemaining: (deck: DeckProgress, random?: () => number) => DeckProgress;
```

Invariants: see [data-model.md](../data-model.md#transition-reshuffleremainingdeck-random--deckprogress).

## Store — `src/store/progress.ts`

```ts
reshuffleRemaining: (deckId: DeckId) => void; // no-op when the deck is missing or can't reshuffle
```

`reshuffle(deckId, mixCategories?)` (full restart) is unchanged.

## Hook — `src/hooks/useDeck.ts` (`UseDeckResult` additions)

```ts
/** True while a card is on the table and at least 2 cards come after it. */
canReshuffleRemaining: boolean;
/** Reorders only the cards not shown yet; keeps the current card, counter and seen cards. */
reshuffleRemaining: () => void;
```

## Haptics — `src/hooks/useHaptics.ts` (`UseHapticsResult` addition)

```ts
/** System "success" notification pattern when the remaining cards are reshuffled. */
reshuffle: () => void;
```

## UI components (`src/components`, props only)

```ts
export interface ReshuffleButtonProps {
  disabled: boolean;
  onPress: () => void; // never called while disabled
}
// testID "reshuffle-button", accessibilityRole "button",
// accessibilityLabel strings.deck.reshuffleLabel, accessibilityState { disabled }

export interface HintLineProps {
  hint: string;
  /** When set, replaces the hint with a toast pill (pointerEvents none). */
  toast?: string;
}
// testID "deck-toast" on the pill
```

## Strings — `src/i18n/strings.ts` (`deck` additions)

| Key | pt-BR |
|---|---|
| `deck.reshuffleLabel` | `Embaralhar as próximas cartas` |
| `deck.reshuffled` | `Cartas embaralhadas` |

## Screen behavior — `DeckScreen`

| Situation | Reshuffle button | On press |
|---|---|---|
| Card on table, ≥ 2 cards after it | enabled | `reshuffleRemaining()`, `haptics.reshuffle()`, toast 2 s, screen-reader announcement |
| Card on table, 0–1 cards after it | disabled | nothing |
| Deck completed ("Fim do Baralho") | not rendered | — |
