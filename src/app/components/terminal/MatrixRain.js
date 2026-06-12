"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext("2d");
    const fontSize = 12;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);
    const glyphs = "アイウエオカキクケコサシスセソ0123456789$#@*+-";
    let raf;

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fbbf24";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        drops[i] =
          drops[i] * fontSize > canvas.height && Math.random() > 0.975
            ? 0
            : drops[i] + 1;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const stop = () => onDone();
    const timer = setTimeout(stop, 4000);
    window.addEventListener("keydown", stop, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("keydown", stop);
    };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onDone}
      className="absolute inset-0 z-10 rounded-lg"
      aria-hidden="true"
    />
  );
}
