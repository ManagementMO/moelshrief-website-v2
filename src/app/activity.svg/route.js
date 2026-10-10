import { getActivity } from "../lib/github";
import { renderActivityHeatmap } from "../lib/activity-heatmap.mjs";

export async function GET(request) {
  const columns = new URL(request.url).searchParams.get("columns") ?? "52";
  if (columns !== "26" && columns !== "52") {
    return new Response("columns must be 26 or 52\n", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const activity = await getActivity();
  return new Response(renderActivityHeatmap(activity?.weeks ?? [], Number(columns)), {
    status: activity ? 200 : 503,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": activity
        ? "public, max-age=300, s-maxage=3600, stale-while-revalidate=900"
        : "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
