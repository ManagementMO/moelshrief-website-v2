# Terminal Portfolio Enhancement — Design Spec

**Date:** 2026-06-12
**Branch:** `new-terminal`
**Status:** Approved by Mo (brainstorm session, visual companion direction B + statusline from C)

## Context

moelshrief.wiki is a Next.js 14 (App Router, JavaScript) portfolio with a terminal/engineer identity: a 540px single column on a dot-grid background, stone palette with amber accent, JetBrains Mono for terminal chrome, Geist Sans extralight for body text. The home page centers on a fully interactive terminal (virtual filesystem, tab-complete, readline keys, persistent history). The projects page predates this identity — generic image cards that read as a different site. MDX, framer-motion, cmdk, and @tailwindcss/typography are installed; MDX and the `Signature` component are unused.

## Goals

1. Carry the terminal identity through every surface (projects page is the worst offender).
2. Add depth: more terminal capability, a writing section, live GitHub activity.
3. Stay clean: 540px column, quiet palette, zero new runtime dependencies.
4. "Quietly alive" motion: ambient signals you notice on the second visit, never theatrics; `prefers-reduced-motion` respected everywhere.

## Decisions from brainstorming

| Question | Decision |
|---|---|
| Scope | Full sweep (projects redesign + terminal depth + new sections + polish) |
| Content sources | GitHub activity (live data), Mo's writing (he provides posts), archived projects (FocusForge, Scam-mah, VBA finance tool) |
| No resume | No resume PDF / resume command |
| Motion | Quietly alive |
| Visual direction | **B — terminal chrome, readable body** (pane cards), plus one element of C: a tmux statusline |
| Footer | No copyright line, no location pin — icons left, compact signature right |

## 1 · Architecture

Routes: `/` (about + activity pane), `/projects`, `/writing` (new), `/writing/[slug]` (new), terminal-styled `not-found`.

- Header nav becomes `$ about projects writing`.
- No dedicated activity page — GitHub activity is a pane on home.
- Zero new runtime dependencies. Everything uses installed packages.

### Pane component (shared primitive)

A `Pane` component is the visual unit of direction B, used by the activity pane, project cards, and writing post shell:

- Title bar: dim `┌` glyph, amber monospace path (e.g. `~/projects/trace`), right-aligned micro meta text (uppercase, dimmer), bottom border.
- Body: free-form children, padded.
- Container: `border-stone-300 dark:border-stone-800`, rounded-lg, `bg-stone-50/60 dark:bg-stone-900/40` (matches TerminalHero), hover border shifts toward amber.

## 2 · Projects page (direction B)

- Context line at top: `mohammed@portfolio:~/projects$ ls --detail` + dim `· 6 entries · sorted by year`.
- Search input restyled as a grep prompt: `$ grep -ri ` prefix, inline input, mono, amber caret. Same client-side filtering (now also matches archive rows). Empty state: `grep: no matches in ~/projects` (rose).
- Main projects (TRACE, Meta-Harness, Paybridge) render as Pane cards:
  - Title bar path `~/projects/<slug>`, meta like `2025 · ★ ACTIVE` (TRACE, Meta-Harness) or `2024` (Paybridge).
  - Body: name (sans, medium, bright), existing description text (sans extralight), existing micro uppercase tech chips, action row of command-styled links: `$ open demo ↗`, `$ git clone`, each using the existing `Link` blinking-cursor hover.
- **Images intentionally removed** from the projects index. Text-first panes; visuals live behind the demo links. Project image assets stay in `/public` (unused by this page).
- Archive: `AsciiDivider` labeled `archive`, then one `ls -l`-style mono row per archived project: permissions column (`-rw-r--r--`), linked name, year, dim one-line description. Data: FocusForge, Scam-mah, VBA finance tool — titles/links/blurbs recovered from this repo's git history (the pre-trim projects list); any entry without a recoverable link renders as plain text, never a dead link. Descriptions kept to one line.
- Pane cards get a soft 0.3s fade-up on first reveal (framer-motion, `once`, motion-safe only).

## 3 · Terminal expansion (TerminalHero)

### Filesystem additions

