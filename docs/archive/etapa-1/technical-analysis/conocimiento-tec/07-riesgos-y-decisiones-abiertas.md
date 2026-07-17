# Riesgos y Decisiones Abiertas

**Documento:** `doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md`  
**Bloque emisor:** 170-BLOQUE-07  
**Fecha de generación:** 2026-04-24  
**Fecha de actualización:** 2026-04-24 (decisiones D-01 a D-08 resueltas; elementos inciertos 07c verificados)  
**Versión:** 3.0

---

## 1. Alcance del análisis del bloque

### Parte del cambio tomada como referencia

Este bloque consolida los riesgos técnicos, de seguridad, de validación, las discrepancias entre objetivo y realidad, y las decisiones abiertas de los **50 Requisitos Funcionales (RF-01 a RF-50)** definidos en `doc-plan/doc-base/02-Improvement-Spec.md`, tomando como referencia los hallazgos acumulados en los bloques 00 a 06:

- **Bloque 00**: Índice y preparación (documentos base localizados, estructura verificada)
- **Bloque 01**: Mapa técnico (4 capas, 13 archivos, 7 archivos críticos identificados)
- **Bloque 02**: Cambios técnicos (7 tipos de cambio, 26 elementos en tabla maestra, 3 clasificaciones de intervención)
- **Bloque 03**: Objetivo vs realidad (16% ya soportado, 24% parcial, 52% no soportado, 8% en fricción; 7 vacíos estructurales)
- **Bloque 04**: Dependencias (12 directas, 8 indirectas, 7 condicionantes estructurales, 10 puntos sensibles)
- **Bloque 05**: Validación técnica (cobertura muy baja, 0 tests de PromptForm, 0 tests de ownership, 0 tests de export/import)
- **Bloque 06**: Seguridad integrada (export/import sin auth, ownership no cubre duplicado, 10 riesgos de seguridad identificados)

### Hallazgos previos utilizados

| Bloque | Hallazgos clave arrastrados a este bloque |
|--------|------------------------------------------|
| Bloque 02 | Intervención estructural en schema; Zod schemas duplicados; patrón delete+create sin transacción |
| Bloque 03 | 60% de RF requieren intervención significativa; 7 vacíos estructurales; 4 fricciones activas |
| Bloque 04 | Cadena Schema→Zod→State→UI; 3 handlers con misma navegación; Category tree + multi-select |
| Bloque 05 | Sin tests de PromptForm/Filters/[id]/Export/Import; cobertura estimada muy baja |
| Bloque 06 | Export/import sin auth; ownership no cubre duplicado; sin sanitización de nombres; sin rate limiting |

### Nivel de fiabilidad del análisis consolidado

| Nivel | Porcentaje | Justificación |
|-------|------------|---------------|
| **ALTO** | 80% | Riesgos y discrepancias identificados con evidencia verificable en código inspeccionado al 100% |
| **MEDIO** | 15% | APIs auxiliares no inspeccionadas; configuración de Vercel no accesible |
| **BAJO** | 5% | Volumen de datos desconocido; tests no ejecutados |

---

## 2. Resumen ejecutivo de riesgos y decisiones

### Principales riesgos detectados

| # | Riesgo | Tipo | Severidad | Descripción |
|---|--------|------|-----------|-------------|
| 1 | Desalineación UI→API→DB | Técnico | ALTA | Cambios en schema afectan toda la cadena; si una capa se actualiza y otra no, el sistema se rompe |
| 2 | Pérdida de datos en migraciones | Técnico | ALTA | Migración de `platform` y `category` de simple a múltiple puede corromper datos existentes |
| 3 | Export/import sin autenticación | Seguridad | ALTA | Cualquiera puede exportar todos los prompts o importar datos masivamente |
| 4 | Ownership no cubre duplicado | Seguridad | ALTA | Duplicado no verifica ownership del prompt original; posible acceso no autorizado |
| 5 | Regresión no detectada por falta de tests | Validación | ALTA | PromptForm (533 líneas) sin tests; cualquier cambio puede romper funcionalidad sin detección |
| 6 | Inconsistencia entre Zod schemas | Técnico | MEDIA | Schemas de create y update duplicados; riesgo de divergencia |
| 7 | Filtros AND con rendimiento desconocido | Técnico | MEDIA | Múltiples selecciones con lógica AND pueden degradar rendimiento con volumen alto |
| 8 | Compatibilidad de formato export/import | Técnico | MEDIA | Cambio de formato rompe compatibilidad con datos existentes |

### Discrepancias relevantes entre objetivo y realidad

| # | Discrepancia | RF afectados | Gravedad |
|---|-------------|--------------|----------|
| 1 | `platform` es string simple; objetivo pide multivalor | RF-06 a RF-11 | ALTA |
| 2 | `category` es FK simple; objetivo pide múltiple | RF-12 a RF-14 | ALTA |
| 3 | Navegación expulsa al usuario; objetivo pide permanencia | RF-32 a RF-36 | ALTA |
| 4 | Solo vista cards; objetivo pide cards + lista | RF-37, RF-41 a RF-43 | MEDIA |
| 5 | Filtros son selects simples; objetivo pide multi-selección | RF-44 a RF-47 | MEDIA |
| 6 | No hay campos `prePrompt`/`manualDeUso`; objetivo los pide | RF-26 a RF-28 | MEDIA |
| 7 | No hay creación inline de tags; objetivo la pide | RF-02, RF-03, RF-05 | MEDIA |

### Decisiones abiertas — ESTADO: TODAS RESUELTAS

