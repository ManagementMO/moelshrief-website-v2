const USER = "ManagementMO";

// Returns { total, streak, commits, weeks } or null on any failure.
// weeks: array of up to 52 week-columns, each 7 slots of
// { date, count, level } | null padding.
export async function getActivity() {
  try {
    const [contribRes, eventsRes] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, {
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "moelshrief-wiki",
        },
        next: { revalidate: 3600 },
      }),
    ]);
    if (!contribRes.ok) return null;
    const contrib = await contribRes.json();
    const days = Array.isArray(contrib?.contributions)
      ? contrib.contributions
      : [];
    if (days.length === 0) return null;

    const total =
      contrib?.total?.lastYear ?? days.reduce((s, d) => s + (d.count || 0), 0);

    // consecutive active days counting back from today; a quiet today
    // doesn't break the streak
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) streak++;
      else if (i === days.length - 1) continue;
      else break;
    }

    let commits = [];
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      if (Array.isArray(events)) {
        commits = events
          .filter((e) => e?.type === "PushEvent" && e?.payload?.commits?.length)
          .flatMap((e) =>
            e.payload.commits.map((cm) => ({
              sha: (cm?.sha ?? "").slice(0, 7),
              repo: (e?.repo?.name ?? "").split("/")[1] ?? "",
              message: (cm?.message ?? "").split("\n")[0],
            }))
          )
          .filter((cm) => cm.sha && cm.repo && cm.message)
          .slice(0, 3);
      }
    }

    // align to week columns (pad the first week to its weekday)
    const firstDow = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const padded = [...Array(firstDow).fill(null), ...days];
    const weeks = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }

    return { total, streak, commits, weeks: weeks.slice(-52) };
  } catch {
    return null;
  }
}
