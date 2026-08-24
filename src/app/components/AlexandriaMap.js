import Image from "next/image";
import Link from "./Link";

export default function AlexandriaMap() {
  return (
    <section
      aria-labelledby="alexandria-map-title"
      className="relative md:-mx-16 md:w-[calc(100%+8rem)] rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3.5 py-1.5 border-b border-stone-200 dark:border-stone-800/80 font-mono text-xs">
        <span
          className="text-stone-400 dark:text-stone-600 select-none"
          aria-hidden="true"
        >
          ┌
        </span>
        <span className="text-amber-700 dark:text-amber-400 truncate">
          ~/about/origin.map
        </span>
        <span className="ml-auto shrink-0 text-micro tracking-[0.08em] uppercase text-stone-400 dark:text-stone-600">
          openstreetmap
        </span>
      </div>

      <div className="grid md:grid-cols-[minmax(0,1.35fr)_minmax(190px,0.65fr)]">
        <div className="relative aspect-square bg-[#11120f] overflow-hidden">
          <Image
            src="/maps/alexandria.png"
            alt="A dark, detailed map of Alexandria, Egypt with the city center marked in amber"
            fill
            sizes="(max-width: 767px) calc(100vw - 3rem), 540px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#11120f]/75 to-transparent pointer-events-none" />
          <span className="absolute left-3 bottom-2.5 font-mono text-micro tracking-[0.08em] text-stone-400/90">
            31.2001° N&nbsp;&nbsp;29.9187° E
          </span>
        </div>

        <div className="flex flex-col justify-between gap-6 p-5 border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-800/80">
          <div>
            <p className="font-mono text-micro uppercase tracking-[0.16em] text-stone-400 dark:text-stone-600">
              origin
            </p>
            <h2
              id="alexandria-map-title"
              className="mt-2 font-mono text-lg leading-tight text-stone-800 dark:text-stone-200"
            >
              Alexandria, Egypt
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              i was born here. the map keeps going.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs text-stone-500 dark:text-stone-500">
            <dl className="space-y-1.5">
              <div className="flex justify-between gap-4">
                <dt>coast</dt>
                <dd className="text-right text-stone-700 dark:text-stone-300">
                  Mediterranean
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>format</dt>
                <dd className="text-right text-stone-700 dark:text-stone-300">
                  OSM / raster
                </dd>
              </div>
            </dl>
            <Link
              href="https://www.openstreetmap.org/#map=12/31.2001/29.9187"
              className="text-amber-700 dark:text-amber-400"
            >
              open map data ↗
            </Link>
            <p className="text-[10px] leading-relaxed text-stone-400 dark:text-stone-600">
              generated with prettymaps from OpenStreetMap data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
