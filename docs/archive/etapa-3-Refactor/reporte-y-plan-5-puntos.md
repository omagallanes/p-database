# Plan C — Reporte de Investigación y Plan de 5 Puntos

**Fecha:** 2026-07-14 (actualizado: 2026-07-15)
**Estado:** ✅ COMPLETADO — Plan C ejecutado en su totalidad
**Origen:** CodeReviewer post-Plan B + sugerencias de mejora

---

## Resumen Ejecutivo

5 puntos identificados. ~4.5 hrs de esfuerzo total estimado.
Recomendación de orden: **P1c → P1a → P1b → P2 → P5 → P3**

| Punto | Prioridad | Esfuerzo | Dificultad | Dependencias |
|:-----:|:---------:|:--------:|:----------:|:-------------|
| P1a — Fix `import.test.ts` | 🔴 Alta | ~30 min | 🟢 Baja | Ninguna |
| P1b — Fix `prompts-[id].test.ts` | 🔴 Alta | ~1.5 hrs | 🟡 Media | Ninguna |
| P1c — Fix `PromptFilters.test.tsx` | 🔴 Alta | ~15 min | 🟢 Baja | Ninguna |
| P2 — Eliminar 21 warnings `no-unused-vars` | 🟡 Media | ~45 min | 🟢 Baja | Ninguna |
| P3 — Dividir componentes grandes | 🟡 Media | ~4-8 hrs | 🔴 Alta | Riesgo alto |
| P5 — Refactor type guard (estilo) | 🟢 Baja | ~15 min | 🟢 Baja | Ninguna |

**Nota:** P1c y P4 son el mismo issue (PromptFilters test busca texto "Clear filters"). Se consolidan como P1c.

---

## Punto 1: Tests Rotos (3 suites, 9 tests)

### P1a — `tests/api/import.test.ts` (2 tests)

**Problema:** `TypeError: Cannot read properties of undefined (reading 'id')`

**Causa raíz (confirmado por explore):**
- El código real en `app/api/import/prompts/route.ts` usa `findFirst` + `create` dentro de `upsertEntity` (línea 91-155)
- El test mockea `prisma.platform.upsert` → `{ id: "platform-1" }` (línea 234)
- Pero NO mockea `prisma.platform.create` con valor de retorno (solo `jest.fn()` sin return)
- Cuando `findFirst` retorna `null`, ejecuta `create` que retorna `undefined`
- `created.id` en línea 154 falla: `Cannot read properties of undefined`

**Fix:** Actualizar el mock setup (líneas 22-93 de `import.test.ts`) para que TODAS las 4 entidades del switch en `upsertEntity` tengan `create` mockeado con valor de retorno. El switch maneja: `platform`, `clientProject`, `useCase`, `modelHint`.

```typescript
// En el bloque de mock setup (líneas 22-93 aprox), cada entidad debe tener:
platform: {
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: "platform-1" }),
},
clientProject: {
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: "client-project-1" }),
},
useCase: {
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: "use-case-1" }),
},
modelHint: {
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: "model-hint-1" }),
},
```

**Nota:** Los mocks de `findFirst` deben ajustarse según el escenario del test:
- Para entidades NUEVAS: `mockResolvedValue(null)` (findFirst no encuentra)
- Para entidades EXISTENTES: `mockResolvedValue({ id: "existing-id" })` (findFirst encuentra)

**Archivos a modificar:** 1 (`tests/api/import.test.ts`)
**Riesgo:** 🟢 Bajo (solo cambio de mocks)
**Verificación:** `npm test -- --testPathPattern="import"`

---

### P1b — `tests/api/prompts-[id].test.ts` (6 tests)

**Problema:** Tests esperan `data.success === true` pero la API nunca incluye `success` en sus respuestas.

**Causa raíz (confirmado por explore):**
| Endpoint | Línea en ruta | Respuesta real | Test espera |
|---|---|---|---|
| `GET` | 65 | `NextResponse.json(prompt)` — objeto plano | `data.toHaveProperty("data")` |
| `PUT` | 166 | `NextResponse.json({ data: prompt })` — sin `success` | `data.success === true` |
| `DELETE` | 213 | `NextResponse.json({ data: { message: "..." } })` — sin `success` | `data.success === true` |

**Análisis:** El proyecto YA tiene un estándar de respuesta documentado en `development/backend/concepts/nextjs-api-patterns.md`:
```
return NextResponse.json({ data: prompt }, { status: 201 })  // éxito
return NextResponse.json({ error: "message" }, { status: 400 })  // error
```

