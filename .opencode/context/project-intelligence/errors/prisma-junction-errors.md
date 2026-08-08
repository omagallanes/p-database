<!-- Context: project-intelligence/errors/prisma-junction-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Prisma: Junction Tables N:M

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. IDs Compuestos en Junction Tables para Relaciones N:M

**Estado:** ✅ Validado  
**Código:** `prisma/schema.prisma:183-225`  
**Descripción:** Las junction tables para relaciones N:M deben usar IDs compuestos (`@@id([campo1, campo2])`) en lugar de IDs simples generados (`@id @default(cuid())`). Los IDs simples impiden crear múltiples relaciones para un mismo registro padre.

**Prevención:**
- Siempre usar `@@id([promptId, platformId])` para junction tables N:M
- Verificar el schema con `prisma validate` antes de ejecutar seed
- Probar con múltiples relaciones para un mismo prompt durante desarrollo

**Código correcto:**
```prisma
model PromptPlatform {
  promptId   String
  platformId String
  prompt     Prompt   @relation(fields: [promptId], references: [id], onDelete: Cascade)
  platform   Platform @relation(fields: [platformId], references: [id], onDelete: Cascade)

  @@id([promptId, platformId])  // ✅ ID compuesto
  @@index([promptId])
  @@index([platformId])
}
```

**Código incorrecto:**
```prisma
model PromptPlatform {
  promptId   String   @id @default(cuid())  // ❌ ID simple
  platformId String
  // ...
}
```

**Riesgo:** Error P2002 (Unique constraint failed) al crear múltiples relaciones para un mismo prompt.

---

## 2. Migración de Datos String → Relaciones N:M

**Estado:** ✅ Validado  
**Código:** `prisma/migrate-data.ts`  
**Descripción:** Para migrar campos string existentes a relaciones N:M, se debe leer todos los registros con campos no nulos, crear/obtener entidades con `upsert`, crear entradas en junction tables con `upsert`, y envolver todo en `$transaction` para atomicidad.

**Prevención:**
- Usar `upsert` tanto para entidades como para junction tables
- Normalizar valores antes de buscar/crear (trim, uppercase, etc.)
- Envolver en `$transaction` para garantizar atomicidad
- Loggear progreso para debugging

**Código de ejemplo:**
```typescript
await prisma.$transaction(async (tx) => {
  const prompts = await tx.prompt.findMany({
    where: { platform: { not: null } }
  })

  for (const prompt of prompts) {
    const platformName = prompt.platform.trim().toUpperCase()
    const platform = await tx.platform.upsert({
      where: { slug: platformName.toLowerCase() },
      update: {},
      create: { name: platformName, slug: platformName.toLowerCase() }
    })
    await tx.promptPlatform.upsert({
      where: { promptId_platformId: { promptId: prompt.id, platformId: platform.id } },
      update: {},
      create: { promptId: prompt.id, platformId: platform.id }
    })
  }
})
```

**Riesgo:** Datos inconsistentes, duplicados en junction tables, migración parcial.

---

## 3. Seed con Relaciones N:M Múltiples

**Estado:** 🔧 Corregido (ya no aplica al seed actual simplificado)  
**Código:** `prisma/seed.ts`, `package.json` (postinstall, prisma.seed)  
**Descripción:** El seed actual fue simplificado drásticamente. Solo crea 2 usuarios sin prompts ni relaciones N:M. El patrón documentado aquí es técnicamente correcto pero ya no está implementado.

**Prevención:**
- Crear prompt con `prisma.prompt.create()`
- Luego crear relaciones con `prisma.promptPlatform.create()` múltiples veces
- Esto evita errores de unique constraint con IDs compuestos

**Código de ejemplo:**
```typescript
const prompt = await prisma.prompt.create({
  data: { id: 'sample-3', title: '...', platform: 'CURSOR' }
})

await prisma.promptPlatform.create({
  data: { promptId: prompt.id, platformId: platformCursor.id }
})
await prisma.promptPlatform.create({
  data: { promptId: prompt.id, platformId: platformChatGPT.id }
})
```

**Riesgo:** Error P2002 (Unique constraint failed) al crear múltiples relaciones con nested writes.

---

## 4. Campos Nullable en Interfaces TypeScript

**Estado:** ✅ Validado  
**Código:** `components/prompt/PromptForm.tsx:55-89`  
**Descripción:** Cuando el schema Prisma tiene campos opcionales (`Type?`), las interfaces TypeScript deben aceptar `Type | null`. De lo contrario, el build fallará con errores de tipo.

**Prevención:**
- Verificar schema Prisma para campos opcionales (`String?`, `Int?`, etc.)
- Actualizar interfaces TypeScript para aceptar `Type | null`
- Ejecutar `npm run build` después de cambios de schema para detectar errores temprano

**Código de ejemplo:**
```typescript
// Schema: platform String?
interface PromptFormProps {
  prompt?: {
    platform: string | null  // ✅ Acepta null
    // ...
  }
}
```

**Riesgo:** Error de TypeScript en build: "Type 'null' is not assignable to type 'string'".

---

## 5. `$transaction` Explícito para Múltiples Junction Tables

**Estado:** ✅ Validado  
**Código:** `app/api/prompts/[id]/route.ts`  
**Descripción:** Cuando se actualizan múltiples relaciones N:M simultáneamente (hasta 6 junction tables), todas las operaciones delete+create deben envolverse en `$transaction` explícito para garantizar atomicidad. Si una operación falla, todas se revierten.

**Prevención:**
- Siempre usar `prisma.$transaction(async (tx) => {...})` para updates que modifican relaciones N:M
- Delete TODAS las relaciones primero (todas las junction tables), luego crear las nuevas
- Incluir TODAS las junction tables en la misma transacción
- Retornar el resultado del update desde dentro de la transacción
- No mezclar operaciones fuera de la transacción con operaciones dentro

**Código de ejemplo:**
```typescript
await prisma.$transaction(async (tx) => {
  // Delete ALL existing relations first
  await tx.promptTag.deleteMany({ where: { promptId } })
  await tx.promptCategory.deleteMany({ where: { promptId } })
  await tx.promptPlatform.deleteMany({ where: { promptId } })
  await tx.promptClientProject.deleteMany({ where: { promptId } })
  await tx.promptUseCase.deleteMany({ where: { promptId } })
  await tx.promptModelHint.deleteMany({ where: { promptId } })

  // Then create new relations
  return await tx.prompt.update({
    where: { id: promptId },
    data: {
      tags: tagIds?.length ? { create: tagIds.map(id => ({ tagId: id })) } : undefined,
      categories: categoryIds?.length ? { create: categoryIds.map(id => ({ categoryId: id })) } : undefined,
      platforms: platformIds?.length ? { create: platformIds.map(id => ({ platformId: id })) } : undefined,
      clientProjects: clientProjectIds?.length ? { create: clientProjectIds.map(id => ({ clientProjectId: id })) } : undefined,
      useCases: useCaseIds?.length ? { create: useCaseIds.map(id => ({ useCaseId: id })) } : undefined,
      modelHints: modelHintIds?.length ? { create: modelHintIds.map(id => ({ modelHintId: id })) } : undefined,
    },
    include: { tags: { include: { tag: true } }, /* etc */ }
  })
})
```

**Riesgo:** Pérdida de datos si el create falla después del delete. Las relaciones se pierden permanentemente sin posibilidad de recuperación.

---
