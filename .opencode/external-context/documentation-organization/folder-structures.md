---
source: Context7 API
library: Next.js + FINOS CALM + documentation.js
package: documentation-organization
topic: Folder Structures and Project Organization
fetched: 2026-07-14T12:00:00Z
official_docs: https://nextjs.org/docs/app/getting-started/project-structure
---

# Folder Structures and Project Organization

This document combines best practices from multiple frameworks on how to organize project folders and documentation directories.

---

## 1. Next.js Project Structure Conventions

### Top-Level Folders

Next.js projects follow conventions for organizing code at the top level:
- `app/` — App Router (modern routing)
- `pages/` — Pages Router (legacy)
- `public/` — Static assets to be served
- `src/` — Optional application source code directory

### Two Strategies for Project File Organization

#### Strategy A: Store project files outside of `app`
Keep shared application code in folders at the root of the project. This keeps the `app` directory focused purely on routing concerns.

```
my-project/
├── components/         # Shared UI components
├── lib/                # Utility functions, shared logic
├── hooks/              # Custom React hooks (if outside app)
├── styles/             # Global styles
├── app/                # Only routing & page files
│   ├── layout.tsx
│   ├── page.tsx
│   └── dashboard/
│       ├── page.tsx
│       └── layout.tsx
├── public/
└── package.json
```

#### Strategy B: Store project files inside `app`
Place shared application code within top-level folders directly inside the `app` directory.

```
my-project/
├── app/
│   ├── components/     # Shared components (not routed)
│   ├── lib/            # Shared utilities
│   ├── styles/         # Global styles
│   ├── layout.tsx
│   └── page.tsx
├── public/
└── package.json
```

### Colocation

In the `app` directory, nested folders define the route structure. A route is not publicly accessible until a `page.js` or `route.js` file is added to its segment. This allows project files to be safely colocated inside route segments without accidentally becoming routable.

```
app/
├── blog/
│   ├── components/     # Components only used by blog routes
│   ├── utils.ts        # Utilities only used by blog
│   ├── [slug]/
│   │   ├── page.tsx
│   │   └── components/ # Components only used by this segment
│   └── page.tsx
```

### Private Folders (underscore prefix)

Prefixing a folder with an underscore (`_folderName`) marks it as a private implementation detail — it will not be considered by the routing system. This is useful for:
- Separating UI logic from routing logic
- Organizing internal files within route segments
- Avoiding naming conflicts with future Next.js file conventions

### App Router Example with Forms and Tables

```
app/
├── actions.tsx          # Server actions for data mutations
├── form.tsx             # Client component with form and list display
├── layout.tsx           # Root layout
├── page.tsx             # Main page server component
├── types.tsx            # Type definitions (colocated)
├── globals.css          # Global styles
├── favicon.ico
```

### Feature-Specific Types Colocation (TypeScript pattern)

Feature-specific types live in a types.ts file within the feature directory, not in a global folder:

```
src/client/components/segment-cache/
├── types.ts              # Enums and types for this feature
├── index.tsx             # Feature implementation
└── utils.ts              # Feature utilities
```

### Pages Router: Page Extension Configuration

Use `pageExtensions` to enforce naming conventions and allow file colocation:

```js
// next.config.js
module.exports = {
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}
```

---

## 2. CALM Architecture Directory Layout (FINOS)

Standard directory structure for architecture-as-code projects:

```bash
calm/
├── draft/<issue-number>/      # In-progress schema changes (freely editable)
│   ├── meta/                  #   the proposed schema documents
│   └── prototype/             #   examples demonstrating the change
├── release/<version>/         # Published, IMMUTABLE releases (1.0, 1.1, 1.2, …)
│   └── meta/                  #   the published schema documents
├── release/<version>-rcN/     # Release candidates (e.g. 1.0-rc1)
├── controls/                  # Golden-source standardised control definitions
├── interfaces/                # Golden-source standardised interface definitions
├── architecture/              # Reference architectures (e.g. calm-1.json, calm-2.json)
└── getting-started/           # Tutorial material
```

### Minimal Architecture Project Skeleton
```bash
mkdir architectures
mkdir patterns
mkdir docs
touch README.md
```

### AI Tools Directory Structure (for docs-generation tooling)
```plaintext
calm-ai/
├── ai-assistants/          # AI provider configuration files
│   ├── claude.json         # Claude Code configuration
│   ├── codex.json          # Codex configuration
│   ├── copilot.json        # GitHub Copilot configuration
│   └── kiro.json           # AWS Kiro/Q configuration
├── templates/              # Handlebars templates
│   └── CALM.chatmode_template.md
├── tools/                  # Individual tool prompt files
│   ├── architecture-creation.md
│   ├── documentation-creation.md
│   ├── flow-creation.md
│   ├── interface-creation.md
│   ├── node-creation.md
│   ├── pattern-creation.md
│   └── ...
└── package.json
```

---

## 3. documentation.js YAML Configuration for Doc Organization

The `documentation.yml` configuration file allows organizing generated API docs with a table of contents, grouping, narrative sections, and external markdown files.

### Basic Configuration
```yaml
# documentation.yml
toc:
  - Map
  - LngLat
  - LngLatBounds
```

### With Narrative Sections
```yaml
toc:
  - Map
  - name: Geography
    description: |
      These are ways of representing locations
      and areas on the sphere. Use these classes
      for coordinate manipulation.
  - LngLat
  - LngLatBounds
```

### Using External Markdown Files
```yaml
toc:
  - Map
  - name: Geography
    file: docs/geography.md
  - LngLat
  - LngLatBounds
```

### Grouped Documentation with Children
```yaml
toc:
  - name: Core Classes
    description: |
      The main classes for working with maps
    children:
      - Map
      - MapOptions
      - Camera
  - name: Geography
    children:
      - LngLat
      - LngLatBounds
      - Point
  - name: Navigation
    description: |
      Helper functions for navigation
    children:
      - shortestPath
      - calculateDistance
```

### Apply Configuration via CLI
```bash
documentation build src/** -f html -o docs --config documentation.yml
```

---

## 4. Recommended Documentation Folder Structure (Synthesis)

Combining best practices from all sources, a well-organized documentation folder structure:

```
docs/
├── README.md                 # Documentation index / entry point
├── overview/                 # Project overview, goals, audience
│   └── index.md
├── getting-started/          # Tutorials, quick start guides
│   ├── installation.md
│   └── quickstart.md
├── guides/                   # How-to guides (goal-oriented)
│   ├── setup/
│   └── deployment/
├── architecture/             # Architecture documentation
│   ├── overview.md           # C4 context diagram + description
│   ├── decisions/            # ADRs (Architecture Decision Records)
│   │   ├── adr-001-use-postgres.md
│   │   └── adr-002-auth-strategy.md
│   ├── components/           # Component diagrams and specs
│   └── flows/                # Flow documentation
├── api/                      # API reference documentation
│   └── reference.md
├── operations/               # Deployment, monitoring, runbooks
│   └── deployment.md
└── diagrams/                 # Architecture diagrams (C4, Mermaid)
    ├── context.diagram.puml
    └── container.diagram.puml
```

### Key Principles
1. **Separate by audience and purpose** — tutorials, how-tos, reference, explanation (see doc-sprawl-prevention.md for the Diátaxis framework)
2. **Colocate when it makes sense** — keep feature-specific docs with feature code
3. **Use private folders** for internal implementation details (Next.js `_folder` pattern)
4. **Version architecture docs** alongside code, not in separate wikis
5. **Use a config file** (YAML/JSON) to control TOC, ordering, and grouping of generated docs
