# 03 — Tech Intervention Plan

**Versión**: 3.0  
**Fecha**: 2026-04-24  
**Generado por**: 199-BLOQUE-99 (Consolidación)  
**Decisiones aplicadas**: D-01 a D-08 (todas resueltas)

---

## 1. Propósito del Plan Técnico de Intervención

Este documento es el **Plan Técnico de Intervención** consolidado del proyecto Prompt Database. Su función es traducir los 50 Requisitos Funcionales (RF-01 a RF-50) definidos en `02-Improvement-Spec.md` en un mapa técnico concreto, contrastado contra el código real del repositorio.

**Entradas que lo sustentan**:
- `doc-plan/doc-base/01-Briefing.md`: marco de contexto, problema y objetivo
- `doc-plan/doc-base/02-Improvement-Spec.md`: definición funcional de 50 RF
- Código real del repositorio: fuente de verdad del estado actual
- 8 análisis parciales en `doc-plan/doc-implementar/conocimiento-tec/` (bloques 00-07)

**Papel en el sistema documental**: Este documento es la base técnica obligatoria para construir `04-Phases-Subphases-Plan.md` y los documentos posteriores de `sprints-plan/`. No planifica ni ejecuta; solo analiza y documenta la realidad técnica del cambio necesario.

---

## 2. Resumen operativo del análisis técnico

### Tipo de intervención anticipada

Evolución estructural del modelo de datos + cambios de comportamiento UX + nueva funcionalidad de visualización. El 60% de los RF (No Soportado + En Fricción) requieren intervención técnica significativa.

### Zonas de mayor concentración de trabajo

| Zona | Concentración | Justificación |
|------|--------------|---------------|
| **Schema Prisma + Migraciones** | ALTA | Campos simples (`platform`, `category`, `clientOrProject`, `useCase`, `modelHint`) deben evolucionar a relaciones N:M con entidades propias |
| **PromptForm.tsx** (533 líneas) | ALTA | 15+ campos afectados: multivalor, nuevos campos, navegación post-guardado |
| **API Routes** (Zod + Prisma) | ALTA | Validación y queries deben soportar arrays y relaciones N:M |
| **PromptFilters.tsx** | MEDIA-ALTA | Multi-selección con lógica AND en Platform y Category |

### Nivel de alineación objetivo vs realidad

| Clasificación | % RF | Cantidad |
|---------------|------|----------|
| Ya Soportado | 16% | 8 RF |
| Parcialmente Soportado | 24% | 12 RF |
| No Soportado | 52% | 26 RF |
| En Fricción | 8% | 4 RF |

### Condicionantes y riesgos destacados

- **Cadena Schema → Zod → State → UI**: cambio en schema obliga a actualizar 3+ capas simultáneamente
- **Cobertura de tests muy baja**: PromptForm (533 líneas) sin tests; 0 tests de ownership, export/import
- **Export/Import sin auth**: vulnerabilidad preexistente (resuelta por D-04)
- **8 decisiones técnicas resueltas** (D-01 a D-08) eliminan incertidumbre de modelado

---

## 3. Mapa técnico de intervención

### 3.1 Capas implicadas

| Capa | Elementos | Grado de implicación |
|------|-----------|---------------------|
| **Presentación (Frontend)** | `PromptForm`, `PromptList`, `PromptFilters`, páginas `prompts/`, `new/`, `[id]/` | DIRECTO |
| **API (Backend)** | `POST/GET /api/prompts`, `PUT/DELETE /api/prompts/[id]`, export, import | DIRECTO |
| **Datos** | `schema.prisma` (Prompt, Category, Tag, User), migraciones | DIRECTO |
| **Autenticación** | `lib/auth.ts`, `middleware.ts`, ownership checks | DIRECTO |

### 3.2 Archivos críticos

| Archivo | Ruta | Líneas | RF impactados |
|---------|------|--------|---------------|
| `schema.prisma` | `prisma/schema.prisma` | 131 | Todos (modelo de datos) |
| `PromptForm.tsx` | `components/prompt/PromptForm.tsx` | 533 | RF-01 a RF-36 |
| `PromptList.tsx` | `components/prompt/PromptList.tsx` | 181 | RF-37 a RF-43 |
| `PromptFilters.tsx` | `components/prompt/PromptFilters.tsx` | 217 | RF-44 a RF-47 |
| `route.ts` (GET/POST) | `app/api/prompts/route.ts` | 163 | RF-01 a RF-50 |
| `route.ts` (PUT/DELETE) | `app/api/prompts/[id]/route.ts` | 199 | RF-01 a RF-50 |
| `export/route.ts` | `app/api/export/prompts/route.ts` | 60 | RF-48 a RF-50 |
| `import/route.ts` | `app/api/import/prompts/route.ts` | 144 | RF-48 a RF-50 |

