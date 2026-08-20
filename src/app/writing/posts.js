// Post registry — single source of truth for the writing section.
// To publish: create src/app/writing/<slug>/page.mdx, add an entry here,
// set published: true.

export const posts = [
  {
    slug: "how-eduroam-works",
    title: "how eduroam works",
    date: "2026-08-19",
    summary:
      "i kept connecting to eduroam at other campuses and finally looked into what was happening after i pressed connect.",
    readMins: 5,
    published: true,
  },
  {
    slug: "fairer-world-cup-schedule",
    title: "can a world cup schedule be fairer?",
    date: "2026-08-18",
    summary:
      "how i rebuilt the world cup group stage, found where the travel burden came from, and tested two practical ways to make the schedule fairer.",
    readMins: 6,
    published: true,
  },
  {
    slug: "example-post",
    title: "example post — replace me",
    date: "2026-06-12",
    summary:
      "a template showing the post format. set published: true when you write the real thing.",
    readMins: 3,
    published: false,
  },
];

export const publishedPosts = posts.filter((p) => p.published);
