# Dependencias y Condicionantes Técnicos

**Documento:** `doc-plan/doc-implementar/conocimiento-tec/04-dependencias-y-condicionantes-tecnicos.md`  
**Bloque emisor:** 140-BLOQUE-04  
**Fecha de generación:** 2026-04-24  
**Versión:** 1.0

---

## 1. Alcance del análisis del bloque

### Parte del cambio tomada como referencia

Este análisis identifica las dependencias técnicas y condicionantes estructurales que afectan a la implementación de los **50 Requisitos Funcionales (RF-01 a RF-50)** definidos en `doc-plan/doc-base/02-Improvement-Spec.md`, tomando como referencia los hallazgos acumulados en los bloques 00, 01, 02 y 03.

### Zonas del sistema revisadas

| Zona | Archivos inspeccionados | Nivel de fiabilidad |
|------|------------------------|---------------------|
| **Modelo de Datos** | `prisma/schema.prisma` | ALTO (100%) |
| **Formulario CRUD** | `components/prompt/PromptForm.tsx` | ALTO (100%) |
| **Listado** | `components/prompt/PromptList.tsx` | ALTO (100%) |
| **Filtros** | `components/prompt/PromptFilters.tsx` | ALTO (100%) |
| **Página principal** | `app/(app)/prompts/page.tsx` | ALTO (100%) |
| **API Routes** | `app/api/prompts/route.ts`, `[id]/route.ts` | ALTO (100%) |
| **Export/Import** | `app/api/export/prompts/route.ts`, `app/api/import/prompts/route.ts` | ALTO (100%) |
| **Autenticación** | `lib/auth.ts`, `middleware.ts` | ALTO (100%) |

### Nivel de fiabilidad del análisis

| Nivel | Porcentaje | Justificación |
|-------|------------|---------------|
| **ALTO** | 90% | Dependencias identificadas con evidencia verificable en código inspeccionado al 100% |
| **MEDIO** | 8% | Algunas APIs auxiliares no inspeccionadas (`app/api/tags/route.ts`, `app/api/categories/route.ts`) |
| **BAJO** | 2% | Configuración de plataforma (Vercel) no accesible |

---

## 2. Resumen de dependencias y condicionantes

### Tipo de dependencias más relevantes detectadas

| Tipo | Cantidad | Descripción |
|------|----------|-------------|
| **Dependencias directas** | 12 | Relaciones inmediatas entre componentes, APIs y modelo de datos |
| **Dependencias indirectas** | 8 | Cadenas de dependencia que amplifican el impacto del cambio |
| **Condicionantes estructurales** | 7 | Restricciones impuestas por la arquitectura y patrones existentes |
| **Puntos sensibles** | 6 | Piezas que amplifican riesgo o complejidad |

### Zonas que concentran condicionantes estructurales

| Zona | Condicionante principal | RF afectados |
|------|------------------------|--------------|
| **Schema Prisma** | Campos simples (`platform`, `categoryId`) acoplados a toda la cadena UI→API→DB | RF-06 a RF-22 |
| **PromptForm** | Estado manual con `useState` para 15+ campos; single component para create/edit | RF-01 a RF-36 |
| **API Routes** | Zod schemas y queries acoplados a forma exacta del modelo | RF-01 a RF-50 |
| **PromptFilters + PromptsPage** | Filtros URL-driven con acoplamiento directo a query params | RF-44 a RF-47 |

### Puntos sensibles identificados

- **Ownership check**: `checkOwnership` en `[id]/route.ts` gobierna edit/delete pero no duplicado
- **Gestión de relaciones N:M**: Patrón delete+create en PUT para tags
- **Formato de Export/Import**: Acoplado a forma exacta del modelo actual
- **Navegación replicada**: `router.push("/prompts")` en 3 handlers distintos
- **Session JWT**: `session.user.role` usado para autorización de admin

### Limitaciones e incertidumbres relevantes

