/**
 * Design Tokens — moelshrief.wiki
 *
 * Single source of truth for all design decisions in this portfolio.
 * These tokens mirror the CSS custom properties defined in `src/index.css`
 * and the Tailwind theme in `tailwind.config.ts`.
 *
 * Usage
 * -----
 * Import in components for runtime values (e.g. Three.js materials, canvas
 * drawing, framer-motion variants) where Tailwind classes cannot reach.
 *
 *   import { tokens } from '@/tokens/design-tokens';
 *   const color = tokens.color.accent.DEFAULT;  // '#0d9488'
 */

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

export const colorTokens = {
  /** Teal-based brand accent — maps to --color-accent and the primary HSL vars
   *  Hex values are manually synced to Tailwind CSS defaults (v3).
   *  If you upgrade Tailwind, verify these against the generated palette:
   *  `npx tailwindcss --help` or https://tailwindcss.com/docs/customizing-colors
   */
  accent: {
    DEFAULT: "#0d9488",   // teal-600
    light: "#ccfbf1",     // teal-100  (light selection bg)
    dark: "#0d4f47",      // teal-900  (dark selection bg)
    foreground: "#ffffff",
  },

  /** Neutral stone palette used throughout the UI */
  stone: {
    50:  "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09",
  },

  /** Semantic surface tokens (light / dark) */
  surface: {
    light: {
      background: "#fafaf9",
      card: "#ffffff",
      muted: "#f5f5f4",
    },
    dark: {
      background: "#0c0a09",
      card: "#1c1917",
      muted: "#292524",
    },
  },

  /** Text tokens */
  text: {
    light: {
      primary: "#292524",   // stone-800
      secondary: "#78716c", // stone-500
      muted: "#a8a29e",     // stone-400
    },
    dark: {
      primary: "#e7e5e4",   // stone-200
      secondary: "#a8a29e", // stone-400
      muted: "#78716c",     // stone-500
    },
  },

  /** Border tokens */
  border: {
    light: "#e7e5e4",  // stone-200
    dark:  "#44403c",  // stone-700
  },
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typographyTokens = {
  fontFamily: {
    sans:  '"Inter", sans-serif',
    serif: '"Lora", Georgia, serif',
    mono:  '"JetBrains Mono", "Fira Code", monospace',
  },

  /** Modular type scale (rem) */
  fontSize: {
    "2xs": "0.6875rem",  // 11px  — micro labels / tags
    xs:    "0.75rem",    // 12px
    sm:    "0.875rem",   // 14px
    base:  "1rem",       // 16px
    lg:    "1.125rem",   // 18px
    xl:    "1.25rem",    // 20px
    "2xl": "1.5rem",     // 24px
    "3xl": "1.875rem",   // 30px
    "4xl": "2.25rem",    // 36px
    "5xl": "3rem",       // 48px
  },

  fontWeight: {
    light:    300,
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },

  lineHeight: {
    tight:   1.25,
    snug:    1.375,
    normal:  1.5,
    relaxed: 1.625,
    loose:   2,
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight:   "-0.025em",
    normal:  "0em",
    wide:    "0.025em",
    wider:   "0.05em",
    widest:  "0.1em",
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing / Layout
// ---------------------------------------------------------------------------

export const spacingTokens = {
  /** Base 4px grid */
  grid: 4,

  /** Section max-width (mirrors .section-container) */
  sectionMaxWidth: "560px",

  /** Page content gutter */
  gutter: {
    mobile: "1.5rem",  // px-6
    tablet: "2rem",
    desktop: "0rem",   // md:px-0 with maxWidth container
  },

  /** Common gap values for flex/grid */
  gap: {
    xs:  "0.25rem",   // gap-1
    sm:  "0.5rem",    // gap-2
    md:  "1rem",      // gap-4
    lg:  "1.5rem",    // gap-6
    xl:  "2rem",      // gap-8
    "2xl": "3rem",    // gap-12
  },
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------

export const radiusTokens = {
  none: "0",
  sm:   "calc(0.5rem - 4px)",  // --radius - 4px
  md:   "calc(0.5rem - 2px)",  // --radius - 2px
  lg:   "0.5rem",              // --radius
  xl:   "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

// ---------------------------------------------------------------------------
// Shadows / Elevation
// ---------------------------------------------------------------------------

export const shadowTokens = {
  none: "none",
  sm:   "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md:   "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg:   "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  glow: "0 0 20px rgba(13, 148, 136, 0.25)",  // teal accent glow
} as const;

// ---------------------------------------------------------------------------
// Motion / Animation
// ---------------------------------------------------------------------------

export const motionTokens = {
  duration: {
    instant: 0,
    fast:    150,  // ms
    normal:  300,
    slow:    500,
    xslow:   700,
  },

  easing: {
    linear:     "linear",
    easeIn:     "cubic-bezier(0.4, 0, 1, 1)",
    easeOut:    "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut:  "cubic-bezier(0.4, 0, 0.2, 1)",
    spring:     "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  /** Framer Motion preset variants (import and spread directly) */
  variants: {
    fadeInUp: {
      hidden:  { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    },
    fadeIn: {
      hidden:  { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Breakpoints (matches Tailwind defaults)
// ---------------------------------------------------------------------------

export const breakpointTokens = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  "2xl": 1400,
} as const;

// ---------------------------------------------------------------------------
// Z-index scale
// ---------------------------------------------------------------------------

export const zIndexTokens = {
  base:    0,
  raised:  10,
  overlay: 20,
  drawer:  30,
  modal:   40,
  toast:   50,
  tooltip: 60,
} as const;

// ---------------------------------------------------------------------------
// Aggregated export
// ---------------------------------------------------------------------------

export const tokens = {
  color:      colorTokens,
  typography: typographyTokens,
  spacing:    spacingTokens,
  radius:     radiusTokens,
  shadow:     shadowTokens,
  motion:     motionTokens,
  breakpoint: breakpointTokens,
  zIndex:     zIndexTokens,
} as const;

export type Tokens = typeof tokens;
