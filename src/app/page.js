"use client";

import Link from "./components/Link";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { GalleryHorizontalEnd, GraduationCap } from "lucide-react";
import Dashboard from "./components/Dashboard";

const Signature = dynamic(() => import("@/app/components/Signature"), {
  ssr: false,
});

function Bullet() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-[9px] w-[7px] h-[7px] bg-stone-800 dark:bg-stone-200 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 group-hover:shadow-[0_0_0_3px_rgba(245,158,11,0.18)] dark:group-hover:shadow-[0_0_0_3px_rgba(251,191,36,0.2)]"
    />
  );
}

function Logo({
  src,
  alt,
  padded = false,
  wide = false,
  paddedWidth = 36,
  paddedBgSize = "175%",
  clipPath,
}) {
  if (padded) {
    return (
      <span
        role="img"
        aria-label={alt}
        title={alt}
        className="inline-block relative top-[2px] rounded-[2px]"
        style={{
          width: `${paddedWidth}px`,
          height: "14px",
          backgroundImage: `url(${src})`,
          backgroundSize: paddedBgSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          clipPath,
        }}
      />
    );
  }
  if (wide) {
    return (
      <Image
        src={src}
        alt={alt}
        width={56}
        height={14}
        className="object-contain object-left relative top-[2px] h-[14px] w-auto"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={14}
      height={14}
      className="object-contain relative top-[2px]"
    />
  );
}

export default function About() {
  return (
    <div className="flex flex-col max-w-2xl mx-auto font-extralight">
      <Dashboard />
      <ul className="grid gap-1 text-base">
        <li className="group flex items-start gap-4 pl-4 relative hover:translate-x-1 transition-transform duration-200">
          <Bullet />
          <span className="text-stone-600 dark:text-stone-400">
            Management Engineering
            <span className="inline-flex items-baseline gap-1 ml-2">
              <GraduationCap
                className="size-[14px] relative top-[2px] text-stone-500 dark:text-stone-400"
                aria-hidden="true"
              />
              <Link href="https://uwaterloo.ca" className="font-medium">
                UWaterloo
              </Link>
            </span>
          </span>
        </li>

        <li className="group flex flex-col gap-3 pl-4 relative hover:translate-x-1 transition-transform duration-200">
          <Bullet />
          <span className="mt-2 text-micro uppercase tracking-widest font-mono text-stone-500 dark:text-stone-500">
            {"// shipping"}
          </span>
          <span className="text-stone-600 dark:text-stone-400 italic font-medium">
            what i&apos;ve been building:
          </span>
          <ul className="grid gap-1 pl-4">
            <li className="relative flex items-start gap-4">
              <span className="absolute left-[-20px] top-0 text-stone-500 dark:text-stone-500">
                ↳
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                <Link href="https://watai.ca" className="font-medium">
                  TRACE
                </Link>{" "}
                — agentic qa + observability for ai agents. catches them when
                they hallucinate. built at wat.ai w/ composio + magic hour
              </span>
            </li>
            <li className="relative flex items-start gap-4">
              <span className="absolute left-[-20px] top-0 text-stone-500 dark:text-stone-500">
                ↳
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                <Link
                  href="https://github.com/ManagementMO/Meta-Harness"
                  className="font-medium"
                >
                  Meta-Harness
                </Link>{" "}
                — turned stanford&apos;s linear meta-harness loop into a
                langgraph tree (time-travel forking, postgres checkpoints)
              </span>
            </li>
            <li className="relative flex items-start gap-4">
              <span className="absolute left-[-20px] top-0 text-stone-500 dark:text-stone-500">
                ↳
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                <Link href="https://paybridgetech.com/" className="font-medium">
                  Paybridge
                </Link>{" "}
                — full-stack cross-border payments, $1k+ moved in pilot
              </span>
            </li>
          </ul>
        </li>

        <li className="group flex flex-col gap-3 pl-4 relative hover:translate-x-1 transition-transform duration-200">
          <Bullet />
          <span className="mt-2 text-micro uppercase tracking-widest font-mono text-stone-500 dark:text-stone-500">
            {"// experience"}
          </span>
          <span className="text-stone-600 dark:text-stone-400 italic font-medium">
            previously:
          </span>
          <ul className="grid gap-1 pl-4">
            <li className="relative flex items-start gap-4">
              <span className="absolute left-[-20px] top-0 text-stone-500 dark:text-stone-500">
                ↳
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                Software Engineering
                <span className="inline-flex items-baseline gap-1 ml-2">
                  <Logo src="/logos/altas.png" alt="Altas Partners" padded />
                  <Link href="https://www.altas.com" className="font-medium">
                    Altas Partners
                  </Link>
                </span>
              </span>
            </li>
            <li className="relative flex items-start gap-4">
              <span className="absolute left-[-20px] top-0 text-stone-500 dark:text-stone-500">
                ↳
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                Software Engineering
                <span className="inline-flex items-baseline gap-1 ml-2">
                  <Logo src="/logos/liftwerx.png" alt="LiftWerx" wide />
                  <Link href="https://www.liftwerx.com" className="font-medium">
                    LiftWerx
                  </Link>
                </span>
              </span>
            </li>
            <li className="relative flex items-start gap-4">
              <span className="absolute left-[-20px] top-0 text-stone-500 dark:text-stone-500">
                ↳
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                Machine Learning Engineering
                <span className="inline-flex items-baseline gap-1 ml-2">
                  <Logo src="/logos/watai.png" alt="WAT.ai" />
                  <Link href="https://watai.ca" className="font-medium">
                    WAT.ai
                  </Link>
                </span>
              </span>
            </li>
            <li className="relative flex items-start gap-4">
              <span className="absolute left-[-20px] top-0 text-stone-500 dark:text-stone-500">
                ↳
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                Machine Learning Developer
                <span className="inline-flex items-baseline gap-1 ml-2">
                  <Logo src="/logos/utmist.svg" alt="UTMIST" />
                  <Link href="https://www.utmist.ca/" className="font-medium">
                    Themis AI · UTMIST
                  </Link>
                </span>
              </span>
            </li>
            <li className="relative flex items-start gap-4">
              <span className="absolute left-[-20px] top-0 text-stone-500 dark:text-stone-500">
                ↳
              </span>
              <span className="text-stone-600 dark:text-stone-400">
                slightly too into hackathons
                <span className="inline-flex items-baseline gap-1 ml-2">
                  <Logo
                    src="/logos/devpost.jpg"
                    alt="Devpost"
                    padded
                    paddedWidth={16}
                    paddedBgSize="cover"
                    clipPath="polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
                  />
                  <Link
                    href="https://devpost.com/ManagementMO"
                    className="font-medium"
                  >
                    Devpost
                  </Link>
                </span>
              </span>
            </li>
          </ul>
        </li>
      </ul>

      <NextLink
        href="/projects"
        className="text-center mt-6 py-4 px-6 rounded-lg border border-stone-400 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 transform transition-all duration-300 font-extralight hover:scale-[1.02] active:scale-[0.98] shadow-sm"
      >
        see what i&apos;ve built{" "}
        <GalleryHorizontalEnd className="size-5 inline align-top ml-1 transition-transform" />
      </NextLink>

      <div className="flex flex-col sm:flex-row items-center justify-end mt-8">
        <Signature />
      </div>
    </div>
  );
}
