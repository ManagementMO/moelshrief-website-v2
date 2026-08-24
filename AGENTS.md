# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router site. Page routes and server data live in
`src/app`; reusable UI is in `src/app/components`, global styles are in
`src/app/globals.css`, and content helpers and registries sit beside the
routes. Static images and generated map assets belong in `public/`. Put
regeneration scripts in `scripts/`, focused Node tests in `tests/`, and design
or attribution notes in `docs/`.

## Build, Test, and Development Commands

- `npm run dev` starts the local site at port 8080 with live reload.
- `npm test` runs every `tests/*.test.mjs` file with Node's built-in test runner.
- `npm run lint` checks JavaScript and JSX with the repository ESLint config.
- `npm run build` performs the production Next.js compilation and static-page
  generation.
- For a new location map, edit `src/app/data/current-location.json`, then run
  `python scripts/generate-current-location-map.py` with `prettymaps` installed.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, and concise functional React
components. Name components and files in PascalCase (`CurrentLocationMap.js`),
data files in kebab-case (`current-location.json`), and Python scripts in
kebab-case. Prefer existing Tailwind utility patterns and design tokens over
new one-off CSS. Keep external links attributed and accessible; use meaningful
alt text and preserve dark/light theme classes.

## Testing Guidelines

Add a focused `tests/<feature>.test.mjs` regression test for new behavior,
including generated-asset existence when applicable. Run the full test, lint,
and build commands before opening a PR. For visual changes, inspect the page
at desktop and narrow mobile widths in both themes and confirm content stays
inside its containing pane.

## Commit & Pull Request Guidelines

Use short, imperative, conventional-style subjects such as `feat:`, `refine:`,
`fix:`, or `ci:`. Keep commits scoped and avoid unrelated formatting churn.
PRs should explain the user-facing change, list verification commands, call
out accessibility or attribution decisions, and include before/after screenshots
for visual work. Link an issue when one exists and make sure the branch is
rebased or mergeable before requesting review.
