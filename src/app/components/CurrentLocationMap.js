import Image from "next/image";
import Link from "./Link";
import location from "../data/current-location.json";

function formatCoordinate(value, positive, negative) {
  return (
    Math.abs(value).toFixed(4) +
    "° " +
    (value >= 0 ? positive : negative)
  );
}

export default function CurrentLocationMap({ className = "" }) {
  const latitude = formatCoordinate(location.latitude, "N", "S");
  const longitude = formatCoordinate(location.longitude, "E", "W");
  const label = [location.city, location.region].filter(Boolean).join(", ");
  const mapPath = "/maps/" + location.slug + ".png";
  const mapUrl =
    "https://www.openstreetmap.org/#map=12/" +
    location.latitude +
    "/" +
    location.longitude;

  return (
    <figure
      className={"ml-auto mt-2 w-full max-w-[220px] font-mono " + className}
    >
      <figcaption className="mb-1 text-xs leading-none text-stone-500 dark:text-stone-500">
        {location.caption}
      </figcaption>
      <div className="flex items-end gap-2.5">
        <Link
          href={mapUrl}
          className="group/location relative block h-[78px] w-[116px] shrink-0 overflow-hidden rounded-[2px] border border-stone-300 bg-[#11120f] dark:border-stone-700"
        >
          <Image
            src={mapPath}
            alt={
              "A detailed map of " +
              label +
              " with its city center marked in amber"
            }
            fill
            sizes="116px"
            className="object-cover object-[center_56%] brightness-125 contrast-125 transition-transform duration-300 group-hover/location:scale-105"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[52%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/90 bg-amber-300/15 shadow-[0_0_0_2px_rgba(251,191,36,0.18)]"
          >
            <span className="absolute inset-[3px] rounded-full bg-amber-300" />
          </span>
        </Link>

        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm text-stone-700 dark:text-stone-300">
            {location.city}
          </p>
          <p className="mt-0.5 truncate text-micro text-stone-500 dark:text-stone-500">
            {location.region}
          </p>
          <p className="mt-1 text-[10px] text-stone-400 dark:text-stone-600">
            {latitude}
            <br />
            {longitude}
          </p>
        </div>
      </div>
      <span className="sr-only">
        Generated with prettymaps from OpenStreetMap data. Open the map data.
      </span>
    </figure>
  );
}
