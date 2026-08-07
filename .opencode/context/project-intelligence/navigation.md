<!-- Context: project-intelligence/nav | Priority: high | Version: 2.4 | Updated: 2026-08-06 (v2.4: mapa reconciliado con la estructura real de carpetas) -->

# Project Intelligence

> Start here for quick project understanding. These files bridge business and technical domains.

## Structure

```
.opencode/context/project-intelligence/
├── navigation.md              # This file - quick overview
├── business-domain.md         # Business context and problem statement
├── technical-domain.md        # Stack, patterns, naming, standards, security
├── business-tech-bridge.md    # How business needs map to solutions
├── decisions-log.md           # Major decisions with rationale (18 entries; #12-#18 live)
├── living-notes.md            # Active issues, debt, open questions
├── errors/
│   └── tech-knowledge.md      # Full error catalog with code examples
├── lookup/
│   ├── decision-details.md    # Alternatives tables (#1-#11)
│   └── decision-archive.md    # Historical decisions #1-#11 (full text)
└── development/
    ├── navigation.md          # Development knowledge index
    ├── concepts/              # API response, component refactor, i18n, delegation, upsert
    ├── examples/              # Clean route, mock entity upsert, mock transaction, segment
    ├── guides/                # Deploy to Vercel, refactor large components, rollback
    └── lookup/                # Commands, mock coverage table, files list
```

## Quick Routes

| What You Need | File | Description |
|---------------|------|-------------|
| Understand the "why" | `business-domain.md` | Problem, users, value proposition |
| Understand the "how" | `technical-domain.md` | Stack, patterns, naming, standards, security |
| Tech stack at a glance | `technical-domain.md` → Primary Stack | Framework, DB, ORM, auth, deploy |
| Copy-paste API pattern | `technical-domain.md` → Code Patterns | Auth→Zod→Prisma→Response flow |
| Component pattern | `technical-domain.md` → Code Patterns | Server default, client when needed |
| Naming conventions | `technical-domain.md` → Naming Conventions | kebab-case, PascalCase, camelCase |
| Code standards | `technical-domain.md` → Code Standards | Strict TS, Prisma, Server Components |
| Security requirements | `technical-domain.md` → Security Requirements | Auth, Zod, Prisma, env vars |
| See the connection | `business-tech-bridge.md` | Business → technical mapping |
| Know the context | `decisions-log.md` | Why decisions were made (18 entries; #12-#18 live, #1-#11 in archive) |
| Current state | `living-notes.md` | Active issues and open questions |
| Error catalog | `errors/tech-knowledge.md` | Known errors with code examples and prevention |
| Pitfalls quick-ref | `technical-domain.md` → Known Pitfalls | High-level gotchas organized by domain |
| Refactor pattern | `development/concepts/component-refactor-pattern.md` | Split large components into segments |
| API response standards | `development/concepts/api-response-standards.md` | Response shape conventions for API routes |
| i18n pattern | `development/concepts/i18n-next-intl-pattern.md` | next-intl setup and usage without routing |
| Task delegation | `development/concepts/task-delegation-workflow.md` | CodeReviewer gate per subtask |
| Upsert pattern | `development/concepts/upsert-entity-pattern.md` | Upsert for global entities |
| Mock patterns | `development/examples/mock-entity-upsert.md` | Prisma mock methods checklist |
| Transaction mocks | `development/examples/mock-transaction.md` | Prisma $transaction mock pattern |
| Clean route example | `development/examples/clean-route-handler.md` | Minimal POST route handler example |
| Segment example | `development/examples/segment-component.md` | Form segment component pattern |
| Deploy guide | `development/guides/deploy-to-vercel.md` | Manual deploy with env vars |
| Refactor guide | `development/guides/refactor-large-components.md` | Procedure for refactoring large components |
| Rollback procedures | `development/guides/rollback-procedures.md` | Rollback steps after deploys |
| Commands | `development/lookup/plan-c-commands.md` | Test, git, deploy, task CLI |
| Mock coverage table | `development/lookup/mock-coverage-table.md` | Prisma mock coverage per entity |
| Files list | `development/lookup/plan-c-files-list.md` | Files modified in Plan C |

## Quick Reference (from technical-domain.md v2.0)

```
Stack:  Next.js 14 + TypeScript 5.5 + PostgreSQL 14 + Prisma 5.19 + TailwindCSS/shadcn/ui
Auth:   NextAuth.js v5 (JWT) + Credentials + bcryptjs
API:    Next.js App Router → auth() → Zod.parse → prisma.create → Response
UI:     Server Components default, "use client" for interactivity only
DB:     Prisma ORM, junction tables w/ compound keys (@@id), never raw SQL
```

## Usage

**New Team Member / Agent**:
1. Start with `navigation.md` (this file)
2. Read `technical-domain.md` for all code patterns and standards
3. Follow onboarding checklist in each file

**Quick Reference**:
- Code patterns → `technical-domain.md` (Code Patterns section)
- Naming rules → `technical-domain.md` (Naming Conventions table)
- Security → `technical-domain.md` (Security Requirements section)
- Business context → `business-domain.md`

## Integration

This folder is referenced from:
- `.opencode/context/core/standards/project-intelligence.md` (standards and patterns)
- `.opencode/context/core/system/context-guide.md` (context loading)

See `.opencode/context/core/context-system.md` for the broader context architecture.

## Maintenance

Keep this folder current:
- Update when business direction changes
- Document decisions as they're made
- Review `living-notes.md` regularly
- Archive resolved items from decisions-log.md

**Management Guide**: See `.opencode/context/core/standards/project-intelligence-management.md` for complete lifecycle management including:
- How to update, add, and remove files
- How to create new subfolders
- Version tracking and frontmatter standards
- Quality checklists and anti-patterns
- Governance and ownership

See `.opencode/context/core/standards/project-intelligence.md` for the standard itself.

## Evolución

- **v2.4 (2026-08-06)**: mapa reconciliado con la estructura real de carpetas — `lookup/` (decision-details.md y decision-archive.md) vive al nivel raíz de la inteligencia del proyecto, no dentro de `errors/`; el árbol de `development/` refleja los archivos reales (concepts: api-response-standards, component-refactor-pattern, i18n-next-intl-pattern, task-delegation-workflow, upsert-entity-pattern; examples: clean-route-handler, mock-entity-upsert, mock-transaction, segment-component; guides: deploy-to-vercel, refactor-large-components, rollback-procedures; lookup: mock-coverage-table, plan-c-commands, plan-c-files-list). Rutas rápidas ampliadas con los archivos existentes y actualizado el registro de decisiones (18 entradas; #12–#18 vivas). Las referencias anteriores se conservan como histórico en las secciones precedentes.
