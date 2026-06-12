import NextLink from "next/link";
import { publishedPosts } from "./posts";

export const metadata = {
  title: "writing · mohammed elshrief",
  description: "essays + notes on agents, engineering, and shipping.",
};

export default function Writing() {
  return (
    <>
      <div className="font-mono text-xs text-stone-500 dark:text-stone-500">
        mohammed@portfolio:
        <span className="text-amber-700 dark:text-amber-400">~/writing</span>$
        ls -t
        <span className="text-stone-400 dark:text-stone-600">
          {" "}
          · {publishedPosts.length}{" "}
          {publishedPosts.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      {publishedPosts.length === 0 ? (
        <p className="font-mono text-sm text-stone-400 dark:text-stone-600 italic">
          {"// nothing published yet"}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {publishedPosts.map((post) => (
            <NextLink
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group rounded-md border border-stone-300 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30 px-3.5 py-3 hover:border-amber-500/60 dark:hover:border-amber-400/60 transition-colors"
            >
              <div className="text-stone-800 dark:text-stone-200 font-medium text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                {post.title}
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-sm mt-0.5">
                {post.summary}
              </p>
              <div className="font-mono text-micro text-stone-400 dark:text-stone-600 mt-1.5">
                {post.date} · {post.readMins} min
              </div>
            </NextLink>
          ))}
        </div>
      )}
    </>
  );
}
