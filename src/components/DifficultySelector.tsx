import type { Difficulty } from "../types/puzzle";

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

function DifficultySelector({
  selectedDifficulty,
  onSelectDifficulty,
}: DifficultySelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {difficulties.map((difficulty) => {
        const isSelected = selectedDifficulty === difficulty;

        return (
          <button
            key={difficulty}
            type="button"
            onClick={() => onSelectDifficulty(difficulty)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all sm:text-base ${
              isSelected
                ? "border-pink-600 bg-pink-500 text-white shadow-md shadow-pink-200"
                : "border-pink-200 bg-white text-rose-700 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-rose-50"
            }`}
            aria-pressed={isSelected}
          >
            {difficulty}
          </button>
        );
      })}
    </div>
  );
}

export default DifficultySelector;
