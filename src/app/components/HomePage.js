"use client";

import NextLink from "next/link";
import TerminalHero from "./TerminalHero";
import AsciiDivider from "./AsciiDivider";
import ActivityPane from "./ActivityPane";
import EnterToProjects from "./EnterToProjects";
import { profileJsonLd, serializeJsonLd } from "../lib/identity.mjs";

// Next.js prerenders this interactive surface into real HTML. Its compact
// aggregate props avoid duplicating the terminal's surrounding markup in RSC.
export default function HomePage({ activity }) {
  return (
    <div className="flex flex-col w-full min-w-0 font-extralight">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(profileJsonLd) }}
      />
      <EnterToProjects />
      <TerminalHero activity={activity} />
      <AsciiDivider />
      <NextLink href="/projects" className="group projects-shortcut">
        <span className="flex items-baseline gap-2 min-w-0">
          <span className="text-stone-500 dark:text-stone-500">$</span>
          <span className="text-stone-700 dark:text-stone-300">
            cd{" "}
            <span className="text-amber-700 dark:text-amber-400">~/projects</span>
          </span>
        </span>
        <kbd className="projects-key">
          ⏎
        </kbd>
      </NextLink>
      <div className="mt-4">
        <ActivityPane activity={activity} />
      </div>
    </div>
  );
}
