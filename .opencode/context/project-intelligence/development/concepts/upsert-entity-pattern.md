<!-- Context: project-intelligence/development/upsert-entity | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Concept: Upsert Pattern for Global Entities

**Core Idea**: For entities with name uniqueness (Platform, ClientProject, UseCase, ModelHint), use normalized upsert by slug to prevent duplicates and ensure idempotent creation.

**Key Points**:
- Normalize name: `data.name.trim().toUpperCase()` (comparison-safe)
- Create slug: `normalizedName.toLowerCase()` (unique key)
- Upsert by slug: `prisma.entity.upsert({ where: { slug }, update: {}, create: { ... } })`
- Wrap in `$transaction` if multiple entities created from same source
- For Category/Tag: use `findUnique` + `create`/`update` pattern instead (more control)

**Example**:
```typescript
const normalizedName = data.name.trim().toUpperCase()
const normalizedSlug = normalizedName.toLowerCase()

const entity = await prisma.platform.upsert({
  where: { slug: normalizedSlug },
  update: {},
  create: { name: normalizedName, slug: normalizedSlug },
})
```

**Reference**: `app/api/import/upsert-entity.ts`

**Related**:
- concepts/component-refactor-pattern.md (extraction order)
- examples/mock-entity-upsert.md
- lookup/mock-coverage-table.md
