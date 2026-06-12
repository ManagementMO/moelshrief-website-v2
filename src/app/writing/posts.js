// Post registry — single source of truth for the writing section.
// To publish: create src/app/writing/<slug>/page.mdx, add an entry here,
// set published: true.

export const posts = [
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
