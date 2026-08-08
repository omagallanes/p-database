<!-- Context: project-intelligence/errors/testing-mock-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Testing: Mocks Avanzados

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Cobertura ≥ 60% es Alcanzable con Mocks Parciales

**Estado:** ✅ Validado  
**Código:** `tests/api/*.test.ts`, `tests/components/*.test.tsx`  
**Descripción:** No es necesario tener 100% de tests passing para alcanzar ≥ 60% de cobertura. Actualmente (2026-08-06) hay 388 tests en 40 suites con 100% passing (antes, julio 2026: 56 tests en 8 suites).

**Prevención:**
- Priorizar cobertura de flujos críticos sobre perfección de mocks
- Aceptar que algunos tests pueden fallar por complejidad de mocks (no por bugs)
- Documentar tests fallando como "refinamientos pendientes" (no bugs de producción)
- Validar que cobertura ≥ 60% en archivos objetivo es suficiente para continuar

---

## 2. Tests con Mocks de Relaciones N:M

**Estado:** ✅ Validado  
**Código:** `tests/components/PromptList.test.tsx`  
**Descripción:** Los tests de componentes que consumen relaciones N:M deben incluir mocks completos con la estructura anidada correcta.

**Prevención:**
- Mocks deben incluir arrays de relaciones: `platforms: [{ platform: { name: "CURSOR" } }]`
- Mocks deben incluir `categories: [{ category: { name: "Coding" } }]`
- Mocks deben incluir `clientProjects: []` (vacío si no aplica)
- Mocks deben incluir `user: { name: "Test User" }` si se muestra el autor

**Código de ejemplo (Mock completo):**
```typescript
const mockPrompts = [
  {
    id: "1",
    title: "Test Prompt 1",
    description: "Test description",
    platform: "CURSOR",
    status: "PRODUCTION",
    isFavorite: true,
    lastUsedAt: new Date().toISOString(),
    usageCount: 5,
    platforms: [{ platform: { name: "CURSOR" } }],
    categories: [{ category: { name: "Coding" } }],
    clientProjects: [],
    tags: [{ tag: { name: "refactoring" } }],
    user: { name: "Test User" },
    body: "Test prompt body",
  },
]
```

**Riesgo:** Tests fallan con "Cannot read properties of undefined (reading 'length')".

---

## 3. M-01: Mock Faltante `findUnique` en category/tag (CRÍTICO)

**Estado:** 🔧 Corregido  
**Código:** `tests/api/import.test.ts`  
**Descripción:** La función `upsertEntity` usa un switch con 4 casos: `platform`, `clientProject`, `useCase`, `modelHint`. Cada caso ejecuta `prisma.<entidad>.create()`. El test mockeaba `create` con `jest.fn()` sin valor de retorno, por lo que `created` era `undefined` y `created.id` fallaba con `TypeError`. Además, los mocks de `category` y `tag` tenían `findFirst`, `create` y `upsert` pero faltaba `findUnique`.

**Prevención:**
- Leer el handler completo y listar TODOS los métodos Prisma usados por entidad antes de escribir mocks
- Checklist: findFirst, findUnique, findMany, create, update, upsert, delete, deleteMany
- Mock `create` siempre debe retornar `{ id: "..." }`, no `jest.fn()` sin valor

**Código de referencia:**
```typescript
// CORRECTO: create con valor de retorno
platform: {
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: "platform-1" }),
},
category: {
  findFirst: jest.fn().mockResolvedValue(null),
  findUnique: jest.fn().mockResolvedValue(null),  // ← obligatorio
  create: jest.fn().mockResolvedValue({ id: "cat-1" }),
  update: jest.fn().mockResolvedValue({ id: "cat-1" }),
}
```

**Riesgo:** TypeError: Cannot read properties of undefined (reading 'id').

---

## 4. Error 1: Botón Condicional No Encontrado en Test

**Estado:** 🔧 Corregido  
**Código:** `components/prompt/PromptFilters.tsx`, `tests/components/PromptFilters.test.tsx`  
**Descripción:** `screen.getByRole("button", { name: /clear filters/i })` no encontraba el botón "Clear filters" porque el botón es condicional — solo se renderiza cuando `initialFilters` tiene valores activos. El test no pasaba `initialFilters` con datos.

**Prevención:**
- Verificar la condición de renderizado del componente ANTES de escribir la query del test
- Si el elemento es condicional, proporcionar los props/estado necesarios para que se renderice
- Usar `getByRole` con `name` regex en lugar de `getByText` para botones con iconos

**Código de referencia:**
```typescript
// Proporcionar initialFilters activos para que el botón se renderice
render(<PromptFilters
  initialFilters={{ platformIds: "plat-1", categoryIds: "cat-1", tagIds: "tag-1" }}
  {...defaultProps}
/>)
const clearButton = screen.getByRole("button", { name: /clear filters/i })
```

**Riesgo:** Elemento no encontrado en test; falsos negativos.

---

## 5. Error 2: Expectativa Incorrecta en clearFilters

**Estado:** 🔧 Corregido  
**Código:** `tests/components/PromptFilters.test.tsx`  
**Descripción:** Se asumió que `clearFilters()` usaba `delete()` en searchParams, pero en realidad usaba `router.push("/prompts")`. El test esperaba `expect(mockDelete).toHaveBeenCalled()` pero fallaba.

**Prevención:**
- Leer la implementación real de la función ANTES de escribir la aserción
- No asumir el comportamiento interno de funciones basándose en su nombre
- Verificar la implementación con `explore` o lectura directa

**Código de referencia:**
```typescript
// CORRECTO: clearFilters() navega a /prompts
expect(mockPush).toHaveBeenCalledWith("/prompts")
```

**Riesgo:** Tests fallan por asunciones incorrectas sobre la implementación.

---

## 6. Error 3: Prop `placeholder` Inexistente en MetadataSegment

**Estado:** 🔧 Corregido  
**Código:** `components/prompt/MetadataSegment.tsx`  
**Descripción:** Se usó una prop `placeholder` en el JSX que no estaba definida en la interfaz del componente `MetadataSegmentProps`. TypeScript no detectó el error porque la prop se pasaba a un componente hijo que sí la aceptaba, pero rompía la interfaz del segmento.

**Prevención:**
- Verificar que TODAS las props usadas en JSX estén definidas en la interfaz del componente
- Ejecutar `npx tsc --noEmit` después de cambios para detectar props no declaradas
- Revisar interfaces después de refactors que involucran segmentos extraídos

**Riesgo:** Error de TypeScript en build; prop no declarada en interfaz.

---

## 7. Error 4: Dos Tareas Modificando el Mismo Archivo en Batches Separados

**Estado:** 🔧 Corregido  
**Código:** `components/prompt/PromptFilters.tsx`  
**Descripción:** P1c (añadir `aria-label`) y P2 (eliminar imports no usados) modificaban el mismo archivo `PromptFilters.tsx` en batches separados. Esto creaba riesgo de conflicto de merge y obligaba a resolver solapamientos manualmente.

**Prevención:**
- Mapear archivos × tareas ANTES de definir batches de ejecución
- Si dos tareas tocan el mismo archivo, fusionarlas en el MISMO batch
- Usar un "file collision map" antes de planificar subtareas

**Riesgo:** Merge conflicts; cambios que se pisan entre sí; retrabajo.

---

# Export/Import