| # | Decisión | Decisión tomada | Impacto |
|---|----------|----------------|---------|
| 1 | Modelado de campos multivalor | **RESUELTA (D-01)**: Tablas nuevas + relaciones N:M (Platform, ClientProject, UseCase, ModelHint como entidades con junction tables) | Condiciona migraciones, queries, Zod schemas, API logic |
| 2 | Formato de export/import | **RESUELTA (D-02)**: Implementar nuevo formato que contemple todos los nuevos campos y cambios; exports antiguos son datos "seed" no descartables | Condiciona migración de datos existentes |
| 3 | Ownership en duplicado | **RESUELTA (D-03)**: Cualquiera puede duplicar cualquier prompt; no se verifica ownership del original | Máxima reutilización |
| 4 | Auth en export/import | **RESUELTA (D-04)**: Usuario solo exporta/importa sus propios prompts; filtrar por userID | Más seguro; privacidad de datos |
| 5 | Lista de idiomas para Language | **RESUELTA (D-05)**: Mínimo en, es, nl (ampliable después) | Condiciona enum de Zod y UI |
| 6 | Reglas de creación de nuevos valores | **RESUELTA (D-06)**: Cualquier usuario autenticado puede crear; normalización automática (trim + lowercase) | Condiciona APIs de creación |
| 7 | Transaccionalidad en N:M | **RESUELTA (D-07)**: `$transaction` explícito para delete+create de relaciones | Atomicidad garantizada |
| 8 | Rate limiting | **RESUELTA (D-08)**: Middleware con rate limiting en middleware.ts | Protección global antes de llegar a API |

### Puntos que podrían condicionar especialmente el trabajo posterior

- **Modelado con tablas nuevas + N:M** (D-01 resuelta): requiere crear 4+ entidades nuevas (Platform, ClientProject, UseCase, ModelHint) con sus junction tables; migración más compleja que arrays pero con normalización completa
- **Cobertura de tests** es insuficiente: sin tests, cada cambio es un salto al vacío
- **Export/import sin auth** es una vulnerabilidad existente que debe cerrarse independientemente de esta iniciativa (D-04 resuelta: usuario solo exporta/importa sus propios datos)

---

## 3. Riesgos técnicos

### Riesgos derivados de cambios estructurales, acoplamientos, dependencias e integraciones

| Riesgo | Tipo | Origen / causa | Área afectada | Impacto potencial | Nivel de certeza | Notas |
|--------|------|----------------|---------------|-------------------|------------------|-------|
| **Desalineación UI→API→DB** | Estructural | Cambio en schema afecta Zod, state, UI, queries simultáneamente | Toda la aplicación | Sistema roto si una capa no se actualiza | ALTO | Cadena de dependencia identificada en Bloque 04 |
| **Pérdida de datos en migración de platform** | Migración | `platform String` → tabla `Platform` + junction `PromptPlatform`; datos existentes deben transformarse | DB + API | Prompts pierden platform o migración falla | ALTO | Datos existentes en producción; migración compleja con 5 entidades nuevas |
| **Pérdida de datos en migración de category** | Migración | `categoryId String?` → relación N:M `PromptCategory`; FK debe convertirse en junction table | DB + API | Categorías existentes se pierden o quedan huérfanas | ALTO | Category tiene árbol jerárquico |
| **Patrón delete+create sin transacción** | Integración | PUT usa `promptTag.deleteMany` + `tags.create` sin `$transaction` | API routes | Si create falla después de delete, se pierden tags | ALTO | Patrón a replicar para nuevas relaciones N:M |
| **Inconsistencia entre Zod schemas** | Contrato | `createPromptSchema` y `updatePromptSchema` duplicados en archivos distintos | API routes | Create acepta algo que update rechaza (o viceversa) | ALTO | Schemas en `route.ts` y `[id]/route.ts` |
| **Rendimiento de filtros AND desconocido** | Rendimiento | Múltiples `where.field: { in: values }` pueden ser lentos | API GET + Page | Queries lentas con volumen alto | MEDIO | Volumen de datos desconocido |
| **Formato export/import cambia** | Compatibilidad | Export usa `prompt.platform` (string); nuevo formato usará relaciones N:M con entidades nuevas | Export/Import | Imports antiguos requieren lógica de reemplazo; exports nuevos incluyen relaciones | ALTO | Decisión D-02: nuevo formato completo; imports reemplazan existentes por coincidencia |
| **Category tree + multi-select** | Complejidad | Categorías tienen `parentId` (árbol); multi-select debe manejar jerarquía | UI + API | Selecciones ambiguas (padre + hijo simultáneo) | ALTO | Árbol documentado en `schema.prisma:99-104` |
| **Single component create/edit** | Complejidad | `PromptForm` usa `prompt?` opcional para distinguir modos | Formulario | Lógica de navegación y visibilidad se complica | ALTO | 533 líneas, 15+ campos |
| **Zod enum hardcodeado para platform** | Mantenimiento | `z.enum(["CHATGPT", "CURSOR", ...])` en schema; debe reemplazarse por validación contra tabla `Platform` | API validation | Si platforms pasan a ser entidades dinámicas, enum debe reemplazarse por relación | ALTO | Decisión D-01: Platform como entidad nueva; enum reemplazado por relación N:M |
| **Prisma include repetido en 4+ queries** | Mantenimiento | Mismo `include` copiado en GET, POST, PUT, export | API routes | Añadir nueva relación requiere actualizar 4+ puntos | ALTO | Riesgo de olvidar un include |
| **NEXT_PUBLIC_BASE_PATH en fetch calls** | Configuración | `process.env.NEXT_PUBLIC_BASE_PATH` en 3+ lugares | Formulario + List | Si env var no está configurada, URLs pueden ser incorrectas | MEDIO | Usado en `PromptForm.tsx:113`, `PromptList.tsx:43` |

### Riesgos de regresión técnica

| Riesgo | Causa | Probabilidad | Impacto | Mitigación posible |
|--------|-------|--------------|---------|-------------------|
| **Formulario deja de guardar** | Cambio en state o payload | MEDIA | ALTO | Tests de submit con mock fetch |
| **Filtros dejan de funcionar** | Cambio en URL params o where clause | MEDIA | ALTO | Tests de API con múltiples params |
| **Listado no muestra datos** | Cambio en include o response shape | BAJA | ALTO | Tests de GET con include |
| **Navegación rota** | Cambio en `router.push` | BAJA | MEDIA | Tests de componente con mock router |

