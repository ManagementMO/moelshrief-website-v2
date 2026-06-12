/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        slTrain: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-110%)" },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 2.4s ease-in-out infinite",
        "cursor-blink": "blink 1.06s steps(1) infinite",
        "sl-train": "slTrain 3.5s linear forwards",
      },
      fontSize: {
        micro: "0.625rem",
      },
      fontFamily: {
        handwriting: ["var(--font-handwriting)", "cursive"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
