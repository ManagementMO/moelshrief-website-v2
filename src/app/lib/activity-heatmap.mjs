// Only the terminal's aggregate statistics need to cross the client boundary.
export function activitySummary(activity) {
  if (!activity) return null;
  const { total, streak, commits, weeks } = activity;
  return {
    total,
    streak,
    commits,
    weekCount: weeks.length,
    weeklyTotals: weeks.slice(-12).map((week) =>
      week.reduce((sum, day) => sum + (day?.count ?? 0), 0)
    ),
  };
}

// SVG geometry is relative to the image viewport, so 2px gutters, 2px corner
// radii, and square cells match the original flex grid at every screen width.
// Only numeric positions and a bounded level are interpolated; provider text
// is never embedded in this XML document.
export function renderActivityHeatmap(weeks, columns = 52) {
  const visible = weeks.slice(-columns);
  const count = Math.max(visible.length, 1);
  const cells = visible.flatMap((week, wi) =>
    week.flatMap((day, di) => {
      if (!day) return [];
      const level = Number.isInteger(day.level) && day.level >= 0 && day.level <= 4
        ? day.level
        : 0;
      return [`<rect class="l${level}" style="x:calc(${wi} * (100% + 2px) / ${count});y:calc(${di} * (100% + 2px) / 7)"/>`];
    })
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><style>
rect{width:calc((100% - ${2 * (count - 1)}px) / ${count});height:calc((100% - 12px) / 7);rx:2px}
.l0{fill:rgb(231 229 228 / .7)}.l1{fill:#fde68a}.l2{fill:#fcd34d}.l3{fill:#fbbf24}.l4{fill:#f59e0b}
@media(prefers-color-scheme:dark){.l0{fill:rgb(41 37 36 / .6)}.l1{fill:rgb(120 53 15 / .7)}.l2{fill:rgb(180 83 9 / .8)}.l3{fill:rgb(245 158 11 / .9)}.l4{fill:#fbbf24}}
</style>${cells}</svg>`;
}