---

## 4. Riesgos de seguridad

### Riesgos identificados o amplificados por el cambio (conectados con Bloque 06)

| Riesgo | Tipo | Causa | Impacto | Probabilidad | Severidad |
|--------|------|-------|---------|--------------|-----------|
| **Export público de todos los prompts** | Exposición de datos | Decisión D-04: usuario solo exporta sus propios prompts; filtrar por userID | Si no se implementa correctamente, exposición de datos | ALTA | ALTA |
| **Import público sin restricciones** | Inyección de datos | Decisión D-04: usuario solo importa sus propios prompts; asigna a sí mismos | Si no se implementa correctamente, inyección masiva | MEDIA | ALTA |
| **Acceso no autorizado vía duplicado** | Autorización | Decisión D-03: cualquiera puede duplicar cualquier prompt; no se verifica ownership del original | Cualquiera duplica prompts ajenos (intencional por decisión) | ALTA | MEDIA |
| **Creación de valores globales sin control** | Permiso | Decisión D-06: cualquier usuario autenticado puede crear; normalización automática (trim + lowercase) | Duplicados por case prevenidos; cualquier usuario crea valores globales | MEDIA | MEDIA |
| **XSS en nombres de valores creados** | Inyección | Sin sanitización de nombres | Scripts maliciosos en nombres de tags/platforms | MEDIA | MEDIA |
| **Pérdida de datos por transacción incompleta** | Integridad | Decisión D-07: `$transaction` explícito para delete+create | Riesgo mitigado si se implementa correctamente; pendiente de implementación | BAJA | ALTA |
| **JWT payload excesivo** | Rendimiento | Añadir preferencia de vista al token | Token supera límite de tamaño | BAJA | BAJA |

### Riesgos de seguridad preexistentes (no causados por el cambio pero relevantes)

| Riesgo | Evidencia | Por qué importa ahora |
|--------|-----------|----------------------|
| **Auth manual en API routes** | `middleware.ts` excluye `/api` | Cada nuevo endpoint debe incluir auth manualmente; fácil de olvidar |
| **Password mínimo 6 caracteres** | `lib/auth.ts:23`: `z.string().min(6)` | Contraseñas débiles permitidas; si se amplía sistema, es un riesgo |
| **Sin rate limiting observable** | Decisión D-08: implementar en middleware.ts | Endpoints POST vulnerables a abuso automatizado hasta que se implemente |

---

## 5. Riesgos de validación o cobertura

### Riesgos derivados de cobertura insuficiente o mecanismos de validación débiles

| Riesgo | Causa | Área afectada | Impacto | Nivel de certeza |
|--------|-------|---------------|---------|------------------|
| **Regresión en PromptForm no detectada** | 0 tests de componente (533 líneas) | Formulario | Cambios rompen funcionalidad sin detección | ALTO |
| **Filtros multi-selección sin verificación** | 0 tests de PromptFilters | Filtros | Lógica AND puede dar resultados erróneos | ALTO |
| **Ownership sin verificación** | 0 tests de `[id]/route.ts` | Autorización | Usuarios acceden a datos de otros sin detección | ALTO |
| **Export/import sin verificación** | Decisión D-02: nuevo formato completo; imports reemplazan existentes por coincidencia | Datos | Nuevo formato debe validar estructura; lógica de reemplazo debe probarse | ALTO |
| **Migraciones sin verificación automática** | No hay tests de migraciones | DB | Migración corrupta no detectada hasta producción | ALTO |
| **Zod schemas sin tests de relaciones N:M** | Decisión D-01: tablas nuevas con junction tables | Validación | Schemas deben validar IDs de entidades relacionadas; tests deben cubrir relaciones | MEDIO |
| **Sin tests E2E** | No hay Playwright/Cypress | Flujos completos | Flujos integrados rotos no detectados | ALTO |
| **Tests existentes no ejecutados** | No se confirmó que `npm test` pase | Infraestructura | Tests podrían estar rotos; falsa sensación de cobertura | MEDIO |

### Exposición a regresión sin soporte suficiente de comprobación

| Cambio | Riesgo de regresión | Soporte de comprobación actual | Gap |
|--------|-------------------|-------------------------------|-----|
| Migración de schema | ALTO | `prisma generate` (type check) | Sin tests de datos migrados |
| Cambio de Zod schemas | ALTO | TypeScript compile | Sin tests de validación con relaciones N:M |
| Cambio de navegación | MEDIO | Manual | Sin tests de router |
| Cambio de filtros | ALTO | Manual | Sin tests de URL params |
| Cambio de export | MEDIO | Manual | Sin tests de formato |
| Cambio de ownership | ALTO | Manual | Sin tests de autorización |

---

## 6. Discrepancias entre objetivo y realidad

### Discrepancia 1: Platform multivalor vs string simple

- **Discrepancia detectada**: El objetivo (RF-06 a RF-11) exige que `platform` admita varios valores por prompt, con selección de existentes, creación de nuevos y reutilización. La realidad es que `platform` es un campo `String @default("CURSOR")` en el schema (`schema.prisma:67`) y un `Select` simple en el formulario (`PromptForm.tsx:328-345`).
- **Evidencia en el repo**: `schema.prisma:67`: `platform String @default("CURSOR")`; `PromptForm.tsx:328-345`: `Select` con opciones hardcodeadas; `route.ts:11`: `z.enum(["CHATGPT", "CURSOR", "MIDJOURNEY", "SUNO", "OTHER"])`.
- **Impacto sobre la implementación**: Requiere decisión de modelado (tabla nueva + relación N:M vs campo array). Condiciona migración de datos existentes, Zod schemas, state del formulario, queries de filtros, y formato de export/import.
- **Alternativas de vía técnica**:
  - **Opción A**: Nueva tabla `Platform` + relación N:M vía `PromptPlatform` (normalización completa) ✅ **SELECCIONADA (D-01)**
  - **Opción B**: Campo `platforms String[]` en `Prompt` (PostgreSQL array, más simple)
  - **Opción C**: Campo `platforms Json` con array de strings (flexible pero menos queryable)
