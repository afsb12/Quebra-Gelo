# Quickstart & Validation: Quebra-Gelo MVP

How to run the app and prove the feature works end-to-end. Interfaces:
[contracts/app-interfaces.md](./contracts/app-interfaces.md); content rules:
[contracts/content-schema.md](./contracts/content-schema.md).

## Prerequisites

- Node.js LTS and npm.
- Expo Go on an Android/iOS phone **or** an Android emulator / iOS simulator.
  Haptics and gesture feel MUST be validated on a physical phone.

## Setup and commands

```bash
npm install
npx expo start            # dev server; press a / i, or scan the QR code with Expo Go
npm run typecheck         # tsc --noEmit
npm run lint              # ESLint (no-explicit-any = error)
npm test                  # Jest (unit + component + content validation)
npx jest src/data/__tests__/deck.test.ts          # single test file
npx jest -t "não repete perguntas"                # single test by name
```

Merge gate: `typecheck`, `lint` and `test` all green.

## Automated validation

| Check                                   | Covers                    |
|-----------------------------------------|---------------------------|
| `content.test.ts` (10 schema rules)     | FR-001–FR-004             |
| `deck.test.ts` (shuffle, advance, no repeats) | FR-015, FR-016, SC-004 |
| `favorites.test.ts` (persist + rehydrate), `progress.test.ts` (in-memory resume, reshuffle) | FR-016, FR-021, SC-005 |
| Component tests (tiles, favorites list, empty state, completion) | FR-006, FR-017, FR-022, FR-023 |

## Manual scenarios (physical phone, airplane mode ON before first launch)

1. **Home (US2)** — open app: 8 categories in a grid with icon, color, name, description; on a
   small phone everything is readable by scrolling. App reaches Home in ≤ 2 s (SC-007), measured
   on a preview/release build (Expo Go and dev builds are slower and don't count); the splash
   waits for fonts + favorites hydration, so if it exceeds 2 s, check font loading first.
2. **Play (US1)** — tap "Descontraído": a face-down card with the category identity appears.
   Tap → card flips, question shown, light vibration. Tap again → flips back.
3. **Swipe** — drag slightly and release → card springs back, no vibration. Drag past ~⅓ of the
   screen (or flick) left, then right → card flies off in that direction, stronger vibration, next
   card appears face down. Swipe also works on a face-down card.
4. **Rapid gestures** — tap and flick repeatedly fast: never skips two cards or shows a broken
   half-flipped state.
5. **No repeats + completion** — play a whole category: 20 distinct questions, then the
   completion screen; "Embaralhar de novo" restarts in a new order; "Escolher outra categoria"
   returns Home.
6. **Resume** — mid-deck, go back Home (and send the app to background), reopen the same
   category: continues with unseen cards only. Then kill the app and reopen the category: a fresh
   shuffled deck starts.
7. **Favorites (US3)** — with the card face down the star button below it is disabled. Reveal
   the card and tap the star button: it fills, the card shows a star indicator and does not
   flip/discard. Tap again: both clear. Favorite 3 questions from 2 categories, kill and reopen app, open Favorites
   from Home: 3 items, newest first, with category name/color; remove one. Remove all → friendly
   empty state.
8. **Reduced motion** — enable OS reduce motion: flip/discard become simple fades, vibration still
   happens.
9. **Screen reader** — with TalkBack/VoiceOver, flip, favorite and skip a card using the card's
   actions only.
10. **Performance** — with the performance monitor on, flip and swipe stay at ~60 fps on a
    mid-range Android phone (SC-003).
