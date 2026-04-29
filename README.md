# CrypticForge

CrypticForge is a frontend-only cryptic clue trainer that teaches clue mechanics one puzzle at a time.

## Features

- Manually curated puzzle bank in `src/data/manualPuzzles.ts`
- Only puzzles with `approved: true` are playable
- Difficulty levels: `Very Easy`, `Easy`, `Medium`, `Hard`, `Very Hard`
- `Very Hard` can combine two clue mechanisms in one puzzle (shown as `Type + Secondary Type`)
- Type filter: `All Types` plus clue categories
- Pre-reveal gameplay shows only clue info, hint flow, and answer input
- Post-reveal breakdown shows answer, explanation, definition, wordplay, fodder, and indicator
- Local data only, no server required

## Manual Curation Workflow

1. Open `src/data/manualPuzzles.ts`.
2. Copy an existing puzzle object as a template.
3. Fill all required fields.
4. Set `approved: false` while drafting.
5. Set `approved: true` only after you review clue fairness and leakage.

The app intentionally avoids AI/API generation for now so puzzle quality stays controlled and answer leakage is easier to prevent.

## Difficulty Guide

- Very Easy: Tutorial-style clues for beginners.
- Easy: Simple one-step clues.
- Medium: Slightly more disguised one-step clues.
- Hard: More polished clues or light two-step logic.
- Very Hard: Layered clues using multiple mechanisms.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Project Structure

```text
src/
  components/
    DifficultySelector.tsx
    PuzzleCard.tsx
    HintBox.tsx
  data/
    manualPuzzles.ts
    generatedPuzzles.ts (legacy, unused by runtime)
  types/
    puzzle.ts
  utils/
    puzzleValidator.ts
    puzzleUtils.ts
  App.tsx
  main.tsx
  index.css
```

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Deploy to Vercel (Free)

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Keep default Vite settings.
4. Deploy.

## Frontend-Only Note

This app does **not** require:

- backend
- database
- login/authentication
- paid APIs
- AI generation services

It is a static frontend app and is free to host on Vercel.
