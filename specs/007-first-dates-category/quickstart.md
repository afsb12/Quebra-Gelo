# Quickstart: validating "Primeiros Encontros"

## Prerequisites

`npm install` done; Expo Go on a device, or an emulator.

## 1. Automated gates

```bash
npm run typecheck
npm run lint
npm test
npx jest src/data            # content validation incl. the new tone test (R4)
npx jest src/theme           # palette: #FF9F43 / dark text / ink #AE5500
npx jest src/screens/__tests__/HomeScreen.test.tsx   # 9 tiles in order, "7 de 9 categorias"
```

Expected: all green. A deliberately bad question (e.g. "O que você mais gosta em mim?") added to
the category must make `content.test.ts` fail.

## 2. Manual content review (SC-002)

Read all 20 questions aloud imagining two people who met an hour ago. Each must: be answerable
by anyone; avoid exes, sex, body, money, religion, politics, health, family, marital status,
children; assume no shared history; not sound like a job interview; not repeat a `casual` or
`casais` question.

## 3. In the app (`npm start`)

1. **Home**: order is Descontraído, Primeiros Encontros, Profundo, … , Futuro e Sonhos; the new
   tile is visible without scrolling, peach-orange with a flute icon and dark text; the 9th tile
   sits alone on the left of the last row, same size as the others.
2. **Deck**: tap the tile → first card in ≤ 2 taps; flip/discard with haptics; skip any card;
   play all 20 → no repeats, "deck complete" screen, restart works.
3. **Favorites**: favorite one card → listed with the category's name and color; survives an app
   restart.
4. **Mixed mode**: the filter lists 9 categories in Home order, new one on. Turn off two →
   summary "7 de 9 categorias".
5. **Upgrade path**: on a build of 006 with a saved filter (e.g. Casais off), install this build →
   Primeiros Encontros on, Casais still off.
6. **Side by side**: compare the Primeiros Encontros and Happy Hour tiles and card fronts; confirm
   they are distinguishable by icon and name (research R2).
