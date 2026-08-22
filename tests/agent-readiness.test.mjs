import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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
  assert.match(layout, /"@type": "Person"/);
  assert.match(layout, /name: "Mohammed Elshrief"/);
  assert.match(layout, /description:\s*\n?\s*"Mohammed Elshrief is a Management Engineering student/);
  assert.match(layout, /url: "https:\/\/moelshrief\.com"/);
  assert.match(layout, /sameAs/);
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
  const notFound = await text("src/app/not-found.js");
  for (const target of ["/projects", "/writing", "/contact", "/sitemap.xml", "/llms.txt"]) {
    assert.ok(notFound.includes(`"${target}"`), `404 page missing ${target}`);
  }
});

test("homepage bio uses h2 section headings for no-JS structure", async () => {
  const fs = await text("src/app/components/terminal/fs.js");
  for (const label of ["# currently", "# building", "# previously"]) {
    assert.match(
      fs,
      new RegExp(`<h2 className="[^"]*">${label}</h2>`),
      label
    );
  }
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
