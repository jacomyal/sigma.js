import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/*.js",
      // Built files
      "**/dist/*",
      "**/build/*",
      "**/node_modules/*",
      // Doc and examples
      "**/storybook-static/*",
      "**/typedoc",
      "**/.docusaurus",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "prettier",
    "plugin:storybook/recommended",
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
      },

      parser: tsParser,
    },

    rules: {
      "no-undef": "error",
      "no-prototype-builtins": "off",
      "no-console": "warn",

      "import/extensions": [
        "warn",
        "never",
        {
          json: "always",
          glsl: "always",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/dist/*.d.ts", "**/dist/**/*.d.ts", "**/dist/*.d.mts", "**/dist/**/*.d.mts"],

    rules: {
      "import/extensions": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
