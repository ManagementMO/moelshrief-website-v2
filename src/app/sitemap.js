import { publishedPosts } from "./writing/posts";

export default function sitemap() {
  const base = "https://moelshrief.wiki";
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/writing`, changeFrequency: "weekly", priority: 0.8 },
    ...publishedPosts.map((p) => ({
      url: `${base}/writing/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly",
      priority: 0.6,
    })),
  ];
}
