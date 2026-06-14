import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Every hit is an intentional post-mount sync of a browser-only value
      // (navigator / localStorage / matchMedia) that can't be known during
      // SSR and must setState after hydration. A single mount-time setState is
      // safe and standard here, so this advisory cascading-render rule is off.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**", // Node build tooling — not part of the app lint surface
  ]),
]);

export default eslintConfig;
