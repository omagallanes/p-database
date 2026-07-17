---
source: Context7 API + Official Next.js Docs
library: Next.js
package: nextjs
topic: App Router Architecture - Colocation, organization strategies, and best practices
fetched: 2026-07-14T10:00:00Z
official_docs: https://nextjs.org/docs/app/getting-started/project-structure
---

# Next.js App Router Architecture & Organization

## Colocation

In the `app` directory, nested folders define route structure. Each folder represents a route segment that maps to a corresponding URL path segment.

However, a route is **not publicly accessible** until a `page.js` or `route.js` file is added. Only the **content returned** by `page.js` or `route.js` is sent to the client.

This means **project files can be safely colocated** inside route segments without accidentally being routable.

> **Key insight**: While you **can** colocate project files in `app`, you don't **have to**. You can keep them outside the `app` directory if preferred.

## Private Folders (`_folder`)

Prefix a folder with an underscore (`_folderName`) to mark it as a private implementation detail. This opts the folder and all subfolders out of routing.

**Use cases:**
- Separating UI logic from routing logic
- Consistently organizing internal files across a project
- Sorting and grouping files in code editors
- Avoiding potential naming conflicts with future Next.js file conventions

> **Note**: To create URL segments starting with `_`, use `%5FfolderName` (URL-encoded underscore).

## Route Groups (`(folder)`)

Wrap a folder in parentheses (`(folderName)`) to organize routes without affecting the URL path.

**Use cases:**
- Organizing routes by site section, intent, or team (e.g., marketing, admin)
- Enabling nested layouts in the same route segment level
- Creating multiple root layouts
- Adding a layout to a subset of routes

## The `src` Folder

Next.js supports placing application code (including `app`) inside an optional `src` folder. This separates application code from project configuration files at the root.

```
project-root/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── ...
├── next.config.js
├── package.json
├── tsconfig.json
└── ...
```

> **Warning**: `src/app` or `src/pages` will be ignored if `app` or `pages` directories are also present at the project root.

## Organization Strategies

Next.js is **unopinionated** about project organization. Choose a strategy that works for your team and be consistent.

### Strategy 1: Store project files outside of `app`

Store all application code in shared folders at the **root of your project**. The `app` directory is used purely for routing.

```
project-root/
├── components/
│   └── button.tsx
├── lib/
│   └── utils.ts
├── app/
│   ├── page.tsx
│   └── layout.tsx
├── next.config.js
└── package.json
```

**Best for**: Teams that want clear separation between routing logic and application code.

### Strategy 2: Store project files in top-level folders inside of `app`

Store all shared application code in folders at the **root of the `app` directory**.

```
project-root/
├── app/
│   ├── components/
│   │   └── button.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── page.tsx
│   └── layout.tsx
├── next.config.js
└── package.json
```

**Best for**: Smaller projects where keeping everything in one directory tree is simpler.

### Strategy 3: Split project files by feature or route

Store globally shared code in root `app` directories, and feature-specific code in the route segments that use them.

```
project-root/
├── app/
│   ├── components/
│   │   └── global-header.tsx
│   ├── lib/
│   │   └── analytics.ts
│   ├── dashboard/
│   │   ├── components/
│   │   │   └── chart.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── page.tsx
│   └── layout.tsx
├── next.config.js
└── package.json
```

**Best for**: Larger projects where colocating related code improves maintainability.

### Strategy 4: Organize routes with route groups

Use route groups to keep related routes organized without affecting URLs.

```
project-root/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── (shop)/
│   │   ├── account/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── checkout/
│   │   └── page.tsx
│   └── layout.tsx
└── ...
```

**Best for**: Sections needing different layouts, or organizing by team/section.

## Creating Multiple Root Layouts

Remove the top-level `layout.js` and add a `layout.js` inside each route group:

```
app/
├── (marketing)/
│   ├── page.tsx
│   └── layout.tsx      # Root layout for marketing
├── (shop)/
│   ├── account/
│   │   └── page.tsx
│   └── layout.tsx      # Root layout for shop
└── layout.tsx          # REMOVED
```

> Each root layout must include `<html>` and `<body>` tags.

## Loading Skeletons on Specific Routes

Apply `loading.js` to a subset of routes using route groups:

```
app/
├── dashboard/
│   ├── (overview)/
│   │   ├── loading.tsx     # Only applies to this route
│   │   └── page.tsx
│   ├── page.tsx
│   └── layout.tsx
└── ...
```

## Best Practices Summary

1. **Be consistent** — Choose one organization strategy and stick with it across the team.
2. **Use private folders** (`_folder`) for internal implementation details to avoid routing conflicts.
3. **Use route groups** (`(folder)`) to organize sections without URL changes.
4. **Consider `src/` folder** to separate application code from config files.
5. **Colocate by feature** for larger projects to keep related code together.
6. **Keep `app/` routing-only** or **colocate inside `app/`** — pick one pattern and be consistent.
7. **Common folder names** for shared code: `components`, `lib`, `ui`, `utils`, `hooks`, `styles`, `types`.

Source: https://nextjs.org/docs/app/getting-started/project-structure