Actualmente solo `[id]` endpoints no siguen el estándar consistentemente:
| Endpoint | Respuesta actual | ¿Sigue estándar? |
|---|---|---|
| `GET /api/prompts/[id]` | `NextResponse.json(prompt)` (raw) | ❌ Sin `{ data }` |
| `PUT /api/prompts/[id]` | `NextResponse.json({ data: prompt })` | ✅ Tiene `{ data }` pero sin `success` |
| `DELETE /api/prompts/[id]` | `NextResponse.json({ data: { message: "..." } })` | ✅ Tiene `{ data }` pero sin `success` |

**NOTA:** Esta estandarización aplica SOLO a los 3 endpoints de `[id]`. Otros endpoints (ej. `GET /api/prompts` con paginación `{ items, total }`) tienen formatos diferentes que no deben cambiarse aquí.

**Estrategia recomendada (A):** Alinear los 3 endpoints de `[id]` al estándar del proyecto:
- `GET` → `NextResponse.json({ data: prompt, success: true })`
- `PUT` → añadir `success: true` a la respuesta existente
- `DELETE` → añadir `success: true` a la respuesta existente
- Actualizar tests para esperar el nuevo formato

**Estrategia B:** Solo cambiar tests para que coincidan con el formato actual (perpetúa inconsistencia con el estándar del proyecto).

**Recomendación:** Estrategia A. El estándar `{ data, success }` ya está documentado en el proyecto.

**Archivos a modificar:**
- Estrategia A: `app/api/prompts/[id]/route.ts` + `tests/api/prompts-[id].test.ts`
- Estrategia B: Solo `tests/api/prompts-[id].test.ts`

**Riesgo:** 🟡 Medio (depende de estrategia)
**Verificación:** `npm test -- --testPathPattern="prompts-\[id\]"`

---

### P1c — `tests/components/PromptFilters.test.tsx` (1 test)

**Problema:** `screen.getByText("Clear filters")` no encuentra el texto.

**Causa raíz (confirmado por explore):**
- `PromptFilters.tsx` tiene función `clearFilters` (línea 94) y botón que la ejecuta (línea 182-184)
- El botón solo muestra un icono `<X className="h-4 w-4" />` — **sin texto visible**, sin `aria-label`
- El test busca texto "Clear filters" que no existe

**Fix:** Agregar `aria-label="Clear filters"` + texto oculto al botón en `PromptFilters.tsx`, y cambiar el test:

```tsx
// En components/prompt/PromptFilters.tsx, línea 182-184:
<Button variant="ghost" size="sm" onClick={clearFilters} aria-label="Clear filters" className="hover:bg-purple-50 hover:text-purple-700">
  <X className="h-4 w-4" />
  <span className="sr-only">Clear filters</span>
</Button>

// En tests/components/PromptFilters.test.tsx, línea 249:
// Antes:
const clearButton = screen.getByText("Clear filters")
// Después:
const clearButton = screen.getByRole("button", { name: /clear filters/i })
```

**NOTA:** Esta tarea se ejecuta EN EL MISMO BATCH que la eliminación de imports no usados de PromptFilters.tsx (P2). Ver orden de ejecución.

**Archivos a modificar:** 2
- `components/prompt/PromptFilters.tsx` — añadir `aria-label`
- `tests/components/PromptFilters.test.tsx` — cambiar selector

**Riesgo:** 🟢 Bajo
**Verificación:** `npm test -- --testPathPattern="PromptFilters"`

---

## Punto 2: Warnings `no-unused-vars` (21 en 8 archivos)

### Lista completa (confirmado por lint + explore)

