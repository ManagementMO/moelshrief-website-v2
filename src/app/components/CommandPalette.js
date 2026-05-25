"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter, usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import useMobileDevice from "../hooks/useMobileDevice";
import { useTheme } from "./ThemeProvider";

function Shortcut({ isModifierPressed, children }) {
  const k = String(children).toLowerCase();
  return (
    <span className="ml-auto shrink-0 text-stone-400 dark:text-stone-600">
      {isModifierPressed ? k : `shift+${k}`}
    </span>
  );
}

const ITEM_CLASS =
  "group flex items-center gap-3 px-3 py-1.5 cursor-pointer text-stone-700 dark:text-stone-300 " +
  "data-[selected=true]:bg-amber-200/40 dark:data-[selected=true]:bg-amber-500/15 " +
  "data-[selected=true]:text-amber-900 dark:data-[selected=true]:text-amber-200";

function Item({ value, onSelect, prefix, name, dest, shortcut, isModifierPressed }) {
  return (
    <Command.Item value={value} onSelect={onSelect} className={ITEM_CLASS}>
      <span className="text-stone-500 dark:text-stone-500 w-3 shrink-0 group-data-[selected=true]:text-amber-700 dark:group-data-[selected=true]:text-amber-400">
        {prefix}
      </span>
      <span className="shrink-0">{name}</span>
      <span className="text-stone-500 dark:text-stone-500 truncate min-w-0 flex-1">
        {dest}
      </span>
      <Shortcut isModifierPressed={isModifierPressed}>{shortcut}</Shortcut>
    </Command.Item>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isModifierPressed, setIsModifierPressed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobileDevice = useMobileDevice();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes("mac"));
  }, []);

  const handleOpen = () => {
    setOpen(true);
    localStorage.setItem("hasOpenedCommandPalette", "true");
    window.dispatchEvent(new CustomEvent("command-palette-opened"));
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.shiftKey) setIsModifierPressed(true);
    };
    const handleKeyUp = (e) => {
      if (!e.shiftKey) setIsModifierPressed(false);
    };
    const handleBlur = () => setIsModifierPressed(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [open]);

  useEffect(() => {
    const handleCustomOpen = () => handleOpen();
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () =>
      window.removeEventListener("open-command-palette", handleCustomOpen);
  }, []);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!open) handleOpen();
        else setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  useEffect(() => {
    if (open) return;

    const isTypingTarget = (target) => {
      if (!target) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      );
    };

    const handleGlobalShortcut = (e) => {
      if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      const key = e.key.toLowerCase();
      if (key === "t") {
        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener("keydown", handleGlobalShortcut);
    return () =>
      document.removeEventListener("keydown", handleGlobalShortcut);
  }, [open, toggleTheme]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (!e.shiftKey) return;
      const key = e.key.toLowerCase();
      const shortcuts = {
        h: () => router.push("/"),
        p: () => router.push("/projects"),
        l: () =>
          window.open(
            "https://www.linkedin.com/in/mohammed-elshrief/",
            "_blank"
          ),
        g: () => window.open("https://github.com/ManagementMO", "_blank"),
        e: () => window.open("mailto:mkelshri@uwaterloo.ca", "_blank"),
        d: () => window.open("https://devpost.com/ManagementMO", "_blank"),
        c: () =>
          window.open(
            "https://github.com/ManagementMO/moelshrief-website-v2",
            "_blank"
          ),
        t: () => toggleTheme(),
      };
      if (shortcuts[key]) {
        e.preventDefault();
        runCommand(shortcuts[key]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, router, toggleTheme]);

  if (isMobileDevice) {
    return null;
  }

  const cwd = pathname === "/" ? "~" : `~${pathname}`;

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 animate-fade-in z-40" />
          <Dialog.Content className="fixed top-[18%] left-1/2 -translate-x-1/2 w-full max-w-[560px] p-3 animate-slide-down z-50">
            <Dialog.Title className="sr-only">Command palette</Dialog.Title>
            <Command
              className="w-full rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 shadow-2xl overflow-hidden font-mono text-xs"
              loop={true}
              shouldFilter={true}
              onClick={(e) => {
                const input = e.currentTarget.querySelector("input");
                if (input) input.focus();
              }}
            >
              {/* title bar — shows cwd-style context */}
              <div className="px-3 py-2 border-b border-stone-300 dark:border-stone-800 flex items-center justify-between text-stone-500 dark:text-stone-500">
                <span>
                  mohammed@portfolio:
                  <span className="text-amber-700 dark:text-amber-400">
                    {cwd}
                  </span>
                  $ command-palette
                </span>
                <span className="text-stone-400 dark:text-stone-600">[esc]</span>
              </div>

              {/* > prompt input */}
              <div className="flex items-center px-3 py-2.5 border-b border-stone-300 dark:border-stone-800">
                <span className="text-amber-700 dark:text-amber-400 mr-2 shrink-0">
                  &gt;
                </span>
                <Command.Input
                  placeholder="type to filter…"
                  className="flex-1 w-full bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600 placeholder:italic focus:outline-none caret-amber-500 dark:caret-amber-400"
                  onBlur={(e) => {
                    const commandDialog =
                      e.currentTarget.closest('[role="dialog"]');
                    if (!commandDialog?.contains(e.relatedTarget)) {
                      setOpen(false);
                    }
                  }}
                  autoFocus
                />
              </div>

              {/* list */}
              <Command.List
                className={
                  "max-h-[340px] overflow-y-auto py-2 " +
                  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 " +
                  "[&_[cmdk-group-heading]]:text-stone-500 dark:[&_[cmdk-group-heading]]:text-stone-500"
                }
              >
                <Command.Empty className="px-3 py-3 text-stone-500 dark:text-stone-500 italic">
                  no matches found.
                </Command.Empty>

                <Command.Group heading="// navigation">
                  <Item
                    value="home about"
                    prefix="→"
                    name="home"
                    dest="./"
                    shortcut="H"
                    isModifierPressed={isModifierPressed}
                    onSelect={() => runCommand(() => router.push("/"))}
                  />
                  <Item
                    value="projects work"
                    prefix="→"
                    name="projects"
                    dest="./projects"
                    shortcut="P"
                    isModifierPressed={isModifierPressed}
                    onSelect={() => runCommand(() => router.push("/projects"))}
                  />
                </Command.Group>

                <Command.Group heading="// links" className="mt-1">
                  <Item
                    value="email mailto mkelshri uwaterloo contact"
                    prefix="↗"
                    name="email"
                    dest="mkelshri@uwaterloo.ca"
                    shortcut="E"
                    isModifierPressed={isModifierPressed}
                    onSelect={() =>
                      runCommand(() =>
                        window.open("mailto:mkelshri@uwaterloo.ca", "_blank")
                      )
                    }
                  />
                  <Item
                    value="linkedin in mohammed elshrief profile"
                    prefix="↗"
                    name="linkedin"
                    dest="linkedin.com/in/mohammed-elshrief"
                    shortcut="L"
                    isModifierPressed={isModifierPressed}
                    onSelect={() =>
                      runCommand(() =>
                        window.open(
                          "https://www.linkedin.com/in/mohammed-elshrief/",
                          "_blank"
                        )
                      )
                    }
                  />
                  <Item
                    value="github ManagementMO repo profile"
                    prefix="↗"
                    name="github"
                    dest="github.com/ManagementMO"
                    shortcut="G"
                    isModifierPressed={isModifierPressed}
                    onSelect={() =>
                      runCommand(() =>
                        window.open("https://github.com/ManagementMO", "_blank")
                      )
                    }
                  />
                  <Item
                    value="devpost hackathons ManagementMO competitions"
                    prefix="↗"
                    name="devpost"
                    dest="devpost.com/ManagementMO"
                    shortcut="D"
                    isModifierPressed={isModifierPressed}
                    onSelect={() =>
                      runCommand(() =>
                        window.open(
                          "https://devpost.com/ManagementMO",
                          "_blank"
                        )
                      )
                    }
                  />
                  <Item
                    value="source code repo github ManagementMO website-v2 view-source"
                    prefix="↗"
                    name="source"
                    dest="github.com/ManagementMO/moelshrief-website-v2"
                    shortcut="C"
                    isModifierPressed={isModifierPressed}
                    onSelect={() =>
                      runCommand(() =>
                        window.open(
                          "https://github.com/ManagementMO/moelshrief-website-v2",
                          "_blank"
                        )
                      )
                    }
                  />
                </Command.Group>

                <Command.Group heading="// theme" className="mt-1">
                  <Item
                    value="toggle theme dark mode light mode appearance"
                    prefix="*"
                    name={`theme=${theme}`}
                    dest={`toggle → ${theme === "light" ? "dark" : "light"}`}
                    shortcut="T"
                    isModifierPressed={isModifierPressed}
                    onSelect={() => runCommand(() => toggleTheme())}
                  />
                </Command.Group>
              </Command.List>

              {/* bottom hint bar */}
              <div className="px-3 py-2 border-t border-stone-300 dark:border-stone-800 flex items-center gap-3 text-stone-500 dark:text-stone-500">
                <span>
                  <span className="text-stone-700 dark:text-stone-300">↵</span>{" "}
                  select
                </span>
                <span className="text-stone-400 dark:text-stone-700">·</span>
                <span>
                  <span className="text-stone-700 dark:text-stone-300">↑↓</span>{" "}
                  navigate
                </span>
                <span className="text-stone-400 dark:text-stone-700">·</span>
                <span>
                  <span className="text-stone-700 dark:text-stone-300">esc</span>{" "}
                  close
                </span>
              </div>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
