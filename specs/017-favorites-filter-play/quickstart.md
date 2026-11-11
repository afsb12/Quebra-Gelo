# Quickstart: Favoritos com Filtro e Baralho de Favoritas

```bash
npm run typecheck && npm run lint && npm test
npx jest src/screens/__tests__/FavoritesScreen.test.tsx src/store src/data
```

Manual:

1. Favorite 3 questions from 2 categories; open Favoritos: "3 perguntas", chips Todas + 2 categories,
   cream items with icon + category header and a remove star, coral "Jogar com as favoritas" at the bottom.
2. Tap a category chip → only its items; remove its last item → back to Todas, chip gone.
3. Tap "Jogar com as favoritas" → "Favoritas", "1 / 3", neutral backs, origin badge when flipped, no
   "Mudar o clima"; finish → end screen; "Embaralhar de novo" restarts with the current favorites.
4. Remove all favorites → empty state, no play button.
