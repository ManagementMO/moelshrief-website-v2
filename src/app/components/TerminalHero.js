"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "./Link";
import { useTheme } from "./ThemeProvider";

function Logo({
  src,
  alt,
  padded = false,
  wide = false,
  paddedWidth = 36,
  paddedBgSize = "175%",
  clipPath,
  size = 14,
  topOffset = 3,
}) {
  if (padded) {
    return (
      <span
        role="img"
        aria-label={alt}
        title={alt}
        className="inline-block rounded-[2px] mr-1"
        style={{
          width: `${paddedWidth}px`,
          height: "14px",
          top: `${topOffset}px`,
          position: "relative",
          backgroundImage: `url(${src})`,
          backgroundSize: paddedBgSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          clipPath,
        }}
      />
    );
  }
  if (wide) {
    return (
      <Image
        src={src}
        alt={alt}
        width={56}
        height={14}
        className="object-contain object-left inline mr-1"
        style={{
          position: "relative",
          top: `${topOffset}px`,
          height: "14px",
          width: "auto",
        }}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain inline mr-1"
      style={{ position: "relative", top: `${topOffset}px` }}
    />
  );
}

function Prompt({ cwd }) {
  return (
    <span className="text-stone-500 dark:text-stone-500 pr-2">
      mohammed@portfolio:{cwd}$
    </span>
  );
}

function AboutOutput() {
  return (
    <>
      <div className="text-stone-500 dark:text-stone-500"># currently</div>
      <div>
        - Management Engineering @{" "}
        <Logo
          src="/logos/waterloo.png"
          alt="UWaterloo"
          size={24}
          topOffset={-2}
        />
        <Link href="https://uwaterloo.ca">
          <span className="text-amber-700 dark:text-amber-400">UWaterloo</span>
        </Link>
      </div>
      <div className="h-2" aria-hidden="true" />
      <div className="text-stone-500 dark:text-stone-500"># building</div>
      <div>
        -{" "}
        <Link href="https://watai.ca">
          <span className="text-amber-700 dark:text-amber-400">TRACE</span>
        </Link>{" "}
        — agentic qa + observability for ai agents. catches them when they
        hallucinate.
      </div>
      <div>&nbsp;&nbsp;built at wat.ai w/ composio + magic hour</div>
      <div>
        -{" "}
        <Link href="https://github.com/ManagementMO/Meta-Harness">
          <span className="text-amber-700 dark:text-amber-400">
            Meta-Harness
          </span>
        </Link>{" "}
        — turned stanford&apos;s linear meta-harness loop into a langgraph tree
      </div>
      <div>&nbsp;&nbsp;(time-travel forking, postgres checkpoints)</div>
      <div className="h-2" aria-hidden="true" />
      <div className="text-stone-500 dark:text-stone-500"># previously</div>
      <div>
        - Software Engineering @{" "}
        <Logo src="/logos/altas.png" alt="Altas Partners" padded />
        <Link href="https://www.altas.com">
          <span className="text-amber-700 dark:text-amber-400">
            Altas Partners
          </span>
        </Link>
      </div>
      <div>
        - Software Engineering @{" "}
        <Logo src="/logos/liftwerx.png" alt="LiftWerx" wide />
        <Link href="https://www.liftwerx.com">
          <span className="text-amber-700 dark:text-amber-400">LiftWerx</span>
        </Link>
      </div>
      <div>
        - Machine Learning Engineering @{" "}
        <Logo src="/logos/watai.png" alt="WAT.ai" />
        <Link href="https://watai.ca">
          <span className="text-amber-700 dark:text-amber-400">WAT.ai</span>
        </Link>
      </div>
      <div>
        - Machine Learning Developer @{" "}
        <Logo src="/logos/utmist.svg" alt="UTMIST" />
        <Link href="https://www.utmist.ca/">
          <span className="text-amber-700 dark:text-amber-400">
            Themis AI · UTMIST
          </span>
        </Link>
      </div>
      <div>
        - slightly too into hackathons @{" "}
        <Logo
          src="/logos/devpost.jpg"
          alt="Devpost"
          padded
          paddedWidth={16}
          paddedBgSize="cover"
          clipPath="polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
        />
        <Link href="https://devpost.com/ManagementMO">
          <span className="text-amber-700 dark:text-amber-400">Devpost</span>
        </Link>
      </div>
    </>
  );
}

// virtual filesystem
const FS = {
  "~": {
    type: "dir",
    children: ["about.md", "projects", "work.txt", "contact.md"],
  },
  "~/about.md": { type: "file", render: () => <AboutOutput /> },
  "~/projects": {
    type: "dir",
    children: ["trace", "meta-harness"],
  },
  "~/projects/trace": {
    type: "file",
    url: "https://watai.ca",
    render: () => (
      <>
        <div>
          <span className="text-amber-700 dark:text-amber-400">TRACE</span> —
          agentic qa + observability for ai agents
        </div>
        <div>
          catches agents when they hallucinate. built at wat.ai w/ composio +
          magic hour.
        </div>
        <div className="text-stone-500 dark:text-stone-500 mt-1">
          link:{" "}
          <Link href="https://watai.ca">
            <span className="text-amber-700 dark:text-amber-400">
              watai.ca
            </span>
          </Link>
        </div>
      </>
    ),
  },
  "~/projects/meta-harness": {
    type: "file",
    url: "https://github.com/ManagementMO/Meta-Harness",
    render: () => (
      <>
        <div>
          <span className="text-amber-700 dark:text-amber-400">
            Meta-Harness
          </span>{" "}
          — stanford&apos;s linear meta-harness loop reshaped as a langgraph
          tree
        </div>
        <div>(time-travel forking, postgres checkpoints)</div>
        <div className="text-stone-500 dark:text-stone-500 mt-1">
          link:{" "}
          <Link href="https://github.com/ManagementMO/Meta-Harness">
            <span className="text-amber-700 dark:text-amber-400">
              github.com/ManagementMO/Meta-Harness
            </span>
          </Link>
        </div>
      </>
    ),
  },
  "~/work.txt": {
    type: "file",
    render: () => (
      <>
        <div>- Software Engineering · Altas Partners</div>
        <div>- Software Engineering · LiftWerx</div>
        <div>- Machine Learning Engineering · WAT.ai</div>
        <div>- Machine Learning Developer · Themis AI / UTMIST</div>
      </>
    ),
  },
  "~/contact.md": {
    type: "file",
    render: () => (
      <>
        <div>
          email:{" "}
          <Link href="mailto:mkelshri@uwaterloo.ca">
            <span className="text-amber-700 dark:text-amber-400">
              mkelshri@uwaterloo.ca
            </span>
          </Link>
        </div>
        <div>
          github:{" "}
          <Link href="https://github.com/ManagementMO">
            <span className="text-amber-700 dark:text-amber-400">
              github.com/ManagementMO
            </span>
          </Link>
        </div>
        <div>
          linkedin:{" "}
          <Link href="https://www.linkedin.com/in/mohammed-elshrief/">
            <span className="text-amber-700 dark:text-amber-400">
              /in/mohammed-elshrief
            </span>
          </Link>
        </div>
      </>
    ),
  },
};

// resolve a relative or absolute path against cwd → canonical "~"-rooted path
function resolvePath(cwd, raw) {
  if (!raw || raw === "~" || raw === "~/") return "~";
  let parts;
  if (raw.startsWith("~/")) {
    parts = raw.slice(2).split("/").filter(Boolean);
    parts = ["~", ...parts];
  } else if (raw.startsWith("/")) {
    return null; // we don't model absolute paths outside ~
  } else {
    const base = cwd === "~" ? ["~"] : cwd.split("/").filter(Boolean);
    parts = [...base, ...raw.split("/").filter(Boolean)];
  }
  const out = [];
  for (const p of parts) {
    if (p === "." || p === "") continue;
    if (p === "..") {
      if (out.length > 1) out.pop();
    } else {
      out.push(p);
    }
  }
  if (out.length === 0) return "~";
  return out.length === 1 ? out[0] : out[0] + "/" + out.slice(1).join("/");
}

const ERR = (text) => (
  <div className="text-rose-600 dark:text-rose-400">{text}</div>
);
const DIM = (text) => (
  <div className="text-stone-500 dark:text-stone-500">{text}</div>
);

const HELP_ROWS = [
  ["help", "list available commands"],
  ["about", "alias: cat about.md"],
  ["projects", "alias: cd projects && ls"],
  ["ls [path]", "list files in a directory"],
  ["cd <path>", "change directory"],
  ["pwd", "print current directory"],
  ["cat <file>", "read a file"],
  ["open <file>", "open the file's link in a new tab"],
  ["theme [dark|light]", "toggle or set color theme"],
  ["whoami", "short bio"],
  ["neofetch", "system info"],
  ["clear", "clear the terminal (or ⌃L)"],
];

const ALL_COMMANDS = [
  "help",
  "about",
  "projects",
  "ls",
  "cd",
  "pwd",
  "cat",
  "open",
  "theme",
  "whoami",
  "echo",
  "neofetch",
  "clear",
  "exit",
  "logout",
  "sudo",
  "vim",
  "nvim",
  "emacs",
  "nano",
];

function longestCommonPrefix(strings) {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}

// returns the new input after a Tab completion, or null if nothing to complete
function autocomplete(input, cwd) {
  if (!input) return null;

  const hasSpace = /\s/.test(input);
  if (!hasSpace) {
    // completing the command name
    const prefix = input;
    const matches = ALL_COMMANDS.filter((c) => c.startsWith(prefix));
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0] + " ";
    const common = longestCommonPrefix(matches);
    return common.length > prefix.length ? common : null;
  }

  // completing a path argument — work on the last whitespace-separated token
  const tokens = input.split(/(\s+)/);
  const lastToken = tokens[tokens.length - 1];
  if (!lastToken) return null;

  // split last token into directory prefix + leaf to complete
  let parentRaw, leaf, prefix;
  const lastSlash = lastToken.lastIndexOf("/");
  if (lastSlash >= 0) {
    parentRaw = lastToken.slice(0, lastSlash);
    if (parentRaw === "") parentRaw = "/";
    leaf = lastToken.slice(lastSlash + 1);
    prefix = lastToken.slice(0, lastSlash + 1);
  } else {
    parentRaw = ".";
    leaf = lastToken;
    prefix = "";
  }

  const parentPath =
    parentRaw === "."
      ? cwd
      : parentRaw === "/"
        ? null
        : resolvePath(cwd, parentRaw);
  if (!parentPath || !FS[parentPath] || FS[parentPath].type !== "dir")
    return null;

  const candidates = FS[parentPath].children.filter((n) => n.startsWith(leaf));
  if (candidates.length === 0) return null;

  const buildFull = (suffix) => {
    tokens[tokens.length - 1] = prefix + suffix;
    return tokens.join("");
  };

  if (candidates.length === 1) {
    const child = candidates[0];
    const childPath =
      parentPath === "~" ? `~/${child}` : `${parentPath}/${child}`;
    const isDir = FS[childPath]?.type === "dir";
    return buildFull(child + (isDir ? "/" : " "));
  }

  const common = longestCommonPrefix(candidates);
  if (common.length > leaf.length) return buildFull(common);
  return null;
}


