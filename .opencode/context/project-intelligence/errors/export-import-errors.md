<!-- Context: project-intelligence/errors/export-import-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Export/Import

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Transformación de Relaciones N:M a Arrays de Nombres para Export

**Estado:** ✅ Validado  
**Código:** `app/api/export/prompts/route.ts`  
**Descripción:** Para exportación JSON, transformar relaciones N:M a arrays simples de nombres usando `.map()` sobre relaciones anidadas.

**Prevención:**
- Usar include anidado: `{ platforms: { include: { platform: true } } }`
- Transformar con `.map()`: `platforms: prompt.platforms.map((pp) => pp.platform.name)`
- Aplicar mismo patrón para todas las relaciones N:M

**Código de ejemplo:**
```typescript
// Include anidado
include: {
  platforms: { include: { platform: true } },
  categories: { include: { category: true } },
  clientProjects: { include: { clientProject: true } },
  useCases: { include: { useCase: true } },
  modelHints: { include: { modelHint: true } },
  tags: { include: { tag: true } },
}

// Transformación a arrays de nombres
platforms: prompt.platforms.map((pp) => pp.platform.name),
categories: prompt.categories.map((pc) => pc.category.name),
clientProjects: prompt.clientProjects.map((cp) => cp.clientProject.name),
useCases: prompt.useCases.map((uc) => uc.useCase.name),
modelHints: prompt.modelHints.map((mh) => mh.modelHint.name),
tags: prompt.tags.map((pt) => pt.tag.name),
```

**Riesgo:** JSON incluye objetos complejos en lugar de nombres simples; import no puede procesar.

---

## 2. Campos Legacy para Compatibilidad durante Transición

**Estado:** ✅ Validado  
**Código:** `app/api/export/prompts/route.ts`  
**Descripción:** Mantener campos legacy en el formato de exportación para permitir compatibilidad con imports antiguos durante transición de schema (string simple → relaciones N:M).

**Prevención:**
- Incluir campos legacy en el JSON exportado junto a nuevos campos N:M
- Campos legacy para F4: `platform`, `clientOrProject`, `useCase`, `modelHint`
- NO incluir campos que ya no existen en schema (ej: `categoryId` eliminado en SF-1.3)

**Código de ejemplo:**
```typescript
{
  // Nuevos campos N:M (formato v2.0)
  platforms: prompt.platforms.map((pp) => pp.platform.name),
  categories: prompt.categories.map((pc) => pc.category.name),

  // Campos legacy (compatibilidad con imports antiguos)
  platform: prompt.platform,         // String simple (puede ser null)
  clientOrProject: prompt.clientOrProject,
  useCase: prompt.useCase,
  modelHint: prompt.modelHint,
}
```

**Riesgo:** Imports antiguos dejan de funcionar; ruptura de compatibilidad.

---

# Patrones Comunes y Lecciones Generales
