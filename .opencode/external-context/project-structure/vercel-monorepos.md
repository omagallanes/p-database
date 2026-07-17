---
source: Context7 API
library: Vercel
package: vercel
topic: monorepo-deployment
fetched: 2026-07-14T10:00:00Z
official_docs: https://vercel.com/docs/monorepos
---

# Vercel Monorepo Structure & Deployment

## Using Monorepos on Vercel

Source: Vercel Docs

Monorepos allow you to manage multiple projects in a single directory, offering a structured way to organize and work with your projects.

## Linking Projects in a Monorepo

Source: Vercel Docs

To link multiple Vercel projects within a monorepo, use the `vercel link --repo` command in the root directory. This allows subsequent commands like `vercel dev` to target the selected Vercel Project.

## Monorepo Build Behavior

Source: Vercel Docs

- By default, pushing a commit triggers deployments for **all connected Vercel projects**
- Can optimize by **skipping unaffected projects** or ignoring build step for unchanged files

## Linking Related Projects

Source: Vercel Docs

Configure related projects in `vercel.json` at the root of each app:

```json
{
  "relatedProjects": [
    "project-name-1",
    "project-name-2"
  ]
}
```

**Requirements:**
- Maximum of 3 projects can be linked together
- Only supports projects within the same repository
- Preview/production hosts of related projects available as environment variables

## Key Takeaways

1. Monorepos are fully supported on Vercel
2. Use `vercel link --repo` for monorepo project linking
3. Configure build optimization to skip unaffected projects
4. Link up to 3 related projects per app via `vercel.json`
