# Cambios Técnicos Necesarios

**Documento:** `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md`  
**Bloque emisor:** 120-BLOQUE-02  
**Fecha de generación:** 2026-04-24  
**Versión:** 1.0

---

## 1. Alcance del análisis del bloque

### Parte del objetivo funcional contrastada

Este análisis contrasta la totalidad de los **50 Requisitos Funcionales (RF-01 a RF-50)** definidos en `doc-plan/doc-base/02-Improvement-Spec.md` contra el código real del repositorio, tomando como referencia el mapa técnico generado en el Bloque 01 (`01-mapa-tecnico-intervencion.md`).

**RF contrastados por área:**

| Área | RF | Estado del contraste |
|------|-----|---------------------|
| Metadata - Tags | RF-01 a RF-05 | ✅ Completado |
| Metadata - Platform | RF-06 a RF-11 | ✅ Completado |
| Metadata - Category | RF-12 a RF-14 | ✅ Completado |
| Metadata - Client/Project, Use Case, Model Hint | RF-15 a RF-22 | ✅ Completado |
| Metadata - Language | RF-23 a RF-25 | ✅ Completado |
| Basic Information | RF-26 a RF-31 | ✅ Completado |
| Continuidad del flujo | RF-32 a RF-36 | ✅ Completado |
| Listado y navegación | RF-37 a RF-43 | ✅ Completado |
| Filtros | RF-44 a RF-47 | ✅ Completado |
| Exportación | RF-48 a RF-50 | ✅ Completado |

### Zona técnica del sistema revisada

| Zona | Archivos inspeccionados | Nivel de detalle |
|------|------------------------|------------------|
| **Schema DB** | `prisma/schema.prisma` | 100% (131 líneas) |
| **Componentes** | `PromptForm.tsx`, `PromptList.tsx`, `PromptFilters.tsx` | 100% |
| **Rutas de página** | `prompts/page.tsx`, `new/page.tsx`, `[id]/page.tsx` | 100% |
| **API Routes** | `api/prompts/route.ts`, `[id]/route.ts`, `usage/route.ts` | 100% |
| **Export/Import** | `api/export/prompts/route.ts`, `api/import/prompts/route.ts` | 100% |
| **Autenticación** | `lib/auth.ts`, `middleware.ts` | 100% |
| **Tests** | `tests/api/prompts.test.ts`, `tests/components/PromptList.test.tsx`, `tests/api/auth.test.ts`, `tests/components/auth.test.tsx` | **RESUELTO**: 30 tests, 8 suites, TODOS PASAN |

### Nivel de detalle alcanzado

- **Archivos completos inspeccionados**: 13 archivos principales
- **Líneas de código analizadas**: ~2,500 líneas
- **Estructura de datos mapeada**: Modelo `Prompt` completo con relaciones
- **Contratos de API identificados**: Zod schemas de create/update
- **Flujos de navegación trazados**: Creación, edición, duplicado, listado

---

## 2. Resumen general de los cambios técnicos necesarios

### Grandes tipos de cambio necesarios

| Tipo de cambio | Descripción | Impacto |
|----------------|-------------|---------|
| **Evolución de modelo de datos** | Campos simples (`platform`, `category`) deben convertirse en relaciones múltiples | ALTO - Requiere migraciones DB |
| **Nuevos campos persistentes** | `prePrompt`, `manualDeUso` deben añadirse al modelo `Prompt` | MEDIO - Migración simple |
| **Cambios de validación** | Zod schemas deben aceptar arrays donde antes aceptaban strings | MEDIO - Cambios en API |
| **Cambios de comportamiento UX** | Navegación post-guardado debe permanecer en formulario | BAJO - Cambio en handler |
| **Nueva UI** | Vista lista debe añadirse a `PromptList` | MEDIO - Nuevo render |
| **Persistencia de preferencias** | Preferencia de vista debe guardarse por usuario | MEDIO - Nuevo campo en `User` |
| **Filtros multi-selección** | `PromptFilters` debe soportar múltiples valores | MEDIO - Cambio de componente |

### Zonas que concentran mayor esfuerzo técnico

| Zona | Esfuerzo | Justificación |
|------|----------|---------------|
| **Schema Prisma + Migraciones** | ALTO | Cambios estructurales en `Prompt` y posiblemente `User` |
| **PromptForm** | ALTO | 15+ campos afectados, gestión de estado compleja |
| **API Routes (Zod + Prisma queries)** | ALTO | Validación y queries deben soportar arrays |
| **PromptFilters** | MEDIO-ALTO | Multi-selección con lógica acumulativa |

### Qué parte parece ya resuelta

