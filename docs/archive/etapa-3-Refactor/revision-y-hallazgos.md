# Revisión y Hallazgos — Plan C

**Fecha:** 2026-07-14 (actualizado: 2026-07-15)
**Propósito:** Hallazgos de la revisión cruzada entre el plan, contexto del proyecto (ContextScout), documentación externa (ExternalScout), skills y análisis propio.
**Estado:** ✅ Plan C completado — todos los hallazgos abordados y resueltos
**Base:** `temp/plan-c/reporte-y-plan-5-puntos.md` (294 líneas)

---

## Metodología de Revisión

Para cada punto del plan se verificó:
1. **Capa funcional del código** — ¿qué capa del sistema toca?
2. **Finalidad y objetivos** — ¿son correctos y completos?
3. **Interdependencias** — entradas/salidas entre tareas
4. **Flujo E/S** — ¿el orden de ejecución es óptimo?
5. **ContextScout** — estándares del proyecto que aplican
6. **ExternalScout** — documentación externa actualizada
7. **Skills** — consistencia con skills cargados

---

## Resumen de Hallazgos

| # | Hallazgo | Tipo | Punto | Severidad |
|:-:|----------|:----:|:-----:|:---------:|
| H1 | P1a ignora que hay 4 entidades con el mismo patrón (no solo platform) | Omisión | P1a | 🔴 Alta |
| H2 | P1b omite el estándar `{ data }` documentado en `nextjs-api-patterns.md` | Omisión | P1b | 🔴 Alta |
| H3 | P1b/P4: Estrategia A requiere cambiar TODAS las rutas, no solo `[id]` | Imprecisión | P1b | 🟡 Media |
| H4 | P1c y P2 tocan el mismo archivo (`PromptFilters.tsx`) pero están en distintos batches | Conflicto de merge | P1c+P2 | 🔴 Alta |
| H5 | P2 no verifica que eliminar `request` de route handlers sea seguro en Next.js | Omisión | P2 | 🟡 Media |
| H6 | P3a no se alinea con la estructura documentada en `form-patterns.md` (3 segmentos) | Desalineación | P3a | 🟡 Media |
| H7 | P3b omite tech debt documentado: duplicación `getPrompts` entre page/route | Omisión | P3b | 🟡 Media |
| H8 | P5 correcto — no cambiar. Confirmado por estándares del proyecto. | Confirmación | P5 | 🟢 Info |
| H9 | No hay referencia a estándares del proyecto en ninguna tarea | Omisión | Todos | 🟡 Media |
| H10 | No hay métricas de tracking (task-management skill no mencionado) | Omisión | Todos | 🟢 Baja |
| H11 | P1b requiere decisión del usuario sin datos suficientes en el plan | Incompleto | P1b | 🟡 Media |

---

## Hallazgo H1 — P1a: El fix propuesto cubre solo 1 de 4 entidades

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` líneas 33-51

**Lo que dice el plan:**
El fix muestra un ejemplo para `platform.create`, pero `upsertEntity` maneja 4 tipos de entidad mediante un switch (líneas 131-152 de `import/route.ts`):
- `platform` → `prisma.platform.create`
- `clientProject` → `prisma.clientProject.create`
- `useCase` → `prisma.useCase.create`
- `modelHint` → `prisma.modelHint.create`

**Lo que omite:**
- El mock setup en `import.test.ts` (líneas 22-93) mockea **todas** las entidades con `jest.fn()` sin return
- **Todas** las 4 entidades necesitan `create` mockeado con valor de retorno, no solo `platform`

**Corrección requerida:** El fix debe especificar que las 4 entidades necesitan `create: jest.fn().mockResolvedValue({ id: "..." })` en el mock setup. O idealmente un helper que genere el mock por entidad.

**Tampoco menciona:** Que `findFirst` debe ser mockeado para cada entidad según el test: `mockResolvedValue(null)` para entidades nuevas, `mockResolvedValue({ id: "existing-id" })` para entidades existentes. Depende del escenario del test.

---

## Hallazgo H2 — P1b: El plan omite el estándar `{ data }` del proyecto

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` líneas 60-82

**Lo que dice el plan:**
Presenta dos estrategias (A y B) sin referencia a ningún estándar del proyecto.

**ContextScout encontró:**
- `development/backend/concepts/nextjs-api-patterns.md` define el patrón:
  ```
  return NextResponse.json({ data: prompt }, { status: 201 })
  ```
- `project-intelligence/technical-domain.md` (Code Patterns) confirma:
  ```
  return NextResponse.json({ data: prompt }, { status: 201 })
  ```
  Error handling: `{ error: "Invalid input", details: error.errors }`

**ExternalScout confirmó:**
- No hay formato mandatorio de Next.js para respuestas JSON
- El proyecto YA tiene un estándar `{ data }` documentado (aunque no siempre seguido)

