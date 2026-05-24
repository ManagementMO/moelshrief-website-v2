"use client";

import NextLink from "next/link";

export default function Link({
  className = "",
  href,
  isActive,
  isNextLink,
  children,
}) {
  const baseStyles = `
    group/link
    relative inline-flex items-center
    text-stone-700 dark:text-stone-300
    transition-colors duration-150
    ${
      !isActive &&
      `
      rounded-[2px]
      px-[2px] -mx-[2px]
      hover:bg-amber-300/35 dark:hover:bg-amber-400/15
      hover:text-amber-900 dark:hover:text-amber-100
    `
    }
    ${className}
  `.trim();

  const Cursor = !isActive ? (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block w-[6px] h-[1em] bg-amber-500 dark:bg-amber-400 align-text-bottom opacity-0 group-hover/link:opacity-100 group-hover/link:animate-cursor-blink"
    />
  ) : null;

  return isNextLink ? (
    <NextLink href={href} className={baseStyles}>
      {children}
      {Cursor}
    </NextLink>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={baseStyles}
    >
      {children}
      {Cursor}
    </a>
  );
}
