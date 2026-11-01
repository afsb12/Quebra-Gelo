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

// src/store/favorites.ts — persisted (AsyncStorage)
useFavoritesStore: {
  favorites: Favorite[];
  toggle(questionId: string): void;
  remove(questionId: string): void;
  isFavorite(questionId: string): boolean;
}

// src/store/progress.ts — in memory only, resets when the app closes
useProgressStore: {
  decks: Partial<Record<CategoryId, DeckProgress>>;
  ensureDeck(categoryId: CategoryId): void;   // creates (shuffled) if missing
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
// CategoryTileProps — superseded by MiniCardProps (002 contracts/visual-components.md)

interface SwipeCardProps {
  question: Question;
  category: Category;
  visual: CategoryVisual;                 // (002) colors/pattern for CardBack/CardFront
  isFavorite: boolean;
  onFlip(face: 'up' | 'down'): void;      // screen triggers haptics
  onDiscard(direction: 'left' | 'right'): void; // called once, after exit animation
  onToggleFavorite(): void;               // only used by the "favorite" accessibility action
}
// isFavorite drives a non-interactive star indicator on the revealed face.
// SwipeCard owns gesture + animation state; resets to face 'down' when question.id changes.

// CardFaceProps — superseded by CardBackProps / CardFrontProps (002 contracts/visual-components.md)
interface FavoriteButtonProps { active: boolean; disabled: boolean; onPress(): void }
// Rendered by DeckScreen below the card, outside the gesture area; disabled while face down.
// Label "Favoritar" / "Remover dos favoritos".
interface DeckCompleteProps { category: Category; onReshuffle(): void; onChooseAnother(): void }
interface FavoriteListItemProps { question: Question; category: Category; onRemove(): void }
interface EmptyStateProps { title: string; message: string }
```

Interaction guarantees of `SwipeCard` (verified by quickstart and tests):

- Tap toggles face; pan below threshold springs back without calling `onDiscard`.
- `onDiscard` fires exactly once per card; gestures are ignored while a flip/exit animation runs.
- The favorite button lives outside `SwipeCard`, so pressing it never flips or discards; tapping
  the on-card star indicator counts as a tap on the card (flip).
- Accessibility actions `activate` (virar), `favorite` (favoritar), `skip` (pular) map to
  `onFlip`, `onToggleFavorite`, `onDiscard('right')`.
