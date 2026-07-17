---
source: Context7 API
library: Nx
package: nx
topic: monorepo-project-structure
fetched: 2026-07-14T10:00:00Z
official_docs: https://nx.dev/docs
---

# Nx Monorepo Structure & Best Practices

## Folder Structure Philosophy

Source: Nx Official Docs

Nx can work with any folder structure you choose, but it is good to have a plan in place for the folder structure of your monorepo. Projects are often grouped by **scope**. A project's scope is either:
- The application to which it belongs
- For larger applications: a section within that application

## Example Workspace Structure

Source: Nx Docs — Folder Structure Concepts

Using "Nrwl Airlines" as an example organization with two apps (`booking` and `check-in`):

```text
libs/
├── booking/              # Projects related to booking app
│   ├── booking-feature/
│   ├── booking-data/
│   └── booking-ui/
├── check-in/             # Projects related to check-in app
│   ├── check-in-feature/
│   └── check-in-data/
└── shared/               # Projects used in both applications
    ├── shared-seatmap/
    ├── shared-styles/
    └── shared-types/
```

## Workspace Layout Configuration

Source: Nx Docs — Project Graph

Nx configuration includes `workspaceLayout` to define directory conventions:

```json
{
  "workspaceLayout": {
    "appsDir": "apps",
    "libsDir": "libs"
  }
}
```

## Angular Monorepo Structure

Source: Nx Docs — Angular Monorepo Tutorial

```
my-org/
├── apps/                    # Deployable applications + e2e tests
│   ├── my-app/
│   └── my-app-e2e/
└── libs/                    # Shared code, utilities, features
    ├── shared/
    │   ├── ui/
    │   └── data/
    └── booking/
        ├── feature/
        └── data/
```

## Project Tags and Organization

Source: Nx Docs — Project Graph

Nx uses tags to enforce architectural boundaries:

```json
{
  "name": "shared-product-state",
  "type": "lib",
  "data": {
    "root": "shared/product-state",
    "tags": ["scope:shared", "type:state"]
  }
}
```

## Key Recommendations

1. **Group by scope**: keep related projects together in the folder tree
2. **Minimize navigation time**: group projects that are (usually) updated together
3. **Use tags**: enforce boundaries with `scope:` and `type:` tags
4. **Separate apps from libs**: deployable apps in `apps/`, shared code in `libs/`
5. **Nested grouping**: use nested folders for larger scopes (e.g., `libs/shared/seatmap`)