| Elemento | Estado actual | Intervención necesaria |
|----------|---------------|----------------------|
| `tags` (relación múltiple) | ✅ Ya es N:M vía `PromptTag` | Solo UI para crear nuevos tags |
| `createdAt`/`updatedAt` | ✅ Campos existentes en modelo | Solo hacer visibles en UI |
| Estructura 3 secciones en formulario | ✅ Basic Info, Metadata, Advanced | Solo añadir campos |
| Filtros URL-driven | ✅ Ya implementados | Solo evolucionar a multi-selección |
| Ownership check | ✅ Implementado en `[id]/route.ts` | Solo revisar para duplicado |

### Qué parte exige intervención real

| Elemento | Intervención requerida |
|----------|----------------------|
| `platform` | Evolucionar de string simple a array/relación N |
| `category` | Evolucionar de FK simple a relación N:M |
| `Client/Project`, `Use Case`, `Model Hint` | Evolucionar de strings simples a arrays con creación |
| `Language` | Cambiar de input texto a selector con opciones |
| Navegación post-guardado | Cambiar `router.push("/prompts")` por permanencia |
| Vista lista | Añadir nuevo modo de visualización |
| Preferencia de vista | Añadir campo en `User` + persistencia |

---

## 3. Cambios técnicos por área

### Frontend

| Sub-área | Cambios necesarios | Prioridad |
|----------|-------------------|-----------|
| **Componentes de Prompt** | `PromptForm`: campos multivalor, nuevos campos, navegación<br>`PromptList`: vista lista, cambio "View"→"Edit"<br>`PromptFilters`: multi-selección en Platform/Category | ALTA |
| **Gestión de estado** | `useState` en `PromptForm` debe manejar arrays para platform, category, clientOrProject, useCase, modelHint | ALTA |
| **Componentes UI** | Posible necesidad de componente multi-select reutilizable | MEDIA |

### Backend

| Sub-área | Cambios necesarios | Prioridad |
|----------|-------------------|-----------|
| **API Routes** | `POST /api/prompts`: Zod schema debe aceptar arrays<br>`PUT /api/prompts/[id]`: Mismo cambio + lógica de update de relaciones | ALTA |
| **Validación** | Zod schemas: `platform` de enum simple a array, `categoryId` de string a array | ALTA |
| **Autorización** | Revisar ownership en duplicado: ¿nuevo prompt pertenece a quien duplica? | MEDIA |

### Persistencia (Base de Datos)

| Sub-área | Cambios necesarios | Prioridad |
|----------|-------------------|-----------|
| **Schema Prisma** | `model Prompt`: `platform` → relación N o JSON array<br>`model Prompt`: `category` → relación N:M<br>`model Prompt`: nuevos campos `prePrompt`, `manualDeUso`<br>`model User`: campo `viewPreference` | ALTA |
| **Migraciones** | Scripts de migración para todos los cambios anteriores | ALTA |
| **Queries Prisma** | `findMany` con filtros debe soportar arrays (AND lógico) | ALTA |

### Integraciones

| Sub-área | Cambios necesarios | Prioridad |
|----------|-------------------|-----------|
| **Export/Import** | Exportación debe incluir arrays para platform, category, etc.<br>Importación debe parsear nuevos formatos | MEDIA |
| **Autenticación** | Sesión JWT debe incluir preferencia de vista (posible) | BAJA |

### Utilidades Compartidas

| Sub-área | Cambios necesarios | Prioridad |
|----------|-------------------|-----------|
| **Utils** | Posible utilidad para mapeo de arrays en export/import | BAJA |

---

## 4. Cambios por módulo, servicio, componente, contrato, integración o archivo

### Tabla Maestra de Cambios Técnicos