### 3.3 Zonas reales de intervención observadas

- **Modelo `Prompt`**: `platform` (string simple), `categoryId` (FK simple), `clientOrProject`/`useCase`/`modelHint` (strings simples) deben evolucionar a relaciones N:M
- **Modelo `User`**: necesita campo `promptListViewPreference` para persistencia de vista
- **Navegación**: `router.push("/prompts")` hardcodeado en 3 handlers (`PromptForm.tsx:126, 164, 204`)
- **Filtros**: URL-driven con `useSearchParams`; solo tags soporta multi-selección actualmente
- **Export/Import**: formato acoplado a modelo actual (strings simples)

---

## 4. Cambios técnicos necesarios

### 4.1 Ya soportado (sin intervención significativa)

| Elemento | Evidencia | Por qué ya está |
|----------|-----------|-----------------|
| `tags` relación N:M | `schema.prisma:85`, `PromptTag` junction | Patrón existente para replicar |
| `createdAt`/`updatedAt` | `schema.prisma:81-82` | Campos ya existen en modelo |
| Estructura 3 secciones | `PromptForm.tsx:228-531` | Basic Info, Metadata, Advanced ya existen |
| Filtros URL-driven | `PromptFilters.tsx:38-59` | Patrón ya implementado |
| Ownership check | `[id]/route.ts:26-41` | `checkOwnership` ya implementada |
| Validación Zod | `route.ts:6-23` | Infraestructura ya existe |

### 4.2 Requiere ajuste (cambios puntuales)

| Elemento | Ajuste | Complejidad | RF |
|----------|--------|-------------|-----|
| Botón "View" → "Edit" | Cambiar texto en `PromptList.tsx` | BAJA | RF-38 |
| Navegación post-guardado | Cambiar `router.push("/prompts")` por permanencia en `/prompts/[id]` | BAJA | RF-32 a RF-36 |

### 4.3 Requiere ampliación (nuevos campos/funcionalidades)

| Elemento | Ampliación | Complejidad | RF |
|----------|-----------|-------------|-----|
| `model Prompt` | `prePrompt String?`, `manualDeUso String?` | BAJA | RF-26 a RF-28 |
| `model User` | `promptListViewPreference String @default("cards")` | BAJA | RF-39, RF-40 |
| `PromptForm` UI | Nuevos campos + fechas visibles | MEDIA | RF-26 a RF-31 |
| `PromptList` | Toggle vista cards/lista + render condicional | MEDIA | RF-37, RF-41 a RF-43 |
| `PromptFilters` | Multi-select con checkboxes en Platform/Category | MEDIA | RF-44 a RF-47 |
| Export/Import | Incluir arrays y nuevos campos | MEDIA | RF-48 a RF-50 |

### 4.4 Requiere intervención estructural

| Elemento | Intervención | Complejidad | Decisión | RF |
|----------|-------------|-------------|----------|-----|
| `platform` en DB | Tabla `Platform` + junction `PromptPlatform` | ALTA | D-01 | RF-06 a RF-11 |
| `category` en DB | Junction `PromptCategory` (Category ya existe) | ALTA | D-01 | RF-12 a RF-14 |
| `clientOrProject` en DB | Tabla `ClientProject` + junction `PromptClientProject` | ALTA | D-01 | RF-15 a RF-22 |
| `useCase` en DB | Tabla `UseCase` + junction `PromptUseCase` | ALTA | D-01 | RF-15 a RF-22 |
| `modelHint` en DB | Tabla `ModelHint` + junction `PromptModelHint` | ALTA | D-01 | RF-15 a RF-22 |
| `language` en DB | Enum validado (en, es, nl) | BAJA-MEDIA | D-05 | RF-23 a RF-25 |
| API relations logic | `$transaction` explícito para delete+create N:M | ALTA | D-07 | RF-06 a RF-22 |
| Export/Import auth | `auth()` check + filtrado por userId | MEDIA | D-04 | RF-48 a RF-50 |
| Rate limiting | Middleware con rate limiting en `middleware.ts` | MEDIA | D-08 | Todos los POST |

