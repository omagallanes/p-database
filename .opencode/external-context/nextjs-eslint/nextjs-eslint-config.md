---
source: Context7 API + Next.js Official Docs
library: Next.js
package: eslint-config-next
topic: ESLint Configuration for Next.js
fetched: 2026-07-14T10:30:00Z
verified_updated: 2026-07-14T12:00:00Z
official_docs: https://nextjs.org/docs/app/api-reference/config/eslint
---

# Next.js ESLint Plugin & Configuration

## Overview

Next.js provides an ESLint configuration package, `eslint-config-next`, that makes it easy to catch common issues in your application. It includes the `@next/eslint-plugin-next` plugin along with recommended rule-sets from `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`, and `eslint-plugin-jsx-a11y`.

The package provides multiple configurations:

- **`eslint-config-next`**: Base configuration with Next.js, React, and React Hooks rules. Supports both JavaScript and TypeScript files.
- **`eslint-config-next/core-web-vitals`**: Includes everything from the base config, plus upgrades rules that impact Core Web Vitals from warnings to errors. **Recommended for most projects.**
- **`eslint-config-next/typescript`**: Adds TypeScript-specific linting rules from `typescript-eslint`. Use alongside the base or core-web-vitals config.

## Setup (Flat Config — ESLint 9+)

Starting with Next.js 16, `next lint` is removed. Use the ESLint CLI directly.

### Step 1: Install Dependencies

```bash
pnpm add -D eslint eslint-config-next
# or
npm i -D eslint eslint-config-next
# or
yarn add --dev eslint eslint-config-next
# or
bun add -d eslint eslint-config-next
```

### Step 2: Create `eslint.config.mjs`

**Minimal setup (core-web-vitals):**

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

### Step 3: Run ESLint

```bash
pnpm exec eslint .
# or
npx eslint .
# or
yarn eslint .
# or
bunx eslint .
```

## With TypeScript

For TypeScript projects, add the TypeScript config:

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

These TypeScript rules are based on `plugin:@typescript-eslint/recommended`.

## With Prettier

Install `eslint-config-prettier` to avoid conflicts between ESLint and Prettier:

```bash
pnpm add -D eslint-config-prettier
```

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

## Disabling Rules

```js
const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])
```

## Using the Plugin Directly

If you have conflicting plugins (airbnb, react-app) or custom parserOptions, use `@next/eslint-plugin-next` directly:

```bash
pnpm add -D @next/eslint-plugin-next
```

```js
import { defineConfig } from 'eslint/config'
import nextPlugin from '@next/eslint-plugin-next'

const eslintConfig = defineConfig([
  // Your other configurations...
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
])

export default eslintConfig
```

## Adding to Existing Config

```js
import nextConfig from 'eslint-config-next/core-web-vitals'
// Your other config imports...

const eslintConfig = [
  // Your other configurations...
  ...nextConfig,
]

export default eslintConfig
```

## Internal Structure of eslint-config-next

> **Note:** The internal structure shown below may reflect an older version of `eslint-config-next`. Current official docs (Next.js 16) only list `@next/eslint-plugin-next`, `eslint-plugin-react`, and `eslint-plugin-react-hooks` in the recommended config. `eslint-plugin-import` and `eslint-plugin-jsx-a11y` are no longer included.

The package exports flat config arrays with these components:

```typescript
import type { Linter } from 'eslint'
import next from '@next/eslint-plugin-next'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tsEslint from 'typescript-eslint'
import * as importPlugin from 'eslint-plugin-import'
import * as jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import globals from 'globals'
import eslintParser from './parser'

const config: Linter.Config[] = [
  {
    name: 'next',
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': next,
    },
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: 'module',
        allowImportExportEverywhere: true,
        babelOptions: {
          presets: ['next/babel'],
          caller: { supportsTopLevelAwait: true },
        },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
    },
  },
  {
    name: 'next/typescript',
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tsEslint.plugin },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: { sourceType: 'module' },
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
]
```

## `@next/eslint-plugin-next` Rules

| Rule | Description |
|------|-------------|
| `@next/next/google-font-display` | Enforce font-display behavior with Google Fonts |
| `@next/next/google-font-preconnect` | Ensure preconnect is used with Google Fonts |
| `@next/next/inline-script-id` | Enforce id attribute on next/script components with inline content |
| `@next/next/next-script-for-ga` | Prefer next/script component for Google Analytics |
| `@next/next/no-assign-module-variable` | Prevent assignment to the module variable |
| `@next/next/no-async-client-component` | Prevent Client Components from being async functions |
| `@next/next/no-before-interactive-script-outside-document` | Prevent beforeInteractive outside pages/_document.js |
| `@next/next/no-css-tags` | Prevent manual stylesheet tags |
| `@next/next/no-document-import-in-page` | Prevent importing next/document outside pages/_document.js |
| `@next/next/no-duplicate-head` | Prevent duplicate Head in pages/_document.js |
| `@next/next/no-head-element` | Prevent usage of <head> element |
| `@next/next/no-head-import-in-document` | Prevent usage of next/head in pages/_document.js |
| `@next/next/no-html-link-for-pages` | Prevent <a> for internal navigation |
| `@next/next/no-img-element` | Prevent <img> (use next/image instead) |
| `@next/next/no-page-custom-font` | Prevent page-only custom fonts |
| `@next/next/no-script-component-in-head` | Prevent next/script in next/head component |
| `@next/next/no-styled-jsx-in-document` | Prevent styled-jsx in pages/_document.js |
| `@next/next/no-sync-scripts` | Prevent synchronous scripts |
| `@next/next/no-title-in-document-head` | Prevent <title> with Head from next/document |
| `@next/next/no-typos` | Prevent typos in Next.js data fetching functions |
| `@next/next/no-unwanted-polyfillio` | Prevent duplicate polyfills from Polyfill.io |

## Running Lint on Staged Files (lint-staged)

```js
// .lintstagedrc.js
const path = require('path')

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

## Migration Notes (Next.js 16)

- `next lint` was removed starting with Next.js 16 — use ESLint CLI directly
- The `eslint` option in `next.config.js` is no longer needed
- A codemod (`npx @next/codemod@latest migrate-eslint-cli`) is available to help migrate
- ESLint Flat Config is now the default format