| Elemento afectado | Tipo | Ubicación | Situación actual observada | Cambio técnico necesario | Motivo | Relación con objetivo funcional | Nivel de certeza | Notas |
|-------------------|------|-----------|---------------------------|-------------------------|--------|--------------------------------|------------------|-------|
| **`model Prompt`** | Schema DB | `prisma/schema.prisma:61-93` | `platform String @default("CURSOR")` (simple) | **Decisión D-01**: Crear tabla `Platform` + junction table `PromptPlatform` para relación N:M | RF-06 a RF-11 requieren platform multivalor | Metadata - Platform | ALTO | Migración compleja: transformar datos existentes de string a relación |
| **`model Prompt`** | Schema DB | `prisma/schema.prisma:79` | `categoryId String?` (FK simple) | Convertir a relación N:M: `categories Category[]` vía `PromptCategory` junction table | RF-12 a RF-14 requieren category múltiple | Metadata - Category | ALTO | Patrón existente: `PromptTag` |
| **`model Prompt`** | Schema DB | `prisma/schema.prisma:61-93` | Sin campos `prePrompt`, `manualDeUso` | Añadir: `prePrompt String?`, `manualDeUso String?` | RF-26 a RF-28 requieren nuevos campos | Basic Information | ALTO | Campos opcionales, tipo TEXT |
| **`model User`** | Schema DB | `prisma/schema.prisma:11-24` | Sin campo para preferencia de vista | Añadir: `promptListViewPreference String @default("cards")` | RF-39 requiere persistencia por usuario | Listado y navegación | MEDIO | Alternativa: tabla separada `UserPreference` |
| **`createPromptSchema`** | Zod schema | `app/api/prompts/route.ts:6-23` | `platform: z.enum([...])` (simple) | **Decisión D-01**: Cambiar a relación con tabla `Platform`; validar IDs de platform existentes | RF-06 a RF-11 | Metadata - Platform | ALTO | También update schema |
| **`createPromptSchema`** | Zod schema | `app/api/prompts/route.ts:6-23` | `categoryId: z.string().optional()` | **Decisión D-01**: Cambiar a `categoryIds: z.array(z.string()).optional()` con relación N:M | RF-12 a RF-14 | Metadata - Category | ALTO | También update schema |
| **`createPromptSchema`** | Zod schema | `app/api/prompts/route.ts:6-23` | `clientOrProject: z.string().optional()` | **Decisión D-01**: Cambiar a relación N:M con tabla `ClientProject` + junction `PromptClientProject` | RF-15 a RF-22 | Metadata - Client/Project | ALTO | También para useCase, modelHint |
| **`createPromptSchema`** | Zod schema | `app/api/prompts/route.ts:6-23` | `language: z.string().default("en")` | **Decisión D-05**: Cambiar a `language: z.enum(["en","es","nl"]).default("en")` | RF-23 a RF-25 | Metadata - Language | ALTO | Opciones: en, es, nl |
| **`PromptForm`** | Componente | `components/prompt/PromptForm.tsx:58-96` | `platform: string` en estado | **Decisión D-01**: Cambiar a relación N:M con tabla `Platform`; UI multi-select con IDs | RF-06 a RF-11 | Metadata - Platform | ALTO | Similar a tags actual |
| **`PromptForm`** | Componente | `components/prompt/PromptForm.tsx:58-96` | `categoryId: string | null` en estado | **Decisión D-01**: Cambiar a relación N:M con junction `PromptCategory`; UI multi-select con IDs | RF-12 a RF-14 | Metadata - Category | ALTO | Similar a tags actual |
| **`PromptForm`** | Componente | `components/prompt/PromptForm.tsx:58-96` | `clientOrProject: string` en estado | **Decisión D-01**: Cambiar a relación N:M con tabla `ClientProject`; UI multi-select con IDs | RF-15 a RF-22 | Metadata - Client/Project | ALTO | Patrón tags con creación (D-06) |
| **`PromptForm`** | Componente | `components/prompt/PromptForm.tsx:58-96` | `useCase: string` en estado | **Decisión D-01**: Cambiar a relación N:M con tabla `UseCase`; UI multi-select con IDs | RF-15 a RF-22 | Metadata - Use Case | ALTO | Patrón tags con creación (D-06) |
| **`PromptForm`** | Componente | `components/prompt/PromptForm.tsx:58-96` | `modelHint: string` en estado | **Decisión D-01**: Cambiar a relación N:M con tabla `ModelHint`; UI multi-select con IDs | RF-15 a RF-22 | Metadata - Model Hint | ALTO | Patrón tags con creación (D-06) |
| **`PromptForm`** | Componente | `components/prompt/PromptForm.tsx:58-96` | `language: string` en estado | **Decisión D-05**: Cambiar a selector con opciones en, es, nl (mínimo; ampliable) | RF-23 a RF-25 | Metadata - Language | ALTO | Options: en, es, nl |
| **`PromptForm`** | Componente | `components/prompt/PromptForm.tsx:257-299` | Sin campos Pre-Prompt, Manual de uso | Añadir inputs después de `Prompt Body` | RF-26 a RF-28 | Basic Information | ALTO | Textarea opcionales |
| **`PromptForm`** | Componente | `components/prompt/PromptForm.tsx:257-299` | Sin visualización de fechas | Añadir display de `createdAt`, `updatedAt` (solo lectura) | RF-29 a RF-31 | Basic Information | ALTO | Usar campos existentes del modelo |
| **`PromptForm.handleSubmit`** | Handler | `components/prompt/PromptForm.tsx:103-128` | `router.push("/prompts")` tras guardar | Cambiar a: permanecer en `/prompts/[id]` | RF-32 a RF-35 | Continuidad del flujo | ALTO | También modo alta |
| **`PromptForm.handleDuplicate`** | Handler | `components/prompt/PromptForm.tsx:139-167` | `router.push("/prompts")` tras duplicar | Cambiar a: redirigir a `/prompts/[nuevo-id]` | RF-36 | Continuidad del flujo | ALTO | También set modo edición |
| **`PromptList`** | Componente | `components/prompt/PromptList.tsx:60-180` | Solo vista en cards (grid) | Añadir vista lista (tabla) + selector de vista | RF-37, RF-41 a RF-43 | Listado y navegación | ALTO | Toggle cards/list |
| **`PromptList`** | Componente | `components/prompt/PromptList.tsx:167` | Botón con texto "View" | Cambiar texto a "Edit" | RF-38 | Listado y navegación | ALTO | También en vista lista |
| **`PromptFilters`** | Componente | `components/prompt/PromptFilters.tsx:113-127` | Select simple para Platform | Cambiar a multi-select con checkboxes | RF-44, RF-46 | Filtros | ALTO | Lógica acumulativa (AND) |
| **`PromptFilters`** | Componente | `components/prompt/PromptFilters.tsx:92-106` | Select simple para Category | Cambiar a multi-select con checkboxes | RF-45, RF-47 | Filtros | ALTO | Lógica acumulativa (AND) |
| **`getPrompts`** | Función | `app/(app)/prompts/page.tsx:7-115` | `where.platform = searchParams.platform` (simple) | Cambiar a: `where.platform: { in: platforms }` | RF-44, RF-46 | Filtros | ALTO | También para category |
| **`GET /api/prompts`** | API Route | `app/api/prompts/route.ts:25-100` | `platform = searchParams.get("platform")` (simple) | Cambiar a: `platforms = searchParams.getAll("platform")` + `where.platform: { in: platforms }` | RF-44, RF-46 | Filtros | ALTO | Lógica AND para filtros |
| **`exportData.prompts`** | API Route | `app/api/export/prompts/route.ts:28-42` | `platform: prompt.platform` (string simple) | **Decisión D-02, D-04**: Nuevo formato con relaciones N:M; filtrar por userID; incluir todos los campos nuevos | RF-48 a RF-50 | Exportación | ALTO | También categories, clientOrProject, etc. |
| **`importSchema`** | Zod schema | `app/api/import/prompts/route.ts:5-11` | `prompts: z.array(z.any())` | **Decisión D-02, D-04**: Validar estructura con nuevos campos y relaciones; asignar userId del importador; reemplazar existentes por coincidencia (userId + ID/título) | RF-48 a RF-50 | Importación | ALTO | Schema específico con relaciones N:M |
| **`POST /api/prompts`** | API Route | `app/api/prompts/route.ts:103-163` | `tags.create` con tagIds | **Decisión D-01**: Crear relaciones N:M con Platform, Category, ClientProject, UseCase, ModelHint vía junction tables | RF-06 a RF-22 | Metadata | ALTO | Lógica de create de relaciones N:M |
| **`PUT /api/prompts/[id]`** | API Route | `app/api/prompts/[id]/route.ts:75-141` | `tags.create` con tagIds | **Decisión D-01, D-07**: Relaciones N:M con `$transaction` explícito para delete+create | RF-06 a RF-22 | Metadata | ALTO | Delete + create con `$transaction` para todas las relaciones |
| **`checkOwnership`** | Función | `app/api/prompts/[id]/route.ts:26-41` | Verifica owner para edit/delete | **Decisión D-03**: Duplicado NO verifica ownership del original; cualquiera puede duplicar cualquier prompt; nuevo prompt pertenece al usuario que duplica | RF-36 | Continuidad del flujo | ALTO | Duplicado crea prompt del usuario actual sin verificar original |

