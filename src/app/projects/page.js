import Link from "../components/Link";
import ProjectSearch from "../components/ProjectSearch";
import { projects, archive } from "./projectsData";

export const metadata = {
  title: "projects · mohammed elshrief",
  description: "things i've shipped — products, machine learning, hackathons.",
};

export default function Projects() {
  const count = projects.length + archive.length;
  return (
    <>
      <div className="font-mono text-xs text-stone-500 dark:text-stone-500">
        mohammed@portfolio:
        <span className="text-amber-700 dark:text-amber-400">~/projects</span>$
        ls --detail
        <span className="text-stone-400 dark:text-stone-600">
          {" "}
          · {count} entries · sorted by year
        </span>
      </div>
      <ProjectSearch />
      <p className="text-stone-600 dark:text-stone-400 text-sm">
        more on{" "}
        <Link href="https://github.com/ManagementMO?tab=repositories">
          github
        </Link>
        .
      </p>
    </>
  );
}
