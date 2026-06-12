import NextLink from "next/link";
import Pane from "../components/Pane";
import { posts, publishedPosts } from "../writing/posts";

export default function MdxLayout({ slug, children }) {
  const post = posts.find((p) => p.slug === slug);
  const pubIdx = publishedPosts.findIndex((p) => p.slug === slug);
  const prev = pubIdx > 0 ? publishedPosts[pubIdx - 1] : null;
  const next =
    pubIdx >= 0 && pubIdx < publishedPosts.length - 1
      ? publishedPosts[pubIdx + 1]
      : null;

  return (
    <article className="w-full min-w-0">
      <Pane path={`~/writing/${slug}.md`} meta="less">
        {post && (
          <div className="font-mono text-micro text-stone-400 dark:text-stone-600 mb-4">
            {post.date} · {post.readMins} min read
          </div>
        )}
        <div className="prose prose-sm prose-stone dark:prose-invert max-w-none prose-headings:font-medium prose-a:text-amber-700 dark:prose-a:text-amber-400">
          {children}
        </div>
        <div className="font-mono text-xs text-stone-400 dark:text-stone-600 mt-6 select-none">
          (END)
        </div>
      </Pane>
      {(prev || next) && (
        <div className="flex justify-between font-mono text-xs mt-4 text-stone-500 dark:text-stone-500">
          {prev ? (
            <NextLink
              href={`/writing/${prev.slug}`}
              className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              $ cd ../{prev.slug}
            </NextLink>
          ) : (
            <span />
          )}
          {next ? (
            <NextLink
              href={`/writing/${next.slug}`}
              className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              $ cd ../{next.slug}
            </NextLink>
          ) : (
            <span />
          )}
        </div>
      )}
    </article>
  );
}
