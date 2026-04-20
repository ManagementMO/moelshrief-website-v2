# My (Mohammed Elshrief's) Portfolio

## 🛠️ Built With

- React
- TypeScript
- Tailwind CSS
- Three.js
- Framer Motion
- Vite

---

## 🎨 Design Skills & MCP Servers

This project includes a curated set of design, accessibility, and UX tooling. See **[docs/design-mcps.md](docs/design-mcps.md)** for the full guide, including:

- Recommended MCP servers (Figma, Playwright, Color Contrast, Typography)
- Accessibility linting with `eslint-plugin-jsx-a11y`
- Lighthouse CI audits for performance, accessibility, and SEO
- Design token system (`src/tokens/design-tokens.ts`)
- Recommended design iteration workflow

### Quick Start

```bash
# Run the linter (includes accessibility rules)
npm run lint

# Build + run a full Lighthouse audit (performance, accessibility, SEO)
npm run lighthouse

# Build + run Lighthouse with accessibility focus
npm run a11y
```

### Design Tokens

All design decisions (colors, typography, spacing, motion) are documented in `src/tokens/design-tokens.ts`. Import them anywhere Tailwind classes can't reach (Three.js, canvas, Framer Motion variants):

```typescript
import { tokens } from '@/tokens/design-tokens';
const accentColor = tokens.color.accent.DEFAULT; // '#0d9488'
```

### Accessibility Standards

- Target: **WCAG 2.1 AA** compliance
- Lighthouse accessibility score threshold: **≥ 90**
- All `<img>` elements must have `alt` text
- All interactive elements must be keyboard-accessible
