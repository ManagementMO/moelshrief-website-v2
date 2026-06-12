export default function Pane({ path, meta, children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-sm overflow-hidden transition-colors hover:border-amber-500/40 dark:hover:border-amber-400/40 ${className}`}
    >
      <div className="flex items-center gap-2 px-3.5 py-1.5 border-b border-stone-200 dark:border-stone-800/80 font-mono text-xs">
        <span
          className="text-stone-400 dark:text-stone-600 select-none"
          aria-hidden="true"
        >
          ┌
        </span>
        <span className="text-amber-700 dark:text-amber-400 truncate">
          {path}
        </span>
        {meta ? (
          <span className="ml-auto shrink-0 text-micro tracking-[0.08em] uppercase text-stone-400 dark:text-stone-600">
            {meta}
          </span>
        ) : null}
      </div>
      <div className="p-3.5">{children}</div>
    </section>
  );
}
