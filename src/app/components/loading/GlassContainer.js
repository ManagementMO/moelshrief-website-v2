"use client";
import React from "react";

export default function GlassContainer({
  children,
  className = "",
  blurIntensity = 12,
  opacity = 0.1,
  ...props
}) {
  return (
    <div
      className={`relative rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-md transition-all duration-300 overflow-hidden ${className}`}
      style={{
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px)`,
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.37),
          inset 0 0 0 1px rgba(255, 255, 255, 0.15)
        `,
      }}
      {...props}
    >
      {/* Light reflection highlight overlay */}
      <div
        className="pointer-events-none absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60 transform -rotate-45"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
