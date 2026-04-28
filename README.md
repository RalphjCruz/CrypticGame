# CrypticForge

CrypticForge is a small frontend-only cryptic puzzle generator game. Choose a difficulty, generate a puzzle, then reveal hints and explanations to learn how the clue works.

## Features

- Difficulty selection: `Easy`, `Medium`, `Hard`
- Generate random cryptic puzzles from local TypeScript data
- Puzzle types included:
  - `Anagram`
  - `Hidden Word`
  - `Double Meaning`
- `Show Hint` and `Reveal Answer` flow
- Beginner-friendly explanation for each puzzle
- `Generate Another` option
- Prevents the same puzzle from appearing twice in a row (when possible)
- Responsive pastel UI built for desktop and mobile

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
    puzzles.ts
  types/
    puzzle.ts
  utils/
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

1. Push this project to GitHub.
2. Go to [Vercel](https://vercel.com/) and sign in.
3. Click **Add New Project** and import your GitHub repo.
4. Keep default settings (Framework: Vite).
5. Click **Deploy**.

Vercel will build the app as a static frontend and give you a shareable URL.

## Free Hosting Note

This app does **not** require:

- backend
- database
- login or authentication
- API keys
- paid services

It is a static frontend MVP and works with free hosting on Vercel.
