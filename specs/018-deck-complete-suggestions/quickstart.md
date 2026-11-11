# Quickstart: Fim do Baralho com Sugestões

```bash
npm run typecheck && npm run lint && npm test
npx jest src/screens/__tests__/DeckScreen.test.tsx src/data/__tests__/deckIds.test.ts
```

Manual:

1. Finish Dilemas: fan in purple, "Fim do Baralho", message, "Embaralhar de novo", "Que tal
   continuar com" Viagens e Aventuras + Nostalgia e Infância, "Ver todos os baralhos".
2. Tap a suggestion → that deck opens; back goes to Home.
3. Finish Futuro (last) → suggestions wrap to Descontraído + Primeiros Encontros.
4. Finish Tudo Misturado / Favoritas → neutral fan, no suggestions.
