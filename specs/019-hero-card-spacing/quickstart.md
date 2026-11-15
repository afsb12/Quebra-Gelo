# Quickstart: validar o card "Tudo Misturado" (019)

```bash
npx jest src/components/__tests__/MixedHeroCard.test.tsx src/screens/__tests__/HomeScreen.test.tsx
npm run typecheck && npm run lint && npm test
```

Manual (Expo Go ou APK, telas de 320, 360 e 430 pt):

1. Início: 16 pt entre "Sobre o que vamos conversar?" e o card; 24 pt entre o card e "Baralhos".
2. As bordas do card coincidem com as da grade.
3. A engrenagem fica no canto superior direito; tocar nela abre o filtro e não inicia o jogo.
4. Tocar no resto do card abre o Tudo Misturado.
5. Em 320 pt, "Tudo Misturado" termina antes da engrenagem.
6. Fonte grande do sistema: o card cresce, nada é cortado.

Contrato: [contracts/mixed-hero-card.md](./contracts/mixed-hero-card.md).
