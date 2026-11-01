# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Quebra-Gelo is an icebreaker card game ("jogo de cartas focado em quebrar-gelo, criar conexões,
batendo um papo e refletindo um pouco sobre a vida"). It is a native mobile app built with
React Native + Expo (Managed Workflow) and TypeScript. All user-facing text and card content is
Brazilian Portuguese (pt-BR).

Work as a senior mobile engineer specializing in React Native, Expo, TypeScript and fluid
animations (Reanimated/Gesture Handler), favoring clean, modular, maintainable code.

## Current state

No application code exists yet: no `package.json`, so there are no build/lint/test commands.
When the Expo project is scaffolded, add its commands here (dev server, `tsc --noEmit`, lint,
`jest`, and how to run a single test).

`Assets/modelos cards.webp` is a photo of a commercial card game used **only** as a physical
format reference. Never copy its text, category names, layout or branding.

## Spec-driven workflow (Spec Kit)

Features are developed through the Spec Kit skills in `.claude/skills/`:
`/speckit-specify` → `/speckit-clarify` (optional) → `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement` (plus `/speckit-analyze`, `/speckit-checklist`, `/speckit-converge`).

- `.specify/memory/constitution.md` is the governing document and overrides other practices.
  Every `plan.md` must include a Constitution Check against it. Amend it only via
  `/speckit-constitution`.
- `.specify/templates/` holds the spec/plan/tasks templates; `.specify/scripts/powershell/`
  holds the helper scripts the skills call (the environment is Windows/PowerShell).

## Non-negotiables from the constitution

- **Zero friction:** no login, account or backend; all cards bundled in the app; fully offline
  from first launch; no collection of personal data or third-party tracking.
- **Tactile immersion:** card gestures use Gesture Handler + Reanimated with physics, running on
  the UI thread (worklets/shared values, no per-frame `setState`); flipping and discarding a card
  must trigger `expo-haptics` feedback; simplify animations under reduced motion.
- **Strict typing:** `"strict": true`, zero `any` (`@typescript-eslint/no-explicit-any` as error;
  use `unknown` + narrowing); domain types, props, stores and navigation params explicitly typed.
- **Stack:** Expo Managed Workflow only (no eject); NativeWind by default, `StyleSheet` allowed in
  performance-critical animated components but never mixed within one component; Zustand for
  state, with `persist` over AsyncStorage for data that must survive restarts (favorites); deck
  progress is in memory only (resets when the app closes).

## Architecture (three layers, dependencies flow top-down only)

- **Data** (`src/data`, `src/store`, `src/hooks`): card JSON, domain types, Zustand stores and
  hooks. The only layer allowed to touch the JSON or AsyncStorage. Business rules (drawing cards,
  filtering by category, tracking seen cards) live here as pure functions/hooks testable without
  rendering.
- **UI** (`src/components`): dumb components driven purely by props; no stores, data hooks,
  navigation or business logic; must not import from `src/screens` or `src/store`.
- **Screens** (`src/screens` or routes): containers wiring hooks/stores to UI components and
  handling navigation.

## Game and content rules

- One card at a time; no scoreboard, mandatory timer, ads or notifications.
- Deck is organized into thematic categories with no required order. Each card has a unique,
  stable ID and exactly one category; each category has a name, short description and own visual
  identity.
- A card must not repeat within a session until all cards in the selected categories have been
  shown; any card can be skipped.
- Questions must be original, welcoming and inclusive (no assumptions about gender, orientation,
  religion, marital status, finances or family structure). UI strings are centralized for future
  translation.
- Card JSON must be validated by an automated test (required fields, unique IDs, existing
  category, max text length).

Merge gates for `main`: `tsc --noEmit`, ESLint clean, tests passing, content validation passing.
Commits follow Conventional Commits (`feat:`, `fix:`, `content:`, `docs:`).
