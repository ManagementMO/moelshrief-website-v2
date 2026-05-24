"use client";

import Link from "./Link";

export default function HorizontalNav({ links, variant = "plain" }) {
  return (
    <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
      {links.map((link) => (
        <span key={link.href} className="group/nav flex items-center">
          {variant === "terminal" && (
            <span
              className="text-stone-500 dark:text-stone-500 font-mono mr-1 transition-colors group-hover/nav:text-amber-600 dark:group-hover/nav:text-amber-400"
              aria-hidden="true"
            >
              ${" "}
            </span>
          )}
          <Link
            href={link.href}
            isActive={link.isActive}
            isNextLink={link.isNextLink}
            className={`text-sm ${
              link.isActive ? "text-stone-900 dark:text-stone-100" : ""
            }`}
          >
            {link.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}
