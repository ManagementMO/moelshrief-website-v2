import Link from "../components/Link";

export const metadata = {
  title: "contact · mohammed elshrief",
  description:
    "how to reach mohammed elshrief — email, github, linkedin, devpost.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { label: "email", value: "mkelshri@uwaterloo.ca", href: "mailto:mkelshri@uwaterloo.ca" },
  { label: "github", value: "github.com/ManagementMO", href: "https://github.com/ManagementMO" },
  { label: "linkedin", value: "linkedin.com/in/mohammed-elshrief", href: "https://www.linkedin.com/in/mohammed-elshrief/" },
  { label: "devpost", value: "devpost.com/ManagementMO", href: "https://devpost.com/ManagementMO" },
];

export default function Contact() {
  return (
    <>
      <div className="font-mono text-xs text-stone-500 dark:text-stone-500">
        mohammed@portfolio:
        <span className="text-amber-700 dark:text-amber-400">~</span>$ cat
        contact.md
      </div>
      <div className="flex flex-col gap-3 text-sm text-stone-600 dark:text-stone-400">
        <p>
          the fastest way to reach me is email — i read everything. i reply
          quickest to messages about software engineering, machine learning,
          agent tooling, internships, and collaborating on hackathon or
          research projects.
        </p>
        <div className="font-mono text-sm rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 p-4 flex flex-col gap-1.5">
          {channels.map((c) => (
            <div key={c.label}>
              <span className="text-stone-500 dark:text-stone-500">
                {c.label}:
              </span>{" "}
              <Link href={c.href}>
                <span className="text-amber-700 dark:text-amber-400">
                  {c.value}
                </span>
              </Link>
            </div>
          ))}
        </div>
        <p>
          i&apos;m based in canada (eastern time) and study management
          engineering at the university of waterloo. if you&apos;re writing
          about one of my{" "}
          <Link href="/projects" isNextLink>
            <span className="text-amber-700 dark:text-amber-400">projects</span>
          </Link>{" "}
          or one of my{" "}
          <Link href="/writing" isNextLink>
            <span className="text-amber-700 dark:text-amber-400">articles</span>
          </Link>
          , include the link so i have context. recruiters: email works best
          and my resume is available on request.
        </p>
      </div>
    </>
  );
}
