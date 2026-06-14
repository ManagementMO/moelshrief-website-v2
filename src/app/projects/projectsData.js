// Single source of truth for project data.
// Consumed by the projects page AND the terminal virtual FS.

export const projects = [
  {
    slug: "trace",
    title: "TRACE",
    year: "2025",
    status: "active",
    href: "https://watai.ca",
    description:
      "agentic qa + observability for ai agents — runs them through realistic tool / rag workflows, verifies outcomes, isolates where the workflow became unrecoverable, and turns failures into regression tests. built at wat.ai w/ composio + magic hour. catching agents when they hallucinate.",
    technologies: ["AI Agents", "LLM Evals", "RAG", "Observability", "Python"],
    demo: "https://watai.ca",
  },
  {
    slug: "meta-harness",
    title: "Meta-Harness",
    year: "2025",
    status: "active",
    href: "https://github.com/ManagementMO/Meta-Harness",
    description:
      "stanford's meta-harness paper had a linear loop — i mapped it onto langgraph and made it a tree. two state machines, postgres-backed checkpointing, time-travel forking, cross-run memory. self-improving agent harnesses, by construction.",
    technologies: ["LangGraph", "Postgres", "FastAPI", "Next.js", "Python"],
    github: "https://github.com/ManagementMO/Meta-Harness",
  },
];

export const archive = [
  {
    slug: "paybridge",
    title: "paybridge",
    year: "2024",
    href: "https://paybridgetech.com/",
    description: "Founder, learned americans don't have etransfer",
    technologies: ["Python", "React", "PostgreSQL", "Docker"],
  },
  {
    slug: "scam-mah",
    title: "scam-mah",
    year: "2024",
    href: "https://devpost.com/software/scam-mah",
    description: "real-time spam detection · 3rd place @ newhacks 2024",
    technologies: ["Python", "Flask", "Gemini API"],
  },
  {
    slug: "focusforge",
    title: "focusforge",
    year: "2024",
    href: "https://jasooh.github.io/mse-100-launch-page/",
    description: "excel/vba time-management suite w/ gemini-powered insights",
    technologies: ["Excel", "VBA", "Gemini API"],
  },
  {
    slug: "financial-planning-tool",
    title: "financial-planning-tool",
    year: "2023",
    href: "https://github.com/ManagementMO/VBA-Financial-Planning-Tool",
    description: "student budget forecasting in excel/vba · used by 100+ students",
    technologies: ["Excel", "VBA", "Python"],
  },
];
