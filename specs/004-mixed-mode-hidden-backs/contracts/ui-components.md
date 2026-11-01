# UI Contracts (004)

All components live in `src/components`, are prop-driven and never touch stores or navigation.

## Route

`/deck/[deckId]` — `deckId` is a `DeckId`; anything else redirects to `/`.
Home pushes `{ pathname: '/deck/[deckId]', params: { deckId } }`.

## BrandSymbol (new)

```ts
interface BrandSymbolProps { size: number }
```
Square SVG of the app symbol (`BRAND_SYMBOL`), transparent background. `testID="brand-symbol"`.

## BrandCardBack (new, StyleSheet)

```ts
interface BrandCardBackProps { width: number; height?: number; variant: 'full' | 'mini' | 'wide'; children?: ReactNode }
```
- Cream frame, `appBackground` face, vignette, rounded corners like `CardBack`.
- `full`/`mini`: symbol centered (46 % of width), 5:7 ratio by default. No text.
- `wide`: requires `height`; renders `children` (caller lays out symbol + text) — Home only.
- `testID="brand-card-back"`. Accepts **no** category/question data.

## CategoryBadge (new, StyleSheet)

```ts
interface CategoryBadgeProps { category: Category; visual: CategoryVisual }
```
Pill: background `visual.color`, icon `visual.icon` + `category.title` in `visual.onColor`.
`testID="category-badge"`, accessibility label = category title.

## CardFront (changed)

`+ showOriginBadge?: boolean` (default `false`). When true, `CategoryBadge` is rendered centered
in the top row between the corner icon and the favorite star; nothing else changes.

## SwipeCard (changed)

`+ mode?: 'category' | 'mixed'` (default `'category'`).
- `mixed`: back = `BrandCardBack`; face-down label = `strings.card.faceDownMixedLabel`; face-up
  label = `${category.title}: ${question.text}`; front with `showOriginBadge`.
- `category`: unchanged.

## DeckComplete (changed)

```ts
interface DeckCompleteVisual { color: string; onColor: string; icon: string }
interface DeckCompleteProps { deckTitle: string; visual: DeckCompleteVisual; onReshuffle(): void; onChooseAnother(): void }
```
`CategoryVisual` satisfies `DeckCompleteVisual`.

## MixedHeroCard (new)

```ts
interface MixedHeroCardProps { width: number; onPress: () => void }
```
Full-width `Pressable` (`testID="mixed-hero-card"`, role button, label "Tudo Misturado. Todas as
categorias num só baralho.") with a `wide` `BrandCardBack`: symbol on the left, title + short
description on the right.
