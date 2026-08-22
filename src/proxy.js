import { NextResponse } from "next/server";

// Content negotiation for agents (acceptmarkdown.com): requests that prefer
// `text/markdown` are rewritten to the /md route, which serves a markdown
// variant of the page (404s included). All negotiated responses carry
// `Vary: Accept` so CDNs cache the HTML and markdown variants separately.

function prefersMarkdown(accept) {
  if (!accept || !accept.includes("text/markdown")) return false;
  const q = (type) => {
    const entry = accept
      .split(",")
      .map((s) => s.trim())
      .find((s) => s.startsWith(type));
    if (!entry) return 0;
    const m = entry.match(/;\s*q=([0-9.]+)/);
    return m ? parseFloat(m[1]) : 1;
  };
  return q("text/markdown") >= q("text/html");
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (prefersMarkdown(request.headers.get("accept"))) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/md" : `/md${pathname}`;
    url.search = "";
    return NextResponse.rewrite(url);
  }
  const response = NextResponse.next();
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  // Only run on page-like paths: skip Next internals, API-ish routes, and
  // anything with a file extension (static assets).
  matcher: ["/((?!_next/|md$|md/|.*\\.[a-zA-Z0-9]+$).*)"],
};
