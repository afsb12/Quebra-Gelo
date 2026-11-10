# Quickstart: validating "Família"

## Prerequisites

`npm ci` done; branch `013-family-category`.

## 1. Automated gates

```bash
npm run typecheck
npm run lint
npm test
npx jest src/data/__tests__/content.test.ts      # rules 1–15 incl. new 15 (contracts/content.md)
npx jest src/theme                               # palette TABLE incl. familia, contrast ≥ 4.5:1, ΔE ≥ 25
npx jest src/screens/__tests__/HomeScreen.test.tsx   # 10 tiles, order, "8 de 10 categorias"
```

Expected: all green.

## 2. Manual content review (SC-002, SC-003)

Read the 30 `familia-*` texts in `src/data/data.json` and confirm for each:

- names no specific relative and assumes no family structure (FR-009);
- touches none of the topics in FR-008 and ranks/exposes no one;
- works with relatives at the table **and** when told to friends (FR-007a);
- a child of school age and an older adult can both understand and answer it;
- not a rewrite of a `nostalgia-*` question;
- count per theme of research R3 is ≥ 3 (target 5).

## 3. In the app (`npm start`, Expo Go)

1. Home shows, in order: … Viagens e Aventuras, Nostalgia e Infância, **Família**, Futuro e Sonhos;
   the grid's last row is full.
2. Família tile: green back, dark text, house-with-heart icon, description fully visible.
3. Open it: card front has a leaf-green frame/icon clearly different from Futuro's dark green;
   flip/discard/skip/back work with haptics; 30 cards without repeats, then the completion notice.
4. Favorite a card → Favoritos shows it with the Família badge; restart the app → still there.
5. Mix filter lists 10 categories, Família on; turn off two → Home summary "8 de 10 categorias".
6. On a build that had a saved filter (e.g., Casais off), update → Família on, Casais still off.