- APIs de creación de tags/categories no inspeccionadas
- Volumen de datos desconocido (afecta rendimiento de queries complejas)
- Configuración de Vercel no accesible

---

## 3. Dependencias internas

### Dependencias directas entre módulos, servicios, componentes o capas

| Elemento dependiente | Depende de | Tipo de relación | Ubicación / evidencia | Qué condiciona | Impacto potencial | Nivel de certeza | Notas |
|---------------------|-----------|-----------------|----------------------|----------------|-------------------|------------------|-------|
| **PromptForm (handleSubmit)** | `POST /api/prompts` y `PUT /api/prompts/[id]` | Consumo de API | `PromptForm.tsx:114-123` | Cambio en contrato de API (arrays vs strings) obliga a cambiar payload del formulario | ALTO | ALTO | Payload se construye en `PromptForm.tsx:107-111` |
| **PromptForm (handleDuplicate)** | `POST /api/prompts` | Consumo de API | `PromptForm.tsx:155-161` | Mismo contrato que handleSubmit; duplicado envía payload idéntico | ALTO | ALTO | Usa mismo endpoint que create |
| **PromptForm (state)** | Zod schemas de API | Contrato de validación | `PromptForm.tsx:62-96` vs `route.ts:6-23` | Forma del estado debe coincidir con schema; si schema cambia a arrays, state debe cambiar | ALTO | ALTO | `platform: string` en state vs `z.enum(...)` en schema |
| **PromptList (interface)** | Respuesta de `GET /api/prompts` | Contrato de datos | `PromptList.tsx:9-31` vs `route.ts:78-91` | Interface de Prompt en List debe coincidir con include de Prisma en API | ALTO | ALTO | `platform: string` en interface; debe cambiar a array |
| **PromptFilters (updateFilter)** | `GET /api/prompts` (query params) | Contrato de filtrado | `PromptFilters.tsx:38-45` vs `route.ts:25-76` | Params de URL deben coincidir con `searchParams.get()` en API | ALTO | ALTO | `updateFilter` usa `params.set()` para valores simples |
| **PromptFilters (toggleTag)** | `GET /api/prompts` (tagIds) | Contrato de filtrado | `PromptFilters.tsx:48-59` vs `route.ts:30,68-76` | Tags ya usan `getAll("tagIds")`; patrón a replicar para platform/category | ALTO | ALTO | Único filtro que ya soporta multi-selección |
| **PromptsPage (getPrompts)** | `prisma.prompt.findMany` | Query de datos | `page.tsx:7-114` | Where clause debe evolucionar de `where.platform = value` a `where.platform: { in: values }` | ALTO | ALTO | Transformación de fechas en líneas 74-111 |
| **PromptsPage (getCategories)** | `prisma.category.findMany` | Datos de filtro | `page.tsx:116-156` | Incluye `parent`, `children`, `_count`; estructura jerárquica | MEDIO | ALTO | Árbol de categorías afecta UI de multi-select |
| **API POST (create)** | `prisma.prompt.create` + `tags.create` | Persistencia | `route.ts:119-146` | Lógica de creación de relaciones N:M ya existe para tags; patrón a replicar | ALTO | ALTO | `tags.create` con `tagIds.map()` |
| **API PUT (update)** | `prisma.prompt.update` + `promptTag.deleteMany` | Persistencia | `[id]/route.ts:108-140` | Patrón delete+create para relaciones; debe replicarse para nuevas relaciones N:M | ALTO | ALTO | Transaccionalidad implícita (no explícita) |
| **API PUT/DELETE** | `checkOwnership` | Autorización | `[id]/route.ts:26-41`, `89-99`, `172-182` | Ownership verifica `userId` vs `session.user.id` + `role === "admin"` | ALTO | ALTO | No contempla duplicado explícitamente |
| **Export/Import** | Forma exacta del modelo `Prompt` | Contrato de formato | `export/route.ts:28-42`, `import/route.ts:86-118` | Export mapea `prompt.platform` (string); Import espera `promptData.platform` (string) | ALTO | ALTO | Cambio a arrays rompe compatibilidad |

