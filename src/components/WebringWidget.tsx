import React from "react";

export type WebringWidgetProps = {
  /**
   * The member identifier/slug used by the webring you’re participating in.
   *
   * NOTE: Replace the placeholder value in App.tsx with your real slug.
   */
  memberSlug: string;
  /** Optional additional classes for positioning/styling overrides. */
  className?: string;
};

/**
 * Minimal placeholder widget to prevent build failures.
 *
 * If you have a real webring script/embed, you can replace this component
 * with your actual implementation.
 */
export default function WebringWidget({ memberSlug, className }: WebringWidgetProps) {
  return (
    <div
      className={
        "fixed bottom-4 right-4 z-50 select-none rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/80 backdrop-blur " +
        (className ?? "")
      }
      aria-label="Webring widget"
    >
      <div className="font-medium text-white/90">Webring</div>
      <div className="text-white/70">Member: {memberSlug}</div>
    </div>
  );
}
