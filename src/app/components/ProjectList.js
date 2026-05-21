import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </div>
  );
}
