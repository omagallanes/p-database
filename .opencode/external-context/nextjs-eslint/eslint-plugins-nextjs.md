---
source: Next.js Official Docs + community
library: Next.js
topic: ESLint Plugins Commonly Used with Next.js
fetched: 2026-07-14T10:30:00Z
official_docs: https://nextjs.org/docs/app/api-reference/config/eslint
---

# ESLint Plugins Commonly Used with Next.js Projects

## Built-in (included via `eslint-config-next`)

The `eslint-config-next` package includes the following plugins automatically:

| Plugin | Purpose |
|--------|---------|
| `@next/eslint-plugin-next` | Next.js-specific rules (image optimization, script loading, etc.) |
| `eslint-plugin-react` | React best practices, JSX rules |
| `eslint-plugin-react-hooks` | React Hooks rules (rules-of-hooks, exhaustive-deps) |
| `eslint-plugin-import` | ES2015+ import/export syntax validation |
| `eslint-plugin-jsx-a11y` | Accessibility rules (alt text, ARIA attributes, etc.) |

These are all configured automatically when you use `eslint-config-next` or `eslint-config-next/core-web-vitals`.

## Recommended Additional Plugins

### eslint-config-prettier

**Purpose**: Disables ESLint formatting rules that conflict with Prettier.

```bash
pnpm add -D eslint-config-prettier
```

```js
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = [
  ...nextVitals,
  prettier,  // Must be last to override other configs
  globalIgnores([/* ... */]),
]
```

### eslint-plugin-boundaries

**Purpose**: Enforce architecture boundaries and dependency rules between modules/layers. Useful for large Next.js projects to prevent circular dependencies and enforce module isolation.

Installation:
```bash
pnpm add -D eslint-plugin-boundaries
```

### eslint-plugin-simple-import-sort (or eslint-plugin-import/order)

**Purpose**: Automatically sort import statements.

```bash
pnpm add -D eslint-plugin-simple-import-sort
```

```js
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off', // Disable if using simple-import-sort
    },
  },
  prettier,
  globalIgnores([/* ... */]),
])
```

### eslint-plugin-tailwindcss

**Purpose**: Enforce Tailwind CSS best practices (class ordering, avoiding conflicts, etc.)

```bash
pnpm add -D eslint-plugin-tailwindcss
```

### eslint-plugin-testing-library / eslint-plugin-jest-dom

**Purpose**: Testing best practices for React Testing Library and Jest DOM assertions.

```bash
pnpm add -D eslint-plugin-testing-library eslint-plugin-jest-dom
```

### eslint-plugin-jest

**Purpose**: Jest testing best practices.

```bash
pnpm add -D eslint-plugin-jest
```

```js
import jestPlugin from 'eslint-plugin-jest'

const eslintConfig = defineConfig(
  // ... main config
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.{spec,test}.{js,jsx,ts,tsx}'],
    extends: [jestPlugin.configs['flat/recommended']],
  },
)
```

## Complete Recommended Plugin Stack

For a production Next.js 14+ TypeScript project, this is the recommended ESLint plugin stack:

```
eslint                       # Core linter
eslint-config-next           # Next.js config (includes react, react-hooks, import, jsx-a11y, @next/next)
typescript-eslint            # TypeScript linting (includes @typescript-eslint/parser + plugin)
eslint-config-prettier       # Disables formatting rules (use Prettier separately)
eslint-plugin-simple-import-sort  # Import sorting (optional)
eslint-plugin-tailwindcss    # Tailwind CSS rules (optional, if using Tailwind)
eslint-plugin-testing-library # Testing rules (optional)
eslint-plugin-jest           # Jest rules (optional)
```

## Integration Example

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import jestPlugin from 'eslint-plugin-jest'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off', // handled by simple-import-sort
    },
  },
  prettier,
  // Jest config for test files
  {
    files: ['**/*.{spec,test}.{js,jsx,ts,tsx}', '**/__tests__/**'],
    extends: [jestPlugin.configs['flat/recommended']],
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
