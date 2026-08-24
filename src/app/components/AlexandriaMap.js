import Image from "next/image";
import Link from "./Link";

export default function AlexandriaMap({ className = "" }) {
  return (
    <figure
      className={`ml-auto mt-2 flex w-full max-w-[220px] items-start gap-2.5 font-mono ${className}`}
    >
      <Link
        href="https://www.openstreetmap.org/#map=12/31.2001/29.9187"
        className="group/map relative block h-[78px] w-[116px] shrink-0 overflow-hidden rounded-[2px] border border-stone-300 bg-[#11120f] dark:border-stone-700"
      >
        <Image
          src="/maps/alexandria.png"
          alt="A detailed map of Alexandria, Egypt with its city center marked in amber"
          fill
          sizes="116px"
          className="object-cover object-[center_56%] brightness-125 contrast-125 transition-transform duration-300 group-hover/map:scale-105"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[52%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/90 bg-amber-300/15 shadow-[0_0_0_2px_rgba(251,191,36,0.18)]"
        >
          <span className="absolute inset-[3px] rounded-full bg-amber-300" />
        </span>
      </Link>

      <figcaption className="min-w-0 pt-0.5 leading-tight">
        <p className="text-micro uppercase tracking-[0.12em] text-stone-400 dark:text-stone-600">
          first coordinates
        </p>
        <p className="mt-1 truncate text-xs text-stone-700 dark:text-stone-300">
          Alexandria
        </p>
        <p className="mt-1 text-[10px] text-stone-400 dark:text-stone-600">
          31.2001° N
          <br />
          29.9187° E
        </p>
        <span className="sr-only">
          Generated with prettymaps from OpenStreetMap data. Open the map data.
        </span>
      </figcaption>
    </figure>
  );
}
