import { puzzles } from "../data/puzzles";
import type { Difficulty, Puzzle } from "../types/puzzle";

export const getPuzzlesByDifficulty = (difficulty: Difficulty): Puzzle[] => {
  return puzzles.filter((puzzle) => puzzle.difficulty === difficulty);
};

interface RandomPuzzleOptions {
  difficulty: Difficulty;
  previousPuzzleId?: number | null;
}

export const getRandomPuzzle = ({
  difficulty,
  previousPuzzleId,
}: RandomPuzzleOptions): Puzzle | null => {
  const pool = getPuzzlesByDifficulty(difficulty);

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