**Conclusión:** El plan debe recomendar Estrategia A (estandarizar) basándose en el estándar ya documentado del proyecto. La Estrategia B (solo cambiar tests) perpetuaría la inconsistencia.

---

## Hallazgo H3 — P1b: Estrategia A requiere revisar 18 endpoints, no solo `[id]`

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` línea 72

**Lo que dice el plan:**
"Estrategia A: alinear las respuestas de la API a un formato consistente (`{ data: ..., success: true }`) y actualizar los tests para GET"

**ContextScout encontró:**
- `development/backend/lookup/api-routes.md` lista **18 endpoints**. No todos siguen el mismo formato.
- Ejemplos de formatos actuales:
  - `GET /api/prompts/[id]` → `NextResponse.json(prompt)` (raw, sin `{ data }`)
  - `PUT /api/prompts/[id]` → `NextResponse.json({ data: prompt })` (con `{ data }`)
  - `DELETE /api/prompts/[id]` → `NextResponse.json({ data: { message: "..." } })` (con `{ data }` pero otro formato)
  - `GET /api/prompts` → `NextResponse.json({ items: [...], total: N })` (formato paginado)

**Corrección requerida:** Si se adopta Estrategia A, el plan debe:
1. Especificar que se estandariza SOLO `GET/PUT/DELETE /api/prompts/[id]` (3 endpoints), no los 18
2. Reconocer que otros endpoints (ej. list con paginación) tienen formatos diferentes y no deben cambiarse en este plan
3. Usar el estándar del proyecto `{ data, success }` como formato, no `{ data }` solo

---

## Hallazgo H4 — P1c y P2: Conflicto de merge en `PromptFilters.tsx`

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` líneas 230-237 (orden de ejecución)

**Lo que dice el plan:**
```
Batch 1 — Fixes Rápidos (paralelo)
  ├── P1c: Fix "Clear filters" en PromptFilters (2 archivos)
  └── P1a: Fix mocks en import.test.ts (1 archivo)  

Batch 2 — P1b + P2 (paralelo, son archivos distintos)
  ├── P1b: Fix prompts-[id].test.ts
  └── P2: Eliminar 21 warnings no-unused-vars (8 archivos)
```

**Problema:** P1c modifica `PromptFilters.tsx` (Batch 1) y P2 también modifica `PromptFilters.tsx` (Batch 2). Son batches distintos → conflicto de merge si se ejecutan secuencialmente como batches separados.

**Solución:** P1c y la parte de P2 que toca `PromptFilters.tsx` deben fusionarse en la misma tarea o ejecutarse en el mismo batch.

**Dependencia real:**

```
PromptFilters.tsx modificado por:
  ├── P1c: +aria-label (1 línea)
  └── P2: -7 imports (líneas 7-14)

Ambos cambios deben aplicarse al mismo tiempo → mismo batch
```

---

## Hallazgo H5 — P2: No verifica seguridad de eliminar `request` en Next.js

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` líneas 137-138

**Lo que dice el plan:**
"los route handlers `GET(request: NextRequest)` pueden omitir el parámetro `request` si no lo usan"

**ExternalScout confirmó:** ✅ Correcto. Next.js permite `export async function GET() { }` sin parámetros.

**Pero el plan omite verificar:**
- Que ningún handler use `request.nextUrl`, `request.headers`, `request.cookies` — hay 9 handlers y cada uno debe verificarse individualmente (el plan asume que ninguno lo necesita sin mostrar evidencia)
- Que los handlers tengan `searchParams` en el segundo parámetro (ej: `GET(request, { params })`) — a veces el `request` se necesita solo por sintaxis aunque no se use

**Corrección:** El plan debe confirmar para cada uno de los 9 handlers que NO usan `request`, no asumirlo. La tabla tiene la línea exacta de la función — debería leer cada archivo para confirmar.

---

## Hallazgo H6 — P3a: Desalineación con estructura documentada en `form-patterns.md`

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` líneas 163-168

**Lo que dice el plan:**
Propone dividir PromptForm en 5 partes:
- `PromptForm.tsx` (orquestador)
- `PromptFormBasic.tsx` (title, description, body)
- `PromptFormRelations.tsx` (categories, tags, platforms, etc.)
- `PromptFormAdvanced.tsx` (version, changelog, notes)
- `TaxonomyMultiSelect.tsx` (componente multi-select)

**ContextScout encontró en `form-patterns.md`:**
El contexto del proyecto sugiere:
- `BasicInfoSegment` (title, description, body)
- `MetadataSegment` (type, status, language, favorite)
- `AdvancedSegment` (version, changelog, notes)
- `TaxonomyMultiSelect` (compartido para categories, tags, platforms, etc.)

