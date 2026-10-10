import assert from "node:assert/strict";
import test from "node:test";
import { activitySummary, renderActivityHeatmap } from "../src/app/lib/activity-heatmap.mjs";

test("terminal activity retains the last twelve weekly totals, stats, and commits without daily records", () => {
  const activity = {
    total: 42,
    streak: 3,
    commits: [{ sha: "abc1234", repo: "portfolio", message: "fix" }],
    weeks: Array.from({ length: 14 }, (_, index) => [
      null,
      { date: "2026-10-01", count: index, level: 2 },
      { count: 1, level: 1 },
    ]),
  };
  const summary = activitySummary(activity);
  assert.deepEqual(summary, {
    total: 42,
    streak: 3,
    commits: activity.commits,
    weekCount: 14,
    weeklyTotals: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  });
  assert.equal(activitySummary(null), null);
  assert.deepEqual(activitySummary({ ...activity, weeks: [] }).weeklyTotals, []);
  assert.ok(!JSON.stringify(summary).includes("2026-10-01"));
});

test("SVG keeps calendar positions, empty-day padding, and every contribution level", () => {
  const svg = renderActivityHeatmap([
    [null, { level: 0 }, { level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }],
  ]);
  assert.equal([...svg.matchAll(/<rect\b/g)].length, 5);
  assert.ok(!svg.includes("y:calc(0 *"));
  for (let level = 0; level < 5; level++) assert.ok(svg.includes(`class="l${level}"`));
  assert.match(svg, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /rx:2px/);
  assert.match(svg, /prefers-color-scheme:dark/);
  assert.match(svg, /\.l0\{fill:rgb\(231 229 228 \/ \.7\)\}/);
  assert.match(svg, /\.l4\{fill:#f59e0b\}/);
  assert.match(svg, /\.l0\{fill:rgb\(41 37 36 \/ \.6\)\}/);
});

test("mobile SVG shows the most recent 26 weeks and ignores unsafe provider levels and text", () => {
  const weeks = Array.from({ length: 52 }, (_, index) => [
    { level: index < 26 ? 4 : 1, date: "</style><script>alert(1)</script>" },
  ]);
  const mobile = renderActivityHeatmap(weeks, 26);
  const desktop = renderActivityHeatmap(weeks);
  assert.equal([...mobile.matchAll(/<rect\b/g)].length, 26);
  assert.equal([...desktop.matchAll(/<rect\b/g)].length, 52);
  assert.ok(!mobile.includes('class="l4"'));
  assert.ok(!mobile.includes("<script"));
  assert.match(renderActivityHeatmap([[{ level: "</style>" }]]), /class="l0"/);
  assert.match(renderActivityHeatmap([]), /width:calc\(\(100% - 0px\) \/ 1\)/);
});
