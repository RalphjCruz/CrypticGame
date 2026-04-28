import { useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import PuzzleCard from "./components/PuzzleCard";
import type { Difficulty, Puzzle } from "./types/puzzle";
import { getRandomPuzzle } from "./utils/puzzleUtils";

function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("Easy");
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generatePuzzle = () => {
    const nextPuzzle = getRandomPuzzle({
      difficulty: selectedDifficulty,
      previousPuzzleId: currentPuzzle?.id,
    });

    if (!nextPuzzle) {
      setCurrentPuzzle(null);
      setShowHint(false);
      setShowAnswer(false);
      setErrorMessage(
        `No ${selectedDifficulty.toLowerCase()} puzzles are available right now. Please try another level.`
      );
      return;
    }

    setCurrentPuzzle(nextPuzzle);
    setShowHint(false);
    setShowAnswer(false);
    setErrorMessage(null);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setErrorMessage(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(170deg,#fff7fa_0%,#fff1f5_55%,#fde7f3_100%)] px-4 py-10 text-[#3F2633]">
      <div className="pointer-events-none absolute -top-16 -left-10 h-40 w-40 rounded-full bg-pink-200/45 blur-2xl" />
      <div className="pointer-events-none absolute top-1/4 -right-16 h-52 w-52 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-rose-200/35 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            Cryptic Puzzle Notebook
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#3F2633] sm:text-5xl">
            CrypticForge
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[#7A5A68] sm:text-base">
            Generate simple cryptic puzzles and learn how the clues work.
          </p>
        </header>

        <section className="w-full rounded-3xl border border-pink-200/80 bg-white/70 p-5 shadow-sm shadow-pink-100 backdrop-blur sm:p-6">
          <p className="mb-3 text-center text-sm font-semibold text-rose-600 sm:text-base">
            Choose Difficulty
          </p>
          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={handleDifficultyChange}
          />
          <button
            type="button"
            onClick={generatePuzzle}
            className="mt-5 w-full rounded-2xl border border-pink-400 bg-pink-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600 sm:text-lg"
          >
            Generate Puzzle
          </button>
        </section>

        {errorMessage && (
          <div className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        {currentPuzzle ? (
          <PuzzleCard
            puzzle={currentPuzzle}
            showHint={showHint}
            showAnswer={showAnswer}
            onShowHint={() => setShowHint(true)}
            onRevealAnswer={() => setShowAnswer(true)}
            onGenerateAnother={generatePuzzle}
          />
        ) : (
          <section className="w-full rounded-3xl border border-dashed border-pink-300 bg-white/80 p-8 text-center">
            <h2 className="text-lg font-semibold text-rose-700 sm:text-xl">
              Ready for a clue?
            </h2>
            <p className="mt-2 text-sm text-[#7A5A68] sm:text-base">
              Pick a difficulty and click "Generate Puzzle" to start.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