```
~/
├── about.md            (existing)
├── contact.md          (existing)
├── work.txt            (existing)
├── writing/            NEW — mirrors the posts registry; cat <post> → summary + link, open <post> → /writing/<slug>
├── projects/
│   ├── trace           (existing)
│   ├── meta-harness    (existing)
│   ├── paybridge       NEW
│   └── archive/        NEW — focusforge, scam-mah, vba-finance-tool
├── .secrets            NEW — hidden; cat → playful redacted output (█████ blocks)
└── .bashrc             NEW — hidden; cat → joke aliases (e.g. alias work="coffee && code")
```

Hidden files appear only with `ls -a` / `ls -la`. Autocomplete includes new paths and commands.

### New commands

| Command | Behavior |
|---|---|
| `tree` | Box-drawing tree of the virtual FS from cwd (dirs sky, files stone). Always excludes dotfiles |
| `history` | Numbered list from the real persisted command history |
| `git log` | Career timeline as oneline commits: amber fake hash + `2025 ▸ TRACE @ wat.ai` style rows, newest first |
| `git status` | `on branch waterloo · ahead of 'graduation' by 42 commits · working tree clean` (fixed playful count) |
| `activity` | GitHub stats: contributions count, streak, unicode-block mini heatmap (12 weeks), 3 latest commit lines. Data from the same cached endpoint as the home pane |
| `man <cmd>` | One-paragraph mock man page for known commands; `No manual entry for <x>` otherwise |
| `date` | Current date/time |
| `uptime` | Time since page load + fixed line: `load average: coffee, hackathons, shipping` |
| `cowsay [msg]` (alias `honk`) | ASCII **goose** (Waterloo) speech-bubble; default message "honk." |
| `sl` | ASCII steam locomotive animates across the terminal block (the classic `ls` typo punishment) |
| `matrix` | Digital-rain canvas overlay **scoped to the terminal block**, ~4s or any-key dismiss. Opt-in by typing, so allowed under "quietly alive" |
| `writing` | Alias: `cd writing && ls` |

`help` reorganizes into three dim `#`-labeled groups: files, info, fun (existing two-column row layout kept). Easter eggs (`sl`, `matrix`, `cowsay`, dotfiles) stay out of `help` — discoverable, not advertised, except `cowsay` which is listed under fun.

### Mobile

On touch devices, a row of one-tap mono chip buttons above the input: `help · about · projects · tree`. Tapping runs the command. Hidden on desktop.

## 4 · Writing section

- Posts: MDX pages at `src/app/writing/<slug>/page.mdx` using the existing `@next/mdx` pipeline (prism highlighting, TOC, slugs already configured).
- Registry: `src/app/writing/posts.js` — array of `{ slug, title, date, summary, readMins, published }`. Feeds the index page, terminal `~/writing/`, and the command palette. Manual by design (no filesystem scanning, no CMS).
- Index `/writing`: context line `$ ls ~/writing`, then a pane-lite row per published post — title (sans), summary one-liner, `2026-05 · 6 min` (mono micro). Rows use the Link cursor-hover effect.
- Post shell (`MdxLayout` rebuilt): Pane title bar `~/writing/<slug>.md · less`, date + read-time line, body in `prose prose-stone dark:prose-invert` typography, `(END)` marker after the content, prev/next links as `$ cd ../<other-slug>`.
- Scaffold ships with one example post file marked `published: false` for Mo to replace with real writing. Empty registry → index shows `// nothing published yet` (dim, italic). Nav shows `writing` from day one.
- Per-post `metadata` export (title, description, OG).

## 5 · GitHub activity

- Data module `src/app/lib/github.js`, server-side only, `fetch` with `next: { revalidate: 3600 }`:
  - Contributions: `https://github-contributions-api.jogruber.de/v4/ManagementMO?y=last` → daily counts for heatmap, total, streak (computed).
  - Recent commits: `https://api.github.com/users/ManagementMO/events/public` → first 3 PushEvent commits (repo name, message, sha).
- Home page restructure: `page.js` becomes a server component; the Enter→/projects key handler moves to a small client component (`EnterToProjects`). `ActivityPane` is an async server component below the `cd ~/projects` link.
- Pane content: title bar `~/activity` + meta `GITHUB · CACHED 1H`; CSS-grid heatmap (52×7 desktop, 26×7 on small screens via hiding older weeks), amber intensity scale on stone-900 empty cells; stat line `**N** contributions in the last year · **Nd** current streak`; 3 latest commits as `<short-sha> <repo> — <message>` mono rows (sha amber, repo sky, message dim, truncated).
- Heatmap a11y: grid is `aria-hidden`; adjacent stat line carries the information.

