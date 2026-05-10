import { useEffect, type CSSProperties } from "react";

export type WebringWidgetProps = {
  memberSlug: string;
  className?: string;
};

export default function WebringWidget({ memberSlug, className }: WebringWidgetProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://webring.ca/embed.js"]',
    );

    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://webring.ca/embed.js";
    script.defer = true;
    script.setAttribute("data-webring-script", "ca");
    document.body.appendChild(script);
  }, []);

  const webringUrl = "https://webring.ca";

  return (
    <aside
      className={
        "fixed bottom-4 right-4 z-50 rounded-xl border border-cyan-400/30 bg-slate-950/75 px-4 py-3 text-xs text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.2)] backdrop-blur-md " +
        (className ?? "")
      }
      aria-label="Canadian webring navigation"
    >
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
        Canadian Webring
      </p>
      <div
        data-webring="ca"
        data-member={memberSlug}
        style={
          {
            "--webring-size": "1rem",
            "--webring-color": "#cffafe",
            "--webring-accent": "#22d3ee",
          } as CSSProperties
        }
        className="flex min-h-6 items-center justify-center gap-3"
      >
        <a href={`${webringUrl}/prev/${memberSlug}`} aria-label="Previous site in Canadian webring">
          ←
        </a>
        <a href={webringUrl} aria-label="Visit the Canadian webring home">
          🍁
        </a>
        <a href={`${webringUrl}/next/${memberSlug}`} aria-label="Next site in Canadian webring">
          →
        </a>
      </div>
    </aside>
  );
}
