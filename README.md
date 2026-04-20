# My (Mohammed Elshrief's) Portfolio

## 🛠️ Built With

- React
- TypeScript
- Tailwind CSS
- Three.js
- Framer Motion
- Vite

## 🚀 Development

```bash
npm install --legacy-peer-deps
npm run dev        # start dev server on localhost:8080
npm run build      # TypeScript compile + Vite build
npm run preview    # preview production build
```

## ✅ Code Quality

```bash
npm run lint          # ESLint: TypeScript + React Hooks + jsx-a11y
npm run format        # Prettier: auto-format source files
npm run format:check  # Prettier: check formatting without writing (used in CI)
```

## 🎨 Design

Design decisions, the token system, the accessibility checklist, and the full iteration workflow are documented in **[docs/design.md](docs/design.md)**.

Design primitives (colours, type scale, spacing, motion, breakpoints) are captured in **[tokens.json](tokens.json)**.

## 🤖 CI

| Workflow | Trigger | What it checks |
|---|---|---|
| `netlify-deploy.yml` | push/PR → `main` | Build + Netlify deploy |
| `design-checks.yml` | push/PR → `main` | ESLint a11y, Prettier, Lighthouse CI |