---

## 5. Qué parte parece ya soportada por el sistema actual

### Elementos sin intervención significativa necesaria

| Elemento | Evidencia | Por qué ya está soportado |
|----------|-----------|--------------------------|
| **`tags` (relación N:M)** | `schema.prisma:85`, `PromptTag` junction table | Ya existe patrón de relación múltiple vía tabla intermedia |
| **`createdAt`/`updatedAt`** | `schema.prisma:81-82` | Campos ya existen en modelo `Prompt` |
| **Estructura 3 secciones** | `PromptForm.tsx:228-531` | Basic Information, Metadata, Advanced ya existen |
| **Filtros URL-driven** | `PromptFilters.tsx:38-59` | Patrón ya implementado con `useSearchParams` |
| **Ownership check** | `[id]/route.ts:26-41` | Función `checkOwnership` ya implementada |
| **Validación Zod** | `route.ts:6-23` | Infraestructura de validación ya existe |
| **Sistema de autenticación** | `lib/auth.ts`, `middleware.ts` | NextAuth configurado con JWT + Credentials |
| **Export/Import JSON** | `api/export/prompts/route.ts`, `api/import/prompts/route.ts` | Infraestructura base ya existe |

### Elementos que requieren solo ajustes menores

| Elemento | Ajuste necesario | Complejidad |
|----------|-----------------|-------------|
| **Botón "View" → "Edit"** | Cambiar texto en `PromptList.tsx:167` | BAJA |
| **Navegación post-guardado** | Cambiar `router.push("/prompts")` por `router.push(\`/prompts/${id}\`)` | BAJA |
| **Handler de duplicado** | Mismo cambio que navegación + asegurar owner correcto | BAJA |