### 4.5 Matmaestra de cambios

| Elemento | Tipo | Situación actual | Cambio necesario | Decisión |
|----------|------|-----------------|-----------------|----------|
| `model Prompt.platform` | Schema | String simple | Relación N:M vía `PromptPlatform` | D-01 |
| `model Prompt.categoryId` | Schema | FK simple | Relación N:M vía `PromptCategory` | D-01 |
| `model Prompt.clientOrProject` | Schema | String simple | Relación N:M vía `PromptClientProject` | D-01 |
| `model Prompt.useCase` | Schema | String simple | Relación N:M vía `PromptUseCase` | D-01 |
| `model Prompt.modelHint` | Schema | String simple | Relación N:M vía `PromptModelHint` | D-01 |
| `model Prompt.language` | Schema | String libre | Enum (en, es, nl) | D-05 |
| `model User` | Schema | Sin preferencia | Campo `promptListViewPreference` | — |
| `createPromptSchema` | Zod | `platform: z.enum(...)` | IDs de platform como array | D-01 |
| `updatePromptSchema` | Zod | `categoryId: z.string()` | `categoryIds: z.array(z.string())` | D-01 |
| `PromptForm` state | Component | `platform: string` | `platformIds: string[]` | D-01 |
| `PromptForm` navigation | Handler | `router.push("/prompts")` | Permanecer en `/prompts/[id]` | — |
| `PromptList` | Component | Solo cards | Toggle cards/lista | — |
| `PromptFilters` | Component | Select simple | Multi-select con checkboxes | — |
| `export/route.ts` | API | Sin auth | Auth + filtrado por userId | D-04 |
| `import/route.ts` | API | Sin auth | Auth + owner assignment | D-04 |
| `checkOwnership` | Función | Solo edit/delete | Duplicado sin verificación | D-03 |

---

## 5. Relación entre objetivo y realidad

### 5.1 Ya soportado (8 RF)

| RF | Descripción | Evidencia |
|-----|-------------|-----------|
| RF-01 | Seleccionar tags existentes | `PromptForm.tsx:437-463` |
| RF-04 | Quitar tags seleccionados | `toggleTag` en `PromptForm.tsx:218-223` |
| RF-29 | Fecha de creación visible | `schema.prisma:81`: `createdAt` existe |
| RF-30 | Fecha de actualización visible | `schema.prisma:82`: `updatedAt` existe |
| RF-38 | Cambio "View" → "Edit" | Botón identificable en `PromptList.tsx:171` |
| RF-49 | Export incluye tags | `export/route.ts:30` |
| RF-50 | Import restaura tags | `import/route.ts:84-92` |
| RF-35 | Guardar edición (parcial) | PUT funciona; solo falta cambiar redirect |

### 5.2 Parcialmente soportado (12 RF)

| RF | Qué existe | Qué falta |
|-----|-----------|-----------|
| RF-02, RF-03, RF-05 | UI de tags existe | Creación inline desde formulario |
| RF-26, RF-27, RF-28 | Estructura 3 secciones | Campos `prePrompt`, `manualDeUso` no existen |
| RF-32, RF-33, RF-34 | POST funciona | `router.push("/prompts")` expulsa al usuario |
| RF-37 | Vista cards existe | Vista lista no existe |
| RF-48 | Export existe | No incluye nuevos campos ni arrays |

### 5.3 No soportado (26 RF)

Todos los RF de multivalor (RF-06 a RF-22), Language como selector (RF-23 a RF-25), fechas en alta (RF-31), duplicado con redirect (RF-36), persistencia de vista (RF-39, RF-40), vista lista contenido (RF-41 a RF-43), filtros multi-selección (RF-44 a RF-47).

**Implicación técnica general**: requieren evolución del modelo de datos. Campos simples deben convertirse en relaciones N:M con entidades propias (D-01).

### 5.4 En fricción (4 RF)

