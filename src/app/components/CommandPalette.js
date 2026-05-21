"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter, usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Search,
  Home,
  FolderGit2,
  Github,
  Linkedin,
  Mail,
  CodeXml,
  Trophy,
  BarChart3,
  Lightbulb,
  Sun,
  Moon,
} from "lucide-react";
import useMobileDevice from "../hooks/useMobileDevice";
import { useTheme } from "./ThemeProvider";

function Shortcut({ isModifierPressed, children }) {
  return (
    <div className="flex text-xs items-center gap-1 ml-auto text-stone-500 dark:text-stone-500">
      {!isModifierPressed && (
        <>
          <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-stone-600 dark:text-stone-400">
            shift
          </kbd>
          <span>+</span>
        </>
      )}
      <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-stone-600 dark:text-stone-400">
        {children}
      </kbd>
    </div>
  );
}

const SPARKLINE = "▁ ▂ ▃ ▄ ▅ ▇ ▆ ▇";
const STATS_LINES = [
  "~/ projects shipped:  3",
  "~/ hackathons run:    6+",
  "~/ years coffee:      ∞",
  `~/ trend:             ${SPARKLINE}`,
];

function DataFlash({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] animate-data-flash pointer-events-none"
    >
      <div className="rounded-xl border border-amber-400/60 dark:border-amber-500/40 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-sm px-6 py-4 shadow-2xl font-mono text-xs text-stone-700 dark:text-stone-300">
        <div className="text-amber-700 dark:text-amber-400 mb-2 text-[10px] uppercase tracking-widest">
          {"// data mode"}
        </div>
        {STATS_LINES.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isModifierPressed, setIsModifierPressed] = useState(false);
  const [showDataFlash, setShowDataFlash] = useState(false);
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

  const getCurrentSection = () => {
    if (pathname === "/") {
      return {
        name: "Home",
        icon: <Home className="h-5 w-5" />,
        description: "About me and what i'm building",
      };
    }
    if (pathname === "/projects") {
      return {
        name: "Projects",
        icon: <FolderGit2 className="h-5 w-5" />,
        description: "Things i've shipped",
      };
    }
  };

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  const triggerDataFlash = () => {
    setOpen(false);
    setShowDataFlash(true);
  };

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
        s: () => {
          setOpen(false);
          setShowDataFlash(true);
        },
      };
      if (shortcuts[key]) {
        e.preventDefault();
        if (key === "s") {
          shortcuts[key]();
        } else {
          runCommand(shortcuts[key]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, router, toggleTheme]);

  const currentSection = getCurrentSection();

  if (isMobileDevice) {
    return (
      <DataFlash open={showDataFlash} onClose={() => setShowDataFlash(false)} />
    );
  }

  return (
    <>
      <DataFlash open={showDataFlash} onClose={() => setShowDataFlash(false)} />
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-fade-in z-40" />
          <Dialog.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[500px] p-3 animate-slide-down z-50">
            <Dialog.Title className="sr-only">Command palette</Dialog.Title>
            <Command
              className="w-full rounded-xl border border-stone-300 dark:border-stone-900 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden"
              loop={true}
              shouldFilter={true}
              onClick={(e) => {
                const input = e.currentTarget.querySelector("input");
                if (input) input.focus();
              }}
            >
              {currentSection && (
                <div className="px-5 py-6 border-b border-stone-200 dark:border-stone-700 flex items-center gap-3">
                  <div className="p-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-400">
                    {currentSection.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-medium text-stone-900 dark:text-stone-100">
                      {currentSection.name}
                    </h2>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {currentSection.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center border-b border-stone-300 dark:border-stone-700 px-4 py-4">
                <Search className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <Command.Input
                  placeholder="Search for actions..."
                  className="flex-1 w-full bg-transparent px-3 text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-500 dark:placeholder:text-stone-500 focus:outline-none"
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

              <Command.List className="max-h-[300px] overflow-y-auto px-3 py-4">
                <Command.Empty className="px-5 py-4 text-sm text-stone-500 dark:text-stone-400">
                  No results found.
                </Command.Empty>

                <Command.Group
                  heading="Navigation"
                  className="px-2 text-stone-500 dark:text-stone-400"
                >
                  <Command.Item
                    value="home"
                    onSelect={() => runCommand(() => router.push("/"))}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    <Home className="h-4 w-4" />
                    <span className="flex-1">Go to Home</span>
                    <Shortcut isModifierPressed={isModifierPressed}>H</Shortcut>
                  </Command.Item>
                  <Command.Item
                    value="projects"
                    onSelect={() => runCommand(() => router.push("/projects"))}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    <FolderGit2 className="h-4 w-4" />
                    <span className="flex-1">Go to Projects</span>
                    <Shortcut isModifierPressed={isModifierPressed}>P</Shortcut>
                  </Command.Item>
                </Command.Group>

                <Command.Group
                  heading="Links"
                  className="px-2 text-stone-500 dark:text-stone-400"
                >
                  <Command.Item
                    value="email"
                    onSelect={() =>
                      runCommand(() =>
                        window.open("mailto:mkelshri@uwaterloo.ca", "_blank")
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="flex-1">Email</span>
                    <Shortcut isModifierPressed={isModifierPressed}>E</Shortcut>
                  </Command.Item>
                  <Command.Item
                    value="linkedin"
                    onSelect={() =>
                      runCommand(() =>
                        window.open(
                          "https://www.linkedin.com/in/mohammed-elshrief/",
                          "_blank"
                        )
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="flex-1">LinkedIn Profile</span>
                    <Shortcut isModifierPressed={isModifierPressed}>L</Shortcut>
                  </Command.Item>
                  <Command.Item
                    value="github"
                    onSelect={() =>
                      runCommand(() =>
                        window.open("https://github.com/ManagementMO", "_blank")
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    <Github className="h-4 w-4" />
                    <span className="flex-1">GitHub Profile</span>
                    <Shortcut isModifierPressed={isModifierPressed}>G</Shortcut>
                  </Command.Item>
                  <Command.Item
                    value="devpost hackathons"
                    onSelect={() =>
                      runCommand(() =>
                        window.open(
                          "https://devpost.com/ManagementMO",
                          "_blank"
                        )
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    <Trophy className="h-4 w-4" />
                    <span className="flex-1">Devpost (hackathons)</span>
                    <Shortcut isModifierPressed={isModifierPressed}>D</Shortcut>
                  </Command.Item>
                  <Command.Item
                    value="source code repo"
                    onSelect={() =>
                      runCommand(() =>
                        window.open(
                          "https://github.com/ManagementMO/moelshrief-website-v2",
                          "_blank"
                        )
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    <CodeXml className="h-4 w-4" />
                    <span className="flex-1">Website Source</span>
                    <Shortcut isModifierPressed={isModifierPressed}>C</Shortcut>
                  </Command.Item>
                </Command.Group>

                <Command.Group
                  heading="Other"
                  className="px-2 text-stone-500 dark:text-stone-400"
                >
                  <Command.Item
                    value="toggle theme dark mode light mode"
                    onSelect={() => runCommand(() => toggleTheme())}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                    <span className="flex-1">
                      Toggle {theme === "light" ? "Dark" : "Light"} Mode
                    </span>
                    <Shortcut isModifierPressed={isModifierPressed}>T</Shortcut>
                  </Command.Item>
                  <Command.Item
                    value="stats data mode easter egg"
                    onSelect={() => triggerDataFlash()}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer data-[selected=true]:bg-stone-100 dark:data-[selected=true]:bg-stone-800"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="flex-1">Stats</span>
                    <Shortcut isModifierPressed={isModifierPressed}>S</Shortcut>
                  </Command.Item>
                </Command.Group>
              </Command.List>
              <div className="border-t border-stone-200 dark:border-stone-700 px-3 py-4">
                <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-3 w-3" />
                    <span>Type</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-stone-600 dark:text-stone-400">
                      ↵
                    </kbd>
                    <span>to select</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Press</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-stone-600 dark:text-stone-400">
                      esc
                    </kbd>
                    <span>to close</span>
                  </div>
                </div>
              </div>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
