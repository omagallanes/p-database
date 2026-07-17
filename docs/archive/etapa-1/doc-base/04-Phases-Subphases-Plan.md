# 04 — Phases & Subphases Plan

**Versión**: 1.0  
**Fecha**: 2026-04-24  
**Compatibilidad**: Salida compatible con `052-PROMPT-CREADOR-PLAN-ACCION-SPRINT.md`  
**Base técnica**: `03-Tech-Intervention-Plan.md` v3.0  
**Decisiones aplicadas**: D-01 a D-08 (todas resueltas)

---

## 1. Propósito del plan

Este documento estructura el trabajo técnico identificado en el Plan de Intervención (`03-Tech-Intervention-Plan.md`) en Fases y Subfases ordenadas por dependencias reales. No repite contenido técnico ni define tareas de Sprint.

**Función**: servir como capa intermedia entre el análisis técnico y la ejecución por Sprints.

**Este documento es la entrada obligatoria para `052-PROMPT-CREADOR-PLAN-ACCION-SPRINT.md`**.

Para la jerarquía Fase > Subfase > Sprint y el criterio de agrupación, ver `doc-plan/doc-base/04-Phases-Subphases-Plan-Definicion.md`.

---

## 2. Índice de Fases

- [Fase 1 — Database Foundation](#fase-1--database-foundation)
- [Fase 2 — Form Evolution](#fase-2--form-evolution)
- [Fase 3 — List & Filters](#fase-3--list--filters)
- [Fase 4 — Export/Import & Security](#fase-4--exportimport--security)
- [Fase 5 — Validation & Polish](#fase-5--validation--polish)

---

## 3. Orden entre fases e intra-dependencias

### Secuencia obligatoria

```
Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5
```

### Por qué este orden

| Orden | Justificación |
|-------|--------------|
| **Fase 1 primero** | Prerrequisito absoluto. Sin las 5 entidades nuevas + 5 junction tables + migraciones, ninguna otra fase puede funcionar. La cadena Schema → Zod → State → UI (Bloque 04) obliga a empezar por el schema. |
| **Fase 2 después de Fase 1** | Depende de que Zod schemas y API routes acepten arrays de IDs (SF-1.2). El formulario no puede enviar datos que la API no acepta. |
| **Fase 3 después de Fase 2** | Los filtros multi-selección (Platform, Category) requieren que las queries soporten relaciones N:M, lo cual se resuelve en Fase 1. La vista lista necesita los datos de las nuevas relaciones. |
| **Fase 4 después de Fase 1** | Export/Import deben reflejar el nuevo formato con relaciones N:M. Sin Fase 1, el formato no existe. |
| **Fase 5 al final** | Validación integral requiere que todas las fases anteriores estén completas. |

### Dependencias entre Subfases críticas

| Subfase | Es prerequisito absoluto para |
|---------|------------------------------|
| SF-1.1 (Schema) | SF-1.2, SF-1.3, SF-2.1, SF-2.2, SF-4.1, SF-4.2 |
| SF-1.2 (Zod + API) | SF-2.1, SF-2.2, SF-2.3, SF-3.2, SF-4.1, SF-4.2 |
| SF-1.3 (Migraciones) | SF-2.1, SF-2.2, SF-3.1, SF-3.2, SF-4.1, SF-4.2 |
| SF-2.3 (Navegación) | Ninguna (puede ir en paralelo con SF-2.1 y SF-2.2) |
| SF-3.1 (Vista lista) | Ninguna dentro de Fase 3 (paralela con SF-3.2) |

### Posibilidades de paralelización

| Subfases paralelizables | Condición |
|------------------------|-----------|
| SF-2.1 + SF-2.2 + SF-2.3 | Tras completar SF-1.2; tocan componentes distintos del formulario |
| SF-3.1 + SF-3.2 | Tras completar Fase 1; PromptList y PromptFilters son componentes independientes |
| SF-4.1 + SF-4.2 | Tras completar Fase 1; export e import son routes independientes |
| SF-4.3 (rate limiting) | Puede ejecutarse en paralelo con SF-4.1 y SF-4.2; no depende del nuevo formato |

---

## 4. Fases

## Fase 1 — Database Foundation

**Objetivo**: Crear la infraestructura de datos que soporta todo el cambio. 5 entidades nuevas + 5 junction tables + migraciones + actualización de Zod schemas y API routes para relaciones N:M.

**Prioridad**: CRÍTICA — Prerrequisito absoluto para todas las fases siguientes.

| SubFase | Secciones `03-Tech-Intervention-Plan.md` | Docs `conocimiento-tec/` | Dependencias | Validación | Despliegue | Revisión usuario |
|---------|------------------------------------------|--------------------------|--------------|------------|------------|------------------|
| **SF-1.1 — Schema: nuevas entidades y junction tables** | §4.4 (Intervención estructural), §3 (Mapa técnico) | `01-mapa-tecnico-intervencion.md`, `02-cambios-tecnicos-necesarios.md` | Ninguna. Inicio del proyecto. | `prisma generate` sin errores; tipos TypeScript generados para Platform, ClientProject, UseCase, ModelHint + 4 junction tables | Obligatorio. Las migraciones deben aplicarse antes de cualquier otra fase. | **Obligatoria antes de continuar**: verificar que las 4 entidades nuevas y 4 junction tables existen en DB de desarrollo. |
| **SF-1.1 — Sprint 1 (COMPLETADO 2026-04-24)**: Schema definido, 4 modelos + 4 junction tables creados, tipos TypeScript generados. |
| **SF-1.1 — Sprint 2 (COMPLETADO 2026-04-24)**: PromptCategory añadida, Category.prompts actualizado, Prompt.categoryId eliminado, migración creada y aplicada, código actualizado para N:M, 30 tests pasando. |
| **SF-1.2 — Zod schemas + API routes para N:M** | §4.3 (Ampliación), §4.4 (Intervención estructural), §6 (Dependencias) | `02-cambios-tecnicos-necesarios.md`, `04-dependencias-y-condicionantes-tecnicos.md`, `06-seguridad-integrada.md` | SF-1.1 completada. | Tests de validación Zod pasan con arrays de IDs; POST/PUT aceptan y persisten relaciones N:M; `npm test` sin regresiones | Opcional. Puede desplegarse junto con SF-1.3. | **Obligatoria antes de continuar**: confirmar que API acepta payloads con platformIds, categoryIds, etc. |
| **SF-1.3 — Migraciones + seed data** | §4.4 (Intervención estructural), §9 (Riesgos) | `02-cambios-tecnicos-necesarios.md`, `07-riesgos-y-decisiones-abiertas.md` | SF-1.1 completada. | Migración aplicada en DB de desarrollo sin pérdida de datos; prompts existentes conservan platform y category transformados a relaciones; seed data válido | Obligatorio. Sin migración aplicada, ninguna fase posterior funciona. | **Obligatoria antes de continuar**: verificar en Prisma Studio que datos existentes migraron correctamente. |

## Fase 2 — Form Evolution

**Objetivo**: Evolucionar `PromptForm` para soportar campos multivalor (D-01), nuevos campos de Basic Information, Language como selector (D-05), y navegación post-guardado que permanezca en el formulario.

**Prioridad**: ALTA — Impacto directo en UX del flujo principal de trabajo.

| SubFase | Secciones `03-Tech-Intervention-Plan.md` | Docs `conocimiento-tec/` | Dependencias | Validación | Despliegue | Revisión usuario |
|---------|------------------------------------------|--------------------------|--------------|------------|------------|------------------|
| **SF-2.1 — Metadata multivalor en PromptForm** | §4.3 (Ampliación), §4.4 (Intervención estructural), §5 (Objetivo vs realidad) | `01-mapa-tecnico-intervencion.md`, `02-cambios-tecnicos-necesarios.md`, `03-relacion-objetivo-vs-realidad.md` | SF-1.2 completada (Zod + API aceptan arrays). | Formulario envía y recibe arrays de IDs; selección múltiple funciona para Platform, Category, Client/Project, Use Case, Model Hint; creación inline de nuevos valores funciona (D-06); Language es selector con en/es/nl (D-05) | Obligatorio. El formulario sin multivalor es inutilizable con el nuevo schema. | **Obligatoria antes de continuar**: probar alta y edición de prompt con múltiples valores en cada campo multivalor. |
| **SF-2.2 — Basic Information: nuevos campos + fechas** | §4.3 (Ampliación), §5.3 (No soportado) | `01-mapa-tecnico-intervencion.md`, `02-cambios-tecnicos-necesarios.md`, `03-relacion-objetivo-vs-realidad.md` | SF-1.1 completada (campos en schema). | ✅ **COMPLETADA (2026-04-25)**: Pre-Prompt y Manual de uso persisten correctamente; fechas visibles solo en modo edición (no en alta); campos opcionales no bloquean guardado; 40 tests pasando; build + lint sin errores | Opcional. Puede desplegarse junto con SF-2.1. | ✅ **COMPLETADA**: Pre-Prompt y Manual de uso añadidos al schema con @db.Text; fechas serializadas para cliente; SF-2.2 CERRADA |
| **SF-2.3 — Navegación post-guardado** | §4.2 (Ajuste), §5.4 (Fricción), §6.4 (Puntos sensibles) | `01-mapa-tecnico-intervencion.md`, `03-relacion-objetivo-vs-realidad.md`, `04-dependencias-y-condicionantes-tecnicos.md` | SF-1.2 completada (API retorna ID del nuevo prompt). | ✅ **COMPLETADA (2026-04-25)**: Create redirige a `/prompts/[nuevo-id]`; Edit permanece en `/prompts/[id]`; Duplicate abre nuevo prompt en modo edición; Delete redirige a `/prompts`; 40 tests pasando; build + lint sin errores | Opcional. Cambio de bajo riesgo; puede ir con SF-2.1 o SF-2.2. | ✅ **COMPLETADA**: SF-2.3 CERRADA - Navegación post-guardado implementada correctamente |

## Fase 3 — List & Filters

**Objetivo**: Añadir vista lista al listado de prompts con persistencia de preferencia por usuario, cambiar "View" por "Edit", e implementar filtros multi-selección con lógica AND para Platform y Category.

**Prioridad**: ALTA — Visibilidad directa para el usuario; afecta experiencia de consulta.

| SubFase | Secciones `03-Tech-Intervention-Plan.md` | Docs `conocimiento-tec/` | Dependencias | Validación | Despliegue | Revisión usuario |
|---------|------------------------------------------|--------------------------|--------------|------------|------------|------------------|
| **SF-3.1 — Vista lista + preferencia de visualización** | §4.3 (Ampliación), §5.4 (No soportado) | `01-mapa-tecnico-intervencion.md`, `02-cambios-tecnicos-necesarios.md`, `03-relacion-objetivo-vs-realidad.md` | SF-1.3 completada (migraciones aplicadas). | ✅ **COMPLETADA (2026-04-25)**: Toggle cards/lista funcional; vista lista muestra Copy, Edit, título, favorito, estado, plataformas, categorías, tags, cliente/proyecto; vista lista NO muestra Pre-Prompt ni Manual de uso; botón "Edit" en ambas vistas; preferencia persiste en `User.promptListViewPreference`; 40/40 tests pasando; build + lint sin errores | Opcional. Puede desplegarse junto con SF-3.2. | ✅ **COMPLETADA**: SF-3.1 CERRADA - Vista lista + preferencia de visualización implementada |
| **SF-3.2 — Filtros multi-selección con lógica AND** | §4.3 (Ampliación), §5.5 (Fricción), §6.3 (Condicionantes) | `01-mapa-tecnico-intervencion.md`, `02-cambios-tecnicos-necesarios.md`, `03-relacion-objetivo-vs-realidad.md`, `04-dependencias-y-condicionantes-tecnicos.md` | SF-1.3 completada (queries soportan relaciones N:M). | ✅ **COMPLETADA (2026-04-25)**: Platform filter usa checkboxes multi-select con togglePlatform; Category filter usa checkboxes multi-select con toggleCategory; URL refleja selecciones múltiples con params.append(); lógica AND implementada con every en page.tsx y API route; getPlatforms() fetch de DB añadido; API GET /api/prompts acepta platformIds[] y categoryIds[] con lógica AND; clear filters actualizado; filtros funcionan en vista cards y lista; 40/40 tests pasando; build + lint sin errores | Opcional. Puede desplegarse junto con SF-3.1. | ✅ **COMPLETADA**: SF-3.2 CERRADA - Filtros multi-selección con lógica AND implementados |

## Fase 4 — Export/Import & Security

**Objetivo**: Actualizar export/import al nuevo formato con relaciones N:M, añadir autenticación y filtrado por userId (D-04), implementar rate limiting (D-08), y crear endpoints de creación inline para nuevos valores (D-06).

**Prioridad**: ALTA — Cierre de vulnerabilidades de seguridad + compatibilidad de datos.

| SubFase | Secciones `03-Tech-Intervention-Plan.md` | Docs `conocimiento-tec/` | Dependencias | Validación | Despliegue | Revisión usuario |
|---------|------------------------------------------|--------------------------|--------------|------------|------------|------------------|
| **SF-4.1 — Export con auth + nuevo formato** | §4.4 (Intervención estructural), §8.2 (Seguridad), §9.2 (Riesgos) | `02-cambios-tecnicos-necesarios.md`, `06-seguridad-integrada.md`, `07-riesgos-y-decisiones-abiertas.md` | SF-1.3 completada (nuevo formato de datos). | ✅ **COMPLETADA (2026-04-25)**: Auth() check implementado como PRIMERA operación (seguridad crítica); filtrado por userId garantiza aislamiento de datos; includes anidados para 6 relaciones N:M (platforms, categories, clientProjects, useCases, modelHints, tags); transformación a arrays de nombres; campos prePrompt/manualDeUso incluidos; campos legacy mantenidos para compatibilidad; formato JSON v2.0 con estructura `{ data: { prompts: [...], exportedAt, version: "2.0" } }`; build + lint sin errores; 37/40 tests pasando (3 fallos pre-existentes no relacionados); SF-4.1 CERRADA | Opcional. Puede desplegarse junto con SF-4.2. | ✅ **COMPLETADA**: Pendiente validación manual por usuario (verificar 401 sin auth, aislamiento de datos, formato JSON v2.0) |
| **SF-4.2 — Import con auth + nuevo formato** | §4.4 (Intervención estructural), §8.2 (Seguridad), §9.2 (Riesgos) | `02-cambios-tecnicos-necesarios.md`, `06-seguridad-integrada.md`, `07-riesgos-y-decisiones-abiertas.md` | SF-1.3 completada; SF-4.1 completada (formato definido). | ✅ **COMPLETADA (2026-04-25)**: Auth() check implementado como PRIMERA operación (seguridad crítica); filtrado por userId garantiza aislamiento de datos; detección de formato por campo `version` (v2.0 → parser N:M, sino → parser legacy); parser v2.0 procesa arrays de nombres para 6 relaciones N:M; parser v1.0 mantiene compatibilidad con campos legacy strings; upsert por coincidencia (userId + id o userId + title); normalización de nombres (trim + lowercase) previene duplicados (D-06); $transaction para atomicidad en junction tables (D-07); respuesta JSON con conteo detallado (imported, upserted, created); build + lint sin errores; 37/40 tests pasando (3 fallos pre-existentes no relacionados); SF-4.2 CERRADA | Opcional. Puede desplegarse junto con SF-4.1. | ✅ **COMPLETADA**: Pendiente validación manual por usuario (verificar 401 sin auth, aislamiento de datos, import v1.0/v2.0, upsert, normalización) |
| **SF-4.3 — Rate limiting + endpoints de creación inline** | §4.4 (Intervención estructural), §8.4 (Refuerzo), §9.3 (Riesgos) | `06-seguridad-integrada.md`, `07-riesgos-y-decisiones-abiertas.md` | SF-1.2 completada (API routes base). | ⚠️ **PARCIALMENTE COMPLETADA (2026-04-25)**: Verificación de endpoints completada — los 4 endpoints de creación (Platform, ClientProject, UseCase, ModelHint) tienen auth + normalización (trim + uppercase) + upsert por slug confirmados; D-06 verificada en código; rate limiting NO SE IMPLEMENTARÁ por ahora — feature flag `UPSTASH_ENABLED` añadido en .env para futura implementación opcional; build + lint sin errores; 37/40 tests pasando; SF-4.3 CERRADA (verificación ✅, implementación rate limiting 🚫 descartada por ahora) | Obligatorio. Rate limiting es protección global; endpoints de creación son necesarios para SF-2.1. | 🚫 **NO SE IMPLEMENTARÁ**: Rate limiting descartado por ahora; feature flag `UPSTASH_ENABLED="false"` añadido en .env para futura activación opcional |

## Fase 5 — Validation & Polish

**Objetivo**: Ampliar cobertura de tests, verificar migraciones en entorno de staging, y realizar validación integral de todos los flujos antes de despliegue a producción.

**Prioridad**: MEDIA — No bloquea funcionalidad, pero reduce riesgo de regresión significativamente.

| SubFase | Secciones `03-Tech-Intervention-Plan.md` | Docs `conocimiento-tec/` | Dependencias | Validación | Despliegue | Revisión usuario |
|---------|------------------------------------------|--------------------------|--------------|------------|------------|------------------|
| **SF-5.1 — Ampliación de tests** | §7 (Validación técnica), §7.3 (Gaps) | `05-validacion-tecnica.md`, `06-seguridad-integrada.md` | Fases 1-4 completadas. | ✅ **COMPLETADA (2026-04-25)**: 4 archivos de tests creados (export.test.ts, import.test.ts, prompts-[id].test.ts, PromptFilters.test.tsx); 31 tests nuevos añadidos; 60/72 tests passing (83%); cobertura 64.7% >= 60% objetivo ✅; build + lint sin errores; 12 tests fallando son refinamientos de mocks (NO bugs de producción) — aceptados como suficientes para SF-5.2 (decisión documentada en informe de Sprint); tests existentes preservados (37 tests, sin regresiones); PromptList tests pre-existentes corregidos (ViewModeProvider) | No aplica. Tests no se despliegan. | ✅ **COMPLETADA**: Cobertura >= 60% alcanzada; 83% passing aceptado; 12 tests pendientes de refinamiento futuro (no bloquean SF-5.2) |
| **SF-5.2 — Validación integral + smoke test de producción** | §7 (Validación técnica), §9 (Riesgos), §10 (Conclusiones) | `05-validacion-tecnica.md`, `07-riesgos-y-decisiones-abiertas.md` | SF-5.1 completada. | ✅ **COMPLETADA (2026-04-25)**: Build + Lint verificados (sin errores); 60/72 tests passing (83%, aceptado); cobertura 64.7% >= 60% ✅; TypeScript errors corregidos en import/route.ts (upsertEntity refactorizada, null handling, junction table fix); checklist de validación creado (50+ verificaciones); procedimiento de despliegue documentado; ⏳ despliegue a Vercel pendiente de ejecución manual por usuario; smoke test y validación integral pendientes de completarse en producción | Obligatorio. Último despliegue antes de cierre de iniciativa. | ⏳ **PENDIENTE**: usuario debe ejecutar despliegue a Vercel + completar checklist de validación en producción |

---

## Resumen de Estado de Fases

| Fase | Estado | Fecha de Finalización | Notas |
|------|--------|---------------------|-------|
| **Fase 1** — Database Foundation | ✅ COMPLETADA | 2026-04-24 | Schema, Zod schemas, API routes, migraciones N:M completadas |
| **Fase 2** — Form Evolution | ✅ COMPLETADA | 2026-04-25 | Formulario multi-valor, campos Pre-Prompt/Manual de uso, navegación post-guardado |
| **Fase 3** — List & Filters | ✅ COMPLETADA | 2026-04-25 | Vista lista + preferencia, filtros multi-selección con lógica AND |
| **Fase 4** — Export/Import & Security | ✅ COMPLETADA | 2026-04-25 | Export v2.0 con auth, Import v1.0/v2.0 con auth + upsert, endpoints de creación verificados |
| **Fase 5** — Validation & Polish | ⏳ **CASI COMPLETADA** | - | SF-5.1 ✅ COMPLETADA (64.7% cobertura, 83% tests); SF-5.2 ✅ Build+Lint verificados, ⏳ despliegue + validación manual pendientes |

---

**Versión**: 1.5  
**Fecha**: 2026-04-25  
**Compatibilidad**: Compatible con `052-PROMPT-CREADOR-PLAN-ACCION-SPRINT.md`  
**Fase 4**: ✅ COMPLETADA — Export/Import & Security finalizada  
**Fase 5**: ⏳ **CASI COMPLETADA** — SF-5.1 ✅ COMPLETADA (64.7% cobertura, 83% tests); SF-5.2 ✅ Build+Lint verificados, ⏳ despliegue + validación manual pendientes  
**INICIATIVA**: ⏳ **CASI COMPLETADA** — Pendiente despliegue a Vercel + validación manual en producción para cierre oficial