function runLs(target) {
  if (!target || !FS[target])
    return ERR(`ls: no such file or directory`);
  const node = FS[target];
  if (node.type !== "dir") return <div>{target.split("/").pop()}</div>;
  return (
    <div className="flex flex-wrap gap-x-4">
      {node.children.map((name) => {
        const childPath = target === "~" ? `~/${name}` : `${target}/${name}`;
        const child = FS[childPath];
        const isDir = child?.type === "dir";
        return (
          <span
            key={name}
            className={
              isDir
                ? "text-sky-700 dark:text-sky-400"
                : "text-stone-700 dark:text-stone-300"
            }
          >
            {name}
            {isDir ? "/" : ""}
          </span>
        );
      })}
    </div>
  );
}

function runCommand(input, cwd, setCwd, setHistory, extras = {}) {
  const { theme, toggleTheme } = extras;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const [cmd, ...args] = trimmed.split(/\s+/);
  const c = cmd.toLowerCase();

  if (c === "clear") {
    setHistory([]);
    return "HANDLED";
  }

  if (c === "about") {
    return <div>{FS["~/about.md"].render()}</div>;
  }

  if (c === "projects") {
    setCwd("~/projects");
    return runLs("~/projects");
  }

  if (c === "theme") {
    const arg = args[0]?.toLowerCase();
    if (arg && arg !== "dark" && arg !== "light" && arg !== "toggle") {
      return ERR(`theme: invalid mode '${arg}' (use dark, light, or toggle)`);
    }
    if (!toggleTheme) return ERR("theme: not available");
    if (arg === "dark" || arg === "light") {
      if (theme !== arg) toggleTheme();
      return DIM(`theme → ${arg}`);
    }
    toggleTheme();
    return DIM(`theme → ${theme === "dark" ? "light" : "dark"}`);
  }

  if (c === "help") {
    return (
      <div>
        {HELP_ROWS.map(([name, desc]) => (
          <div key={name}>
            <span className="text-amber-700 dark:text-amber-400 inline-block min-w-[110px]">
              {name}
            </span>
            <span className="text-stone-500 dark:text-stone-500">{desc}</span>
          </div>
        ))}
      </div>
    );
  }

  if (c === "pwd") return <div>{cwd}</div>;

  if (c === "whoami") {
    return (
      <div>
        mohammed elshrief — management engineering @ uwaterloo. building TRACE
        + meta-harness. slightly too into hackathons.
      </div>
    );
  }

  if (c === "echo") return <div>{args.join(" ")}</div>;

  if (c === "neofetch") {
    return (
      <div className="flex gap-4 items-start">
        <pre className="text-amber-700 dark:text-amber-400 leading-tight">{`   __  ___ ___
  /  |/  // _ \\
 / /|_/ // // /
/_/  /_/ \\___/ `}</pre>
        <div className="text-xs">
          <div>
            <span className="text-amber-700 dark:text-amber-400">user</span>:
            mohammed@portfolio
          </div>
          <div>
            <span className="text-amber-700 dark:text-amber-400">role</span>:
            management engineering · uwaterloo
          </div>
          <div>
            <span className="text-amber-700 dark:text-amber-400">stack</span>:
            python · ts · next · langgraph
          </div>
          <div>
            <span className="text-amber-700 dark:text-amber-400">
              shipping
            </span>
            : trace · meta-harness
          </div>
          <div>
            <span className="text-amber-700 dark:text-amber-400">coffee</span>:
            ∞
          </div>
        </div>
      </div>
    );
  }

  if (c === "ls") {
    const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
    if (!target || !FS[target])
      return ERR(`ls: ${args[0] ?? cwd}: no such file or directory`);
    return runLs(target);
  }

  if (c === "cd") {
    const raw = args[0] || "~";
    const target = resolvePath(cwd, raw);
    if (!target || !FS[target])
      return ERR(`cd: no such file or directory: ${raw}`);
    if (FS[target].type !== "dir")
      return ERR(`cd: not a directory: ${raw}`);
    setCwd(target);
    return null;
  }

  if (c === "cat") {
    if (!args[0]) return ERR("cat: missing file operand");
    const target = resolvePath(cwd, args[0]);
    if (!target || !FS[target])
      return ERR(`cat: ${args[0]}: no such file or directory`);
    const node = FS[target];
    if (node.type === "dir") return ERR(`cat: ${args[0]}: is a directory`);
    return <div>{node.render()}</div>;
  }

  if (c === "open") {
    if (!args[0]) return ERR("open: missing file operand");
    const target = resolvePath(cwd, args[0]);
    if (!target || !FS[target])
      return ERR(`open: ${args[0]}: no such file or directory`);
    const node = FS[target];
    if (!node.url) return ERR(`open: ${args[0]}: no link associated`);
    if (typeof window !== "undefined") window.open(node.url, "_blank");
    return DIM(`opened ${node.url}`);
  }

  if (c === "sudo") {
    return ERR("sudo: nice try. you are not in the sudoers file.");
  }

  if (c === "vim" || c === "nvim" || c === "emacs" || c === "nano") {
    return DIM(`(${c}: this is a portfolio, not your editor. try \`cat\`.)`);
  }

  if (c === "exit" || c === "logout") {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document
          .querySelector("footer")
          ?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 80);
    }
    return DIM("// EOF · scrolling to signoff…");
  }

  return ERR(`bash: ${c}: command not found · type \`help\``);
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
      });
      if (result !== "HANDLED") {
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
      {history.length <= 1 && cmdHistory.length === 0 && (
        <div className="text-stone-400 dark:text-stone-600 text-xs italic mt-1">
          (type{" "}
          <span className="text-amber-700 dark:text-amber-400 not-italic">
            help
          </span>{" "}
          for commands · ↑/↓ for history)
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
