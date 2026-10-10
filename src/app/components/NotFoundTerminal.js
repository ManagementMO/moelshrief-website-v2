"use client";

import NextLink from "next/link";

// This recovery UI accompanies the interactive shell on every route. Keeping
// its link navigation in one prerendered client boundary avoids embedding the
// entire unused 404 tree in the homepage's hydration data.
export default function NotFoundTerminal() {
  return (
    <div className="not-found-terminal">
      <div>
        <span className="text-stone-500 dark:text-stone-500">mohammed@portfolio:~$</span>{" "}
        <span className="text-stone-800 dark:text-stone-200">cd ./this-page</span>
      </div>
      <div className="text-rose-600 dark:text-rose-400 mt-1">
        bash: cd: ./this-page: no such file or directory
      </div>
      <div className="mt-3">
        <span className="text-stone-500 dark:text-stone-500">mohammed@portfolio:~$</span>{" "}
        <span className="text-stone-800 dark:text-stone-200">ls ~</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {[
          { href: "/", label: "about" },
          { href: "/projects", label: "projects" },
          { href: "/writing", label: "writing" },
          { href: "/contact", label: "contact" },
        ].map((link) => (
          <NextLink key={link.href} href={link.href} className="not-found-link">
            {link.label}
          </NextLink>
        ))}
        <a href="/sitemap.xml" className="not-found-link">sitemap.xml</a>
        <a href="/llms.txt" className="not-found-link">llms.txt</a>
      </div>
      <div className="mt-3">
        <span className="text-stone-500 dark:text-stone-500">mohammed@portfolio:~$</span>{" "}
        <NextLink href="/" className="not-found-link">cd ~</NextLink>
        <span aria-hidden="true" className="not-found-cursor" />
      </div>
    </div>
  );
}
