"""Check actual HTTP responses, raw HTML, and published discovery formats.

Run against a production server: python3 scripts/verify-agent-readiness.py URL
This makes no writes to the target and uses no browser rendering or credentials.
"""

import concurrent.futures
import datetime
import json
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = "https://moelshrief.com"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class RawPage(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.text = []
        self.headings = []
        self.links = []
        self.meta = {}
        self.json_ld = []
        self.script = None
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        excluded = (self.stack and self.stack[-1][1]) or tag in {"head", "script", "style", "svg"} or attrs.get("aria-hidden") == "true"
        if tag not in VOID:
            self.stack.append((tag, bool(excluded)))
        if re.fullmatch(r"h[1-6]", tag):
            self.headings.append([int(tag[1]), ""])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.script = []
        if tag == "link":
            self.links.append(attrs)
        if tag == "meta":
            self.meta[attrs.get("name") or attrs.get("property")] = attrs.get("content")

    def handle_endtag(self, tag):
        if tag == "script" and self.script is not None:
            self.json_ld.append(json.loads("".join(self.script)))
            self.script = None
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        if self.script is not None:
            self.script.append(data)
        if self.stack and not self.stack[-1][1]:
            self.text.append(data)
            if any(re.fullmatch(r"h[1-6]", tag) for tag, _ in self.stack):
                self.headings[-1][1] += data

    def readable(self):
        # Decorative rules are not meaningful content for the ratio threshold.
        return re.sub(r"\s+", " ", re.sub(r"[─┌]+", "", " ".join(self.text))).strip()


def fetch(base, path, accept="text/html"):
    request = urllib.request.Request(base + path, headers={"Accept": accept})
    try:
        response = urllib.request.urlopen(request, timeout=25)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read()


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main(base):
    base = base.rstrip("/")
    results = []
    warnings = []
    status, headers, body = fetch(base, "/")
    require(status == 200 and "text/html" in headers.get("Content-Type", ""), "Homepage HTML response")
    page = RawPage(body.decode("utf-8"))
    readable = page.readable()
    ratio = len(readable) / len(body)
    require(len(readable) >= 500, "Homepage must contain 500+ characters without JavaScript")
    if ratio < 0.05:
        warnings.append(f"Homepage content ratio is {ratio:.2%}, below the audit's 5% target. Original homepage copy is preserved.")
    require(page.headings[0] == [1, "mohammed elshrief"], "A single, readable homepage H1")
    require([heading[0] for heading in page.headings] == [1, 2, 2, 2], "Sequential H1/H2 homepage hierarchy")
    require([heading[1] for heading in page.headings[1:]] == ["# studying", "# incoming", "# previously"], "Career section headings")
    require(readable.index("Microsoft") < readable.index("IBM"), "Incoming role ordering")
    require(readable.count("Software Engineer Intern") == 5 and readable.count("Core Member") == 2, "Career role wording")
    require("I'm Mohammed Elshrief" not in readable, "No added biography")
    require(any(link.get("rel") == "canonical" and link.get("href", "").rstrip("/") == CANONICAL for link in page.links), "Apex canonical")
    require(page.meta.get("og:site_name") == "Mohammed Elshrief", "Brand site name")
    require(page.meta.get("google-site-verification") and page.meta.get("msvalidate.01"), "Search verification markers")
    entities = {entity["@type"]: entity for document in page.json_ld for entity in document.get("@graph", [document])}
    require({"Person", "WebSite", "ProfilePage"}.issubset(entities), "JSON-LD entity types")
    require(entities["ProfilePage"]["mainEntity"]["@id"] == entities["Person"]["@id"], "Profile resolves to Person")
    require(entities["WebSite"]["author"]["@id"] == entities["Person"]["@id"], "Site resolves to Person")
    require(all(entity["url"] == CANONICAL + "/" for entity in entities.values()), "Entity canonical URLs")
    results.append({"path": "/", "status": status})
    if "accept" not in headers.get("Vary", "").lower().split(", "):
        warnings.append("Next.js omits Vary: Accept on HTML responses; negotiated Markdown includes it. Confirm cache separation at the deployment edge.")

    status, _, sitemap_bytes = fetch(base, "/sitemap.xml")
    require(status == 200, "Sitemap response")
    results.append({"path": "/sitemap.xml", "status": status})
    sitemap = ET.fromstring(sitemap_bytes)
    require(sitemap.tag == "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset", "Sitemap XML namespace")
    urls = [element.text for element in sitemap.findall("{*}url/{*}loc")]
    require(len(urls) == len(set(urls)) and len(urls) >= 7, "Sitemap URL coverage and uniqueness")
    paths = []
    for url in urls:
        require(url.startswith(CANONICAL + "/"), "Sitemap apex URLs")
        paths.append(url.removeprefix(CANONICAL))

    for path in paths:
        html_status, html_headers, html_body = fetch(base, path)
        require(html_status == 200 and "text/html" in html_headers.get("Content-Type", ""), f"HTML {path}")
        rendered = RawPage(html_body.decode("utf-8"))
        require(any(link.get("rel") == "canonical" and link.get("href", "").rstrip("/") == (CANONICAL + path).rstrip("/") for link in rendered.links), f"Canonical {path}")
        for url in [path, "/md" + ("" if path == "/" else path)]:
            md_status, md_headers, md_body = fetch(base, url, "text/markdown")
            require(md_status == 200 and "text/markdown" in md_headers.get("Content-Type", ""), f"Markdown {url}")
            require("accept" in md_headers.get("Vary", "").lower(), f"Markdown Vary {url}")
            require(md_body.startswith(b"# ") and b"<html" not in md_body, f"Markdown body {url}")
            results.append({"path": url, "representation": "markdown", "status": md_status})
        results.append({"path": path, "representation": "html", "status": html_status})

    for path, accept, expected in [("/missing-agent-test", "text/html", 404), ("/missing-agent-test", "text/markdown", 404), ("/md/missing-agent-test", "text/markdown", 404), ("/writing/example-post", "text/html", 200), ("/writing/example-post", "text/markdown", 404), ("/md/about", "text/markdown", 200)]:
        status, _, response_body = fetch(base, path, accept)
        require(status == expected and response_body, f"Negative/template/alias response {path} {accept}")
        if path == "/writing/example-post" and accept == "text/html":
            require("noindex" in RawPage(response_body.decode()).meta.get("robots", ""), "Unpublished template noindex")
        results.append({"path": path, "representation": accept, "status": status})

    def check_asset(path):
        status, headers, data = fetch(base, path, "*/*")
        require(status == 200 and data, f"Public asset {path}")
        if path.endswith(".svg"):
            require("image/svg+xml" in headers.get("Content-Type", ""), f"SVG MIME {path}")
            require(ET.fromstring(data).tag == "{http://www.w3.org/2000/svg}svg", f"SVG XML {path}")
        if path.endswith(".webmanifest"):
            manifest = json.loads(data)
            require(manifest["name"] == "Mohammed Elshrief" and manifest["start_url"] == "/", "Web manifest identity")
            require(all((ROOT / "public" / icon["src"].lstrip("/")).exists() for icon in manifest["icons"]), "Manifest icon references")
        if path in {"/security.txt", "/.well-known/security.txt"}:
            require("text/plain" in headers.get("Content-Type", ""), "Security text MIME")
            require(data.endswith(b"\n") and b"\\r\\n" not in data, "RFC 9116 line endings")
            fields = dict(line.split(": ", 1) for line in data.decode().splitlines() if line and not line.startswith("#"))
            require(fields["Canonical"] == CANONICAL + "/.well-known/security.txt", "RFC 9116 canonical")
            require(fields["Contact"].startswith(("https://", "mailto:")), "RFC 9116 contact URI")
            require(datetime.datetime.fromisoformat(fields["Expires"].replace("Z", "+00:00")) > datetime.datetime.now(datetime.timezone.utc), "Security policy expiry")
        if path == "/robots.txt":
            require("text/plain" in headers.get("Content-Type", ""), "Robots MIME")
            lines = data.decode().splitlines()
            require("User-agent: *" in lines and "Allow: /" in lines and f"Sitemap: {CANONICAL}/sitemap.xml" in lines, "RFC 9309 crawler and sitemap declarations")
        if path == "/llms.txt":
            content = data.decode()
            require(content.startswith("# Mohammed Elshrief\n\n> "), "llms.txt H1 and blockquote")
            require("## Pages" in content and "Accept: text/markdown" in content, "llms.txt guidance")
            require(all(url in content for url in [CANONICAL + "/", CANONICAL + "/projects", CANONICAL + "/writing", CANONICAL + "/contact"]), "llms.txt core links")
        return {"path": path, "status": status}

    asset_paths = ["/" + str(path.relative_to(ROOT / "public")) for path in (ROOT / "public").rglob("*") if path.is_file()]
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        results.extend(pool.map(check_asset, asset_paths))
    for path in ["/icon.svg", "/activity.svg", "/activity.svg?columns=26", "/activity.svg?columns=52"]:
        status, headers, data = fetch(base, path, "*/*")
        require(status == 200 and "image/svg+xml" in headers.get("Content-Type", ""), f"Generated SVG {path}")
        require(ET.fromstring(data).tag == "{http://www.w3.org/2000/svg}svg", f"Generated SVG XML {path}")
        results.append({"path": path, "status": status})
    require(fetch(base, "/activity.svg?columns=1")[0] == 400, "Invalid SVG parameter")
    for path in ["/writing/fairer-world-cup-schedule/opengraph-image", "/writing/how-eduroam-works/opengraph-image"]:
        status, headers, data = fetch(base, path, "*/*")
        require(status == 200 and headers.get("Content-Type", "").startswith("image/") and data.startswith(b"\x89PNG"), f"Social image {path}")
        results.append({"path": path, "status": status})
    print(json.dumps({"base": base, "html_bytes": len(body), "readable_characters": len(readable), "content_ratio_percent": round(100 * ratio, 3), "checked_responses": len(results) + 1, "warnings": warnings, "responses": results}, indent=2))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3086")
