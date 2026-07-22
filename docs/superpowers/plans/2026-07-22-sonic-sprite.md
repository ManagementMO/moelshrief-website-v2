# Sonic Sprite Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an authentic Sonic 2 sprite to the far-right of the footer row that stands at rest and runs in place on hover or press.

**Architecture:** A zero-state `SonicSprite` server component renders decorative spans. Two local, transparent PNG assets provide the idle frame and four-frame Full Speed strip; CSS handles all playback, touch, and reduced-motion behavior. `Footer` remains server-rendered and uses a space-between row for social icons on the left and Sonic on the right.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 3, plain CSS keyframes, Node's built-in test runner, ImageMagick for deterministic asset extraction.

## Global Constraints

- Work only on the local/remote `sonic` branch.
- Use authentic Sonic the Hedgehog 2 Genesis pixels sourced from The Spriters Resource asset 10073.
- Keep each visual frame on a transparent 48×48 canvas and the interaction area at 56×56 CSS pixels.
- Loop four Full Speed frames in 320 milliseconds with CSS `steps(4, end)`.
- Keep `Footer` server-compatible and add no runtime dependency.
- Keep Sonic decorative, non-focusable, and hidden from assistive technology.
- Under `prefers-reduced-motion: reduce`, always show only the idle frame.
- Do not alter `ActivityPane`, the shared `Pane`, icon behavior, or site palette.

---

## File structure

- Create `public/sprites/sonic/idle.png`: transparent 48×48 idle pose.
- Create `public/sprites/sonic/run.png`: transparent 192×48 strip containing four 48×48 Full Speed frames.
- Create `public/sprites/sonic/SOURCE.md`: source, credit, checksum, and ownership note.
- Create `src/app/components/SonicSprite.js`: decorative sprite markup only.
- Modify `src/app/components/Footer.js`: compose the sprite opposite the social icons.
- Modify `src/app/globals.css`: sprite visuals, keyframes, pointer states, and reduced-motion override.
- Create `tests/sonic-sprite.test.mjs`: asset and integration contract tests.
- Modify `package.json`: expose the zero-dependency Node test command.

### Task 1: Add a failing sprite contract test

**Files:**
- Create: `tests/sonic-sprite.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: repository source files and PNG IHDR bytes.
- Produces: `npm test`, which verifies asset dimensions, decorative markup, footer composition, interaction selectors, timing, and reduced motion.

- [ ] **Step 1: Add the test script to `package.json`**

Add `"test": "node --test tests/*.test.mjs"` before the existing `dev` script.

- [ ] **Step 2: Write `tests/sonic-sprite.test.mjs`**

```js
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
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm test`

Expected: FAIL because `public/sprites/sonic/idle.png`, `run.png`, and `SonicSprite.js` do not exist.

### Task 2: Extract and document the authentic sprite assets

**Files:**
- Create: `public/sprites/sonic/idle.png`
- Create: `public/sprites/sonic/run.png`
- Create: `public/sprites/sonic/SOURCE.md`

**Interfaces:**
- Consumes: source sheet `https://www.spriters-resource.com/media/assets/10/10073.png?updated=1755472454`, SHA-256 `13802d67234c3937cc9397f6d1ab5948974944e6d7fcca472c937bbcbbf6c428`.
- Produces: `/sprites/sonic/idle.png` at 48×48 and `/sprites/sonic/run.png` at 192×48.

- [ ] **Step 1: Download and validate the source sheet in a temporary directory**

Use a browser user-agent and the asset page as referer, then verify the exact source checksum before extraction.

- [ ] **Step 2: Extract the idle frame and four Full Speed cells**

Crop the idle cell at `59x61+23+250`. Crop Full Speed cells at y=333, width=59, height=61, and x offsets `544 607 669 732`. Replace the exact cell background color `rgb(13,72,7)` with alpha, preserve each pose on its original 48×48 inner crop, and append the four cells horizontally in order.

- [ ] **Step 3: Add `SOURCE.md`**

