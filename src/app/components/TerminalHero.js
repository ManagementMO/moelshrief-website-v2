"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { AboutOutput } from "./terminal/fs";
import { runCommand, autocomplete, HANDLED } from "./terminal/commands";

function Prompt({ cwd }) {
  return (
    <span className="text-stone-500 dark:text-stone-500 pr-2">
      mohammed@portfolio:{cwd}$
    </span>
  );
}

export default function TerminalHero() {
  const { theme, toggleTheme } = useTheme();
  const [cwd, setCwd] = useState("~");
  // Seeded with the fully-rendered `cat about.md` command + output so the bio
  // is visible the moment the page loads — no animation gate.
  const [history, setHistory] = useState(() => [
    { cmd: "cat about.md", cwd: "~", output: <AboutOutput /> },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const blockRef = useRef(null);
  const bottomRef = useRef(null);

  // On mount: restore persisted command history
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("terminal_cmd_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCmdHistory(parsed.slice(-50));
      }
    } catch {}
  }, []);

  // Persist command history to localStorage (capped at 50). Skip writing
  // when cmdHistory is the empty initial state — otherwise the first effect
  // run after mount would wipe the persisted value before the load effect's
  // setCmdHistory has had a chance to propagate.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (cmdHistory.length === 0) return;
    try {
      localStorage.setItem(
        "terminal_cmd_history",
        JSON.stringify(cmdHistory.slice(-50))
      );
    } catch {}
  }, [cmdHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [history, cwd]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = input.trim();
      const result = runCommand(input, cwd, setCwd, setHistory, {
        theme,
        toggleTheme,
        cmdHistory,
      });
      if (result !== HANDLED) {
        setHistory((h) => [...h, { cmd: trimmed, cwd, output: result }]);
      }
      if (trimmed) setCmdHistory((c) => [...c, trimmed]);
      setInput("");
      setHistIdx(-1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completed = autocomplete(input, cwd);
      if (completed !== null) {
        setInput(completed);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (input.length > 0) {
        setInput("");
        setHistIdx(-1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const newIdx =
        histIdx < 0 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(newIdx);
      setInput(cmdHistory[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const newIdx = histIdx + 1;
      if (newIdx >= cmdHistory.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === "l" && e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setHistory([]);
    } else if (e.key === "a" && e.ctrlKey && !e.metaKey) {
      // Ctrl+A → move cursor to start (real readline)
      e.preventDefault();
      inputRef.current?.setSelectionRange(0, 0);
    } else if (e.key === "e" && e.ctrlKey && !e.metaKey) {
      // Ctrl+E → move cursor to end
      e.preventDefault();
      const end = inputRef.current?.value.length ?? 0;
      inputRef.current?.setSelectionRange(end, end);
    }
  };

  return (
    <div
      ref={blockRef}
      onClick={(e) => {
        // don't steal focus while user is selecting text
        if (
          typeof window !== "undefined" &&
          window.getSelection?.()?.toString().length > 0
        )
          return;
        // and don't override real links inside the terminal
        if (e.target.tagName !== "A" && e.target.closest("a") === null)
          focusInput();
      }}
      className="font-mono text-sm rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-sm p-5 text-stone-700 dark:text-stone-300 leading-relaxed w-full min-w-0 break-words cursor-text"
    >
      <div role="log" aria-live="polite" aria-label="terminal output">
        {history.map((entry, i) => (
          <div key={i}>
            <div>
              <Prompt cwd={entry.cwd} />
              <span className="text-stone-800 dark:text-stone-200">
                {entry.cmd}
              </span>
            </div>
            {entry.output ? (
              <div className="mt-1 mb-2">{entry.output}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <Prompt cwd={cwd} />
        <div className="relative flex-1 h-[1.25em]">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            aria-label="terminal input"
            className="absolute inset-0 w-full h-full bg-transparent outline-none border-none p-0 text-stone-800 dark:text-stone-200 caret-amber-500 dark:caret-amber-400"
          />
          {!focused && !input && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[7px] h-[14px] bg-amber-500 dark:bg-amber-400 animate-cursor-blink"
            />
          )}
        </div>
      </div>
      <div className="text-stone-400 dark:text-stone-600 text-xs italic mt-1">
        (type{" "}
        <span className="text-amber-700 dark:text-amber-400 not-italic">
          help
        </span>{" "}
        for commands · ↑/↓ for history)
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