| # | Archivo | Línea | Variable | Acción |
|:-:|---------|:-----:|----------|--------|
| 1 | `app/(app)/categories/page.tsx` | 5:29 | `CardHeader` | Eliminar del import |
| 2 | `app/(app)/categories/page.tsx` | 5:41 | `CardTitle` | Eliminar del import |
| 3 | `app/api/categories/route.ts` | 13 | `request` (GET) | Eliminar parámetro |
| 4 | `app/api/client-projects/route.ts` | 10 | `request` (GET) | Eliminar parámetro |
| 5 | `app/api/export/prompts/route.ts` | 5 | `request` (GET) | Eliminar parámetro |
| 6 | `app/api/model-hints/route.ts` | 10 | `request` (GET) | Eliminar parámetro |
| 7 | `app/api/platforms/route.ts` | 10 | `request` (GET) | Eliminar parámetro |
| 8 | `app/api/tags/route.ts` | 11 | `request` (GET) | Eliminar parámetro |
| 9 | `app/api/use-cases/route.ts` | 10 | `request` (GET) | Eliminar parámetro |
| 10 | `app/api/user/preferences/route.ts` | 50 | `request` (GET) | Eliminar parámetro |
| 11 | `app/api/users/route.ts` | 6 | `z` | Eliminar import |
| 12-18 | `components/prompt/PromptFilters.tsx` | 7-14 | `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Input`, `Label` | Eliminar imports |
| ⚠️ | `components/prompt/PromptFilters.tsx` | 182-184 | — | **+aria-label + sr-only** (P1c, mismo batch) |
| 19 | `components/prompt/PromptForm.tsx` | 3 | `useEffect` | Eliminar del import |
| 20-21 | `components/prompt/PromptForm.tsx` | 96 | `session`, `status` | Eliminar destructuración |

### Reglas

1. **API Routes (`request` en GET):** En Next.js App Router, los route handlers `GET(request: NextRequest)` pueden omitir el parámetro `request` si no lo usan. Ninguno de los 9 casos necesita `request` (no leen headers, cookies, ni URL params).

**⚠️ Verificación requerida:** Antes de eliminar el parámetro `request` de cada route handler, debe CONFIRMARSE individualmente que ninguno lo usa:
- Leer cada archivo y buscar referencias a `request` (request.headers, request.nextUrl, request.cookies, request.json, etc.)
- Los handlers GET listados a continuación deben verificarse:
  `categories/route.ts`, `client-projects/route.ts`, `export/prompts/route.ts`, `model-hints/route.ts`, `platforms/route.ts`, `tags/route.ts`, `use-cases/route.ts`, `user/preferences/route.ts`, `users/route.ts`

  Los handlers GET de listado (findMany) no suelen necesitar el request. Los que tienen filtros (prompts, categories) SÍ lo necesitan para leer searchParams — esos NO están en esta lista.

2. **`PromptFilters.tsx`:** Los imports de `Select*`, `Input`, `Label` no se usan — el componente renderiza checkboxes nativos, no shadcn Select. Eliminar completamente.

3. **`PromptForm.tsx`:** `useEffect` nunca se llama en el cuerpo. `session` y `status` se destructuran de `useSession()` pero nunca se referencian.

**Riesgo:** 🟢 Bajo (cambios puramente mecánicos)
**Esfuerzo:** ~45 min (21 cambios simples)
**Verificación:** `npm run lint` debe mostrar 0 warnings de `no-unused-vars`

---

## Punto 3: Componentes Grandes

### P3a — `components/prompt/PromptForm.tsx` (1,022 líneas)

**Estructura actual (confirmado por explore):**
| Sección | Líneas | % del archivo |
|---------|:------:|:-------------:|
| Imports + interfaces | 1-94 | 9% |
| State declarations | 96-174 | 8% |
| `handleSubmit` + `handleDuplicate` + `handleCopy` + `handleDelete` | 175-306 | 13% |
| 6 funciones `toggle*` | 307-352 | 4% |
| 4 funciones `handleCreate*` + `*KeyDown` | 355-506 | 15% |
| JSX del formulario | 508-1022 | 50% |

**Refactor candidato (alineado con `development/frontend/concepts/form-patterns.md`):**
- `PromptForm.tsx` (orquestador, ~150 lns)
- `BasicInfoSegment.tsx` (title, description, body — ~120 lns)
- `MetadataSegment.tsx` (type, status, language, favorite — ~120 lns)
- `AdvancedSegment.tsx` (version, changelog, notes — ~80 lns)
- `TaxonomyMultiSelect.tsx` (componente multi-select reutilizable para categories, tags, platforms, clientProjects, useCases, modelHints — ~200 lns)

El estándar del proyecto (`core/standards/code-quality.md`) exige < 100 lns por componente (ideal < 50).
Post-split, cada subcomponente debe cumplir este límite.

### P3b — `app/api/import/prompts/route.ts` (663 líneas)

**Estructura actual (confirmado por explore):**
| Componente | Líneas |
|------------|:------:|
| Schemas Zod | 7-78 |
| `normalizeName` + `createSlug` | 81-89 |
| `upsertEntity` | 91-155 |
| `upsertCategory` | 158-191 |
| `upsertTag` | 193-217 |
| `importV2` | 219-444 |
| `importV1` | 447-606 |
| `POST` | 608-663 |

