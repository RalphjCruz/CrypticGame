import type { Difficulty } from "./puzzle";
import type { SudokuDifficulty } from "./sudoku";

export interface CrypticDashboardEntry {
  id: string;
  timestamp: number;
  puzzleId: number;
  clue: string;
  difficulty: Difficulty;
  guess: string;
  correct: boolean;
}

export interface SudokuDashboardEntry {
  id: string;
  timestamp: number;
  puzzleId: number;
  difficulty: SudokuDifficulty;
  submittedCount: number;
  wrongCount: number;
  solved: boolean;
  elapsedSeconds: number;
}

export interface DashboardData {
  crypticEntries: CrypticDashboardEntry[];
  sudokuEntries: SudokuDashboardEntry[];
  crypticCompletedPuzzleIds: number[];
  sudokuCompletedPuzzleIds: number[];
}

export interface DraftData {
  crypticAnswerDraft: string;
}
