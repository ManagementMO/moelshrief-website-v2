import { Linkedin, Github, Mail, CodeXml, Trophy } from "lucide-react";

const NOW_STATUS = "running from the geese · waterloo";

export default function Footer({ className }) {
  const links = [
    {
      name: "github",
      href: "https://github.com/ManagementMO",
      icon: Github,
    },
    {
      name: "linkedin",
      href: "https://www.linkedin.com/in/mohammed-elshrief/",
      icon: Linkedin,
    },
    {
      name: "email",
      href: "mailto:mkelshri@uwaterloo.ca",
      icon: Mail,
    },
    {
      name: "devpost",
      href: "https://devpost.com/ManagementMO",
      icon: Trophy,
    },
    {
      name: "repo",
      href: "https://github.com/ManagementMO/moelshrief-website-v2",
      icon: CodeXml,
    },
  ];

  return (
    <footer
      className={`flex flex-col gap-4 text-sm text-stone-500 dark:text-stone-400 ${className}`}
    >
      <hr className="border-b border-neutral-200 dark:border-neutral-800" />
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-wrap gap-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              aria-label={link.name}
              className="group flex items-center hover:text-neutral-800 dark:hover:text-neutral-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <link.icon className="w-5 h-5 hover:scale-110 md:hover:scale-110 transition-transform duration-500 ease-out" />
              <span className="hidden md:inline-block md:w-0 md:overflow-hidden md:group-hover:w-auto md:group-hover:ml-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-out">
                {link.name}
              </span>
            </a>
          ))}
        </div>
        <div
          className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-500"
          aria-label="current status"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-500 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-amber-400" />
          </span>
          <span className="italic">{NOW_STATUS}</span>
        </div>
      </div>
      <p suppressHydrationWarning>
        {new Date().getFullYear()} &copy; mohammed elshrief
      </p>
    </footer>
  );
}
