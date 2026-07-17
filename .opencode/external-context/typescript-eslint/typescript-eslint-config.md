---
source: typescript-eslint Official Docs
library: TypeScript ESLint
package: typescript-eslint
topic: TypeScript ESLint Configuration & Recommended Rules
fetched: 2026-07-14T10:30:00Z
verified: 2026-07-14T12:00:00Z
official_docs: https://typescript-eslint.io/getting-started/
---

# TypeScript ESLint — Configuration & Recommended Rules

## Quickstart (Flat Config)

### Step 1: Installation

```bash
npm install --save-dev eslint @eslint/js typescript typescript-eslint
# or
yarn add --dev eslint @eslint/js typescript typescript-eslint
# or
pnpm add --save-dev eslint @eslint/js typescript typescript-eslint
```

### Step 2: Create `eslint.config.mjs`

```js
// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [js.configs.recommended, tseslint.configs.recommended],
});
```

- `// @ts-check` enables TypeScript type checking for the config file
- `js.configs.recommended` turns on ESLint's recommended config
- `tseslint.configs.recommended` turns on typescript-eslint's recommended config

### Step 3: Run

```bash
npx eslint .
```

## Shared Config Overview

Typescript-eslint provides several built-in shared configurations:

| Config | Description | Type Info Required |
|--------|-------------|-------------------|
| `recommended` | Code correctness rules (best for most projects) | No |
| `recommended-type-checked` | recommended + type-aware rules | Yes |
| `strict` | recommended + more opinionated bug-catching rules | No |
| `strict-type-checked` | strict + type-aware rules | Yes |
| `stylistic` | Enforces concise, consistent code style | No |
| `stylistic-type-checked` | stylistic + type-aware style rules | Yes |

### Projects Without Type Checking

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
  ],
});
```

### Projects With Type Checking

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,  // Recommended for v8+
    },
  },
});
```

## Linting with Type Information (Typed Linting)

Typed rules use TypeScript's type-checking APIs for deeper code analysis. They are slower but much more powerful.

### Setup

1. Use `TypeChecked` variants of configs
2. Add `parserOptions` with `projectService: true`

```js
// eslint.config.mjs
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
});
```

### With Strict + Stylistic Type-Checked

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ],
  // ...
});
```

### Disable Type-Checked on JavaScript Files

```js
export default defineConfig(
  {
    files: ['**/*.{js,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true },
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
```

## Detailed Configuration Descriptions

### `recommended`

Rules for code correctness with no additional configuration needed. Disables core ESLint rules known to conflict.

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [tseslint.configs.recommended],
});
```

### `recommended-type-checked`

All of `recommended` + additional recommended rules requiring type information.

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [tseslint.configs.recommendedTypeChecked],
  // typed linting config...
});
```

### `strict`

All of `recommended` + more opinionated bug-catching rules. Recommended for teams proficient in TypeScript.

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [tseslint.configs.strict],
});
```

### `strict-type-checked`

All of `recommended`, `recommended-type-checked`, `strict` + additional strict type-aware rules.

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [tseslint.configs.strictTypeChecked],
  // typed linting config...
});
```

### `stylistic` and `stylistic-type-checked`

Best practice stylistic rules that don't impact program logic. Used alongside `recommended` or `strict`.

```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [tseslint.configs.stylistic],
  // or: tseslint.configs.stylisticTypeChecked
});
```

## Key Type-Aware Rules (recommended-type-checked)

| Rule | Description |
|------|-------------|
| `@typescript-eslint/await-thenable` | Disallow awaiting a value that is not a Thenable |
| `@typescript-eslint/no-floating-promises` | Require Promise-like statements to be handled appropriately |
| `@typescript-eslint/no-for-in-array` | Disallow iterating over an array with a for-in loop |
| `@typescript-eslint/no-implied-eval` | Disallow eval-like methods |
| `@typescript-eslint/no-misused-promises` | Avoid using promises in places not designed to handle them |
| `@typescript-eslint/no-unsafe-argument` | Disallow calling a function with a value with type `any` |
| `@typescript-eslint/no-unsafe-assignment` | Disallow assigning a value with type `any` to variables and properties |
| `@typescript-eslint/no-unsafe-call` | Disallow calling a value with type `any` |
| `@typescript-eslint/no-unsafe-member-access` | Disallow member access on a value with type `any` |
| `@typescript-eslint/no-unsafe-return` | Disallow returning a value with type `any` from a function |
| `@typescript-eslint/no-unnecessary-type-assertion` | Warns if a type assertion does not change the type |
| `@typescript-eslint/restrict-plus-operands` | Require both operands of addition to be the same type |
| `@typescript-eslint/restrict-template-expressions` | Enforce template literal expressions to be of type string |
| `@typescript-eslint/unbound-method` | Enforce that `this` is used correctly in method calls |

## Key Non-Type-Aware Rules (recommended)

| Rule | Description |
|------|-------------|
| `@typescript-eslint/no-explicit-any` | Disallow the `any` type |
| `@typescript-eslint/no-unused-vars` | Disallow unused variables (replaces ESLint's `no-unused-vars`) |
| `@typescript-eslint/no-var-requires` | Disallow `require` statements (use `import` instead) |
| `@typescript-eslint/ban-ts-comment` | Disallow `@ts-<directive>` comments |
| `@typescript-eslint/no-namespace` | Disallow TypeScript namespaces |
| `@typescript-eslint/no-non-null-asserted-optional-chain` | Disallow non-null assertions after optional chain |
| `@typescript-eslint/prefer-as-const` | Enforce use of `as const` over literal type |
| `@typescript-eslint/no-duplicate-enum-values` | Disallow duplicate enum member values |
| `@typescript-eslint/no-this-alias` | Disallow assigning `this` to a variable |
| `@typescript-eslint/triple-slash-reference` | Disallow triple-slash reference directives |

## Configuring `no-unused-vars`

Disable base ESLint rule and use the TypeScript-aware version:

```json
{
  "rules": {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

With underscore prefix ignore pattern (matching TypeScript's `noUnusedLocals` behavior):

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  }
}
```

## `typescript-eslint` Package Usage

The `typescript-eslint` package is the main entrypoint. It re-exports:

- `configs` — Shared flat configs (recommended, strict, stylistic, etc.)
- `parser` — `@typescript-eslint/parser`
- `plugin` — `@typescript-eslint/eslint-plugin`

### Manual Plugin/Parser Configuration

```js
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'error',
  },
});
```

### Complex Multi-Plugin Example

```js
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import jestPlugin from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['**/build/**', '**/dist/**'],
  },
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      jest: jestPlugin,
    },
  },
  {
    files: ['**/*.{js,ts}'],
    extends: [js.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['test/**'],
    extends: [jestPlugin.configs['flat/recommended']],
  },
);
```

## Migrating from Legacy `.eslintrc`

1. Install `typescript-eslint` (it includes `parser` and `plugin` as dependencies)
2. Remove separate `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` packages
3. Migrate from `.eslintrc` to `eslint.config.mjs`

```bash
npm un @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Formatting Recommendation

None of the preset configs enable formatting rules. **Use Prettier** for code formatting, not ESLint formatting rules.
