# Data Model: Ícone de Brinde de Chope para o Happy Hour

## Category (`src/data/types.ts`, `data.json`): **amends 001/002**

| Field | Change |
|---|---|
| `icon: string` | Now a MaterialCommunityIcons glyph name **or** a key of `CUSTOM_ICONS`. Happy Hour: `glass-cocktail` → `beer-toast`. Every other category unchanged. |

## CustomIcon (`src/theme/customIcons.ts`): **new**

```text
CUSTOM_ICONS: {
  'beer-toast': {
    paths: string[]            // drawn as-is (clink marks)
    mirrored?: { path: string; transform: string }  // drawn once as-is and once mirrored
  }
}
CustomIconName = keyof typeof CUSTOM_ICONS
isCustomIcon(name: string): name is CustomIconName
```

Geometry (24×24 box, stroke only):

- clink marks: `M12 1.5v2.5M8.8 2.6l1 1.6M15.2 2.6l-1 1.6`
- mug: `M4 9h7v10a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 014 19zM4 11.5H2.5v4H4M4 9c0-1.5 1.2-2.4 2.3-1.8.6-1 2.2-1 2.8 0 1.1-.4 1.9.6 1.9 1.8M7.5 12v5`,
  tilted `rotate(14 7.5 14)`, drawn again inside `translate(24 0) scale(-1 1)`

## Validation rules

- A custom icon name MUST NOT also be a MaterialCommunityIcons glyph name (no ambiguity).
- Every category `icon` MUST be in the glyph map or in `CUSTOM_ICONS` (content test 4).
- Category colors (`color`, `CATEGORY_INK`) are unchanged.
