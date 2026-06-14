import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the Turbopack root to this project so it doesn't walk up to a stray
  // parent lockfile (avoids the "multiple lockfiles" inference warning).
  turbopack: {
    root: import.meta.dirname,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

// Plugins are passed as strings (not imported functions) so they work with
// Turbopack — the default bundler in Next.js 16. Options must be serializable.
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-toc", { tight: true, maxDepth: 3 }]],
    rehypePlugins: ["rehype-prism-plus", "rehype-slug"],
  },
});

export default withMDX(nextConfig);
