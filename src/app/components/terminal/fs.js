import Image from "next/image";
import Link from "../Link";

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
  unoptimized = false,
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
      unoptimized={unoptimized}
      className="object-contain inline mr-1"
      style={{ position: "relative", top: `${topOffset}px` }}
    />
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
          unoptimized
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

export { FS, resolvePath, AboutOutput };
