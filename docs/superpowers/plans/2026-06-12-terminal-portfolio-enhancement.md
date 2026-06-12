# Terminal Portfolio Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Carry the terminal identity through every surface of moelshrief.wiki — pane-card projects page with archive tier, 12 new terminal commands + expanded virtual FS, MDX writing section, live GitHub activity pane, tmux statusline, and a polish pass (404, SEO, a11y, reduced motion).

**Architecture:** Next.js 14 App Router (JavaScript, no TypeScript). A shared `Pane` primitive carries direction B everywhere. The home page becomes a server component that fetches GitHub data once (ISR, 1h) and feeds both the `ActivityPane` and the terminal's `activity` command via props. The 785-line `TerminalHero.js` splits into `terminal/fs.js` + `terminal/commands.js` before growing. Writing posts are MDX pages + a tiny manual registry that feeds the index, terminal FS, palette, and sitemap.

**Tech Stack:** Existing deps only — Tailwind 3.4, framer-motion, cmdk, @next/mdx (+ rehype-prism, already configured), @tailwindcss/typography, lucide-react. **Zero new dependencies.**

**Spec:** `docs/superpowers/specs/2026-06-12-terminal-portfolio-enhancement-design.md` (approved). Branch: `new-terminal`.

**Verification convention:** This repo has no test runner (by convention — see spec §10). Every task verifies with `npm run build` (must pass clean) plus dev-server checks described in the step. Dev server: `npm run dev` → http://localhost:8080. Task 10 is a full QA pass with browser screenshots.

---

## File Structure

```
src/app/
├── page.js                          MODIFY  server component; fetch activity; compose home
├── layout.js                        MODIFY  + Statusline, JSON-LD, bottom padding
├── not-found.js                     CREATE  terminal-styled 404
├── sitemap.js                       CREATE  replaces public/sitemap.xml
├── globals.css                      MODIFY  + focus-visible rings
├── lib/
│   └── github.js                    CREATE  server-only GitHub fetch + shaping
├── components/
│   ├── Pane.js                      CREATE  shared pane primitive (server-safe)
│   ├── Reveal.js                    CREATE  motion-safe fade-up wrapper (client)
│   ├── EnterToProjects.js           CREATE  Enter-key redirect (client, extracted from page.js)
│   ├── ActivityPane.js              CREATE  heatmap + commits (server, takes data prop)
│   ├── Statusline.js                CREATE  fixed tmux bar (client)
│   ├── Signature.js                 REWRITE compact CSS write-in (drops framer/replay)
│   ├── Footer.js                    MODIFY  icons + signature; remove pin/copyright
│   ├── Header.js                    MODIFY  + writing nav; scramble reduced-motion guard
│   ├── CommandPalette.js            MODIFY  + writing item (shift+W)
│   ├── ProjectPane.js               CREATE  pane card for one project
│   ├── ProjectSearch.js             REWRITE grep prompt + panes + archive rows
│   ├── ProjectCard.js               DELETE
│   ├── ProjectList.js               DELETE
│   ├── TerminalHero.js              MODIFY  slimmed shell; chips; matrix state; activity prop
│   └── terminal/
│       ├── fs.js                    CREATE  virtual FS + resolvePath + file contents
│       ├── commands.js              CREATE  command interpreter + autocomplete + help
│       ├── SlTrain.js               CREATE  animated steam locomotive
│       └── MatrixRain.js            CREATE  canvas rain overlay
├── projects/
│   ├── page.js                      MODIFY  context line + counts
│   └── projectsData.js              CREATE  main + archive project data
├── writing/
│   ├── posts.js                     CREATE  post registry
│   ├── page.js                      CREATE  writing index
│   └── example-post/page.mdx        CREATE  unpublished template post
├── layouts/
│   └── MdxLayout.js                 REWRITE pane-framed post shell with (END) + prev/next
public/sitemap.xml                   DELETE  (replaced by app/sitemap.js)
tailwind.config.js                   MODIFY  + writeIn / slTrain keyframes
```

Tasks 1→10 build in dependency order; each ends in a commit so the branch is always shippable (statusline shows a `writing` tab one task before the route exists — acceptable for two commits mid-branch, noted in Task 6).

---

### Task 1: `Pane` + `Reveal` primitives

**Files:**
- Create: `src/app/components/Pane.js`
- Create: `src/app/components/Reveal.js`

- [ ] **Step 1: Create `src/app/components/Pane.js`** (no `"use client"` — it must stay server-compatible for `ActivityPane`):

