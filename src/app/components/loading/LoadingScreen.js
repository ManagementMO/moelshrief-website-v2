"use client";
import React, { useState, useEffect } from "react";
import GlassContainer from "./GlassContainer";
import LoadingProgress from "./LoadingProgress";
import LoadingAnimation from "./LoadingAnimation";

export default function LoadingScreen({
  progress: customProgress,
  isVisible = true,
  onLoadingComplete,
  message = "Initializing environment...",
  logo,
  customAnimation,
  hasError = false,
  errorMessage = "Failed to load application.",
  onRetry,
}) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [isRendered, setIsRendered] = useState(isVisible);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Auto-increment progress if not controlled externally
  useEffect(() => {
    if (customProgress !== undefined) return;
    if (hasError) return;

    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.floor(Math.random() * 25) + 15;
        return Math.min(100, prev + diff);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [customProgress, hasError]);

  const currentProgress =
    customProgress !== undefined ? customProgress : internalProgress;

  useEffect(() => {
    if (currentProgress >= 100 && isVisible) {
      const timeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentProgress, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setIsFadingOut(true);
    } else {
      setIsRendered(true);
      setIsFadingOut(false);
    }
  }, [isVisible]);

  const handleTransitionEnd = () => {
    if (isFadingOut) {
      setIsRendered(false);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }
  };

  if (!isRendered) return null;

  return (
    <div
      role="region"
      aria-label="Loading application"
      aria-live="polite"
      onTransitionEnd={handleTransitionEnd}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-lg transition-opacity duration-500 ease-in-out p-4 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <GlassContainer className="flex flex-col items-center justify-center p-8 sm:p-10 w-full max-w-md mx-auto min-h-[320px] text-center">
        {logo ? (
          <div className="mb-6">{logo}</div>
        ) : (
          <div className="mb-6 font-mono text-sm tracking-widest uppercase text-amber-500 dark:text-amber-400 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping motion-reduce:animate-none" />
            mohammed elshrief
          </div>
        )}

        {hasError ? (
          <div className="flex flex-col items-center gap-4 my-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xl font-bold border border-red-500/30">
              !
            </div>
            <p className="font-mono text-sm text-red-400">{errorMessage}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 px-4 py-2 rounded-lg font-mono text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="my-6">
              {customAnimation || <LoadingAnimation />}
            </div>

            <LoadingProgress
              progress={currentProgress}
              message={message}
              indeterminate={customProgress === undefined && currentProgress === 0}
            />
          </>
        )}
      </GlassContainer>
    </div>
  );
}
