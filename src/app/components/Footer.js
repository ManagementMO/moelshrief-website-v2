import SonicSprite from "./SonicSprite";

export default function Footer({ className = "" }) {
  const links = [
    { name: "github", href: "https://github.com/ManagementMO" },
    {
      name: "linkedin",
      href: "https://www.linkedin.com/in/mohammed-elshrief/",
    },
    { name: "email", href: "mailto:mkelshri@uwaterloo.ca" },
    { name: "devpost", href: "https://devpost.com/ManagementMO" },
    {
      name: "repo",
      href: "https://github.com/ManagementMO/moelshrief-website-v2",
    },
  ];

  return (
    <footer
      className={`site-footer ${className}`}
    >
      <hr className="border-b border-neutral-200 dark:border-neutral-800" />
      <div className="flex items-center justify-between gap-4 min-w-0">
        <div className="flex flex-wrap gap-4 items-center min-w-0">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              aria-label={link.name}
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="footer-icon" viewBox="0 0 24 24" aria-hidden="true">
                <use href={`/icons/social.svg#${link.name}`} />
              </svg>
              <span className="footer-label">
                {link.name}
              </span>
            </a>
          ))}
        </div>
        <SonicSprite />
      </div>
    </footer>
  );
}
