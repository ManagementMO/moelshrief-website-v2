import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Caveat, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
// Loaded as a JS CSS import (not a CSS @import) so it works with Turbopack's
// strict CSS parser, which requires @import to precede all other rules.
import "./styles/prism.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
import ThemeProvider from "./components/ThemeProvider";
import Statusline from "./components/Statusline";

// Lazy-loaded for code-splitting. It's a client component that renders null
// during SSR (mobile-detection defaults true server-side), so it needs no
// `ssr: false` — which is disallowed in a Server Component in Next.js 15+.
const CommandPalette = dynamic(() => import("./components/CommandPalette"));

const handwriting = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-handwriting",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "mohammed elshrief",
  description:
    "mohammed elshrief — engineering, data, and the occasional hackathon.",
  metadataBase: new URL("https://moelshrief.wiki"),
  openGraph: {
    title: "mohammed elshrief",
    description:
      "mohammed elshrief — engineering, data, and the occasional hackathon.",
    url: "https://moelshrief.wiki",
    type: "website",
    images: ["/my-pfp.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "mohammed elshrief",
    description:
      "mohammed elshrief — engineering, data, and the occasional hackathon.",
    images: ["/my-pfp.jpg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohammed Elshrief",
  url: "https://moelshrief.wiki",
  image: "https://moelshrief.wiki/my-pfp.jpg",
  jobTitle: "Management Engineering Student",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Waterloo",
  },
  sameAs: [
    "https://github.com/ManagementMO",
    "https://www.linkedin.com/in/mohammed-elshrief/",
    "https://devpost.com/ManagementMO",
  ],
};

const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${handwriting.variable} ${GeistMono.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={GeistSans.className}>
        <SpeedInsights />
        <Analytics />
        <ThemeProvider>
          <main className="flex justify-center bg-stone-100 dark:bg-black font-extralight min-h-screen selection:bg-amber-200 dark:selection:bg-amber-800/40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] md:pb-10">
            <div className="flex flex-col gap-4 w-full md:max-w-[540px] m-6 md:m-20 text-neutral-500 dark:text-neutral-400 md:mt-[60px]">
              <Header />
              {children}
              <Footer />
            </div>
          </main>
          <CommandPalette />
          <Statusline />
        </ThemeProvider>
      </body>
    </html>
  );
}
