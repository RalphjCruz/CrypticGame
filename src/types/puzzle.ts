export type Difficulty =
  | "Very Easy"
  | "Easy"
  | "Medium"
  | "Hard"
  | "Very Hard";

export type PuzzleType =
  | "Anagram"
  | "Selector"
  | "Hidden Word"
  | "Reversal"
  | "Synonym"
  | "Symbol"
  | "Container"
  | "Deletion"
  | "Homophone"
  | "Double Meaning";

export interface Puzzle {
  id: number;
  clue: string;
  answer: string;
  difficulty: Difficulty;
  type: PuzzleType;
  secondaryType?: PuzzleType;
  enumeration: string;
  definition: string;
  wordplay: string;
  fodder?: string;
  indicator?: string;
  hint: string;
  explanation: string;
  approved: boolean;
}
