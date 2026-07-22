import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const text = (path) => readFile(new URL(path, root), "utf8");

async function pngSize(path) {
  const data = await readFile(new URL(path, root));
  assert.equal(data.toString("ascii", 1, 4), "PNG");
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

test("Sonic assets use the fixed idle cell and full-speed strip", async () => {
  assert.deepEqual(await pngSize("public/sprites/sonic/idle.png"), {
    width: 48,
    height: 48,
  });
  assert.deepEqual(await pngSize("public/sprites/sonic/run.png"), {
    width: 192,
    height: 48,
  });
});

test("Sonic stays decorative and is composed on the right of Footer", async () => {
  const [sprite, footer, activity] = await Promise.all([
    text("src/app/components/SonicSprite.js"),
    text("src/app/components/Footer.js"),
    text("src/app/components/ActivityPane.js"),
  ]);

  assert.match(sprite, /aria-hidden="true"/);
  assert.match(sprite, /sonic-sprite__idle/);
  assert.match(sprite, /sonic-sprite__run/);
  assert.doesNotMatch(sprite, /tabIndex|role=|onClick/);
  assert.match(footer, /import SonicSprite from "\.\/SonicSprite"/);
  assert.match(footer, /justify-between/);
  assert.match(footer, /<SonicSprite \/>/);
  assert.doesNotMatch(activity, /SonicSprite|pr-14/);
});

test("CSS runs on hover and press but freezes for reduced motion", async () => {
  const css = await text("src/app/globals.css");

  assert.match(css, /@keyframes sonic-run-cycle/);
  assert.match(css, /320ms steps\(4, end\) infinite/);
  assert.match(css, /\.sonic-sprite:hover \.sonic-sprite__run/);
  assert.match(css, /\.sonic-sprite:active \.sonic-sprite__run/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /image-rendering: pixelated/);
});
