export default function AsciiDivider({ label }) {
  if (!label) {
    return (
      <div className="font-mono text-micro tracking-widest text-stone-400 dark:text-stone-600 select-none my-4 text-center truncate">
        ────────────────────────────────────────────────────────────────────────────────────────────────
      </div>
    );
  }
  return (
    <div className="font-mono text-micro tracking-widest text-stone-400 dark:text-stone-600 select-none flex items-center gap-3 my-4">
      <span className="flex-1 truncate">
        ────────────────────────────────────────────────
      </span>
      <span className="uppercase">{label}</span>
      <span className="flex-1 truncate">
        ────────────────────────────────────────────────
      </span>
    </div>
  );
}