| Fricción | Objetivo | Realidad | Por qué fricciona |
|----------|----------|----------|-------------------|
| Category múltiple + árbol | RF-12 a RF-14 | Category tiene `parentId` (árbol) | N:M con categorías anidadas complica UI y queries |
| Navegación "endurecida" | RF-32 a RF-36 | `router.push("/prompts")` en 3 handlers | Comportamiento replicado; cambiarlo requiere 3 modificaciones |
| Export/Import formato antiguo | RF-48 a RF-50 | Export usa `prompt.platform` (string) | Al pasar a arrays, formato cambia; imports antiguos podrían no funcionar |
| Filtros AND con volumen | RF-44 a RF-47 | Query usa `where.tags.some` | Múltiples `where.field: { in: values }` pueden degradar rendimiento |

### 5.5 Vacíos estructurales

| Vacío | RF afectados | Implicación |
|-------|--------------|-------------|
| Ausencia de tablas para campos multivalor | RF-06 a RF-22 | 5 entidades nuevas + 5 junction tables (D-01) |
| Ausencia de campo para preferencia de vista | RF-39, RF-40 | Nuevo campo en `User` |
| Ausencia de mecanismo de creación inline | RF-02, RF-08, RF-19 | Nuevos endpoints + UI (D-06) |
| Ausencia de componente multi-select | RF-44 a RF-47 | Customización o componente nuevo |
| Ausencia de vista lista | RF-37, RF-41 a RF-43 | Nuevo render condicional |

---

## 6. Dependencias y condicionantes técnicos

### 6.1 Dependencias directas clave

| Elemento dependiente | Depende de | Qué condiciona |
|---------------------|-----------|----------------|
| `PromptForm` (handleSubmit) | `POST/PUT /api/prompts` | Cambio en contrato de API (arrays vs strings) obliga a cambiar payload |
| `PromptList` (interface) | Respuesta de `GET /api/prompts` | Interface debe coincidir con include de Prisma |
| `PromptFilters` (updateFilter) | `GET /api/prompts` (query params) | URL params deben coincidir con `searchParams` en API |
| `PromptsPage` (getPrompts) | `prisma.prompt.findMany` | Where clause debe evolucionar de simple a `{ in: values }` |
| `export/route.ts` | Forma exacta del modelo `Prompt` | Cambio a arrays rompe compatibilidad |

### 6.2 Cadenas de dependencia

| Cadena | Elementos | Impacto |
|--------|-----------|---------|
| Schema → Zod → State → UI | `schema.prisma` → `route.ts` → `PromptForm` state → renders | Cambio en schema obliga a cambiar toda la cadena |
| Schema → API query → Page → Filters | `schema.prisma` → `route.ts` GET → `page.tsx` → `PromptFilters` | Cambio en modelo de filtros obliga a cambiar query, page y filtros |
| Schema → Export → Import | `schema.prisma` → `export/route.ts` → `import/route.ts` | Cambio en modelo obliga a cambiar formato simultáneamente |
| PromptForm → API → DB → Redirect | Form submit → POST → Prisma create → new ID → redirect | Redirect post-create necesita ID del nuevo prompt |

### 6.3 Condicionantes estructurales

| Condicionante | Evidencia | Qué restringe |
|---------------|-----------|---------------|
| Single component create/edit | `PromptForm` recibe `prompt?` opcional | Modo create vs edit por presencia de `prompt` |
| Estado manual con useState | 15+ campos en `formData` state | Añadir arrays multivalor requiere gestión manual |
| Filtros URL-driven | `useSearchParams` + `router.push` | Multi-selección requiere `params.append()` no `params.set()` |
| Category con árbol jerárquico | `Category.parentId`, `parent`, `children` | Multi-select debe manejar jerarquía |
| JWT session sin DB lookup | `session: { strategy: "jwt" }` | Preferencia de vista debe incluirse en token o consultarse aparte |
| Prisma include repetido | Mismo `include` en 4+ queries | Añadir relaciones N:M requiere actualizar todos los includes |
| Patrón delete+create para relaciones | `promptTag.deleteMany` + `tags.create` | Nuevas relaciones deben seguir patrón (con `$transaction`, D-07) |

### 6.4 Puntos sensibles

| Punto | Ubicación | Riesgo si se modifica incorrectamente |
|-------|-----------|--------------------------------------|
| Ownership check | `[id]/route.ts:26-41` | Usuarios podrían editar/borrar prompts de otros |
| Gestión de tags en PUT | `[id]/route.ts:108-123` | Pérdida de tags si update falla después de delete |
| Formato Export/Import | `export/route.ts`, `import/route.ts` | Cambio de formato rompe imports antiguos |
| Navegación en 3 handlers | `PromptForm.tsx:126, 164, 204` | Inconsistencia si se modifica solo en algunos |
| Zod schemas duplicados | `route.ts` y `[id]/route.ts` | Create acepta algo que update rechaza |

