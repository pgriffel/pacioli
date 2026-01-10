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
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },

    rules: {
      "@typescript-eslint/strict-boolean-expressions": "error",
      eqeqeq: "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
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
    extends: [eslint.configs.recommended, tseslint.configs.strictTypeChecked],
  },
]);
