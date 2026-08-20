import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const text = (path) => readFile(new URL(path, root), "utf8");
const postRoot = "src/app/writing/fairer-world-cup-schedule/";
const eduroamRoot = "src/app/writing/how-eduroam-works/";

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

test("eduroam explainer is published as a five-minute article", async () => {
  const registry = await text("src/app/writing/posts.js");
  assert.match(registry, /slug: "how-eduroam-works"/);
  assert.match(registry, /title: "how eduroam works"/);
  assert.match(registry, /readMins: 5/);
  assert.match(registry, /published: true/);
});

test("eduroam explainer teaches the architecture with sourced visuals", async () => {
  const page = await text(`${eduroamRoot}page.js`);
  assert.match(page, /<NetworkMap mapData=\{mapData\}/);
  assert.match(page, /<PacketJourney \/>/);
  assert.match(page, /<IdentityEnvelope \/>/);
  assert.match(page, /<TrafficSplit \/>/);
  assert.match(page, /I used eduroam for years/);
  assert.match(page, /If you have ever opened your\s+laptop/);
  assert.match(page, /<h2>The basic idea<\/h2>/);
  assert.match(page, /<h2>How the username is protected<\/h2>/);
  assert.match(page, /<h2>Where my internet traffic goes<\/h2>/);
  assert.match(page, /<h2>What I came away with<\/h2>/);
  assert.match(page, /The official explanations quickly led me/);
  assert.doesNotMatch(page, /clever part|part I nearly misunderstood|worth remembering/i);
  assert.match(page, /Do not enter eduroam credentials into a web page/);
  assert.match(page, /rfc\/rfc7593\.html/);
  assert.match(page, /eduroam-security/);

  const map = await text(`${eduroamRoot}NetworkMap.js`);
  assert.match(map, /An example: Berlin asks Waterloo/);
  assert.match(map, /sign-in request/);
  assert.match(map, /className=\{styles\.routeDirection\}/);
  assert.match(map, /from "motion\/react-client"/);
  assert.match(map, /whileInView="visible"/);
  assert.match(map, /single arrow only shows/);
  assert.doesNotMatch(map, /browsing stays local|local internet|<marker|markerEnd|authArrow|localArrow/);

  const geometry = await text(`${eduroamRoot}mapGeometry.js`);
  assert.doesNotMatch(geometry, /gateway|browse|answer/);

  const journey = await text(`${eduroamRoot}PacketJourney.js`);
  const figures = await text(`${eduroamRoot}ProtocolFigures.js`);
  assert.match(journey, /Your device connects/);
  assert.match(figures, /your device/);

  const css = await text(`${eduroamRoot}article.module.css`);
  assert.match(css, /:global\(\.dark\) \.articlePath \{\s+color: #fbbf24;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.authMapRoute/);
  assert.doesNotMatch(css, /#54d8f2|#64dff5|#73e6f7|#a79dff/i);
});

test("Motion imports use the current package", async () => {
  const packageJson = await text("package.json");
  const explorer = await text(`${postRoot}PolicyExplorer.js`);
  const reveal = await text("src/app/components/Reveal.js");
  assert.match(packageJson, /"motion": "\^13\.1\.0"/);
  assert.doesNotMatch(packageJson, /framer-motion/);
  assert.match(explorer, /from "motion\/react"/);
  assert.match(reveal, /from "motion\/react"/);
});