---

## 7. Validación técnica

### 7.1 Qué debe validarse

| Categoría | Qué validar | Mecanismo existente |
|-----------|------------|-------------------|
| **Modelo de datos** | Migraciones de schema, nuevas relaciones N:M, nuevos campos | `prisma migrate dev` + `prisma generate` |
| **Contratos de API** | Zod schemas, request/response shape, filtros multi-selección | Tests existentes en `prompts.test.ts` |
| **Comportamiento del formulario** | State management, payload construction, navegación post-save | Sin tests actuales; crear tests de componente |
| **Filtros y queries** | Where clause dinámico, lógica AND, URL params | Sin tests; crear tests de API con múltiples params |
| **Export/Import** | Formato JSON, compatibilidad, parsing de arrays | Sin tests; crear tests de API |
| **Autorización** | Ownership checks, role-based access, duplicado | Sin tests; crear tests con session mocks |
| **Persistencia de preferencias** | Campo en User, session propagation | Sin tests; crear tests de componente + API |

### 7.2 Mecanismos existentes aprovechables

| Mecanismo | Ubicación | Utilidad | Cobertura actual |
|-----------|-----------|----------|------------------|
| Jest + Testing Library | `jest.config.js`, `package.json` | Infraestructura completa | 4 archivos de tests |
| Mocks de Prisma | `tests/api/prompts.test.ts:22-29` | Patrón de mock para DB | PARCIAL |
| Mocks de NextAuth | `jest.setup.js:5-35` | Patrón de mock para auth | PARCIAL |
| Zod validation | `app/api/prompts/route.ts:6-23` | Validación de input | ALTO |
| TypeScript strict | `tsconfig.json:7`: `"strict": true` | Type checking en compile | ALTO |
| ESLint | `npm run lint` | Linting automático | ALTO |
| Next.js build | `npm run build` | Verificación de compilación | ALTO |

**Tests existentes**: 30 tests, 8 suites, TODOS PASAN (`npm test`). Cobertura real confirmada como baja.

### 7.3 Gaps de validación

| Gap | Descripción | Impacto |
|-----|-------------|---------|
| Sin tests de PromptForm | Componente de 533 líneas sin tests | Mayor riesgo de regresión |
| Sin tests de PromptFilters | Filtros URL-driven sin tests | Lógica de multi-selección sin verificación |
| Sin tests de API `[id]` | PUT/DELETE/GET sin tests | Ownership y update sin verificación |
| Sin tests de Export/Import | Flujos de datos sin tests | Compatibilidad de formato sin verificación |
| Sin tests E2E | No hay Playwright/Cypress | Flujos completos sin verificación integrada |
| Sin tests de migraciones | No hay validación de scripts | Cambios de schema sin verificación automática |

### 7.4 Cobertura mínima esperada

| Prioridad | Área | Cobertura mínima |
|-----------|------|-----------------|
| CRÍTICA | API routes (POST, PUT, GET, DELETE) | Tests unitarios con mocks |
| CRÍTICA | Zod schemas (create, update, import) | Tests de validación 100% |
| CRÍTICA | Ownership checks | Tests de autorización con diferentes roles |
| ALTA | PromptForm (submit, duplicate, navigation) | Tests de componente |
| ALTA | Filtros multi-selección | Tests de componente + API |
| ALTA | Migraciones de schema | Verificación manual + seed data |
| MEDIA | PromptList (vista lista, "Edit") | Tests de componente |
| MEDIA | Export/Import | Tests de API routes |

---

## 8. Seguridad integrada

### 8.1 Mecanismos de seguridad existentes

| Mecanismo | Tipo | Ubicación | Función |
|-----------|------|-----------|---------|
| NextAuth con JWT | Autenticación | `lib/auth.ts:8-62` | Credentials provider, session con user.id y user.role |
| Auth middleware | Protección de rutas | `middleware.ts:1-31` | Redirige a signin si no autenticado; excluye `/api` |
| checkOwnership | Autorización | `[id]/route.ts:26-41` | Verifica owner o admin antes de edit/delete |
| Zod schemas | Validación de entrada | `route.ts:6-23`, `[id]/route.ts:6-23` | Valida input con enums y tipos |
| bcryptjs | Hash de passwords | `lib/auth.ts:32` | Compara password hash en login |
| Prisma parameterized queries | SQL injection | Implícito en todas las queries | Protección inherente |

