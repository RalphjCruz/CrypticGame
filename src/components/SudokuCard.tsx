import type { SudokuPuzzle } from "../types/sudoku";
import type { SudokuEntryTypeGrid, SudokuGrid, SudokuInputMode } from "../utils/sudokuUtils";

interface SudokuCardProps {
  puzzle: SudokuPuzzle;
  playerGrid: SudokuGrid;
  givenMask: boolean[][];
  entryTypeGrid: SudokuEntryTypeGrid;
  inputMode: SudokuInputMode;
  incorrectCount: number;
  maxIncorrect: number;
  selectedCell: { row: number; col: number } | null;
  selectedCellNotes: string;
  flashingCells: string[];
  showSolution: boolean;
  hintMessage: string | null;
  onCellChange: (row: number, col: number, value: string) => void;
  onCellFocus: (row: number, col: number) => void;
  onCellKeyDown: (row: number, col: number, key: string) => void;
  onCellSelect: (row: number, col: number) => void;
  onToggleSelectedCellNote: (digit: string) => void;
  onSubmitAnswers: () => void;
  onInputModeChange: (mode: SudokuInputMode) => void;
  onUseHint: () => void;
  onRevealSolution: () => void;
  onGenerateAnother: () => void;
}

const getCellBorderClass = (rowIndex: number, colIndex: number): string => {
  const rightBorder = colIndex === 2 || colIndex === 5 ? "border-r-2 border-r-sky-500" : "border-r border-r-sky-200";
  const bottomBorder = rowIndex === 2 || rowIndex === 5 ? "border-b-2 border-b-sky-500" : "border-b border-b-sky-200";

  return `${rightBorder} ${bottomBorder}`;
};