- **Decisión tomada (D-01)**: Opción A para todos los campos multivalor (platform, clientOrProject, useCase, modelHint). Se crean entidades Platform, ClientProject, UseCase, ModelHint con sus respectivas junction tables (PromptPlatform, PromptClientProject, PromptUseCase, PromptModelHint). Category ya tiene entidad propia, se usa junction table PromptCategory.
- **Decisión requerida al usuario**: ~~¿Aceptar `platforms String[]` como enfoque, o preferir tabla `Platform` + relación N:M para mayor normalización?~~ **RESUELTA: Tablas nuevas + N:M**

### Discrepancia 2: Category múltiple vs FK simple con árbol jerárquico

- **Discrepancia detectada**: El objetivo (RF-12 a RF-14) exige que `category` admita varias categorías por prompt, seleccionando solo existentes. La realidad es que `categoryId` es una FK simple (`schema.prisma:79`) y `Category` tiene estructura de árbol jerárquico con `parentId` (`schema.prisma:99-104`).
- **Evidencia en el repo**: `schema.prisma:79`: `categoryId String?`; `schema.prisma:99-104`: `parent`, `children`, `parentId`; `PromptForm.tsx:416-433`: `Select` simple.
- **Impacto sobre la implementación**: Requiere junction table `PromptCategory`. La jerarquía de categorías complica la UI de multi-select: ¿mostrar árbol? ¿permitir seleccionar padre e hijo simultáneamente? ¿cómo mostrar categorías seleccionadas en el listado?
- **Alternativas de vía técnica**:
  - **Opción A**: Junction table `PromptCategory` + multi-select plano (ignorar jerarquía en UI) ✅ **SELECCIONADA (D-01)**
  - **Opción B**: Junction table `PromptCategory` + multi-select con árbol (mostrar jerarquía)
  - **Opción C**: Junction table `PromptCategory` + multi-select con agrupación por padre (compromiso)
- **Decisión tomada (D-01)**: Junction table `PromptCategory` para categories múltiples. Category ya es una entidad con metadatos (name, slug, parentId); la relación N:M es natural. Multi-select plano recomendado.
- **Decisión requerida al usuario**: ~~¿Aceptar multi-select plano de categorías, o exigir que se muestre la jerarquía en la selección?~~ **RESUELTA: Junction table + multi-select plano**

### Discrepancia 3: Navegación expulsa vs permanencia en formulario

- **Discrepancia detectada**: El objetivo (RF-32 a RF-36) exige que el usuario permanezca en el formulario tras guardar (alta o edición) y que pase al nuevo prompt tras duplicar. La realidad es que `router.push("/prompts")` está hardcodeado en 3 handlers distintos (`PromptForm.tsx:126, 164, 204`).
- **Evidencia en el repo**: `PromptForm.tsx:126`: `router.push("/prompts")` en handleSubmit; `PromptForm.tsx:164`: `router.push("/prompts")` en handleDuplicate; `PromptForm.tsx:204`: `router.push("/prompts")` en handleDelete.
- **Impacto sobre la implementación**: Cambio simple pero requiere modificar 3 handlers. En create, se necesita el ID del nuevo prompt (que la API ya retorna) para redirigir a `/prompts/[id]`. En edit, se permanece en la misma ruta. En duplicate, se redirige al nuevo ID.
- **Alternativas de vía técnica**:
  - **Opción A**: Modificar cada handler individualmente con lógica específica
  - **Opción B**: Crear función centralizada `handleNavigation(mode, newId)` que decida según modo
  - **Opción C**: Usar `router.replace()` en lugar de `router.push()` para evitar historial redundante
- **Recomendación razonada**: Opción B (función centralizada) reduce riesgo de inconsistencia y facilita mantenimiento futuro. La lógica de navegación es un punto sensible identificado en Bloque 04; centralizarla es una mejora técnica justificada.
- **Decisión requerida al usuario**: No requiere decisión; es un cambio técnico claro. Solo confirmar que el comportamiento deseado es exactamente: create→`/prompts/[nuevo-id]`, edit→permanecer, duplicate→`/prompts/[nuevo-id]`.

### Discrepancia 4: Vista única cards vs cards + lista

- **Discrepancia detectada**: El objetivo (RF-37, RF-41 a RF-43) exige dos modos de visualización (cajas y lista) con persistencia de preferencia. La realidad es que `PromptList` solo tiene render grid (`PromptList.tsx:80-179`) y no existe campo para preferencia en `User`.
- **Evidencia en el repo**: `PromptList.tsx:80-179`: solo `grid gap-6 md:grid-cols-2 lg:grid-cols-3`; `schema.prisma:11-24`: `User` sin campo de preferencia.
- **Impacto sobre la implementación**: Requiere nuevo render condicional en `PromptList`, toggle de vista, campo en `User` para preferencia, y lógica de lectura/escritura de preferencia.
- **Alternativas de vía técnica**:
  - **Opción A**: Campo `promptListViewPreference String @default("cards")` en `User`
  - **Opción B**: Tabla separada `UserPreference` (más flexible para futuras preferencias)
  - **Opción C**: Preferencia en JWT session (sin persistencia en DB, solo en token)
- **Recomendación razonada**: Opción A (campo en `User`) es la más simple y coherente con el alcance. El briefing dice "una preferencia de vista reutilizable en otras pantallas distintas del listado de prompts" queda fuera de alcance. No necesita tabla separada ni JWT.
- **Decisión requerida al usuario**: No requiere decisión técnica; es un cambio claro. Solo confirmar que la preferencia debe persistir en DB (campo en `User`).

### Discrepancia 5: Filtros simples vs multi-selección con lógica AND

