import { approvedSudokuPuzzles, sudokuPuzzles } from "../data/sudokuPuzzles";
import type { SudokuDifficulty, SudokuPuzzle } from "../types/sudoku";

export const sudokuDifficulties: SudokuDifficulty[] = ["Easy", "Medium", "Hard"];
export type SudokuInputMode = "answer" | "temp";
export type SudokuCellEntryType = SudokuInputMode | null;
export type SudokuGrid = string[][];
export type SudokuEntryTypeGrid = SudokuCellEntryType[][];

const sudokuMaxIncorrectMap: Record<SudokuDifficulty, number> = {
  Easy: 5,
  Medium: 3,
  Hard: 1,
};

export const getSudokuPuzzlesByDifficulty = (
  difficulty: SudokuDifficulty
): SudokuPuzzle[] => {
  return approvedSudokuPuzzles.filter((puzzle) => puzzle.difficulty === difficulty);
};

interface RandomSudokuOptions {
  difficulty: SudokuDifficulty;
  previousPuzzleId?: number | null;
}

interface SudokuCell {
  row: number;
  col: number;
}

interface SudokuHintOptions {
  puzzle: SudokuPuzzle;
  grid: SudokuGrid;
}

interface SudokuHintResult {
  row: number;
  col: number;
  value: string;
}

const MIN_GIVENS_HARD = 22;

const getBoxIndex = (row: number, col: number): number => {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
};

const shuffleCells = (cells: SudokuCell[]): SudokuCell[] => {
  const copied = [...cells];
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const temp = copied[index];
    copied[index] = copied[swapIndex];
    copied[swapIndex] = temp;
  }
  return copied;
};

const applyHardVisibilityMask = (puzzle: SudokuPuzzle): SudokuPuzzle => {
  if (puzzle.difficulty !== "Hard") {
    return puzzle;
  }

  const grid = puzzle.puzzle.map((row) => row.split(""));
  const filledCells: SudokuCell[] = [];
  const rowCounts = Array(9).fill(0);
  const colCounts = Array(9).fill(0);
  const boxCounts = Array(9).fill(0);

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (grid[row][col] !== "0") {
        filledCells.push({ row, col });
        rowCounts[row] += 1;
        colCounts[col] += 1;
        boxCounts[getBoxIndex(row, col)] += 1;
      }
    }
  }

  const totalGivens = filledCells.length;
  if (totalGivens <= MIN_GIVENS_HARD) {
    return puzzle;
  }

  const desiredRemovals = Math.max(3, Math.min(6, Math.floor(totalGivens * 0.18)));
  const maxRemovals = totalGivens - MIN_GIVENS_HARD;
  const targetRemovals = Math.min(desiredRemovals, maxRemovals);

  let removed = 0;
  const shuffledCells = shuffleCells(filledCells);

  for (const cell of shuffledCells) {
    if (removed >= targetRemovals) {
      break;
    }

    const boxIndex = getBoxIndex(cell.row, cell.col);
    if (rowCounts[cell.row] <= 2 || colCounts[cell.col] <= 2 || boxCounts[boxIndex] <= 2) {
      continue;
    }

    grid[cell.row][cell.col] = "0";
    rowCounts[cell.row] -= 1;
    colCounts[cell.col] -= 1;
    boxCounts[boxIndex] -= 1;
    removed += 1;
  }

  return {
    ...puzzle,
    puzzle: grid.map((row) => row.join("")),
  };
};

export const getRandomSudokuPuzzle = ({
  difficulty,
  previousPuzzleId,
}: RandomSudokuOptions): SudokuPuzzle | null => {
  const pool = getSudokuPuzzlesByDifficulty(difficulty);

  if (pool.length === 0) {
    return null;
  }

  const available = pool.length === 1 ? pool : pool.filter((puzzle) => puzzle.id !== previousPuzzleId);
  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedPuzzle = available[randomIndex] ?? null;
  if (!selectedPuzzle) {
    return null;
  }

  return applyHardVisibilityMask(selectedPuzzle);
};

export const createSudokuPlayerGrid = (puzzleRows: string[]): SudokuGrid => {
  return puzzleRows.map((row) => row.split("").map((cell) => (cell === "0" ? "" : cell)));
};