---

## 6. Qué parte requiere adaptación, ampliación o intervención real

### Requiere Adaptación (cambios sobre base existente)

| Elemento | Adaptación necesaria | Complejidad | RF afectados |
|----------|---------------------|-------------|--------------|
| **`PromptFilters` - Platform** | De select simple a multi-select con checkboxes | MEDIA | RF-44, RF-46 |
| **`PromptFilters` - Category** | De select simple a multi-select con checkboxes | MEDIA | RF-45, RF-47 |
| **`getPrompts` query** | De `where.platform = value` a `where.platform: { in: values }` | MEDIA | RF-44, RF-46 |
| **`GET /api/prompts`** | De `searchParams.get()` a `searchParams.getAll()` | BAJA | RF-44, RF-46 |
| **`PromptList`** | Añadir toggle vista cards/lista + render condicional | MEDIA | RF-37, RF-41 a RF-43 |

### Requiere Ampliación (nuevos campos/funcionalidades sobre base existente)

| Elemento | Ampliación necesaria | Complejidad | RF afectados |
|----------|---------------------|-------------|--------------|
| **`model Prompt`** | Añadir `prePrompt String?`, `manualDeUso String?` | BAJA | RF-26 a RF-28 |
| **`model User`** | Añadir `promptListViewPreference String @default("cards")` | BAJA | RF-39, RF-40 |
| **`PromptForm` UI** | Añadir campos Pre-Prompt, Manual de uso, visualización fechas | MEDIA | RF-26 a RF-31 |
| **`PromptForm` state** | Arrays para platforms, categoryIds, clientOrProjects, useCases, modelHints | MEDIA | RF-06 a RF-22 |
| **Zod schemas** | Arrays en lugar de strings para campos multivalor | MEDIA | RF-06 a RF-22 |
| **Exportación** | Incluir arrays en JSON de export | BAJA | RF-48 a RF-50 |
| **Importación** | Validar/parsear arrays en JSON de import | BAJA | RF-48 a RF-50 |

### Requiere Intervención Estructural (cambios que afectan arquitectura/contratos)

| Elemento | Intervención necesaria | Complejidad | RF afectados | Justificación |
|----------|----------------------|-------------|--------------|---------------|
| **`platform` en DB** | **Decisión D-01**: Crear tabla `Platform` + junction `PromptPlatform` para relación N:M | ALTA | RF-06 a RF-11 | Normalización completa; migración compleja |
| **`category` en DB** | De FK simple (`categoryId`) a relación N:M vía `PromptCategory` | ALTA | RF-12 a RF-14 | Requiere junction table `PromptCategory` |
| **`clientOrProject` en DB** | **Decisión D-01**: Crear tabla `ClientProject` + junction `PromptClientProject` | ALTA | RF-15 a RF-22 | Normalización completa con entidad propia |
| **`useCase` en DB** | **Decisión D-01**: Crear tabla `UseCase` + junction `PromptUseCase` | ALTA | RF-15 a RF-22 | Normalización completa con entidad propia |
| **`modelHint` en DB** | **Decisión D-01**: Crear tabla `ModelHint` + junction `PromptModelHint` | ALTA | RF-15 a RF-22 | Normalización completa con entidad propia |
| **`language` en DB** | **Decisión D-05**: De `String` simple a enum validado (en, es, nl) | BAJA-MEDIA | RF-23 a RF-25 | Cambio de tipo y validación |
| **API relations logic** | Create/update de múltiples relaciones N:M con `$transaction` (D-07) | ALTA | RF-06 a RF-22 | Lógica compleja en POST/PUT con transaccionalidad explícita |

---

## 7. Qué parte es incierta, incompatible o dependiente de validación adicional

### Incertidumbres Técnicas

