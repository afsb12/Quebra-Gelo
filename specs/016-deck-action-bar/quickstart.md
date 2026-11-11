# Quickstart: Tela de Jogo com Barra de Ações

```bash
npm run typecheck && npm run lint && npm test
npx jest src/screens/__tests__/DeckScreen.test.tsx src/theme/__tests__/textFit.test.ts
```

Manual:

1. Open Profundo: header "Profundo" + "1 / 30", thin bar, 2 cards behind, Anterior disabled.
2. Tap Próxima twice (card flies left, vibrates), Anterior once (card 2 back face up).
3. Hint "Dica: você também pode deslizar a carta" shows on cards 1–3, gone from card 4.
4. Tudo Misturado: stack and bar are neutral; "Mudar o clima" sits right of the hint line.
5. Reduced motion on: buttons fade the card like the gesture.
6. Last card: no card behind; after it, the end screen without the action bar.
