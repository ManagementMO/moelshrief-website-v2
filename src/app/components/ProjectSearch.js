"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ProjectList from "./ProjectList";

const projects = [
  {
    title: "TRACE",
    href: "https://watai.ca",
    description:
      "agentic qa + observability for ai agents — runs them through realistic tool / rag workflows, verifies outcomes, isolates where the workflow became unrecoverable, and turns failures into regression tests. built at wat.ai w/ composio + magic hour. catching agents when they hallucinate.",
    image: "/images/projects/trace.svg",
    imageAlt: "TRACE",
    technologies: [
      "AI Agents",
      "LLM Evals",
      "RAG",
      "Observability",
      "Python",
    ],
    demo: "https://watai.ca",
  },
  {
    title: "Meta-Harness",
    href: "https://github.com/ManagementMO/Meta-Harness",
    description:
      "stanford's meta-harness paper had a linear loop — i mapped it onto langgraph and made it a tree. two state machines, postgres-backed checkpointing, time-travel forking, cross-run memory. self-improving agent harnesses, by construction.",
    image: "/images/projects/meta-harness.svg",
    imageAlt: "Meta-Harness",
    technologies: [
      "LangGraph",
      "Postgres",
      "FastAPI",
      "Next.js",
      "Python",
    ],
    github: "https://github.com/ManagementMO/Meta-Harness",
  },
  {
    title: "Paybridge",
    href: "https://paybridgetech.com/",
    description:
      "full-stack money transfer app for cross-border payments. moved $1k+ in real-user volume in early pilot.",
    image: "/images/projects/pay-bridge.jpg",
    imageAlt: "Paybridge",
    technologies: ["Python", "React", "PostgreSQL", "Docker"],
    github: "https://github.com/ManagementMO",
    demo: "https://paybridgetech.com/",
  },
];

export default function ProjectSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <>
      <div className="relative">
        <Search className="absolute top-2.5 left-3 size-6 text-stone-400" />
        <input
          type="text"
          placeholder="search for a project, technology, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 px-4 border border-stone-400 rounded-md bg-transparent focus:outline-none focus:border-stone-700 dark:focus:border-stone-300 pl-10 text-stone-700 dark:text-stone-300 placeholder:text-stone-400 dark:placeholder:text-stone-500"
        />
      </div>
      <ProjectList projects={filtered} />
    </>
  );
}
