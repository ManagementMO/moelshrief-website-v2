"use client";

import { useState } from "react";
import { projects, archive } from "../projects/projectsData";
import ProjectPane from "./ProjectPane";
import Reveal from "./Reveal";
import AsciiDivider from "./AsciiDivider";

const matches = (p, q) =>
  p.title.toLowerCase().includes(q) ||
  p.description.toLowerCase().includes(q) ||
  (p.technologies ?? []).some((t) => t.toLowerCase().includes(q));

export default function ProjectSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const q = searchTerm.trim().toLowerCase();
  const main = projects.filter((p) => matches(p, q));
  const archived = archive.filter((p) => matches(p, q));

  return (
    <>
      <label className="flex items-center font-mono text-sm rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50/40 dark:bg-stone-900/30 px-3.5 py-2.5 focus-within:border-amber-500/60 dark:focus-within:border-amber-400/60 transition-colors cursor-text">
        <span
          aria-hidden="true"
          className="text-stone-500 dark:text-stone-500 select-none whitespace-pre"
        >
          $ grep -ri{" "}
        </span>
        <span
          aria-hidden="true"
          className="text-stone-400 dark:text-stone-600 select-none"
        >
          &quot;
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="search projects"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="flex-1 min-w-0 bg-transparent outline-none border-none text-stone-800 dark:text-stone-200 caret-amber-500 dark:caret-amber-400"
        />
        <span
          aria-hidden="true"
          className="text-stone-400 dark:text-stone-600 select-none"
        >
          &quot;
        </span>
        <span
          aria-hidden="true"
          className="hidden sm:inline text-stone-500 dark:text-stone-500 select-none whitespace-pre"
        >
          {" "}
          ~/projects
        </span>
      </label>

      {main.length === 0 && archived.length === 0 ? (
        <div className="font-mono text-sm text-rose-600 dark:text-rose-400">
          grep: no matches in ~/projects
        </div>
      ) : (
        <>
          {main.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {main.map((p, i) =>
                q ? (
                  <div key={p.slug}>
                    <ProjectPane project={p} />
                  </div>
                ) : (
                  <Reveal key={p.slug} delay={i * 0.06}>
                    <ProjectPane project={p} />
                  </Reveal>
                )
              )}
            </div>
          )}
          {archived.length > 0 && (
            <>
              <AsciiDivider label="archive" />
              <div className="font-mono text-xs flex flex-col gap-1.5">
                {archived.map((p) => (
                  <div key={p.slug} className="flex items-baseline gap-3 min-w-0">
                    <span
                      aria-hidden="true"
                      className="text-stone-400 dark:text-stone-600 shrink-0 hidden sm:inline"
                    >
                      -rw-r--r--
                    </span>
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 transition-colors shrink-0"
                      >
                        {p.title}
                      </a>
                    ) : (
                      <span className="text-stone-700 dark:text-stone-300 shrink-0">
                        {p.title}
                      </span>
                    )}
                    <span className="text-stone-500 dark:text-stone-500 shrink-0">
                      {p.year}
                    </span>
                    <span className="text-stone-500 dark:text-stone-500 truncate">
                      {p.description}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
