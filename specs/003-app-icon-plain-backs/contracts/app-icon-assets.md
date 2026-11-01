# Contract: App icon assets

Produced by `node scripts/generate-icons.ts` from the parameters in
[data-model.md](../data-model.md#iconsymbol-scriptsiconsymbolts-build-time-only). Consumed by
`app.json` at build time.

## Files

| File | Size | PNG color type | Background | Symbol fit | Consumer (`app.json`) |
|---|---|---|---|---|---|
| `Assets/app/icon-source.svg` | viewBox `0 0 1024 1024` | n/a (SVG) | `#16131C` rect | bbox 60% | none (editable master, FR-013) |
| `Assets/app/icon.png` | 1024×1024 | RGB, no alpha | `#16131C` | bbox 60% | `expo.icon` |
| `Assets/app/android-icon-foreground.png` | 1024×1024 | RGBA | transparent | max radius ≤ 0.30 × size | `android.adaptiveIcon.foregroundImage` |
| `Assets/app/android-icon-monochrome.png` | 1024×1024 | RGBA, white only | transparent | same as foreground | `android.adaptiveIcon.monochromeImage` |
| `Assets/app/favicon.png` | 48×48 | RGB, no alpha | `#16131C` | bbox 70% | `web.favicon` |
| `Assets/app/splash-icon.png` | 1024×1024 | RGBA | transparent | bbox 100% (margin = stroke) | `expo-splash-screen` `image` |
| ~~`Assets/app/android-icon-background.png`~~ | | | | | **deleted**; replaced by `adaptiveIcon.backgroundColor` |

## `app.json` changes

```jsonc
"android": { "adaptiveIcon": {
  "backgroundColor": "#16131C",               // unchanged
  "foregroundImage": "./Assets/app/android-icon-foreground.png",
  // "backgroundImage" removed
  "monochromeImage": "./Assets/app/android-icon-monochrome.png" } },
"plugins": [["expo-splash-screen", { "image": "./Assets/app/splash-icon.png",
  "imageWidth": 128, "resizeMode": "contain", "backgroundColor": "#16131C" }]]
```

## Invariants (asserted by tests)

- Colors used: exactly `#16131C`, `#F7F0E3`, `#FF6B4A` in color variants (plus anti-aliased
  blends); white + alpha only in monochrome.
- The colors match `tokens.colors.appBackground` / `tokens.colors.cream`.
- Contrast: accent vs background ≥ 4.5; outline vs background ≥ 7; accent vs outline ≥ 2.2.
- Foreground/monochrome: every non-transparent pixel lies within radius `0.3056 × size` of the
  center (Android 66/108 dp safe zone).
- Opaque variants have no alpha channel; corner pixel of `icon.png` = `#16131C`.
- Center pixel of the symbol's intersection = accent in color variants (fill present).
- No text is drawn (the SVG contains no `<text>` element).
