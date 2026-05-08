import type { CrypticDashboardEntry, SudokuDashboardEntry } from "../types/progress";

interface ProgressDashboardProps {
  crypticEntries: CrypticDashboardEntry[];
  sudokuEntries: SudokuDashboardEntry[];
  currentCrypticDraft: string;
  currentSudokuElapsedSeconds: number;
  currentSudokuFilledCount: number;
  crypticInProgressPuzzleIds: number[];
  crypticCompletedPuzzleIds: number[];
  sudokuInProgressPuzzleIds: number[];
  sudokuCompletedPuzzleIds: number[];
}

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

function ProgressDashboard({
  crypticEntries,
  sudokuEntries,
  currentCrypticDraft,
  currentSudokuElapsedSeconds,
  currentSudokuFilledCount,
  crypticInProgressPuzzleIds,
  crypticCompletedPuzzleIds,
  sudokuInProgressPuzzleIds,
  sudokuCompletedPuzzleIds,
}: ProgressDashboardProps) {
  const renderPuzzleIdList = (ids: number[]): string => {
    if (ids.length === 0) {
      return "None";
    }
    return ids.map((id) => `#${id}`).join(", ");
  };

  return (
    <section className="soft-card w-full rounded-3xl border border-sky-200/80 bg-white/80 p-5 backdrop-blur sm:p-6">
      <h2 className="display-cute text-center text-lg font-semibold text-sky-800 sm:text-xl">
        Dashboard
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-sky-200 bg-white p-4">
          <h3 className="display-cute text-sm font-semibold text-sky-700 sm:text-base">Cryptic</h3>
          <p className="mt-1 text-xs text-sky-700 sm:text-sm">
            Current draft: {currentCrypticDraft ? `"${currentCrypticDraft}"` : "empty"}
          </p>
          <p className="mt-1 text-xs text-sky-700 sm:text-sm">
            In Progress: {renderPuzzleIdList(crypticInProgressPuzzleIds)}
          </p>
          <p className="mt-1 text-xs text-sky-700 sm:text-sm">
            Completed: {renderPuzzleIdList(crypticCompletedPuzzleIds)}
          </p>
          <div className="mt-3 space-y-2">
            {crypticEntries.length === 0 ? (
              <p className="text-xs text-sky-700 sm:text-sm">No cryptic attempts yet.</p>
            ) : (
              crypticEntries.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2">
                  <p className="text-xs font-semibold text-sky-800 sm:text-sm">
                    {entry.correct ? "Correct" : "Incorrect"} - {entry.difficulty}
                  </p>
                  <p className="mt-0.5 text-xs text-sky-800 sm:text-sm">Guess: {entry.guess}</p>
                  <p className="mt-0.5 text-[11px] text-sky-700 sm:text-xs">
                    {formatTimestamp(entry.timestamp)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-white p-4">
          <h3 className="display-cute text-sm font-semibold text-sky-700 sm:text-base">Sudoku</h3>
          <p className="mt-1 text-xs text-sky-700 sm:text-sm">
            Current timer: {formatDuration(currentSudokuElapsedSeconds)} | Filled cells:{" "}
            {currentSudokuFilledCount}
          </p>
          <p className="mt-1 text-xs text-sky-700 sm:text-sm">
            In Progress: {renderPuzzleIdList(sudokuInProgressPuzzleIds)}
          </p>
          <p className="mt-1 text-xs text-sky-700 sm:text-sm">
            Completed: {renderPuzzleIdList(sudokuCompletedPuzzleIds)}
          </p>
          <div className="mt-3 space-y-2">
            {sudokuEntries.length === 0 ? (
              <p className="text-xs text-sky-700 sm:text-sm">No sudoku submissions yet.</p>
            ) : (
              sudokuEntries.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2">
                  <p className="text-xs font-semibold text-sky-800 sm:text-sm">
                    {entry.solved ? "Solved" : "Checked"} - {entry.difficulty}
                  </p>
                  <p className="mt-0.5 text-xs text-sky-800 sm:text-sm">
                    Submitted: {entry.submittedCount}, Wrong: {entry.wrongCount}, Time:{" "}
                    {formatDuration(entry.elapsedSeconds)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-sky-700 sm:text-xs">
                    {formatTimestamp(entry.timestamp)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressDashboard;