function SudokuCard({
  puzzle,
  playerGrid,
  givenMask,
  entryTypeGrid,
  inputMode,
  incorrectCount,
  maxIncorrect,
  selectedCell,
  selectedCellNotes,
  flashingCells,
  showSolution,
  hintMessage,
  onCellChange,
  onCellFocus,
  onCellKeyDown,
  onCellSelect,
  onToggleSelectedCellNote,
  onSubmitAnswers,
  onInputModeChange,
  onUseHint,
  onRevealSolution,
  onGenerateAnother,
}: SudokuCardProps) {
  const renderGrid = showSolution ? puzzle.solution.map((row) => row.split("")) : playerGrid;
  const selectedDigit = (() => {
    if (!selectedCell) {
      return null;
    }

    const value = renderGrid[selectedCell.row]?.[selectedCell.col] ?? "";
    return /^[1-9]$/.test(value) ? value : null;
  })();

  return (
    <article
      className="soft-card pop-in w-full rounded-3xl border border-sky-200 bg-cover bg-center p-6 text-left sm:p-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.76), rgba(255,255,255,0.76)), url('/hangyodonpuzzle.jpg')",
      }}
    >
      <div className="display-cute flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide sm:text-sm">
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-800">Sudoku</span>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-800">{puzzle.difficulty}</span>
      </div>

      <div className="mt-5">
        <h2 className="display-cute text-sm font-semibold text-sky-700 sm:text-base">
          {showSolution ? "Solution" : "Puzzle"}
        </h2>
        {!showSolution ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onInputModeChange("answer")}
              className={`display-cute rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition sm:text-sm ${
                inputMode === "answer"
                  ? "border-sky-700 bg-sky-600 text-white"
                  : "border-sky-200 bg-white text-sky-800 hover:bg-sky-50"
              }`}
              aria-pressed={inputMode === "answer"}
            >
              Answer Mode
            </button>
            <button
              type="button"
              onClick={() => onInputModeChange("temp")}
              className={`display-cute rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition sm:text-sm ${
                inputMode === "temp"
                  ? "border-slate-800 bg-slate-800 text-white"
                  : "border-sky-200 bg-white text-sky-800 hover:bg-sky-50"
              }`}
              aria-pressed={inputMode === "temp"}
            >
              <span className="inline-flex items-center gap-1">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Pencil Mode
              </span>
            </button>
            <span className="display-cute rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 sm:text-sm">
              Incorrect: {incorrectCount} / {maxIncorrect}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border-2 border-sky-300 bg-white/55">
        <div className="grid grid-cols-9">
          {renderGrid.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onCellSelect(rowIndex, colIndex)}
                className={`relative flex aspect-square items-center justify-center text-base font-bold sm:text-lg ${
                  !showSolution && selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    ? "bg-cyan-100/70 ring-2 ring-inset ring-cyan-500"
                    : ""
                } ${
                  selectedDigit && value === selectedDigit ? "bg-sky-100/80" : ""
                } ${
                  flashingCells.includes(`${rowIndex}-${colIndex}`)
                    ? "bg-amber-100/80 ring-2 ring-inset ring-amber-400 animate-pulse"
                    : ""
                } ${getCellBorderClass(
                  rowIndex,
                  colIndex
                )}`}
              >
                {showSolution || givenMask[rowIndex][colIndex] ? (
                  <span className={value ? "text-slate-900" : "text-sky-300"}>{value}</span>
                ) : (
                  <>
                    {entryTypeGrid[rowIndex][colIndex] === "answer" && value ? (
                      <span className="pointer-events-none text-cyan-700">{value}</span>
                    ) : null}
                    {entryTypeGrid[rowIndex][colIndex] === "temp" && value ? (
                      <div className="pointer-events-none absolute inset-[2px] grid grid-cols-3 grid-rows-3 text-[9px] leading-none font-semibold text-slate-900 sm:text-[10px]">
                        {Array.from({ length: 9 }).map((_, digitIndex) => {
                          const digit = String(digitIndex + 1);
                          return (
                            <span
                              key={`${rowIndex}-${colIndex}-note-${digit}`}
                              className="flex items-center justify-center"
                            >
                              {value.includes(digit) ? digit : ""}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={inputMode === "temp" ? 9 : 1}
                      aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}`}
                      value={value}
                      onFocus={() => onCellFocus(rowIndex, colIndex)}
                      onKeyDown={(event) => {
                        const isSupportedKey =
                          /^[1-9]$/.test(event.key) ||
                          event.key === "Backspace" ||
                          event.key === "Delete" ||
                          event.key === "Enter";

                        if (isSupportedKey) {
                          event.preventDefault();
                          onCellKeyDown(rowIndex, colIndex, event.key);
                        }
                      }}
                      onChange={(event) => onCellChange(rowIndex, colIndex, event.target.value)}
                      className="absolute inset-0 h-full w-full bg-transparent text-transparent caret-transparent outline-none"
                    />
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {!showSolution &&
      inputMode === "temp" &&
      selectedCell &&
      !givenMask[selectedCell.row]?.[selectedCell.col] ? (
        <div className="mt-4 rounded-2xl border border-sky-200 bg-white/85 p-3">
          <p className="display-cute text-xs font-semibold uppercase tracking-wide text-sky-700 sm:text-sm">
            Cell {selectedCell.row + 1}, {selectedCell.col + 1} Notes
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:max-w-44">
            {Array.from({ length: 9 }).map((_, index) => {
              const digit = String(index + 1);
              const isActive = selectedCellNotes.includes(digit);
              return (
                <button
                  key={`note-pad-${selectedCell.row}-${selectedCell.col}-${digit}`}
                  type="button"
                  onClick={() => onToggleSelectedCellNote(digit)}
                  className={`display-cute rounded-lg border px-2 py-1 text-xs font-semibold transition sm:text-sm ${
                    isActive
                      ? "border-sky-600 bg-sky-600 text-white"
                      : "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {digit}
                </button>
              );
            })}
          </div>
          {selectedCellNotes ? (
            <p className="mt-2 text-xs font-medium text-sky-700 sm:text-sm">
              Active notes: {selectedCellNotes.split("").join(", ")}
            </p>
          ) : (
            <p className="mt-2 text-xs font-medium text-sky-700 sm:text-sm">
              No notes yet. Tap digits above to add notes.
            </p>
          )}
        </div>
      ) : null}

      {hintMessage ? (
        <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800">
          {hintMessage}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmitAnswers}
          disabled={showSolution}
          className="display-cute rounded-full border border-sky-300 bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800 transition hover:-translate-y-0.5 hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Submit Answers
        </button>
        <button
          type="button"
          onClick={onUseHint}
          disabled={showSolution}
          className="display-cute rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Hint Number
        </button>
        <button
          type="button"
          onClick={onRevealSolution}
          disabled={showSolution}
          className="display-cute rounded-full border border-cyan-200 bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {showSolution ? "Solution Shown" : "Reveal Solution"}
        </button>
        <button
          type="button"
          onClick={onGenerateAnother}
          className="display-cute rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-800 transition hover:-translate-y-0.5 hover:bg-sky-50"
        >
          Generate Another
        </button>
      </div>
    </article>
  );
}

export default SudokuCard;
