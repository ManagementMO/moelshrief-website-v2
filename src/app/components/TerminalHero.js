"use client";
import Link from "./Link";

export default function TerminalHero() {
  const prompt = (
    <span className="text-stone-500 dark:text-stone-500">
      mohammed@portfolio:~${" "}
    </span>
  );
  return (
    <div className="font-mono text-sm rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-sm p-5 text-stone-700 dark:text-stone-300 leading-relaxed w-full min-w-0 break-words">
      <div>
        {prompt}
        <span className="text-stone-800 dark:text-stone-200">cat about.md</span>
      </div>
      <div className="h-3" aria-hidden="true" />

      {/* # currently */}
      <div className="text-stone-500 dark:text-stone-500"># currently</div>
      <div>
        - Management Engineering @{" "}
        <Link href="https://uwaterloo.ca">
          <span className="text-amber-700 dark:text-amber-400">UWaterloo</span>
        </Link>
      </div>
      <div className="h-2" aria-hidden="true" />

      {/* # building */}
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
      <div>
        -{" "}
        <Link href="https://paybridgetech.com/">
          <span className="text-amber-700 dark:text-amber-400">Paybridge</span>
        </Link>{" "}
        — full-stack cross-border payments, $1k+ moved in pilot
      </div>
      <div className="h-2" aria-hidden="true" />

      {/* # previously */}
      <div className="text-stone-500 dark:text-stone-500"># previously</div>
      <div>
        - Software Engineering @{" "}
        <Link href="https://www.altas.com">
          <span className="text-amber-700 dark:text-amber-400">
            Altas Partners
          </span>
        </Link>
      </div>
      <div>
        - Software Engineering @{" "}
        <Link href="https://www.liftwerx.com">
          <span className="text-amber-700 dark:text-amber-400">LiftWerx</span>
        </Link>
      </div>
      <div>
        - Machine Learning Engineering @{" "}
        <Link href="https://watai.ca">
          <span className="text-amber-700 dark:text-amber-400">WAT.ai</span>
        </Link>
      </div>
      <div>
        - Machine Learning Developer @{" "}
        <Link href="https://www.utmist.ca/">
          <span className="text-amber-700 dark:text-amber-400">
            Themis AI · UTMIST
          </span>
        </Link>
      </div>
      <div>
        - slightly too into hackathons @{" "}
        <Link href="https://devpost.com/ManagementMO">
          <span className="text-amber-700 dark:text-amber-400">Devpost</span>
        </Link>
      </div>
      <div className="h-3" aria-hidden="true" />

      {/* blinking cursor */}
      <div>
        {prompt}
        <span
          className="inline-block w-[7px] h-[14px] bg-amber-500 dark:bg-amber-400 align-middle animate-cursor-blink"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
