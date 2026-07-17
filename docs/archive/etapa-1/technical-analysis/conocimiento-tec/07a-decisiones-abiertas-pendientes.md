# Decisiones Abiertas Pendientes de Resolución

**Documento:** `temp/00-decisiones-abiertas-pendientes.md`  
**Fecha de generación:** 2026-04-24  
**Origen:** `doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md`  
**Propósito:** Consolidar todas las decisiones abiertas que bloquean la generación del `04-Phases-Subphases-Plan.md` para revisión y resolución por parte del usuario.

---

## Índice

1. [Contexto: por qué estas decisiones bloquean el trabajo](#1-contexto-por-qué-estas-decisiones-bloquean-el-trabajo)
2. [Decisiones abiertas (8)](#2-decisiones-abiertas-8)
   - [D-01: Modelado de campos multivalor](#d-01-modelado-de-campos-multivalor)
   - [D-02: Formato de export/import](#d-02-formato-de-exportimport)
   - [D-03: Ownership en duplicado](#d-03-ownership-en-duplicado)
   - [D-04: Auth en export/import](#d-04-auth-en-exportimport)
   - [D-05: Lista de idiomas para Language](#d-05-lista-de-idiomas-para-language)
   - [D-06: Reglas de creación de nuevos valores](#d-06-reglas-de-creación-de-nuevos-valores)
   - [D-07: Transaccionalidad en N:M](#d-07-transaccionalidad-en-nm)
   - [D-08: Rate limiting](#d-08-rate-limiting)
3. [Discrepancias que requieren confirmación (7)](#3-discrepancias-que-requieren-confirmación-7)
4. [Elementos inciertos pendientes de confirmación](#4-elementos-inciertos-pendientes-de-confirmación)
5. [Cómo responder](#5-cómo-responder)

---

## 1. Contexto: por qué estas decisiones bloquean el trabajo

El prompt `030-PROMPT-CREADOR-FASES-PLAN.md` exige explícitamente como condición de validación previa:

> "Todas las decisiones abiertas documentadas en `07-riesgos-y-decisiones-abiertas.md` han sido resueltas"

**Sin estas decisiones resueltas, no se puede generar el `04-Phases-Subphases-Plan.md`** porque:

- **D-01** condiciona migraciones, queries, Zod schemas y API logic (base de todo el trabajo técnico)
- **D-02** condiciona la compatibilidad de datos existentes
- **D-03** condiciona la seguridad del flujo de duplicado
- **D-04** condiciona la seguridad de export/import (vulnerabilidad existente)
- **D-05** condiciona el enum de Zod y la UI de Language
- **D-06** condiciona las APIs de creación de tags, platforms, etc.
- **D-07** condiciona la integridad de datos en relaciones N:M
- **D-08** condiciona la protección de endpoints POST

---

## 2. Decisiones abiertas (8)

### D-01: Modelado de campos multivalor

**Decisión:** ¿Cómo modelar `platform`, `clientOrProject`, `useCase` y `modelHint` en la base de datos?

**Contexto:** Estos campos son actualmente strings simples en `schema.prisma`. El objetivo (RF-06 a RF-22) exige que admitan varios valores por prompt.

**Alternativas:**

| Opción | Descripción | Ventajas | Desventajas |
|--------|-------------|----------|-------------|
| **A) Tablas nuevas + relaciones N:M** | Crear `Platform`, `ClientProject`, `UseCase`, `ModelHint` como entidades con junction tables | Normalización completa; queryable; metadatos futuros | Complejidad alta; migración compleja; 4+ tablas nuevas |
| **B) Campos array (PostgreSQL `String[]`)** | `platforms String[]`, `clientOrProjects String[]`, etc. | Simple; migración directa; Prisma soporta nativamente | No soporta metadatos; menos flexible para queries complejas |
| **C) Campos JSON** | `platforms Json`, `modelHints Json` con arrays | Flexible; sin schema changes para nuevos campos | No queryable con Prisma filters; menos type safety |

**Recomendación del análisis técnico:** **Opción B** para `platform`, `modelHint`, `clientOrProject`, `useCase`. **Opción A** para `category` (ya tiene entidad con metadatos como name, slug, parentId).

**Justificación:** Son campos simples sin metadatos adicionales; PostgreSQL soporta arrays nativamente; Prisma los maneja bien; evita 4+ tablas nuevas para campos que esencialmente son enums múltiples.

**Impacto si no se decide:** No se pueden definir migraciones, queries, Zod schemas ni API logic.

**Pregunta al usuario:** ¿Aceptar campos array (`String[]`) para `platform`, `clientOrProject`, `useCase` y `modelHint`, o prefieres tablas nuevas con relaciones N:M para mayor normalización?

---

### D-02: Formato de export/import

**Decisión:** ¿Mantener compatibilidad hacia atrás con el formato antiguo de export/import o romper y migrar?

**Contexto:** El formato actual de export usa `prompt.platform` (string simple). Al pasar a arrays, el formato cambia. Los exports antiguos no serán compatibles con el nuevo import.

**Alternativas:**

| Opción | Descripción | Ventajas | Desventajas |
|--------|-------------|----------|-------------|
| **A) Compatibilidad dual** | Detectar formato (v1 strings vs v2 arrays) y parsear ambos | No rompe imports existentes | Complejidad de parsing; mantenimiento de dos formatos |
| **B) Ruptura con migración** | Nuevo formato v2; script de migración para datos antiguos | Formato limpio y consistente | Imports antiguos dejan de funcionar; requiere migración |
| **C) Versionado de formato** | Campo `version` en export; import detecta versión y parsea | Transición controlada; ambos formatos soportados | Complejidad moderada; requiere lógica de versión |

**Recomendación del análisis técnico:** **Opción C** (versionado de formato). Permite transición controlada sin romper imports existentes.

**Impacto si no se decide:** No se puede implementar export/import sin riesgo de romper datos existentes.

**Pregunta al usuario:** ¿Prefieres compatibilidad dual (A), ruptura con migración (B), o versionado de formato (C)?

---

### D-03: Ownership en duplicado

**Decisión:** ¿Verificar ownership del prompt original antes de permitir duplicar?

**Contexto:** `checkOwnership` en `[id]/route.ts` solo verifica edit/delete, no duplicado. El duplicado crea un nuevo prompt. ¿Quién debe ser el owner del prompt duplicado? ¿Debe verificarse que el usuario tiene permiso para duplicar el original?

**Alternativas:**

| Opción | Descripción | Ventajas | Desventajas |
|--------|-------------|----------|-------------|
| **A) Verificar ownership del original** | Solo el owner (o admin) puede duplicar un prompt | Más seguro; coherente con modelo actual de edición | Limita reutilización de prompts de otros usuarios |
| **B) Cualquiera puede duplicar cualquier prompt** | No se verifica ownership del original | Máxima reutilización | Posible abuso; duplicación de prompts ajenos |
| **C) Solo admin puede duplicar prompts ajenos** | Usuarios duplican los propios; admin duplica todos | Equilibrio entre seguridad y reutilización | Complejidad adicional en lógica |

**Recomendación del análisis técnico:** **Opción A** (verificar ownership). Es más seguro y coherente con el modelo actual donde solo el owner puede editar/borrar.

**Impacto si no se decide:** Riesgo de seguridad: usuarios podrían duplicar prompts de otros sin autorización.

**Pregunta al usuario:** ¿El duplicado debe verificar ownership del prompt original (A), permitir duplicar cualquier prompt (B), o solo admin puede duplicar prompts ajenos (C)?

---

### D-04: Auth en export/import

**Decisión:** ¿Restringir export/import al usuario (solo sus datos) o permitir admin global (todos los datos)?

**Contexto:** Actualmente `export/route.ts` e `import/route.ts` **no verifican autenticación**. Cualquiera puede exportar todos los prompts del sistema o importar datos masivamente. Esto es una vulnerabilidad de seguridad existente.

**Alternativas:**

| Opción | Descripción | Ventajas | Desventajas |
|--------|-------------|----------|-------------|
| **A) Usuario solo exporta/importa sus propios prompts** | Filtrar por `userId` | Más seguro; privacidad de datos | Admin no puede hacer backup global |
| **B) Admin exporta/importa todos los prompts** | Solo admin tiene acceso | Backup global posible | Usuarios no pueden exportar sus datos |
| **C) Ambos: usuario sus datos, admin todos** | Usuario exporta sus prompts; admin exporta todos | Más flexible; coherente con modelo de admin existente | Complejidad moderada |

**Recomendación del análisis técnica:** **Opción C** (ambos). Es más flexible y coherente con el modelo de admin existente.

**Impacto si no se decide:** Vulnerabilidad de seguridad existente: cualquiera puede exportar/importar datos sin autenticación.

**Pregunta al usuario:** ¿Export/import debe ser solo del usuario (A), solo del admin (B), o ambos con roles diferenciados (C)?

---

### D-05: Lista de idiomas para Language

**Decisión:** ¿Qué opciones incluir en el selector de Language?

**Contexto:** RF-23 a RF-25 exigen que Language sea un selector simple con opciones predefinidas, obligatoriedad y opción por defecto. El Briefing/Spec no definen qué idiomas incluir.

**Alternativas:**

| Opción | Descripción | Ventajas | Desventajas |
|--------|-------------|----------|-------------|
| **A) Mínimo** | `en`, `es`, `nl` (basado en uso actual) | Simple; cubre uso actual | Puede necesitar ampliarse después |
| **B) Amplio** | `en`, `es`, `nl`, `fr`, `de`, `pt`, `it` | Cubre más idiomas de entrada | Opciones que quizás nunca se usen |
| **C) Dinámico** | Cargar idiomas de DB | Flexible; ampliable sin deploy | Complejidad adicional; requiere tabla de idiomas |

