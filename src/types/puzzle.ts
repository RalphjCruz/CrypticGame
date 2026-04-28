export type Difficulty = "Easy" | "Medium" | "Hard";

export type PuzzleType = "Anagram" | "Hidden Word" | "Double Meaning";

export interface Puzzle {
  id: number;
  clue: string;
  answer: string;
  difficulty: Difficulty;
  type: PuzzleType;
  hint: string;
  explanation: string;
}