| Elemento | Estado | Por qué | Qué se necesita para resolver |
|----------|--------|---------|------------------------------|
| **Modelado de `platform`** | **RESUELTO (D-01)**: Tabla `Platform` + relación N:M | Decisión tomada: normalización completa | Implementar migración |
| **Modelado de `clientOrProject`, `useCase`, `modelHint`** | **RESUELTO (D-01)**: Tablas nuevas + junction tables | Decisión tomada: normalización completa para todos | Implementar migración |
| **Persistencia de preferencia de vista** | Pendiente: campo en `User` recomendado | Campo en `User` es simple pero acopla; tabla separada es más flexible | Decisión de diseño: ¿una sola preferencia o múltiples futuras? |
| **Opciones de `Language`** | **RESUELTO (D-05)**: en, es, nl (mínimo; ampliable) | Decisión tomada | Implementar enum en Zod |
| **Creación de nuevos valores desde formulario** | **RESUELTO (D-06)**: Cualquier usuario autenticado; normalización (trim + lowercase) | Decisión tomada | Implementar endpoints con auth + unicidad |

### Potenciales Incompatibilidades

| Elemento | Incompatibilidad aparente | Evidencia | Impacto |
|----------|-------------------------|-----------|---------|
| **Category múltiple vs árbol jerárquico** | `Category` tiene estructura padre/hijo (`parentId`) | `schema.prisma:98-104` | Relación N:M con categorías anidadas puede complicar queries y UI |
| **Filtros acumulativos vs rendimiento** | Múltiples selecciones con lógica AND pueden ralentizar queries | `page.tsx:46-53` usa `where.tags.some` | Queries complejas con múltiples `AND`/`some` |
| **Export/Import con relaciones N:M** | **Decisión D-02**: Nuevo formato con todos los campos nuevos; exports antiguos son seed | `export/route.ts:28-42`, `import/route.ts:98-119` | Nuevo formato debe incluir relaciones; imports reemplazan existentes por coincidencia (userId + ID/título) |

### Dependiente de Validación Adicional

| Elemento | Qué debe validarse | Por qué |
|----------|-------------------|---------|
| **Migraciones de DB** | Scripts de migración para cambios estructurales | Cambios en `platform`, `category` requieren migración cuidadosa de datos existentes |
| **Tests de integración** | Actualizar `tests/api/prompts.test.ts` para nuevos comportamientos | Tests actuales asumen estructura simple |
| **Ownership en duplicado** | Confirmar que duplicado pertenece a usuario que duplica | `checkOwnership` no contempla explícitamente duplicado |
| **Fechas en modo alta** | Comportamiento de `createdAt`/`updatedAt` antes del primer guardado | RF-31 dice "no deben mostrarse" pero no define implementación exacta |

---

## 8. Observaciones que condicionan implementación posterior

### Para Bloque 03 (Objetivo vs Realidad)

| Observación | Condicionante |
|-------------|---------------|
| **Discrepancia mayor: `platform` simple vs multivalor** | Requiere decisión de modelado antes de implementación |
| **Discrepancia mayor: `category` simple vs múltiple** | Idem + complicación de árbol jerárquico |
| **Discrepancia: navegación expulsa vs permanece** | Cambio simple pero afecta UX significativamente |
| **Discrepancia: vista única cards vs cards+lista** | Requiere nuevo componente/render |

### Para Bloque 04 (Dependencias y Condicionantes)

| Observación | Condicionante |
|-------------|---------------|
| **Relaciones N:M múltiples** | Todas dependen de decisión de modelado (tablas vs JSON) |
| **Filtros multi-selección** | Dependen de cambios en API (queries con `in`) |
| **Preferencia de vista** | Depende de decisión de persistencia (campo en User vs tabla nueva) |
| **Export/Import** | Dependen de todos los cambios de modelo anteriores |

### Para Bloque 05 (Validación Técnica)

| Observación | Condicionante |
|-------------|---------------|
| **Tests existentes cubren estructura simple** | Tests deben reescribirse para arrays/relaciones |
| **Zod validation ya existe** | Patrón conocido, fácil de extender |
| **Prisma queries ya existen** | Patrón conocido, pero queries con relaciones N:M son más complejas |

### Para Bloque 06 (Seguridad Integrada)

| Observación | Condicionante |
|-------------|---------------|
| **Ownership check existe** | Pero debe clarificarse para duplicado |
| **Creación de nuevos valores (tags, platforms, etc.)** | Requiere validación de permisos + duplicados |
| **Preferencia de vista** | Dato no sensible, pero asociado a usuario |

### Para Bloque 07 (Riesgos y Decisiones Abiertas)

