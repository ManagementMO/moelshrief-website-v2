import { markdownForPath } from "../../lib/markdown";

// Serves the markdown variant of any page. src/proxy.js rewrites requests
// with `Accept: text/markdown` here; it can also be hit directly, e.g.
// /md/projects for the /projects page.
export async function GET(request, { params }) {
  const { path } = await params;
  const pathname = "/" + (path || []).join("/");
  const { status, body } = markdownForPath(pathname);
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
