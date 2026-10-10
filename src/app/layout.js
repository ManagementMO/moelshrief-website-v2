import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
// Loaded as a JS CSS import (not a CSS @import) so it works with Turbopack's
// strict CSS parser, which requires @import to precede all other rules.
import "./styles/prism.css";
import SiteShell from "./components/SiteShell";
import { identityMetadata } from "./lib/identity.mjs";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  ...identityMetadata,
  metadataBase: new URL("https://moelshrief.com"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "iXPA5xl53ap3PhR1brPZJq85vi_pymagfuMIjM6UGv4",
    other: {
      "msvalidate.01": "44B5935483C99385F66FF3FE1439CC64",
    },
  },
};

// Dark is the default; only an explicitly stored light preference opts out.
const themeInitScript = `try{document.documentElement.classList.toggle("dark",localStorage.getItem("theme")!=="light")}catch{}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={GeistSans.className}>
        <SpeedInsights />
        <Analytics />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