export const createSudokuGivenMask = (puzzleRows: string[]): boolean[][] => {
  return puzzleRows.map((row) => row.split("").map((cell) => cell !== "0"));
};

export const createSudokuEntryTypeGrid = (puzzleRows: string[]): SudokuEntryTypeGrid => {
  return puzzleRows.map((row) => row.split("").map(() => null));
};

const getValidSudokuDigits = (value: string): string[] => {
  return value.replace(/[^1-9]/g, "").split("");
};

export const normalizeSudokuAnswerInput = (value: string): string => {
  const digits = getValidSudokuDigits(value);
  return digits.at(-1) ?? "";
};

export const normalizeSudokuPencilInput = (value: string): string => {
  const digits = getValidSudokuDigits(value);
  const uniqueDigits: string[] = [];

  for (const digit of digits) {
    if (uniqueDigits.includes(digit)) {
      continue;
    }

    uniqueDigits.push(digit);
    if (uniqueDigits.length >= 3) {
      break;
    }
  }

  return uniqueDigits.join("");
};

export const updateSudokuGridValue = (
  grid: SudokuGrid,
  row: number,
  col: number,
  value: string
): SudokuGrid => {
  return grid.map((gridRow, rowIndex) => {
    if (rowIndex !== row) {
      return gridRow;
    }

    return gridRow.map((cellValue, colIndex) => {
      return colIndex === col ? value : cellValue;
    });
  });
};

export const updateSudokuEntryType = (
  entryGrid: SudokuEntryTypeGrid,
  row: number,
  col: number,
  entryType: SudokuCellEntryType
): SudokuEntryTypeGrid => {
  return entryGrid.map((entryRow, rowIndex) => {
    if (rowIndex !== row) {
      return entryRow;
    }

    return entryRow.map((cellEntryType, colIndex) => {
      return colIndex === col ? entryType : cellEntryType;
    });
  });
};

export const isSudokuEntryCorrect = (
  puzzle: SudokuPuzzle,
  row: number,
  col: number,
  value: string
): boolean => {
  if (!value) {
    return false;
  }

  return puzzle.solution[row][col] === value;
};

export const getMaxIncorrectForDifficulty = (difficulty: SudokuDifficulty): number => {
  return sudokuMaxIncorrectMap[difficulty];
};

export const getSudokuHint = ({ puzzle, grid }: SudokuHintOptions): SudokuHintResult | null => {
  const hintableCells: SudokuHintResult[] = [];

  for (let rowIndex = 0; rowIndex < 9; rowIndex += 1) {
    for (let colIndex = 0; colIndex < 9; colIndex += 1) {
      const puzzleValue = puzzle.puzzle[rowIndex][colIndex];
      if (puzzleValue !== "0") {
        continue;
      }

      const solutionValue = puzzle.solution[rowIndex][colIndex];
      if (grid[rowIndex][colIndex] !== solutionValue) {
        hintableCells.push({
          row: rowIndex,
          col: colIndex,
          value: solutionValue,
        });
      }
    }
  }

  if (hintableCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * hintableCells.length);
  return hintableCells[randomIndex] ?? null;
};

const isValidSudokuRow = (row: string): boolean => /^[0-9]{9}$/.test(row);

export const validateSudokuBank = (): string[] => {
  const issues: string[] = [];
  const seenIds = new Set<number>();

  for (const puzzle of sudokuPuzzles) {
    if (seenIds.has(puzzle.id)) {
      issues.push(`Duplicate Sudoku id: ${puzzle.id}`);
    }
    seenIds.add(puzzle.id);

    if (puzzle.puzzle.length !== 9 || puzzle.solution.length !== 9) {
      issues.push(`Sudoku ${puzzle.id} must contain exactly 9 rows for puzzle and solution.`);
      continue;
    }

    for (const row of puzzle.puzzle) {
      if (!isValidSudokuRow(row)) {
        issues.push(`Sudoku ${puzzle.id} has invalid puzzle row: "${row}"`);
      }
    }

    for (const row of puzzle.solution) {
      if (!isValidSudokuRow(row)) {
        issues.push(`Sudoku ${puzzle.id} has invalid solution row: "${row}"`);
      }
    }
  }

  return issues;
};
