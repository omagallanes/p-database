---
source: Context7 API + official docs
library: typescript-eslint
package: typescript-eslint
topic: Recommended, strict, and stylistic configurations (flat + legacy)
fetched: 2026-07-14T12:00:00Z
official_docs: https://typescript-eslint.io/getting-started/
tech_stack: TypeScript, ESLint 9+ (flat config) / ESLint legacy (.eslintrc)
---

# TypeScript-ESLint Configuration Guide

> Current as of typescript-eslint v8.64.0 (July 2026). Covers flat config, legacy `.eslintrc`, recommended/strict/stylistic configs, and typed linting.

## Quickstart (Flat Config — Modern ESLint 9+)

### Step 1: Install

```bash
npm install --save-dev eslint @eslint/js typescript typescript-eslint
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

**Note:** The `.mjs` extension uses ES modules. Use `.js` if your `package.json` has `"type": "module"`.

### Step 3: Run ESLint

```bash
npx eslint .
```

## Quickstart (Legacy `.eslintrc` Format)

### Step 1: Install

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```

### Step 2: Create `.eslintrc.cjs`

```js
/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};
```

### Step 3: Run ESLint

```bash
npx eslint .
```

## Available Configurations

| Config | Type | Description | Stable (semver)? |
|--------|------|-------------|------------------|
| `recommended` | Functional | Recommended rules for code correctness. Drop-in, no additional config needed. | ✅ Yes |
| `recommended-type-checked` | Functional | `recommended` + additional recommended rules requiring type info | ✅ Yes |
| `strict` | Functional | `recommended` + more opinionated bug-catching rules | ❌ No |
| `strict-type-checked` | Functional | `strict` + additional strict rules requiring type info | ❌ No |
| `stylistic` | Stylistic | Enforces concise, consistent code without changing logic | ✅ Yes |
| `stylistic-type-checked` | Stylistic | `stylistic` + additional stylistic rules requiring type info | ✅ Yes |

## Configuration Inheritance

```
recommended           → base + eslint-recommended + recommended rules
strict                → recommended + strict rules
recommended-type-checked → base + eslint-recommended + recommended + recommended-type-checked rules
strict-type-checked   → recommended + strict + recommended-type-checked + strict-type-checked rules
stylistic             → stylistic rules
stylistic-type-checked → stylistic + stylistic-type-checked rules
```

### For Projects WITHOUT Type Checking

Start with `recommended` + `stylistic`:

**Flat config:**
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

**Legacy config:**
```js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
  ],
};
```

> Tip: If most devs are comfortable with TS, consider replacing `recommended` with `strict`.

### For Projects WITH Type Checking

You need to configure `languageOptions.parserOptions` for typed linting, then use type-checked configs:

**Flat config:**
```js
export default defineConfig(
  {
    files: ['**/*.{js,ts}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  // Disable type-checked rules on .js files if needed
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
```

**Legacy config:**
```js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
};
```

> Tip: If most devs are comfortable with TS, consider replacing `recommended-type-checked` with `strict-type-checked`.

## Detailed Config Descriptions

### `recommended`
- Drop-in, no additional configuration needed
- Reports are almost always for bad practices and/or likely bugs
- Disables core ESLint rules that conflict with TS or cause issues
- **Flat**: `tseslint.configs.recommended`
- **Legacy**: `plugin:@typescript-eslint/recommended`

### `recommended-type-checked`
- Contains all of `recommended` + additional recommended rules requiring type information
- Requires `parserOptions.projectService: true` (flat) or `parserOptions.project` (legacy)
- **Flat**: `tseslint.configs.recommendedTypeChecked`
- **Legacy**: `plugin:@typescript-eslint/recommended-type-checked`

### `strict`
- Contains all of `recommended` + more opinionated bug-catching rules
- May not apply to all projects — recommended only if a nontrivial percentage of developers are highly proficient in TypeScript
- ⚠️ Not stable under semver (rules/options may change in minor versions)
- **Flat**: `tseslint.configs.strict`
- **Legacy**: `plugin:@typescript-eslint/strict`

### `strict-type-checked`
- Contains all of `recommended` + `recommended-type-checked` + `strict` + additional strict rules requiring type info
- Same stability warning as `strict`
- **Flat**: `tseslint.configs.strictTypeChecked`
- **Legacy**: `plugin:@typescript-eslint/strict-type-checked`

### `stylistic`
- Best practice stylistic rules for modern TypeScript codebases
- Do NOT impact program logic
- Does NOT replace `recommended` or `strict` — adds additional rules
- **Flat**: `tseslint.configs.stylistic`
- **Legacy**: `plugin:@typescript-eslint/stylistic`

### `stylistic-type-checked`
- Contains all of `stylistic` + additional stylistic rules requiring type info
- Does NOT replace type-checked functional configs — adds additional rules
- **Flat**: `tseslint.configs.stylisticTypeChecked`
- **Legacy**: `plugin:@typescript-eslint/stylistic-type-checked`

## Combining All Configs (Strict + Stylistic)

**Flat config — full featured:**
```js
export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
  ],
});
```

**Legacy — full featured:**
```js
/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/stylistic',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};
```

## Integration with Next.js

When using Next.js with TypeScript, combine `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`:

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
```

`eslint-config-next/typescript` is based on `plugin:@typescript-eslint/recommended` automatically.

## Formatting

None of the preset configs enable formatting rules. **Strongly recommended**: use Prettier for formatting, not ESLint formatting rules.

```bash
npm i -D eslint-config-prettier
```

```js
import prettier from 'eslint-config-prettier/flat'
// ...spread prettier after other configs
```

## Other Utility Configs

| Config | Purpose |
|--------|---------|
| `all` | Enables ALL rules — not recommended for production |
| `base` | Minimal setup — automatically included with recommended configs |
| `disableTypeChecked` | Disables type-aware rules (e.g. for `.js` files in mixed projects) |
| `eslintRecommended` | Disables core ESLint rules already handled by TS |
| `recommended-type-checked-only` | `recommended` type-checked rules only (without base `recommended`) |
| `strict-type-checked-only` | `strict` type-checked rules only (without base `strict`) |
| `stylistic-type-checked-only` | `stylistic` type-checked rules only (without base `stylistic`) |

## Typed Linting

To enable typed linting, set `parserOptions.projectService: true` (flat) or `parserOptions.project` (legacy):

**Flat:**
```js
languageOptions: {
  parserOptions: {
    projectService: true,
  },
}
```

**Legacy:**
```js
parserOptions: {
  projectService: true,  // ESLint v9 type-checked linting (recommended)
  // OR
  project: './tsconfig.json',  // ESLint v8 style
}
```

## References

- Official getting started (flat): https://typescript-eslint.io/getting-started/
- Legacy setup: https://typescript-eslint.io/getting-started/legacy-eslint-setup
- Shared configs: https://typescript-eslint.io/users/configs
- Typed linting: https://typescript-eslint.io/getting-started/typed-linting
- GitHub: https://github.com/typescript-eslint/typescript-eslint
