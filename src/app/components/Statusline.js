"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const WINDOWS = [
  { idx: 0, name: "about", href: "/" },
  { idx: 1, name: "projects", href: "/projects" },
  { idx: 2, name: "writing", href: "/writing" },
];

export default function Statusline() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Toronto",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isCurrent = (w) =>
    w.href === "/" ? pathname === "/" : pathname.startsWith(w.href);

  return (
    <nav
      aria-label="statusline"
      className="hidden md:flex fixed bottom-0 inset-x-0 z-30 h-7 items-center gap-4 px-3.5 font-mono text-micro bg-stone-100/90 dark:bg-black/90 backdrop-blur-sm border-t border-stone-300 dark:border-stone-800 text-stone-500 dark:text-stone-500"
    >
      <span className="bg-amber-500 dark:bg-amber-400 text-stone-950 px-1.5 py-px rounded-sm font-medium select-none">
        portfolio
      </span>
      {WINDOWS.map((w) => (
        <NextLink
          key={w.idx}
          href={w.href}
          className={
            isCurrent(w)
              ? "text-amber-700 dark:text-amber-400"
              : "hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          }
        >
          {w.idx}:{w.name}
          {isCurrent(w) ? "*" : ""}
        </NextLink>
      ))}
      <span className="ml-auto flex items-center gap-4">
        <span suppressHydrationWarning>waterloo {time ?? "--:--"}</span>
        <button
          onClick={toggleTheme}
          className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          aria-label="toggle theme"
        >
          theme={theme}
        </button>
      </span>
    </nav>
  );
}
