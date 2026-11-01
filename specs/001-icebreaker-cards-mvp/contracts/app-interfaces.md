# Contract: Routes, data-layer API and UI component props

Internal interfaces between the three constitutional layers. Signatures are TypeScript-style
contracts, not implementations. All types are exported from `src/data/types.ts` unless noted.

## 1. Routes (Expo Router, typed routes)

| Route                  | Screen container        | Params                        | Spec      |
|------------------------|-------------------------|-------------------------------|-----------|
| `/`                    | `HomeScreen`            | —                             | US2, FR-006–008 |
| `/deck/[categoryId]`   | `DeckScreen`            | `categoryId: CategoryId`      | US1, FR-009–019 |
| `/favorites`           | `FavoritesScreen`       | —                             | US3, FR-022 |

- An unknown `categoryId` redirects to `/`.
- Route files in `src/app/` only render the corresponding container from `src/screens/`.

## 2. Data layer (`src/data`, `src/store`, `src/hooks`)

```ts
// src/data/types.ts
type CategoryId = 'casual' | 'profundo' | 'casais' | 'happy-hour'
  | 'dilemas' | 'viagens' | 'nostalgia' | 'futuro';
interface Category { id: CategoryId; title: string; icon: string; color: string; description: string }
interface Question { id: string; categoryId: CategoryId; text: string }
interface Favorite { questionId: string; savedAt: number }
interface DeckProgress { order: string[]; cursor: number }

// src/data/content.ts — pure, synchronous, backed by data.json
getCategories(): readonly Category[]
getCategory(id: string): Category | undefined      // narrows unknown route params
getQuestionsByCategory(id: CategoryId): readonly Question[]
getQuestion(id: string): Question | undefined
isCategoryId(value: string): value is CategoryId

// src/data/deck.ts — pure functions
shuffle<T>(items: readonly T[], random?: () => number): T[]
createDeck(questionIds: readonly string[], random?: () => number): DeckProgress
advance(deck: DeckProgress): DeckProgress
currentQuestionId(deck: DeckProgress): string | undefined   // undefined ⇒ completed
isCompleted(deck: DeckProgress): boolean
reconcile(deck: DeckProgress, questionIds: readonly string[], random?: () => number): DeckProgress

// src/store/favorites.ts
useFavoritesStore: {
  favorites: Favorite[];
  toggle(questionId: string): void;
  remove(questionId: string): void;
  isFavorite(questionId: string): boolean;
}

// src/store/progress.ts
useProgressStore: {
  decks: Partial<Record<CategoryId, DeckProgress>>;
  ensureDeck(categoryId: CategoryId): void;   // creates if missing, reconciles if stale
  discard(categoryId: CategoryId): void;      // advance
  reshuffle(categoryId: CategoryId): void;    // new order, cursor 0
}

// src/hooks
useDeck(categoryId: CategoryId): {
  category: Category;
  current: Question | undefined;   // undefined ⇒ show completion screen
  position: { index: number; total: number };
  discard(): void;
  reshuffle(): void;
}
useFavoriteQuestions(): Array<{ favorite: Favorite; question: Question; category: Category }>
useHaptics(): { flip(): void; discard(): void }   // fire-and-forget, never throws
```

## 3. UI components (`src/components`) — props only, no stores/navigation

```ts
interface CategoryTileProps { category: Category; onPress(id: CategoryId): void }

interface SwipeCardProps {
  question: Question;
  category: Category;
  isFavorite: boolean;
  onFlip(face: 'up' | 'down'): void;      // screen triggers haptics
  onDiscard(direction: 'left' | 'right'): void; // called once, after exit animation
  onToggleFavorite(): void;
}
// SwipeCard owns gesture + animation state; resets to face 'down' when question.id changes.

interface CardFaceProps { category: Category; question?: Question; side: 'front' | 'back' }
interface FavoriteButtonProps { active: boolean; onPress(): void }   // label "Favoritar"/"Remover dos favoritos"
interface DeckCompleteProps { category: Category; onReshuffle(): void; onChooseAnother(): void }
interface FavoriteListItemProps { question: Question; category: Category; onRemove(): void }
interface EmptyStateProps { title: string; message: string }
```

Interaction guarantees of `SwipeCard` (verified by quickstart and tests):

- Tap toggles face; pan below threshold springs back without calling `onDiscard`.
- `onDiscard` fires exactly once per card; gestures are ignored while a flip/exit animation runs.
- Pressing the favorite button never flips or discards.
- Accessibility actions `activate` (virar), `favorite` (favoritar), `skip` (pular) map to
  `onFlip`, `onToggleFavorite`, `onDiscard('right')`.
