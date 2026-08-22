"use client";
import React from "react";

export default function LoadingAnimation({ className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center w-24 h-24 ${className}`}
      aria-hidden="true"
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-amber-500/20 dark:bg-amber-400/20 blur-xl animate-pulse motion-reduce:animate-none" />

      {/* Glass spinner outer ring */}
      <svg
        className="w-full h-full animate-spin motion-reduce:animate-none text-amber-500 dark:text-amber-400"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="6"
        />
        <path
          d="M50 8 A 42 42 0 0 1 92 50"
          stroke="url(#amber-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner glowing pulse core */}
      <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 dark:from-amber-400 dark:to-amber-200 opacity-80 blur-xs animate-ping motion-reduce:animate-none" />
      <div className="absolute w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
    </div>
  );
}
