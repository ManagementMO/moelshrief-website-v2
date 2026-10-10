"use client";

import dynamic from "next/dynamic";
import Header from "./Header";
import Footer from "./Footer";
import ThemeProvider from "./ThemeProvider";
import Statusline from "./Statusline";
import { identityJsonLd, serializeJsonLd } from "../lib/identity.mjs";

const CommandPalette = dynamic(() => import("./CommandPalette"));

// Theme, navigation, keyboard shortcuts, and the palette already need client
// state. Prerender their shared shell once instead of serializing its static
// chrome a second time through the provider's Server Component children.
export default function SiteShell({ children }) {
  return (
    <ThemeProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(identityJsonLd) }}
      />
      <main className="site-main">
        <div className="site-content">
          <Header />
          {children}
          <Footer />
        </div>
      </main>
      <CommandPalette />
      <Statusline />
    </ThemeProvider>
  );
}
