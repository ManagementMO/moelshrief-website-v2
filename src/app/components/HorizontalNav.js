"use client";

import Link from "./Link";

export default function HorizontalNav({ links, variant = "plain" }) {
  return (
    <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
      {links.map((link) => (
        <span key={link.href} className="flex items-center">
          {variant === "terminal" && (
            <span
              className="text-stone-500 dark:text-stone-500 font-mono mr-1"
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
