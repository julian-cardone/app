import eslint from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules/", ".expo/", "dist/", "build/", "coverage/", "ios/", "android/"],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "simple-import-sort": simpleImportSortPlugin,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],

      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Side effect imports.
            ["^\\u0000"],

            // React, React Native, and Expo.
            ["^react$", "^react-native$", "^expo", "^@expo"],

            // Third-party packages.
            ["^@?\\w"],

            // App absolute imports.
            ["^@/"],

            // Parent imports.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],

            // Same-folder imports.
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ],
        },
      ],

      "simple-import-sort/exports": "error",
      "no-duplicate-imports": "error",
    },
  },

  {
    files: ["*.config.{js,cjs}", "babel.config.js"],
    languageOptions: {
      globals: { ...globals.node, ...globals.commonjs },
    },
  },
);
