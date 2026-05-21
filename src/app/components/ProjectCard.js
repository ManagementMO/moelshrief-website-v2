import Image from "next/image";
import { Github, SquareArrowOutUpRight } from "lucide-react";

const shimmer = `
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#333" />
  <rect id="r" width="100%" height="100%" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-100%" to="100%" dur="1s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function ProjectCard({
  title,
  description,
  href,
  image,
  imageAlt,
  videoSrc,
  technologies,
  github,
  demo,
  className,
}) {
  return (
    <div
      className={`group bg-neutral-100 dark:bg-neutral-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
        className ?? ""
      }`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden"
      >
        <div className="relative">
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="rounded-t-lg w-full h-[250px] group-hover:h-[275px] object-cover object-center transition-all duration-500"
            />
          ) : (
            <Image
              src={image}
              width={1000}
              height={500}
              unoptimized={typeof image === "string" && image.endsWith(".svg")}
              placeholder={
                typeof image === "string" && image.endsWith(".svg")
                  ? undefined
                  : `data:image/svg+xml;base64,${toBase64(shimmer)}`
              }
              alt={imageAlt}
              sizes="(max-width: 768px) 100vw, 500px"
              className="rounded-t-lg w-full h-[250px] group-hover:h-[275px] object-cover object-center transition-all duration-500"
            />
          )}
        </div>
      </a>
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-800 dark:text-neutral-200 font-medium text-2xl hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-200 block"
            >
              {title}
            </a>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed text-sm">
              {description}
            </p>
            {technologies && technologies.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-micro uppercase tracking-wider px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} on GitHub`}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} demo`}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <SquareArrowOutUpRight className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
