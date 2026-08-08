<!-- Context: development/backend/concepts | Priority: high | Version: 1.1 | Updated: 2026-08-06 -->

# Concept: Row-Level Isolation Pattern

**Core Idea**: Cada usuario ve y manipula SOLO sus propios registros. El `userId` del propietario se aplica como filtro `where` en TODA query de prompts (páginas server y APIs): `findMany`, `update`, `findUnique` y `_count` de agregación. Sin `where.userId` no hay aislamiento.

**Key Points**:
- **Página server** (`app/(app)/prompts/page.tsx`): `getPrompts(searchParams, userId)` recibe el `userId` de la sesión y usa `where: { userId }`; `getCategories`/`getTags` filtran el contador con `_count: { select: { prompts: { where: { userId } } } }` (soporte nativo de Prisma).
- **API GET** (`app/api/prompts/route.ts`): exige sesión (`auth()` → 401 `unauthorized`) y añade `where.userId = session.user.id`. Un GET sin auth que devuelva todo es un defecto de aislamiento.
- **Escrituras**: `update`/`delete`/`findUnique` filtran `where: { id, userId }` (o `checkOwnership`). Si el registro no existe o no es del usuario → **404** (`promptNotFound`), no 403: no revelar existencia de recursos ajenos.
- **Import/Export**: la importación asigna `userId` del importador; la exportación filtra por `userId` (ya implementado así).
- **Semántica**: el 404 es deliberado (previene enumeración); el 401 en GET protege datos antes de cualquier filtrado.
- **Excepción "compartidos" (isShared)**: el GET `[id]` permite acceso si `userId === session.user.id` **OR** (`prompt.isShared === true` — solo lectura, el cliente no muestra edición); el PATCH usage permite incrementar si el prompt es propio OR compartido; el PUT/DELETE **siguen exigiendo propiedad** (checkOwnership). La lista `/shared` usa `where: { isShared: true, userId: { not: session.user.id } }` (solo prompts de OTROS).

**Quick example**:
```ts
// GET /api/prompts — aislamiento obligatorio
const session = await auth()
if (!session?.user?.id) return NextResponse.json({ error: t("unauthorized") }, { status: 401 })
const prompts = await prisma.prompt.findMany({ where: { userId: session.user.id }, ... })
// PATCH usage — propiedad estricta, 404 sin revelar existencia
await prisma.prompt.update({ where: { id: params.id, userId: session.user.id }, data: { usageCount: { increment: 1 } } })
```

**Reference**: `app/(app)/prompts/page.tsx` · `app/api/prompts/route.ts` · `app/api/prompts/[id]/usage/route.ts` · `app/api/prompts/[id]/route.ts`

**Related**: `errors/api-common-errors.md` (usage sin auth) · `../../project-intelligence/lookup/decisions-log.md` #14 · `concepts/nextjs-api-patterns.md`