**Desalineación:** El plan usa nombres diferentes y no sigue la estructura de 3 segmentos. También omite que `MetadataSegment` debe incluir type/status/language/favorite (campos que están en el PromptForm actual).

**Corrección:** Alinear nombres y estructura con lo ya documentado en `form-patterns.md`, o justificar por qué se desvía.

---

## Hallazgo H7 — P3b: Omite tech debt de duplicación `getPrompts`

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` líneas 172-195

**ContextScout encontró:**
- `project-intelligence/business-tech-bridge.md` (Common Misalignments) documenta:
  > "`getPrompts` logic is duplicated between `page.tsx` and `/api/prompts/route.ts`"

**Lo que omite el plan:**
Al dividir `import/route.ts` también debería considerar extraer la lógica Prisma compartida a `lib/queries/prompts.ts`. La ruta de import y la ruta de prompts usan queries Prisma similares que podrían compartirse.

**Corrección:** El plan para P3b debería incluir un paso de extracción de queries Prisma compartidas a `lib/queries/` como parte del refactor, o documentar que se abordará en un plan futuro.

---

## Hallazgo H8 — P5: Confirmado — correcto, no cambiar

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` líneas 199-220

**Verificación contra estándares del proyecto:**
| Estándar | Aplica | Resultado |
|----------|:------:|:---------:|
| `camelCase` para funciones | ✅ | `isPrismaClientKnownRequestError` en camelCase |
| `function` declaration (estilo del archivo) | ✅ | Coherente con el resto de `migrate-data.ts` |
| < 50 líneas por función | ✅ | 5 líneas |
| `strict: true` — no `any` | ✅ | Usa `unknown`, no `any` |
| Type predicate syntax | ✅ | `error is Prisma.PrismaClientKnownRequestError` |

**Veredicto:** Confirmado — no cambiar. El estándar de `code-quality.md` y `technical-domain.md` se cumple. La sugerencia de `const` arrow function violaría consistencia con el resto del archivo.

---

## Hallazgo H9 — Ninguna tarea referencia estándares del proyecto

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` completo

**Problema:** Ninguna de las tareas del plan referencia los archivos de contexto que aplican:
- P1 (tests) no referencia `core/standards/test-coverage.md` ni `jest.config.js`
- P2 (linting) no referencia `.eslintrc.json`
- P3 (componentes) no referencia `code-quality.md` (límites de tamaño)
- P4 (API format) no referencia `nextjs-api-patterns.md`

**Corrección:** Cada tarea debe listar los context_files y reference_files relevantes como entrada.

---

## Hallazgo H10 — No hay métricas de tracking del plan

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` líneas 224-248

**Problema:** El plan define 4 batches secuenciales pero no sugiere cómo trackear progreso.

**Skill `task-management` disponible:** El proyecto tiene el skill `task-management` que permite:
- `status` — ver progreso
- `next` — ver siguiente tarea disponible
- `complete` — marcar tarea completada
- `validate` — validar integridad

**Corrección:** El plan debería sugerir el uso de `task-management` skill para trackear progreso, o al menos mencionar cómo se medirá el avance.

---

## Hallazgo H11 — P1b: Decisión sin datos suficientes

**Archivo:** `temp/plan-c/reporte-y-plan-5-puntos.md` línea 75

**Lo que dice el plan:**
"Decisión requerida: ¿Estandarizar el formato de respuesta o solo corregir tests?"

**Problema:** El plan presenta la decisión sin dar datos para tomarla. ContextScout encontró que el proyecto YA tiene un estándar documentado (`{ data }` en `nextjs-api-patterns.md`), lo que inclina la balanza hacia Estrategia A.

**Corrección:** El plan debe presentar:
1. El estándar existente del proyecto
2. Los endpoints que siguen vs no siguen el estándar
3. Costo de cada estrategia (archivos, líneas, riesgo)
4. Una recomendación basada en datos

---

## Recomendaciones de Corrección

### Prioridad 🔴 Alta (debe corregirse antes de ejecutar)

| Hallazgo | Corrección |
|:--------:|------------|
| H1 — P1a | Especificar que las 4 entidades necesitan mock de `create` |
| H4 — P1c+P2 | Fusionar P1c y la parte PromptFilters de P2 en el mismo batch |
| H9 — Contexto | Cada tarea debe listar context_files + reference_files |

### Prioridad 🟡 Media (mejora calidad del plan)

| Hallazgo | Corrección |
|:--------:|------------|
| H2 — P1b | Referenciar estándar `{ data }` del proyecto (nextjs-api-patterns.md) |
| H3 — P1b | Acotar alcance de Estrategia A a solo `[id]` endpoints |
| H5 — P2 | Verificar cada handler individualmente que no usa `request` |
| H6 — P3a | Alinear nombres de segmentos con `form-patterns.md` |
| H7 — P3b | Incluir extracción de queries Prisma compartidas |
| H11 — P1b | Dar datos suficientes para decidir estrategia |