### Dependencias indirectas (cadenas de dependencia)

| Cadena de dependencia | Elementos involucrados | Qué condiciona | Impacto | Nivel de certeza |
|----------------------|----------------------|----------------|---------|------------------|
| **Schema → Zod → State → UI** | `schema.prisma` → `route.ts` schemas → `PromptForm` state → renders | Cambio en schema obliga a cambiar toda la cadena | ALTO | ALTO |
| **Schema → API query → Page → Filters** | `schema.prisma` → `route.ts` GET → `page.tsx` → `PromptFilters` | Cambio en modelo de filtros obliga a cambiar query, page y filtros | ALTO | ALTO |
| **Schema → Export → Import** | `schema.prisma` → `export/route.ts` → `import/route.ts` | Cambio en modelo obliga a cambiar formato de export e import simultáneamente | ALTO | ALTO |
| **Auth → Session → Ownership → API** | `lib/auth.ts` → JWT callback → `checkOwnership` → PUT/DELETE | Cambio en session shape afecta ownership checks | MEDIO | ALTO |
| **Category tree → Filters → UI** | `Category.parentId` → `PromptFilters` → multi-select | Jerarquía de categorías complica selección múltiple | MEDIO | ALTO |
| **PromptForm create/edit → Navigation → Router** | `PromptForm` mode → `router.push()` → page transition | Cambio en navegación afecta 3 handlers simultáneamente | ALTO | ALTO |
| **User model → Session → View preference** | `model User` → `session.user` → preference persistence | Nuevo campo en User debe propagarse a session | MEDIO | ALTO |
| **PromptForm → API → DB → Redirect** | Form submit → POST → Prisma create → new ID → redirect to `/prompts/[id]` | Redirect post-create necesita ID del nuevo prompt | ALTO | ALTO |

---

## 4. Dependencias externas e integraciones

### Dependencias con sistemas, APIs, servicios externos o integraciones

| Dependencia | Tipo | Ubicación / evidencia | Qué condiciona | Impacto | Nivel de certeza |
|-------------|------|----------------------|----------------|---------|------------------|
| **Prisma Client** | ORM | `lib/prisma.ts`, todos los API routes | Queries, includes, relaciones N:M | ALTO | ALTO |
| **PostgreSQL** | Base de datos | `schema.prisma:7`: `provider = "postgresql"` | Migraciones, tipos de columna, índices | ALTO | ALTO |
| **NextAuth (Credentials + JWT)** | Autenticación | `lib/auth.ts` | Session shape, callbacks, estrategia JWT | ALTO | ALTO |
| **shadcn/ui** | Componentes UI | `PromptForm.tsx`, `PromptFilters.tsx`, `PromptList.tsx` | `Select`, `Input`, `Textarea`, `Badge`, `Card` usados directamente | ALTO | ALTO |
| **Zod** | Validación | `app/api/prompts/route.ts`, `[id]/route.ts`, `import/route.ts` | Schemas de create/update/import | ALTO | ALTO |
| **bcryptjs** | Hash de passwords | `lib/auth.ts:5` | Autenticación de usuarios (no afectado directamente por cambios) | BAJO | ALTO |
| **Next.js App Router** | Framework | Estructura de directorios `app/(app)/`, Server Components | Separación client/server components, `searchParams`, `router.push()` | ALTO | ALTO |
| **Vercel (plataforma de despliegue)** | Hosting | Briefing menciona "Vercel Hobby" | Migraciones de DB, despliegues parciales, variables de entorno | MEDIO | MEDIO |
| **NEXT_PUBLIC_BASE_PATH** | Configuración | `PromptForm.tsx:113`, `PromptList.tsx:43` | URLs de API; afecta todos los fetch calls | MEDIO | ALTO |

### Integraciones internas relevantes

