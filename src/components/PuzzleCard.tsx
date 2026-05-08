import type { Puzzle } from "../types/puzzle";
import HintBox from "./HintBox";

type AnswerStatus = "idle" | "empty" | "incorrect" | "correct";

interface PuzzleCardProps {
  puzzle: Puzzle;
  showHint: boolean;
  showAnswer: boolean;
  userAnswer: string;
  answerStatus: AnswerStatus;
  onAnswerChange: (value: string) => void;
  onCheckAnswer: () => void;
  onShowHint: () => void;
  onGenerateAnother: () => void;
}

function PuzzleCard({
  puzzle,
  showHint,
  showAnswer,
  userAnswer,
  answerStatus,
  onAnswerChange,
  onCheckAnswer,
  onShowHint,
  onGenerateAnother,
}: PuzzleCardProps) {
  const typeLabel = puzzle.secondaryType ? `${puzzle.type} + ${puzzle.secondaryType}` : puzzle.type;

  const displayAnswer = puzzle.answer
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const statusMessage =
    answerStatus === "correct"
      ? "Correct! Nice solve."
      : answerStatus === "incorrect"
        ? "Not quite. Try again."
        : answerStatus === "empty"
          ? "Please enter an answer first."
          : null;

  const statusClassName =
    answerStatus === "correct"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : answerStatus === "incorrect" || answerStatus === "empty"
        ? "border-sky-200 bg-sky-50 text-sky-800"
        : "";

  return (
    <article className="soft-card pop-in w-full rounded-3xl border border-sky-200 bg-white/95 p-6 text-left sm:p-8">
      <div className="display-cute flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide sm:text-sm">
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-800">{typeLabel}</span>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-800">{puzzle.difficulty}</span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">({puzzle.enumeration})</span>
      </div>

      <div className="mt-5">
        <h2 className="display-cute text-sm font-semibold text-sky-700 sm:text-base">Clue</h2>
        <p className="mt-2 text-lg font-semibold leading-relaxed text-slate-900 sm:text-2xl">{puzzle.clue}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onShowHint}
          disabled={showHint}
          className="display-cute rounded-full border border-cyan-200 bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {showHint ? "Hint Shown" : "Show Hint"}
        </button>
        <button
          type="button"
          onClick={onGenerateAnother}
          className="display-cute rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-800 transition hover:-translate-y-0.5 hover:bg-sky-50"
        >
          Generate Another
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-sky-200 bg-cyan-50/80 p-4">
        <label htmlFor="answer-input" className="display-cute text-sm font-semibold text-sky-800 sm:text-base">
          Your Answer
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="answer-input"
            type="text"
            value={userAnswer}
            onChange={(event) => onAnswerChange(event.target.value)}
            placeholder="Type your guess"
            className="w-full rounded-xl border border-sky-300 bg-white px-4 py-2 text-base text-sky-950 outline-none transition placeholder:text-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
          <button
            type="button"
            onClick={onCheckAnswer}
            className="display-cute rounded-xl border border-sky-500 bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105 sm:min-w-32"
          >
            Check Answer
          </button>
        </div>
      </div>

      {statusMessage && (
        <p className={`mt-4 rounded-xl border px-4 py-2 text-sm font-semibold ${statusClassName}`}>
          {statusMessage}
        </p>
      )}

      {showHint && (
        <div className="mt-5">
          <HintBox hint={puzzle.hint} />
        </div>
      )}

      {showAnswer && (
        <div className="mt-5 space-y-4 rounded-2xl border border-sky-200 bg-cyan-50 px-4 py-4">
          <div>
            <h3 className="display-cute text-sm font-semibold text-sky-700 sm:text-base">Answer</h3>
            <p className="mt-1 text-xl font-bold tracking-wide text-slate-900 sm:text-2xl">{displayAnswer}</p>
          </div>
          <div>
            <h3 className="display-cute text-sm font-semibold text-sky-700 sm:text-base">Explanation</h3>
            <p className="mt-1 text-sm leading-relaxed text-sky-900 sm:text-base">{puzzle.explanation}</p>
          </div>
          <details className="rounded-xl border border-sky-200 bg-white px-4 py-3" open>
            <summary className="display-cute cursor-pointer text-sm font-semibold text-sky-800">Clue Breakdown</summary>
            <div className="mt-2 space-y-1 text-sm text-sky-900 sm:text-base">
              <p><span className="font-semibold">Definition:</span> {puzzle.definition}</p>
              <p><span className="font-semibold">Wordplay:</span> {puzzle.wordplay}</p>
              {puzzle.fodder && <p><span className="font-semibold">Fodder:</span> {puzzle.fodder}</p>}
              {puzzle.indicator && <p><span className="font-semibold">Indicator:</span> {puzzle.indicator}</p>}
            </div>
          </details>
        </div>
      )}
    </article>
  );
}

export default PuzzleCard;
