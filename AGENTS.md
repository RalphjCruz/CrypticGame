# AGENTS.md

## Project Name

CrypticForge

## Project Goal

Build a simple frontend-only cryptic puzzle generator game.

The first version must be small, free to host, easy to use, and suitable for sharing with a friend through a public Vercel link.

## Hard Rules

Do NOT add:
- Backend
- Database
- Authentication
- Login/register pages
- OpenAI API
- Paid APIs
- Serverless functions
- Payments
- Subscriptions
- Leaderboards
- Daily challenges
- User accounts
- Admin panels
- Complex state management libraries

This must be a static React/Vite frontend app only.

## Tech Stack

Use:
- React
- TypeScript
- Vite
- Tailwind CSS

## Hosting Requirement

The app must be deployable as a free static site on Vercel.

Keep it suitable for Vercel Hobby/free personal usage.

Vercel Hobby supports personal projects and has a free plan, but this project should avoid serverless functions, paid APIs, and unnecessary usage-heavy features.

## Main Feature

Build only one game feature first:

The user chooses a difficulty and generates a cryptic puzzle.

The generated puzzle should include:
- Clue
- Difficulty
- Puzzle type
- Hint
- Reveal answer button
- Answer
- Explanation

## Puzzle Types

For version 1, only include:
- Anagram
- Hidden Word
- Double Meaning

## Difficulty Levels

Only include:
- Easy
- Medium
- Hard

No Expert difficulty yet.

## Data Source

Use a local TypeScript file:

src/data/puzzles.ts

Do not fetch puzzles from an API.

The app should work fully offline after being loaded.

## Code Quality Rules

- Keep files small.
- Use clear TypeScript types.
- Use reusable components.
- Avoid massive App.tsx logic.
- Avoid messy CSS.
- Use Tailwind utility classes.
- Do not over-engineer.
- Do not introduce unnecessary dependencies.
- Keep the UI clean, modern, and mobile responsive.

## Required Project Structure

Use this structure:

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

## Behaviour Rules

- The answer must not show immediately.
- The explanation must not show until the answer is revealed.
- The hint should only show after the user clicks “Show Hint”.
- Generating a new puzzle resets hint visibility and answer visibility.
- Avoid showing the same puzzle twice in a row.
- If no puzzle exists for a selected difficulty, show a friendly error.
- Keep all puzzle selection logic in utils/puzzleUtils.ts.

## README Rules

Create a README.md that explains:
- What the app is
- Features
- Tech stack
- How to install
- How to run locally
- How to build
- How to deploy to Vercel
- That the app does not require payments, APIs, backend, or database

## Final Response Required From Codex

After implementation, summarize:
- What was built
- Files created/edited
- How to run the app
- How to deploy it
- Any errors fixed
- What the next feature should be

## Future Flexibility

The current version must stay simple and frontend-only, but the code should not be throwaway.

Do not implement future features yet, but structure the code so these can be added later:

- AI generation
- Backend API
- Database storage
- Saved puzzles
- Puzzle ratings
- More puzzle types
- Daily challenge
- Shareable links
- User accounts

Use clean boundaries:
- Data lives in src/data
- Types live in src/types
- Puzzle logic lives in src/utils
- UI components live in src/components
- App.tsx should only coordinate state and layout

The app should work now with local data, but the code should make it easy to replace local data with an API later.