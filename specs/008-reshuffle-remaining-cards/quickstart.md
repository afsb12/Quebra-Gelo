# Quickstart: validating the in-game reshuffle (008)

## Prerequisites

`npm install` done; Expo Go on a device, or an emulator / local APK build.

## 1. Automated gates

```bash
npm run typecheck
npm run lint
npm test
npx jest src/data/__tests__/deck.test.ts          # reshuffleRemaining invariants (R2, R3)
npx jest src/store/__tests__/progress.test.ts     # store action, mixed deck keeps its filter
npx jest src/screens/__tests__/DeckScreen.test.tsx # button, haptic, toast, disabled state
```

Expected: all green.

## 2. In the app

1. **Category deck**: open any category, discard 3 cards → "Carta 4 de N". Tap the shuffle icon
   (bottom right, ice-blue): light "success" vibration, icon spins once, the hint line shows
   "Cartas embaralhadas" for ~2 s then the hint returns. Card 4 and the counter are unchanged; if
   the card was face up it stays face up.
2. **No repeats**: keep discarding to the end → every remaining card appears once, none of the
   first 3 come back, "Fim do Baralho" appears and the shuffle icon is gone.
3. **Disabled**: on the second-to-last card (and the last) the icon is dimmed; tapping it does
   nothing (no vibration, no toast).
4. **Mixed mode with filter**: turn off a few categories, play "Tudo Misturado", reshuffle → no
   card from a disabled category appears; the filter is unchanged; card backs stay neutral.
5. **Resume**: reshuffle, go back Home, reopen the same deck → same card, the game continues.
6. **Gesture safety**: tapping the icon never flips or discards the card.
7. **Reduced motion** (system setting on): no spin; vibration and toast still happen.
8. **Screen reader**: the button reads "Embaralhar as próximas cartas" (and "desativado" when
   dimmed); activating it announces "Cartas embaralhadas".
9. **320 pt screen + large font**: the favorite button and the shuffle icon don't overlap; the
   card isn't covered by the toast.