### 8.2 Puntos del cambio con impacto en seguridad

| Cambio | Impacto | Nivel de riesgo | Decisión |
|--------|---------|-----------------|----------|
| Duplicado de prompt | Cualquiera puede duplicar cualquier prompt | BAJO | D-03 |
| Nuevos campos `prePrompt`, `manualDeUso` | Se exponen en GET responses | MEDIO | — |
| Export sin auth | Cualquiera puede exportar todos los prompts | ALTO | D-04: auth + filtrado por userId |
| Import sin auth | Cualquiera puede importar datos masivamente | ALTO | D-04: auth + owner assignment |
| Zod schemas para arrays | Si no se actualizan, API rechaza requests válidos | ALTO | D-01 |
| Creación de nuevos valores | Cualquier usuario autenticado puede crear | MEDIO | D-06: auth + unicidad + normalización |
| Rate limiting | Endpoints POST vulnerables a abuso | MEDIO | D-08: middleware con rate limiting |

### 8.3 Controles que deben preservarse

| Control | Ubicación | Por qué preservar |
|---------|-----------|-------------------|
| Auth middleware | `middleware.ts` | Protege todas las rutas de aplicación |
| Auth en API routes (POST/PUT/DELETE) | Cada handler con `auth()` | Verifica sesión antes de operaciones sensibles |
| Ownership check | `[id]/route.ts:26-41` | Impide acceso a prompts de otros |
| Role-based admin bypass | `session.user.role === "admin"` | Permite gestión de contenido |
| Zod validation | POST y PUT | Previene inyección de datos malformados |
| Password hashing | `lib/auth.ts:32` | Protege contraseñas |
| Prisma parameterized queries | Implícito | Previene SQL injection |

### 8.4 Elementos a reforzar

| Elemento | Acción | Prioridad | Decisión |
|----------|--------|-----------|----------|
| Export sin auth | Añadir `auth()` + filtrado por userId | ALTA | D-04 |
| Import sin auth | Añadir `auth()` + owner assignment | ALTA | D-04 |
| Nuevos endpoints de creación | Auth + unicidad + sanitización + normalización | ALTA | D-06 |
| Transaccionalidad N:M | `$transaction` explícito para delete+create | MEDIA | D-07 |
| Rate limiting | Middleware con rate limiting | MEDIA | D-08 |
| Validación de longitud | Añadir `.max()` a schemas para nuevos campos | BAJA | — |

### 8.5 Riesgos de seguridad

| Riesgo | Tipo | Severidad | Causa |
|--------|------|-----------|-------|
| Export público de prompts | Exposición de datos | ALTA | Sin auth check (mitigado por D-04) |
| Import público sin restricciones | Inyección de datos | ALTA | Sin auth check (mitigado por D-04) |
| XSS en nombres de valores creados | Inyección | MEDIA | Sin sanitización (mitigado por D-06) |
| Pérdida de datos por transacción incompleta | Integridad | ALTA | Sin `$transaction` (mitigado por D-07) |
| Auth manual en API routes | Arquitectura | MEDIA | Cada endpoint debe incluir auth manualmente |

---

## 9. Riesgos y decisiones abiertas

### 9.1 Decisiones resueltas (D-01 a D-08)

| # | Decisión | Decisión tomada | Impacto |
|---|----------|----------------|---------|
| D-01 | Modelado de campos multivalor | Tablas nuevas + relaciones N:M (Platform, ClientProject, UseCase, ModelHint como entidades con junction tables) | Condiciona migraciones, queries, Zod schemas, API logic |
| D-02 | Formato de export/import | Nuevo formato completo; exports antiguos son seed; imports reemplazan existentes por coincidencia (userId + ID/título) | Condiciona migración de datos existentes |
| D-03 | Ownership en duplicado | Cualquiera puede duplicar cualquier prompt; no se verifica ownership del original | Máxima reutilización |
| D-04 | Auth en export/import | Usuario solo exporta/importa sus propios prompts; filtrar por userID | Más seguro; privacidad de datos |
| D-05 | Lista de idiomas para Language | Mínimo: en, es, nl (ampliable después) | Condiciona enum de Zod y UI |
| D-06 | Reglas de creación de nuevos valores | Cualquier usuario autenticado puede crear; normalización automática (trim + lowercase) | Condiciona APIs de creación |
| D-07 | Transaccionalidad en N:M | `$transaction` explícito para delete+create de relaciones | Atomicidad garantizada |
| D-08 | Rate limiting | Middleware con rate limiting en `middleware.ts` | Protección global antes de llegar a API |

