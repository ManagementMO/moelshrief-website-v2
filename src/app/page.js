"use client";

import NextLink from "next/link";
import dynamic from "next/dynamic";
import { GalleryHorizontalEnd } from "lucide-react";
import TerminalHero from "./components/TerminalHero";
import AsciiDivider from "./components/AsciiDivider";
import CommandHintBar from "./components/CommandHintBar";

const Signature = dynamic(() => import("@/app/components/Signature"), {
  ssr: false,
});

export default function About() {
  return (
    <div className="flex flex-col w-full min-w-0 font-extralight">
      <TerminalHero />

      <AsciiDivider />

      <NextLink
        href="/projects"
        className="text-center mt-6 py-4 px-6 rounded-lg border border-stone-400 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 transform transition-all duration-300 font-extralight hover:scale-[1.02] active:scale-[0.98] shadow-sm"
      >
        see what i&apos;ve built{" "}
        <GalleryHorizontalEnd className="size-5 inline align-top ml-1 transition-transform" />
      </NextLink>

      <AsciiDivider label="// signoff" />

      <div className="flex flex-col sm:flex-row items-center justify-end mt-8">
        <Signature />
      </div>

      <CommandHintBar />
    </div>
  );
}
