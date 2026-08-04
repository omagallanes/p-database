<!-- Context: development/backend/examples | Priority: medium | Version: 1.0 | Updated: 2026-07-17 -->

# Example: Temporary Admin Endpoint for Bulk Operations

**Pattern**: Create a disposable admin-only GET endpoint for one-time data migrations or bulk assignments. Delete the file after execution.

---

## When to Use
- One-time bulk data migrations (assign categories, backfill fields, cleanup)
- Admin-only data repair operations

## The Pattern

1. **File location**: `app/api/system/{operation-name}/route.ts`
2. **Auth guard**: `auth()` + `session.user.role === "admin"` — double-gate
3. **Logic**: Find records needing action → perform mutation → return summary
4. **Post-execution**: Delete the file → commit → deploy

## Example: Assign Category to All Prompts

```typescript
// app/api/system/assign-category/route.ts
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const category = await prisma.category.findUnique({
      where: { slug: "existentes" },
    })
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" }, { status: 404 }
      )
    }

    const promptsWithoutCategory = await prisma.prompt.findMany({
      where: {
        categories: { none: { categoryId: category.id } },
      },
      select: { id: true },
    })

    if (promptsWithoutCategory.length > 0) {
      await prisma.promptCategory.createMany({
        data: promptsWithoutCategory.map((p) => ({
          promptId: p.id,
          categoryId: category.id,
        })),
      })
    }

    return NextResponse.json({
      updated: promptsWithoutCategory.length,
      total: await prisma.prompt.count(),
      category: { id: category.id, name: category.name, slug: category.slug },
    })
  } catch (error) {
    console.error("Error assigning category:", error)
    return NextResponse.json(
      { error: "Failed to assign category" }, { status: 500 }
    )
  }
}
```

## Key Rules
1. **GET is fine** for one-offs (no POST needed)
2. **Admin-only** — never expose to regular users
3. **Log errors** for Vercel debugging
4. **Return a summary** — verify execution counts
5. **Delete immediately** after execution — no dead code

**Reference**: Commits `6302787` (create), `2201462` (temp auth), `9d54180` (cleanup)

**Related**: `backend/concepts/nextjs-api-patterns.md`, `backend/errors/api-common-errors.md`
