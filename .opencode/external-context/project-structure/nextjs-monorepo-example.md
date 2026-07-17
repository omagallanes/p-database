---
source: Context7 API
library: Next.js Monorepo Example (belgattitude)
package: nextjs-monorepo
topic: monorepo-project-structure
fetched: 2026-07-14T10:00:00Z
official_docs: https://github.com/belgattitude/nextjs-monorepo-example
---

# Next.js Monorepo Example — Project Structure Patterns

## Monorepo Level Structure

Source: belgattitude/nextjs-monorepo-example docs

The monorepo organizes the project into two main directories:

```text
my-monorepo/
├── apps/                    # Application packages
│   ├── web/                 # Next.js app
│   ├── expo/                # React Native / Expo app
│   └── tauri/               # Tauri desktop app
└── packages/                # Shared libraries
    ├── ui/                  # Design system / components
    ├── api/                 # API utilities
    ├── db/                  # Database connectors
    └── i18n/                # Internationalization utilities
```

## Workspace Configuration

Source: belgattitude/nextjs-monorepo-example README

Enables workspace support in root `package.json`:

```json
{
  "name": "nextjs-monorepo-example",
  "workspaces": ["apps/*", "packages/*"],
  "//": "Set the directories where your apps, packages will be placed"
}
```

## Turborepo Task Configuration

Source: belgattitude/nextjs-monorepo-example turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local", "**/tsconfig*.json"],
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    },
    "test-unit": {},
    "lint": {
      "env": ["TIMING"]
    },
    "typecheck": {},
    "codegen": {
      "cache": true,
      "outputs": ["src/generated/**"]
    }
  }
}
```

## Creating a New Package

Source: belgattitude/nextjs-monorepo-example

Bash commands to scaffold a new package:

```bash
# Create new package directory
mkdir packages/my-package

# package.json
{
  "name": "@your-org/my-package",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "clean": "rimraf ./tsconfig.tsbuildinfo",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "typecheck": "tsc --project ./tsconfig.json --noEmit",
    "test": "vitest run",
    "fix:all-files": "eslint . --ext .ts,.tsx,.js,.jsx --fix"
  },
  "devDependencies": {
    "@your-org/eslint-config-bases": "workspace:^"
  }
}

# tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

## Key Patterns

1. **`apps/*` + `packages/*`** workspace structure
2. **Root-level tsconfig.base.json** extended by all packages
3. **Shared ESLint config base** as a workspace package
4. **Each package is self-contained** with its own package.json and tsconfig
5. **Turborepo for task orchestration** with caching
6. **Global dependencies** like `.env.*local` and `tsconfig*.json` for cache invalidation
