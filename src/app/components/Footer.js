import { Linkedin, Github, Mail, CodeXml, Trophy, MapPin } from "lucide-react";

const NOW_STATUS = "waterloo";

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
              className="group flex items-center hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <link.icon className="w-5 h-5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.55)] dark:group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.55)]" />
              <span className="hidden md:inline-block md:w-0 md:overflow-hidden md:group-hover:w-auto md:group-hover:ml-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 ease-out font-mono text-xs">
                {link.name}
              </span>
            </a>
          ))}
        </div>
        <div
          className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-500"
          aria-label="location"
        >
          <MapPin
            className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span>{NOW_STATUS}</span>
        </div>
      </div>
      <p suppressHydrationWarning>
        {new Date().getFullYear()} &copy; mohammed elshrief
      </p>
    </footer>
  );
}
