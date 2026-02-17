import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default defineConfig([
  globalIgnores([
    "src/linear-algebra",
    "test",
    "dist",
    "esbuild.js",
    "esbundle.js",
    "*.js",
  ]),
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      "unicorn/no-array-reduce": "off", // meh
      "unicorn/prevent-abbreviations": "off", // meh
      "unicorn/catch-error-name": "off", // meh
      "unicorn/prefer-dom-node-append": "off", // meh
      "unicorn/no-null": "off", // meh
      "unicorn/prefer-query-selector": "off", // meh
      "unicorn/prefer-dom-node-text-content": "off", // TODO: is this better?
      // "unicorn/no-nested-ternary": "off", // TODO: clashes with Prettier. Prefer unicorn's opinion?
      "unicorn/prefer-type-error": "off", // meh
      "unicorn/prefer-ternary": "off", // meh
      "unicorn/prefer-single-call": "off", // Sometimes okay, not always.
      "unicorn/prefer-set-has": "off", // meh
      "unicorn/no-array-sort": "off", // Nice, but browser support for toSorted is only since 2023
      "unicorn/no-array-reverse": "off", // idem?
      "unicorn/no-zero-fractions": "off", // Why?
      "unicorn/numeric-separators-style": "off", // meh
      "unicorn/number-literal-case": "off", // Unicorn prefers 0xFF0000. Prettier prefers 0xff0000.
      "unicorn/require-number-to-fixed-digits-argument": "off", // Flags BigNumber.toFixed() as incorrect, which is incorrect
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      eqeqeq: "error",
      "@typescript-eslint/no-for-in-array": "off",
      "@typescript-eslint/no-deprecated": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/strict-boolean-expressions": "warn",
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
    extends: [eslint.configs.recommended, tseslint.configs.strictTypeChecked],
  },
]);