**Recomendación del análisis técnico:** **Opción A** (mínimo: en, es, nl). Cubre el uso actual y se puede ampliar después.

**Impacto si no se decide:** No se puede definir el enum de Zod ni la UI del selector.

**Pregunta al usuario:** ¿Qué idiomas incluir en el selector? ¿Mínimo (en, es, nl), amplio (en, es, nl, fr, de, pt, it), o dinámico desde DB?

---

### D-06: Reglas de creación de nuevos valores

**Decisión:** ¿Quién puede crear nuevos tags, platforms, etc.? ¿Se valida unicidad de duplicados?

**Contexto:** RF-02, RF-08, RF-19 exigen creación de nuevos valores desde el formulario. No se definen reglas de negocio sobre quién puede crear ni cómo se validan duplicados.

**Alternativas:**

| Opción | Descripción | Ventajas | Desventajas |
|--------|-------------|----------|-------------|
| **A) Cualquier usuario autenticado puede crear; validación de unicidad automática** | Creación libre con normalización (trim + lowercase) | Flexible; previene duplicados por case | Cualquier usuario crea valores globales |
| **B) Solo admin puede crear; usuarios solo seleccionan** | Control centralizado | Sin duplicados; valores controlados | Menos flexible; dependencia de admin |
| **C) Cualquier usuario; sin validación de duplicados** | Creación libre sin restricciones | Máxima flexibilidad | Duplicados inevitables ("ChatGPT" vs "chatgpt") |

