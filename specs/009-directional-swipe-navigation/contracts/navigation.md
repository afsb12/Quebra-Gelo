# Contract: directional navigation and tutorial (009)

## Data — `src/data/deck.ts`

```ts
export const canGoBack: (deck: DeckProgress) => boolean;
export const goBack: (deck: DeckProgress) => DeckProgress; // same object when it can't go back
// advance / remainingCount / reshuffleRemaining: semantics per data-model.md
```

## Store — `src/store/progress.ts`

```ts
goBack: (deckId: DeckId) => void; // no-op when missing or on card 1
```

## Hook — `useDeck` additions

```ts
canGoBack: boolean;   // a card is on the table and it is not the first
goBack: () => void;
```

## UI — `SwipeCard` props

```ts
canGoBack: boolean;          // false → right drag resists (≤ 40 pt) and always springs back
initialFace?: CardFace;      // read at mount; default 'down'
onDiscard: (direction: SwipeDirection) => void; // 'left' = next, 'right' = previous
```

Accessibility actions: `activate` (virar), `favorite` (favoritar), `skip` ("próxima" → left),
`previous` ("voltar" → right, only when `canGoBack`).

Pure helper (exported for tests): `resistX(translationX: number): number` = `min(max(translationX, 0) × 0.2, 40)`.

## Screen — `DeckScreen`

| Event | Effect |
|---|---|
| `onDiscard('left')` | `face = 'down'`, `discard()` |
| `onDiscard('right')` | `face = 'up'`, `goBack()` |
| `onSwipeConfirmed(any)` | `haptics.discard()` |

## Tutorial — `TutorialOverlay`

| testID | Text (`strings.tutorial`) | Icon |
|---|---|---|
| `tutorial-hint-next` | `hintNext`: Deslize para a esquerda para passar a carta | `chevron-left`, left of the card |
| `tutorial-hint-back` | `hintBack`: Deslize para a direita para voltar à carta anterior | `chevron-right`, right of the card |
| `tutorial-hint-flip` | `hintFlip`: Toque na carta para revelar a pergunta | `gesture-tap`, center of the card |
| `tutorial-hint-deck` | `hintDeck`: Toque em um baralho para começar | `chevron-double-down`, below |

## Strings changed

| Key | pt-BR |
|---|---|
| `deck.tapHint` | `Toque para virar · ← próxima · anterior →` |
| `card.actions.next` (replaces `skip`) | `próxima` |
| `card.actions.previous` | `voltar` |
| `tutorial.hintNext` / `hintBack` (replace `hintSwipe`) | as above |
