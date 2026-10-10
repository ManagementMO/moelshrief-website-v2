# Agent readiness verification

The homepage preserves its original visible copy and its original Markdown
introduction. Agent-facing identity, heading structure, and HTML efficiency are
improved. The 5% text-to-HTML target remains a warning with the original copy.

## Changes

- The homepage has a readable H1 and three sequential H2 career sections. The
  terminal starts with `# studying`; no introductory biography was added.
  Its role wording, ordering, and original Markdown introduction are preserved.
- Search identity uses the confirmed name, Waterloo affiliation, canonical apex,
  existing profile links, Open Graph site name, and linked Person, WebSite, and
  homepage ProfilePage JSON-LD. Existing Google and Bing verification markers remain.
- The contribution grid is an external SVG, retaining square cells, 2px gutters
  and corner radii, original colors, 52 desktop weeks, and 26 mobile weeks. SVG
  theme selection inherits the user's site theme and works without JavaScript.
- The terminal receives aggregate weekly totals, contribution count, streak,
  and recent commits instead of a year of daily records. Its activity sparkline
  and command behavior remain intact.
- Shared CSS, a licensed social icon sprite, and prerendered client boundaries
  reduce repeated markup and hydration data. Next.js still prerenders real HTML;
  no bot-specific rendering or removal of required hydration scripts is used.
- Unused font loads were removed. Security discovery files have complete,
  newline-terminated RFC 9116 fields and identical canonical information.

## Measured result

Measured with the same HTML parser before and after. It excludes the head,
scripts, styles, SVG contents, aria-hidden text, and decorative divider characters.
The denominator is the complete uncompressed HTTP response size in bytes.

| Measurement | Existing live homepage | Local production build |
| --- | ---: | ---: |
| HTML bytes | 106,364 | 22,438 |
| Readable characters | 677 | 697 |
| Readable characters / HTML bytes | 0.636% | 3.106% |

The HTML is 78.90% smaller. This is a local production-server measurement, not a
new Ora score. The existing content still exceeds the 500-character no-JS
threshold. The terminal's original height is restored. Role wording, ordering,
logos, layout width, themes, and interaction patterns remain the same.

## Reproduce

Use Node 20, matching the repository's deployment configuration:

```sh
npm test
npm run lint
npm run build
npm start -- --port 3086
```

In another terminal:

```sh
python3 scripts/verify-agent-readiness.py http://localhost:3086
bash /Users/mo/.codex/skills/playwright/scripts/playwright_cli.sh -s=agent-readiness open http://localhost:3086/ --headed
bash /Users/mo/.codex/skills/playwright/scripts/playwright_cli.sh -s=agent-readiness run-code "$(cat scripts/verify-agent-browser.js)"
```

The HTTP verifier checked 115 responses: sitemap-listed pages and canonicals,
both negotiated and direct Markdown, all public files/assets, generated SVGs and
social images, the unpublished template, the existing Markdown about alias,
404s, and an invalid heatmap parameter. It parses JSON-LD, SVG/sitemap XML,
the web manifest, robots.txt, llms.txt, and security.txt instead of relying on
status codes alone.

Browser verification passed for desktop and 390px touch emulation, both themes,
JavaScript disabled, terminal commands/history/completion, activity sparkline,
command palette, reduced motion, footer hover, projects, both published articles,
and 404 recovery. Screenshots are in the ignored `output/playwright/` directory.
Local Vercel analytics script requests return 404 because those services are
provided by the deployment platform; no React hydration error occurred locally.

## Release verification and remaining recommendations

1. After deploying reviewed changes, rerun the HTTP verifier against the public
   URL. Get a fresh Is Agentic report and confirm its scan timestamp changed.
2. Use the existing Google/Bing verification markers to verify ownership in
   Search Console and Bing Webmaster Tools, submit the sitemap, and request a
   recrawl. Code improves identity signals; rankings
   and indexing are external outcomes. Google documents its
   [profile-page release and recrawl workflow](https://developers.google.com/search/docs/appearance/structured-data/profile-page#how-to-add-structured-data).
3. Confirm content-negotiation cache separation at the deployment edge. The
   installed Next.js renderer overwrites `Vary: Accept` on HTML despite the
   existing proxy/config declarations; Markdown retains it. The HTTP verifier
   reports this existing issue as a warning. Any edge header fix must append
   Accept while retaining Next.js's RSC/router Vary fields.
4. The refreshed stored Is Agentic report also mentions a missing `/about` HTML
   page. The visible About page is currently `/`; decide whether to add an HTML
   alias or a separate page. This is outside the three requested fixes.
5. Reaching 5% with the original short copy requires further framework/markup
   reduction. Adding visible copy requires an explicit content decision; this
   implementation preserves the user's existing wording.

Protocol references: [Schema.org](https://schema.org/),
[Google site names](https://developers.google.com/search/docs/appearance/site-names),
[sitemap XML](https://www.sitemaps.org/protocol.html),
[llms.txt](https://llmstxt.org/),
[RFC 9309 robots.txt](https://www.rfc-editor.org/rfc/rfc9309),
[RFC 9116 security.txt](https://www.rfc-editor.org/rfc/rfc9116), and
[Markdown content negotiation](https://acceptmarkdown.com/).
