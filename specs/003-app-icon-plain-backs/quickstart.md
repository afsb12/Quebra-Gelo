# Quickstart: validating 003 (app icon + plain card backs)

## Prerequisites

- `npm install` done; Node 24+ (`node --version`), so that `node` runs `.ts` scripts directly.
- Android device/emulator (the local build setup from the project memory) and, if available, an
  iPhone with Expo Go / dev build.

## 1. Gates

```bash
npm run typecheck && npm run lint && npm test
```

Expected: all green. Relevant suites: `src/components/__tests__/CardBack.test.tsx` (no pattern
shapes, vignette kept, all 8 categories × 2 variants),
`src/theme/__tests__/categoryVisual.test.ts` (no `pattern` field),
`scripts/__tests__/symbol.test.ts` (geometry, colors, safe zone) and
`scripts/__tests__/app-icons.test.ts` (generated files match
[contracts/app-icon-assets.md](./contracts/app-icon-assets.md)).

## 2. Regenerate the icons (only when the design changes)

```bash
npm run icons            # node scripts/generate-icons.ts
git status Assets/app   # regenerating with unchanged params MUST produce no diff (deterministic)
```

Open `Assets/app/icon-source.svg` and `Assets/app/icon.png`. You should see a dark tile with two
cream rounded-square outlines overlapping diagonally, the overlap filled coral, and no text.

## 3. Card backs (US1)

1. `npm start`, open the app.
2. Home: all 8 mini cards show flat category colors with the slight darker edges, icon and name,
   and no dots, rings, stripes, waves or other drawings (SC-001).
3. Enter each category: the face-down card has the same flat look. Flip it and the front is
   unchanged. Swipe/discard several cards: motion and haptics are as before (SC-006).
4. Cover the names and check that each category can still be told apart by color + icon (SC-002).

## 4. App icon (US2), needs a native build (Expo Go shows its own icon)

1. Build and install (`npm run android`, or the APK flow from the project memory).
2. Launcher: new icon, no trace of the default Expo "A" (SC-005).
3. Change the launcher's icon shape (circle / squircle / rounded square, where supported): the
   symbol is never clipped (SC-003).
4. Android 13+: enable themed icons; a single-tone version of the symbol appears.
5. Cold start: the splash shows only the symbol, centered on `#16131C`, then the home screen
   follows without a color jump (FR-011).
6. Recent apps / settings app list: the symbol is still recognizable at small size (SC-004).
