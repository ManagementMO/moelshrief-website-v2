"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EnterToProjects() {
  const router = useRouter();

  useEffect(() => {
    const isTypingTarget = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const handleEnter = (e) => {
      if (e.key !== "Enter") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      // skip while typing in any input (terminal, etc.)
      if (isTypingTarget(e.target)) return;
      // skip when focus is on a real interactive element so its default
      // Enter behavior (follow link, click button) wins
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "A" ||
          active.tagName === "BUTTON" ||
          active.getAttribute("role") === "button")
      )
        return;
      e.preventDefault();
      router.push("/projects");
    };

    document.addEventListener("keydown", handleEnter);
    return () => document.removeEventListener("keydown", handleEnter);
  }, [router]);

  return null;
}
