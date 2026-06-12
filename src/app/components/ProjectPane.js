import Pane from "./Pane";
import Link from "./Link";

export default function ProjectPane({ project }) {
  const {
    slug,
    title,
    year,
    status,
    href,
    description,
    technologies,
    github,
    demo,
  } = project;
  return (
    <Pane
      path={`~/projects/${slug}`}
      meta={`${year}${status === "active" ? " · ★ active" : ""}`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-800 dark:text-stone-200 font-medium text-lg hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
      >
        {title}
      </a>
      <p className="text-stone-600 dark:text-stone-400 mt-1.5 text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(technologies ?? []).map((tech) => (
          <span
            key={tech}
            className="text-micro uppercase tracking-wider px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-5 font-mono text-xs">
        {demo && (
          <span className="text-stone-500 dark:text-stone-500">
            <span aria-hidden="true">$ </span>
            <Link href={demo}>open demo ↗</Link>
          </span>
        )}
        {github && (
          <span className="text-stone-500 dark:text-stone-500">
            <span aria-hidden="true">$ </span>
            <Link href={github}>git clone</Link>
          </span>
        )}
      </div>
    </Pane>
  );
}