**Recomendación del análisis técnico:** **Opción A** con normalización automática (trim + lowercase) para evitar duplicados por case.

**Impacto si no se decide:** No se pueden implementar las APIs de creación de valores.

**Pregunta al usuario:** ¿Cualquier usuario puede crear valores con validación de unicidad (A), solo admin puede crear (B), o cualquier usuario sin validación (C)?

---

### D-07: Transaccionalidad en N:M

**Decisión:** ¿Implementar `$transaction` explícito para delete+create de relaciones N:M o confiar en Prisma?

**Contexto:** El patrón actual en `[id]/route.ts` usa `promptTag.deleteMany` seguido de `tags.create` sin transacción explícita. Si el create falla después del delete, se pierden los tags.

**Alternativas:**

| Opción | Descripción | Ventajas | Desventajas |
|--------|-------------|----------|-------------|
| **A) `$transaction` explícito** | Envolver delete+create en `prisma.$transaction([...])` | Atomicidad garantizada; sin pérdida de datos | Complejidad moderada |
| **B) Confiar en Prisma** | Cada operación es atómica individualmente | Simple | Si create falla después de delete, se pierden datos |
| **C) Soft delete + create** | No borrar realmente; marcar como eliminado | Sin pérdida de datos | Complejidad alta; acumulación de datos obsoletos |

**Recomendación del análisis técnico:** **Opción A** (`$transaction`). Es la más segura. Prisma no envuelve delete+create en una sola transacción automáticamente.

**Impacto si no se decide:** Riesgo de pérdida de datos si update falla después de delete.

**Pregunta al usuario:** ¿Implementar `$transaction` explícito (A), confiar en Prisma (B), o soft delete (C)?

---

### D-08: Rate limiting

**Decisión:** ¿Implementar rate limiting en middleware, a nivel de API, o confiar en Vercel?

**Contexto:** No hay rate limiting observable en el código. Los endpoints POST son vulnerables a abuso automatizado.

**Alternativas:**

