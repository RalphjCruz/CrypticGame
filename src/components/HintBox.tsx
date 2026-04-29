interface HintBoxProps {
  hint: string;
}

function HintBox({ hint }: HintBoxProps) {
  return (
    <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-pink-50 px-4 py-3 text-left shadow-sm shadow-violet-100">
      <p className="display-cute text-sm font-semibold text-violet-800">Hint</p>
      <p className="mt-1 text-sm text-violet-700 sm:text-base">{hint}</p>
    </div>
  );
}

export default HintBox;