### 9.2 Riesgos técnicos

| Riesgo | Tipo | Severidad | Causa |
|--------|------|-----------|-------|
| Desalineación UI→API→DB | Estructural | ALTA | Cambio en schema afecta toda la cadena simultáneamente |
| Pérdida de datos en migraciones | Migración | ALTA | Transformar `platform` y `category` de simple a N:M puede corromper datos |
| Inconsistencia entre Zod schemas | Contrato | MEDIA | Schemas de create y update duplicados en archivos distintos |
| Rendimiento de filtros AND | Rendimiento | MEDIA | Múltiples `where.field: { in: values }` con volumen alto |
| Category tree + multi-select | Complejidad | ALTA | Jerarquía de categorías complica UI y queries |
| Prisma include repetido en 4+ queries | Mantenimiento | ALTA | Añadir relaciones requiere actualizar 4+ puntos |

### 9.3 Riesgos de validación

| Riesgo | Causa | Impacto |
|--------|-------|---------|
| Regresión en PromptForm no detectada | 0 tests de componente (533 líneas) | Cambios rompen funcionalidad sin detección |
| Filtros multi-selección sin verificación | 0 tests de PromptFilters | Lógica AND puede dar resultados erróneos |
| Ownership sin verificación | 0 tests de `[id]/route.ts` | Usuarios acceden a datos de otros sin detección |
| Migraciones sin verificación automática | No hay tests de migraciones | Migración corrupta no detectada hasta producción |

### 9.4 Riesgos de seguridad

| Riesgo | Tipo | Severidad | Estado |
|--------|------|-----------|--------|
| Export/import sin auth | Exposición/Inyección | ALTA | Mitigado por D-04 (pendiente de implementación) |
| Creación de valores sin control | Permiso | MEDIA | Mitigado por D-06 (pendiente de implementación) |
| Rate limiting inexistente | Abuso | MEDIA | Mitigado por D-08 (pendiente de implementación) |
| Password mínimo 6 caracteres | Debilidad | BAJA | Preexistente; no abordado en esta iniciativa |

---

## 10. Conclusiones operativas para el trabajo posterior

### 10.1 Base técnica preparada

Este documento deja preparada una base técnica suficiente para:
- Organizar el trabajo en fases y subfases (`04-Phases-Subphases-Plan.md`)
- Construir sprints temáticos (`sprints-plan/`)
- Definir criterios de validación y despliegue incremental

### 10.2 Aspectos a tener especialmente en cuenta

1. **Orden de implementación obligatorio**: Schema primero (5 entidades + 5 junction tables) → Zod schemas → API logic → State del formulario → UI. La cadena Schema → Zod → State → UI no puede romperse.
2. **Transaccionalidad**: Todas las operaciones de delete+create en relaciones N:M deben usar `$transaction` explícito (D-07).
3. **Auth en export/import**: Implementar antes de cualquier cambio de formato (D-04).
4. **Cobertura de tests**: Cada sprint debe incluir creación/ampliación de tests antes de funcionalidad. PromptForm es prioridad máxima.

### 10.3 Riesgos que no deben perderse

| Riesgo | Por qué mantener | Afecta a |
|--------|-----------------|----------|
| Desalineación UI→API→DB | Si una capa se actualiza y otra no, el sistema se rompe | Todos los sprints |
| Pérdida de datos en migraciones | Migración de platform y category es irreversible sin backup | Sprint de schema |
| Cobertura de tests insuficiente | Sin tests, cada cambio es un salto al vacío | Todos los sprints |
| Category tree + multi-select | Jerarquía complica UI y queries | Sprint de filtros y formulario |

### 10.4 Zonas que condicionarán más la organización del trabajo

