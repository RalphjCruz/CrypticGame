interface HintBoxProps {
  hint: string;
}

function HintBox({ hint }: HintBoxProps) {
  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-cyan-50 to-sky-100 px-4 py-3 text-left shadow-sm shadow-sky-100">
      <p className="display-cute text-sm font-semibold text-sky-900">Hint</p>
      <p className="mt-1 text-sm text-sky-800 sm:text-base">{hint}</p>
    </div>
  );
}

export default HintBox;