| Observación | Estado |
|-------------|--------|
| **Decisiones de modelado pendientes** | **RESUELTA (D-01)**: Tablas nuevas + relaciones N:M para todos los campos multivalor |
| **Compatibilidad de export/import** | **RESUELTA (D-02)**: Nuevo formato completo; imports reemplazan existentes por coincidencia |
| **Rendimiento de filtros complejos** | Riesgo vigente: queries lentas con múltiples selecciones |
| **Complejidad de UI para campos multivalor** | Riesgo vigente: UX confusa si no se diseña bien |

---

## 9. Evidencia principal utilizada

### Archivos de Código Inspeccionados

| Archivo | Líneas | Evidencia obtenida |
|---------|--------|-------------------|
| `prisma/schema.prisma` | 131 | Modelo `Prompt` actual con campos simples |
| `components/prompt/PromptForm.tsx` | 533 | Estado del formulario, handlers, UI actual |
| `components/prompt/PromptList.tsx` | 181 | Render en cards, botón "View" |
| `components/prompt/PromptFilters.tsx` | 217 | Filtros con selects simples |
| `app/(app)/prompts/page.tsx` | 230 | Fetch de datos, lógica de filtros |
| `app/(app)/prompts/new/page.tsx` | 37 | Wrapper de `PromptForm` (modo create) |
| `app/(app)/prompts/[id]/page.tsx` | 63 | Wrapper de `PromptForm` (modo edit) |
| `app/api/prompts/route.ts` | 163 | Zod schemas, POST/GET handlers |
| `app/api/prompts/[id]/route.ts` | 199 | PUT/DELETE handlers, ownership check |
| `app/api/prompts/[id]/usage/route.ts` | - | Tracking de uso (no crítico) |
| `app/api/export/prompts/route.ts` | 60 | Formato de exportación actual |
| `app/api/import/prompts/route.ts` | 144 | Formato de importación actual |
| `lib/auth.ts` | 62 | Configuración NextAuth |
| `middleware.ts` | ~30 | Protección de rutas |
| `tests/api/prompts.test.ts` | 152 | Tests existentes para API |

### Evidencia Clave por Tipo de Cambio

| Tipo de cambio | Evidencia clave | Conclusión |
|----------------|-----------------|------------|
| **`platform` simple** | `schema.prisma:66`, `PromptForm.tsx:67`, `route.ts:10` | String simple debe evolucionar |
| **`category` simple** | `schema.prisma:79`, `PromptForm.tsx:78`, `route.ts:22` | FK simple debe evolucionar a N:M |
| **`tags` múltiple** | `schema.prisma:85`, `PromptTag:122-131` | Patrón existente para replicar |
| **Navegación expulsa** | `PromptForm.tsx:125`, `PromptForm.tsx:164` | `router.push("/prompts")` debe cambiarse |
| **Botón "View"** | `PromptList.tsx:167` | Texto debe cambiar a "Edit" |
| **Filtros simples** | `PromptFilters.tsx:113-127` | Selects simples deben ser multi-select |
| **Fechas existen** | `schema.prisma:81-82` | `createdAt`/`updatedAt` ya existen |

---

## 10. Bloqueos o límites del análisis

### Lo que NO se ha podido determinar con suficiente fiabilidad

| Elemento | Razón de incertidumbre | Cómo condiciona los cambios técnicos |
|----------|----------------------|-------------------------------------|
| **Modelado óptimo para campos multivalor** | **RESUELTO (D-01)**: Tablas nuevas + N:M | Definición exacta de migraciones y queries ahora posible con 5 entidades nuevas + 5 junction tables |
| **Lista de idiomas para `Language`** | **RESUELTO (D-05)**: en, es, nl (mínimo) | Definición de enum en Zod ahora posible |
| **Reglas de creación de nuevos valores** | **RESUELTO (D-06)**: Cualquier usuario autenticado; normalización (trim + lowercase) | Lógica de API para create de tags, platforms, etc. ahora definida |
| **Impacto en rendimiento de filtros** | No hay datos de volumen actual de prompts | Dificulta decisión sobre estrategia de queries |

### Evidencia que ha faltado

| Evidencia faltante | Estado | Cómo se mitigará |
|--------------------|--------|------------------|
| **Volumen actual de datos** | **NO PROCEDE** en este momento | Asumir volumen bajo-medio para Hobby tier |
| **APIs de creación de tags/categories** | **RESUELTO**: Inspeccionados. POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización | Implementar D-06: normalización + unicidad |
| **Tests existentes** | **RESUELTO**: 30 tests, 8 suites, TODOS PASAN | Infraestructura funcional; ampliar cobertura |

### Cómo condiciona la definición de cambios técnicos necesarios

