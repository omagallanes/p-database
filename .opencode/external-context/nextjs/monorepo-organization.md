---
source: Context7 API - belgattitude/nextjs-monorepo-example
library: Next.js
package: nextjs
topic: Monorepo Organization - apps/packages structure, workspace configuration, and shared code patterns
fetched: 2026-07-14T10:00:00Z
official_docs: https://github.com/belgattitude/nextjs-monorepo-example
---

# Next.js Monorepo Organization Best Practices

## Monorepo-Level Structure

A well-organized Next.js monorepo separates applications from shared packages:

```
project-root/
├── apps/                    # Runnable applications
│   ├── nextjs-app/          # Next.js application
│   └── vite-app/            # Alternative app (Vite, etc.)
├── packages/                # Shared libraries
│   ├── core-lib/            # Basic TypeScript utilities
│   ├── db-main-prisma/      # Database layer (Prisma)
│   ├── eslint-config-bases/ # Shared ESLint configurations
│   ├── ui-lib/              # UI component library
│   └── common-i18n/         # Internationalization utilities
├── package.json             # Root workspace config
└── ...
```

## Key Principles

1. **Applications should NOT depend on other applications** — they can depend on packages.
2. **Packages can depend on each other** — enabling code sharing across the monorepo.
3. **Each app/package has its own `package.json` and `tsconfig.json`** for independent configuration.
4. **Shared tooling configs** live in dedicated packages (e.g., `eslint-config-bases`).

## Workspace Configuration

### Root `package.json`

Enable Yarn/NPM workspace support with the `workspaces` field:

```json
{
  "name": "my-monorepo",
  "workspaces": ["apps/*", "packages/*"],
  "//": "Directories where apps and packages are located"
}
```

This allows the package manager to:
- Automatically discover packages in those directories
- Manage inter-package dependencies
- Hoist shared dependencies

## App-Level Structure (Next.js app)

A Next.js application within a monorepo's `apps/` directory follows this structure:

```
apps/nextjs-app/
├── e2e/                    # End-to-end tests (optional)
├── public/                 # Static assets
├── setup/                  # Test/tooling setup configs
├── src/                    # Application source code
├── eslintrc.cjs            # ESLint config
├── next.config.mjs         # Next.js configuration
├── package.json            # App-specific dependencies
├── tsconfig.json           # TypeScript config
└── tailwind.config.ts      # Tailwind config (optional)
```

## Example Shared Packages

### `packages/core-lib`
- Basic TypeScript utility functions
- General-purpose shared code

### `packages/db-main-prisma`
- Prisma database layer
- Schema, migrations, client setup
- Intended for use by web applications

### `packages/eslint-config-bases`
- Shared ESLint configurations
- Ensures consistent code quality standards across the monorepo

### `packages/ui-lib`
- UI component library (React)
- Styled with Emotion (or any CSS-in-JS/library)
- Documented with Storybook
- Designed to be publishable

### `packages/common-i18n`
- Locale data and internationalization utilities
- Shared across multiple applications

## Creating a New Package

1. Create a folder in `./packages/`:
   ```bash
   mkdir packages/my-new-package
   mkdir packages/my-new-package/src
   ```
2. Initialize `package.json` mirroring existing packages' structure
3. Edit values for the new package's name and dependencies
4. Export from `src/` directory
5. Import in apps via the package name (workspace resolution)

## Practical Recommendations

- **Use `apps/*` and `packages/*`** as the top-level workspace pattern — it's widely adopted and tool-friendly.
- **Separate concerns clearly**: apps are deployable units, packages are reusable libraries.
- **Keep shared configurations in packages** (ESLint, TypeScript base configs, etc.) rather than duplicating them.
- **Each package should have a clear, single responsibility** — avoid "utils" packages that become dumping grounds.
- **Use TypeScript project references** or path aliases for smooth cross-package development.
- **Consider Turborepo** for build caching and task orchestration in larger monorepos.

Source: https://github.com/belgattitude/nextjs-monorepo-example
