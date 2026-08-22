"use client";
import React from "react";

export default function LoadingProgress({
  progress = 0,
  indeterminate = false,
  className = "",
  message = "Loading...",
  ...props
}) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 w-full max-w-xs px-4 ${className}`}
      role="progressbar"
      aria-busy="true"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clampedProgress}
      aria-label={message}
      {...props}
    >
      <div className="relative w-full h-2 rounded-full bg-stone-300/30 dark:bg-stone-700/40 overflow-hidden backdrop-blur-sm border border-white/10">
        {indeterminate ? (
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full animate-pulse motion-reduce:animate-none left-0 transition-all" />
        ) : (
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            style={{ width: `${clampedProgress}%` }}
          />
        )}
      </div>

      <div className="flex justify-between items-center w-full font-mono text-xs text-stone-600 dark:text-stone-300">
        <span className="truncate pr-2">{message}</span>
        {!indeterminate && (
          <span className="font-semibold text-amber-600 dark:text-amber-400 shrink-0">
            {clampedProgress}%
          </span>
        )}
      </div>
    </div>
  );
}
