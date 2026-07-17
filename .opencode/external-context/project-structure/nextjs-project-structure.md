---
source: Context7 API
library: Next.js
package: nextjs
topic: project-structure-organization
fetched: 2026-07-14T10:00:00Z
official_docs: https://nextjs.org/docs/app/getting-started/project-structure
---

# Next.js Project Structure & Organization

## Top-level Folders

Source: Next.js Official Docs

Next.js uses top-level folders to organize application code and static assets:

| Folder | Purpose |
|--------|---------|
| `app/` | App Router (recommended for new projects) |
| `pages/` | Pages Router (legacy) |
| `public/` | Static assets |
| `src/` | Optional application source folder |

## Project Structure Recommendations

Source: Next.js Official Docs

### Strategy: Store project files outside of `app`

One common strategy for project organization is to store all application code in shared folders at the root of your project, reserving the `app` directory purely for routing purposes.

Example structure:
```
my-nextjs-app/
├── app/                    # Route definitions only
│   ├── layout.tsx
│   ├── page.tsx
│   └── dashboard/
│       ├── layout.tsx
│       └── page.tsx
├── components/             # Shared UI components
├── lib/                    # Utility functions, helpers
├── actions/                # Server Actions
├── db/                     # Database configuration
│   └── schema/
├── public/                 # Static assets
├── styles/                 # Global styles
└── types/                  # Shared TypeScript types
```

### App Router File Conventions

Source: Next.js Official Docs

| File | Convention |
|------|-----------|
| `layout.tsx` | Shared layout for segment |
| `page.tsx` | Unique UI for route |
| `loading.tsx` | Loading UI |
| `error.tsx` | Error UI |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint |

## Pages Router Project Structure (Legacy)

Source: Next.js Official Docs (Pages Router)

```
my-nextjs-app/
├── pages/
│   ├── index.tsx
│   ├── api/                # API routes
│   └── ...
├── components/
├── public/
├── styles/
└── ...
```

## Best Practices Summary

1. **Use the App Router** for new projects (recommended)
2. **Keep `app/` for routing only** — move business logic outside
3. **Use `src/` directory** optionally to separate app code from config files
4. **Colocate tests, styles, and components** near their usage
5. **Use shared folders** like `components/`, `lib/`, `types/` for cross-cutting code
