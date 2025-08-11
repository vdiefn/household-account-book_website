import pluginJs from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import { defineConfig } from "eslint/config"

import pluginPrettier from "eslint-plugin-prettier"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: { globals: globals.browser },
    plugins: { prettier: pluginPrettier },
  },
  pluginJs.configs.recommended,
  //TS規則
  tseslint.configs.recommended,
  //VUE規則
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      "no-var": "error",
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      "no-unexpected-multiline": "error",
      "no-useless-escape": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/prefer-ts-expect-error": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/semi": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-mutating-props": "off",
      "vue/attribute-hyphenation": "off",
      "prettier/prettier": "warn",
    },
  },
])
