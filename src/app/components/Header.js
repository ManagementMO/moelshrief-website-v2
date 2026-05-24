"use client";

import HorizontalNav from "./HorizontalNav";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import Link from "./Link";
import { useEffect, useMemo, useState } from "react";
import useModifierKey from "../hooks/useModifierKey";
import useMobileDevice from "../hooks/useMobileDevice";
import CurvedArrow from "./CurvedArrow";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function Header({ className }) {
  const pathname = usePathname();
  const [isMac, setIsMac] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const isModifierPressed = useModifierKey();
  const isMobileDevice = useMobileDevice();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes("mac"));
    const hasOpenedPalette = localStorage.getItem("hasOpenedCommandPalette");
    setShowArrow(!hasOpenedPalette);

    const handlePaletteOpened = () => setShowArrow(false);
    window.addEventListener("command-palette-opened", handlePaletteOpened);
    return () =>
      window.removeEventListener("command-palette-opened", handlePaletteOpened);
  }, []);

  const openCommandPalette = () => {
    setShowArrow(false);
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const links = useMemo(
    () => [
      { name: "about", href: "/", isActive: pathname === "/", isNextLink: true },
      {
        name: "projects",
        href: "/projects",
        isActive: pathname === "/projects",
        isNextLink: true,
      },
    ],
    [pathname]
  );

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-baseline">
        <NextLink
          href="/"
          className="group/wordmark relative inline-block hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200"
        >
          mohammed elshrief
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 -bottom-0.5 h-px bg-amber-500/80 dark:bg-amber-400/80 origin-left scale-x-0 group-hover/wordmark:scale-x-100 transition-transform duration-300 ease-out"
          />
        </NextLink>
        <span
          className="ml-1 text-amber-600 dark:text-amber-400 select-none animate-pulse-dot"
          aria-hidden="true"
        >
          •
        </span>
      </h1>
      <div className="flex items-center gap-6">
        <HorizontalNav links={links} variant="terminal" />
        <button
          onClick={toggleTheme}
          className="group/theme p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-amber-100/60 dark:hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 transition-transform duration-500 ease-out group-hover/theme:rotate-[180deg]" />
          ) : (
            <Moon className="h-4 w-4 transition-transform duration-500 ease-out group-hover/theme:-rotate-[20deg]" />
          )}
        </button>
        {!isMobileDevice && (
          <div className="relative">
            {showArrow && (
              <CurvedArrow className="hidden lg:block absolute -top-10 -right-28" />
            )}
            <button
              onClick={openCommandPalette}
              className="group/cmdk hidden sm:flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-amber-400/70 dark:hover:border-amber-500/50 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200"
            >
              <span
                className={`flex items-center ${
                  isModifierPressed ? "opacity-0" : "opacity-100"
                }`}
              >
                <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700 font-mono transition-transform duration-100 group-hover/cmdk:translate-y-[1px] group-hover/cmdk:bg-amber-100 dark:group-hover/cmdk:bg-amber-900/40">
                  {isMac ? "⌘" : "ctrl"}
                </kbd>
                <span>+</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700 font-mono transition-transform duration-100 group-hover/cmdk:translate-y-[1px] group-hover/cmdk:bg-amber-100 dark:group-hover/cmdk:bg-amber-900/40">
                K
              </kbd>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
