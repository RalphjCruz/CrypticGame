interface HintBoxProps {
  hint: string;
}

function HintBox({ hint }: HintBoxProps) {
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-left">
      <p className="text-sm font-semibold text-violet-800">Hint</p>
      <p className="mt-1 text-sm text-violet-700 sm:text-base">{hint}</p>
    </div>
  );
}

export default HintBox;
