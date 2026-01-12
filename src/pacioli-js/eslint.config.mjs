import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";

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
      "unicorn/prevent-abbreviations": "off",
      "unicorn/throw-new-error": "off",
      "unicorn/new-for-builtins": "off",
      "unicorn/prefer-type-error": "warn",
      "unicorn/catch-error-name": "off",
      "unicorn/prefer-dom-node-append": "off",

      // tijdelijk uit
      "unicorn/no-null": "off",
      "unicorn/prefer-query-selector": "off",
      "unicorn/no-negated-condition": "off",
      "unicorn/prefer-dom-node-text-content": "off",
      "unicorn/prefer-spread": "off",
      "unicorn/no-array-callback-reference": "off",
      "seleunicorn/prefer-ternarytor": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/prefer-type-error": "off",
      "unicorn/prefer-switch": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/no-new-array": "off",
      "unicorn/prefer-includes": "off",
      "unicorn/switch-case-braces": "off",
      "unicorn/prefer-single-call": "off",
      "unicorn/no-immediate-mutation": "off",
      "unicorn/explicit-length-check": "off",
      "unicorn/no-lonely-if": "off",
      "unicorn/prefer-single-call": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/prefer-set-has": "off",
      "unicorn/prefer-dom-node-remove": "off",
      "unicorn/prefer-number-properties": "off",
      "unicorn/prefer-optional-catch-binding": "off",
      "unicorn/no-array-sort": "off",
      "unicorn/no-array-reverse": "off",
      "unicorn/no-zero-fractions": "off",
      "unicorn/no-instanceof-builtins": "off",
      "unicorn/no-hex-escape": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/numeric-separators-style": "off",
      "unicorn/no-unreadable-array-destructuring": "off",
      "unicorn/number-literal-case": "off",
      "unicorn/numeric-separators-style": "off",
      "unicorn/prefer-modern-math-apis": "off",
      "unicorn/require-number-to-fixed-digits-argument": "off",
      "unicorn/prefer-math-trunc": "off",
      "unicorn/prefer-optional-catch-binding": "off",
      "unicorn/prefer-number-properties": "off",
      "unicorn/no-useless-undefined": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },

    rules: {
      // tijdelijk uit
      "@typescript-eslint/no-for-in-array": "off",
      "@typescript-eslint/no-deprecated": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",

      // permanent
      // "@typescript-eslint/strict-boolean-expressions": "error",
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
