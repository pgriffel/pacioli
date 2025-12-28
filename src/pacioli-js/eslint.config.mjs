// @ts-check

import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "src/linear-algebra",
    "test",
    "dist",
    "esbuild.js",
    "esbundle.js",
    "*.js",
  ]),
  {
    // ignores: ["test/**", "src/linear-algebra/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-import-type-side-effects": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
  },
]);
