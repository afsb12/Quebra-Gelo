# UI Contracts (006)

## MixFilterSheet (new, NativeWind)

```ts
interface MixFilterOption { category: Category; visual: CategoryVisual }
interface MixFilterSheetProps {
  visible: boolean;
  options: readonly MixFilterOption[];   // Home order
  selected: readonly CategoryId[];
  canSave: boolean;
  onToggle: (id: CategoryId) => void;
  onSave: () => void;
  onClose: () => void;                   // discard: backdrop, Android back
}
```

- Nothing rendered when `visible` is false. `Modal` `testID="mix-filter-sheet"`, slide (none on reduced motion).
- Backdrop `testID="mix-filter-backdrop"` → `onClose`.
- Title "Categorias da mistura" (header role).
- Row per option: `testID="mix-filter-row-{id}"`, icon in `visual.color`, title, `Switch`
  (`testID="mix-filter-switch-{id}"`, `value = selected.includes(id)`, label = title) → `onToggle(id)`.
- When `!canSave`: `testID="mix-filter-minimum"` "Escolha pelo menos 2 categorias".
- "Salvar" `testID="mix-filter-save"`, `disabled={!canSave}`, `accessibilityState.disabled` → `onSave`.

## MixedHeroCard (changed)

`+ onOpenFilter: () => void`, `+ summary?: string`.

- Filter button `testID="mix-filter-button"`, label "Escolher categorias da mistura", icon
  `filter-variant` in `tokens.colors.iceBlue`, top right; press → `onOpenFilter` only.
- `summary` (e.g. "6 de 8 categorias") shown under the description when provided (`testID="mix-filter-summary"`).
- Hero body press → `onPress` only.

## HomeScreen

Owns `sheetOpen` and `draft`; opening copies `useMixCategories()` into `draft`; `canSave =
isValidMixSelection(draft)`; save → `useMixFilterStore.getState().save(draft)` then close.
