import SlTrain from "./SlTrain";
import { FS, resolvePath } from "./fs";

const ERR = (text) => (
  <div className="text-rose-600 dark:text-rose-400">{text}</div>
);
const DIM = (text) => (
  <div className="text-stone-500 dark:text-stone-500">{text}</div>
);

export const HANDLED = "HANDLED";

const HELP_GROUPS = [
  {
    label: "# files",
    rows: [
      ["ls [-a] [path]", "list files (-a shows hidden)"],
      ["cd <path>", "change directory"],
      ["cat <file>", "read a file"],
      ["open <file>", "open the file's link"],
      ["tree", "draw the directory tree"],
      ["pwd", "print current directory"],
    ],
  },
  {
    label: "# info",
    rows: [
      ["about", "alias: cat about.md"],
      ["projects", "alias: cd projects && ls"],
      ["writing", "alias: cd writing && ls"],
      ["git log", "career as commit history"],
      ["activity", "live github stats"],
      ["whoami", "short bio"],
      ["history", "recent commands"],
      ["man <cmd>", "what does this do?"],
      ["theme [dark|light]", "toggle or set color theme"],
      ["clear", "clear the terminal (or ⌃L)"],
    ],
  },
  {
    label: "# fun",
    rows: [
      ["neofetch", "system info"],
      ["cowsay [msg]", "ask the goose"],
    ],
  },
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
  "tree",
  "history",
  "git",
  "man",
  "date",
  "uptime",
  "activity",
  "cowsay",
  "honk",
  "writing",
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

  const pool = leaf.startsWith(".")
    ? [...(FS[parentPath].hidden ?? []), ...FS[parentPath].children]
    : FS[parentPath].children;
  const candidates = pool.filter((n) => n.startsWith(leaf));
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


function runLs(target, { all = false } = {}) {
  if (!target || !FS[target])
    return ERR(`ls: ${target ?? ""}: no such file or directory`);
  const node = FS[target];
  if (node.type !== "dir") return <div>{target.split("/").pop()}</div>;
  const names = [...(all ? node.hidden ?? [] : []), ...node.children];
  if (names.length === 0) return DIM("(empty)");
  return (
    <div className="flex flex-wrap gap-x-4">
      {names.map((name) => {
        const childPath = target === "~" ? `~/${name}` : `${target}/${name}`;
        const child = FS[childPath];
        const isDir = child?.type === "dir";
        const isHidden = name.startsWith(".");
        return (
          <span
            key={name}
            className={
              isDir
                ? "text-sky-700 dark:text-sky-400"
                : isHidden
                  ? "text-stone-400 dark:text-stone-600"
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

const BOOT = Date.now();

const CAREER = [
  ["f4b1e25", "(HEAD -> waterloo) building TRACE + Meta-Harness @ wat.ai"],
  ["a7c3d91", "software engineering @ altas partners"],
  ["c1d8a44", "software engineering @ liftwerx"],
  ["9b2e7f3", "machine learning engineering @ wat.ai"],
  ["5a6c9d1", "ml dev @ themis ai · utmist"],
  ["e8f2b35", "(initial commit) management engineering @ uwaterloo"],
];

const MAN_PAGES = {
  help: "help — list available commands, grouped by vibe.",
  about: "about — alias for `cat about.md`. the short version of me.",
  projects: "projects — alias for `cd projects && ls`.",
  writing: "writing — alias for `cd writing && ls`. essays + notes.",
  ls: "ls [-a] [path] — list directory contents. -a shows dotfiles.",
  cd: "cd <path> — change directory. supports ~, .., relative paths.",
  pwd: "pwd — print working directory.",
  cat: "cat <file> — print a file. works on .md, .txt, and worse ideas.",
  open: "open <file> — follow the file's link (new tab for external).",
  tree: "tree [path] — draw the directory tree. dotfiles excluded.",
  history: "history — your last commands. persisted in localStorage.",
  git: "git log | git status — career as commit history.",
  activity: "activity — live github contributions + recent commits.",
  theme: "theme [dark|light|toggle] — set the color theme.",
  whoami: "whoami — one-line bio.",
  neofetch: "neofetch — system info, but the system is me.",
  date: "date — current date and time.",
  uptime: "uptime — time since you opened this page.",
  cowsay: "cowsay [msg] — a goose says your message. alias: honk.",
  echo: "echo <text> — print text.",
  clear: "clear — wipe the terminal. also ctrl+L.",
  man: "man <command> — you are here.",
};

function buildTree(path, prefix, lines) {
  const node = FS[path];
  const children = (node.children ?? []).filter((c) => !c.startsWith("."));
  children.forEach((name, i) => {
    const last = i === children.length - 1;
    const childPath = path === "~" ? `~/${name}` : `${path}/${name}`;
    const isDir = FS[childPath]?.type === "dir";
    lines.push(
      <div key={childPath}>
        <span className="text-stone-400 dark:text-stone-600">
          {prefix}
          {last ? "└── " : "├── "}
        </span>
        <span
          className={
            isDir
              ? "text-sky-700 dark:text-sky-400"
              : "text-stone-700 dark:text-stone-300"
          }
        >
          {name}
          {isDir ? "/" : ""}
        </span>
      </div>
    );
    if (isDir) buildTree(childPath, prefix + (last ? "    " : "│   "), lines);
  });
  return lines;
}

/** extras: { theme, toggleTheme, cmdHistory, startMatrix } — capability bag; keys optional. */
function runCommand(input, cwd, setCwd, setHistory, extras = {}) {
  const { theme, toggleTheme } = extras;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const [cmd, ...args] = trimmed.split(/\s+/);
  const c = cmd.toLowerCase();

  if (c === "clear") {
    setHistory([]);
    return HANDLED;
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
        {HELP_GROUPS.map((group) => (
          <div key={group.label} className="mb-1.5 last:mb-0">
            <div className="text-stone-400 dark:text-stone-600">
              {group.label}
            </div>
            {group.rows.map(([name, desc]) => (
              <div key={name}>
                <span className="text-amber-700 dark:text-amber-400 inline-block min-w-[150px] pr-3">
                  {name}
                </span>
                <span className="text-stone-500 dark:text-stone-500">
                  {desc}
                </span>
              </div>
            ))}
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
    const flags = args.filter((a) => a.startsWith("-")).join("");
    const all = flags.includes("a");
    const pathArg = args.find((a) => !a.startsWith("-"));
    const target = pathArg ? resolvePath(cwd, pathArg) : cwd;
    if (!target || !FS[target])
      return ERR(`ls: ${pathArg ?? cwd}: no such file or directory`);
    return runLs(target, { all });
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
    if (typeof window !== "undefined") {
      if (node.internal) window.location.assign(node.url);
      else window.open(node.url, "_blank");
    }
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

  if (c === "tree") {
    const root = args[0] ? resolvePath(cwd, args[0]) : cwd;
    if (!root || !FS[root]) return ERR(`tree: ${args[0]}: no such directory`);
    if (FS[root].type !== "dir")
      return ERR(`tree: ${args[0]}: not a directory`);
    return (
      <div>
        <div className="text-sky-700 dark:text-sky-400">{root}</div>
        {buildTree(root, "", [])}
      </div>
    );
  }

  if (c === "history") {
    const all = extras.cmdHistory ?? [];
    const items = all.slice(-20);
    const offset = all.length - items.length;
    if (items.length === 0) return DIM("history: empty");
    return (
      <div>
        {items.map((cmdStr, i) => (
          <div key={offset + i}>
            <span className="text-stone-400 dark:text-stone-600 inline-block min-w-[2.5rem] text-right pr-3">
              {offset + i + 1}
            </span>
            {cmdStr}
          </div>
        ))}
      </div>
    );
  }

  if (c === "git") {
    const sub = args[0]?.toLowerCase();
    if (sub === "log") {
      return (
        <div>
          {CAREER.map(([hash, msg]) => (
            <div key={hash}>
              <span className="text-amber-700 dark:text-amber-400">{hash}</span>{" "}
              {msg}
            </div>
          ))}
        </div>
      );
    }
    if (sub === "status") {
      return (
        <div>
          <div>on branch waterloo</div>
          <div>
            your branch is ahead of &apos;graduation&apos; by 42 commits.
          </div>
          <div className="text-stone-500 dark:text-stone-500">
            nothing to commit, working tree clean (lol)
          </div>
        </div>
      );
    }
    return DIM("usage: git log · git status");
  }

  if (c === "man") {
    if (!args[0]) return ERR("what manual page do you want?");
    const key = args[0].toLowerCase();
    const page = Object.hasOwn(MAN_PAGES, key) ? MAN_PAGES[key] : null;
    return page ? <div>{page}</div> : ERR(`No manual entry for ${args[0]}`);
  }

  if (c === "date") {
    return <div>{new Date().toString()}</div>;
  }

  if (c === "uptime") {
    const s = Math.floor((Date.now() - BOOT) / 1000);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return (
      <div>
        up {mins}m {secs}s · load average: coffee, hackathons, shipping
      </div>
    );
  }

  if (c === "writing") {
    setCwd("~/writing");
    return FS["~/writing"].children.length === 0
      ? DIM("// nothing published yet")
      : runLs("~/writing");
  }

  if (c === "cowsay" || c === "honk") {
    const msg =
      (c === "honk" && args.length === 0 ? "HONK." : args.join(" ")) ||
      "honk.";
    const text = msg.length > 38 ? msg.slice(0, 35) + "…" : msg;
    const top = " " + "_".repeat(text.length + 2);
    const bottom = " " + "-".repeat(text.length + 2);
    return (
      <pre className="leading-tight">{`${top}
< ${text} >
${bottom}
    \\
     \\   _
      >(.)__
       (___/   — the goose has spoken`}</pre>
    );
  }

  if (c === "sl") {
    return <SlTrain />;
  }

  if (c === "matrix") {
    extras.startMatrix?.();
    return DIM("wake up, neo… (any key to exit)");
  }

  return ERR(`bash: ${c}: command not found · type \`help\``);
}

export { runCommand, autocomplete, ERR, DIM };
