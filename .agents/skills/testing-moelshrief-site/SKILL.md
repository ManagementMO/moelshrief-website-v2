---
name: testing-moelshrief-site
description: How to run and test the moelshrief.com Next.js portfolio site locally, including agent/markdown content negotiation endpoints.
---

# Testing moelshrief-website-v2 locally

- Prod-like run: `npm install`, then `npm run build && npm start` — serves on port 3000. A stale server may hold the port; kill it with `fuser -k 3000/tcp` first. (Note: CLAUDE.md is outdated — it describes an old Vite app on port 8080; the repo is now Next.js.)
- Unit tests: `npm test` (node --test tests/*.test.mjs).
- Markdown content negotiation: `curl -H "Accept: text/markdown" localhost:3000/<path>` should return text/markdown with `Vary: Accept` (handled by `src/proxy.js` rewriting to `/md/[[...path]]`, content generated in `src/app/lib/markdown.js`). Unknown paths return a markdown 404. `/md/<path>` can also be hit directly.
- Browser features to regression-check: interactive terminal on homepage (click prompt, type `ls`, `cat about.md`), command palette (Ctrl+K or the `[>]` header button), theme toggle, 404 page terminal block (`ls ~` links + `cd ~` back home).
- Agent files: `/llms.txt`, `/sitemap.xml`, `/robots.txt` — canonical domain is moelshrief.com.

## Devin Secrets Needed
None — site is public and runs fully locally.
