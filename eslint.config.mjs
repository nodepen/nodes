import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
  {
    ignores: [
        "**/*.js",
        "**/*.json",
        "**/*.spec.ts",
        "**/build",
        "**/dist",
        "**/node_modules",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ),
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
    },
    languageOptions: {
        globals: {
            ...globals.node,
        },
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "commonjs",
        parserOptions: {
            tsconfigRootDir: "D:\\src\\github.com\\nodepen\\nodes",
            project: [
                "./apps/nodepen-client/tsconfig.json",
                "./packages/core/tsconfig.json",
                "./packages/nodes/tsconfig.json",
            ],
        },
    },
    rules: {
        "prettier/prettier": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/explicit-module-boundary-types": [0],
        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
        }],
    },
  },
];