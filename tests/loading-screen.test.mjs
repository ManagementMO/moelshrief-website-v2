import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const text = (path) => readFile(new URL(path, root), "utf8");

test("LoadingScreen components exist and export expected components", async () => {
  const glassContainer = await text("src/app/components/loading/GlassContainer.js");
  assert.match(glassContainer, /export default function GlassContainer/);
  assert.match(glassContainer, /backdropFilter/);

  const loadingProgress = await text("src/app/components/loading/LoadingProgress.js");
  assert.match(loadingProgress, /export default function LoadingProgress/);
  assert.match(loadingProgress, /role="progressbar"/);
  assert.match(loadingProgress, /aria-busy/);
  assert.match(loadingProgress, /aria-valuenow/);

  const loadingAnimation = await text("src/app/components/loading/LoadingAnimation.js");
  assert.match(loadingAnimation, /export default function LoadingAnimation/);
  assert.match(loadingAnimation, /motion-reduce:animate-none/);

  const loadingScreen = await text("src/app/components/loading/LoadingScreen.js");
  assert.match(loadingScreen, /export default function LoadingScreen/);
  assert.match(loadingScreen, /GlassContainer/);
  assert.match(loadingScreen, /LoadingProgress/);
  assert.match(loadingScreen, /LoadingAnimation/);
});

test("RootLayout imports and renders LoadingScreen component", async () => {
  const layout = await text("src/app/layout.js");
  assert.match(layout, /components\/loading\/LoadingScreen/);
  assert.match(layout, /<LoadingScreen \/>/);
});
