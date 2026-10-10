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
      className="statusline"
    >
      {WINDOWS.map((w) => (
        <NextLink
          key={w.idx}
          href={w.href}
          className={
            isCurrent(w)
              ? "statusline-active"
              : "statusline-link"
          }
        >
          {w.idx}:{w.name}
          {isCurrent(w) ? "*" : ""}
        </NextLink>
      ))}
      <span className="statusline-meta">
        <span suppressHydrationWarning>waterloo {time ?? "--:--"}</span>
        <button
          onClick={toggleTheme}
          className="statusline-theme"
          aria-label="toggle theme"
        >
          theme={theme}
        </button>
      </span>
    </nav>
  );
}
