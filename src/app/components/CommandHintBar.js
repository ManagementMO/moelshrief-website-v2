export default function CommandHintBar() {
  const k =
    "px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-micro text-stone-600 dark:text-stone-400";
  return (
    <div className="flex flex-wrap items-center gap-3 text-micro font-mono text-stone-500 dark:text-stone-500 mt-4">
      <span className="flex items-center gap-1">
        <kbd className={k}>⌘</kbd>
        <kbd className={k}>K</kbd> palette
      </span>
      <span>·</span>
      <span className="flex items-center gap-1">
        <kbd className={k}>shift</kbd>+<kbd className={k}>T</kbd> theme
      </span>
      <span>·</span>
      <span className="flex items-center gap-1">
        <kbd className={k}>shift</kbd>+<kbd className={k}>S</kbd> stats
      </span>
    </div>
  );
}
