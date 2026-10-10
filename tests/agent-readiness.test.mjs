import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { identityMetadata, identityJsonLd, profileJsonLd, serializeJsonLd } from "../src/app/lib/identity.mjs";

const root = new URL("../", import.meta.url);
const text = (path) => readFile(new URL(path, root), "utf8");

test("canonical domain is moelshrief.com everywhere", async () => {
  const markdown = await text("src/app/lib/markdown.js");
  assert.match(markdown, /SITE_URL = "https:\/\/moelshrief\.com"/);
  for (const path of [
    "src/app/layout.js",
    "src/app/sitemap.js",
    "public/robots.txt",
    "public/security.txt",
    "public/llms.txt",
  ]) {
    const content = await text(path);
    assert.match(content, /moelshrief\.com/, path);
    assert.doesNotMatch(content, /moelshrief\.wiki/, path);
  }
});

test("layout declares canonical URL and complete Person JSON-LD", async () => {
  const layout = await text("src/app/layout.js");
  assert.match(layout, /alternates:\s*\{\s*canonical: "\/"/);
  assert.match(await text("src/app/components/SiteShell.js"), /serializeJsonLd\(identityJsonLd\)/);
  const person = identityJsonLd["@graph"].find((entity) => entity["@type"] === "Person");
  assert.equal(person.name, "Mohammed Elshrief");
  assert.match(person.description, /^Mohammed Elshrief is a Management Engineering student/);
  assert.equal(person.url, "https://moelshrief.com/");
  assert.deepEqual(person.sameAs, [
    "https://github.com/ManagementMO",
    "https://www.linkedin.com/in/mohammed-elshrief/",
    "https://devpost.com/ManagementMO",
  ]);
});

test("homepage identity links the canonical WebSite and ProfilePage to the same Person", async () => {
  const website = identityJsonLd["@graph"].find((entity) => entity["@type"] === "WebSite");
  const person = identityJsonLd["@graph"].find((entity) => entity["@type"] === "Person");
  assert.equal(identityJsonLd["@context"], "https://schema.org");
  assert.equal(website.name, person.name);
  assert.equal(website.alternateName, "moelshrief.com");
  assert.equal(website.url, person.url);
  assert.equal(website.author["@id"], person["@id"]);
  assert.equal(profileJsonLd["@type"], "ProfilePage");
  assert.equal(profileJsonLd.url, website.url);
  assert.equal(profileJsonLd.mainEntity["@id"], person["@id"]);
  assert.equal(profileJsonLd.isPartOf["@id"], website["@id"]);
  assert.match(await text("src/app/components/HomePage.js"), /serializeJsonLd\(profileJsonLd\)/);
  assert.match(identityMetadata.title, /^Mohammed Elshrief/);
  assert.match(identityMetadata.description, /University of Waterloo/);
  assert.equal(identityMetadata.openGraph.siteName, website.name);
  assert.equal(identityMetadata.openGraph.url, website.url);
});

test("JSON-LD serialization preserves JSON values without allowing script termination", () => {
  const value = { name: "</script><script>alert(1)</script>" };
  const serialized = serializeJsonLd(value);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), value);
  assert.deepEqual(JSON.parse(serializeJsonLd(identityJsonLd)), identityJsonLd);
});

