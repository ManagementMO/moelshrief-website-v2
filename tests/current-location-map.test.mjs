import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const componentPath = path.join(root, "src/app/components/CurrentLocationMap.js");
const configPath = path.join(root, "src/app/data/current-location.json");
const heroPath = path.join(root, "src/app/components/TerminalHero.js");
const pagePath = path.join(root, "src/app/page.js");
const assetPath = path.join(root, "public/maps/los-angeles.png");

test("homepage includes the configurable current location map", () => {
  const component = fs.readFileSync(componentPath, "utf8");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const hero = fs.readFileSync(heroPath, "utf8");
  const homepage = fs.readFileSync(pagePath, "utf8");

  assert.match(homepage, /CurrentLocationMap/);
  assert.match(hero, /sm:top-5 sm:right-5/);
  assert.match(hero, /sm:pr-\[240px\]/);
  assert.match(component, /current-location\.json/);
  assert.match(component, /location\.caption/);
  assert.match(component, /OpenStreetMap data/);
  assert.equal(config.caption, "Currently in:");
  assert.equal(config.city, "Los Angeles");
  assert.equal(config.slug, "los-angeles");
  assert.ok(fs.statSync(assetPath).size > 100_000);
});
