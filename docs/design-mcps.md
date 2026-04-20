# Design Skills & MCP Servers

> Curated tooling for design, UX, and accessibility workflows in this portfolio.

---

## Table of Contents

1. [Stack Overview](#stack-overview)
2. [MCP Servers — Curated List](#mcp-servers--curated-list)
3. [Integrated Tooling](#integrated-tooling)
   - [Accessibility Linting (jsx-a11y)](#accessibility-linting-jsx-a11y)
   - [Lighthouse CI](#lighthouse-ci)
   - [Design Tokens](#design-tokens)
4. [Design Workflow](#design-workflow)
5. [Recommended External MCPs](#recommended-external-mcps)

---

## Stack Overview

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite + SWC |
| Styling | Tailwind CSS 3 (utility-first, dark-mode class) |
| Component Primitives | Radix UI (shadcn/ui wiring) |
| Animation | Framer Motion |
| 3D | Three.js + React Three Fiber |
| Deployment | Netlify / Vercel |

Design system approach: **token-based** CSS custom properties surfaced through Tailwind's `theme.extend`, with a hand-crafted cyberpunk/minimal-dark aesthetic.

---

## MCP Servers — Curated List

The following MCP (Model Context Protocol) servers are recommended for design and UX work on this project. They can be added to any MCP-compatible AI IDE (e.g. Cursor, Windsurf, VS Code Copilot Chat).

### 🎨 Figma MCP
**Purpose:** Sync design tokens, components, and assets directly from Figma files into code.  
**Server:** [`@figma/mcp`](https://www.npmjs.com/package/@figma/mcp) *(official Figma MCP)*  
**Use cases for this project:**
- Export color/spacing/typography tokens from a Figma file into `src/tokens/design-tokens.ts`
- Preview component variants before implementing them in React
- Keep the cyberpunk color palette in sync between design and code

**Setup:**
```bash
# In your MCP client config (e.g. .cursor/mcp.json):
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "<your-personal-access-token>"
      }
    }
  }
}
```

---

### ♿ Accessibility Audit MCP
**Purpose:** Run automated WCAG 2.1/2.2 accessibility audits with axe-core inside your AI workflow.  
**Server:** [`@modelcontextprotocol/server-puppeteer`](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer) + axe injection, **or** the dedicated [`axe-mcp`](https://github.com/dequelabs/axe-mcp) server.  
**Use cases for this project:**
- Audit colour-contrast on the dark/light mode toggle
- Verify all interactive elements have proper ARIA labels
- Check keyboard navigation through the project cards and navigation

**Quick audit (no MCP needed):**
```bash
# Terminal 1 — build and start the preview server
npm run build && npm run preview

# Terminal 2 — run axe against it
npx axe http://localhost:4173 --exit
```

> **Or use the built-in script** which runs Lighthouse (includes axe-core):
> `npm run a11y`

---

### 🌈 Color Contrast Checker MCP
**Purpose:** Validate foreground/background pairs against WCAG AA (4.5:1) and AAA (7:1) ratios.  
**Server:** [`color-contrast-checker-mcp`](https://github.com/mckaywrigley/color-contrast-checker-mcp) *(community)*  
**Use cases for this project:**
- Validate the teal `#0d9488` accent on `#0c0a09` dark background → ratio ≈ 4.8:1 ✅ AA
- Check stone text colours against card backgrounds
- Ensure tag badge foreground/background pairs are accessible

**Manual check:**
```bash
npx -y wcag-contrast-checker "#0d9488" "#0c0a09"
```

---

### 🔤 Typography Scale MCP
**Purpose:** Generate and audit modular type scales, check `line-height` / `letter-spacing` relationships.  
**Server:** [`typography-mcp`](https://github.com/joshfarrant/typography-mcp) *(community)*  
**Use cases for this project:**
- Confirm the Inter/Lora pairing has consistent vertical rhythm
- Generate a modular scale (minor third 1.2× or major third 1.25×) from `base: 16px`
- Audit that heading `font-size` steps match the values in `src/tokens/design-tokens.ts`

**The current type scale** is documented in `src/tokens/design-tokens.ts → typographyTokens.fontSize`.

---

### ⚡ Lighthouse / Performance MCP
**Purpose:** Automated Lighthouse audits for performance, accessibility, SEO, and best practices.  
**Server:** [`lighthouse-mcp`](https://github.com/GoogleChrome/lighthouse) via `@lhci/cli`  
**Already integrated** — see [Lighthouse CI](#lighthouse-ci) below.

---

### 🖼️ Image Optimisation MCP
**Purpose:** Audit image formats, sizes, and loading strategies.  
**Server:** [`squoosh-mcp`](https://github.com/GoogleChromeLabs/squoosh) *(community wrapper)*  
**Use cases for this project:**
- Convert project preview images in `public/images/projects/` from PNG/SVG to WebP/AVIF
- Ensure `width`/`height` attributes are set to prevent CLS
- Check lazy-loading strategy for below-the-fold images

---

### 🎯 Design Token Sync MCP
**Purpose:** Keep CSS custom properties, Tailwind config, and JS token file in sync.  
**Server:** [`style-dictionary-mcp`](https://amzn.github.io/style-dictionary/) *(Style Dictionary wrapper)*  
**Already partially integrated** — tokens live in `src/tokens/design-tokens.ts`.

**To extend with Style Dictionary (optional):**
```bash
npm install --save-dev style-dictionary
```
Then run `npx style-dictionary build` with a `config.json` that points to your token files.

---

### 📐 Responsive Layout Review MCP
**Purpose:** Snapshot components at multiple breakpoints and diff against design specs.  
**Server:** [`playwright-mcp`](https://github.com/microsoft/playwright-mcp) *(official Microsoft MCP)*  
**Use cases for this project:**
- Screenshot the hero section at 375px, 768px, 1280px and 1400px
- Verify the `section-container` max-width (560px) looks correct at all sizes
- Detect overflow issues on mobile

**Setup:**
```bash
# In your MCP client config:
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

---

### 🔍 SEO & Meta MCP
**Purpose:** Audit `<meta>` tags, Open Graph, Twitter Cards, and structured data.  
**Server:** Use Lighthouse SEO audit (included in `npm run lighthouse`).  
**Use cases for this project:**
- Verify `description`, `og:image`, `og:title` are present on all pages
- Check `robots.txt` and `sitemap.xml`
- Validate JSON-LD structured data

---

## Integrated Tooling

### Accessibility Linting (jsx-a11y)

`eslint-plugin-jsx-a11y` is installed and configured in `eslint.config.js`. It runs as part of the standard lint step.

```bash
npm run lint          # includes all jsx-a11y warnings/errors
```

**Rules enabled** (as `warn`):
- `alt-text` — `<img>` / `<area>` must have meaningful alt attributes
- `anchor-is-valid` — `<a>` must have content and a valid href
- `aria-*` — correct ARIA attribute names, values, and roles
- `click-events-have-key-events` — interactive click handlers need keyboard equivalents
- `heading-has-content` — headings must not be empty
- `html-has-lang` — `<html>` must declare a language
- `interactive-supports-focus` — interactive elements must be focusable
- `label-has-associated-control` — form labels must reference their input
- `no-autofocus` — avoid stealing focus on load
- `tabindex-no-positive` — positive tabindex values break natural tab order

To fix auto-fixable issues:
```bash
npx eslint . --ext ts,tsx --fix
```

---

### Lighthouse CI

**Config file:** `.lighthouserc.json`  
**Package:** `@lhci/cli` (installed as devDependency)

**Run a local Lighthouse audit (includes accessibility):**
```bash
npm run lighthouse
# or: npm run a11y  (alias for the same command)
```

**Run a manual axe accessibility check** (requires a running preview server):
```bash
# Terminal 1 — start the preview server
npm run preview

# Terminal 2 — run axe against it
npx axe http://localhost:4173 --exit
```

This command:
1. Builds the project (`npm run build`)
2. Starts the preview server on `localhost:4173`
3. Runs Lighthouse against it
4. Asserts against the thresholds in `.lighthouserc.json`:
   - Accessibility ≥ 90 (error threshold)
   - Performance ≥ 70 (warning)
   - Best Practices ≥ 85 (warning)
   - SEO ≥ 90 (warning)
   - Color contrast: pass
   - Image alt text: pass

**Thresholds** are defined in `.lighthouserc.json` and can be tightened over time.

---

### Design Tokens

**File:** `src/tokens/design-tokens.ts`

All design decisions are documented and exported as typed TypeScript constants. Import them anywhere Tailwind classes cannot reach (Three.js materials, canvas, Framer Motion variants, etc.):

```typescript
import { tokens } from '@/tokens/design-tokens';

// Use in Three.js material
const material = new MeshStandardMaterial({
  color: tokens.color.accent.DEFAULT,
});

// Use in Framer Motion
<motion.div
  variants={tokens.motion.variants.fadeInUp}
  initial="hidden"
  animate="visible"
>

// Use in inline styles / canvas
ctx.fillStyle = tokens.color.stone[800];
```

**Token categories:**
| Category | Description |
|---|---|
| `color` | Brand accent, stone neutrals, surface, text, border |
| `typography` | Font families, size scale, weight, line-height, letter-spacing |
| `spacing` | Grid base, section max-width, gutters, gap scale |
| `radius` | Border radius scale |
| `shadow` | Elevation + teal glow |
| `motion` | Duration, easing, Framer Motion variants |
| `breakpoint` | Matches Tailwind breakpoints |
| `zIndex` | Z-index scale |

---

## Design Workflow

### Iteration loop

```
1. Design in Figma (or in-code)  →  Figma MCP exports tokens
2. Update src/tokens/design-tokens.ts
3. Use tokens in Tailwind config / components
4. npm run lint   — catch a11y issues early
5. npm run build  — verify TypeScript + Vite build
6. npm run lighthouse  — audit perf, a11y, SEO
7. Fix issues  →  repeat from step 4
8. Open PR / deploy
```

### Colour-change checklist

- [ ] Update `src/tokens/design-tokens.ts → colorTokens`
- [ ] Update corresponding CSS variables in `src/index.css` `:root`
- [ ] Update `tailwind.config.ts` if a new Tailwind color alias is needed
- [ ] Run `npm run lint` to surface any contrast warnings
- [ ] Run `npm run lighthouse` to validate contrast audit passes

### Adding a new component

- [ ] Use Tailwind utility classes referencing existing tokens (e.g. `text-teal-600 dark:text-teal-400`)
- [ ] Add ARIA roles / labels for interactive elements
- [ ] Add `alt` text to any `<img>` elements
- [ ] Ensure keyboard focusability (`tabIndex`, `onKeyDown`) for click handlers
- [ ] Run `npm run lint` before opening a PR

---

## Recommended External MCPs

For use with AI-powered IDEs (Cursor, Windsurf, VS Code with Copilot MCP extension):

| MCP | Install | Primary Use |
|---|---|---|
| `@figma/mcp` | `npx -y @figma/mcp` | Design token sync, asset export |
| `@playwright/mcp` | `npx -y @playwright/mcp@latest` | Responsive screenshots, E2E a11y |
| `@modelcontextprotocol/server-puppeteer` | `npx -y @modelcontextprotocol/server-puppeteer` | Headless browser automation |
| `github-mcp-server` | `npx -y @modelcontextprotocol/server-github` | PR review, issue tracking |

Add to your IDE's MCP config (e.g. `.cursor/mcp.json` or `.windsurf/mcp.json`):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp"],
      "env": { "FIGMA_ACCESS_TOKEN": "YOUR_TOKEN_HERE" }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

> **Note:** Never commit access tokens — use environment variables or your IDE's secret manager.
