<!-- Context: project-intelligence/errors/prisma-schema-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Prisma: Schema y Tipos

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Junction Tables Requieren Operaciones Explícitas

**Estado:** ✅ Validado  
**Código:** `app/api/import/prompts/route.ts`, `prisma/schema.prisma`  
**Descripción:** Relaciones N:M con junction tables no pueden actualizarse con campos directos (`categoryId`). Requieren operaciones explícitas en la junction table.

**Prevención:**
- Usar `prisma.promptCategory.create()` para crear relaciones
- Usar `prisma.promptCategory.deleteMany()` para eliminar relaciones
- Envolver operaciones en `$transaction` para atomicidad

**Código de referencia:**
```typescript
// ❌ INCORRECTO: categoryId no existe en Prompt
await prisma.prompt.update({
  where: { id: promptId },
  data: { categoryId },  // Error: Property no existe
})

// ✅ CORRECTO: Usar junction table explícitamente
await prisma.$transaction([
  prisma.promptCategory.deleteMany({ where: { promptId: promptId } }),
  prisma.promptCategory.create({
    data: { promptId: promptId, categoryId },
  }),
])

// ✅ CORRECTO: Para múltiples relaciones
await prisma.$transaction(
  categoryIds.map((id) =>
    prisma.promptCategory.create({
      data: { promptId: prompt.id, categoryId: id },
    })
  )
)
```

**Riesgo:** Build falla con errores de TypeScript; relaciones no se crean/actualizan correctamente.

---

## 2. Null Coalescing para Campos No Nullable

**Estado:** ✅ Validado  
**Código:** `app/api/import/prompts/route.ts`  
**Descripción:** Campos de Prisma definidos como `String @default("VALUE")` no son nullable en el schema. Datos externos (import, API) pueden tener `null` para estos campos, causando errores de TypeScript. Usar null coalescing (`??`) para proporcionar valores por defecto.

**Prevención:**
- Inspeccionar schema de Prisma para identificar campos no nullable
- Usar `??` para campos con valor por defecto: `field: data.field ?? "DEFAULT"`
- Usar `||` para strings vacíos: `field: data.field || "es"`
- Validar que todos los campos no nullable tienen fallback

**Código de referencia:**
```typescript
await prisma.prompt.create({
  data: {
    type: promptData.type ?? "USER",         // Schema: String @default("USER")
    status: promptData.status ?? "DRAFT",    // Schema: String @default("DRAFT")
    language: promptData.language || "es",   // Schema: String @default("es")
    isFavorite: promptData.isFavorite ?? false, // Boolean @default(false)
  },
})
```

**Riesgo:** Build falla con errores de TypeScript; runtime errors si datos externos tienen `null`.

---

## 3. Compatibilidad Dual durante Transición de Schema

**Estado:** ✅ Validado  
**Código:** `app/api/prompts/route.ts`  
**Descripción:** Durante migración de campos string simples a relaciones N:M, mantener AMBOS campos en Zod schemas como opcionales permite transición gradual sin romper clientes existentes.

**Prevención:**
- Mantener campo legacy como opcional: `platform: z.enum([...]).optional()`
- Añadir campo nuevo como opcional: `platformIds: z.array(z.string()).optional()`
- Documentar claramente en comentarios que es temporal para transición
- Planificar eliminación de campo legacy en Sprint futuro
- Aceptar ambos formatos en handlers de API

**Código de ejemplo:**
```typescript
const createPromptSchema = z.object({
  // Legacy fields (opcional durante transición)
  platform: z.enum(["CHATGPT", "CURSOR", ...]).optional(),
  useCase: z.string().optional(),
  clientOrProject: z.string().optional(),
  modelHint: z.string().optional(),
  categoryId: z.string().optional(),

  // New N:M fields (preferidos)
  platformIds: z.array(z.string()).optional(),
  useCaseIds: z.array(z.string()).optional(),
  clientProjectIds: z.array(z.string()).optional(),
  modelHintIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
})
```

**Riesgo:** Errores de TypeScript en compilación, clientes existentes dejan de funcionar.

---

## 4. Switch Statement para Acceso Dinámico Type-Safe en Prisma

**Estado:** ✅ Validado  
**Código:** `app/api/import/upsert-entity.ts`  
**Descripción:** Cuando se necesita acceso dinámico a propiedades de Prisma (ej: `prisma[entityType]`), TypeScript no puede inferir tipos correctamente. Usar switch statement en lugar de acceso dinámico con `as any` preserva type safety.

**Prevención:**
- Evitar acceso dinámico `prisma[key as any]` cuando sea posible
- Usar switch statement para cada tipo de entidad
- Separar lógica de búsqueda y creación en switches independientes
- Retornar tipos consistentes (`{ id: string }`) desde todos los casos

**Código de referencia:**
```typescript
async function upsertEntity(
  entityType: "platform" | "clientProject" | "useCase" | "modelHint",
  name: string
): Promise<string> {
  let existing: { id: string } | null = null

  switch (entityType) {
    case "platform":
      existing = await prisma.platform.findFirst({...})
      break
    case "clientProject":
      existing = await prisma.clientProject.findFirst({...})
      break
    case "useCase":
      existing = await prisma.useCase.findFirst({...})
      break
    case "modelHint":
      existing = await prisma.modelHint.findFirst({...})
      break
  }

  if (existing) return existing.id

  let created: { id: string }
  switch (entityType) {
    case "platform":
      created = await prisma.platform.create({...})
      break
    case "clientProject":
      created = await prisma.clientProject.create({...})
      break
    case "useCase":
      created = await prisma.useCase.create({...})
      break
    case "modelHint":
      created = await prisma.modelHint.create({...})
      break
  }

  return created.id
}
```

**Riesgo:** Build falla con errores de TypeScript; `as any` oculta errores de tipo.

---

# Despliegue y Migración PostgreSQL