Record the game, owner (Sega/Sonic Team), sheet page, asset URL, ripper credits (Triangly and Paraemon), source checksum, extraction coordinates, and a statement that the game artwork is not covered by the repository's code license.

- [ ] **Step 4: Run the asset test**

Run: `npm test -- --test-name-pattern="Sonic assets"`

Expected: the asset test passes; integration tests remain failing until Task 3.

### Task 3: Implement the component and CSS interaction

**Files:**
- Create: `src/app/components/SonicSprite.js`
- Modify: `src/app/components/Footer.js`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `/sprites/sonic/idle.png` and `/sprites/sonic/run.png`.
- Produces: `SonicSprite()` with no props or client state.

- [ ] **Step 1: Create `SonicSprite.js`**

```jsx
export default function SonicSprite() {
  return (
    <span className="sonic-sprite" aria-hidden="true">
      <span className="sonic-sprite__idle" />
      <span className="sonic-sprite__run" />
    </span>
  );
}
```

- [ ] **Step 2: Compose the sprite inside `Footer`**

Import `SonicSprite`. Keep the divider and icon anchors unchanged, wrap the icon group and `<SonicSprite />` in an `items-center justify-between` row, and keep the icon group as the left child.

- [ ] **Step 3: Add the sprite CSS to `globals.css`**

```css
@keyframes sonic-run-cycle {
  from { background-position: 0 0; }
  to { background-position: -192px 0; }
}

.sonic-sprite {
  position: relative;
  display: block;
  flex: 0 0 56px;
  width: 56px;
  height: 56px;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

.sonic-sprite__idle,
.sonic-sprite__run {
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 48px;
  height: 48px;
  background-repeat: no-repeat;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  pointer-events: none;
}

.sonic-sprite__idle { background-image: url("/sprites/sonic/idle.png"); }

.sonic-sprite__run {
  background-image: url("/sprites/sonic/run.png");
  background-size: 192px 48px;
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .sonic-sprite:hover .sonic-sprite__idle { opacity: 0; }
  .sonic-sprite:hover .sonic-sprite__run {
    opacity: 1;
    animation: sonic-run-cycle 320ms steps(4, end) infinite;
  }
}

.sonic-sprite:active .sonic-sprite__idle { opacity: 0; }
.sonic-sprite:active .sonic-sprite__run {
  opacity: 1;
  animation: sonic-run-cycle 320ms steps(4, end) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .sonic-sprite:hover .sonic-sprite__idle,
  .sonic-sprite:active .sonic-sprite__idle { opacity: 1; }
  .sonic-sprite:hover .sonic-sprite__run,
  .sonic-sprite:active .sonic-sprite__run {
    opacity: 0;
    animation: none;
  }
}
```

- [ ] **Step 4: Run GREEN verification**

Run: `npm test && npm run lint && npm run build`

Expected: all commands exit 0 without errors.

- [ ] **Step 5: Commit and push**

Commit the plan, tests, assets, provenance, component, integration, and CSS on `sonic`; push to `origin/sonic`.

### Task 4: Browser verification and local handoff

**Files:** none.

**Interfaces:**
- Consumes: production code from Tasks 1–3.
- Produces: a live local site at `http://localhost:8080` and visual evidence.

- [ ] **Step 1: Start `npm run dev` and keep the process running**

Expected: Next.js reports ready at `http://localhost:8080`.

- [ ] **Step 2: Verify normal motion at desktop width**

Confirm idle imagery, hover into a non-idle run frame, mouse-out back to idle, no overlap, and no horizontal layout shift. Capture the integrated card screenshot.

- [ ] **Step 3: Verify light mode and 375px mobile width**

Confirm the sprite stays crisp at the footer's right edge while all five social icons remain readable and left-aligned.

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`, hover the hit area, and confirm the idle background remains visible while the run layer stays hidden with no animation.

- [ ] **Step 5: Leave the server running and report the URL**

Keep the dev process alive for the user to inspect locally.
