<!-- Context: project-intelligence/nav | Priority: high | Version: 2.3 | Updated: 2026-08-06 -->

# Project Intelligence

> Start here for quick project understanding. These files bridge business and technical domains.

## Structure

```
.opencode/context/project-intelligence/
├── navigation.md              # This file - quick overview
├── business-domain.md         # Business context and problem statement
├── technical-domain.md        # Stack, patterns, naming, standards, security (v2.2)
├── business-tech-bridge.md    # How business needs map to solutions
├── decisions-log.md           # Major decisions with rationale (v2.3)
├── living-notes.md            # Active issues, debt, open questions
├── errors/
│   └── tech-knowledge.md      # Full error catalog with code examples (v1.1)
└── development/
    ├── navigation.md          # Development knowledge index (v1.0)
    ├── concepts/              # Component refactor, API response, upsert, delegation
    ├── examples/              # Mock patterns, segment component, clean route
    ├── guides/                # Refactor, rollback, deploy procedures
    └── lookup/                # Commands, mock coverage, files list
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
| Know the context | `decisions-log.md` | Why decisions were made (13 entries, 2026-08-06) |
| Current state | `living-notes.md` | Active issues and open questions |
| Error catalog | `errors/tech-knowledge.md` | Known errors with code examples and prevention |
| Pitfalls quick-ref | `technical-domain.md` → Known Pitfalls | High-level gotchas organized by domain |
| Refactor pattern | `development/concepts/component-refactor-pattern.md` | Split large components into segments |
| Mock patterns | `development/examples/mock-entity-upsert.md` | Prisma mock methods checklist |
| Deploy guide | `development/guides/deploy-to-vercel.md` | Manual deploy with env vars |
| Commands | `development/lookup/plan-c-commands.md` | Test, git, deploy, task CLI |

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
