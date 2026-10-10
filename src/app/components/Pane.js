export default function Pane({ path, meta, children, className = "" }) {
  return (
    <section
      className={`pane ${className}`}
    >
      <div className="pane-header">
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
