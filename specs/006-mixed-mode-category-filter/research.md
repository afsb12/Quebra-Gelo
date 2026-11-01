# Research: Mixed-mode category filter (006)

## R1 — What to persist

- **Decision**: persist the **excluded** category IDs (`excluded: CategoryId[]`), not the included ones.
- **Rationale**: a category added by an app update is automatically on (FR-014) and removed
  categories are simply dropped by `sanitizeExcluded`; the default (`[]`) means "all on".
- **Alternatives**: persisting the active list (new categories would be off by default) or a
  `Record<CategoryId, boolean>` (same problem plus a migration for every new category).

## R2 — Validity and fallback

- **Decision**: `MIN_MIX_CATEGORIES = 2`. `save(active)` returns `false` and changes nothing when
  invalid. On rehydrate, unknown IDs are dropped; if fewer than 2 categories would remain active,
  the filter resets to all on (FR-013). Read errors → all on (default state).
- **Rationale**: the minimum holds in storage, in the UI ("Salvar" disabled) and when building the
  deck, so the mixed deck can never start with < 2 categories (FR-009, SC-002).

## R3 — Progress when the filter changes

- **Decision**: `save` compares old and new active sets (`sameSelection`); if different it calls
  `useProgressStore.getState().resetDeck('mixed')`, so the next visit builds a fresh deck from the
  new set. Same set → progress kept (clarification Q2).
- **Rationale**: avoids mixing an old shuffled order with a new category set (would break "no
  repeats until all shown" and could show excluded categories). The store dependency is one-way
  (mixFilter → progress), so no import cycle.

## R4 — Bottom sheet without a dependency

- **Decision**: RN `Modal` (`transparent`, `animationType="slide"`, `none` under reduced motion,
  `onRequestClose` → discard), a `Pressable` backdrop that discards, and a bottom panel with a
  `ScrollView` of rows (icon in the category color, title, `Switch`), the minimum message and a
  full-width "Salvar" button (`disabled` + `accessibilityState.disabled` when invalid).
- **Rationale**: the spec only needs a partial-height panel from the bottom; `@gorhom/bottom-sheet`
  would add a dependency (constitution: new deps must be justified) for drag-to-resize we don't need.
  Swiping down to dismiss maps to the backdrop/back paths on Android; iOS users tap outside.

## R5 — Controlled sheet

- **Decision**: `HomeScreen` owns the draft (`useState<CategoryId[]>`), computes `canSave` with
  `isValidMixSelection`, and passes `selected`, `onToggle`, `canSave`, `onSave`, `onClose` to the
  sheet. The draft resets from the store every time the sheet opens.
- **Rationale**: keeps the business rule out of the UI component (constitution IV).

## R6 — Hero button

- **Decision**: a 44 pt `Pressable` (`testID="mix-filter-button"`, `filter-variant` icon in
  `#9ED8F0`, `bg-app/70` circle) absolutely positioned top-right **inside** the hero; nested
  pressables get the touch first, so it never starts the game and the hero body never opens the
  sheet. Summary text "X de 8 categorias" (ice blue) under the description when < 8.
