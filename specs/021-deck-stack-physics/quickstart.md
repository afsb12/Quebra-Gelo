# Quickstart: validar a física da pilha (021)

```bash
npx jest src/components src/screens/__tests__/DeckScreen.test.tsx
npm run typecheck && npm run lint && npm test
```

Manual (APK ou Expo Go, num aparelho intermediário):

1. Abrir um baralho: atrás da carta, meio inclinado à esquerda e base à direita.
2. Arrastar devagar para a esquerda: o meio se endireita e cresce, a base sobe; soltar antes do limite
   devolve tudo com mola.
3. Descartar (gesto e botão "Próxima"): o meio assume o centro, a base vira o meio, uma carta surge na
   base; nenhum salto quando a próxima carta aparece.
4. Voltar (gesto e "Anterior"): a carta anterior entra pela esquerda; o fundo recua uma camada.
5. Primeira carta, arrastar para a direita: só a carta estica; o fundo não se move.
6. Ativar "Remover animações" no sistema: o fundo fica parado, trocas com fade.
7. Penúltima e última carta: só as camadas que existem aparecem.

Contrato: [contracts/deck-stack.md](./contracts/deck-stack.md).
