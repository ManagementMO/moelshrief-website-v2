# Sonic Sprite Interaction — Design Spec

**Date:** 2026-07-22  
**Branch:** `sonic`  
**Status:** Approved by Mo in chat

## Goal

Add a small, authentic 16-bit Sonic the Hedgehog sprite to the bottom-right of
the home page's `~/activity` pane. Sonic stands still by default and changes to
his classic Sonic 2 running cycle only while the visitor is interacting with
the sprite.

The interaction should feel like a discovered portfolio easter egg, not a new
visual theme or a competing call to action.

## Chosen approach

Use authentic Sonic 2 frames packaged as local PNG assets and animate the run
sequence with CSS `steps()`. Keep `ActivityPane` server-compatible: the sprite
requires no React state, timers, canvas, or third-party runtime dependency.

This approach was selected over:

- Swapping to an animated GIF, which offers weaker playback and reset control.
- A JavaScript or canvas animator, which adds runtime complexity without a
  visible benefit for a single hover interaction.

## Visual design

- Place Sonic inside the activity pane body, anchored to its bottom-right
  corner and visually grounded against the pane's lower edge.
- Normalize each source pose into a transparent 48×48-pixel cell without
  scaling the original pixels. Render that cell at exactly 48×48 CSS pixels on
  every viewport with `image-rendering: pixelated`.
- Give Sonic a 56×56-pixel interaction area and reserve 56 pixels at the right
  of the statistics/commit region. The heatmap keeps its full width.
- Do not add a glow, platform, badge, caption, tooltip, or new accent color.
  Sonic is the single decorative flourish; the existing stone/amber terminal
  system remains unchanged.
- Reserve enough space in the pane body that the sprite never covers live
  GitHub statistics or commit text and never changes the pane's width.

## Interaction

- Resting state: one authentic standing Sonic frame.
- Fine-pointer hover over Sonic's 56×56-pixel hit area: switch immediately to
  an eight-frame Sonic 2 run cycle, looping in place every 560 milliseconds.
- Pointer exit: return immediately to the standing frame.
- Touch/pen press: run while pressed, then return to standing.
- The sprite is decorative, so it is not keyboard-focusable and is hidden from
  assistive technology.
- Under `prefers-reduced-motion: reduce`, Sonic remains on the standing frame
  for every input state.

## Assets and provenance

- Store all frames in `public/sprites/sonic/`; do not hotlink a remote asset.
- Source the authentic character artwork from the Sonic the Hedgehog 2 (Sega
  Genesis) character sheet catalogued by The Spriters Resource:
  <https://www.spriters-resource.com/sega_genesis/sonicth2/>.
- Add a short provenance file beside the assets identifying Sonic and the
  original game artwork as Sega/Sonic Team property. Do not imply that the
  artwork is original portfolio art or covered by the repository's code
  license.
- Optimize the checked-in PNGs without smoothing or recoloring their pixels.

## Component boundaries

- Add a focused `SonicSprite` component responsible only for semantic wrapper
  markup and sprite-state classes.
- Compose it inside `ActivityPane`, whose body becomes the positioning context.
- Keep sprite animation rules together in `globals.css`, including responsive
  sizing and the reduced-motion override.
- Do not modify the shared `Pane` primitive or the site-wide footer.

## Failure and fallback behavior

- If GitHub activity is unavailable, `ActivityPane` already renders nothing;
  Sonic should also be absent rather than floating independently.
- If the run asset cannot load, the standing image remains the fallback visual.
- If CSS animation is unsupported, the standing frame remains visible.

## Verification

1. Confirm local and remote branches are both named `sonic` and track each
   other.
2. Run `npm run lint` and `npm run build`.
3. Browser-check the home page in dark and light modes at desktop and 375px
   mobile widths.
4. Confirm standing, hover-running, pointer-exit, and touch/active states.
5. Emulate `prefers-reduced-motion: reduce` and confirm the run cycle never
   starts.
6. Confirm the sprite does not overlap long contribution totals, streak text,
   or recent commit rows.
7. Capture a final screenshot showing the integrated sprite in the requested
   card location.

## Out of scope

- Sound effects, rings, trails, spin-dash, autonomous movement, or page-wide
  game mechanics.
- Changes to the contribution heatmap, footer icons, card copy, or global color
  palette.
- New animation libraries or a general-purpose sprite engine.