## 6 · Statusline (the hint of C)

Fixed bottom bar, **desktop only** (`hidden md:flex`), 28px, `bg near-black/90 + backdrop-blur`, top border stone-800, micro JetBrains Mono:

- Left: `portfolio` session segment (amber bg, black text, rounded-sm) · window tabs `0:about` `1:projects` `2:writing` — real `<nav>` links; current route shown amber with `*` suffix, others dim, hover brightens.
- Right: `waterloo HH:MM` live clock (America/Toronto, ticks every second — the site's heartbeat) · `theme=dark|light` (click toggles, hover amber).
- Page container gets bottom padding on md+ so content never hides behind the bar.
- Client component in root layout, below `CommandPalette`.

## 7 · Footer (amended during review)

Single row: icon links left (github, linkedin, email, devpost, repo — unchanged hover behavior), **compact Signature right** — Caveat cursive "Mohammed", visual height matched to the 20px icons (≈ text-2xl Caveat, tuned by eye), animated left-to-right clip-path write-in (~1.6s) once on mount, motion-safe only. No replay button, no underline SVG, no copyright line, no location pin. The old large `Signature` component is replaced by this compact variant.

## 8 · Polish

- **404**: `app/not-found.js` — terminal block: `mohammed@portfolio:~$ cd <path>` / `bash: cd: no such file or directory` + `$ cd ~` link home.
- **Focus**: amber `focus-visible` ring utility applied to all interactive elements (statusline tabs, chips, panes' links, palette items, terminal input keeps caret).
- **Command palette**: add `writing` nav item (shift+W). Palette title bar already reflects route cwd.
- **SEO**: JSON-LD `Person` script in layout (name, url, sameAs: github/linkedin/devpost, affiliation UWaterloo); sitemap.xml gains `/writing` + post URLs; per-post metadata (§4).
- **Reduced motion**: scramble effect, signature write-in, pane fade-ups, `sl`/`matrix` animations, and pulse-dot all gate on `prefers-reduced-motion` (CSS `motion-safe:` or `useReducedMotion`). Clock keeps ticking (text change, not motion).

## 9 · Error handling

| Failure | Behavior |
|---|---|
| GitHub APIs unreachable/non-200 at build/revalidate | `ActivityPane` renders `null` — home looks exactly like today; no error UI |
| GitHub data missing fields | Defensive parsing; omit commits block or streak rather than render NaN |
| Terminal `activity` with no data | Rose line: `activity: github unreachable — try again later` |
| Unknown route | Terminal-styled 404 |
| Unknown command / bad path in terminal | Existing bash-style errors (unchanged) |
| Empty writing registry | `// nothing published yet` index state |

## 10 · Verification

No test infrastructure exists (by repo convention). Definition of done:

1. `npm run build` and `npm run lint` pass clean.
2. Browser QA pass with screenshots: home, projects, writing index, one post, 404 — each in light + dark, at 540px-desktop and 375px-mobile widths.
3. Reduced-motion QA: emulate `prefers-reduced-motion` and confirm no scramble/write-in/fade/rain.
4. Terminal regression: existing commands (`help`, `cd/ls/cat/open`, `theme`, history keys, tab-complete, `clear`, easter eggs) still work; new commands behave per §3.
5. Statusline clock ticks; tabs navigate; theme toggle syncs with header toggle and `theme` command.
6. Activity pane: verified against live GitHub data; failure path verified by pointing the fetch at an invalid host locally.

## Out of scope

- Resume command / PDF (declined).
- Real writing content (Mo provides post MDX; structure + example only).
- Light-mode redesign (palette untouched, both themes must keep working).
- Backend/analytics beyond existing Vercel analytics.
- The old Vite-era CLAUDE.md stack description (stale; separate concern).

## Implementation phases

1. **Pane primitive + projects page redesign** (archive tier, grep search, fade-ups).
2. **Terminal expansion** (FS entries, new commands, help groups, mobile chips).
3. **Statusline + footer signature** (layout integration, clock, theme sync).
4. **Activity** (data module, server-component home restructure, pane, terminal command).
5. **Writing** (registry, index, post shell, example post, palette/nav/statusline entries).
6. **Polish** (404, focus rings, JSON-LD, sitemap, reduced-motion sweep).
7. **QA pass** (§10) and fixes.

Each phase lands as its own commit on `new-terminal`.
