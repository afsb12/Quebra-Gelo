# Quickstart: validating 004

## Automated

```bash
npm run typecheck
npm run lint
npm test
npx jest src/data src/store src/hooks           # deck IDs, mixed question list, progress keys
npx jest src/components                         # BrandCardBack, CategoryBadge, CardFront, MixedHeroCard
npx jest src/screens                            # DeckScreen (mixed), HomeScreen hero
npx jest src/theme/__tests__/brand.test.ts      # in-app symbol == scripts/icon/symbol.ts
```

Expected coverage of the spec:

| Check | Spec |
|---|---|
| `getDeckQuestionIds('mixed')` = all IDs; mixed deck walks every question once, then "Fim do Baralho" | FR-002, FR-003, FR-005, SC-004 |
| mixed and category progress are independent | FR-004 |
| face-down mixed label/header contain no category title; brand back has no text | FR-008, FR-009, SC-001 |
| badge shows the content icon/title/color for every category | FR-013, SC-002 |
| front keeps corner icon, footer and frame; badge only with `showOriginBadge` | FR-015, FR-017 |
| Home renders the hero card before the grid; press → `/deck/mixed` | FR-001, FR-010, SC-003 |

## Manual (device)

1. `npm start`, open on the phone.
2. Home: the wide dark "Tudo Misturado" card sits above the 8 categories.
3. Tap it: one tap, a dark card with the symbol appears, header "Tudo Misturado".
4. Skip several cards: every back is identical. Flip: light haptic, question + colored badge at
   the top (corner icon, star and footer still there). Favorite works.
5. TalkBack on: the face-down card says "Carta do Quebra-Gelo, virada para baixo".
6. Reduced motion on: flip is the fade variant, no category hint before it.
7. Open a single category: its back/front are unchanged.
