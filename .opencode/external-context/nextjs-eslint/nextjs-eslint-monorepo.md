---
source: Next.js Official Docs + TypeScript ESLint Official Docs
library: Next.js + TypeScript ESLint
topic: ESLint Configuration for Monorepo/Next.js Projects
fetched: 2026-07-14T10:30:00Z
official_docs: https://nextjs.org/docs/app/api-reference/config/eslint
---

# ESLint in Monorepo/Next.js Projects

## Configuring Next.js rootDir in a Monorepo

If Next.js isn't installed in your root directory (common in monorepos), set the `rootDir` setting in `@next/eslint-plugin-next`:

### Using eslint-config-next (Recommended)

When using the full `eslint-config-next` package in a monorepo, you can't easily set `rootDir` because the config is pre-packaged. Instead, use `@next/eslint-plugin-next` directly:

```js
// eslint.config.mjs
import { defineConfig } from 'eslint/config'
import eslintNextPlugin from '@next/eslint-plugin-next'

const eslintConfig = defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': eslintNextPlugin,
    },
    settings: {
      next: {
        rootDir: 'packages/my-app/',  // Path to your Next.js app
      },
    },
    rules: {
      ...eslintNextPlugin.configs.recommended.rules,
    },
  },
])

export default eslintConfig
```

The `rootDir` can be:
- A relative or absolute path: `'packages/my-app/'`
- A glob pattern: `'packages/*/'`
- An array of paths/globs: `['packages/app1/', 'packages/app2/']`

### Alternative: eslint-config-next with root package.json

If your Next.js app can be detected automatically (i.e., `next` is in the root `package.json`), the default `eslint-config-next` may work without explicit `rootDir`.

## TypeScript ESLint in Monorepos

### Using Project Service (Recommended — v8+)

The `projectService` option (typescript-eslint v8+) requires no additional configuration for monorepos. It automatically detects and uses the correct TSConfig for each file.

```js
// eslint.config.mjs (root)
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,  // No extra config needed for monorepos
    },
  },
});
```

### Using project Array (Alternative)

If you need explicit control over which TSConfigs are loaded:

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
        },
      },
    },
  ],
});
```

### Single Root tsconfig.json

If your monorepo uses a single root `tsconfig.json` whose `include` paths cover all files to lint:

```js
parserOptions: {
  project: ['./tsconfig.json'],
}
```

If not, create a `tsconfig.eslint.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["packages/*/src", "packages/*/test"]
}
```

Then reference it:

```js
parserOptions: {
  project: ['./tsconfig.eslint.json'],
}
```

## Performance Optimization for Monorepos

### Use Specific Project Paths

Instead of wide globs like `./**/tsconfig.json`, use specific paths:

```js
// Less performant:
project: ['./**/tsconfig.json'],

// More performant:
project: ['./packages/*/tsconfig.json'],
```

### Ignore Non-Lintable Directories

```js
export default defineConfig(
  { ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'] },
  // ...
);
```

## Monorepo ESLint File Organization

### Option 1: Root-Level Config (Recommended for Most Projects)

A single `eslint.config.mjs` at the root that covers all packages:

```
├── eslint.config.mjs       # Single config for all packages
├── packages/
│   ├── app/                # Next.js app
│   ├── ui/                 # Shared UI library
│   └── utils/              # Shared utilities
```

### Option 2: Per-Package Config

For complex monorepos with different linting needs per package, create root and per-package configs:

```
├── eslint.config.mjs       # Root config (shared rules)
├── packages/
│   ├── app/
│   │   └── eslint.config.mjs   # Next.js-specific rules
│   ├── api/
│   │   └── eslint.config.mjs   # Node.js-specific rules
```

### Option 3: Using eslint-plugin-import with Monorepo Settings

```js
settings: {
  'import/resolver': {
    typescript: true,
    node: true,
  },
  'import/internal-regex': '^@scope/',  // Treat @scope/* packages as internal
  'import/external-module-folders': ['node_modules', '.yarn'],
}
```

## Putting It All Together: Full Monorepo Config

```js
// eslint.config.mjs (root of monorepo)
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import eslintNextPlugin from '@next/eslint-plugin-next'

export default defineConfig(
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
    ],
  },

  // Base TypeScript rules (all packages)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
    ],
  },

  // Type-checked rules (TS only)
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },

  // Next.js app-specific config
  {
    files: ['packages/web/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': eslintNextPlugin,
    },
    settings: {
      next: {
        rootDir: 'packages/web',
      },
    },
    rules: {
      ...eslintNextPlugin.configs.recommended.rules,
    },
  },

  // Disable type-checked linting on JS files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
)
```
