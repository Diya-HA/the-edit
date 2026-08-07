import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Not app code. These sit beside the app now that it lives at the repo
    // root: the design system's generated bundle and screen runtime (both
    // marked do-not-edit at source), the clickable HTML prototypes, and the
    // doc-generation scripts. Linting vendored artefacts only produces noise.
    "design/**",
    "prototypes/**",
    "deck/**",
    "lib/generated/**",
  ]),
]);

export default eslintConfig;
