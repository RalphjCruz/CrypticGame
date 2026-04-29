import { approvedManualPuzzles, manualPuzzles } from "../data/manualPuzzles";
import type { Difficulty, Puzzle, PuzzleType } from "../types/puzzle";
import { validatePuzzle, validatePuzzleBank as validateManualPuzzleBank } from "./puzzleValidator";

export const puzzleTypes: Array<PuzzleType | "All Types"> = [
  "All Types",
  "Anagram",
  "Selector",
  "Hidden Word",
  "Reversal",
  "Synonym",
  "Symbol",
  "Container",
  "Deletion",
  "Homophone",
  "Double Meaning",
];

export const getPuzzlesByDifficulty = (difficulty: Difficulty): Puzzle[] => {
  return approvedManualPuzzles.filter((puzzle) => {
    if (puzzle.difficulty !== difficulty) {
      return false;
    }

    // Very Hard should always be layered (double mechanism).
    if (difficulty === "Very Hard") {
      return Boolean(puzzle.secondaryType);
    }

    return true;
  });
};

export const getPuzzlesByDifficultyAndType = (
  difficulty: Difficulty,
  typeFilter: PuzzleType | "All Types"
): Puzzle[] => {
  const byDifficulty = getPuzzlesByDifficulty(difficulty);
  if (typeFilter === "All Types") {
    return byDifficulty;
  }

  return byDifficulty.filter(
    (puzzle) => puzzle.type === typeFilter || puzzle.secondaryType === typeFilter
  );
};

interface RandomPuzzleOptions {
  difficulty: Difficulty;
  typeFilter: PuzzleType | "All Types";
  previousPuzzleId?: number | null;
}

export const getRandomPuzzle = ({
  difficulty,
  typeFilter,
  previousPuzzleId,
}: RandomPuzzleOptions): Puzzle | null => {
  const pool = getPuzzlesByDifficultyAndType(difficulty, typeFilter);

  if (pool.length === 0) {
    return null;
  }

  if (pool.length === 1) {
    return pool[0];
  }

  const available = pool.filter((puzzle) => puzzle.id !== previousPuzzleId);
  const randomIndex = Math.floor(Math.random() * available.length);

  return available[randomIndex] ?? null;
};

export const validatePuzzleBank = (): string[] => {
  return validateManualPuzzleBank(manualPuzzles);
};

export { validatePuzzle };
