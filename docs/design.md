# Design Skills & UX Improvement Guide

> **Audience:** Contributors to [moelshrief.wiki](https://moelshrief.wiki).
> **Goal:** Keep the portfolio looking polished, accessible, and fast — with low overhead.

---

## Table of Contents

1. [Design Checklist](#1-design-checklist)
2. [Design Tokens](#2-design-tokens)
3. [Running Checks Locally](#3-running-checks-locally)
4. [CI / Automated Gates](#4-ci--automated-gates)
5. [Iteration Workflow](#5-iteration-workflow)
6. [Resources](#6-resources)

---

## 1. Design Checklist

Work through this checklist when adding or revising any page or component.

### Typography
- [ ] Use `font-sans` (`Inter`) for body text; `font-serif` (`Lora`) for section headings.
- [ ] Body weight is `300`; headings are `500–700`.
- [ ] Line-height: `relaxed` (1.625) for body, `tight` (1.25) for display headings.
- [ ] Minimum body font size: `1rem` (16 px). Never go below `0.875rem` for non-decorative text.
- [ ] Maintain a clear type scale — avoid arbitrary font sizes. Use the steps in `tokens.json`.

### Spacing & Layout
- [ ] Use the spacing scale from `tokens.json` (multiples of `0.25rem`).
- [ ] The section container max-width is `560px` on content pages — don't widen arbitrarily.
- [ ] Consistent padding: `px-6 md:px-0` inside `.section-container`.
- [ ] Generous whitespace between sections (`py-16` or more).

### Colour & Contrast
- [ ] All text meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text).
- [ ] Accent colour `#0d9488` (teal-600) passes AA on both light and dark backgrounds when paired with the standard foreground colours.
- [ ] Never use colour alone to convey meaning — pair with icon, shape, or text label.
- [ ] Test both light **and** dark modes before shipping (the theme toggle is locked to dark in production, but keep light styles maintained).

### Responsiveness
- [ ] Test at `375px` (mobile S), `768px` (tablet), `1280px` (desktop).
- [ ] All interactive targets are at least `44×44 px` on touch devices.
- [ ] Navigation is keyboard-navigable and wraps cleanly at small viewports.
- [ ] Images and 3D canvases degrade gracefully (`prefers-reduced-motion` respected).

### Motion & Animation
- [ ] Respect `prefers-reduced-motion` — disable or soften Framer Motion animations for users who opt out.
- [ ] Animation durations follow the motion tokens: fast `150ms`, normal `200ms`, slow `300ms`.
- [ ] Standard easing: `cubic-bezier(0.4, 0, 0.2, 1)` for most transitions.
- [ ] Three.js particle effects should pause when the tab is hidden (`visibilitychange`).

### Accessibility (a11y)
- [ ] Every `<img>` has a meaningful `alt` attribute (or `alt=""` for decorative images).
- [ ] All interactive elements (`button`, `a`, custom controls) are reachable and activatable via keyboard.
- [ ] ARIA roles, properties, and states are used correctly — validate with `npm run lint` (jsx-a11y rules).
- [ ] Landmark regions exist: `<header>`, `<main>`, `<footer>`, `<nav>`.
- [ ] Focus rings are visible (don't use `outline: none` without a replacement).
- [ ] Form labels are programmatically associated with their inputs.
- [ ] Color contrast passes on all interactive states (hover, focus, disabled).

### Content & Copy
- [ ] Headings follow a logical hierarchy: one `<h1>` per page, then `<h2>` → `<h3>`.
- [ ] Link text is descriptive — avoid "click here" or bare URLs.
- [ ] Date/time strings are wrapped in `<time datetime="...">` where relevant.
- [ ] Meta title and description are unique per page and under 60/160 characters.

---

## 2. Design Tokens

All design primitives live in [`tokens.json`](../tokens.json) at the repo root.

| Category | Key examples |
|---|---|
| **Colour** | `color.accent`, `color.background.dark`, `color.primary` |
| **Typography** | `typography.fontFamily.sans`, `typography.fontSize.base` |
| **Spacing** | `spacing.4` (1 rem), `spacing.8` (2 rem) |
| **Border radius** | `borderRadius.lg` (0.5 rem default) |
| **Motion** | `motion.duration.normal` (200 ms), `motion.easing.standard` |
| **Breakpoints** | `breakpoint.md` (768 px) |

### How tokens map to CSS

The tokens are mirrored as CSS custom properties in `src/index.css`:

```css
:root {
  --color-accent: #0d9488;    /* tokens.color.accent */
  --radius: 0.5rem;           /* tokens.borderRadius.lg */
  --font-sans: "Inter", …;   /* tokens.typography.fontFamily.sans */
}
```

And as Tailwind theme values in `tailwind.config.ts`:

```ts
colors: {
  primary: "hsl(var(--primary))",   /* tokens.color.primary */
  accent:  "hsl(var(--accent))",
  …
}
```

> **Rule:** If you need a new colour, spacing step, or radius that isn't in the tokens, add it to `tokens.json` _first_, then update the CSS variable / Tailwind theme.

---

## 3. Running Checks Locally

### Prerequisites

```bash
npm install   # or npm install --legacy-peer-deps
```

### Lint (TypeScript + React + a11y)

```bash
npm run lint
```

This runs ESLint with:
- `typescript-eslint` — type safety
- `eslint-plugin-react-hooks` — hooks exhaustive-deps
- **`eslint-plugin-jsx-a11y`** — accessibility rules (new)

Common a11y warnings and how to fix them:

| Warning | Fix |
|---|---|
| `jsx-a11y/alt-text` | Add `alt="descriptive text"` to `<img>` |
| `jsx-a11y/anchor-has-content` | Ensure `<a>` has visible text or `aria-label` |
| `jsx-a11y/heading-has-content` | Headings must contain visible text |
| `jsx-a11y/aria-role` | Use a valid ARIA role string |

### Format (Prettier)

```bash
# Write fixes in-place
npm run format

# Check without writing (CI-safe)
npm run format:check
```

Prettier is configured in `.prettierrc` — 2-space indent, double quotes, trailing commas.

### Build

```bash
npm run build
```

Always run the build before opening a PR to catch TypeScript errors.

---

## 4. CI / Automated Gates

The workflow at `.github/workflows/design-checks.yml` runs on every PR:

| Job | What it checks |
|---|---|
| **lint** | ESLint with a11y rules (same as `npm run lint`) |
| **format** | Prettier check — currently informational (non-blocking). Remove `|| true` from the workflow once all files are formatted. |
| **lighthouse** | Lighthouse CI against the production URL with performance budgets |

### Lighthouse budgets (`.lighthouserc.json`)

| Metric | Minimum score |
|---|---|
| Performance | 80 |
| Accessibility | 90 |
| Best Practices | 90 |
| SEO | 90 |

To run Lighthouse locally against the preview build:

```bash
npm run build
npm run preview &          # serves on localhost:4173
npx lhci autorun           # reads .lighthouserc.json
```

---

## 5. Iteration Workflow

```
┌──────────────────────────────────────────────┐
│  1. Design change (content / component)       │
│     → Update tokens.json if primitives change │
├──────────────────────────────────────────────┤
│  2. Implement                                 │
│     → Use Tailwind utility classes            │
│     → Reference CSS variables / token values  │
├──────────────────────────────────────────────┤
│  3. Check locally                             │
│     → npm run lint      (a11y + TS errors)    │
│     → npm run format    (auto-format code)    │
│     → npm run build     (catch type errors)   │
├──────────────────────────────────────────────┤
│  4. Visual review                             │
│     → npm run preview   (production build)    │
│     → Test 375 px / 768 px / 1280 px widths  │
│     → Test dark mode                          │
│     → Test keyboard navigation                │
├──────────────────────────────────────────────┤
│  5. Open PR → CI runs lint + format + LHCI   │
│     → Address any failures before merging    │
└──────────────────────────────────────────────┘
```

### Quick accessibility wins (low effort, high impact)

1. **Images** — audit every `<img>` for `alt` text today.
2. **Focus styles** — add a visible `focus-visible` ring to all interactive elements.
3. **Contrast** — run Chrome DevTools > Rendering > emulate vision deficiencies on every page.
4. **`prefers-reduced-motion`** — wrap Framer Motion variants in a `useReducedMotion()` check.
5. **Skip link** — add `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>` at the top of the `<body>`.

---

## 6. Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [eslint-plugin-jsx-a11y rules](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#supported-rules)
- [Lighthouse CI docs](https://github.com/GoogleChrome/lighthouse-ci)
- [Framer Motion — `useReducedMotion`](https://www.framer.com/motion/use-reduced-motion/)
- [Design Tokens Community Group spec](https://tr.designtokens.org/format/)
- [Tailwind CSS dark mode](https://tailwindcss.com/docs/dark-mode)
