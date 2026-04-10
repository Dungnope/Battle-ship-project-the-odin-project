import js from "@eslint/js";
import globals from "globals";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  globalIgnores(["**/*.test.js"]), //ignore test fiel
  {
    rules: {
      "no-unused-vars": "warn", // show in CLI when test lint
      "array-callback-return": "warn",
      semi: "warn",
      "no-undef": "warn",
      "no-empty": "off",
    },
  },
]);
