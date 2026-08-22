import NextLink from "next/link";

export const metadata = { title: "404 · mohammed elshrief" };

export default function NotFound() {
  return (
    <div className="font-mono text-sm rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-sm p-5 text-stone-700 dark:text-stone-300 leading-relaxed w-full min-w-0">
      <div>
        <span className="text-stone-500 dark:text-stone-500">
          mohammed@portfolio:~$
        </span>{" "}
        <span className="text-stone-800 dark:text-stone-200">
          cd ./this-page
        </span>
      </div>
      <div className="text-rose-600 dark:text-rose-400 mt-1">
        bash: cd: ./this-page: no such file or directory
      </div>
      <div className="mt-3">
        <span className="text-stone-500 dark:text-stone-500">
          mohammed@portfolio:~$
        </span>{" "}
        <span className="text-stone-800 dark:text-stone-200">ls ~</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {[
          { href: "/", label: "about" },
          { href: "/projects", label: "projects" },
          { href: "/writing", label: "writing" },
          { href: "/contact", label: "contact" },
        ].map((l) => (
          <NextLink
            key={l.href}
            href={l.href}
            className="text-amber-700 dark:text-amber-400 hover:underline underline-offset-4"
          >
            {l.label}
          </NextLink>
        ))}
        <a
          href="/sitemap.xml"
          className="text-amber-700 dark:text-amber-400 hover:underline underline-offset-4"
        >
          sitemap.xml
        </a>
        <a
          href="/llms.txt"
          className="text-amber-700 dark:text-amber-400 hover:underline underline-offset-4"
        >
          llms.txt
        </a>
      </div>
      <div className="mt-3">
        <span className="text-stone-500 dark:text-stone-500">
          mohammed@portfolio:~$
        </span>{" "}
        <NextLink
          href="/"
          className="text-amber-700 dark:text-amber-400 hover:underline underline-offset-4"
        >
          cd ~
        </NextLink>
        <span
          aria-hidden="true"
          className="ml-1 inline-block w-[7px] h-[14px] bg-amber-500 dark:bg-amber-400 align-middle animate-cursor-blink"
        />
      </div>
    </div>
  );
}