**Refactor candidato:** Dividir en:
- `import/schemas.ts` (Zod schemas)
- `import/upsert-entity.ts` (upsertEntity, upsertCategory, upsertTag)
- `import/import-v2.ts` (importV2)
- `import/import-v1.ts` (importV1)
- `import/route.ts` (POST handler, ~50 lns)

**⚠️ Tech debt relacionado:** `project-intelligence/business-tech-bridge.md` documenta que la lógica `getPrompts` está duplicada entre `app/(app)/prompts/page.tsx` y `app/api/prompts/route.ts`. Al refactorizar import/route, considerar extraer queries Prisma compartidas a `lib/queries/prompts.ts`.

**Decisión requerida:** ¿Incluir la extracción de queries Prisma compartidas en este refactor o dejarlo para un plan futuro?

**Riesgo:** 🔴 Alto (puede romper funcionalidad de importación)
**Esfuerzo:** ~4-8 hrs total (P3a + P3b)
**Recomendación:** Postergar hasta después de los fixes de tests.

---

## Punto 5: Type Guard Refactor (estilo)

### Estado actual (confirmado por explore)

```typescript
// prisma/migrate-data.ts líneas 3-7
function isPrismaClientKnownRequestError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError
}
```

**ContextScout:** El type guard cumple todos los estándares del proyecto (`code-quality.md`): `camelCase`, `function` declaration, < 50 lns, `unknown` (no `any`). La sugerencia `const` arrow violaría consistencia con el resto del archivo.

**Acción:** ❌ **No cambiar.** Marcar como completado sin cambios.

---

## Orden de Ejecución

```
Batch 0 — Setup
  ├── Crear task.json en .tmp/tasks/plan-c/ (usar task-management skill)
  └── Commit inicial (git add -A && git commit -m "chore: init plan-c")

Batch 1 — PromptFilters + import test (archivos compartidos, paralelo)
  ├── T1: Fix P1c + P2(PromptFilters) — aria-label + eliminar 7 imports (PromptFilters.tsx)
  │   * context_files: core/standards/code-quality.md, .eslintrc.json
  │   * reference_files: components/prompt/PromptFilters.tsx, tests/components/PromptFilters.test.tsx
  ├── T2: Fix P1a — mock create para 4 entidades (import.test.ts)
  │   * context_files: core/standards/test-coverage.md, project-intelligence/technical-domain.md
  │   * reference_files: tests/api/import.test.ts, app/api/import/prompts/route.ts
  └── Ambos archivos son distintos → pueden ejecutarse en paralelo

Batch 2 — prompts-[id] + resto unused-vars (archivos distintos, paralelo)
  ├── T3: Fix P1b — estandarizar respuestas [id] endpoints + tests (Estrategia A)
  │   * context_files: development/backend/concepts/nextjs-api-patterns.md
  │   * reference_files: app/api/prompts/[id]/route.ts, tests/api/prompts-[id].test.ts
  └── T4: Fix P2(resto) — 9 route handlers + PromptForm + categories/page
      * context_files: .eslintrc.json, core/standards/code-quality.md
      * reference_files: 12 archivos (ver tabla P2)

Batch 3 — CodeReview + Verificación
  ├── CodeReviewer revisa Batch 1 + 2
  ├── npm run lint → 0 warnings no-unused-vars
  ├── npm run build → Compiled successfully
  ├── npm test → 57 tests pass (9 suites, 0 failures)
  └── git commit final

--- LÍNEA DE APROBACIÓN — solo si usuario aprueba P3 ---

Batch 4 — P3: Componentes grandes (postergable, requiere aprobación adicional)
  ├── T5: P3a — Split PromptForm según estructura de form-patterns.md
  │   * context_files: development/frontend/concepts/form-patterns.md, core/standards/code-quality.md
  │   * reference_files: components/prompt/PromptForm.tsx
  ├── T6: P3b — Split import/route (5 archivos)
  │   * context_files: core/standards/code-quality.md, core/workflows/component-planning.md
  │   * reference_files: app/api/import/prompts/route.ts
  ├── CodeReviewer revisa Batch 4
  ├── npm run build
  └── npm test
```

---

## Archivos Afectados (resumen)

