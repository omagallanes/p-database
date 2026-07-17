---
source: Context7 API
library: Turborepo
package: turborepo
topic: monorepo-project-structure
fetched: 2026-07-14T10:00:00Z
official_docs: https://turbo.build/repo/docs
---

# Turborepo Monorepo Structure & Best Practices

## Standard Monorepo Directory Structure

Source: Turborepo Best Practices (RULE.md)

The standard Turborepo monorepo layout separates deployable applications from shared libraries:

```text
my-monorepo/
├── apps/                    # Application packages (deployable)
│   ├── web/
│   ├── docs/
│   └── api/
├── packages/                # Library packages (shared code)
│   ├── ui/
│   ├── utils/
│   └── config-*/           # Shared configs (eslint, typescript, etc.)
├── package.json            # Root package.json (minimal deps)
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # (pnpm) or workspaces in package.json
└── pnpm-lock.yaml          # Lockfile (required)
```

## Root Package.json Dependencies Best Practices

Source: Turborepo Best Practices (RULE.md)

Application and library dependencies should be installed in their respective packages, not at the root:

```json
// BAD: Root has app dependencies
{
  "dependencies": {
    "react": "^18",
    "next": "^14",
    "lodash": "^4"
  }
}

// GOOD: Root only has repo tools
{
  "devDependencies": {
    "turbo": "latest",
    "husky": "latest"
  }
}
```

## Namespace Packages to Avoid Registry Conflicts

Source: Turborepo Best Practices (RULE.md)

Best practice for naming internal packages using organization or repository prefixes:

```json
// Good
{ "name": "@repo/ui" }
{ "name": "@acme/utils" }

// Avoid (conflicts with npm registry)
{ "name": "ui" }
{ "name": "utils" }
```

## Quick Decision: How to Structure Your Monorepo

Source: Turborepo SKILL.md

A standard monorepo structure typically includes:
- `apps/` and `packages/` directories
- Define package types (apps vs libraries)
- Configure TypeScript and ESLint
- Manage dependencies effectively
- **Enforce package boundaries** to maintain architectural integrity

## Monorepo Best Practices Summary

Source: Turborepo Best Practices

1. **Standard Layout**: `apps/` for deployable units, `packages/` for shared code
2. **Minimal Root Dependencies**: Only repo-level tools at root
3. **Namespace Internal Packages**: Use `@repo/*` or `@scope/*` pattern
4. **Separate Configuration**: Shared configs as packages (e.g., `config-eslint`, `config-typescript`)
5. **Lockfile Required**: Always commit lockfile
