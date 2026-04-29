import type { Difficulty, Puzzle, PuzzleType } from "../types/puzzle";

const VALID_DIFFICULTIES: Difficulty[] = [
  "Very Easy",
  "Easy",
  "Medium",
  "Hard",
  "Very Hard",
];

const VALID_TYPES: PuzzleType[] = [
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

const REQUIRED_FIELDS: Array<
  keyof Pick<
    Puzzle,
    "clue" | "answer" | "enumeration" | "definition" | "wordplay" | "hint" | "explanation"
  >
> = ["clue", "answer", "enumeration", "definition", "wordplay", "hint", "explanation"];

const normalizeLetters = (text: string): string => {
  return text.toUpperCase().replace(/[^A-Z]/g, "");
};

const normalizeForWordMatch = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
};

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const containsAnswerAsFullWord = (clue: string, answer: string): boolean => {
  const normalizedClue = normalizeForWordMatch(clue);
  const normalizedAnswer = normalizeForWordMatch(answer);

  if (!normalizedClue || !normalizedAnswer) {
    return false;
  }

  const pattern = new RegExp(`\\b${escapeRegex(normalizedAnswer)}\\b`, "i");
  return pattern.test(normalizedClue);
};

const lettersMatch = (a: string, b: string): boolean => {
  const normalizeSort = (value: string) =>
    normalizeLetters(value)
      .split("")
      .sort()
      .join("");

  return normalizeSort(a) === normalizeSort(b);
};

const hasSuspiciousHiddenWordCapitalization = (clue: string): boolean => {
  const words = clue
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z]/g, ""))
    .filter((word) => word.length > 0);

  return words.some((word, index) => {
    if (word === word.toLowerCase()) {
      return false;
    }

    if (index === 0 && /^[A-Z][a-z]+$/.test(word)) {
      return false;
    }

    if (/^[A-Z]$/.test(word)) {
      return false;
    }

    return true;
  });
};

export const validatePuzzle = (puzzle: Puzzle): string[] => {
  const issues: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    const value = puzzle[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      issues.push(`Missing ${field}`);
    }
  }

  if (typeof puzzle.approved !== "boolean") {
    issues.push("approved must be a boolean");
  }

  if (!VALID_DIFFICULTIES.includes(puzzle.difficulty)) {
    issues.push("Invalid difficulty");
  }

  if (!VALID_TYPES.includes(puzzle.type)) {
    issues.push("Invalid type");
  }

  if (puzzle.secondaryType && !VALID_TYPES.includes(puzzle.secondaryType)) {
    issues.push("Invalid secondary type");
  }

  if (puzzle.answer !== puzzle.answer.toUpperCase()) {
    issues.push("Answer must be uppercase");
  }

  const expectedEnumeration = normalizeLetters(puzzle.answer).length.toString();
  if (puzzle.enumeration !== expectedEnumeration) {
    issues.push("Enumeration does not match answer length");
  }

  if (containsAnswerAsFullWord(puzzle.clue, puzzle.answer)) {
    issues.push("Answer appears directly in clue");
  }

  if (normalizeForWordMatch(puzzle.definition) === normalizeForWordMatch(puzzle.answer)) {
    issues.push("Definition is exactly the answer");
  }

  if (puzzle.type === "Hidden Word") {
    if (hasSuspiciousHiddenWordCapitalization(puzzle.clue)) {
      issues.push("Hidden Word clue has suspicious capitalization that may leak answer");
    }

    const clueLetters = normalizeLetters(puzzle.clue);
    const answerLetters = normalizeLetters(puzzle.answer);
    if (!clueLetters.includes(answerLetters)) {
      issues.push("Hidden Word answer is not actually hidden in clue");
    }
  }

  if (puzzle.type === "Anagram" || puzzle.secondaryType === "Anagram") {
    if (!puzzle.fodder?.trim()) {
      issues.push("Missing fodder for anagram");
    } else if (!lettersMatch(puzzle.fodder, puzzle.answer)) {
      issues.push("Anagram fodder letters do not match answer");
    }
  }

  return issues;
};

export const validatePuzzleBank = (puzzleBank: Puzzle[]): string[] => {
  const issues: string[] = [];
  const seenIds = new Set<number>();
  const seenClues = new Set<string>();

  for (const puzzle of puzzleBank) {
    if (seenIds.has(puzzle.id)) {
      issues.push(`id ${puzzle.id}: Duplicate id`);
    }
    seenIds.add(puzzle.id);

    const normalizedClue = normalizeForWordMatch(puzzle.clue);
    if (seenClues.has(normalizedClue)) {
      issues.push(`id ${puzzle.id}: Duplicate clue`);
    }
    seenClues.add(normalizedClue);

    const puzzleIssues = validatePuzzle(puzzle);
    for (const issue of puzzleIssues) {
      issues.push(`id ${puzzle.id}: ${issue}`);
    }
  }

  return issues;
};
