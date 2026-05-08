import { useEffect, useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import PuzzleCard from "./components/PuzzleCard";
import ProgressDashboard from "./components/ProgressDashboard";
import SudokuCard from "./components/SudokuCard";
import type { CrypticDashboardEntry, SudokuDashboardEntry } from "./types/progress";
import type { Difficulty, Puzzle, PuzzleType } from "./types/puzzle";
import type { SudokuDifficulty, SudokuPuzzle } from "./types/sudoku";
import { getRandomPuzzle, puzzleTypes, validatePuzzleBank } from "./utils/puzzleUtils";
import {
  loadDashboardData,
  loadDraftData,
  saveDashboardData,
  saveDraftData,
} from "./utils/progressStorage";
import {
  createSudokuEntryTypeGrid,
  createSudokuGivenMask,
  createSudokuPlayerGrid,
  getMaxIncorrectForDifficulty,
  getRandomSudokuPuzzle,
  getSudokuHint,
  isSudokuSolved,
  isSudokuEntryCorrect,
  normalizeSudokuAnswerInput,
  normalizeSudokuPencilInput,
  togglePencilDigit,
  type SudokuEntryTypeGrid,
  type SudokuInputMode,
  sudokuDifficulties,
  updateSudokuEntryType,
  updateSudokuGridValue,
  validateSudokuBank,
} from "./utils/sudokuUtils";

type AnswerStatus = "idle" | "empty" | "incorrect" | "correct";
type GameMode = "Cryptic Puzzle" | "Sudoku";
type AppPage = "Play" | "Dashboard";

const gameModes: GameMode[] = ["Cryptic Puzzle", "Sudoku"];
const MAX_DASHBOARD_HISTORY = 8;

const normalizeAnswer = (value: string): string => {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
};

function App() {
  const [hasRevealed, setHasRevealed] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: 70, left: 72 });
  const [noButtonStyleJitter, setNoButtonStyleJitter] = useState({ rotate: 0 });
  const [currentPage, setCurrentPage] = useState<AppPage>("Play");
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>("Cryptic Puzzle");

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("Very Easy");
  const [selectedType, setSelectedType] = useState<PuzzleType | "All Types">("All Types");
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("idle");
  const [crypticErrorMessage, setCrypticErrorMessage] = useState<string | null>(null);
  const [crypticDashboardEntries, setCrypticDashboardEntries] = useState<CrypticDashboardEntry[]>([]);
  const [crypticCompletedPuzzleIds, setCrypticCompletedPuzzleIds] = useState<number[]>([]);

  const [selectedSudokuDifficulty, setSelectedSudokuDifficulty] =
    useState<SudokuDifficulty>("Easy");
  const [currentSudokuPuzzle, setCurrentSudokuPuzzle] = useState<SudokuPuzzle | null>(null);
  const [sudokuPlayerGrid, setSudokuPlayerGrid] = useState<string[][]>([]);
  const [sudokuGivenMask, setSudokuGivenMask] = useState<boolean[][]>([]);
  const [sudokuEntryTypeGrid, setSudokuEntryTypeGrid] = useState<SudokuEntryTypeGrid>([]);
  const [sudokuInputMode, setSudokuInputMode] = useState<SudokuInputMode>("answer");
  const [sudokuIncorrectCount, setSudokuIncorrectCount] = useState(0);
  const [selectedSudokuCell, setSelectedSudokuCell] = useState<{ row: number; col: number } | null>(
    null
  );
  const [flashingSudokuCells, setFlashingSudokuCells] = useState<string[]>([]);
  const [showSudokuSolution, setShowSudokuSolution] = useState(false);
  const [sudokuSolved, setSudokuSolved] = useState(false);
  const [sudokuHintMessage, setSudokuHintMessage] = useState<string | null>(null);
  const [sudokuErrorMessage, setSudokuErrorMessage] = useState<string | null>(null);
  const [sudokuDashboardEntries, setSudokuDashboardEntries] = useState<SudokuDashboardEntry[]>([]);
  const [sudokuCompletedPuzzleIds, setSudokuCompletedPuzzleIds] = useState<number[]>([]);
  const [sudokuStartedAt, setSudokuStartedAt] = useState<number | null>(null);
  const [sudokuElapsedSeconds, setSudokuElapsedSeconds] = useState(0);

  const resetCrypticRoundState = () => {
    setShowHint(false);
    setShowAnswer(false);
    setUserAnswer("");
    setAnswerStatus("idle");
    setCrypticErrorMessage(null);
  };

  const resetSudokuRoundState = () => {
    setShowSudokuSolution(false);
    setSudokuSolved(false);
    setSudokuInputMode("answer");
    setSudokuIncorrectCount(0);
    setSelectedSudokuCell(null);
    setFlashingSudokuCells([]);
    setSudokuHintMessage(null);
    setSudokuErrorMessage(null);
    setSudokuElapsedSeconds(0);
  };

  useEffect(() => {
    const dashboardData = loadDashboardData();
    const draftData = loadDraftData();
    setCrypticDashboardEntries(dashboardData.crypticEntries);
    setSudokuDashboardEntries(dashboardData.sudokuEntries);
    setCrypticCompletedPuzzleIds(dashboardData.crypticCompletedPuzzleIds);
    setSudokuCompletedPuzzleIds(dashboardData.sudokuCompletedPuzzleIds);
    if (draftData.crypticAnswerDraft) {
      setUserAnswer(draftData.crypticAnswerDraft);
    }
  }, []);

  useEffect(() => {
    saveDashboardData({
      crypticEntries: crypticDashboardEntries,
      sudokuEntries: sudokuDashboardEntries,
      crypticCompletedPuzzleIds,
      sudokuCompletedPuzzleIds,
    });
  }, [crypticCompletedPuzzleIds, crypticDashboardEntries, sudokuCompletedPuzzleIds, sudokuDashboardEntries]);

  useEffect(() => {
    saveDraftData({
      crypticAnswerDraft: userAnswer,
    });
  }, [userAnswer]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const crypticIssues = validatePuzzleBank();
      if (crypticIssues.length > 0) {
        console.warn("Puzzle bank validation issues:", crypticIssues);
      }

      const sudokuIssues = validateSudokuBank();
      if (sudokuIssues.length > 0) {
        console.warn("Sudoku bank validation issues:", sudokuIssues);
      }
    }
  }, []);

  useEffect(() => {
    if (!sudokuStartedAt || showSudokuSolution || !currentSudokuPuzzle) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSudokuElapsedSeconds(Math.floor((Date.now() - sudokuStartedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [currentSudokuPuzzle, showSudokuSolution, sudokuStartedAt]);

  const generatePuzzle = () => {
    const nextPuzzle = getRandomPuzzle({
      difficulty: selectedDifficulty,
      typeFilter: selectedType,
      previousPuzzleId: currentPuzzle?.id,
    });

    if (!nextPuzzle) {
      setCurrentPuzzle(null);
      resetCrypticRoundState();
      setCrypticErrorMessage(
        `No ${selectedDifficulty.toLowerCase()} puzzles found for ${selectedType}. Try another filter.`
      );
      return;
    }

    setCurrentPuzzle(nextPuzzle);
    resetCrypticRoundState();
  };

  const generateSudoku = () => {
    const nextSudoku = getRandomSudokuPuzzle({
      difficulty: selectedSudokuDifficulty,
      previousPuzzleId: currentSudokuPuzzle?.id,
    });

    if (!nextSudoku) {
      setCurrentSudokuPuzzle(null);
      setSudokuPlayerGrid([]);
      setSudokuGivenMask([]);
      setSudokuEntryTypeGrid([]);
      setSelectedSudokuCell(null);
      setSudokuStartedAt(null);
      resetSudokuRoundState();
      setSudokuErrorMessage(
        `No ${selectedSudokuDifficulty.toLowerCase()} Sudoku puzzles found right now. Try another difficulty.`
      );
      return;
    }

    setCurrentSudokuPuzzle(nextSudoku);
    setSudokuPlayerGrid(createSudokuPlayerGrid(nextSudoku.puzzle));
    setSudokuGivenMask(createSudokuGivenMask(nextSudoku.puzzle));
    setSudokuEntryTypeGrid(createSudokuEntryTypeGrid(nextSudoku.puzzle));
    setSelectedSudokuCell(null);
    resetSudokuRoundState();
    setSudokuStartedAt(Date.now());
  };

  const handleSudokuCellChange = (row: number, col: number, rawValue: string) => {
    if (showSudokuSolution || !currentSudokuPuzzle || sudokuGivenMask[row]?.[col]) {
      return;
    }

    const nextValue =
      sudokuInputMode === "temp"
        ? normalizeSudokuPencilInput(rawValue)
        : normalizeSudokuAnswerInput(rawValue);

    if (!nextValue) {
      setSudokuPlayerGrid((previousGrid) => updateSudokuGridValue(previousGrid, row, col, ""));
      setSudokuEntryTypeGrid((previousGrid) => updateSudokuEntryType(previousGrid, row, col, null));
      setSelectedSudokuCell({ row, col });
      if (sudokuHintMessage) {
        setSudokuHintMessage(null);
      }
      return;
    }

    if (sudokuInputMode === "temp") {
      setSudokuPlayerGrid((previousGrid) => updateSudokuGridValue(previousGrid, row, col, nextValue));
      setSudokuEntryTypeGrid((previousGrid) => updateSudokuEntryType(previousGrid, row, col, "temp"));
      setSelectedSudokuCell({ row, col });
      if (sudokuHintMessage) {
        setSudokuHintMessage(null);
      }
      return;
    }

    setSudokuPlayerGrid((previousGrid) => updateSudokuGridValue(previousGrid, row, col, nextValue));
    setSudokuEntryTypeGrid((previousGrid) => updateSudokuEntryType(previousGrid, row, col, "answer"));
    setSelectedSudokuCell({ row, col });
    if (sudokuHintMessage) {
      setSudokuHintMessage(null);
    }
  };

  const handleSudokuCellKeyDown = (row: number, col: number, key: string) => {
    if (showSudokuSolution || !currentSudokuPuzzle || sudokuGivenMask[row]?.[col]) {
      return;
    }

    if (key === "Enter") {
      handleSudokuSubmit();
      return;
    }

    const currentValue = sudokuPlayerGrid[row]?.[col] ?? "";
    const currentEntryType = sudokuEntryTypeGrid[row]?.[col] ?? null;

    if (key === "Backspace" || key === "Delete") {
      if (!currentValue) {
        return;
      }

      if (sudokuInputMode === "temp" && currentEntryType === "temp") {
        const trimmed = currentValue.slice(0, -1);
        setSudokuPlayerGrid((previousGrid) => updateSudokuGridValue(previousGrid, row, col, trimmed));
        setSudokuEntryTypeGrid((previousGrid) =>
          updateSudokuEntryType(previousGrid, row, col, trimmed ? "temp" : null)
        );
      } else {
        setSudokuPlayerGrid((previousGrid) => updateSudokuGridValue(previousGrid, row, col, ""));
        setSudokuEntryTypeGrid((previousGrid) => updateSudokuEntryType(previousGrid, row, col, null));
      }
      setSelectedSudokuCell({ row, col });
      if (sudokuHintMessage) {
        setSudokuHintMessage(null);
      }
      return;
    }

    if (!/^[1-9]$/.test(key)) {
      return;
    }

    if (sudokuInputMode === "temp") {
      const baseNotes = currentEntryType === "temp" ? currentValue : "";
      const toggledNotes = togglePencilDigit(baseNotes, key);
      setSudokuPlayerGrid((previousGrid) => updateSudokuGridValue(previousGrid, row, col, toggledNotes));
      setSudokuEntryTypeGrid((previousGrid) =>
        updateSudokuEntryType(previousGrid, row, col, toggledNotes ? "temp" : null)
      );
      setSelectedSudokuCell({ row, col });
      if (sudokuHintMessage) {
        setSudokuHintMessage(null);
      }
      return;
    }

    setSudokuPlayerGrid((previousGrid) => updateSudokuGridValue(previousGrid, row, col, key));
    setSudokuEntryTypeGrid((previousGrid) => updateSudokuEntryType(previousGrid, row, col, "answer"));
    setSelectedSudokuCell({ row, col });
    if (sudokuHintMessage) {
      setSudokuHintMessage(null);
    }
  };

  useEffect(() => {
    if (
      selectedGameMode !== "Sudoku" ||
      sudokuInputMode !== "temp" ||
      !selectedSudokuCell ||
      showSudokuSolution
    ) {
      return;
    }

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName ?? "";
      if (target?.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
        return;
      }

      const key = event.key;
      const isSupportedKey =
        /^[1-9]$/.test(key) || key === "Backspace" || key === "Delete" || key === "Enter";
      if (!isSupportedKey) {
        return;
      }

      event.preventDefault();
      handleSudokuCellKeyDown(selectedSudokuCell.row, selectedSudokuCell.col, key);
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [
    handleSudokuCellKeyDown,
    selectedGameMode,
    selectedSudokuCell,
    showSudokuSolution,
    sudokuInputMode,
  ]);

  const handleToggleSelectedCellNote = (digit: string) => {
    if (!selectedSudokuCell || showSudokuSolution) {
      return;
    }

    const { row, col } = selectedSudokuCell;
    if (sudokuGivenMask[row]?.[col]) {
      return;
    }

    const currentEntryType = sudokuEntryTypeGrid[row]?.[col] ?? null;
    const currentValue = sudokuPlayerGrid[row]?.[col] ?? "";
    const updatedNotes = togglePencilDigit(currentEntryType === "temp" ? currentValue : "", digit);
    setSudokuPlayerGrid((previousGrid) => updateSudokuGridValue(previousGrid, row, col, updatedNotes));
    setSudokuEntryTypeGrid((previousGrid) =>
      updateSudokuEntryType(previousGrid, row, col, updatedNotes ? "temp" : null)
    );
    if (sudokuHintMessage) {
      setSudokuHintMessage(null);
    }
  };

  const handleSudokuSubmit = () => {
    if (showSudokuSolution || !currentSudokuPuzzle) {
      return;
    }

    const submittedCells: Array<{ row: number; col: number; value: string }> = [];
    for (let rowIndex = 0; rowIndex < 9; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 9; colIndex += 1) {
        if (sudokuGivenMask[rowIndex]?.[colIndex]) {
          continue;
        }

        const value = sudokuPlayerGrid[rowIndex]?.[colIndex] ?? "";
        const entryType = sudokuEntryTypeGrid[rowIndex]?.[colIndex] ?? null;
        if (!value || entryType !== "answer") {
          continue;
        }

        submittedCells.push({ row: rowIndex, col: colIndex, value });
      }
    }

    if (submittedCells.length === 0) {
      setSudokuHintMessage("Add answer numbers first, then press Enter or Submit.");
      return;
    }

    const flashKeys = submittedCells.map((cell) => `${cell.row}-${cell.col}`);
    setFlashingSudokuCells(flashKeys);
    setTimeout(() => setFlashingSudokuCells([]), 320);

    const wrongCells = submittedCells.filter((cell) => {
      return !isSudokuEntryCorrect(currentSudokuPuzzle, cell.row, cell.col, cell.value);
    });

    const logSudokuSubmit = (wrongCount: number, solved: boolean) => {
      const nextSudokuEntry: SudokuDashboardEntry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        timestamp: Date.now(),
        puzzleId: currentSudokuPuzzle.id,
        difficulty: currentSudokuPuzzle.difficulty,
        submittedCount: submittedCells.length,
        wrongCount,
        solved,
        elapsedSeconds: sudokuElapsedSeconds,
      };
      setSudokuDashboardEntries((previous) =>
        [nextSudokuEntry, ...previous].slice(0, MAX_DASHBOARD_HISTORY)
      );
    };

    if (wrongCells.length === 0) {
      const solved = isSudokuSolved(currentSudokuPuzzle, sudokuPlayerGrid);
      logSudokuSubmit(0, solved);
      if (solved) {
        setSudokuSolved(true);
        setSudokuStartedAt(null);
        setSudokuCompletedPuzzleIds((previous) =>
          previous.includes(currentSudokuPuzzle.id)
            ? previous
            : [...previous, currentSudokuPuzzle.id].sort((a, b) => a - b)
        );
        setSudokuHintMessage(`Solved in ${sudokuElapsedSeconds} seconds.`);
      } else {
        setSudokuHintMessage("All submitted numbers are correct.");
      }
      return;
    }

    const maxIncorrect = getMaxIncorrectForDifficulty(selectedSudokuDifficulty);
    const nextIncorrectCount = sudokuIncorrectCount + wrongCells.length;

    let clearedGrid = sudokuPlayerGrid;
    let clearedEntryTypes = sudokuEntryTypeGrid;
    for (const wrongCell of wrongCells) {
      clearedGrid = updateSudokuGridValue(clearedGrid, wrongCell.row, wrongCell.col, "");
      clearedEntryTypes = updateSudokuEntryType(clearedEntryTypes, wrongCell.row, wrongCell.col, null);
    }

    setSudokuPlayerGrid(clearedGrid);
    setSudokuEntryTypeGrid(clearedEntryTypes);
    logSudokuSubmit(wrongCells.length, false);

    if (nextIncorrectCount >= maxIncorrect) {
      setSudokuPlayerGrid(createSudokuPlayerGrid(currentSudokuPuzzle.puzzle));
      setSudokuGivenMask(createSudokuGivenMask(currentSudokuPuzzle.puzzle));
      setSudokuEntryTypeGrid(createSudokuEntryTypeGrid(currentSudokuPuzzle.puzzle));
      setSudokuIncorrectCount(0);
      setSudokuInputMode("answer");
      setSelectedSudokuCell(null);
      setSudokuSolved(false);
      setSudokuStartedAt(Date.now());
      setSudokuHintMessage("Incorrect number. 0 attempts remaining. Puzzle reset.");
      return;
    }

    setSudokuIncorrectCount(nextIncorrectCount);
    setSudokuHintMessage(`Incorrect number. ${maxIncorrect - nextIncorrectCount} attempts remaining.`);
  };

  const handleSudokuHint = () => {
    if (showSudokuSolution || !currentSudokuPuzzle) {
      return;
    }

    const hint = getSudokuHint({
      puzzle: currentSudokuPuzzle,
      grid: sudokuPlayerGrid,
    });

    if (!hint) {
      setSudokuHintMessage("No hint available. Your editable cells already match the solution.");
      return;
    }

    setSudokuPlayerGrid((previousGrid) =>
      updateSudokuGridValue(previousGrid, hint.row, hint.col, hint.value)
    );
    setSudokuEntryTypeGrid((previousGrid) => updateSudokuEntryType(previousGrid, hint.row, hint.col, "answer"));
    setSelectedSudokuCell({ row: hint.row, col: hint.col });
    setSudokuHintMessage(`Hint: row ${hint.row + 1}, column ${hint.col + 1} is ${hint.value}.`);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentPuzzle(null);
    resetCrypticRoundState();
  };

  const handleTypeChange = (type: PuzzleType | "All Types") => {
    setSelectedType(type);
    setCurrentPuzzle(null);
    resetCrypticRoundState();
  };

  const handleAnswerChange = (value: string) => {
    setUserAnswer(value);
    if (answerStatus !== "idle") {
      setAnswerStatus("idle");
    }
  };

  const checkAnswer = () => {
    if (!currentPuzzle) {
      return;
    }

    const guess = normalizeAnswer(userAnswer);
    if (!guess) {
      setAnswerStatus("empty");
      return;
    }

    const expected = normalizeAnswer(currentPuzzle.answer);
    const isCorrect = guess === expected;
    const nextCrypticEntry: CrypticDashboardEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      timestamp: Date.now(),
      puzzleId: currentPuzzle.id,
      clue: currentPuzzle.clue,
      difficulty: currentPuzzle.difficulty,
      guess,
      correct: isCorrect,
    };
    setCrypticDashboardEntries((previous) => [nextCrypticEntry, ...previous].slice(0, MAX_DASHBOARD_HISTORY));

    if (guess === expected) {
      setAnswerStatus("correct");
      setShowAnswer(true);
      setCrypticCompletedPuzzleIds((previous) =>
        previous.includes(currentPuzzle.id) ? previous : [...previous, currentPuzzle.id].sort((a, b) => a - b)
      );
      return;
    }

    setAnswerStatus("incorrect");
  };

  const getSafeNoButtonPosition = (nextNoClicks: number) => {
    const forbiddenTop = Math.min(72, 34 + nextNoClicks * 3);
    const forbiddenHalfWidth = Math.min(44, 22 + nextNoClicks * 2);

    for (let attempt = 0; attempt < 24; attempt += 1) {
      const top = 8 + Math.random() * 84;
      const left = 5 + Math.random() * 90;

      const isInsideYesZone =
        top <= forbiddenTop &&
        left >= 50 - forbiddenHalfWidth &&
        left <= 50 + forbiddenHalfWidth;

      if (!isInsideYesZone) {
        return { top, left };
      }
    }

    return { top: 84, left: 12 };
  };

  const handleNoClick = () => {
    setNoClicks((previous) => {
      const next = previous + 1;
      if (next < 15) {
        setNoButtonPosition(getSafeNoButtonPosition(next));
        setNoButtonStyleJitter({
          rotate: -24 + Math.random() * 48,
        });
      }
      return next;
    });
  };

  const currentSudokuFilledCount = sudokuPlayerGrid.reduce((count, row, rowIndex) => {
    return (
      count +
      row.reduce((rowCount, value, colIndex) => {
        if (sudokuGivenMask[rowIndex]?.[colIndex]) {
          return rowCount;
        }

        return value ? rowCount + 1 : rowCount;
      }, 0)
    );
  }, 0);

  const crypticInProgressPuzzleIds =
    selectedGameMode === "Cryptic Puzzle" && currentPuzzle && !showAnswer ? [currentPuzzle.id] : [];
  const sudokuInProgressPuzzleIds =
    selectedGameMode === "Sudoku" && currentSudokuPuzzle && !showSudokuSolution && !sudokuSolved
      ? [currentSudokuPuzzle.id]
      : [];

  if (!hasRevealed) {
    const yesScale = 1 + noClicks * 0.18;
    const noScale = Math.max(0.35, 1 - noClicks * 0.08);
    const promptText = (() => {
      if (noClicks >= 15) {
        return "god youre so stubborn just take it";
      }
      if (noClicks === 14) {
        return "pretty please?";
      }
      if (noClicks === 13) {
        return "PLEASE???";
      }
      if (noClicks === 12) {
        return "please?";
      }
      if (noClicks === 11) {
        return "please click yes";
      }
      if (noClicks === 10) {
        return "just click yes";
      }
      return "Would you like to see your present?";
    })();

    return (
      <main
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-contain bg-center bg-no-repeat px-4 py-10 text-[#123a57]"
        style={{ backgroundColor: "#F9DAE9", backgroundImage: "url('/hangyodon3.jpg')" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[#f9dae9]/24" />
        <section className="soft-card pop-in w-full max-w-xl rounded-3xl border border-sky-200/80 bg-white/90 p-10 text-center backdrop-blur">
          <h1 className="display-cute candy-shadow text-5xl font-bold tracking-tight text-[#123a57] sm:text-6xl">
            Happy Birthday!!
          </h1>
          <div className="mt-5 flex justify-center">
            <img
              src="/hangyodon2.jpg"
              alt="Hangyodon"
              className="h-28 w-28 rounded-full border-4 border-cyan-200 object-cover shadow-md shadow-sky-200 sm:h-32 sm:w-32"
            />
          </div>
          <p className="display-cute mt-4 text-lg font-semibold text-sky-800 sm:text-xl">{promptText}</p>
          <div className="relative mt-8 min-h-52 pt-3">
            <button
              type="button"
              onClick={() => setHasRevealed(true)}
              className="display-cute rounded-2xl border border-sky-500 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
              style={{ transform: `scale(${yesScale})`, transformOrigin: "top center" }}
            >
              Yes
            </button>
            {noClicks === 0 && (
              <button
                type="button"
                onClick={handleNoClick}
                className="display-cute ml-3 rounded-2xl border border-sky-300 bg-white px-5 py-2 text-base font-semibold text-sky-800 shadow transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                No
              </button>
            )}
            {noClicks > 0 && noClicks < 15 && (
              <button
                type="button"
                onClick={handleNoClick}
                className="display-cute absolute rounded-2xl border border-sky-300 bg-white px-5 py-2 text-base font-semibold text-sky-800 shadow transition hover:-translate-y-0.5 hover:bg-sky-50"
                style={{
                  top: `${noButtonPosition.top}%`,
                  left: `${noButtonPosition.left}%`,
                  transform: `translate(-50%, -50%) rotate(${noButtonStyleJitter.rotate}deg) scale(${noScale})`,
                }}
              >
                No
              </button>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-contain bg-center bg-no-repeat px-4 py-10 text-[#123a57]"
      style={{ backgroundColor: "#F9DAE9", backgroundImage: "url('/hangyodon3.jpg')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#f9dae9]/24" />
      <div className="sparkle-dot pointer-events-none absolute top-28 left-[12%] h-3 w-3 rounded-full opacity-70 floaty" />
      <div className="sparkle-dot pointer-events-none absolute top-56 right-[14%] h-2.5 w-2.5 rounded-full opacity-65 floaty" />
      <div className="sparkle-dot pointer-events-none absolute bottom-36 left-[22%] h-2 w-2 rounded-full opacity-60 floaty" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
        <header className="text-center">
          <div className="mb-3 flex justify-center">
            <img
              src="/hangyodon2.jpg"
              alt="Hangyodon badge"
              className="h-20 w-20 rounded-full border-4 border-cyan-200 object-cover shadow-md shadow-sky-200 sm:h-24 sm:w-24"
            />
          </div>
          <h1 className="display-cute candy-shadow mt-2 text-5xl font-bold tracking-tight text-[#123a57] sm:text-6xl">
            hangyo's puzzles
          </h1>
        </header>
        <section className="soft-card w-full rounded-3xl border border-sky-200/80 bg-white/80 p-4 backdrop-blur sm:p-5">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage("Play")}
              className={`display-cute rounded-full border px-5 py-2 text-sm font-semibold transition sm:text-base ${
                currentPage === "Play"
                  ? "border-sky-700 bg-sky-600 text-white"
                  : "border-sky-200 bg-white text-sky-800 hover:bg-sky-50"
              }`}
              aria-pressed={currentPage === "Play"}
            >
              Play
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage("Dashboard")}
              className={`display-cute rounded-full border px-5 py-2 text-sm font-semibold transition sm:text-base ${
                currentPage === "Dashboard"
                  ? "border-sky-700 bg-sky-600 text-white"
                  : "border-sky-200 bg-white text-sky-800 hover:bg-sky-50"
              }`}
              aria-pressed={currentPage === "Dashboard"}
            >
              Dashboard
            </button>
          </div>
        </section>

        {currentPage === "Play" ? (
          <>
            <section className="soft-card w-full rounded-3xl border border-sky-200/80 bg-white/80 p-5 backdrop-blur sm:p-6">
              <p className="display-cute mb-3 text-center text-sm font-semibold text-sky-700 sm:text-base">
                Choose Puzzle Type
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {gameModes.map((mode) => {
                  const isSelected = selectedGameMode === mode;

                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSelectedGameMode(mode)}
                      className={`display-cute rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 sm:text-base ${
                        isSelected
                          ? "border-sky-700 bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200"
                          : "border-sky-200 bg-white text-sky-800 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
                      }`}
                      aria-pressed={isSelected}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>

              {selectedGameMode === "Cryptic Puzzle" ? (
                <>
                  <p className="display-cute mt-5 mb-3 text-center text-sm font-semibold text-sky-700 sm:text-base">
                    Choose Difficulty
                  </p>
                  <DifficultySelector
                    selectedDifficulty={selectedDifficulty}
                    onSelectDifficulty={handleDifficultyChange}
                  />

                  <label className="display-cute mt-4 block text-sm font-semibold text-sky-700">
                    Clue Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(event) => handleTypeChange(event.target.value as PuzzleType | "All Types")}
                    className="mt-2 w-full rounded-xl border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  >
                    {puzzleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={generatePuzzle}
                    className="display-cute mt-5 w-full rounded-2xl border border-sky-500 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:text-lg"
                  >
                    Generate Puzzle
                  </button>
                </>
              ) : (
                <>
                  <p className="display-cute mt-5 mb-3 text-center text-sm font-semibold text-sky-700 sm:text-base">
                    Choose Difficulty
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {sudokuDifficulties.map((difficulty) => {
                      const isSelected = selectedSudokuDifficulty === difficulty;

                      return (
                        <button
                          key={difficulty}
                          type="button"
                          onClick={() => {
                            setSelectedSudokuDifficulty(difficulty);
                            setCurrentSudokuPuzzle(null);
                            setSudokuPlayerGrid([]);
                            setSudokuGivenMask([]);
                            setSudokuEntryTypeGrid([]);
                            setSelectedSudokuCell(null);
                            resetSudokuRoundState();
                          }}
                          className={`display-cute rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 sm:text-base ${
                            isSelected
                              ? "border-sky-700 bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200"
                              : "border-sky-200 bg-white text-sky-800 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
                          }`}
                          aria-pressed={isSelected}
                        >
                          {difficulty}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={generateSudoku}
                    className="display-cute mt-5 w-full rounded-2xl border border-sky-500 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:text-lg"
                  >
                    Generate Sudoku
                  </button>
                </>
              )}
            </section>

            {selectedGameMode === "Cryptic Puzzle" && crypticErrorMessage && (
              <div className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">
                {crypticErrorMessage}
              </div>
            )}

            {selectedGameMode === "Sudoku" && sudokuErrorMessage && (
              <div className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">
                {sudokuErrorMessage}
              </div>
            )}

            {selectedGameMode === "Cryptic Puzzle" ? (
              currentPuzzle ? (
                <PuzzleCard
                  puzzle={currentPuzzle}
                  showHint={showHint}
                  showAnswer={showAnswer}
                  userAnswer={userAnswer}
                  answerStatus={answerStatus}
                  onAnswerChange={handleAnswerChange}
                  onCheckAnswer={checkAnswer}
                  onShowHint={() => setShowHint(true)}
                  onGenerateAnother={generatePuzzle}
                />
              ) : null
            ) : currentSudokuPuzzle ? (
              (() => {
                const selectedNotes =
                  selectedSudokuCell &&
                  sudokuEntryTypeGrid[selectedSudokuCell.row]?.[selectedSudokuCell.col] === "temp"
                    ? sudokuPlayerGrid[selectedSudokuCell.row]?.[selectedSudokuCell.col] ?? ""
                    : "";

                return (
                  <SudokuCard
                    puzzle={currentSudokuPuzzle}
                    playerGrid={sudokuPlayerGrid}
                    givenMask={sudokuGivenMask}
                    entryTypeGrid={sudokuEntryTypeGrid}
                    inputMode={sudokuInputMode}
                    incorrectCount={sudokuIncorrectCount}
                    maxIncorrect={getMaxIncorrectForDifficulty(selectedSudokuDifficulty)}
                    elapsedSeconds={sudokuElapsedSeconds}
                    selectedCell={selectedSudokuCell}
                    selectedCellNotes={selectedNotes}
                    flashingCells={flashingSudokuCells}
                    showSolution={showSudokuSolution}
                    hintMessage={sudokuHintMessage}
                    onCellChange={handleSudokuCellChange}
                    onCellFocus={(row, col) => setSelectedSudokuCell({ row, col })}
                    onCellKeyDown={handleSudokuCellKeyDown}
                    onCellSelect={(row, col) => setSelectedSudokuCell({ row, col })}
                    onToggleSelectedCellNote={handleToggleSelectedCellNote}
                    onSubmitAnswers={handleSudokuSubmit}
                    onInputModeChange={setSudokuInputMode}
                    onUseHint={handleSudokuHint}
                    onRevealSolution={() => setShowSudokuSolution(true)}
                    onGenerateAnother={generateSudoku}
                  />
                );
              })()
            ) : null}
          </>
        ) : (
          <ProgressDashboard
            crypticEntries={crypticDashboardEntries}
            sudokuEntries={sudokuDashboardEntries}
            currentCrypticDraft={userAnswer}
            currentSudokuElapsedSeconds={sudokuElapsedSeconds}
            currentSudokuFilledCount={currentSudokuFilledCount}
            crypticInProgressPuzzleIds={crypticInProgressPuzzleIds}
            crypticCompletedPuzzleIds={crypticCompletedPuzzleIds}
            sudokuInProgressPuzzleIds={sudokuInProgressPuzzleIds}
            sudokuCompletedPuzzleIds={sudokuCompletedPuzzleIds}
          />
        )}
      </div>
    </main>
  );
}

export default App;

