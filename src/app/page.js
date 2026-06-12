import NextLink from "next/link";
import TerminalHero from "./components/TerminalHero";
import AsciiDivider from "./components/AsciiDivider";
import ActivityPane from "./components/ActivityPane";
import EnterToProjects from "./components/EnterToProjects";
import { getActivity } from "./lib/github";

export default async function About() {
  const activity = await getActivity();

  return (
    <div className="flex flex-col w-full min-w-0 font-extralight">
      <EnterToProjects />
      <TerminalHero activity={activity} />

      <AsciiDivider />

      <NextLink
        href="/projects"
        className="group flex items-center justify-between font-mono text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/40 dark:bg-stone-900/30 hover:border-amber-500/60 dark:hover:border-amber-400/60 hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-colors"
      >
        <span className="flex items-baseline gap-2 min-w-0">
          <span className="text-stone-500 dark:text-stone-500">$</span>
          <span className="text-stone-700 dark:text-stone-300">
            cd{" "}
            <span className="text-amber-700 dark:text-amber-400">
              ~/projects
            </span>
          </span>
        </span>
        <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-micro text-stone-400 dark:text-stone-500 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors shrink-0 ml-3">
          ⏎
        </kbd>
      </NextLink>

      <div className="mt-4">
        <ActivityPane activity={activity} />
      </div>
    </div>
  );
}
