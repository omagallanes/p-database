<!-- Context: development/data/concepts | Priority: high | Version: 1.0 | Updated: 2026-07-14 -->

# Concept: Prisma Junction Tables (N:M)

**Core Idea**: 6 junction tables with compound primary keys (`@@id([promtId, entityId])`) and `onDelete: Cascade` on **both** foreign keys. Enables unlimited multi-value taxonomy per prompt.

**Key Points**:
- **6 junction tables**: PromptTag, PromptCategory, PromptPlatform, PromptClientProject, PromptUseCase, PromptModelHint
- **Compound key**: `@@id([promptId, entityId])` — no surrogate ID needed, enforces uniqueness
- **Double cascade**: Both FKs have `onDelete: Cascade` — deleting a Prompt removes all junctions, deleting a Tag also removes all junctions
- **Indexes**: Both FK columns indexed individually for query performance
- **Backward compat**: Legacy string fields (`platform`, `useCase`, etc.) kept for v1.0 import compatibility

**Schema pattern**:
```prisma
model PromptTag {
  promptId String
  tagId    String
  prompt   Prompt @relation(fields: [promptId], references: [id], onDelete: Cascade)
  tag      Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([promptId, tagId])
  @@index([promptId])
  @@index([tagId])
}
```

**Querying with junctions**:
```typescript
// Create with relations
await prisma.prompt.create({
  data: {
    ...body,
    tags: { create: tagIds.map(id => ({ tagId: id })) },
    platforms: { create: platformIds.map(id => ({ platformId: id })) },
  }
})

// Query with includes
await prisma.prompt.findMany({
  include: {
    tags: { include: { tag: true } },
    platforms: { include: { platform: true } },
  }
})
```

**Reference**: `prisma/schema.prisma` (lines 126-238), `prisma/migrate-data.ts` (legacy→N:M migration)

**Related**: `concepts/prisma-patterns.md`, `errors/prisma-gotchas.md`
