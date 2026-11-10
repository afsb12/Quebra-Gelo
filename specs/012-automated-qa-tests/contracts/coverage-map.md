# Contract: Core Rule → Test Coverage Map (012, FR-018)

Status: **implemented** (2026-11-08). Existing tests are reused (FR-020); new ones are marked `(012)`.
Every row was verified by a mutation that makes at least one listed test fail (quickstart §4).

| Rule | Behaviour | Test file | Test(s) |
|------|-----------|-----------|---------|
| FR-006 | Shuffle keeps every element once, does not mutate input | `src/data/__tests__/deck.test.ts` | `shuffle › returns a permutation and does not mutate the input` |
| FR-006 | Shuffle order varies across random sources | `src/data/__tests__/deck.test.ts` | `shuffle › reorders: seeded runs differ from the input order, never losing or repeating an id (012)` |
| FR-007 | Mixed mode uses only active categories | `src/data/__tests__/mixFilter.test.ts`, `src/store/__tests__/progress.test.ts`, `src/screens/__tests__/DeckScreen.test.tsx` | `active = all minus excluded, in content order`, `a filtered mixed deck only has the chosen categories; resetDeck drops it (006)`, `only deals questions of the chosen categories, each once, then ends` |
| FR-007 | Fewer than 2 categories is rejected | `src/data/__tests__/mixFilter.test.ts`, `src/store/__tests__/mixFilter.test.ts`, `src/screens/__tests__/HomeScreen.test.tsx` | `needs at least 2 categories`, `rejects fewer than 2 categories and changes nothing`, `with only 1 category on, Salvar is disabled…` |
| FR-008 | Advance +1 / back −1 / no back on first card | `src/data/__tests__/deck.test.ts`, `src/store/__tests__/progress.test.ts` | `navigation (012) › advance is +1 and goBack is −1, never below the first card`, `goBack on the first card returns the same object`, `goBack is a no-op on a missing deck and on the first card (009)` |
| FR-009 | Favorite / unfavorite updates global state | `src/store/__tests__/favorites.test.ts` | `toggle adds then removes a favorite with savedAt` |
| FR-010 | Closing the tutorial saves `hasSeenTutorial` on the device | `src/store/__tests__/onboarding.test.ts`, `src/screens/__tests__/HomeScreen.test.tsx` | `markSeen persists the flag and the tutorial version…`, `"Pular" hides it, remembers it, and a deck is then one tap away` |
| FR-010 | Saved flag hides the tutorial on the next launch | `src/store/__tests__/onboarding.test.ts`, `src/screens/__tests__/HomeScreen.test.tsx` | `a stored "seen" flag for the current tutorial hides it on the next launch`, `a launch after closing it reads the stored flag and does not show the tutorial (012)` |
| FR-011 | Mix filter saved and restored | `src/store/__tests__/mixFilter.test.ts` | `a valid save persists the excluded IDs…`, `rehydrates the saved filter on the next launch` |
| FR-012 | Mixed card starts on the brand back; tap reveals question + origin badge | `src/screens/__tests__/DeckScreen.test.tsx` | `…the face-down card shows the brand back and never names a category`, `Tudo Misturado tap reveal (012) › tapping the card reveals the question and its origin badge` |
| FR-013 | Left drag past threshold discards and advances | `src/components/__tests__/SwipeCard.test.tsx`, `src/screens/__tests__/DeckScreen.test.tsx` | `real gestures (012) › a left drag past the threshold confirms and discards to the left once`, `a left swipe discards the card and deals the next one` |
| FR-013 | Right drag past threshold brings back the previous card | same | `a right drag past the threshold goes back when there is a previous card`, `a right swipe brings the previous card back face up` |
| FR-013 | Drag below threshold / right on first card changes nothing | same | `a short drag springs back without discarding`, `a right drag on the first card springs back without discarding`, `a right swipe on the first card, or a short drag, keeps the same card` |
| FR-013 | Release decision (pure) | `src/components/__tests__/SwipeCard.test.tsx` | `resolveSwipeRelease (012)` (5 tests) |
| FR-014 | Haptic exactly once: tap, left swipe, right swipe, "Mudar o clima" (the reshuffle button since 011); none on spring-back | `src/screens/__tests__/DeckScreen.test.tsx` | `haptics fire exactly once per interaction (012)` (4 tests, incl. `change-mood button (mixed deck) → one success notification`) + 011 `deals a face-down card of another category, advances the counter and vibrates` |
