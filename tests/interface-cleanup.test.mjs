import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const text = (path) => readFile(new URL(path, root), "utf8");

test("Header has no try-this callout or its retired state", async () => {
  const header = await text("src/app/components/Header.js");
  const commandPalette = await text("src/app/components/CommandPalette.js");

  assert.doesNotMatch(
    header,
    /CurvedArrow|psst|try this|showArrow|hasOpenedCommandPalette|command-palette-opened/
  );
  assert.doesNotMatch(
    commandPalette,
    /hasOpenedCommandPalette|command-palette-opened/
  );
  await assert.rejects(
    text("src/app/components/CurvedArrow.js"),
    (error) => error.code === "ENOENT"
  );
});

test("Statusline starts with the about, projects, and writing windows", async () => {
  const statusline = await text("src/app/components/Statusline.js");

  assert.doesNotMatch(statusline, />\s*portfolio\s*</);
  assert.match(statusline, /<nav[\s\S]*?>\s*\{WINDOWS\.map/);
});
