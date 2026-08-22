import Pane from "./Pane";

const LEVEL_CLASSES = ["hm-0", "hm-1", "hm-2", "hm-3", "hm-4"];

export default function ActivityPane({ activity }) {
  if (!activity) return null;
  const { total, streak, commits, weeks } = activity;

  return (
    <Pane path="~/activity" meta="github · cached 1h">
      <div className="flex gap-[2px]" aria-hidden="true">
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className={`hm-w ${
              wi < weeks.length - 26 ? "hidden sm:flex" : "flex"
            }`}
          >
            {week.map((day, di) => (
              <span
                key={di}
                className={`hm-c ${
                  day ? LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0] : "hm-x"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-stone-500 dark:text-stone-500 mt-2.5">
        <span className="text-stone-800 dark:text-stone-200">{total}</span>{" "}
        contributions in the last year
        {streak > 0 && (
          <>
            {" · "}
            <span className="text-stone-800 dark:text-stone-200">
              {streak}d
            </span>{" "}
            streak
          </>
        )}
      </p>
      {commits.length > 0 && (
        <div className="mt-2 flex flex-col gap-1 font-mono text-xs min-w-0">
          {commits.map((cm) => (
            <div key={cm.sha} className="truncate">
              <span className="text-amber-700 dark:text-amber-400">
                {cm.sha}
              </span>{" "}
              <span className="text-sky-700 dark:text-sky-400">{cm.repo}</span>{" "}
              <span className="text-stone-500 dark:text-stone-500">
                — {cm.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </Pane>
  );
}
