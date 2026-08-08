<!-- Context: development/backend/nav | Priority: high | Version: 1.3 | Updated: 2026-08-06 -->

# Backend Development

**Purpose**: Server-side patterns for this project (Next.js App Router, Prisma, NextAuth)

---

## Structure

```
backend/
├── navigation.md
├── concepts/
│   ├── nextjs-api-patterns.md         # Auth→Zod→Prisma→Response pattern
│   ├── nextauth-setup.md              # NextAuth configuration + JWT
│   ├── auth-hardening-pattern.md      # Rate limiting BD + revocación tokenVersion
│   └── row-level-isolation-pattern.md # where.userId en toda query (aislamiento)
├── examples/
│   └── temp-admin-bulk-op.md          # Temp admin endpoint for bulk operations
├── guides/
│   └── prisma-nm-and-filters.md       # N:M AND filter pattern in Prisma
├── lookup/
│   ├── api-routes.md                  # All API routes quick reference
│   └── searchable-fields-dimensions.md # Search fields & filter dimensions
└── errors/
    └── api-common-errors.md           # Common API issues + solutions
```

---

## Quick Routes

| Task | Path |
|------|------|
| **API code pattern** | `concepts/nextjs-api-patterns.md` |
| **Auth setup** | `concepts/nextauth-setup.md` |
| **Auth hardening** (rate limit, revocación) | `concepts/auth-hardening-pattern.md` |
| **Row-level isolation** (userId en queries) | `concepts/row-level-isolation-pattern.md` |
| **Temp admin bulk endpoint** | `examples/temp-admin-bulk-op.md` |
| **N:M AND filter guide** | `guides/prisma-nm-and-filters.md` |
| **Search fields & dimensions** | `lookup/searchable-fields-dimensions.md` |
| **All API routes table** | `lookup/api-routes.md` |
| **Common errors** | `errors/api-common-errors.md` |

---

## Related Context

- **Data Layer** → `../data/navigation.md`
- **API Design Principles** → `../principles/concepts/api-design.md`
- **Project technical domain** → `../../project-intelligence/concepts/technical-domain.md`
- **Core Standards** → `../../core/standards/code-quality.md`
