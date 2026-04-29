import { useEffect, useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import PuzzleCard from "./components/PuzzleCard";
import type { Difficulty, Puzzle, PuzzleType } from "./types/puzzle";
import { getRandomPuzzle, puzzleTypes, validatePuzzleBank } from "./utils/puzzleUtils";

type AnswerStatus = "idle" | "empty" | "incorrect" | "correct";

const normalizeAnswer = (value: string): string => {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
};

function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("Very Easy");
  const [selectedType, setSelectedType] = useState<PuzzleType | "All Types">("All Types");
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetRoundState = () => {
    setShowHint(false);
    setShowAnswer(false);
    setUserAnswer("");
    setAnswerStatus("idle");
    setErrorMessage(null);
  };

  useEffect(() => {
    if (import.meta.env.DEV) {
      const issues = validatePuzzleBank();
      if (issues.length > 0) {
        console.warn("Puzzle bank validation issues:", issues);
      }
    }
  }, []);

  const generatePuzzle = () => {
    const nextPuzzle = getRandomPuzzle({
      difficulty: selectedDifficulty,
      typeFilter: selectedType,
      previousPuzzleId: currentPuzzle?.id,
    });

    if (!nextPuzzle) {
      setCurrentPuzzle(null);
      resetRoundState();
      setErrorMessage(
        `No ${selectedDifficulty.toLowerCase()} puzzles found for ${selectedType}. Try another filter.`
      );
      return;
    }

    setCurrentPuzzle(nextPuzzle);
    resetRoundState();
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentPuzzle(null);
    resetRoundState();
  };

  const handleTypeChange = (type: PuzzleType | "All Types") => {
    setSelectedType(type);
    setCurrentPuzzle(null);
    resetRoundState();
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
    if (guess === expected) {
      setAnswerStatus("correct");
      setShowAnswer(true);
      return;
    }

    setAnswerStatus("incorrect");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff7fa_38%,#fff1f5_65%,#fde8f2_100%)] px-4 py-10 text-[#3F2633]">
      <div className="pointer-events-none absolute -top-16 -left-10 h-44 w-44 rounded-full bg-pink-200/45 blur-2xl" />
      <div className="pointer-events-none absolute top-1/4 -right-16 h-52 w-52 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-rose-200/35 blur-3xl" />
      <div className="sparkle-dot pointer-events-none absolute top-28 left-[12%] h-3 w-3 rounded-full opacity-70 floaty" />
      <div className="sparkle-dot pointer-events-none absolute top-56 right-[14%] h-2.5 w-2.5 rounded-full opacity-65 floaty" />
      <div className="sparkle-dot pointer-events-none absolute bottom-36 left-[22%] h-2 w-2 rounded-full opacity-60 floaty" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
        <header className="text-center">
          <p className="display-cute text-sm font-semibold uppercase tracking-[0.28em] text-rose-500">Cryptic Puzzle Notebook</p>
          <h1 className="display-cute candy-shadow mt-2 text-5xl font-bold tracking-tight text-[#3F2633] sm:text-6xl">CrypticForge</h1>
          <p className="mt-3 max-w-xl text-sm text-[#7A5A68] sm:text-base">
            Learn cryptic clue mechanics by solving one polished clue at a time.
          </p>
        </header>

        <section className="soft-card w-full rounded-3xl border border-rose-200/70 bg-white/85 p-4 text-left backdrop-blur">
          <h2 className="display-cute text-sm font-bold text-rose-700 sm:text-base">Quick Cryptic Rule</h2>
          <p className="mt-1 text-sm text-[#7A5A68]">
            Every clue has a definition plus wordplay. Wordplay uses fodder and indicators to guide the solve.
          </p>
        </section>

        <section className="soft-card w-full rounded-3xl border border-pink-200/80 bg-white/80 p-5 backdrop-blur sm:p-6">
          <p className="display-cute mb-3 text-center text-sm font-semibold text-rose-600 sm:text-base">Choose Difficulty</p>
          <DifficultySelector selectedDifficulty={selectedDifficulty} onSelectDifficulty={handleDifficultyChange} />

          <label className="display-cute mt-4 block text-sm font-semibold text-rose-600">Clue Type</label>
          <select
            value={selectedType}
            onChange={(event) => handleTypeChange(event.target.value as PuzzleType | "All Types")}
            className="mt-2 w-full rounded-xl border border-pink-300 bg-white px-4 py-2 text-sm font-semibold text-rose-800 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
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
            className="display-cute mt-5 w-full rounded-2xl border border-pink-400 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:text-lg"
          >
            Generate Puzzle
          </button>
        </section>

        {errorMessage && <div className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div>}

        {currentPuzzle ? (
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
        ) : (
          <section className="soft-card w-full rounded-3xl border border-dashed border-pink-300 bg-white/90 p-8 text-center">
            <h2 className="display-cute text-lg font-semibold text-rose-700 sm:text-xl">Ready for a clue?</h2>
            <p className="mt-2 text-sm text-[#7A5A68] sm:text-base">Pick a difficulty and type, then click "Generate Puzzle".</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
