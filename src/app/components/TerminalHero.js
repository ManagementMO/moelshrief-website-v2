"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "./Link";

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
  ["ls [path]", "list files in a directory"],
  ["cd <path>", "change directory (try `cd projects`)"],
  ["pwd", "print current directory"],
  ["cat <file>", "read a file (try `cat about.md`)"],
  ["open <file>", "open the file's link in a new tab"],
  ["whoami", "short bio"],
  ["echo <text>", "echo text"],
  ["neofetch", "system info"],
  ["clear", "clear the terminal (or ⌃L)"],
];

function runCommand(input, cwd, setCwd, setHistory) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const [cmd, ...args] = trimmed.split(/\s+/);
  const c = cmd.toLowerCase();

  if (c === "clear") {
    setHistory([]);
    return "HANDLED";
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
    return DIM("(this is a website. close the tab.)");
  }

  return ERR(`bash: ${c}: command not found · type \`help\``);
}

export default function TerminalHero() {
  const [cwd, setCwd] = useState("~");
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [history, cwd]);

  const focusInput = () => {
    // don't steal focus from real links/buttons inside the terminal
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = input.trim();
      const result = runCommand(input, cwd, setCwd, setHistory);
      if (result !== "HANDLED") {
        setHistory((h) => [...h, { cmd: trimmed, cwd, output: result }]);
      }
      if (trimmed) setCmdHistory((c) => [...c, trimmed]);
      setInput("");
      setHistIdx(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const newIdx =
        histIdx < 0
          ? cmdHistory.length - 1
          : Math.max(0, histIdx - 1);
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
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div
      ref={blockRef}
      onClick={(e) => {
        // don't steal focus while user is selecting text
        if (typeof window !== "undefined" &&
            window.getSelection?.()?.toString().length > 0)
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
      {history.length <= 1 && (
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
