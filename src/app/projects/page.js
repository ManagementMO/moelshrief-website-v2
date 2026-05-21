import Link from "../components/Link";
import ProjectSearch from "../components/ProjectSearch";

export const metadata = {
  title: "projects · mohammed elshrief",
  description: "things i've shipped — products, machine learning, hackathons.",
};

export default function Projects() {
  return (
    <>
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
