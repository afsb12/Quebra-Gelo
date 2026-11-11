# Quickstart: Ícone de Brinde de Chope para o Happy Hour

## Automated

```bash
npm run typecheck
npm run lint
npm test
npx jest src/components/__tests__/CategoryIcon.test.tsx
npx jest src/data/__tests__/content.test.ts
```

Expected: all green; `CategoryIcon` draws an `Svg` for `beer-toast` and a glyph for any other name;
content test 4 accepts `beer-toast` and still rejects unknown names.

## Manual (Expo Go or release APK 1.7.0)

1. Home: the Happy Hour mini back shows two mugs toasting; Primeiros Encontros still shows the
   flute. They are distinguishable without reading the names (SC-003).
2. Open Happy Hour: the full back shows the toast in dark text color; flip: the front corner shows
   it in orange ink on cream.
3. Favorite the card, open Favoritos: the item shows the toast.
4. Home → Tudo Misturado filter: the Happy Hour option shows the toast; play the mix until a Happy
   Hour card is revealed: the origin badge shows the toast.
5. Finish (or reshuffle to the end of) the Happy Hour deck: the end screen shows the toast.
6. TalkBack on: the icon is not announced; labels are unchanged.
7. Every other category's icon looks exactly as in 1.6.0.
