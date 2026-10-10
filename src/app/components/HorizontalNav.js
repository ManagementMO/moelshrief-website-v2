"use client";

import Link from "./Link";

export default function HorizontalNav({ links, variant = "plain" }) {
  return (
    <nav className="site-nav">
      {links.map((link) => (
        <span key={link.href} className="site-nav-item">
          {variant === "terminal" && (
            <span
              className="site-nav-prompt"
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