- **Migraciones de DB**: 5 entidades nuevas + 5 junction tables. Migración más compleja del proyecto.
- **PromptForm**: 533 líneas, 15+ campos afectados. Componente más crítico.
- **Export/Import**: Cambio de formato + auth. Requiere coordinación con migraciones.

---

## 11. Evidencia principal utilizada

### Documentos y salidas parciales

| Documento | Ubicación | Contenido aportado |
|-----------|-----------|-------------------|
| Bloque 00 | `00-indice-doc-3.md` | Índice y preparación del trabajo |
| Bloque 01 | `01-mapa-tecnico-intervencion.md` | Mapa de áreas, capas, módulos y archivos (13 archivos inspeccionados) |
| Bloque 02 | `02-cambios-tecnicos-necesarios.md` | Clasificación de cambios: ya soportado, ajuste, ampliación, estructural (26 elementos en tabla maestra) |
| Bloque 03 | `03-relacion-objetivo-vs-realidad.md` | Análisis RF por RF: 16% soportado, 24% parcial, 52% no soportado, 8% fricción |
| Bloque 04 | `04-dependencias-y-condicionantes-tecnicos.md` | 12 dependencias directas, 8 indirectas, 7 condicionantes, 10 puntos sensibles |
| Bloque 05 | `05-validacion-tecnica.md` | Qué validar, mecanismos existentes, cobertura esperada, gaps |
| Bloque 06 | `06-seguridad-integrada.md` | Impacto en seguridad, controles a preservar/revisar/reforzar, riesgos |
| Bloque 07 | `07-riesgos-y-decisiones-abiertas.md` | Riesgos, discrepancias, decisiones D-01 a D-08 resueltas, alternativas |

### Evidencias del repo especialmente relevantes

| Evidencia | Ubicación | Relevancia |
|-----------|-----------|------------|
| `platform` como string simple | `schema.prisma:67` | Requiere migración a tabla + N:M |
| `categoryId` como FK simple | `schema.prisma:79` | Requiere junction table |
| `tags` ya es N:M | `schema.prisma:85`, `PromptTag` | Patrón a replicar |
| `createdAt`/`updatedAt` existen | `schema.prisma:81-82` | RF-29, RF-30 pueden usar campos existentes |
| Navegación expulsa del formulario | `PromptForm.tsx:126, 164, 204` | Debe cambiarse para RF-32 a RF-36 |
| Ownership check existe | `[id]/route.ts:26-41` | Afecta edición y duplicado |
| Tests existentes pasan | `npm test`: 30 tests, 8 suites | Infraestructura funcional |

### Límites de confianza

| Límite | Cómo afecta |
|--------|-------------|
| Volumen de datos desconocido | Rendimiento de filtros AND incierto; se asume volumen bajo-medio (Hobby tier) |
| `.env` no inspeccionado | Variables de entorno y secretos no verificables |
| CSRF y cookie flags pendientes | NextAuth v5 tiene CSRF built-in y cookies seguras por defecto, pero no verificado explícitamente |

---

## 12. Inconsistencias, límites o bloqueos detectados

### Inconsistencias entre bloques

No se detectan inconsistencias significativas entre los bloques 00-07. Todos los bloques son coherentes entre sí y reflejan las mismas decisiones técnicas (D-01 a D-08).

### Límites de consolidación

1. **Volumen de datos**: No hay métricas de producción. El riesgo de rendimiento en filtros AND se mantiene como estimación conservadora.
2. **Configuración de Vercel**: No accesible desde el repo. El inventario confirma Plan Hobby sin rate limiting.
3. **CSRF y cookie flags**: NextAuth v5 defaults probablemente seguros, pero no verificados explícitamente.

### Información no integrada con plena confianza

| Información | Por qué | Cómo condiciona |
|-------------|---------|-----------------|
| Rendimiento de filtros AND | Volumen desconocido | Estrategia de queries podría ser over-engineering o under-engineering |
| Protecciones de Vercel | Plataforma externa | Rate limiting, caching u otras protecciones podrían existir fuera del código |

### Cómo condiciona la solidez del documento final

Las conclusiones son conservadoras (asumen lo peor). Las decisiones D-01 a D-08 están resueltas y definen la dirección técnica. Los riesgos identificados son verificables con evidencia directa del código inspeccionado. El documento es suficientemente sólido para servir de base a `04-Phases-Subphases-Plan.md`.

---

**Fin del documento**
