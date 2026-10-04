import Image from "next/image";
import Link from "../Link";
import { archive } from "../../projects/projectsData";
import { publishedPosts } from "../../writing/posts";

function Logo({
  src,
  padded = false,
  paddedWidth = 36,
  paddedBgSize = "175%",
  clipPath,
  width = 14,
  height = 14,
  unoptimized = false,
  invertDark = false,
  className = "",
}) {
  if (padded) {
    return (
      <span
        aria-hidden="true"
        className="inline-block shrink-0 rounded-[2px]"
        style={{
          width: `${paddedWidth}px`,
          height: `${height}px`,
          backgroundImage: `url(${src})`,
          backgroundSize: paddedBgSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          clipPath,
        }}
      />
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      unoptimized={unoptimized}
      className={`block shrink-0 object-contain${
        invertDark ? " dark:invert" : ""
      } ${className}`}
    />
  );
}

function Company({ name, href, ...logoProps }) {
  return (
    <span className="inline-flex items-center gap-2 align-middle whitespace-nowrap">
      <span>@</span>
      <Logo {...logoProps} />
      <Link href={href}>
        <span className="text-amber-700 dark:text-amber-400">{name}</span>
      </Link>
    </span>
  );
}

function AboutOutput() {
  return (
    <>
      <h2 className="text-stone-500 dark:text-stone-500"># studying</h2>
      <div>
        - Management Engineering{" "}
        <Company
          src="/logos/waterloo.png"
          name="University of Waterloo"
          href="https://uwaterloo.ca"
          width={16}
          height={16}
          unoptimized
        />
      </div>
      <div className="h-2" aria-hidden="true" />
      <h2 className="text-stone-500 dark:text-stone-500"># incoming</h2>
      <div>
        - Software Engineer{" "}
        <Company
          src="/logos/microsoft.svg"
          name="Microsoft"
          href="https://www.microsoft.com"
          unoptimized
        />
      </div>
      <div>
        - Software Engineer{" "}
        <Company
          src="/logos/ibm.svg"
          name="IBM"
          href="https://www.ibm.com"
          width={30}
          height={12}
          className="dark:brightness-125"
          unoptimized
        />
      </div>
      <div className="h-2" aria-hidden="true" />
      <h2 className="text-stone-500 dark:text-stone-500"># previously</h2>
      <div>
        - Software Engineer{" "}
        <Company
          src="/logos/upfront.png"
          name="Upfront Ventures"
          href="https://upfront.com"
          width={44}
          invertDark
          unoptimized
        />
      </div>
      <div>
        - Software Engineer{" "}
        <Company
          src="/logos/altas.png"
          name="Altas Partners"
          href="https://www.altas.com"
          padded
        />
      </div>
      <div>
        - Software Engineer{" "}
        <Company
          src="/logos/liftwerx.png"
          name="LiftWerx"
          href="https://www.liftwerx.com"
          width={46}
          className="brightness-0 dark:brightness-100"
        />
      </div>
      <div>
        - Machine Learning Engineer{" "}
        <Company src="/logos/watai.png" name="WAT.ai" href="https://watai.ca" />
      </div>
      <div>
        - Machine Learning Engineer{" "}
        <Company
          src="/logos/utmist.svg"
          name="UTMIST"
          href="https://www.utmist.ca/"
          height={12}
        />
      </div>
      <div>
        - Hackathon Addict{" "}
        <Company
          src="/logos/devpost.jpg"
          name="Devpost"
          href="https://devpost.com/ManagementMO"
          padded
          paddedWidth={16}
          paddedBgSize="cover"
          clipPath="polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
        />
      </div>
    </>
  );
}

// virtual filesystem
const FS = {
  "~": {
    type: "dir",
    children: ["about.md", "projects", "writing", "work.txt", "contact.md"],
    hidden: [".bashrc", ".secrets"],
  },
  "~/about.md": { type: "file", render: () => <AboutOutput /> },
  "~/projects": {
    type: "dir",
    children: ["trace", "meta-harness", "archive"],
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
  "~/projects/archive": {
    type: "dir",
    children: archive.map((p) => p.slug),
  },
  "~/writing": {
    type: "dir",
    children: publishedPosts.map((p) => `${p.slug}.md`),
  },
  "~/.secrets": {
    type: "file",
    hidden: true,
    render: () => (
      <>
        <div className="text-stone-500 dark:text-stone-500">
          # ~/.secrets — decrypting…
        </div>
        <div>next_big_thing: ████████████████</div>
        <div>dream_job: ██████████ (you know the one)</div>
        <div>hackathon_strategy: sleep is ████████</div>
        <div className="text-stone-500 dark:text-stone-500">
          (3 entries redacted · nice try)
        </div>
      </>
    ),
  },
  "~/.bashrc": {
    type: "file",
    hidden: true,
    render: () => (
      <>
        <div className="text-stone-500 dark:text-stone-500"># aliases</div>
        <div>alias work=&quot;coffee &amp;&amp; code&quot;</div>
        <div>alias ship=&quot;git push --force-with-lease &amp;&amp; pray&quot;</div>
        <div>alias goose=&quot;cowsay&quot;</div>
        <div>export EDITOR=vim &nbsp;# fight me</div>
      </>
    ),
  },
  "~/work.txt": {
    type: "file",
    render: () => (
      <>
        <div>- Software Engineer · Upfront Ventures</div>
        <div>- Software Engineer · Altas Partners</div>
        <div>- Software Engineer · LiftWerx</div>
        <div>- Machine Learning Engineer · WAT.ai</div>
        <div>- Machine Learning Engineer · UTMIST</div>
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

// generated archive file nodes
for (const p of archive) {
  FS[`~/projects/archive/${p.slug}`] = {
    type: "file",
    url: p.href,
    render: () => (
      <>
        <div>
          <span className="text-amber-700 dark:text-amber-400">{p.title}</span>{" "}
          — {p.description}
        </div>
        <div className="text-stone-500 dark:text-stone-500">
          {p.year} · {p.technologies.join(" · ")}
        </div>
      </>
    ),
  };
}

// generated writing file nodes
for (const p of publishedPosts) {
  FS[`~/writing/${p.slug}.md`] = {
    type: "file",
    url: `/writing/${p.slug}`,
    internal: true,
    render: () => (
      <>
        <div>
          <span className="text-amber-700 dark:text-amber-400">{p.title}</span>{" "}
          — {p.summary}
        </div>
        <div className="text-stone-500 dark:text-stone-500">
          {p.date} · {p.readMins} min · open {p.slug}.md → read it
        </div>
      </>
    ),
  };
}

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

export { FS, resolvePath, AboutOutput };
