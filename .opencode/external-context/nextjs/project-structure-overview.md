---
source: Context7 API + Official Next.js Docs
library: Next.js
package: nextjs
topic: Project Structure Overview - Top-level folders, files, and routing conventions
fetched: 2026-07-14T10:00:00Z
official_docs: https://nextjs.org/docs/app/getting-started/project-structure
---

# Next.js Project Structure Overview

## Top-level Folders

Top-level folders organize your application's code and static assets:

| Folder      | Purpose                                      |
| ----------- | -------------------------------------------- |
| `app`       | App Router                                   |
| `pages`     | Pages Router                                 |
| `public`    | Static assets to be served                   |
| `src`       | Optional application source folder           |

## Top-level Files

Key configuration files at the project root:

| File                      | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `next.config.js`          | Next.js configuration                                |
| `package.json`            | Project dependencies and scripts                     |
| `instrumentation.ts`      | OpenTelemetry and instrumentation                    |
| `proxy.ts`                | Next.js request proxy                                |
| `.env`                    | Environment variables (not tracked by version control)|
| `.env.local`              | Local env vars (not tracked by version control)       |
| `.env.production`         | Production env vars (not tracked by version control)  |
| `.env.development`        | Development env vars (not tracked by version control) |
| `eslint.config.mjs`       | ESLint configuration                                 |
| `.gitignore`              | Git files/folders to ignore                          |
| `next-env.d.ts`           | TypeScript declaration file (not tracked by VC)      |
| `tsconfig.json`           | TypeScript configuration                             |
| `jsconfig.json`           | JavaScript configuration                             |

## Routing File Conventions

Special files that define UI and behavior for route segments:

| File             | Extension(s)       | Purpose               |
| ---------------- | ------------------ | --------------------- |
| `layout`         | `.js` `.jsx` `.tsx`| Layout (shared UI)    |
| `page`           | `.js` `.jsx` `.tsx`| Page                   |
| `loading`        | `.js` `.jsx` `.tsx`| Loading UI (skeleton)  |
| `not-found`      | `.js` `.jsx` `.tsx`| Not found UI           |
| `error`          | `.js` `.jsx` `.tsx`| Error UI               |
| `global-error`   | `.js` `.jsx` `.tsx`| Global error UI        |
| `route`          | `.js` `.ts`        | API endpoint           |
| `template`       | `.js` `.jsx` `.tsx`| Re-rendered layout     |
| `default`        | `.js` `.jsx` `.tsx`| Parallel route fallback|

## Nested Routes

Folders define URL segments; nesting folders nests segments. Layouts at any level wrap their child segments. A route becomes public when a `page` or `route` file exists.

| Path                        | URL pattern      | Notes                         |
| --------------------------- | ---------------- | ----------------------------- |
| `app/layout.tsx`            | —                | Root layout wraps all routes  |
| `app/blog/layout.tsx`       | —                | Wraps `/blog` and descendants |
| `app/page.tsx`              | `/`              | Public route                  |
| `app/blog/page.tsx`         | `/blog`          | Public route                  |
| `app/blog/authors/page.tsx` | `/blog/authors`  | Public route                  |

## Dynamic Routes

Parameterize segments with square brackets:

| Path                            | URL pattern                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `app/blog/[slug]/page.tsx`      | `/blog/my-first-post`                                                |
| `app/shop/[...slug]/page.tsx`   | `/shop/clothing`, `/shop/clothing/shirts`                            |
| `app/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/layouts-and-pages`, `/docs/api-reference/use-router` |

- `[segment]` — single dynamic parameter
- `[...segment]` — catch-all segment
- `[[...segment]]` — optional catch-all segment

Access values via the `params` prop.

## Route Groups and Private Folders

| Path                            | URL pattern | Notes                                     |
| ------------------------------- | ----------- | ----------------------------------------- |
| `app/(marketing)/page.tsx`      | `/`         | Group omitted from URL                    |
| `app/(shop)/cart/page.tsx`      | `/cart`     | Share layouts within `(shop)`             |
| `app/blog/_components/Post.tsx` | —           | Not routable; safe place for UI utilities |
| `app/blog/_lib/data.tsx`        | —           | Not routable; safe place for utils        |

## Parallel and Intercepted Routes

| Pattern (docs)                                                                              | Meaning              | Typical use case                         |
| ------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------- |
| `@folder`                                                                                   | Named slot           | Sidebar + main content                   |
| `(.)folder`                                                                                 | Intercept same level | Preview sibling route in a modal         |
| `(..)folder`                                                                                | Intercept parent     | Open a child of the parent as an overlay |
| `(..)(..)folder`                                                                            | Intercept two levels | Deeply nested overlay                    |
| `(...)folder`                                                                               | Intercept from root  | Show arbitrary route in current view     |

## Metadata File Conventions

### App Icons

- `favicon.ico` — Favicon file
- `icon.{ico,jpg,jpeg,png,svg}` — App Icon file
- `icon.{js,ts,tsx}` — Generated App Icon
- `apple-icon.{jpg,jpeg,png}` — Apple App Icon file
- `apple-icon.{js,ts,tsx}` — Generated Apple App Icon

### Open Graph and Twitter Images

- `opengraph-image.{jpg,jpeg,png,gif}` — Open Graph image file
- `opengraph-image.{js,ts,tsx}` — Generated Open Graph image
- `twitter-image.{jpg,jpeg,png,gif}` — Twitter image file
- `twitter-image.{js,ts,tsx}` — Generated Twitter image

### SEO

- `sitemap.xml` — Sitemap file
- `sitemap.{js,ts}` — Generated Sitemap
- `robots.txt` — Robots file
- `robots.{js,ts}` — Generated Robots file

## Component Hierarchy

Special file components render in this order (recursively nested):

1. `layout.js`
2. `template.js`
3. `error.js` (React error boundary)
4. `loading.js` (React suspense boundary)
5. `not-found.js` (React error boundary)
6. `page.js` or nested `layout.js`

## Example: App Router with Forms and Tables

```
app/
├── actions.tsx          # Server actions for data mutations
├── form.tsx             # Client component with form and list display
├── layout.tsx           # Root layout
├── page.tsx             # Main page server component
├── types.tsx            # Type definitions
├── globals.css          # Global styles
├── favicon.ico
package.json            # Dependencies: next, react, react-dom, tailwindcss
```

## Example: MDX Page Structure

```
my-project
├── app
│   └── mdx-page
│       └── page.(mdx/md)
├── mdx-components.(tsx/js)
└── package.json
```

## Example: Root Parameters with i18n

```
app/
  [lang]/              ← root parameter (shared by all routes below)
    layout.tsx         ← root layout
    page.tsx           ← has no slug
    blog/
      [slug]/          ← route parameter
        page.tsx
    store/
      [...slug]/       ← catch-all route parameter
        page.tsx
```

Source: https://nextjs.org/docs/app/getting-started/project-structure