1. **Cambios estructurales en DB**: Definidos con D-01: 5 entidades nuevas (Platform, ClientProject, UseCase, ModelHint, Category junction) + 5 junction tables
2. **Zod schemas**: Definidos con D-05: enum de Language con en, es, nl
3. **Lógica de creación**: Definida con D-06: cualquier usuario autenticado con validación de unicidad y normalización

**Mitigación**: Los cambios técnicos se definen con alternativas cuando hay incertidumbre. Las decisiones abiertas se documentan para Bloque 07.

---

## 11. Clasificación de Cambios por Tipo

### Ya Soportado (sin intervención significativa)

| Elemento | Por qué ya está soportado |
|----------|--------------------------|
| `tags` relación N:M | `PromptTag` junction table ya existe |
| `createdAt`/`updatedAt` | Campos en modelo `Prompt` |
| Estructura 3 secciones | Basic Info, Metadata, Advanced ya existen |
| Filtros URL-driven | `useSearchParams` ya implementado |
| Ownership check | `checkOwnership` ya existe |
| Validación Zod | Infraestructura ya configurada |

### Requiere Ajuste (cambios puntuales)

| Elemento | Ajuste necesario |
|----------|-----------------|
| Botón "View" | Cambiar texto a "Edit" |
| Navegación post-guardado | Cambiar redirect a `/prompts/[id]` |
| Handler de duplicado | Mismo cambio + owner correcto |

### Requiere Ampliación (nuevos campos/funcionalidades)

| Elemento | Ampliación necesaria |
|----------|---------------------|
| `model Prompt` | `prePrompt`, `manualDeUso` |
| `model User` | `promptListViewPreference` |
| `PromptForm` UI | Nuevos campos, fechas visibles |
| `PromptForm` state | Arrays para multivalor |
| Zod schemas | Arrays en lugar de strings |
| Export/Import | Soporte para arrays |

### Requiere Intervención Estructural

| Elemento | Intervención necesaria |
|----------|----------------------|
| `platform` en DB | De string simple a relación N o array |
| `category` en DB | De FK simple a relación N:M |
| `clientOrProject`, `useCase`, `modelHint` | De strings simples a arrays/relaciones |
| `language` en DB | De string libre a enum |
| API relations logic | Create/update de múltiples relaciones N:M |

### Pendiente de Confirmación

| Elemento | Estado |
|----------|--------|
| Modelado de campos multivalor | **RESUELTO (D-01)**: Tablas nuevas + N:M |
| Lista de idiomas | **RESUELTO (D-05)**: en, es, nl |
| Reglas de creación | **RESUELTO (D-06)**: Cualquier usuario con normalización |
| Persistencia de preferencia | Pendiente: campo en User recomendado |

### Potencial Incompatibilidad

| Elemento | Incompatibilidad |
|----------|-----------------|
| Category múltiple + árbol jerárquico | Consultas complejas con parentId |
| Filtros acumulativos + rendimiento | Queries con múltiples `AND`/`some` |
| Export/Import nuevo vs antiguo | Compatibilidad de formatos |

---

## 12. Dependencias y Condicionantes

### Dependencias entre Cambios Técnicos

```
┌─────────────────────────────────────────────────────────┐
│ DECISIONES DE MODELADO (D-01 RESUELTA)                  │
│ Tablas nuevas + N:M para todos los campos:              │
│ - Platform + PromptPlatform                             │
│ - ClientProject + PromptClientProject                   │
│ - UseCase + PromptUseCase                               │
│ - ModelHint + PromptModelHint                           │
│ - Category + PromptCategory (ya existe Category)        │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ MIGRACIONES DB  │ │ ZOD SCHEMAS     │ │ API ROUTES      │
│ (schema.prisma) │ │ (route.ts)      │ │ (POST/PUT)      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                  ┌─────────────────┐
                  │ PROMPTFORM      │
                  │ (state + UI)    │
                  └─────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ PROMPTLIST      │ │ PROMPTFILTERS   │ │ EXPORT/IMPORT   │
│ (vista lista)   │ │ (multi-select)  │ │ (nuevo formato) │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Condicionantes Críticos

| Condicionante | Impacto |
|---------------|---------|
| **Decisión de modelado (D-01)** | **RESUELTA**: Tablas nuevas + N:M; 5 entidades + 5 junction tables | Condiciona migraciones, queries, Zod schemas, API logic |
| **Volumen de datos** | Pendiente | Condiciona estrategia de filtros complejos |
| **Formato export/import (D-02)** | **RESUELTA**: Nuevo formato completo; imports reemplazan por coincidencia | Condiciona formato de relaciones en JSON |

---

**Fin del documento**