- **Discrepancia detectada**: El objetivo (RF-44 a RF-47) exige que Platform y Category permitan varias selecciones con lógica acumulativa (AND). La realidad es que ambos son selects simples (`PromptFilters.tsx:92-133`) y las queries usan `where.platform = value` (`route.ts:52-54`).
- **Evidencia en el repo**: `PromptFilters.tsx:113-133`: `Select` simple para Platform; `PromptFilters.tsx:92-110`: `Select` simple para Category; `route.ts:52-54`: `where.platform = platform` (simple).
- **Impacto sobre la implementación**: Requiere cambiar `Select` a multi-select (checkboxes), cambiar `params.set()` a `params.append()` en URL, y cambiar query de `where.field = value` a `where.field: { in: values }`.
- **Alternativas de vía técnica**:
  - **Opción A**: Replicar patrón de `toggleTag` (ya funciona para tags) para Platform y Category
  - **Opción B**: Usar componente multi-select de shadcn (si existe) o librería externa
  - **Opción C**: Custom multi-select con checkboxes (más control, más trabajo)
- **Recomendación razonada**: Opción A (replicar patrón de tags) es la más coherente con el sistema existente. Tags ya usan `params.getAll("tagIds")` y checkboxes (`PromptFilters.tsx:176-192`). El patrón está probado y funciona.
- **Decisión requerida al usuario**: No requiere decisión; es un cambio técnico claro basado en patrón existente.

### Discrepancia 6: Ausencia de campos Pre-Prompt y Manual de uso

- **Discrepancia detectada**: El objetivo (RF-26 a RF-28) exige campos `Pre-Prompt` y `Manual de uso` opcionales después de `Prompt Body`. La realidad es que estos campos no existen en el schema ni en el formulario.
- **Evidencia en el repo**: `schema.prisma:61-93`: modelo `Prompt` sin `prePrompt` ni `manualDeUso`; `PromptForm.tsx:257-299`: solo Title, Description, Body en Basic Information.
- **Impacto sobre la implementación**: Requiere migración simple (añadir campos `String?`), actualización de Zod schemas, y nuevos inputs en el formulario.
- **Alternativas de vía técnica**:
  - **Opción A**: Campos `prePrompt String? @db.Text` y `manualDeUso String? @db.Text` en `Prompt`
  - **Opción B**: Campo JSON `additionalInfo Json?` para ambos (menos columnas, menos queryable)
- **Recomendación razonada**: Opción A (campos separados) es más simple, más queryable y más coherente con el resto del modelo. Son campos opcionales que pueden estar vacíos; no justifican un JSON.
- **Decisión requerida al usuario**: No requiere decisión; es un cambio técnico claro.

### Discrepancia 7: Creación inline de tags no soportada

- **Discrepancia detectada**: El objetivo (RF-02, RF-03, RF-05) exige crear nuevos tags desde el formulario con selección inmediata y reutilización posterior. La realidad es que la UI solo permite seleccionar tags existentes (`PromptForm.tsx:437-463`).
- **Evidencia en el repo**: `PromptForm.tsx:437-463`: badges de tags existentes con toggle; no hay input de creación ni API de creación observable.
- **Impacto sobre la implementación**: Requiere nuevo endpoint de creación de tags (o reutilizar existente), UI de creación inline en el formulario, y validación de unicidad.
- **Alternativas de vía técnica**:
  - **Opción A**: Endpoint `POST /api/tags` con validación de unicidad + input inline en formulario
  - **Opción B**: Creación optimista en cliente (crear tag localmente, enviar al guardar prompt)
  - **Opción C**: Modal de creación de tag separado del formulario
- **Recomendación razonada**: Opción A (endpoint + input inline) es la más coherente con el patrón funcional descrito en el briefing. El tag debe crearse y quedar seleccionado inmediatamente, lo que sugiere creación en tiempo real, no optimista.
- **Decisión tomada (D-06)**: Endpoint `POST /api/tags` + input inline en formulario. Cualquier usuario autenticado puede crear valores; validación de unicidad automática con normalización (trim + lowercase).
- **Decisión requerida al usuario**: ~~Confirmar que la creación de tags debe ser en tiempo real (endpoint separado) y no optimista (solo al guardar prompt).~~ **RESUELTA: Creación en tiempo real con endpoint separado**

---

## 7. Decisiones abiertas — ESTADO: TODAS RESUELTAS

### Decisiones resueltas (D-01 a D-08)

| # | Decisión abierta | Decisión tomada | Evidencia relacionada |
|---|-----------------|----------------|----------------------|
| **D-01** | Modelado de campos multivalor | **RESUELTA**: Tablas nuevas + relaciones N:M. Crear Platform, ClientProject, UseCase, ModelHint como entidades con junction tables. Category ya tiene entidad, se usa PromptCategory. | Bloque 02: intervención estructural; Bloque 03: 7 vacíos estructurales; Bloque 04: cadena Schema→Zod→State→UI |
| **D-02** | Formato de export/import | **RESUELTA**: Implementar nuevo formato que contemple todos los nuevos campos y cambios. Los exports antiguos no son descartables (son datos "seed"). Cuando un usuario importa prompts se asignan a sí mismos. Si se encuentran prompts existentes que coinciden (userId + ID o título), los importados reemplazan los existentes. No se borran prompts en BD; los nuevos se añaden. | Bloque 03: fricción de export/import; Bloque 06: export/import sin auth |
| **D-03** | Ownership en duplicado | **RESUELTA**: Cualquiera puede duplicar cualquier prompt. No se verifica ownership del original. Máxima reutilización. | Bloque 04: ownership no cubre duplicado; Bloque 06: riesgo de acceso no autorizado |
| **D-04** | Auth en export/import | **RESUELTA**: Usuario solo exporta/importa sus propios prompts. Filtrar por userID. | Bloque 06: export/import sin auth; riesgo de exposición de datos |
| **D-05** | Lista de idiomas para Language | **RESUELTA**: Mínimo en, es, nl. Cubre el uso actual y se puede ampliar después. Notas: en, es, catalán, nl, fr, de, pt, it, gallego, vasco, chino, ruso disponibles para ampliación futura. | Bloque 03: incertidumbre de idiomas; Briefing no define opciones |
| **D-06** | Reglas de creación de nuevos valores | **RESUELTA**: Cualquier usuario autenticado puede crear; validación de unicidad automática con normalización (trim + lowercase) para evitar duplicados por case. | Bloque 03: ausencia de validación de unicidad; Bloque 06: riesgo de XSS en nombres |
| **D-07** | Transaccionalidad en relaciones N:M | **RESUELTA**: `$transaction` explícito para delete+create de relaciones N:M. Es la más segura. Prisma no envuelve delete+create en una sola transacción automáticamente. | Bloque 04: patrón delete+create; Bloque 05: riesgo de pérdida de datos |
| **D-08** | Rate limiting | **RESUELTA**: Middleware con rate limiting. Implementar en middleware.ts. Protección global; antes de llegar a API. | Bloque 06: sin rate limiting; Briefing: despliegue en Vercel Hobby |

