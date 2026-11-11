# Quickstart: Início em Grade de 3 Colunas

```bash
npm run typecheck && npm run lint && npm test
npx jest src/screens/__tests__/HomeScreen.test.tsx src/components/__tests__/MixedHeroCard.test.tsx
```

Manual (390×844):

1. Home shows brand row + Favoritos, "Sobre o que vamos conversar?", the mix card with "Jogar" and
   "10 categorias", "Ou escolha um baralho" and a 3-column grid; ≥ 6 backs visible without scrolling.
2. Tap a back → that deck opens. Tap the chip → filter opens; save 8 → chip reads "8 de 10 categorias".
3. Tap "Jogar" → mixed deck opens.
4. TalkBack on a back reads "<nome>. <descrição>".
