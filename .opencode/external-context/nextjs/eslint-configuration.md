---
source: Context7 API + official docs
library: Next.js
package: eslint-config-next
topic: ESLint configuration for Next.js 14+ TypeScript projects
fetched: 2026-07-14T12:00:00Z
official_docs: https://nextjs.org/docs/app/api-reference/config/eslint
tech_stack: Next.js 14+ / 15.x / 16.x, TypeScript
---

# Next.js ESLint Configuration

> Current as of Next.js v16.2.10 (July 2026). Covers flat config (ESLint 9+), legacy `.eslintrc`, TypeScript integration, and migration from `next lint`.

## Overview

Next.js provides an ESLint configuration package, [`eslint-config-next`](https://www.npmjs.com/package/eslint-config-next), that makes it easy to catch common issues. It includes the `@next/eslint-plugin-next` plugin along with recommended rule-sets from `eslint-plugin-react` and `eslint-plugin-react-hooks`.

**Important**: Starting with Next.js 16, `next lint` is **removed**. Use the ESLint CLI directly.

## Available Configurations

| Config | Description |
|--------|-------------|
| `eslint-config-next` | Base config with Next.js, React, and React Hooks rules. Supports JS and TS. |
| `eslint-config-next/core-web-vitals` | Base + upgrades Core Web Vitals rules from warnings to errors. **Recommended** for most projects. |
| `eslint-config-next/typescript` | TypeScript-specific linting rules from `typescript-eslint` (based on `plugin:@typescript-eslint/recommended`). Use alongside base or core-web-vitals. |

## Setup (Flat Config — Recommended for ESLint 9+)

### Step 1: Install

```bash
npm i -D eslint eslint-config-next
# or
pnpm add -D eslint eslint-config-next
# or
yarn add --dev eslint eslint-config-next
```

### Step 2: Create `eslint.config.mjs`

**With Core Web Vitals (recommended):**

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

**With TypeScript (adds `eslint-config-next/typescript`):**

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next
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
npx eslint .
# or
pnpm exec eslint .
# or
yarn eslint .
```

## Migration from `next lint` (Next.js 16+)

Next.js 16 removed `next lint` and the `eslint` option in `next.config.js`. A codemod is available:

```bash
npx @next/codemod@latest migrate-eslint-cli
```

This generates an `eslint.config.mjs` using the old `FlatCompat` approach:

```js
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

export default eslintConfig
```

You can also migrate to the native flat config approach (shown above) for a cleaner setup.

## Advanced: Using the Plugin Directly

If you have conflicting plugins (e.g., `airbnb`, `react-app`) or custom `parserOptions`, use `@next/eslint-plugin-next` directly:

```bash
npm i -D @next/eslint-plugin-next
```

```js
import { defineConfig } from 'eslint/config'
import nextPlugin from '@next/eslint-plugin-next'

const eslintConfig = defineConfig([
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

## Disabling Rules

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

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

export default eslintConfig
```

## With Prettier

```bash
npm i -D eslint-config-prettier
```

```js
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

## Monorepo Setup

If Next.js is not in the root directory, set `rootDir`:

```js
import { defineConfig } from 'eslint/config'
import eslintNextPlugin from '@next/eslint-plugin-next'

const eslintConfig = defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      next: eslintNextPlugin,
    },
    settings: {
      next: {
        rootDir: 'packages/my-app/',
      },
    },
  },
])

export default eslintConfig
```

`rootDir` can be a path, a glob (e.g. `"packages/*/"`), or an array of paths/globs.

## Rules Included

The `@next/next` plugin rules covered by the recommended config:

| Rule | Description |
|------|-------------|
| `@next/next/google-font-display` | Enforce font-display behavior with Google Fonts |
| `@next/next/google-font-preconnect` | Ensure `preconnect` is used with Google Fonts |
| `@next/next/inline-script-id` | Enforce `id` attribute on `next/script` with inline content |
| `@next/next/next-script-for-ga` | Prefer `next/script` for Google Analytics |
| `@next/next/no-assign-module-variable` | Prevent assignment to `module` variable |
| `@next/next/no-async-client-component` | Prevent Client Components from being async |
| `@next/next/no-before-interactive-script-outside-document` | Restrict `beforeInteractive` usage |
| `@next/next/no-css-tags` | Prevent manual stylesheet tags |
| `@next/next/no-document-import-in-page` | Restrict `next/document` imports |
| `@next/next/no-duplicate-head` | Prevent duplicate `<Head>` in `_document` |
| `@next/next/no-head-element` | Prevent usage of `<head>` element |
| `@next/next/no-head-import-in-document` | Restrict `next/head` in `_document` |
| `@next/next/no-html-link-for-pages` | Prevent `<a>` for internal navigation |
| `@next/next/no-img-element` | Prefer `next/image` over `<img>` |
| `@next/next/no-page-custom-font` | Prevent page-only custom fonts |
| `@next/next/no-script-component-in-head` | Restrict `next/script` in `next/head` |
| `@next/next/no-styled-jsx-in-document` | Prevent `styled-jsx` in `_document` |
| `@next/next/no-sync-scripts` | Prevent synchronous scripts |
| `@next/next/no-title-in-document-head` | Prevent `<title>` with `Head` from `next/document` |
| `@next/next/no-typos` | Prevent common typos in Next.js data fetching functions |
| `@next/next/no-unwanted-polyfillio` | Prevent duplicate polyfills from Polyfill.io |

## References

- Official docs: https://nextjs.org/docs/app/api-reference/config/eslint
- `eslint-config-next` on npm: https://www.npmjs.com/package/eslint-config-next
- Migration codemod: `npx @next/codemod@latest migrate-eslint-cli`
- typescript-eslint recommended config: https://typescript-eslint.io/users/configs#recommended