| Integración | Componentes involucrados | Dirección del flujo | Qué condiciona |
|-------------|-------------------------|-------------------|----------------|
| **Export JSON** | `export/route.ts` → DB → JSON | Lee prompts, categories, tags y serializa | Formato acoplado a modelo actual; cambio a arrays requiere nuevo formato |
| **Import JSON** | JSON → `import/route.ts` → DB | Parsea JSON y crea registros | Espera formato antiguo; debe soportar nuevos campos y arrays |
| **Usage tracking** | `PromptList.handleCopy` → `PATCH /api/prompts/[id]/usage` | Incrementa `usageCount` | No afectado directamente por cambios de esta iniciativa |
| **Clipboard API** | `PromptForm.handleCopy`, `PromptList.handleCopy` | Copia `body` al portapapeles | No afectado directamente |

---

## 5. Condicionantes estructurales

### Restricciones impuestas por la arquitectura actual, patrones, convenciones o decisiones técnicas

| Condicionante | Evidencia | Qué restringe | Cómo afecta la intervención |
|---------------|-----------|---------------|---------------------------|
| **Single component para create/edit** | `PromptForm` recibe `prompt?` opcional (`PromptForm.tsx:35-56`) | Modo create vs edit se determina por presencia de `prompt` | Cambiar navegación post-save requiere distinguir modos y redirigir a `/prompts/[id]` en create |
| **Estado manual con useState** | 15+ campos en `formData` state (`PromptForm.tsx:62-96`) | No hay form library (react-hook-form, formik) | Añadir arrays multivalor requiere gestión manual de estado (similar a `selectedTags`) |
| **Filtros URL-driven** | `useSearchParams` + `router.push` (`PromptFilters.tsx:36-59`) | Estado de filtros persiste en URL, no en estado local | Multi-selección requiere `params.append()` en lugar de `params.set()` (patrón ya usado en tags) |
| **Server Component para data fetching** | `PromptsPage` es Server Component (`page.tsx:181-229`) | Data fetching ocurre en servidor, no en cliente | Cambios en queries afectan Server Component; no se puede usar SWR/React Query sin refactor |
| **Prisma include fijo** | `include: { category: true, tags: { include: { tag: true } } }` repetido en 4+ lugares | Cada query incluye las mismas relaciones | Añadir nuevas relaciones N:M requiere actualizar todos los includes |
| **Category con árbol jerárquico** | `Category.parentId`, `parent`, `children` (`schema.prisma:99-104`) | Categorías tienen estructura padre/hijo | Multi-select de categorías debe decidir si mostrar jerarquía, si permitir seleccionar padres e hijos simultáneamente |
| **JWT session sin DB lookup** | `session: { strategy: "jwt" }` (`auth.ts:10`) | Session data está en token, no se consulta DB en cada request | Preferencia de vista debe incluirse en token o consultarse aparte en cada request al listado |
| **Zod enum hardcodeado** | `z.enum(["CHATGPT", "CURSOR", "MIDJOURNEY", "SUNO", "OTHER"])` (`route.ts:11`) | Opciones de platform están hardcodeadas en backend | Si platforms pasan a ser entidades dinámicas, enum debe reemplazarse por validación diferente |
| **Transformación de fechas en Server Component** | `prompt.createdAt.toISOString()` (`page.tsx:107-108`) | Next.js no serializa Date objects a JSON | Cualquier nuevo campo DateTime requiere misma transformación |
| **Patrón delete+create para relaciones** | `promptTag.deleteMany` + `tags.create` (`[id]/route.ts:108-123`) | No hay upsert para relaciones N:M | Nuevas relaciones N:M deben seguir mismo patrón (o mejorar a transacción explícita) |
| **Middleware excluye /api** | `matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]` (`middleware.ts:28-29`) | API routes no pasan por middleware de auth | Auth en API routes se maneja manualmente con `auth()` en cada handler |
| **PromptList interface acoplada a response** | Interface `Prompt` en `PromptList.tsx:9-31` define campos exactos esperados | Cambio en response shape rompe List | Añadir platforms array, categories array requiere nueva interface |

