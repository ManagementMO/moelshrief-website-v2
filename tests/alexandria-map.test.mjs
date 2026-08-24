import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const componentPath = path.join(root, "src/app/components/AlexandriaMap.js");
const filesystemPath = path.join(root, "src/app/components/terminal/fs.js");
const pagePath = path.join(root, "src/app/page.js");
const assetPath = path.join(root, "public/maps/alexandria.png");

test("homepage includes the credited Alexandria origin map", () => {
  const component = fs.readFileSync(componentPath, "utf8");
  const filesystem = fs.readFileSync(filesystemPath, "utf8");
  const homepage = fs.readFileSync(pagePath, "utf8");

  assert.doesNotMatch(filesystem, /AlexandriaMap/);
  assert.match(homepage, /AlexandriaMap/);
  assert.match(component, /maps\/alexandria\.png/);
  assert.match(component, /OpenStreetMap data/);
  assert.match(component, /first coordinates/);
  assert.doesNotMatch(component, /the map keeps going/);
  assert.ok(fs.statSync(assetPath).size > 100_000);
});