---

## 8. Alternativas técnicas — ESTADO: DECISIONES TOMADAS

### A-01: Modelado de campos multivalor — DECISIÓN TOMADA (D-01)

**Decisión**: Tablas nuevas + relaciones N:M para todos los campos multivalor.

| Entidad | Junction Table | Justificación |
|---------|---------------|---------------|
| `Platform` | `PromptPlatform` | Normalización completa; reutilización; metadatos futuros |
| `ClientProject` | `PromptClientProject` | Normalización completa; reutilización |
| `UseCase` | `PromptUseCase` | Normalización completa; reutilización |
| `ModelHint` | `PromptModelHint` | Normalización completa; reutilización |
| `Category` (ya existe) | `PromptCategory` | Category ya es entidad con metadatos; relación N:M natural |

### A-02: Formato de export/import — DECISIÓN TOMADA (D-02)

**Decisión**: Nuevo formato que contemple todos los nuevos campos y cambios. Los exports antiguos son datos "seed" no descartables.

- Usuario importa prompts y se asignan a sí mismos
- Si se encuentran prompts existentes en BD que coinciden (userId + ID o título) con los importados, los importados reemplazan los existentes
- No se borran prompts en BD; los nuevos prompts se añaden

### A-03: Persistencia de preferencia de vista — SIN CAMBIOS

| Alternativa | Descripción | Ventajas | Desventajas | Compatibilidad con repo |
|-------------|-------------|----------|-------------|------------------------|
| **Campo en User** | `promptListViewPreference String @default("cards")` en `User` | Simple; una migration; queryable | Acopla preferencia a User; no escalable a múltiples preferencias | **Más compatible** con alcance limitado |
| **Tabla UserPreference** | Tabla separada `UserPreference { key, value, userId }` | Flexible para futuras preferencias | Complejidad adicional; query extra | Compatible pero sobredimensionado |
| **JWT session** | Incluir preferencia en JWT token | Sin query extra; rápido | Payload limitado; preferencia no persiste si token expira | Compatible pero no persistente |

---

## 9. Recomendaciones razonadas

### Recomendaciones basadas en las decisiones tomadas

| # | Recomendación | Justificación | Prioridad | Decisión asociada |
|---|--------------|---------------|-----------|-------------------|
| **R-01** | Crear tablas `Platform`, `ClientProject`, `UseCase`, `ModelHint` con junction tables | Decisión D-01: normalización completa con relaciones N:M | CRÍTICA | D-01 |
| **R-02** | Usar junction table `PromptCategory` para categories múltiples | Category ya es entidad con metadatos; relación N:M es natural | CRÍTICA | D-01 |
| **R-03** | Implementar `$transaction` para delete+create de relaciones N:M | Decisión D-07: atomicidad garantizada | ALTA | D-07 |
| **R-04** | Añadir auth check a export/import filtrando por userID | Decisión D-04: usuario solo exporta/importa sus propios prompts | ALTA | D-04 |
| **R-05** | Centralizar lógica de navegación en función `handleNavigation(mode, newId)` | Reduce riesgo de inconsistencia; 3 handlers con misma lógica | ALTA | — |
| **R-06** | Replicar patrón de `toggleTag` para multi-select de Platform y Category | Patrón ya probado y funcionando; coherente con sistema existente | ALTA | — |
| **R-07** | Crear tests de PromptForm como primera tarea antes de modificar el componente | 533 líneas sin tests; cualquier cambio es un salto al vacío | ALTA | — |
| **R-08** | Nuevo formato export/import con todos los campos nuevos; imports reemplazan existentes por coincidencia (userId + ID/título) | Decisión D-02: exports antiguos son seed; nuevo formato completo | MEDIA | D-02 |
| **R-09** | Añadir campo `promptListViewPreference` en `User` (no tabla separada) | Alcance limitado a listado de prompts; no necesita flexibilidad de tabla separada | MEDIA | — |
| **R-10** | Normalizar nombres de valores creados (trim + lowercase) | Decisión D-06: previene duplicados por case | MEDIA | D-06 |
| **R-11** | Implementar rate limiting en middleware.ts | Decisión D-08: protección global antes de llegar a API | MEDIA | D-08 |
| **R-12** | Enum de Language: en, es, nl (mínimo); ampliable después | Decisión D-05: cubre uso actual | MEDIA | D-05 |
| **R-13** | Cualquiera puede duplicar cualquier prompt; no verificar ownership del original | Decisión D-03: máxima reutilización | ALTA | D-03 |

### Orden de implementación derivado de las decisiones tomadas

