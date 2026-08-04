<!-- Context: development/data/lookup | Priority: medium | Version: 1.0 | Updated: 2026-07-14 -->

# Lookup: Prisma Quick Reference

**Purpose**: Common Prisma operations in this project. All examples use the singleton from `lib/prisma.ts`.

---

## Client Setup
```typescript
import { prisma } from "@/lib/prisma"  // Singleton, cached globally
```

## Create with N:M Relations
```typescript
const prompt = await prisma.prompt.create({
  data: {
    title, body, type, userId,
    tags: { create: tagIds.map(id => ({ tagId: id })) },
    platforms: { create: platformIds.map(id => ({ platformId: id })) },
  }
})
```

## List with Filters + Includes
```typescript
const prompts = await prisma.prompt.findMany({
  where: {
    userId: session.user.id,
    status: { in: selectedStatuses },
    tags: { some: { tagId: { in: tagIds } } },
  },
  include: { tags: { include: { tag: true } }, categories: { include: { category: true } } },
  orderBy: { createdAt: 'desc' },
})
```

## Single Record with Full Includes
```typescript
const prompt = await prisma.prompt.findUnique({
  where: { id: params.id },
  include: {
    tags: { include: { tag: true } },
    platforms: { include: { platform: true } },
    categories: { include: { category: true } },
    clientProjects: { include: { clientProject: true } },
    useCases: { include: { useCase: true } },
    modelHints: { include: { modelHint: true } },
  }
})
```

## Idempotent Upsert (Seed/Import)
```typescript
const tag = await prisma.tag.upsert({
  where: { slug: tagSlug },
  update: { name: tagName },
  create: { name: tagName, slug: tagSlug },
})
```

## Atomic Transaction
```typescript
await prisma.$transaction([
  prisma.promptTag.deleteMany({ where: { promptId } }),
  prisma.prompt.create({ data: { ... } }),
])
```

## Search (AND across fields)
```typescript
where.AND = searchWords.map(word => ({
  OR: [
    { title: { contains: word, mode: "insensitive" } },
    { description: { contains: word, mode: "insensitive" } },
    { body: { contains: word, mode: "insensitive" } },
  ]
}))
```

## Migrations
```bash
npx prisma migrate dev --name "description"  # Dev: create + apply migration
npx prisma migrate deploy                     # Prod: apply pending migrations
npx prisma generate                           # Regenerate client
npx prisma db push                            # Quick sync (dev only)
```

**Reference**: `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrate-data.ts`