### Prioridad 🟢 Baja (nice to have)

| Hallazgo | Corrección |
|:--------:|------------|
| H8 — P5 | ✅ Ya documentado como correcto |
| H10 — Tracking | Referenciar task-management skill |

---

## Orden de Ejecución Optimizado (tras hallazgos)

```
Batch 0 — Setup
  ├── task-management: crear task.json con 5 features y dependencias
  └── Commit inicial

Batch 1 — Archivos compartidos (PromptFilters + import test)
  ├── P1c + P2(PromptFilters): aria-label + eliminar 7 imports (MISMO ARCHIVO)
  └── P1a: Fix mocks import.test.ts (1 archivo)

Batch 2 — Tests prompts-[id] + API format + otros unused-vars
  ├── P1b: Fix prompts-[id].test.ts (usando Estrategia A recomendada)
  └── P2(resto): 8 archivos restantes (7 route handlers + PromptForm + categories)

Batch 3 — CodeReview + Verificación
  ├── CodeReviewer revisa Batch 1 + 2
  ├── npm run lint → 0 warnings no-unused-vars
  ├── npm run build → Compiled successfully
  └── npm test → 57 tests pass (9 suites, 0 failures)
  └── Commit final

APRUEBA USUARIO →  

Batch 4 — P3: Componentes grandes (postergable)
  ├── P3a: PromptForm split (3 segmentos + TaxonomyMultiSelect)
  ├── P3b: import/route split (5 archivos)
  └── CodeReviewer + Build + Tests
```

**Diferencia clave vs orden anterior:**
- P1c y P2(PromptFilters) ahora en el mismo batch → sin conflicto de merge
- P1b con Estrategia A recomendada (no pendiente de decisión)
- P2(resto) en Batch 2 con P1b
- task-management tracking sugerido en Batch 0

---

## Archivos de Estándares que Deben Referenciarse por Tarea

| Tarea | context_files (estándares) | reference_files (código) |
|-------|---------------------------|-------------------------|
| P1a | `core/standards/test-coverage.md`, `project-intelligence/technical-domain.md` | `tests/api/import.test.ts`, `app/api/import/prompts/route.ts` |
| P1b | `development/backend/concepts/nextjs-api-patterns.md`, `project-intelligence/technical-domain.md` | `tests/api/prompts-[id].test.ts`, `app/api/prompts/[id]/route.ts` |
| P1c+P2-PromptFilters | `core/standards/code-quality.md`, `.eslintrc.json` | `components/prompt/PromptFilters.tsx`, `tests/components/PromptFilters.test.tsx` |
| P2-resto | `.eslintrc.json`, `core/standards/code-quality.md` | 9 archivos de API routes + PromptForm + categories/page |
| P3a | `development/frontend/concepts/form-patterns.md`, `core/standards/code-quality.md`, `core/essential-patterns.md` | `components/prompt/PromptForm.tsx` |
| P3b | `core/standards/code-quality.md`, `core/workflows/component-planning.md` | `app/api/import/prompts/route.ts` |

---

## Datos No Confirmados (requieren verificación adicional)

| Dato | Dónde debería estar | Estado |
|------|---------------------|:------:|
| Si los 9 handlers NO usan `request` | Cada archivo de API route | ❌ No confirmado — verificar individualmente |
| Si `GET /api/prompts` sigue formato paginado | `app/api/prompts/route.ts` | ❌ No confirmado — el plan asume formato pero no lo lee |
| Si P3b debe extraer queries a `lib/queries/` | `business-tech-bridge.md` | ❌ No confirmado — documentado como tech debt pero no priorizado |
| Número exacto de `alert()` reemplazados en B.4b | Plan B | ❌ No confirmado — el plan A/B asumió 28 pero no se re-verificó |
| Si `jest.config.js` necesita cambios por P1a | `jest.config.js` | ❌ No confirmado — no se verificó el archivo |

---

## Conclusión de la Revisión

El plan `reporte-y-plan-5-puntos.md` contiene 11 hallazgos que mejoran su calidad:
- **3 correcciones obligatorias** (H1, H4, H9)
- **6 mejoras de calidad** (H2, H3, H5, H6, H7, H11)
- **1 confirmación** (H8)
- **1 mejora opcional** (H10)

**Estimación de esfuerzo corregido:** ~5 hrs (vs ~4.5 hrs original) — aumento por H1 (más mocks) y H6 (alineación con estándares).

**Riesgo general:** 🟡 Medio (baja de 🔴 por identificar conflictos de merge y estándares omitidos).

**Siguiente paso:** ¿Apruebas los hallazgos para que DocWriter actualice el plan?