| Orden | Decisión | Implementación requerida | Bloquea |
|-------|----------|-------------------------|---------|
| 1 | **D-01**: Modelado con tablas nuevas + N:M | Crear 5 entidades nuevas (Platform, ClientProject, UseCase, ModelHint, PromptCategory junction) + 4 junction tables | Todo el trabajo de schema y API |
| 2 | **D-04**: Auth en export/import | Añadir auth() check + filtrar por userID en export/route.ts e import/route.ts | RF-48 a RF-50 |
| 3 | **D-03**: Ownership en duplicado | No verificar ownership del original; cualquier usuario puede duplicar | RF-36 |
| 4 | **D-07**: Transaccionalidad | Envolver delete+create en `$transaction` explícito | RF-06 a RF-22 |
| 5 | **D-02**: Formato export/import | Nuevo formato con todos los campos; lógica de reemplazo por coincidencia | RF-48 a RF-50 |
| 6 | **D-06**: Reglas de creación | Endpoints de creación con auth + unicidad + normalización (trim + lowercase) | RF-02, RF-08, RF-19 |
| 7 | **D-05**: Lista de idiomas | Enum de Zod: en, es, nl | RF-23 a RF-25 |
| 8 | **D-08**: Rate limiting | Implementar en middleware.ts | Todos los POST |

---

## 10. Observaciones para trabajos posteriores

### Decisiones resueltas que deben arrastrarse a la siguiente capa de trabajo

| Elemento | Decisión tomada | A qué documento/sprint afecta |
|----------|----------------|------------------------------|
| **D-01: Modelado con tablas nuevas + N:M** | Platform, ClientProject, UseCase, ModelHint como entidades con junction tables; PromptCategory para categories | Todos los sprints técnicos |
| **D-02: Formato export/import** | Nuevo formato completo; imports reemplazan existentes por coincidencia (userId + ID/título); no se borran | Sprint de export/import |
| **D-03: Ownership en duplicado** | Cualquiera puede duplicar cualquier prompt; sin verificación de ownership del original | Sprint de continuidad de flujo |
| **D-04: Auth en export/import** | Usuario solo exporta/importa sus propios prompts; filtrar por userID | Sprint de export/import |
| **D-05: Lista de idiomas** | Mínimo: en, es, nl (ampliable después) | Sprint de Language |
| **D-06: Reglas de creación** | Cualquier usuario autenticado; normalización automática (trim + lowercase) | Sprint de creación de valores |
| **D-07: Transaccionalidad** | `$transaction` explícito para delete+create | Sprint de migraciones |
| **D-08: Rate limiting** | Middleware con rate limiting en middleware.ts | Sprint de seguridad o infraestructura |

### Riesgos que aún requieren atención (no resueltos por decisiones)

| Riesgo | Tipo | Por qué mantener | A qué documento/sprint afecta |
|--------|------|-----------------|------------------------------|
| **Cobertura de tests insuficiente** | Validación | Sin tests, cada cambio es riesgo | Todos los sprints |
| **Category tree + multi-select** | Técnico | Jerarquía complica UI y queries | Sprint de filtros y formulario |
| **Zod schemas duplicados** | Técnico | Inconsistencia entre create y update | Sprint de API |
| **Desalineación UI→API→DB** | Técnico | Cambio en schema afecta toda la cadena | Todos los sprints |

### Riesgos que requieren monitoreo continuo durante la ejecución

| Riesgo | Indicador de materialización | Acción si se materializa |
|--------|-----------------------------|-------------------------|
| **Desalineación UI→API→DB** | Tests de API pasan pero UI falla | Revisar cadena completa antes de desplegar |
| **Pérdida de datos en migración** | Migración falla en staging | Rollback inmediato; revisar script de migración |
| **Regresión en PromptForm** | Formulario no guarda o muestra datos incorrectos | Revertir cambio; añadir tests antes de reintentar |
| **Filtros AND dan resultados erróneos** | Queries retornan prompts que no cumplen todos los filtros | Revisar where clause; añadir tests de API |
| **Migración compleja por tablas N:M** | 5 entidades nuevas + 5 junction tables generan errores en migración | Verificar orden de creación de tablas; revisar foreign keys |

---

## 11. Evidencia principal utilizada

### Módulos, archivos, contratos, configuraciones y hallazgos previos que sostienen los riesgos y discrepancias