test("markdown library covers every core page and 404s unknown paths", async () => {
  const markdown = await text("src/app/lib/markdown.js");
  for (const path of ["/", "/projects", "/writing", "/contact", "/privacy"]) {
    assert.ok(markdown.includes(`case "${path}"`), `no markdown case for ${path}`);
  }
  assert.match(markdown, /publishedPosts\.find/);
  assert.match(markdown, /status: 404/);
  assert.match(markdown, /# 404 — not found/);
  assert.match(markdown, /sitemap\.xml/);
  assert.match(markdown, /llms\.txt/);
});

test("proxy rewrites markdown requests and adds Vary: Accept", async () => {
  const proxy = await text("src/proxy.js");
  assert.match(proxy, /text\/markdown/);
  assert.match(proxy, /NextResponse\.rewrite/);
  assert.match(proxy, /headers\.append\("Vary", "Accept"\)/);

  const route = await text("src/app/md/[[...path]]/route.js");
  assert.match(route, /"Content-Type": "text\/markdown; charset=utf-8"/);
  assert.match(route, /Vary: "Accept"/);
});

test("llms.txt exists with when-to-use guidance", async () => {
  const llms = await text("public/llms.txt");
  assert.match(llms, /^# Mohammed Elshrief/);
  assert.match(llms, /## When to use this site/);
  assert.match(llms, /Accept: text\/markdown/);
  assert.match(llms, /sitemap\.xml/);
});

test("404 page links agents to the site map", async () => {
  const notFound = await text("src/app/components/NotFoundTerminal.js");
  assert.match(await text("src/app/not-found.js"), /<NotFoundTerminal \/>/);
  for (const target of ["/projects", "/writing", "/contact", "/sitemap.xml", "/llms.txt"]) {
    assert.ok(notFound.includes(`"${target}"`), `404 page missing ${target}`);
  }
});

test("homepage preserves the original terminal content and Markdown introduction", async () => {
  const terminal = await text("src/app/components/terminal/fs.js");
  const about = terminal.slice(terminal.indexOf("function AboutOutput()"));
  assert.match(about, /return \(\s*<>\s*<h2[^>]*># studying<\/h2>/);
  assert.doesNotMatch(terminal, /HOME_BIO|I'm Mohammed Elshrief/);
  const markdown = await text("src/app/lib/markdown.js");
  assert.ok(markdown.includes("Management Engineering student at the University of Waterloo. I build software\nacross engineering, data, and machine learning — and ship the occasional\nhackathon project."));
  assert.doesNotMatch(markdown, /HOME_BIO|I'm Mohammed Elshrief/);
});

test("the homepage name is real heading text without a duplicate hidden initial name", async () => {
  const header = await text("src/app/components/Header.js");
  assert.match(header, /<h1 className="site-title">/);
  assert.match(header, /<span className=\{`name-stable/);
  assert.match(header, /\{hovered \? display : ""\}/);
});

test("footer icon references resolve to the same licensed vector shapes without inline paths", async () => {
  const [footer, sprite] = await Promise.all([
    text("src/app/components/Footer.js"),
    text("public/icons/social.svg"),
  ]);
  for (const id of ["github", "linkedin", "email", "devpost", "repo"]) {
    assert.ok(sprite.includes(`id="${id}"`));
  }
  assert.match(sprite, /Lucide 0\.475\.0.*ISC license/);
  assert.match(footer, /<use href=\{`\/icons\/social\.svg#/);
  assert.doesNotMatch(footer, /lucide-react/);
});

test("security discovery files have complete RFC 9116 lines and consistent canonical fields", async () => {
  const wellKnown = await text("public/.well-known/security.txt");
  assert.equal(await text("public/security.txt"), wellKnown);
  assert.ok(wellKnown.endsWith("\n"));
  assert.doesNotMatch(wellKnown, /\\r\\n/);
  const fields = Object.fromEntries(wellKnown.split(/\r?\n/).filter((line) => line && !line.startsWith("#")).map((line) => {
    const separator = line.indexOf(": ");
    assert.ok(separator > 0);
    return [line.slice(0, separator), line.slice(separator + 2)];
  }));
  assert.equal(fields.Canonical, "https://moelshrief.com/.well-known/security.txt");
  assert.equal(fields.Policy, "https://moelshrief.com/security-policy.html");
  assert.match(fields.Contact, /^https:\/\//);
  assert.ok(Number.isFinite(Date.parse(fields.Expires)));
});

test("homepage bio uses h2 section headings for no-JS structure", async () => {
  const fs = await text("src/app/components/terminal/fs.js");
  for (const label of ["# studying", "# incoming", "# previously"]) {
    assert.match(
      fs,
      new RegExp(`<h2 className="[^"]*">${label}</h2>`),
      label
    );
  }
  const aboutOutput = fs.slice(
    fs.indexOf("function AboutOutput"),
    fs.indexOf("// virtual filesystem")
  );
  assert.doesNotMatch(aboutOutput, /# building|built at wat\.ai|TRACE/);
  assert.match(fs, /Software Engineer/);
  assert.match(fs, /logos\/ibm\.svg/);
  assert.match(fs, /logos\/microsoft\.svg/);
});

test("trust pages exist with substantive content", async () => {
  const contact = await text("src/app/contact/page.js");
  assert.match(contact, /mkelshri@uwaterloo\.ca/);
  assert.match(contact, /canonical: "\/contact"/);

  const privacy = await text("src/app/privacy/page.js");
  assert.match(privacy, /localStorage/);
  assert.match(privacy, /canonical: "\/privacy"/);

  const sitemap = await text("src/app/sitemap.js");
  assert.match(sitemap, /\/contact/);
  assert.match(sitemap, /\/privacy/);
});

test("activity heatmap is a decorative no-JS image with responsive widths and theme inheritance", async () => {
  const pane = await text("src/app/components/ActivityPane.js");
  assert.match(pane, /aria-hidden="true"/);
  assert.match(pane, /<picture>/);
  assert.match(pane, /media="\(min-width: 640px\)" srcSet="\/activity\.svg\?columns=52"/);
  assert.match(pane, /src="\/activity\.svg\?columns=26" alt=""/);
  assert.doesNotMatch(pane, /weeks\.map|hm-c|hm-w/);
  const css = await text("src/app/globals.css");
  assert.match(css, /container-type: inline-size/);
  assert.match(css, /color-scheme: light/);
  assert.match(css, /\.dark \.activity-heatmap\s*\{\s*color-scheme: dark/);
  assert.match(css, /@screen sm/);
});
