# Quickstart: validating 011

## Automated

```bash
npm run typecheck
npm run lint
npm test
npx jest src/data/__tests__/deck.test.ts -t "changeMood"
npx jest src/screens/__tests__/DeckScreen.test.tsx -t "011"
```

Expected: all green; no reference to the 008 reshuffle remains:

```bash
git grep -n "reshuffleRemaining\|canReshuffleRemaining\|ReshuffleButton\|remainingCount\|Cartas embaralhadas" -- src
```

Expected: no output.

## In the app

1. Open **Tudo Misturado** (default filter). The button right of the star is a cloud/sun icon,
   disabled while the card is face down.
2. Flip the card, note the category, tap the button: vibration, "Clima trocado" toast, a new
   face-down card; the counter goes up by one. Flip it: a different category. Repeat ~10 times.
3. Swipe right: the replaced card comes back face up; the button is disabled while reviewing;
   swipe left back to the newest card and it works again.
4. Filter to 2 categories, play near the end until only one category is left: the button stays
   disabled.
5. Open any single category: no shuffle/mood button, star centered. Play to the end: "Embaralhar
   de novo" restarts the deck.
6. With "Remove animations" (reduced motion) on: no icon animation; vibration and toast remain.
