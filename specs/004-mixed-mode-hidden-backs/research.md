# Research: Modo "Tudo Misturado" (004)

## R1 — How to model the mixed deck

- **Decision**: a `DeckId = CategoryId | 'mixed'` union (`MIXED_DECK_ID = 'mixed'`). The progress
  store, `useDeck` and the route are keyed by `DeckId`; `getDeckQuestionIds(deckId)` returns the
  category's questions or, for `'mixed'`, all questions. Shuffling stays in `createDeck`
  (Fisher–Yates, already tested).
- **Rationale**: one code path for all decks (resume, discard, reshuffle, end of deck) and the
  "no repeat until all shown" rule is inherited for free. The mixed deck's progress is
  independent from each category's (separate key), as the spec requires.
- **Alternatives**: a separate `useMixedDeck`/store (duplicated logic); merging the per-category
  decks round-robin (not random, complicates resume).

## R2 — Route

- **Decision**: rename `src/app/deck/[categoryId].tsx` to `src/app/deck/[deckId].tsx`; validate
  with `isDeckId` and redirect home otherwise.
- **Rationale**: the mixed deck is a deck like any other; one screen, one route. The param name
  matches what it carries.
- **Alternatives**: a separate `/mixed` route (second screen wiring the same components).

## R3 — Neutral brand back

- **Decision**: `BrandCardBack` keeps the cream outer frame and rounded corners of `CardBack`, but
  its face is `tokens.colors.appBackground` with the 003 symbol centered (`BrandSymbol`, 4 SVG
  nodes: clip path, accent rect, two outline rects) at ~46 % of the card width and a subtle
  vignette. No text, no category data in props. Variants: `full` (deck), `mini` (half frame),
  `wide` (horizontal hero on Home, symbol smaller and left-aligned by the caller).
- **Symbol params**: copied into `src/theme/brand.ts` (`BRAND_SYMBOL`) because app code must not
  import from `scripts/`; a test asserts they equal `SYMBOL` from `scripts/icon/symbol.ts`, so the
  icon and the card back cannot drift apart.
- **Alternatives**: a bundled PNG of the icon (blurry when scaled, another asset to regenerate);
  importing `scripts/icon/symbol.ts` from `src/` (breaks the layer boundary and Metro would bundle
  the generator module).

## R4 — Badge style and placement

- **Decision**: `CategoryBadge`: a pill with background = the category `color` from the content,
  icon (`category.icon`, 14 pt) + title (body font, 12 pt, 1 line, `adjustsFontSizeToFit`,
  `maxFontSizeMultiplier` 1.3) in `visual.onColor`. Placed in the existing top row of the front,
  centered between the corner icon (left) and the favorite star slot (right), with `flexShrink`
  so it never overlaps them; the question area is below the top row, so it can't overlap the
  question either.
- **Rationale**: uses exactly the `icon` + `color` of the content as asked; `color`/`onColor`
  contrast is already validated by `categoryVisual` tests (it's the back's pair). Reusing the top
  row keeps `faceTextBox`/`questionFit` unchanged, so long questions still fit (FR-014).
- **Alternatives**: outlined pill in `ink` (doesn't use the content color); badge in the footer
  (clarification Q1 chose the top); a new row above the question (reduces the text box for all
  questions).

## R5 — No leaks while face down

- **Decision**: `SwipeCard` gets `mode: 'category' | 'mixed'`. In mixed mode it renders
  `BrandCardBack`, its face-down a11y label is `strings.card.faceDownMixedLabel` ("Carta do
  Quebra-Gelo, virada para baixo") and the face-up label is "{categoria}: {pergunta}". The deck
  header shows "Tudo Misturado" and the position counter only. Each card mounts face down
  (`key={question.id}`, rotation 0, front at opacity 0), so the next card never shows its front
  during the discard transition (existing behavior, now covered by a test on the face-down label).
- **Alternatives**: delaying the front render until the flip (would cost a frame at 90° and risks
  a visible pop).

## R6 — End of deck and visuals without a category

- **Decision**: `DeckComplete` takes `deckTitle` + a small `DeckCompleteVisual` (`color`,
  `onColor`, `icon`) instead of `Category`/`CategoryVisual`. Category decks pass their visual;
  mixed passes `MIXED_VISUAL` (surface `#221E2B`, cream text, `shuffle-variant` icon).
- **Rationale**: the component stays dumb and works for both; no fake "mixed category" object.

## R7 — Home hero card

- **Decision**: `MixedHeroCard` (UI): full-width `Pressable` above the grid with a `wide`
  `BrandCardBack` (height ≈ 0.42 × width) whose content slot shows the symbol on the left and,
  on the right, "Tudo Misturado" (display font) + "Todas as categorias num só baralho." It calls
  `onPress()`; `HomeScreen` routes to `/deck/mixed`.
- **Rationale**: clarification Q3; 1 tap to the first card (SC-003).