---

## 6. Puntos sensibles y de alto impacto

### Piezas, relaciones o mecanismos que amplifican riesgo, complejidad o necesidad de validación

| Punto sensible | Ubicación | Por qué es sensible | Riesgo si se modifica incorrectamente | RF afectados |
|----------------|-----------|-------------------|--------------------------------------|--------------|
| **Ownership check** | `[id]/route.ts:26-41` | Gobierna quién puede editar/borrar prompts; no contempla duplicado | Usuarios podrían editar/borrar prompts de otros; duplicado podría asignar owner incorrecto | RF-36, seguridad general |
| **Gestión de tags en PUT** | `[id]/route.ts:108-123` | Delete+create sin transacción explícita | Si update falla después de delete, se pierden tags | RF-01 a RF-05, RF-06 a RF-22 (nuevas relaciones) |
| **Formato de Export/Import** | `export/route.ts:28-42`, `import/route.ts:86-118` | Acoplado a forma exacta del modelo; import usa `z.any()` para prompts | Cambio de formato rompe imports antiguos; exports nuevos incompatibles con imports viejos | RF-48 a RF-50 |
| **Navegación replicada en 3 handlers** | `PromptForm.tsx:126, 164, 204` | `router.push("/prompts")` en handleSubmit, handleDuplicate, handleDelete | Cambiar comportamiento requiere modificar 3 puntos; riesgo de inconsistencia | RF-32 a RF-36 |
| **Zod schemas duplicados** | `route.ts:6-23` (create), `[id]/route.ts:6-23` (update) | Schemas separados pero deben mantenerse sincronizados | Cambio en create sin cambio en update (o viceversa) genera inconsistencia | RF-01 a RF-50 |
| **Prisma include repetido** | `route.ts:80-91`, `[id]/route.ts:49-58`, `page.tsx:56-69`, `export/route.ts:6-15` | Mismo `include` copiado en 4+ lugares | Añadir nueva relación N:M requiere actualizar 4+ queries; riesgo de olvidar uno | RF-06 a RF-22 |
| **Session JWT con role** | `auth.ts:44-45`: `session.user.role = token.role` | Role se inyecta en session; usado para admin checks | Cambiar session shape afecta todos los checks de autorización | Seguridad general |
| **Category tree + multi-select** | `schema.prisma:99-104`, `page.tsx:116-156` | Categorías tienen parentId, parent, children | Multi-select con jerarquía puede generar selecciones ambiguas (padre + hijo) | RF-12 a RF-14, RF-45, RF-47 |
| **PromptForm state → payload → API** | `PromptForm.tsx:107-111` → `route.ts:114-115` | Payload se construye manualmente desde state | Si state cambia a arrays pero payload no se adapta, API rechaza request | RF-06 a RF-22 |
| **GET /api/prompts con where dinámico** | `route.ts:36-76`, `page.tsx:16-54` | Where se construye condicionalmente con `any` type | Añadir filtros complejos (AND con múltiples valores) requiere refactor de where builder | RF-44 a RF-47 |

---

## 7. Observaciones para bloques posteriores

### Hallazgos que condicionarán especialmente la validación técnica (Bloque 05)

| Hallazgo | Por qué importa para validación | Qué debe validarse |
|----------|-------------------------------|-------------------|
| **Patrón delete+create sin transacción** | Riesgo de pérdida de datos si update falla | Tests deben verificar atomicidad de operaciones con relaciones N:M |
| **Zod schemas duplicados** | Create y update deben mantenerse sincronizados | Tests deben validar ambos schemas con mismos datos |
| **Where dinámico con `any` type** | Sin type safety en construcción de queries | Tests deben cubrir todas las combinaciones de filtros |
| **Transformación de fechas en Server Component** | Nuevos campos DateTime requieren misma transformación | Tests deben verificar serialización de fechas |
| **Interface de PromptList acoplada a response** | Cambio en response shape rompe List | Tests de integración deben verificar contrato API→UI |

