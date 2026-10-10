import Pane from "./Pane";

export default function ActivityPane({ activity }) {
  if (!activity) return null;
  const { total, streak, commits, weekCount } = activity;

  return (
    <Pane path="~/activity" meta="github · cached 1h">
      <div
        className="activity-heatmap"
        aria-hidden="true"
        style={{
          "--mobile-columns": Math.max(Math.min(weekCount, 26), 1),
          "--desktop-columns": Math.max(weekCount, 1),
        }}
      >
        <picture>
          <source media="(min-width: 640px)" srcSet="/activity.svg?columns=52" />
          {/* Native picture/img preserves no-JS rendering and SVG theme inheritance. */}
          <img src="/activity.svg?columns=26" alt="" width={258} height={68} />
        </picture>
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
