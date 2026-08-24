import Image from "next/image";
import Link from "./Link";

export default function AlexandriaMap() {
  return (
    <section
      aria-labelledby="alexandria-map-title"
      className="relative mt-4 ml-auto w-full max-w-[250px] overflow-hidden rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-sm lg:absolute lg:top-12 lg:right-[-224px] lg:mt-0 lg:w-[190px] lg:max-w-none"
    >
      <div className="flex items-center gap-2 px-3.5 py-1.5 border-b border-stone-200 dark:border-stone-800/80 font-mono text-xs">
        <span
          className="text-stone-400 dark:text-stone-600 select-none"
          aria-hidden="true"
        >
          ┌
        </span>
        <span className="text-amber-700 dark:text-amber-400 truncate">
          ~/origin.map
        </span>
        <span className="ml-auto shrink-0 text-micro tracking-[0.08em] uppercase text-stone-400 dark:text-stone-600">
          osm
        </span>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-[#11120f]">
        <Image
          src="/maps/alexandria.png"
          alt="A dark, detailed map of Alexandria, Egypt with the city center marked in amber"
          fill
          sizes="(max-width: 1023px) min(250px, 100vw - 3rem), 190px"
          className="object-cover object-[center_52%]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#11120f]/80 to-transparent" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[52%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/90 bg-amber-300/15 shadow-[0_0_0_2px_rgba(251,191,36,0.18)]"
        >
          <span className="absolute inset-[3px] rounded-full bg-amber-300" />
        </span>
      </div>

      <div className="flex items-end justify-between gap-2 border-t border-stone-200 px-3 py-2.5 font-mono dark:border-stone-800/80">
        <div className="min-w-0">
          <p className="text-micro uppercase tracking-[0.14em] text-stone-400 dark:text-stone-600">
            first coordinates
          </p>
          <h2
            id="alexandria-map-title"
            className="mt-1 truncate text-xs text-stone-800 dark:text-stone-200"
          >
            Alexandria
          </h2>
        </div>
        <Link
          href="https://www.openstreetmap.org/#map=12/31.2001/29.9187"
          className="shrink-0 text-micro text-amber-700 dark:text-amber-400"
        >
          view ↗
        </Link>
      </div>

      <div className="flex items-center justify-between gap-2 px-3 pb-2.5 font-mono text-[10px] text-stone-400 dark:text-stone-600">
        <span>31.2001° N</span>
        <span>29.9187° E</span>
        <span className="sr-only">generated with prettymaps from OpenStreetMap data</span>
      </div>
    </section>
  );
}
