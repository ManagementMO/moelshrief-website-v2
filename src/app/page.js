import HomePage from "./components/HomePage";
import { getActivity } from "./lib/github";
import { activitySummary } from "./lib/activity-heatmap.mjs";

export default async function About() {
  const activity = await getActivity();

  return <HomePage activity={activitySummary(activity)} />;
}
