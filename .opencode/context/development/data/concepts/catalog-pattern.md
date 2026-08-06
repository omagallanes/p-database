<!-- Context: development/data/concepts | Priority: high | Version: 1.0 | Updated: 2026-08-06 -->

# Concept: Catalog Pattern (Lookup Tables)

**Core Idea**: Los valores de un campo con conjunto cerrado (Type, Status, Language) viven en tablas lookup sembradas (`name`, `slug @unique`, `sortOrder`) en vez de arrays hardcodeados en el frontend. El prompt conserva el valor como **string** (sin FK): el catálogo es la lista de valores permitidos, no una relación. Formulario y filtros leen las opciones de la BD.

**Key Points**:
- **Schema**: `Type`, `Status`, `Language` (patrón `Platform`): `id, name, slug @unique, sortOrder, createdAt, updatedAt`. Seed con los valores actuales (Type: SYSTEM/USER/TOOL; Status: DRAFT/TESTED/PRODUCTION; Language: lista de `PromptFilters`).
- **Sin FK**: los campos `type/status/language` de Prompt siguen siendo strings — no hay migración de datos ni junction tables (catálogos ≠ entidades N:M). Cambiar el nombre en el catálogo NO cambia los prompts existentes.
- **Lectura vs escritura**: GET de catálogos accesible a CUALQUIER usuario autenticado (formulario/filtros); rutas de escritura (`POST/PUT/DELETE`) admin-only (401).
- **Búsqueda**: `?search=` → `where.name contains` (mode insensitive); las entidades solo tienen `name/slug` (sin descripción).
- **DELETE desvincula**: borrar un elemento del catálogo solo elimina el valor de la lista; los prompts conservan su string. Para N:M (Platform/UseCase/...), el `onDelete: Cascade` de las junctions limpia las asociaciones automáticamente.
- **Server → props**: las páginas server cargan los catálogos y pasan las opciones como props a componentes cliente (`PromptForm`, `PromptFilters`, `MetadataSegment`) — no fetch en cliente.

**Quick example**:
```ts
// Prisma: catálogo sembrado
model Type {
  id String @id @default(cuid())
  name String
  slug String @unique
  sortOrder Int @default(0)
}
// DELETE elemento N:M en uso → desvincula vía Cascade
await prisma.platform.delete({ where: { id } }) // junctions se limpian solas
```

**Reference**: `prisma/schema.prisma` · `app/(app)/taxonomy/*` · `app/api/{platforms,use-cases,model-hints,client-projects}/route.ts`

**Related**: `concepts/prisma-junction-tables.md` · `project-intelligence/decisions-log.md` #16 · `../frontend/concepts/form-patterns.md`
