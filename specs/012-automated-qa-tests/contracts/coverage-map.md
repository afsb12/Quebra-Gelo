# Contract: Core Rule → Test Coverage Map (012, FR-018)

Status: **planned** — `(new)` rows are added by `/speckit-implement`; the final names are confirmed
there. Existing tests are reused (FR-020).

| Rule | Behaviour | Test file | Test(s) |
|------|-----------|-----------|---------|
| FR-006 | Shuffle keeps every element once, does not mutate input | `src/data/__tests__/deck.test.ts` | `shuffle › returns a permutation and does not mutate the input` |
| FR-006 | Shuffle order varies across random sources | `src/data/__tests__/deck.test.ts` | (new) `shuffle › reorders: seeded runs differ from the input order (012)` |
| FR-007 | Mixed mode uses only active categories | `src/data/__tests__/mixFilter.test.ts`, `src/store/__tests__/progress.test.ts`, `src/screens/__tests__/DeckScreen.test.tsx` | `active = all minus excluded…`, `a filtered mixed deck only has the chosen categories…`, `only deals questions of the chosen categories…` |
| FR-007 | Fewer than 2 categories is rejected | `src/data/__tests__/mixFilter.test.ts`, `src/store/__tests__/mixFilter.test.ts` | `needs at least 2 categories`, `rejects fewer than 2 categories and changes nothing` |
| FR-008 | Advance +1 / back −1 / no back on first card | `src/data/__tests__/deck.test.ts`, `src/store/__tests__/progress.test.ts` | `advance moves the cursor…`, `goBack on the first card returns the same object`, `goBack moves the cursor…`, `goBack is a no-op … on the first card` |
| FR-009 | Favorite / unfavorite updates global state | `src/store/__tests__/favorites.test.ts` | `toggle adds then removes a favorite with savedAt` |
| FR-010 | Closing the tutorial saves "seen" | `src/store/__tests__/onboarding.test.ts`, `src/screens/__tests__/HomeScreen.test.tsx` | `markSeen persists the flag…`, `"Pular" hides it, remembers it, and a deck is then one tap away` (asserts the stored flag) |
| FR-010 | Saved "seen" hides the tutorial on next launch | `src/store/__tests__/onboarding.test.ts`, `src/screens/__tests__/HomeScreen.test.tsx` | `a stored "seen" flag … hides it on the next launch`, (new) `a launch after closing it reads the stored flag and does not show the tutorial (012)` |
| FR-011 | Mix filter saved and restored | `src/store/__tests__/mixFilter.test.ts` | `a valid save persists…`, `rehydrates the saved filter on the next launch` |
| FR-012 | Mixed card starts on the brand back, tap reveals question + origin badge | `src/screens/__tests__/DeckScreen.test.tsx` | `the face-down card shows the brand back…`, (new) `tapping the card reveals the question and its origin badge (012)` |
| FR-013 | Left drag past threshold discards and advances | `src/screens/__tests__/DeckScreen.test.tsx`, `src/components/__tests__/SwipeCard.test.tsx` | (new) gesture tests `(012)` |
| FR-013 | Right drag past threshold brings back the previous card | same | (new) gesture tests `(012)` |
| FR-013 | Drag below threshold changes nothing | same | (new) gesture tests `(012)` |
| FR-013 | Release decision (pure) | `src/components/__tests__/SwipeCard.test.tsx` | (new) `resolveSwipeRelease … (012)` |
| FR-014 | Haptic once: tap, left swipe, right swipe, reshuffle; none on snap-back | `src/screens/__tests__/DeckScreen.test.tsx` | (new) `haptics (012)` block + existing reshuffle `vibrates with the success pattern` |