```jsx
export default function Pane({ path, meta, children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-sm overflow-hidden transition-colors hover:border-amber-500/40 dark:hover:border-amber-400/40 ${className}`}
    >
      <div className="flex items-center gap-2 px-3.5 py-1.5 border-b border-stone-200 dark:border-stone-800/80 font-mono text-xs">
        <span
          className="text-stone-400 dark:text-stone-600 select-none"
          aria-hidden="true"
        >
          ┌
        </span>
        <span className="text-amber-700 dark:text-amber-400 truncate">
          {path}
        </span>
        {meta ? (
          <span className="ml-auto shrink-0 text-micro tracking-[0.08em] uppercase text-stone-400 dark:text-stone-600">
            {meta}
          </span>
        ) : null}
      </div>
      <div className="p-3.5">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/app/components/Reveal.js`**:

```jsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({ children, delay = 0, className }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: compiles clean (components unused so far — that's fine).

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Pane.js src/app/components/Reveal.js
git commit -m "feat: Pane + Reveal primitives for direction-B surfaces"
```

---

### Task 2: Projects page redesign

**Files:**
- Create: `src/app/projects/projectsData.js`
- Create: `src/app/components/ProjectPane.js`
- Rewrite: `src/app/components/ProjectSearch.js`
- Modify: `src/app/projects/page.js`
- Delete: `src/app/components/ProjectCard.js`, `src/app/components/ProjectList.js`

- [ ] **Step 1: Create `src/app/projects/projectsData.js`** — main descriptions copied verbatim from the current `ProjectSearch.js`; archive data recovered from git commit `e56edd2` (old `ProjectsSection.tsx` / `ProjectDetail.tsx`). Archive years are best-guess (only Scam-Mah's 2024 is certain) — flag to Mo in Task 10:

```js
// Single source of truth for project data.
// Consumed by the projects page AND the terminal virtual FS.

export const projects = [
  {
    slug: "trace",
    title: "TRACE",
    year: "2025",
    status: "active",
    href: "https://watai.ca",
    description:
      "agentic qa + observability for ai agents — runs them through realistic tool / rag workflows, verifies outcomes, isolates where the workflow became unrecoverable, and turns failures into regression tests. built at wat.ai w/ composio + magic hour. catching agents when they hallucinate.",
    technologies: ["AI Agents", "LLM Evals", "RAG", "Observability", "Python"],
    demo: "https://watai.ca",
  },
  {
    slug: "meta-harness",
    title: "Meta-Harness",
    year: "2025",
    status: "active",
    href: "https://github.com/ManagementMO/Meta-Harness",
    description:
      "stanford's meta-harness paper had a linear loop — i mapped it onto langgraph and made it a tree. two state machines, postgres-backed checkpointing, time-travel forking, cross-run memory. self-improving agent harnesses, by construction.",
    technologies: ["LangGraph", "Postgres", "FastAPI", "Next.js", "Python"],
    github: "https://github.com/ManagementMO/Meta-Harness",
  },
  {
    slug: "paybridge",
    title: "Paybridge",
    year: "2024",
    href: "https://paybridgetech.com/",
    description:
      "full-stack money transfer app for cross-border payments. moved $1k+ in real-user volume in early pilot.",
    technologies: ["Python", "React", "PostgreSQL", "Docker"],
    github: "https://github.com/ManagementMO",
    demo: "https://paybridgetech.com/",
  },
];

export const archive = [
  {
    slug: "scam-mah",
    title: "scam-mah",
    year: "2024",
    href: "https://devpost.com/software/scam-mah",
    description: "real-time spam detection · 3rd place @ newhacks 2024",
    technologies: ["Python", "Flask", "Gemini API"],
  },
  {
    slug: "focusforge",
    title: "focusforge",
    year: "2024",
    href: "https://jasooh.github.io/mse-100-launch-page/",
    description: "excel/vba time-management suite w/ gemini-powered insights",
    technologies: ["Excel", "VBA", "Gemini API"],
  },
  {
    slug: "mo-planner",
    title: "mo-planner",
    year: "2023",
    href: "https://github.com/ManagementMO/mo-planner",
    description: "student budget forecasting in excel/vba · used by 100+ students",
    technologies: ["Excel", "VBA", "Python"],
  },
];
```

- [ ] **Step 2: Create `src/app/components/ProjectPane.js`**:

```jsx
import Pane from "./Pane";
import Link from "./Link";

export default function ProjectPane({ project }) {
  const {
    slug,
    title,
    year,
    status,
    href,
    description,
    technologies,
    github,
    demo,
  } = project;
  return (
    <Pane
      path={`~/projects/${slug}`}
      meta={`${year}${status === "active" ? " · ★ active" : ""}`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-800 dark:text-stone-200 font-medium text-lg hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
      >
        {title}
      </a>
      <p className="text-stone-600 dark:text-stone-400 mt-1.5 text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="text-micro uppercase tracking-wider px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-5 font-mono text-xs">
        {demo && (
          <span className="text-stone-500 dark:text-stone-500">
            $ <Link href={demo}>open demo ↗</Link>
          </span>
        )}
        {github && (
          <span className="text-stone-500 dark:text-stone-500">
            $ <Link href={github}>git clone</Link>
          </span>
        )}
      </div>
    </Pane>
  );
}
```

- [ ] **Step 3: Replace the entire contents of `src/app/components/ProjectSearch.js`** (grep prompt + pane list + archive rows; filtering covers both tiers):

```jsx
"use client";

import { useState } from "react";
import { projects, archive } from "../projects/projectsData";
import ProjectPane from "./ProjectPane";
import Reveal from "./Reveal";
import AsciiDivider from "./AsciiDivider";

const matches = (p, q) =>
  p.title.toLowerCase().includes(q) ||
  p.description.toLowerCase().includes(q) ||
  p.technologies.some((t) => t.toLowerCase().includes(q));

export default function ProjectSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const q = searchTerm.trim().toLowerCase();
  const main = projects.filter((p) => matches(p, q));
  const archived = archive.filter((p) => matches(p, q));

  return (
    <>
      <div className="flex items-center font-mono text-sm rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50/40 dark:bg-stone-900/30 px-3.5 py-2.5 focus-within:border-amber-500/60 dark:focus-within:border-amber-400/60 transition-colors">
        <span className="text-stone-500 dark:text-stone-500 select-none whitespace-pre">
          $ grep -ri{" "}
        </span>
        <span className="text-stone-400 dark:text-stone-600 select-none">
          &quot;
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="search projects"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="flex-1 min-w-0 bg-transparent outline-none border-none text-stone-800 dark:text-stone-200 caret-amber-500 dark:caret-amber-400"
        />
        <span className="text-stone-400 dark:text-stone-600 select-none">
          &quot;
        </span>
        <span className="hidden sm:inline text-stone-500 dark:text-stone-500 select-none whitespace-pre">
          {" "}
          ~/projects
        </span>
      </div>

      {main.length === 0 && archived.length === 0 ? (
        <div className="font-mono text-sm text-rose-600 dark:text-rose-400">
          grep: no matches in ~/projects
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {main.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <ProjectPane project={p} />
              </Reveal>
            ))}
          </div>
          {archived.length > 0 && (
            <>
              <AsciiDivider label="archive" />
              <div className="font-mono text-xs flex flex-col gap-1.5">
                {archived.map((p) => (
                  <div key={p.slug} className="flex items-baseline gap-3 min-w-0">
                    <span className="text-stone-400 dark:text-stone-600 shrink-0 hidden sm:inline">
                      -rw-r--r--
                    </span>
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 transition-colors shrink-0"
                      >
                        {p.title}
                      </a>
                    ) : (
                      <span className="text-stone-700 dark:text-stone-300 shrink-0">
                        {p.title}
                      </span>
                    )}
                    <span className="text-stone-400 dark:text-stone-600 shrink-0">
                      {p.year}
                    </span>
                    <span className="text-stone-500 dark:text-stone-500 truncate">
                      {p.description}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
```

- [ ] **Step 4: Replace the contents of `src/app/projects/page.js`** (keep the existing `metadata` export verbatim, add the context line):

```jsx
import Link from "../components/Link";
import ProjectSearch from "../components/ProjectSearch";
import { projects, archive } from "./projectsData";

export const metadata = {
  title: "projects · mohammed elshrief",
  description: "things i've shipped — products, machine learning, hackathons.",
};

export default function Projects() {
  const count = projects.length + archive.length;
  return (
    <>
      <div className="font-mono text-xs text-stone-500 dark:text-stone-500">
        mohammed@portfolio:
        <span className="text-amber-700 dark:text-amber-400">~/projects</span>$
        ls --detail
        <span className="text-stone-400 dark:text-stone-600">
          {" "}
          · {count} entries · sorted by year
        </span>
      </div>
      <ProjectSearch />
      <p className="text-stone-600 dark:text-stone-400 text-sm">
        more on{" "}
        <Link href="https://github.com/ManagementMO?tab=repositories">
          github
        </Link>
        .
      </p>
    </>
  );
}
```

- [ ] **Step 5: Delete the dead components**

```bash
git rm src/app/components/ProjectCard.js src/app/components/ProjectList.js
```

- [ ] **Step 6: Verify in dev server**

Run: `npm run dev`, open http://localhost:8080/projects
Expected: context line, grep-styled search, 3 pane cards fading up, `# archive` divider with 3 mono rows. Type `flask` → only scam-mah row remains; type `zzz` → rose `grep: no matches in ~/projects`. Check light + dark (toggle with the `[0]/[1]` header button).

- [ ] **Step 7: Build + commit**

```bash
npm run build
git add -A
git commit -m "feat: projects page redesign — grep prompt, pane cards, archive tier"
```

---

### Task 3: Terminal refactor (pure move, zero behavior change)

**Files:**
- Create: `src/app/components/terminal/fs.js`
- Create: `src/app/components/terminal/commands.js`
- Modify: `src/app/components/TerminalHero.js`

The current `TerminalHero.js` is 785 lines and about to grow; split data/logic from the interactive shell **before** adding features. This task moves code verbatim — the file contents already exist in `TerminalHero.js`; cut and paste exactly, changing only imports/exports as specified.

- [ ] **Step 1: Create `src/app/components/terminal/fs.js`** — move these items from `TerminalHero.js`, unchanged: the `Logo` function (lines ~7–68), the `AboutOutput` function (~78–166), the `FS` object (~168–269), and the `resolvePath` function (~271–295). File header and exports:

```jsx
import Image from "next/image";
import Link from "../Link";

// ... Logo (moved verbatim) ...
// ... AboutOutput (moved verbatim) ...
// ... FS (moved verbatim) ...
// ... resolvePath (moved verbatim) ...

export { FS, resolvePath, AboutOutput };
```

Note the `Link` import path changes from `./Link` to `../Link`.

- [ ] **Step 2: Create `src/app/components/terminal/commands.js`** — move these items from `TerminalHero.js`, unchanged: `ERR`, `DIM`, `HELP_ROWS`, `ALL_COMMANDS`, `longestCommonPrefix`, `autocomplete`, `runLs`, `runCommand`. File header and exports:

```jsx
import Link from "../Link";
import { FS, resolvePath } from "./fs";

// ... ERR, DIM (moved verbatim) ...
// ... HELP_ROWS, ALL_COMMANDS (moved verbatim) ...
// ... longestCommonPrefix, autocomplete (moved verbatim) ...
// ... runLs, runCommand (moved verbatim) ...

export { runCommand, autocomplete, ERR, DIM };
```

`runCommand` references `FS["~/about.md"]` for the `about` command — that now resolves via the `FS` import. `Link` is used by nothing in this file after the move (links live in FS renders) — if ESLint flags the unused import, remove it.

- [ ] **Step 3: Slim `src/app/components/TerminalHero.js`** — delete everything moved in Steps 1–2 and replace the top of the file with:

```jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { AboutOutput } from "./terminal/fs";
import { runCommand, autocomplete } from "./terminal/commands";
```

Keep in this file: `Prompt`, the `TerminalHero` component itself (state, history persistence, key handling, rendering). Remove now-unused imports (`Image`, `Link`).

- [ ] **Step 4: Verify zero behavior change**

Run: `npm run dev`, open http://localhost:8080
Expected: bio renders instantly; `help`, `ls`, `cd projects`, `cat trace`, `tab`-completion, `↑` history, `ctrl+l`, `theme`, `neofetch`, `sudo`, `exit` all behave exactly as before.

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add -A
git commit -m "refactor: split terminal FS + command interpreter out of TerminalHero"
```

---

### Task 4: Terminal expansion — FS growth + core commands

**Files:**
- Create: `src/app/writing/posts.js`
- Modify: `src/app/components/terminal/fs.js`
- Modify: `src/app/components/terminal/commands.js`
- Modify: `src/app/components/TerminalHero.js` (pass `cmdHistory` into `runCommand`)

- [ ] **Step 1: Create `src/app/writing/posts.js`** (the registry exists before the pages so the terminal can mirror it; the index/MDX pages come in Task 8):

```js
// Post registry — single source of truth for the writing section.
// To publish: create src/app/writing/<slug>/page.mdx, add an entry here,
// set published: true.

export const posts = [
  {
    slug: "example-post",
    title: "example post — replace me",
    date: "2026-06-12",
    summary:
      "a template showing the post format. set published: true when you write the real thing.",
    readMins: 3,
    published: false,
  },
];

export const publishedPosts = posts.filter((p) => p.published);
```

- [ ] **Step 2: Expand the FS in `src/app/components/terminal/fs.js`**. Add imports at the top:

```js
import { projects, archive } from "../../projects/projectsData";
import { publishedPosts } from "../../writing/posts";
```

Replace the `"~"` root entry and add the new nodes. The `"~"` entry gains a `hidden` array; `~/projects` gains `paybridge` + `archive/`; add `~/writing` + per-post nodes; add dotfiles. Insert after the existing `FS` object definition closes — restructure to:

```js
const FS = {
  "~": {
    type: "dir",
    children: ["about.md", "projects", "writing", "work.txt", "contact.md"],
    hidden: [".bashrc", ".secrets"],
  },
  // ... keep existing ~/about.md, ~/projects/trace, ~/projects/meta-harness,
  //     ~/work.txt, ~/contact.md nodes exactly as they are ...
  "~/projects": {
    type: "dir",
    children: ["trace", "meta-harness", "paybridge", "archive"],
  },
  "~/projects/paybridge": {
    type: "file",
    url: "https://paybridgetech.com/",
    render: () => (
      <>
        <div>
          <span className="text-amber-700 dark:text-amber-400">Paybridge</span>{" "}
          — cross-border money transfers
        </div>
        <div>moved $1k+ in real-user volume in early pilot.</div>
        <div className="text-stone-500 dark:text-stone-500 mt-1">
          link:{" "}
          <Link href="https://paybridgetech.com/">
            <span className="text-amber-700 dark:text-amber-400">
              paybridgetech.com
            </span>
          </Link>
        </div>
      </>
    ),
  },
  "~/projects/archive": {
    type: "dir",
    children: archive.map((p) => p.slug),
  },
  "~/writing": {
    type: "dir",
    children: publishedPosts.map((p) => `${p.slug}.md`),
  },
  "~/.secrets": {
    type: "file",
    hidden: true,
    render: () => (
      <>
        <div className="text-stone-500 dark:text-stone-500">
          # ~/.secrets — decrypting…
        </div>
        <div>next_big_thing: ████████████████</div>
        <div>dream_job: ██████████ (you know the one)</div>
        <div>hackathon_strategy: sleep is ████████</div>
        <div className="text-stone-500 dark:text-stone-500">
          (3 entries redacted · nice try)
        </div>
      </>
    ),
  },
  "~/.bashrc": {
    type: "file",
    hidden: true,
    render: () => (
      <>
        <div className="text-stone-500 dark:text-stone-500"># aliases</div>
        <div>alias work=&quot;coffee &amp;&amp; code&quot;</div>
        <div>alias ship=&quot;git push --force-with-lease && pray&quot;</div>
        <div>alias goose=&quot;cowsay&quot;</div>
        <div>export EDITOR=vim &nbsp;# fight me</div>
      </>
    ),
  },
};

// generated archive file nodes
for (const p of archive) {
  FS[`~/projects/archive/${p.slug}`] = {
    type: "file",
    url: p.href,
    render: () => (
      <>
        <div>
          <span className="text-amber-700 dark:text-amber-400">{p.title}</span>{" "}
          — {p.description}
        </div>
        <div className="text-stone-500 dark:text-stone-500">
          {p.year} · {p.technologies.join(" · ")}
        </div>
      </>
    ),
  };
}

// generated writing file nodes
for (const p of publishedPosts) {
  FS[`~/writing/${p.slug}.md`] = {
    type: "file",
    url: `/writing/${p.slug}`,
    internal: true,
    render: () => (
      <>
        <div>
          <span className="text-amber-700 dark:text-amber-400">{p.title}</span>{" "}
          — {p.summary}
        </div>
        <div className="text-stone-500 dark:text-stone-500">
          {p.date} · {p.readMins} min · open {p.slug}.md → read it
        </div>
      </>
    ),
  };
}
```

(The existing `~/projects/trace`, `~/projects/meta-harness`, `~/about.md`, `~/work.txt`, `~/contact.md` nodes stay byte-identical; only `"~"` and `"~/projects"` entries are replaced and the new nodes appended.)

- [ ] **Step 3: Update `open` for internal links** in `commands.js` — the `open` command currently always uses `window.open(node.url, "_blank")`. Internal writing links should navigate in-tab:

```js
  if (c === "open") {
    if (!args[0]) return ERR("open: missing file operand");
    const target = resolvePath(cwd, args[0]);
    if (!target || !FS[target])
      return ERR(`open: ${args[0]}: no such file or directory`);
    const node = FS[target];
    if (!node.url) return ERR(`open: ${args[0]}: no link associated`);
    if (typeof window !== "undefined") {
      if (node.internal) window.location.assign(node.url);
      else window.open(node.url, "_blank");
    }
    return DIM(`opened ${node.url}`);
  }
```

- [ ] **Step 4: Flag-aware `ls` with dotfiles** in `commands.js`. Replace `runLs` and the `ls` branch:

```jsx
function runLs(target, { all = false } = {}) {
  if (!target || !FS[target]) return ERR(`ls: no such file or directory`);
  const node = FS[target];
  if (node.type !== "dir") return <div>{target.split("/").pop()}</div>;
  const names = [...(all ? node.hidden ?? [] : []), ...node.children];
  return (
    <div className="flex flex-wrap gap-x-4">
      {names.map((name) => {
        const childPath = target === "~" ? `~/${name}` : `${target}/${name}`;
        const child = FS[childPath];
        const isDir = child?.type === "dir";
        const isHidden = name.startsWith(".");
        return (
          <span
            key={name}
            className={
              isDir
                ? "text-sky-700 dark:text-sky-400"
                : isHidden
                  ? "text-stone-400 dark:text-stone-600"
                  : "text-stone-700 dark:text-stone-300"
            }
          >
            {name}
            {isDir ? "/" : ""}
          </span>
        );
      })}
    </div>
  );
}
```

and in `runCommand`:

```js
  if (c === "ls") {
    const flags = args.filter((a) => a.startsWith("-")).join("");
    const all = flags.includes("a");
    const pathArg = args.find((a) => !a.startsWith("-"));
    const target = pathArg ? resolvePath(cwd, pathArg) : cwd;
    if (!target || !FS[target])
      return ERR(`ls: ${pathArg ?? cwd}: no such file or directory`);
    return runLs(target, { all });
  }
```

The `projects` alias calls `runLs("~/projects")` — signature stays compatible.

- [ ] **Step 5: Add the core commands to `commands.js`.** Add module-scope data above `runCommand`:

```jsx
const BOOT = Date.now();

const CAREER = [
  ["f4b1e25", "(HEAD -> waterloo) building TRACE + Meta-Harness @ wat.ai"],
  ["a7c3d91", "software engineering @ altas partners"],
  ["c1d8a44", "software engineering @ liftwerx"],
  ["9b2e7f3", "machine learning engineering @ wat.ai"],
  ["5a6c9d1", "ml dev @ themis ai · utmist"],
  ["e8f2b35", "(initial commit) management engineering @ uwaterloo"],
];

const MAN_PAGES = {
  help: "help — list available commands, grouped by vibe.",
  about: "about — alias for `cat about.md`. the short version of me.",
  projects: "projects — alias for `cd projects && ls`.",
  writing: "writing — alias for `cd writing && ls`. essays + notes.",
  ls: "ls [-a] [path] — list directory contents. -a shows dotfiles.",
  cd: "cd <path> — change directory. supports ~, .., relative paths.",
  pwd: "pwd — print working directory.",
  cat: "cat <file> — print a file. works on .md, .txt, and worse ideas.",
  open: "open <file> — follow the file's link (new tab for external).",
  tree: "tree [path] — draw the directory tree. dotfiles excluded.",
  history: "history — your last commands. persisted in localStorage.",
  git: "git log | git status — career as commit history.",
  activity: "activity — live github contributions + recent commits.",
  theme: "theme [dark|light|toggle] — set the color theme.",
  whoami: "whoami — one-line bio.",
  neofetch: "neofetch — system info, but the system is me.",
  date: "date — current date and time.",
  uptime: "uptime — time since you opened this page.",
  cowsay: "cowsay [msg] — a goose says your message. alias: honk.",
  echo: "echo <text> — print text.",
  clear: "clear — wipe the terminal. also ctrl+L.",
  man: "man <command> — you are here.",
};

function buildTree(path, prefix, lines) {
  const node = FS[path];
  const children = (node.children ?? []).filter((c) => !c.startsWith("."));
  children.forEach((name, i) => {
    const last = i === children.length - 1;
    const childPath = path === "~" ? `~/${name}` : `${path}/${name}`;
    const isDir = FS[childPath]?.type === "dir";
    lines.push(
      <div key={childPath}>
        <span className="text-stone-400 dark:text-stone-600">
          {prefix}
          {last ? "└── " : "├── "}
        </span>
        <span
          className={
            isDir
              ? "text-sky-700 dark:text-sky-400"
              : "text-stone-700 dark:text-stone-300"
          }
        >
          {name}
          {isDir ? "/" : ""}
        </span>
      </div>
    );
    if (isDir) buildTree(childPath, prefix + (last ? "    " : "│   "), lines);
  });
  return lines;
}
```

Then add these branches inside `runCommand` (before the final `command not found` return):

```jsx
  if (c === "tree") {
    const root = args[0] ? resolvePath(cwd, args[0]) : cwd;
    if (!root || !FS[root]) return ERR(`tree: ${args[0]}: no such directory`);
    if (FS[root].type !== "dir") return ERR(`tree: ${args[0]}: not a directory`);
    return (
      <div>
        <div className="text-sky-700 dark:text-sky-400">{root}</div>
        {buildTree(root, "", [])}
      </div>
    );
  }

  if (c === "history") {
    const items = (extras.cmdHistory ?? []).slice(-20);
    if (items.length === 0) return DIM("history: empty");
    return (
      <div>
        {items.map((cmdStr, i) => (
          <div key={i}>
            <span className="text-stone-400 dark:text-stone-600 inline-block min-w-[2.5rem] text-right pr-3">
              {i + 1}
            </span>
            {cmdStr}
          </div>
        ))}
      </div>
    );
  }

  if (c === "git") {
    const sub = args[0]?.toLowerCase();
    if (sub === "log") {
      return (
        <div>
          {CAREER.map(([hash, msg]) => (
            <div key={hash}>
              <span className="text-amber-700 dark:text-amber-400">{hash}</span>{" "}
              {msg}
            </div>
          ))}
        </div>
      );
    }
    if (sub === "status") {
      return (
        <div>
          <div>on branch waterloo</div>
          <div>
            your branch is ahead of &apos;graduation&apos; by 42 commits.
          </div>
          <div className="text-stone-500 dark:text-stone-500">
            nothing to commit, working tree clean (lol)
          </div>
        </div>
      );
    }
    return DIM("usage: git log · git status");
  }

  if (c === "man") {
    if (!args[0]) return ERR("what manual page do you want?");
    const page = MAN_PAGES[args[0].toLowerCase()];
    return page ? <div>{page}</div> : ERR(`No manual entry for ${args[0]}`);
  }

  if (c === "date") {
    return <div>{new Date().toString()}</div>;
  }

  if (c === "uptime") {
    const s = Math.floor((Date.now() - BOOT) / 1000);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return (
      <div>
        up {mins}m {secs}s · load average: coffee, hackathons, shipping
      </div>
    );
  }

  if (c === "writing") {
    setCwd("~/writing");
    const out = runLs("~/writing");
    return FS["~/writing"].children.length === 0
      ? DIM("// nothing published yet")
      : out;
  }
```

- [ ] **Step 6: Regroup `help` and extend `ALL_COMMANDS`** in `commands.js`. Replace `HELP_ROWS` with groups:

```js
const HELP_GROUPS = [
  {
    label: "# files",
    rows: [
      ["ls [-a] [path]", "list files (-a shows hidden)"],
      ["cd <path>", "change directory"],
      ["cat <file>", "read a file"],
      ["open <file>", "open the file's link"],
      ["tree", "draw the directory tree"],
      ["pwd", "print current directory"],
    ],
  },
  {
    label: "# info",
    rows: [
      ["about", "alias: cat about.md"],
      ["projects", "alias: cd projects && ls"],
      ["writing", "alias: cd writing && ls"],
      ["git log", "career as commit history"],
      ["activity", "live github stats"],
      ["whoami", "short bio"],
      ["history", "recent commands"],
      ["man <cmd>", "what does this do?"],
      ["theme [dark|light]", "toggle or set color theme"],
      ["clear", "clear the terminal (or ⌃L)"],
    ],
  },
  {
    label: "# fun",
    rows: [
      ["neofetch", "system info"],
      ["cowsay [msg]", "ask the goose"],
    ],
  },
];
```

and replace the `help` branch:

```jsx
  if (c === "help") {
    return (
      <div>
        {HELP_GROUPS.map((group) => (
          <div key={group.label} className="mb-1.5 last:mb-0">
            <div className="text-stone-400 dark:text-stone-600">
              {group.label}
            </div>
            {group.rows.map(([name, desc]) => (
              <div key={name}>
                <span className="text-amber-700 dark:text-amber-400 inline-block min-w-[150px]">
                  {name}
                </span>
                <span className="text-stone-500 dark:text-stone-500">
                  {desc}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
```

Extend `ALL_COMMANDS` (keep existing entries, add):

```js
  "tree",
  "history",
  "git",
  "man",
  "date",
  "uptime",
  "activity",
  "cowsay",
  "honk",
  "writing",
```

(`sl` and `matrix` are deliberately NOT in `ALL_COMMANDS` — no autocomplete for easter eggs; they're added as command branches in Task 5.)

Also make autocomplete offer dotfiles only when the user has typed a leading dot — in `autocomplete`, change the candidates line to:

```js
  const pool = leaf.startsWith(".")
    ? [...(FS[parentPath].hidden ?? []), ...FS[parentPath].children]
    : FS[parentPath].children;
  const candidates = pool.filter((n) => n.startsWith(leaf));
```

- [ ] **Step 7: Thread `cmdHistory` through `runCommand`** in `TerminalHero.js` — in the Enter branch, extend the extras object:

```js
      const result = runCommand(input, cwd, setCwd, setHistory, {
        theme,
        toggleTheme,
        cmdHistory,
      });
```

- [ ] **Step 8: Verify in dev server**

http://localhost:8080 — run each: `tree` (full box-drawing tree, no dotfiles), `ls -a` (dotfiles dim), `cat .bashrc`, `cat .secrets`, `cd projects/archive && ls && cat focusforge`, `git log`, `git status`, `man tree`, `history`, `date`, `uptime`, `writing` (→ `// nothing published yet`), `help` (three groups), tab-complete `cat .se` → `.secrets`. `activity` should fall through to `command not found` (built in Task 7) — confirm and ignore.

- [ ] **Step 9: Build + commit**

```bash
npm run build
git add -A
git commit -m "feat: terminal v2 — tree, git, man, history, dotfiles, grouped help"
```

---

### Task 5: Terminal fun — goose, sl, matrix, mobile chips

**Files:**
- Create: `src/app/components/terminal/SlTrain.js`
- Create: `src/app/components/terminal/MatrixRain.js`
- Modify: `src/app/components/terminal/commands.js`
- Modify: `src/app/components/TerminalHero.js`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add the `sl-train` keyframe to `tailwind.config.js`** inside `theme.extend.keyframes` / `animation`:

```js
        slTrain: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-110%)" },
        },
```

```js
        "sl-train": "slTrain 3.5s linear forwards",
```

- [ ] **Step 2: Create `src/app/components/terminal/SlTrain.js`**:

```jsx
"use client";

import { useEffect, useState } from "react";

const TRAIN = String.raw`      ====        ________
  _D _|  |_______/        \__I_I_____===__|______
   |(_)---  |   H\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__-------------------| [___] |
  |______|__|___H__/__|_____/[][]~\______|       |
  | =|  o |=-~~\  /~~\  /~~\  /~~\ ___Y__________|_
   \_/      \_O=====O=====O=====O/      \_/`;

export default function SlTrain() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setDone(true), 3600);
    return () => clearTimeout(t);
  }, []);

  if (done)
    return (
      <div className="text-stone-500 dark:text-stone-500">
        (the train has left — it was `ls`, wasn&apos;t it?)
      </div>
    );
  return (
    <div className="overflow-hidden">
      <pre className="text-stone-500 dark:text-stone-400 text-[10px] leading-tight whitespace-pre animate-sl-train">
        {TRAIN}
      </pre>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/components/terminal/MatrixRain.js`**:

```jsx
"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext("2d");
    const fontSize = 12;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);
    const glyphs = "アイウエオカキクケコサシスセソ0123456789$#@*+-";
    let raf;

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fbbf24";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        drops[i] =
          drops[i] * fontSize > canvas.height && Math.random() > 0.975
            ? 0
            : drops[i] + 1;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const stop = () => onDone();
    const timer = setTimeout(stop, 4000);
    window.addEventListener("keydown", stop, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("keydown", stop);
    };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onDone}
      className="absolute inset-0 z-10 rounded-lg"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 4: Add `cowsay`/`honk`, `sl`, `matrix` branches to `commands.js`.** Import at top: `import SlTrain from "./SlTrain";`. Add inside `runCommand`:

```jsx
  if (c === "cowsay" || c === "honk") {
    const msg = (c === "honk" && args.length === 0 ? "HONK." : args.join(" ")) || "honk.";
    const text = msg.length > 38 ? msg.slice(0, 35) + "…" : msg;
    const bar = "─".repeat(text.length + 2);
    return (
      <pre className="leading-tight">{` ┌${bar}┐
 │ ${text} │
 └${bar}┘
    \\
     \\   _
      >(.)__
       (___/   — the goose has spoken`}</pre>
    );
  }

  if (c === "sl") {
    return <SlTrain />;
  }

  if (c === "matrix") {
    extras.startMatrix?.();
    return DIM("wake up, neo… (any key to exit)");
  }
```

- [ ] **Step 5: Wire matrix overlay + mobile chips into `TerminalHero.js`.** Add imports:

```js
import MatrixRain from "./terminal/MatrixRain";
import useMobileDevice from "../hooks/useMobileDevice";
```

Add state + an `execute` function (refactor the Enter branch to use it):

```jsx
  const [matrixOn, setMatrixOn] = useState(false);
  const isMobileDevice = useMobileDevice();

  const execute = (raw) => {
    const trimmed = raw.trim();
    const result = runCommand(raw, cwd, setCwd, setHistory, {
      theme,
      toggleTheme,
      cmdHistory,
      startMatrix: () => setMatrixOn(true),
    });
    if (result !== "HANDLED") {
      setHistory((h) => [...h, { cmd: trimmed, cwd, output: result }]);
    }
    if (trimmed) setCmdHistory((cArr) => [...cArr, trimmed]);
    setInput("");
    setHistIdx(-1);
  };
```

The `Enter` branch of `handleKeyDown` becomes:

```js
    if (e.key === "Enter") {
      e.preventDefault();
      execute(input);
    }
```

Add `relative` to the terminal container's className (the outer `div` with `font-mono text-sm rounded-lg …`) so the canvas overlay positions correctly, and render the overlay just inside it:

```jsx
      {matrixOn && <MatrixRain onDone={() => setMatrixOn(false)} />}
```

Add the chips row directly under the hint line (`(type help for commands …)`):

```jsx
      {isMobileDevice && (
        <div className="flex flex-wrap gap-2 mt-3">
          {["help", "about", "projects", "tree"].map((cmd) => (
            <button
              key={cmd}
              onClick={(e) => {
                e.stopPropagation();
                execute(cmd);
              }}
              className="font-mono text-xs px-2.5 py-1 rounded-md border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 active:bg-amber-100 dark:active:bg-amber-500/15"
            >
              $ {cmd}
            </button>
          ))}
        </div>
      )}
```

- [ ] **Step 6: Verify in dev server**

Desktop: `cowsay hello` (goose + bubble), `honk` (HONK.), `sl` (train scrolls right→left, then the punchline line), `matrix` (amber rain over the terminal block only, any key dismisses). DevTools device emulation (iPhone): chips visible, tapping `tree` runs it. Reduced motion (DevTools rendering panel): `sl` shows punchline instantly, `matrix` exits immediately.

- [ ] **Step 7: Build + commit**

```bash
npm run build
git add -A
git commit -m "feat: terminal easter eggs — goose cowsay, sl, matrix + mobile chips"
```

---

### Task 6: Statusline + footer signature

**Files:**
- Create: `src/app/components/Statusline.js`
- Rewrite: `src/app/components/Signature.js`
- Modify: `src/app/components/Footer.js`
- Modify: `src/app/layout.js`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Create `src/app/components/Statusline.js`** (the `writing` tab will 404 until Task 8 — acceptable for two commits, on a branch):

```jsx
"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const WINDOWS = [
  { idx: 0, name: "about", href: "/" },
  { idx: 1, name: "projects", href: "/projects" },
  { idx: 2, name: "writing", href: "/writing" },
];

export default function Statusline() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Toronto",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isCurrent = (w) =>
    w.href === "/" ? pathname === "/" : pathname.startsWith(w.href);

  return (
    <nav
      aria-label="statusline"
      className="hidden md:flex fixed bottom-0 inset-x-0 z-30 h-7 items-center gap-4 px-3.5 font-mono text-micro bg-stone-100/90 dark:bg-black/90 backdrop-blur-sm border-t border-stone-300 dark:border-stone-800 text-stone-500 dark:text-stone-500"
    >
      <span className="bg-amber-500 dark:bg-amber-400 text-stone-950 px-1.5 py-px rounded-sm font-medium select-none">
        portfolio
      </span>
      {WINDOWS.map((w) => (
        <NextLink
          key={w.idx}
          href={w.href}
          className={
            isCurrent(w)
              ? "text-amber-700 dark:text-amber-400"
              : "hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          }
        >
          {w.idx}:{w.name}
          {isCurrent(w) ? "*" : ""}
        </NextLink>
      ))}
      <span className="ml-auto flex items-center gap-4">
        <span suppressHydrationWarning>waterloo {time ?? "--:--"}</span>
        <button
          onClick={toggleTheme}
          className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          aria-label="toggle theme"
        >
          theme={theme}
        </button>
      </span>
    </nav>
  );
}
```

- [ ] **Step 2: Add the `writeIn` keyframe to `tailwind.config.js`**:

```js
        writeIn: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
```

```js
        "write-in": "writeIn 1.6s ease-out both",
```

- [ ] **Step 3: Replace the entire contents of `src/app/components/Signature.js`** (compact, pure CSS, server-safe — drops framer-motion, replay button, underline SVG):

```jsx
export default function Signature() {
  return (
    <span
      aria-label="Mohammed — signature"
      className="font-handwriting text-2xl leading-none text-stone-700 dark:text-stone-300 select-none motion-safe:animate-write-in pr-1"
    >
      Mohammed
    </span>
  );
}
```

- [ ] **Step 4: Replace the contents of `src/app/components/Footer.js`** (drop `MapPin`, `NOW_STATUS`, copyright `<p>`; signature joins the icon row, right-aligned, height-matched):

```jsx
import { Linkedin, Github, Mail, CodeXml, Trophy } from "lucide-react";
import Signature from "./Signature";

export default function Footer({ className }) {
  const links = [
    { name: "github", href: "https://github.com/ManagementMO", icon: Github },
    {
      name: "linkedin",
      href: "https://www.linkedin.com/in/mohammed-elshrief/",
      icon: Linkedin,
    },
    { name: "email", href: "mailto:mkelshri@uwaterloo.ca", icon: Mail },
    { name: "devpost", href: "https://devpost.com/ManagementMO", icon: Trophy },
    {
      name: "repo",
      href: "https://github.com/ManagementMO/moelshrief-website-v2",
      icon: CodeXml,
    },
  ];

  return (
    <footer
      className={`flex flex-col gap-4 text-sm text-stone-500 dark:text-stone-400 ${className}`}
    >
      <hr className="border-b border-neutral-200 dark:border-neutral-800" />
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-wrap gap-4 items-center">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              aria-label={link.name}
              className="group flex items-center hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <link.icon className="w-5 h-5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.55)] dark:group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.55)]" />
              <span className="hidden md:inline-block md:w-0 md:overflow-hidden md:group-hover:w-auto md:group-hover:ml-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 ease-out font-mono text-xs">
                {link.name}
              </span>
            </a>
          ))}
        </div>
        <Signature />
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Mount the statusline + bottom padding in `src/app/layout.js`.** Add `import Statusline from "./components/Statusline";`, render `<Statusline />` directly after `<CommandPalette />` (inside `ThemeProvider`), and append `md:pb-10` to the `<main>` className string so content clears the fixed 28px bar.

- [ ] **Step 6: Verify in dev server**

Desktop ≥768px: statusline pinned bottom — `portfolio` block, `0:about*` amber on home, tabs navigate, clock shows current Waterloo time, `theme=dark` toggles (and stays in sync with the header `[0]/[1]` button and the terminal `theme` command — all three share `ThemeProvider`). Mobile width: statusline hidden. Footer: no pin, no copyright; signature writes in once on load, visually same height as icons; reduced-motion → signature appears without animation.

- [ ] **Step 7: Build + commit**

```bash
npm run build
git add -A
git commit -m "feat: tmux statusline + compact write-in footer signature"
```

---

### Task 7: GitHub activity — data module, home restructure, terminal command

**Files:**
- Create: `src/app/lib/github.js`
- Create: `src/app/components/ActivityPane.js`
- Create: `src/app/components/EnterToProjects.js`
- Rewrite: `src/app/page.js`
- Modify: `src/app/components/TerminalHero.js`, `src/app/components/terminal/commands.js`

- [ ] **Step 1: Create `src/app/lib/github.js`**:

```js
const USER = "ManagementMO";

// Returns { total, streak, commits, weeks } or null on any failure.
// weeks: array of 52 week-columns, each 7 slots of { date, count, level } | null padding.
export async function getActivity() {
  try {
    const [contribRes, eventsRes] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, {
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "moelshrief-wiki",
        },
        next: { revalidate: 3600 },
      }),
    ]);
    if (!contribRes.ok) return null;
    const contrib = await contribRes.json();
    const days = Array.isArray(contrib?.contributions)
      ? contrib.contributions
      : [];
    if (days.length === 0) return null;

    const total =
      contrib?.total?.lastYear ?? days.reduce((s, d) => s + (d.count || 0), 0);

    // consecutive active days counting back from today; a quiet today doesn't break it
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) streak++;
      else if (i === days.length - 1) continue;
      else break;
    }

    let commits = [];
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      if (Array.isArray(events)) {
        commits = events
          .filter((e) => e?.type === "PushEvent" && e?.payload?.commits?.length)
          .flatMap((e) =>
            e.payload.commits.map((cm) => ({
              sha: (cm?.sha ?? "").slice(0, 7),
              repo: (e?.repo?.name ?? "").split("/")[1] ?? "",
              message: (cm?.message ?? "").split("\n")[0],
            }))
          )
          .filter((cm) => cm.sha && cm.repo && cm.message)
          .slice(0, 3);
      }
    }

    // align to week columns (pad the first week to its weekday)
    const firstDow = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const padded = [...Array(firstDow).fill(null), ...days];
    const weeks = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }

    return { total, streak, commits, weeks: weeks.slice(-52) };
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Create `src/app/components/ActivityPane.js`** (server component; takes pre-fetched data so home fetches once):

```jsx
import Pane from "./Pane";

const LEVEL_CLASSES = [
  "bg-stone-200/70 dark:bg-stone-800/60",
  "bg-amber-200 dark:bg-amber-900/70",
  "bg-amber-300 dark:bg-amber-700/80",
  "bg-amber-400 dark:bg-amber-500/90",
  "bg-amber-500 dark:bg-amber-400",
];

export default function ActivityPane({ activity }) {
  if (!activity) return null;
  const { total, streak, commits, weeks } = activity;

  return (
    <Pane path="~/activity" meta="github · cached 1h">
      <div className="flex gap-[2px]" aria-hidden="true">
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className={`flex-col gap-[2px] flex-1 min-w-0 ${
              wi < weeks.length - 26 ? "hidden sm:flex" : "flex"
            }`}
          >
            {week.map((day, di) => (
              <span
                key={di}
                className={`aspect-square w-full rounded-[2px] ${
                  day
                    ? LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0]
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-stone-500 dark:text-stone-500 mt-2.5">
        <span className="text-stone-800 dark:text-stone-200">{total}</span>{" "}
        contributions in the last year
        {streak > 0 && (
          <>
            {" · "}
            <span className="text-stone-800 dark:text-stone-200">
              {streak}d
            </span>{" "}
            streak
          </>
        )}
      </p>
      {commits.length > 0 && (
        <div className="mt-2 flex flex-col gap-1 font-mono text-xs min-w-0">
          {commits.map((cm) => (
            <div key={cm.sha} className="truncate">
              <span className="text-amber-700 dark:text-amber-400">
                {cm.sha}
              </span>{" "}
              <span className="text-sky-700 dark:text-sky-400">{cm.repo}</span>{" "}
              <span className="text-stone-500 dark:text-stone-500">
                — {cm.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </Pane>
  );
}
```

- [ ] **Step 3: Create `src/app/components/EnterToProjects.js`** — move the entire `useEffect` keydown block from the current `page.js` verbatim into a renderless client component:

```jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EnterToProjects() {
  const router = useRouter();

  useEffect(() => {
    const isTypingTarget = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const handleEnter = (e) => {
      if (e.key !== "Enter") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (isTypingTarget(e.target)) return;
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "A" ||
          active.tagName === "BUTTON" ||
          active.getAttribute("role") === "button")
      )
        return;
      e.preventDefault();
      router.push("/projects");
    };

    document.addEventListener("keydown", handleEnter);
    return () => document.removeEventListener("keydown", handleEnter);
  }, [router]);

  return null;
}
```

- [ ] **Step 4: Replace the contents of `src/app/page.js`** (server component now — no `"use client"`):

```jsx
import NextLink from "next/link";
import TerminalHero from "./components/TerminalHero";
import AsciiDivider from "./components/AsciiDivider";
import ActivityPane from "./components/ActivityPane";
import EnterToProjects from "./components/EnterToProjects";
import { getActivity } from "./lib/github";

export default async function About() {
  const activity = await getActivity();

  return (
    <div className="flex flex-col w-full min-w-0 font-extralight">
      <EnterToProjects />
      <TerminalHero activity={activity} />

      <AsciiDivider />

      <NextLink
        href="/projects"
        className="group flex items-center justify-between font-mono text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/40 dark:bg-stone-900/30 hover:border-amber-500/60 dark:hover:border-amber-400/60 hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-colors"
      >
        <span className="flex items-baseline gap-2 min-w-0">
          <span className="text-stone-500 dark:text-stone-500">$</span>
          <span className="text-stone-700 dark:text-stone-300">
            cd{" "}
            <span className="text-amber-700 dark:text-amber-400">
              ~/projects
            </span>
          </span>
        </span>
        <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-micro text-stone-400 dark:text-stone-500 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors shrink-0 ml-3">
          ⏎
        </kbd>
      </NextLink>

      <div className="mt-4">
        <ActivityPane activity={activity} />
      </div>
    </div>
  );
}
```

(The `mt-4` on the old NextLink moves off since `AsciiDivider` already provides `my-4`; keep the original `mt-4` if spacing looks tight — visual check in Step 7.)

- [ ] **Step 5: Accept the `activity` prop in `TerminalHero.js`** — change the signature and thread it into extras:

```js
export default function TerminalHero({ activity = null }) {
```

```js
      const result = runCommand(raw, cwd, setCwd, setHistory, {
        theme,
        toggleTheme,
        cmdHistory,
        activity,
        startMatrix: () => setMatrixOn(true),
      });
```

(Both call sites — `execute` only, since Task 5 unified Enter through `execute`.)

- [ ] **Step 6: Add the `activity` command to `commands.js`**:

```jsx
  if (c === "activity") {
    const a = extras.activity;
    if (!a) return ERR("activity: github unreachable — try again later");
    const blocks = "▁▂▃▅█";
    const recent = a.weeks.slice(-12);
    const weekly = recent.map((w) =>
      w.reduce((s, d) => s + (d?.count ?? 0), 0)
    );
    const max = Math.max(...weekly, 1);
    const spark = weekly
      .map((n) => (n === 0 ? blocks[0] : blocks[Math.min(4, Math.ceil((n / max) * 4))]))
      .join("");
    return (
      <div>
        <div>
          <span className="text-amber-700 dark:text-amber-400">{spark}</span>{" "}
          <span className="text-stone-500 dark:text-stone-500">
            last 12 weeks
          </span>
        </div>
        <div>
          {a.total} contributions in the last year
          {a.streak > 0 ? ` · ${a.streak}d streak` : ""}
        </div>
        {a.commits.map((cm) => (
          <div key={cm.sha} className="truncate">
            <span className="text-amber-700 dark:text-amber-400">{cm.sha}</span>{" "}
            <span className="text-sky-700 dark:text-sky-400">{cm.repo}</span>{" "}
            <span className="text-stone-500 dark:text-stone-500">
              — {cm.message}
            </span>
          </div>
        ))}
      </div>
    );
  }
```

- [ ] **Step 7: Verify in dev server**

Home: activity pane below the `cd ~/projects` link — real heatmap, plausible totals, ≤3 recent commits. Resize to mobile: heatmap shows 26 columns. Terminal: `activity` prints sparkline + stats. Enter (outside terminal) still goes to /projects. Failure path: temporarily change `USER` to `nonexistent-user-zzz-404`, reload → pane absent, home otherwise normal, `activity` shows the rose error; **revert `USER`**.

- [ ] **Step 8: Build + commit**

```bash
npm run build
git add -A
git commit -m "feat: live github activity — home pane + terminal command (ISR 1h)"
```

---

### Task 8: Writing section

**Files:**
- Create: `src/app/writing/page.js`
- Create: `src/app/writing/example-post/page.mdx`
- Rewrite: `src/app/layouts/MdxLayout.js`
- Modify: `src/app/components/Header.js`, `src/app/components/CommandPalette.js`

- [ ] **Step 1: Create `src/app/writing/page.js`**:

```jsx
import NextLink from "next/link";
import { publishedPosts } from "./posts";

export const metadata = {
  title: "writing · mohammed elshrief",
  description: "essays + notes on agents, engineering, and shipping.",
};

export default function Writing() {
  return (
    <>
      <div className="font-mono text-xs text-stone-500 dark:text-stone-500">
        mohammed@portfolio:
        <span className="text-amber-700 dark:text-amber-400">~/writing</span>$
        ls -t
        <span className="text-stone-400 dark:text-stone-600">
          {" "}
          · {publishedPosts.length}{" "}
          {publishedPosts.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      {publishedPosts.length === 0 ? (
        <p className="font-mono text-sm text-stone-400 dark:text-stone-600 italic">
          // nothing published yet
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {publishedPosts.map((post) => (
            <NextLink
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group rounded-md border border-stone-300 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30 px-3.5 py-3 hover:border-amber-500/60 dark:hover:border-amber-400/60 transition-colors"
            >
              <div className="text-stone-800 dark:text-stone-200 font-medium text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                {post.title}
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-sm mt-0.5">
                {post.summary}
              </p>
              <div className="font-mono text-micro text-stone-400 dark:text-stone-600 mt-1.5">
                {post.date} · {post.readMins} min
              </div>
            </NextLink>
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Replace the contents of `src/app/layouts/MdxLayout.js`**:

```jsx
import NextLink from "next/link";
import Pane from "../components/Pane";
import { posts, publishedPosts } from "../writing/posts";

export default function MdxLayout({ slug, children }) {
  const post = posts.find((p) => p.slug === slug);
  const pubIdx = publishedPosts.findIndex((p) => p.slug === slug);
  const prev = pubIdx > 0 ? publishedPosts[pubIdx - 1] : null;
  const next =
    pubIdx >= 0 && pubIdx < publishedPosts.length - 1
      ? publishedPosts[pubIdx + 1]
      : null;

  return (
    <article className="w-full min-w-0">
      <Pane path={`~/writing/${slug}.md`} meta="less">
        {post && (
          <div className="font-mono text-micro text-stone-400 dark:text-stone-600 mb-4">
            {post.date} · {post.readMins} min read
          </div>
        )}
        <div className="prose prose-sm prose-stone dark:prose-invert max-w-none prose-headings:font-medium prose-a:text-amber-700 dark:prose-a:text-amber-400">
          {children}
        </div>
        <div className="font-mono text-xs text-stone-400 dark:text-stone-600 mt-6 select-none">
          (END)
        </div>
      </Pane>
      {(prev || next) && (
        <div className="flex justify-between font-mono text-xs mt-4 text-stone-500 dark:text-stone-500">
          {prev ? (
            <NextLink
              href={`/writing/${prev.slug}`}
              className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              $ cd ../{prev.slug}
            </NextLink>
          ) : (
            <span />
          )}
          {next ? (
            <NextLink
              href={`/writing/${next.slug}`}
              className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              $ cd ../{next.slug}
            </NextLink>
          ) : (
            <span />
          )}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 3: Create `src/app/writing/example-post/page.mdx`** (template Mo replaces; `published: false` keeps it out of the index/terminal/sitemap; `robots noindex` keeps crawlers off the direct URL):

````mdx
import MdxLayout from "../../layouts/MdxLayout";

export const metadata = {
  title: "example post · mohammed elshrief",
  description: "post template — replace with real writing.",
  robots: { index: false },
};

## how posts work

Write normal prose. Inline `code` gets the mono treatment, and fenced blocks
get prism highlighting via the existing rehype pipeline:

```python
def hello(name: str) -> str:
    return f"honk, {name}"
```

- lists work
- **bold** and *italics* work
- [links](https://moelshrief.wiki) get the amber treatment

To publish: copy this directory, write, then flip `published: true` in
`src/app/writing/posts.js`.

export default function Page({ children }) {
  return <MdxLayout slug="example-post">{children}</MdxLayout>;
}
````

- [ ] **Step 4: Add `writing` to the header nav** in `src/app/components/Header.js` — extend the `links` array inside `useMemo`:

```js
      {
        name: "writing",
        href: "/writing",
        isActive: pathname.startsWith("/writing"),
        isNextLink: true,
      },
```

- [ ] **Step 5: Add `writing` to the command palette** in `src/app/components/CommandPalette.js`:

In the open-palette shortcuts map (the `useEffect` with `shortcuts = {...}`), add:

```js
        w: () => router.push("/writing"),
```

In the `// navigation` group, after the projects `Item`:

```jsx
                  <Item
                    value="writing essays notes blog posts"
                    prefix="→"
                    name="writing"
                    dest="./writing"
                    shortcut="W"
                    isModifierPressed={isModifierPressed}
                    onSelect={() => runCommand(() => router.push("/writing"))}
                  />
```

- [ ] **Step 6: Verify in dev server**

`/writing`: context line + `// nothing published yet`. `/writing/example-post` direct URL: pane title `~/writing/example-post.md · less`, prism-highlighted python block, `(END)`, no prev/next. Temporarily set `published: true` in `posts.js` → index shows the row; terminal `writing` lists `example-post.md`, `cat example-post.md` shows summary, `open example-post.md` navigates in-tab; statusline `2:writing*` amber on the page; palette ⌘K → "writing" + shift+W works. **Revert to `published: false`.**

- [ ] **Step 7: Build + commit**

```bash
npm run build
git add -A
git commit -m "feat: writing section — mdx posts, registry, less-style reader"
```

---

### Task 9: Polish — 404, JSON-LD, sitemap, focus rings, reduced motion

**Files:**
- Create: `src/app/not-found.js`
- Create: `src/app/sitemap.js`
- Delete: `public/sitemap.xml`
- Modify: `src/app/layout.js`, `src/app/globals.css`, `src/app/components/Header.js`

- [ ] **Step 1: Create `src/app/not-found.js`**:

```jsx
import NextLink from "next/link";

export const metadata = { title: "404 · mohammed elshrief" };

export default function NotFound() {
  return (
    <div className="font-mono text-sm rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-sm p-5 text-stone-700 dark:text-stone-300 leading-relaxed w-full min-w-0">
      <div>
        <span className="text-stone-500 dark:text-stone-500">
          mohammed@portfolio:~$
        </span>{" "}
        <span className="text-stone-800 dark:text-stone-200">
          cd ./this-page
        </span>
      </div>
      <div className="text-rose-600 dark:text-rose-400 mt-1">
        bash: cd: ./this-page: no such file or directory
      </div>
      <div className="mt-3">
        <span className="text-stone-500 dark:text-stone-500">
          mohammed@portfolio:~$
        </span>{" "}
        <NextLink
          href="/"
          className="text-amber-700 dark:text-amber-400 hover:underline underline-offset-4"
        >
          cd ~
        </NextLink>
        <span
          aria-hidden="true"
          className="ml-1 inline-block w-[7px] h-[14px] bg-amber-500 dark:bg-amber-400 align-middle animate-cursor-blink"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/sitemap.js` and delete the static file**:

```js
import { publishedPosts } from "./writing/posts";

export default function sitemap() {
  const base = "https://moelshrief.wiki";
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/writing`, changeFrequency: "weekly", priority: 0.8 },
    ...publishedPosts.map((p) => ({
      url: `${base}/writing/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly",
      priority: 0.6,
    })),
  ];
}
```

```bash
git rm public/sitemap.xml
```

(`public/robots.txt` already points at `https://moelshrief.wiki/sitemap.xml` — unchanged.)

- [ ] **Step 3: Add JSON-LD Person to `src/app/layout.js`.** Above the component:

```js
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohammed Elshrief",
  url: "https://moelshrief.wiki",
  image: "https://moelshrief.wiki/my-pfp.jpg",
  jobTitle: "Management Engineering Student",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Waterloo",
  },
  sameAs: [
    "https://github.com/ManagementMO",
    "https://www.linkedin.com/in/mohammed-elshrief/",
    "https://devpost.com/ManagementMO",
  ],
};
```

In `<head>`, after the theme init script:

```jsx
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
```

- [ ] **Step 4: Global focus rings in `src/app/globals.css`** — append inside the existing `@layer base` block:

```css
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  [role="button"]:focus-visible {
    outline: 2px solid rgb(245 158 11 / 0.7);
    outline-offset: 2px;
    border-radius: 2px;
  }
```

(The terminal input's `outline-none` utility class wins over the base layer — intended; it keeps the amber caret instead.)

- [ ] **Step 5: Reduced-motion guard for the wordmark scramble** in `src/app/components/Header.js` — first line of `ScrambleText`'s `start` function:

```js
  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHovered(true);
      return;
    }
```

Also change the header pulse dot's class from `animate-pulse-dot` to `motion-safe:animate-pulse-dot`.

- [ ] **Step 6: Verify in dev server**

http://localhost:8080/nope → terminal 404, `cd ~` returns home. http://localhost:8080/sitemap.xml → 3 URLs. View source on / → `application/ld+json` Person blob. Tab through header/statusline/footer → amber rings. Reduced-motion emulation: wordmark hover = color-only, dot static.

- [ ] **Step 7: Build + commit**

```bash
npm run build
git add -A
git commit -m "polish: terminal 404, json-ld person, dynamic sitemap, focus rings, reduced-motion sweep"
```

---

### Task 10: Full QA pass

**Files:** fixes only as discovered.

- [ ] **Step 1: Clean build + lint**

```bash
npm run lint && npm run build
```

Expected: zero errors, zero warnings introduced by this work.

- [ ] **Step 2: Link liveness check** (spec rule: never a dead link)

```bash
for u in "https://devpost.com/software/scam-mah" "https://jasooh.github.io/mse-100-launch-page/" "https://github.com/ManagementMO/mo-planner" "https://paybridgetech.com/"; do
  printf "%s → " "$u"; curl -s -o /dev/null -w "%{http_code}\n" -L --max-time 10 "$u";
done
```

Expected: 200s. Any 404/000 → remove that `href` from `projectsData.js` (row renders unlinked per spec) and note it for Mo.

- [ ] **Step 3: Browser QA with screenshots** (use the Playwright tooling against `npm run dev`):
  - Home, /projects, /writing, /writing/example-post, /404 — each in **light + dark**, at **1280×800 and 375×812**.
  - Reduced-motion emulation: home + projects (no scramble/write-in/fade/rain).
  - Terminal regression, typed in the real browser: `help`, `tree`, `ls -a`, `cat .secrets`, `cd projects/archive && ls`, `git log`, `activity`, `cowsay`, `sl`, `matrix` + any-key exit, tab-complete, ↑ history, `ctrl+l`, `theme light`, `exit`.
  - Statusline: clock matches Waterloo time, tabs navigate, `theme=` syncs with header toggle + terminal command.
  - Signature height vs footer icons (the "tuned by eye" spec rule) — adjust `text-2xl` up/down one step if mismatched.

- [ ] **Step 4: Confirm archive years with Mo** — focusforge 2024 / mo-planner 2023 are best-guess; scam-mah 2024 is confirmed (NewHacks 2024). One-line data fix if he corrects.

- [ ] **Step 5: Fix anything found, then final commit**

```bash
npm run build
git add -A
git commit -m "qa: cross-browser/theme/motion pass + fixes"
```

---

## Self-Review Notes (already applied)

- Spec §2 archive "render unlinked if no recoverable link" → handled in `ProjectSearch.js` archive row conditional + Task 10 liveness check.
- Spec §3 `activity` failure line, §9 failure table → `ERR("activity: github unreachable — try again later")` matches.
- `runCommand` extras shape is defined once and used identically in Tasks 4/5/7: `{ theme, toggleTheme, cmdHistory, activity, startMatrix }`.
- `Pane` props (`path`, `meta`, `children`) used consistently by `ProjectPane`, `ActivityPane`, `MdxLayout`.
- `posts.js` exports (`posts`, `publishedPosts`) consumed by fs.js (Task 4), writing page + MdxLayout (Task 8), sitemap (Task 9) — names consistent.
- No statusline "uptime" segment (spec keeps uptime as terminal command only) ✓; clock format HH:MM per spec ✓.