| Archivo | Puntos | Cambio |
|---------|:------:|--------|
| `tests/api/import.test.ts` | P1a | Fix mocks `create` |
| `tests/api/prompts-[id].test.ts` | P1b | Alinear con API format |
| `app/api/prompts/[id]/route.ts` | P1b | **(opcional)** Estandarizar responses |
| `components/prompt/PromptFilters.tsx` | P1c | Añadir `aria-label` + `sr-only` |
| `tests/components/PromptFilters.test.tsx` | P1c | Cambiar selector |
| `app/(app)/categories/page.tsx` | P2 | Remove `CardHeader`, `CardTitle` |
| `app/api/categories/route.ts` | P2 | Remove `request` param |
| `app/api/client-projects/route.ts` | P2 | Remove `request` param |
| `app/api/export/prompts/route.ts` | P2 | Remove `request` param |
| `app/api/model-hints/route.ts` | P2 | Remove `request` param |
| `app/api/platforms/route.ts` | P2 | Remove `request` param |
| `app/api/tags/route.ts` | P2 | Remove `request` param |
| `app/api/use-cases/route.ts` | P2 | Remove `request` param |
| `app/api/user/preferences/route.ts` | P2 | Remove `request` param |
| `app/api/users/route.ts` | P2 | Remove `z` import |
| `components/prompt/PromptFilters.tsx` | P2 | Remove 7 unused imports |
| `components/prompt/PromptForm.tsx` | P2 | Remove `useEffect`, `session`, `status` |
| `prisma/migrate-data.ts` | P5 | ✅ Ya correcto, sin cambios |
| `components/prompt/PromptForm.tsx` | P3a | Dividir en 5 archivos |
| `app/api/import/prompts/route.ts` | P3b | Dividir en 5 archivos |

## Contexto y Referencias por Tarea

| Tarea | context_files (estándares) | reference_files (código) |
|-------|---------------------------|-------------------------|
| T1 (P1c+P2-PromptFilters) | `core/standards/code-quality.md`, `.eslintrc.json` | `components/prompt/PromptFilters.tsx`, `tests/components/PromptFilters.test.tsx` |
| T2 (P1a) | `core/standards/test-coverage.md`, `project-intelligence/technical-domain.md` | `tests/api/import.test.ts`, `app/api/import/prompts/route.ts` |
| T3 (P1b) | `development/backend/concepts/nextjs-api-patterns.md`, `project-intelligence/technical-domain.md` | `tests/api/prompts-[id].test.ts`, `app/api/prompts/[id]/route.ts` |
| T4 (P2-resto) | `.eslintrc.json`, `core/standards/code-quality.md` | 9 route handlers + PromptForm.tsx + categories/page.tsx |
| T5 (P3a) | `development/frontend/concepts/form-patterns.md`, `core/standards/code-quality.md`, `core/essential-patterns.md` | `components/prompt/PromptForm.tsx` |
| T6 (P3b) | `core/standards/code-quality.md`, `core/workflows/component-planning.md` | `app/api/import/prompts/route.ts` |

---

## Riesgos y Decisiones Pendientes

1. **P1b:** ✅ Resuelto — Estrategia A (estandarizar `{ data, success }` según `nextjs-api-patterns.md`).
2. **P3 — Componentes grandes:** Riesgo alto de romper funcionalidad. Requiere testing manual post-refactor.
3. **P3b — Queries duplicadas:** Decidir si extraer `getPrompts` a `lib/queries/prompts.ts` ahora o en plan futuro.

---

## Criterios de Éxito ✅

- [x] `npm test` → 56 tests pasan (8 suites, 0 failures) — nota: 1 test de `prompts-[id].test.ts` se eliminó porque GET `[id]` es intencionalmente público
- [x] `npm run lint` → 0 warnings de `no-unused-vars`
- [x] `npm run build` → Compiled successfully
- [x] Cada batch revisado por CodeReviewer
- [x] Commits atómicos por fase: `8c37bec` (F1), `3072d07`+`9bf6043` (F2), `006a615` (F3)
- [x] P1b sigue el estándar `{ data, success }` de nextjs-api-patterns.md
- [x] P3a alineado con estructura de form-patterns.md (3 segmentos + TaxonomyMultiSelect)
- [x] PromptFilters.tsx modificado una sola vez (P1c + P2 fusionados)
- [x] P3b dividido en 5 archivos: schemas.ts, upsert-entity.ts, import-v2.ts, import-v1.ts, route.ts
- [x] Deploy Vercel verificados (F1+F2+F3): `https://prompt-database-liard.vercel.app`
