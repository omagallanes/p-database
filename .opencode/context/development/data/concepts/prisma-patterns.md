<!-- Context: development/data/concepts | Priority: high | Version: 1.0 | Updated: 2026-07-14 -->

# Concept: Prisma Patterns

**Core Idea**: Prisma ORM with PostgreSQL, singleton client with global cache, schema-first design, never raw SQL. Binary targets configured for multiplatform deployment (native, linux-musl, debian).

**Key Points**:
- **Singleton pattern**: `lib/prisma.ts` caches client in `globalThis` to prevent hot-reload connection leaks
- **Schema-first**: All models defined in `prisma/schema.prisma`; migrations via `npx prisma migrate`
- **Data source**: PostgreSQL via `DATABASE_URL` env var; migrated from SQLite
- **Binary targets**: 4 platforms for Vercel serverless compatibility
- **Logging**: Query+error+warn in dev, errors only in production
- **postinstall hook**: `prisma generate` must run after `npm install` for cloud deploys

**Client singleton** (`lib/prisma.ts`):
```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Common query patterns**:
- **Create with relations**: `prisma.prompt.create({ data: { ...body, userId, tags: { create: tagIds.map(id => ({ tagId: id })) } } })`
- **List with filters**: `prisma.prompt.findMany({ where: { status: { in: statuses } }, include: { tags: { include: { tag: true } } }, orderBy: { createdAt: 'desc' } })`
- **Idempotent upsert**: `prisma.tag.upsert({ where: { slug }, update: { name }, create: { name, slug } })`
- **Transaction**: `prisma.$transaction([...])` for atomic multi-table operations

**Reference**: `prisma/schema.prisma`, `lib/prisma.ts`, `prisma/seed.ts`

**Related**: `concepts/prisma-junction-tables.md`, `errors/prisma-gotchas.md`
