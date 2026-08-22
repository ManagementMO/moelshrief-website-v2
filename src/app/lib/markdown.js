// Markdown representations of every page, served to agents that ask for
// `Accept: text/markdown` (see src/proxy.js and src/app/md/route.js).
import { publishedPosts } from "../writing/posts";
import { projects, archive } from "../projects/projectsData";

export const SITE_URL = "https://moelshrief.com";

const footer = `
---

- Sitemap: ${SITE_URL}/sitemap.xml
- Agent guide: ${SITE_URL}/llms.txt
- Contact: ${SITE_URL}/contact
`;

function homeMarkdown() {
  return `# Mohammed Elshrief

Management Engineering student at the University of Waterloo. I build software
across engineering, data, and machine learning — and ship the occasional
hackathon project.

## currently

- Management Engineering @ University of Waterloo (https://uwaterloo.ca)

## building

- TRACE — agentic qa + observability for ai agents. catches them when they
  hallucinate. built at wat.ai w/ composio + magic hour. (https://watai.ca)

## previously

- Software Engineer @ Upfront Ventures (https://upfront.com)
- Software Engineer @ Altas Partners (https://www.altas.com)
- Software Engineer @ LiftWerx (https://www.liftwerx.com)
- Machine Learning Engineer @ WAT.ai (https://watai.ca)
- Machine Learning Engineer @ UTMIST (https://www.utmist.ca/)
- Hackathon Addict @ Devpost (https://devpost.com/ManagementMO)

## pages

- [Projects](${SITE_URL}/projects)
- [Writing](${SITE_URL}/writing)
- [Contact](${SITE_URL}/contact)
- [Privacy](${SITE_URL}/privacy)
${footer}`;
}

function projectsMarkdown() {
  const fmt = (p) =>
    `### ${p.title} (${p.year})\n\n${p.description}\n\n- Link: ${p.href}\n- Tech: ${p.technologies.join(", ")}`;
  return `# Projects — Mohammed Elshrief

## active

${projects.map(fmt).join("\n\n")}

## archive

${archive.map(fmt).join("\n\n")}
${footer}`;
}

function writingMarkdown() {
  return `# Writing — Mohammed Elshrief

Essays and notes on agents, engineering, and shipping.

${publishedPosts
  .map(
    (p) =>
      `- [${p.title}](${SITE_URL}/writing/${p.slug}) — ${p.date} · ${p.readMins} min\n  ${p.summary}`
  )
  .join("\n")}
${footer}`;
}

function postMarkdown(post) {
  return `# ${post.title}

- Author: Mohammed Elshrief
- Date: ${post.date}
- Reading time: ${post.readMins} min
- Canonical: ${SITE_URL}/writing/${post.slug}

${post.summary}

The full article (with interactive figures) is at
${SITE_URL}/writing/${post.slug}.
${footer}`;
}

function contactMarkdown() {
  return `# Contact — Mohammed Elshrief

- Email: mkelshri@uwaterloo.ca
- GitHub: https://github.com/ManagementMO
- LinkedIn: https://www.linkedin.com/in/mohammed-elshrief/
- Devpost: https://devpost.com/ManagementMO

Email is the most reliable channel. I read everything, and I reply fastest to
messages about software engineering, machine learning, agent tooling,
internships, and collaboration on hackathon or research projects.
${footer}`;
}

function privacyMarkdown() {
  return `# Privacy — moelshrief.com

This is a personal portfolio site. It has no accounts, no forms, and it does
not sell anything.

- No personal data is collected or stored by this site directly.
- Vercel Analytics and Speed Insights collect anonymous, aggregated
  performance and traffic metrics (no cookies, no cross-site tracking).
- Theme preference and terminal command history are stored only in your
  browser's localStorage and never leave your device.
- Questions: mkelshri@uwaterloo.ca
${footer}`;
}

export function notFoundMarkdown(pathname) {
  return {
    status: 404,
    body: `# 404 — not found

Nothing exists at \`${pathname}\` on ${SITE_URL}.

Where to look next:

- [Home / about](${SITE_URL}/) — who Mohammed Elshrief is
- [Projects](${SITE_URL}/projects)
- [Writing](${SITE_URL}/writing)
- [Contact](${SITE_URL}/contact)
- [Sitemap](${SITE_URL}/sitemap.xml) — every valid URL
- [llms.txt](${SITE_URL}/llms.txt) — agent guide for this site
`,
  };
}

export function markdownForPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  switch (path) {
    case "/":
    case "/about":
      return { status: 200, body: homeMarkdown() };
    case "/projects":
      return { status: 200, body: projectsMarkdown() };
    case "/writing":
      return { status: 200, body: writingMarkdown() };
    case "/contact":
      return { status: 200, body: contactMarkdown() };
    case "/privacy":
      return { status: 200, body: privacyMarkdown() };
    default: {
      const m = path.match(/^\/writing\/([^/]+)$/);
      const post = m && publishedPosts.find((p) => p.slug === m[1]);
      if (post) return { status: 200, body: postMarkdown(post) };
      return notFoundMarkdown(path);
    }
  }
}
