"use client";

import NextLink from "next/link";

export default function Link({
  className = "",
  href,
  isActive,
  isNextLink,
  children,
}) {
  const baseStyles = `site-link ${!isActive ? "site-link-idle" : ""} ${className}`.trim();

  return isNextLink ? (
    <NextLink href={href} className={baseStyles}>
      {children}
    </NextLink>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={baseStyles}
    >
      {children}
    </a>
  );
}
