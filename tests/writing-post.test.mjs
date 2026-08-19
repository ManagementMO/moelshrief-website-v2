import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const text = (path) => readFile(new URL(path, root), "utf8");
const postRoot = "src/app/writing/fairer-world-cup-schedule/";

test("World Cup schedule article is published in the writing registry", async () => {
  const registry = await text("src/app/writing/posts.js");
  assert.match(registry, /slug: "fairer-world-cup-schedule"/);
  assert.match(registry, /title: "can a world cup schedule be fairer\?"/);
  assert.match(registry, /published: true/);
});

test("Article keeps the native site shell and required evidence figures", async () => {
  const page = await text(`${postRoot}page.js`);
  assert.match(page, /className=\{styles\.articleChrome\}/);
  assert.match(page, /~\/writing\/fairer-world-cup-schedule\.md/);
  assert.doesNotMatch(page, /import Pane/);
  assert.match(page, /<RouteComparison mapData=\{mapData\}/);
  assert.match(page, /<PolicyExplorer mapData=\{mapData\}/);
  assert.match(page, /<BudgetKnee \/>/);
  assert.match(page, /<h2>What I learned<\/h2>/);
  assert.match(page, /An optimization model searches through many valid schedules/);
  assert.match(page, /“infeasible” does not mean/);
  assert.match(page, /Competitive Neutrality Index/);

  const chart = await text(`${postRoot}BudgetKnee.js`);
  assert.match(chart, /className=\{styles\.chartAxisLine\}/);
  assert.match(chart, /\{point\.k\}/);
  assert.match(chart, /allowed match moves/);
});

test("Active article copy avoids em and en dashes", async () => {
  const files = [
    "page.js",
    "PolicyExplorer.js",
    "RouteComparison.js",
    "BudgetKnee.js",
    "scheduleData.js",
  ];
  const offenders = [];
  for (const file of files) {
    if (/[—–]/.test(await text(`${postRoot}${file}`))) offenders.push(file);
  }
  assert.deepEqual(offenders, []);
});