### Hallazgos que condicionarán especialmente la seguridad integrada (Bloque 06)

| Hallazgo | Por qué importa para seguridad | Qué debe revisarse |
|----------|-------------------------------|-------------------|
| **Ownership no contempla duplicado** | Duplicado crea nuevo prompt; ¿quién es owner? | Definir regla: duplicado debe pertenecer a usuario que duplica |
| **API routes sin middleware de auth** | Auth se maneja manualmente con `auth()` en cada handler | Verificar que todos los endpoints protegidos tienen check |
| **Creación de nuevos valores (tags, platforms, etc.)** | Nuevos endpoints de creación necesitan validación de permisos | Definir quién puede crear valores globales reutilizables |
| **Session JWT con role** | Role determina acceso admin | Verificar que role no puede ser manipulado en cliente |
| **Import sin ownership check** | `import/route.ts` no verifica autenticación | Posible vector de inyección de datos |

### Hallazgos que condicionarán especialmente los riesgos y decisiones abiertas (Bloque 07)

| Hallazgo | Estado | Decisión abierta |
|----------|--------|-----------------|
| **Modelado de campos multivalor** | **RESUELTO (D-01)**: Tablas nuevas + N:M | 5 entidades nuevas + 5 junction tables |
| **Compatibilidad de Export/Import** | **RESUELTO (D-02)**: Nuevo formato completo | Imports reemplazan existentes por coincidencia (userId + ID/título) |
| **Rendimiento de filtros AND** | Riesgo vigente | Múltiples `where.field: { in: values }` pueden degradar rendimiento |
| **Category tree + multi-select** | Riesgo vigente | Jerarquía complica UI y queries |
| **Preferencia de vista en JWT** | Pendiente | ¿Campo en `User` + consulta extra o incluir en token? |
| **Validación de unicidad** | **RESUELTO (D-06)**: Normalización automática (trim + lowercase) | Previene duplicados por case |

### Hallazgos que condicionarán la futura organización del trabajo técnico

| Hallazgo | Implicación para organización |
|----------|------------------------------|
| **Cadena Schema → Zod → State → UI** | Cambios deben seguir orden: schema primero (5 entidades + 5 junction tables), luego Zod, luego state, luego UI |
| **4+ queries con mismo include** | Refactor de include podría hacerse como tarea transversal antes de añadir relaciones |
| **3 handlers con misma navegación** | Centralizar lógica de navegación en una función reutilizable |
| **Zod schemas duplicados** | Extraer schema compartido para create/update |
| **PromptForm como single component** | Considerar separar lógica de create vs edit si complejidad crece |

---

## 8. Evidencia principal utilizada

### Archivos de código que sostienen el análisis

| Archivo | Líneas | Evidencia obtenida |
|---------|--------|-------------------|
| `prisma/schema.prisma` | 131 | Modelo `Prompt` con campos simples; `Category` con árbol; `PromptTag` junction table |
| `components/prompt/PromptForm.tsx` | 533 | State manual, 3 handlers con `router.push("/prompts")`, payload construction |
| `components/prompt/PromptList.tsx` | 181 | Interface acoplada a response, botón "View", `getPlatformColor` hardcodeado |
| `components/prompt/PromptFilters.tsx` | 217 | URL-driven filters, `toggleTag` con `params.append()`, selects simples |
| `app/(app)/prompts/page.tsx` | 230 | Server Component, where dinámico, transformación de fechas, includes repetidos |
| `app/api/prompts/route.ts` | 163 | Zod schemas, GET con filtros simples, POST con tags.create |
| `app/api/prompts/[id]/route.ts` | 199 | checkOwnership, PUT con delete+create, DELETE con auth |
| `app/api/export/prompts/route.ts` | 60 | Export mapea `prompt.platform` (string), `prompt.category?.name` |
| `app/api/import/prompts/route.ts` | 144 | Import espera `promptData.platform` (string), `z.any()` para prompts |
| `lib/auth.ts` | 62 | NextAuth con JWT, session con user.id y user.role |
| `middleware.ts` | 31 | Auth middleware excluye `/api`, redirecciones signin |

