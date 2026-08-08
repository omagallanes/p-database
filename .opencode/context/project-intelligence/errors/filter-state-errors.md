<!-- Context: project-intelligence/errors/filter-state-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Estado de Filtros (URL-Driven)

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Multi-Select con Checkboxes y URL-Driven State

**Estado:** ✅ Validado  
**Código:** `components/prompt/PromptFilters.tsx`  
**Descripción:** PromptFilters.tsx usa función genérica `toggleFilter(key, value)` con `params.append()` y `params.getAll()` para manejar arrays en URL.

**Prevención:**
- Usar función genérica `toggleFilter(key, value)` para todos los filtros
- Usar `params.append()` para añadir múltiples valores del mismo parámetro
- Usar `params.getAll()` para leer todos los valores de un parámetro
- Mantener estado en URL, no en estado local
- Al eliminar un valor, reconstruir array con `filter()` y `forEach()` con `params.append()`

**Código de ejemplo (toggleFilter genérico):**
```typescript
const toggleFilter = (key: string, value: string) => {
  const params = new URLSearchParams(searchParams.toString())
  const currentValues = params.getAll(key)

  if (currentValues.includes(value)) {
    params.delete(key)
    currentValues.filter((v) => v !== value).forEach((v) => params.append(key, v))
  } else {
    params.append(key, value)
  }

  router.push(`/prompts?${params.toString()}`)
}
```

**Código de ejemplo (Render de checkboxes):**
```typescript
{platforms.map((platform) => (
  <label key={platform.id} className="flex items-center gap-2">
    <input type="checkbox"
      checked={selectedPlatformIds.includes(platform.id)}
      onChange={() => toggleFilter("platformIds", platform.id)}
    />
    {platform.name}
  </label>
))}
```

**Riesgo:** Estado no persiste en URL; filtros se pierden al recargar.

---

## 2. Lógica OR con `some` en Prisma para Filtros Multi-Selección

**Estado:** ✅ Validado  
**Código:** `app/(app)/prompts/page.tsx`, `app/api/prompts/route.ts`  
**Descripción:** Para filtros multi-selección con lógica OR (prompt debe tener AL MENOS UNA de las categorías seleccionadas), usar `some` en el where clause de Prisma.

**Prevención:**
- Usar `some` con `in` para filtros multi-selección con lógica OR
- Si se necesitara lógica AND en futuro, usar `every` en lugar de `some`
- Combinar con `in` para verificar múltiples IDs: `some: { platformId: { in: platformIds } }`

**Código de ejemplo (Lógica OR):**
```typescript
if (platformIds && platformIds.length > 0) {
  where.platforms = {
    some: { platformId: { in: platformIds } }
  }
}

if (categoryIds && categoryIds.length > 0) {
  where.categories = {
    some: { categoryId: { in: categoryIds } }
  }
}
```

**Riesgo:** Si en futuro se necesita lógica AND, usar `some` daría resultados incorrectos.

---

## 3. Parseo de Arrays desde searchParams en Server Components

**Estado:** ✅ Validado  
**Código:** `app/(app)/prompts/page.tsx`  
**Descripción:** searchParams en Next.js puede devolver `string` o `string[]`. Se necesita utilitario para convertir a array consistente.

**Prevención:**
- Usar patrón condicional: `Array.isArray(x) ? x : x ? [x] : []`
- Aplicar para todos los parámetros que pueden ser arrays
- Validar casos: URL sin parámetro, con un valor, con múltiples valores

**Código de ejemplo:**
```typescript
const platformIds = Array.isArray(searchParams.platformIds)
  ? searchParams.platformIds
  : searchParams.platformIds
  ? [searchParams.platformIds]
  : []

const categoryIds = Array.isArray(searchParams.categoryIds)
  ? searchParams.categoryIds
  : searchParams.categoryIds
  ? [searchParams.categoryIds]
  : []
```

**Riesgo:** Error de tipo en tiempo de ejecución; filtros no funcionan con múltiples valores.

---

# Seguridad y Autorización
