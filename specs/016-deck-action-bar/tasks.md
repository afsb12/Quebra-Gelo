# Tasks: Tela de Jogo com Barra de Ações

**Input**: `/specs/016-deck-action-bar/` · **Tests**: included (component + screen tests).

## Phase 1: Setup

No setup needed.

## Phase 2: Foundational

- [ ] T001 Add strings in `src/i18n/strings.ts`: `deck.counter(index,total)` "<index> / <total>", `deck.swipeHint` "Dica: você também pode deslizar a carta", `deck.previous` "Anterior", `deck.next` "Próxima", `deck.previousLabel` "Carta anterior", `deck.nextLabel` "Próxima carta"
- [ ] T002 Add `progressColor(color, background = tokens.colors.appBackground)` to `src/theme/color.ts` (color if contrast ≥ 3:1, else HSL lightness +0.01 steps until ≥ 3:1; fallback `iceBlue`) with tests in `src/theme/__tests__/color.test.ts` (Profundo `#3D3FA6` gets lightened to ≥ 3:1; Descontraído `#F5C230` unchanged)
- [ ] T003 `src/components/SwipeCard.tsx`: export `SwipeCardHandle`, accept `ref?: Ref<SwipeCardHandle>`, `useImperativeHandle` → `swipe(direction)`: no-op while `isAnimating` or for 'right' without `canGoBack`; else same exit path as the gesture (`onSwipeConfirmed`, timing/fade, `onDiscard` on finish); test in `src/components/__tests__/SwipeCard.test.tsx`

## Phase 3: User Story 1 - Avançar e voltar com botões (P1) 🎯 MVP

- [ ] T004 [P] [US1] Create `src/components/DeckActionBar.tsx` per contracts (76×64 side buttons with chevron icon + label, `FavoriteButton` in the middle with `flex-1`, disabled state with opacity 0.4 and `accessibilityState`), test `src/components/__tests__/DeckActionBar.test.tsx`
- [ ] T005 [US1] `src/screens/DeckScreen.tsx`: `useRef<SwipeCardHandle>`; render `DeckActionBar` (onNext → `swipe('left')`, onPrevious → `swipe('right')`); remove the old favorite row; update `src/screens/__tests__/DeckScreen.test.tsx` (Próxima/Anterior flow, haptic on button)

## Phase 4: User Story 2 - Saber quanto falta (P2)

- [ ] T006 [P] [US2] Create `src/components/DeckProgress.tsx` (4 pt track `#2C2738`, fill width index/total in `color`, `accessibilityRole="progressbar"` with value) and `src/components/DeckStack.tsx` (StyleSheet; count 0–2 static faces; `pointerEvents="none"`, hidden from accessibility) with tests
- [ ] T007 [US2] `src/screens/DeckScreen.tsx`: header right counter `deck.counter` with `accessibilityLabel` = `deck.position(...)`; `DeckProgress` under the header (color = `progressColor(category color)` or `iceBlue` in the mix); `DeckStack` behind `SwipeCard` (count = min(2, total − index); color = category color or `surface` in the mix); `DECK_RESERVED_HEIGHT` 214 in `src/theme/geometry.ts`; switch DeckScreen tests from `getByText('Carta n de N')` to `getByLabelText`

## Phase 5: User Story 3 - Dica que não cansa (P3)

- [ ] T008 [US3] `src/screens/DeckScreen.tsx`: `shownCount` state (+1 on each discard); hint row = [spacer][HintLine with `deck.swipeHint` while `shownCount ≤ 3`, else empty][ChangeMoodButton in the mix]; update tests (hint on cards 1–3, gone on 4; toast unchanged)

## Phase 6: Polish

- [ ] T009 Run `npm run typecheck`, `npm run lint`, `npm test` (incl. `textFit` at 320×568); fix failures
- [ ] T010 Run `graphify update .`

## Dependencies

T001–T003 → stories; T005 → T007 → T008 (same screen file); T004 and T006 parallel.