### Matriz de trazabilidad: dependencias → evidencia

| Tipo de dependencia | Evidencia clave | Conclusión |
|---------------------|-----------------|------------|
| **Directa: Form → API** | `PromptForm.tsx:114-123` → `route.ts:103-162` | Payload debe coincidir con schema |
| **Directa: List → API response** | `PromptList.tsx:9-31` → `route.ts:78-91` | Interface debe coincidir con include |
| **Directa: Filters → API params** | `PromptFilters.tsx:38-59` → `route.ts:25-76` | URL params deben coincidir con searchParams |
| **Indirecta: Schema → toda la cadena** | `schema.prisma:67,79` → `route.ts:11,21` → `PromptForm.tsx:67,77` | Cambio en schema obliga a cambiar 3+ capas |
| **Estructural: Single component** | `PromptForm.tsx:35-56` (prompt opcional) | Create/edit compartiendo componente complica navegación |
| **Estructural: URL-driven filters** | `PromptFilters.tsx:36-59` | Persistencia natural pero multi-selección requiere patrón específico |
| **Estructural: JWT session** | `auth.ts:10` | Sin DB lookup; preferencia debe ir en token o consultarse aparte |

### Límites de confianza

| Límite | Por qué existe | Cómo afecta |
|--------|---------------|-------------|
| **APIs de creación** | **RESUELTO**: Inspeccionados. POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización | Si tienen auth y validación, riesgos de creación de valores son menores |
| **Volumen de datos desconocido** | No hay acceso a métricas de producción | Rendimiento de filtros AND incierto |
| **Configuración de Vercel** | No accesible en el repo | Protecciones de plataforma podrían mitigar riesgos |

---

## 9. Bloqueos o límites del análisis

### Dependencias o condicionantes no determinados con suficiente fiabilidad

| Elemento | Por qué no pudo determinarse | Qué evidencia faltó | Cómo condiciona la solidez |
|----------|-----------------------------|---------------------|---------------------------|
| **APIs de creación de tags** | **RESUELTO**: `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts` inspeccionados | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **APIs de creación de categories** | **RESUELTO**: `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` inspeccionados | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **Volumen actual de datos** | No hay acceso a métricas de producción | Count de prompts, users, categories en DB | Fricción de rendimiento en filtros AND podría estar sobreestimada o subestimada |
| **Configuración de Vercel** | Plataforma externa no accesible | Dashboard de Vercel, variables de entorno | Rate limiting, caching u otras protecciones podrían existir |
| **Tests existentes** | **RESUELTO**: 30 tests, 8 suites, TODOS PASAN | Cobertura real confirmada como baja |

### Cómo condiciona la confianza del bloque

1. **APIs de creación inspeccionadas**: POST de tags y categories tiene auth; PUT/DELETE requieren admin. Pero NO hay validación de unicidad ni sanitización. D-06 es necesaria.
2. **Rendimiento podría ser no-issue**: Si el volumen es bajo (<1000 prompts), filtros AND no serán problema. **NO PROCEDE** en este momento.
3. **Protecciones podrían existir en Vercel**: **RESUELTO**: Inventario confirma Plan Hobby sin rate limiting. D-08 (middleware) es necesaria. en código

**Mitigación**: Las conclusiones son conservadoras (asumen lo peor). Si hay piezas o protecciones no identificadas, la situación real será mejor que la estimada. Las dependencias identificadas con evidencia directa (código inspeccionado) mantienen fiabilidad ALTO.

---

**Fin del documento**
