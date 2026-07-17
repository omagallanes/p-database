---
source: Context7 API
library: Next Forge (Vercel)
package: next-forge
topic: production-monorepo-template
fetched: 2026-07-14T10:00:00Z
official_docs: https://github.com/vercel/next-forge
---

# Next Forge — Production-Grade Monorepo Template

## Standard Directory Structure

Source: vercel/next-forge README

A production-grade Turborepo template for Next.js apps:

```tree
next-forge/
├── apps/                    # Deployable applications
│   ├── web/                 # Marketing website (port 3001)
│   ├── app/                 # Main application (port 3000)
│   ├── api/                 # Serverless API
│   ├── docs/                # Documentation site
│   ├── email/               # Email preview
│   └── storybook/           # Component library (port 6006)
└── packages/                # Shared packages
    ├── design-system/       # UI components
    ├── database/            # Database layer
    ├── auth/                # Authentication
    ├── ai/                  # AI utilities
    ├── analytics/           # Analytics
    ├── email/               # Email templates
    └── payments/            # Payment processing
```

## Turbo Configuration with Task Dependencies

Source: vercel/next-forge turbo.json

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "ui": "tui",
  "envMode": "loose",
  "tasks": {
    "build": {
      "dependsOn": ["^build", "test"],
      "outputs": [
        ".next/**",
        "!.next/cache/**",
        "**/generated/**",
        "storybook-static/**",
        ".react-email/**"
      ]
    },
    "test": {
      "dependsOn": ["^test"]
    },
    "analyze": {
      "dependsOn": ["^analyze"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Architecture Highlights

Source: next-forge architecture docs

### Key Features
- **Managed by Turborepo** with Bun as default package manager
- **Typed workspace packages**: All shared functionality is in `@repo/*` workspace packages
- **Strict boundaries**: Enforced between packages
- **End-to-end TypeScript safety**: Across apps and packages
- **Independent deployment**: Each app is self-contained and independently deployable
- **CLI tooling**: `init` for bootstrapping, `update` for upstream changes as file-level diffs

## Package Organization

Source: next-forge architecture docs

The packages directory contains shared code modules organized by domain:

| Package | Purpose |
|---------|---------|
| `@repo/design-system` | Shared UI components |
| `@repo/database` | Database access layer (Prisma) |
| `@repo/auth` | Authentication logic |
| `@repo/ai` | AI/ML utilities |
| `@repo/analytics` | Analytics integration |
| `@repo/email` | Email rendering |
| `@repo/payments` | Payment processing (Stripe) |
| `@repo/observability` | Logging/monitoring |

## Key Takeaways for Production Monorepos

1. **Domain-organized packages**: Group shared code by business domain
2. **Build pipeline with `dependsOn`**: Ensure proper build order with test dependencies
3. **Named ports**: Each app runs on a dedicated port for local development
4. **`envMode: "loose"`**: Flexible environment variable handling
5. **Cache outputs**: Configure build outputs for Turborepo caching
6. **Global dependencies**: Invalidate cache when `.env.*local` files change
