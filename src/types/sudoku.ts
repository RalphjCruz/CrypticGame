export type SudokuDifficulty = "Easy" | "Medium" | "Hard";

export interface SudokuPuzzle {
  id: number;
  difficulty: SudokuDifficulty;
  puzzle: string[];
  solution: string[];
  approved: boolean;
}
