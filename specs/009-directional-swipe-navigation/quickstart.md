# Quickstart: validating directional navigation (009)

## 1. Automated gates

```bash
npm run typecheck
npm run lint
npm test
npx jest src/data/__tests__/deck.test.ts     # advance/goBack/furthest, reshuffle scope
npx jest src/components/__tests__/SwipeCard  # resistX, accessibility actions
npx jest src/store/__tests__/onboarding.test.ts  # tutorial v2 shown once to old users
```

## 2. In the app

1. **Next**: swipe left on cards 1→4: each card leaves to the left, with a vibration; "Carta 4 de N".
2. **Back**: swipe right twice → "Carta 2", and the card that was 2nd comes back face up.
3. **Replay**: swipe left twice → cards 3 and 4 come back in the same order, then new cards.
4. **Block**: on card 1, drag right slowly and flick right: the card moves a little, springs back,
   no vibration, still "Carta 1".
5. **Reshuffle after back**: go back 2 cards and tap shuffle. The next 2 cards are the same seen
   ones, and only after them the order is new.
6. **Mixed**: go back in "Tudo Misturado" → the card returns face up with its category badge.
7. **Reduced motion**: next/back fade instead of flying; vibration stays.
8. **Tutorial**: clear the app data → 4 hints (left arrow "passar", right arrow "voltar", tap in
   the center, deck below); close it → it doesn't return. Then install over a 1.2.0 build that had
   already closed the tutorial → the new tutorial shows once.
9. **320 pt**: the tutorial texts don't overlap the card or each other.
