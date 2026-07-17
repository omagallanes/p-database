---
source: Context7 API + Next.js & TypeScript ESLint Official Docs
library: Next.js + TypeScript ESLint
topic: Best Practices for ESLint in Next.js 14+ TypeScript Projects
fetched: 2026-07-14T10:30:00Z
official_docs: https://nextjs.org/docs/app/api-reference/config/eslint
---

# Best Practices: ESLint in Next.js 14+ TypeScript Projects

## Recommended Setup (Flat Config)

### Complete TypeScript Next.js Config

This is the recommended configuration for Next.js 14+ TypeScript projects using ESLint flat config:

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

### With Enhanced TypeScript Rules (Typed Linting)

If you want full type-aware linting on top of Next.js config:

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import tseslint from 'typescript-eslint'

const eslintConfig = defineConfig([
  ...nextVitals,
  // Add type-aware TypeScript rules on TS/TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    // Override any Next.js TS rules if needed
    rules: {
      // Custom overrides go here
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

## Key Best Practices

### 1. Always Use `core-web-vitals`

The `core-web-vitals` config upgrades important rules from warnings to errors, catching performance issues early.

### 2. Use TypeScript Config for TS Projects

Always add `eslint-config-next/typescript` or manually configure `typescript-eslint` for proper TypeScript linting.

### 3. Disable Base ESLint Rules Replaced by TypeScript

When using `typescript-eslint`, disable these base ESLint rules:
- `no-unused-vars` → use `@typescript-eslint/no-unused-vars`
- `no-array-constructor` → use `@typescript-eslint/no-array-constructor`
- `no-implied-eval` → use `@typescript-eslint/no-implied-eval`
- `no-loss-of-precision` → use `@typescript-eslint/no-loss-of-precision`
- `require-await` → use `@typescript-eslint/require-await`
- `no-return-await` → use `@typescript-eslint/return-await`
- `no-throw-literal` → use `@typescript-eslint/only-throw-error`

These are automatically handled by `tseslint.configs.recommended`.

### 4. Added Strictness Considerations

For teams comfortable with TypeScript, consider upgrading from `recommended` to `strict` configs. This adds rules like:
- `@typescript-eslint/no-explicit-any` — prevents `any` type usage
- `@typescript-eslint/no-non-null-assertion` — prevents `!` assertions
- `@typescript-eslint/no-unnecessary-condition` — prevents unnecessary conditional checks

For type-aware strictness, use `strict-type-checked` instead of `recommended-type-checked`.

### 5. Configure `no-unused-vars` Properly

```js
rules: {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'all',
      argsIgnorePattern: '^_',
      caughtErrors: 'all',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    },
  ],
}
```

### 6. Add Prettier for Formatting

ESLint should handle code quality rules; Prettier should handle formatting. Use `eslint-config-prettier` to disable conflicting formatting rules:

```js
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([/* ... */]),
])
```

### 7. Use lint-staged for Pre-Commit Hooks

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

### 8. Ignore Build Artifacts

Always ignore these directories:
- `.next/**`
- `out/**`
- `build/**`
- `next-env.d.ts`
- `node_modules/**`

### 9. Migration Path from Legacy .eslintrc

If migrating from legacy `.eslintrc` to flat config:

```js
// Option 1: Use FlatCompat bridge (temporary)
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'] },
]

// Option 2: Native flat config (recommended for new projects)
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
```

### 10. Next.js 16 Migration Notes

- `next lint` was removed — use `npx eslint .` directly
- The `eslint` option in `next.config.js` is no longer needed
- A codemod is available: `npx @next/codemod@latest next-lint-to-eslint-cli`
- ESLint Flat Config is the default format