| Opción | Descripción | Ventajas | Desventajas |
|--------|-------------|----------|-------------|
| **A) Middleware con rate limiting** | Implementar en `middleware.ts` | Protección global; antes de llegar a API | Complejidad; puede afectar rutas públicas |
| **B) API-level con librería** | Usar librería como `@upstash/ratelimit` en cada endpoint | Granular; por endpoint | Requiere dependencia adicional; configuración por endpoint |
| **C) Confiar en Vercel** | Vercel puede tener rate limiting básico en plan Hobby | Sin código adicional | Limitado; no configurable; puede no existir |

**Recomendación del análisis técnico:** **Opción C** primero (verificar si Vercel ya tiene rate limiting). Si no existe, **Opción B** (API-level) es más granular y controlable.

**Impacto si no se decide:** Endpoints POST vulnerables a abuso automatizado.

**Pregunta al usuario:** ¿Verificar primero si Vercel tiene rate limiting (C), implementar en middleware (A), o a nivel de API con librería (B)?

---

## 3. Discrepancias que requieren confirmación (7)

Además de las 8 decisiones abiertas, hay 7 discrepancias entre objetivo y realidad que requieren tu confirmación sobre las recomendaciones técnicas:

| # | Discrepancia | Recomendación | ¿Aceptas? |
|---|-------------|---------------|-----------|
| **1** | Platform multivalor vs string simple | Usar `platforms String[]` (array) | ⏳ |
| **2** | Category múltiple vs FK simple con árbol | Junction table `PromptCategory` + multi-select plano (sin jerarquía) | ⏳ |
| **3** | Navegación expulsa vs permanencia | Centralizar en función `handleNavigation(mode, newId)`; create→`/prompts/[id]`, edit→permanecer, duplicate→`/prompts/[nuevo-id]` | ⏳ |
| **4** | Vista única cards vs cards + lista | Campo `promptListViewPreference` en `User` (no tabla separada) | ⏳ |
| **5** | Filtros simples vs multi-selección | Replicar patrón de `toggleTag` para Platform y Category | ⏳ |
| **6** | Ausencia de Pre-Prompt y Manual de uso | Campos separados `prePrompt String?` y `manualDeUso String?` (no JSON) | ⏳ |
| **7** | Creación inline de tags no soportada | Endpoint `POST /api/tags` + input inline en formulario (creación en tiempo real, no optimista) | ⏳ |

---

## 4. Elementos inciertos pendientes de confirmación

Estos elementos no bloquean directamente la generación del plan, pero afectan la precisión del análisis:

| Elemento | Incertidumbre | Impacto |
|----------|--------------|---------|
| **APIs de creación de tags** | `app/api/tags/route.ts` no inspeccionado | Riesgos de creación podrían ser menores si ya existe con seguridad |
| **Volumen de datos actual** | No hay métricas de producción | Riesgo de rendimiento de filtros AND podría estar sobreestimado |
| **Configuración de Vercel** | Dashboard no accesible | Rate limiting, HTTPS, headers de seguridad no verificables |
| **Tests existentes** | No se ejecutó `npm test` | Cobertura real podría ser menor que la estimada |
| **CSRF protection** | NextAuth Credentials CSRF no verificado | Riesgo de CSRF podría estar subestimado |
| **Cookie security flags** | NextAuth defaults no inspeccionados a fondo | Riesgo de robo de session podría estar subestimado |

---

## 5. Cómo responder

Para cada decisión (D-01 a D-08), indica:

1. **La opción que prefieres** (A, B o C)
2. **O una respuesta personalizada** si ninguna opción se ajusta a lo que necesitas

Para cada discrepancia (1 a 7), indica:

1. **Si aceptas la recomendación** (Sí/No)
2. **O una alternativa** si prefieres otro enfoque

**Ejemplo de respuesta:**

```
D-01: B (arrays)
D-02: C (versionado)
D-03: A (verificar ownership)
D-04: C (ambos con roles)
D-05: A (mínimo: en, es, nl)
D-06: A (cualquier usuario con validación de unicidad)
D-07: A ($transaction explícito)
D-08: C primero, si no existe entonces B

Discrepancia 1: Sí
Discrepancia 2: Sí
Discrepancia 3: Sí
Discrepancia 4: Sí
Discrepancia 5: Sí
Discrepancia 6: Sí
Discrepancia 7: Sí
```

Una vez resueltas estas decisiones, se podrá generar el `04-Phases-Subphases-Plan.md` y continuar con la cadena de planificación.

---

**Fin del documento**
