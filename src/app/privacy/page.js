export const metadata = {
  title: "privacy · mohammed elshrief",
  description:
    "privacy practices for moelshrief.com — what is (and isn't) collected.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <div className="font-mono text-xs text-stone-500 dark:text-stone-500">
        mohammed@portfolio:
        <span className="text-amber-700 dark:text-amber-400">~</span>$ cat
        privacy.md
      </div>
      <div className="flex flex-col gap-3 text-sm text-stone-600 dark:text-stone-400">
        <p>
          moelshrief.com is a personal portfolio site. it has no user
          accounts, no forms, no comments, and nothing for sale — so there is
          very little data to talk about, but here is all of it.
        </p>
        <h2 className="font-mono text-sm text-stone-700 dark:text-stone-300">
          # what is collected
        </h2>
        <p>
          the site itself collects and stores no personal data. hosting and
          analytics are provided by vercel: vercel analytics and speed
          insights record anonymous, aggregated metrics (page views, web
          vitals, coarse geography). they use no cookies and do no cross-site
          tracking, and i never see individual visitors.
        </p>
        <h2 className="font-mono text-sm text-stone-700 dark:text-stone-300">
          # what stays in your browser
        </h2>
        <p>
          your theme preference and the command history of the interactive
          terminal on the home page are kept in your browser&apos;s
          localStorage. they never leave your device, and clearing site data
          removes them completely.
        </p>
        <h2 className="font-mono text-sm text-stone-700 dark:text-stone-300">
          # questions
        </h2>
        <p>
          if anything here is unclear, email{" "}
          <a
            href="mailto:mkelshri@uwaterloo.ca"
            className="text-amber-700 dark:text-amber-400 hover:underline underline-offset-4"
          >
            mkelshri@uwaterloo.ca
          </a>{" "}
          and i&apos;ll answer. this page was last updated in august 2026.
        </p>
      </div>
    </>
  );
}
