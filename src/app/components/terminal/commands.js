import { FS, resolvePath } from "./fs";

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

export { runCommand, autocomplete, ERR, DIM };