| Evidencia | Ubicación | Qué sostiene |
|-----------|-----------|--------------|
| **Schema Prisma** | `prisma/schema.prisma:61-93` | Campos simples (`platform`, `categoryId`) que deben evolucionar |
| **Category tree** | `schema.prisma:99-104` | Jerarquía de categorías que complica multi-select |
| **PromptForm state** | `PromptForm.tsx:62-96` | Estado manual con strings simples |
| **PromptForm navigation** | `PromptForm.tsx:126, 164, 204` | 3 handlers con `router.push("/prompts")` |
| **PromptList render** | `PromptList.tsx:80-179` | Solo vista cards |
| **PromptFilters selects** | `PromptFilters.tsx:92-133` | Selects simples para Category y Platform |
| **Zod schemas** | `route.ts:6-23`, `[id]/route.ts:6-23` | Schemas duplicados con strings simples |
| **checkOwnership** | `[id]/route.ts:26-41` | Solo cubre edit/delete, no duplicado |
| **Export sin auth** | `export/route.ts:4-58` | Sin verificación de autenticación |
| **Import sin auth** | `import/route.ts:13-142` | Sin verificación de autenticación |
| **Delete+create pattern** | `[id]/route.ts:108-123` | Sin `$transaction` explícito |
| **Tests existentes** | `tests/api/prompts.test.ts` (152 líneas) | Solo cubren POST create y GET list |
| **Bloque 03** | `03-relacion-objetivo-vs-realidad.md` | 60% de RF requieren intervención significativa |
| **Bloque 04** | `04-dependencias-y-condicionantes-tecnicos.md` | Cadena Schema→Zod→State→UI |
| **Bloque 05** | `05-validacion-tecnica.md` | 0 tests de PromptForm, Filters, ownership, export/import |
| **Bloque 06** | `06-seguridad-integrada.md` | Export/import sin auth; ownership no cubre duplicado |
| **APIs de creación de tags** | `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts` | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **APIs de creación de categories** | `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **Inventario de recursos Vercel** | `.gobernanza/.governance/inventario_recursos.md` | Plan Hobby, sin rate limiting, despliegue manual, token en GitHub Secrets |
| **Tests existentes** | `npm test`: 30 tests, 8 suites, TODOS PASAN | Infraestructura de testing funcional |
| **07b-riesgos-y-decisiones-abiertas_decisiones.md** | `doc-plan/doc-implementar/conocimiento-tec/07b-...` | Decisiones tomadas por el usuario para D-01 a D-08 |

### Límites de confianza

| Límite | Estado | Cómo afecta |
|--------|--------|-------------|
| **APIs de creación** | **RESUELTO**: `app/api/tags/route.ts` y `app/api/categories/route.ts` inspeccionados. POST tiene auth, pero NO tiene validación de unicidad ni sanitización de nombres | Riesgos de creación de valores son reales: falta normalización (trim + lowercase) y unicidad. Decision D-06 aborda esto. |
| **Volumen de datos desconocido** | **NO PROCEDE** en este momento (respuesta 07c punto 2) | Riesgo de rendimiento de filtros AND se mantiene como estimación conservadora |
| **Configuración de Vercel** | **RESUELTO**: Inventario consultado (`.gobernanza/.governance/inventario_recursos.md`). Plan Hobby, sin rate limiting, despliegue manual via CLI, token en GitHub Secrets | Rate limiting no existe en Vercel; decisión D-08 (middleware) es necesaria |
| **Tests no ejecutados** | **RESUELTO**: `npm test` ejecutado. 30 tests, 8 suites, TODOS PASAN | Infraestructura de testing funcional; cobertura estimada es correcta |
| **`.env` no inspeccionado** | Archivo sensible | Variables de entorno y secretos no verificables |

---

## 12. Bloqueos o límites del análisis

### Análisis de riesgos o decisiones que no pudo cerrarse con suficiente fiabilidad

| Elemento | Estado | Qué evidencia faltó | Cómo condiciona la confianza |
|----------|--------|---------------------|-----------------------------|
| **Seguridad de APIs de creación** | **RESUELTO**: `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts`, `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` inspeccionados | — | POST de tags y categories tiene auth, pero NO tiene validación de unicidad ni sanitización. Riesgos confirmados: se necesita implementar D-06 (normalización trim + lowercase + unicidad). PUT/DELETE de tags y categories requieren admin. |
| **Rate limiting en Vercel** | **RESUELTO**: Inventario confirma Plan Hobby sin rate limiting configurado | — | Confirmado: no existe rate limiting. Decisión D-08 (middleware) es necesaria. |
| **Volumen de datos actual** | **NO PROCEDE** en este momento | — | Riesgo de rendimiento se mantiene como estimación conservadora |
| **Tests existentes funcionando** | **RESUELTO**: `npm test` ejecutado. 30 tests, 8 suites, TODOS PASAN | — | Infraestructura de testing funcional. Cobertura estimada es correcta. |
| **CSRF protection** | **PENDIENTE**: NextAuth v5 Credentials provider tiene CSRF built-in pero requiere verificación de implementación | Configuración exacta de CSRF en NextAuth v5 | Riesgo de CSRF probablemente mitigado por NextAuth v5 |
| **Cookie security flags** | **PENDIENTE**: NextAuth v5 defaults no inspeccionados a fondo | Configuración explícita de cookies en `lib/auth.ts` | Riesgo de robo de session probablemente bajo (defaults seguros) |

### Evidencia que faltó

| Evidencia faltante | Estado | Cómo se mitigó |
|--------------------|--------|----------------|
| **APIs de creación** | **RESUELTO**: `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts`, `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` inspeccionados | POST tiene auth pero NO unicidad ni sanitización. PUT/DELETE requieren admin. |
| **Configuración de Vercel** | **RESUELTO**: Inventario consultado (`.gobernanza/.governance/inventario_recursos.md`) | Plan Hobby sin rate limiting. Despliegue manual via CLI. Token en GitHub Secrets. |
| **Output de `npm test`** | **RESUELTO**: 30 tests, 8 suites, TODOS PASAN | Infraestructura de testing funcional. |
| **Métricas de producción** | **NO PROCEDE** en este momento | Se asume volumen bajo-medio (Hobby tier) |

### Cómo condiciona la confianza del bloque

1. **APIs de creación inspeccionadas**: POST de tags y categories tiene auth pero NO tiene validación de unicidad ni sanitización. Los riesgos de creación de valores son confirmados, no estimados. Decisión D-06 (normalización trim + lowercase + unicidad) es necesaria.
2. **Vercel confirmado sin rate limiting**: Plan Hobby no tiene rate limiting. Decisión D-08 (middleware) es necesaria.
3. **Tests existentes funcionan**: 30 tests, 8 suites, TODOS PASAN. Infraestructura de testing funcional. Cobertura estimada es correcta.
4. **Las 8 decisiones abiertas (D-01 a D-08) están RESUELTAS**: Ya no requieren intervención del usuario; se reflejan en este documento con las opciones tomadas.
5. **Discrepancias son verificables**: Las 7 discrepancias documentadas están basadas en código inspeccionado al 100% y son verificables.
6. **Volumen de datos NO PROCEDE** en este momento: riesgo de rendimiento se mantiene como estimación conservadora.
7. **CSRF y cookie flags pendientes**: NextAuth v5 tiene CSRF built-in y cookies seguras por defecto, pero no se ha verificado la configuración exacta. Riesgo bajo pero no cero.

**Mitigación**: Las recomendaciones son conservadoras (asumen lo peor). Las discrepancias están basadas en evidencia directa. Las decisiones abiertas están formuladas para que el usuario pueda responderlas con información que solo él posee (preferencias de producto, volumen de datos, configuración de Vercel).

---

**Fin del documento**
