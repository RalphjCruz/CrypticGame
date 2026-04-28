import type { Puzzle } from "../types/puzzle";
import HintBox from "./HintBox";

interface PuzzleCardProps {
  puzzle: Puzzle;
  showHint: boolean;
  showAnswer: boolean;
  onShowHint: () => void;
  onRevealAnswer: () => void;
  onGenerateAnother: () => void;
}

function PuzzleCard({
  puzzle,
  showHint,
  showAnswer,
  onShowHint,
  onRevealAnswer,
  onGenerateAnother,
}: PuzzleCardProps) {
  return (
    <article className="w-full rounded-3xl border border-pink-200 bg-white/95 p-6 text-left shadow-lg shadow-pink-100 sm:p-8">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide sm:text-sm">
        <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-700">
          {puzzle.type}
        </span>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
          {puzzle.difficulty}
        </span>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-semibold text-rose-500 sm:text-base">Clue</h2>
        <p className="mt-2 text-lg font-semibold leading-relaxed text-rose-950 sm:text-2xl">
          {puzzle.clue}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onShowHint}
          disabled={showHint}
          className="rounded-full border border-violet-200 bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {showHint ? "Hint Shown" : "Show Hint"}
        </button>
        <button
          type="button"
          onClick={onRevealAnswer}
          disabled={showAnswer}
          className="rounded-full border border-pink-300 bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {showAnswer ? "Answer Revealed" : "Reveal Answer"}
        </button>
        <button
          type="button"
          onClick={onGenerateAnother}
          className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
        >
          Generate Another
        </button>
      </div>

      {showHint && (
        <div className="mt-5">
          <HintBox hint={puzzle.hint} />
        </div>
      )}

      {showAnswer && (
        <div className="mt-5 space-y-4 rounded-2xl border border-pink-200 bg-rose-50 px-4 py-4">
          <div>
            <h3 className="text-sm font-semibold text-rose-600 sm:text-base">Answer</h3>
            <p className="mt-1 text-xl font-bold tracking-wide text-rose-950 sm:text-2xl">
              {puzzle.answer}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-rose-600 sm:text-base">
              Explanation
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-rose-800 sm:text-base">
              {puzzle.explanation}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

export default PuzzleCard;
