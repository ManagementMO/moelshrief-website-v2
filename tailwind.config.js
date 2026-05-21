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
      },
      animation: {
        "pulse-dot": "pulseDot 2.4s ease-in-out infinite",
      },
      fontSize: {
        micro: "0.625rem",
      },
      fontFamily: {
        handwriting: ["var(--font-handwriting)", "cursive"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
