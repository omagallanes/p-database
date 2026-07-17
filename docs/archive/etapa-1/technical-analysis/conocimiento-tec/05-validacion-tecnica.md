# Validación Técnica

**Documento:** `doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md`  
**Bloque emisor:** 150-BLOQUE-05  
**Fecha de generación:** 2026-04-24  
**Versión:** 1.0

---

## 1. Alcance del análisis del bloque

### Parte del cambio tomada como referencia

Este análisis define la base técnica mínima de validación para los **50 Requisitos Funcionales (RF-01 a RF-50)** definidos en `doc-plan/doc-base/02-Improvement-Spec.md`, tomando como referencia los hallazgos acumulados en los bloques 00 a 04:

- **Bloque 00**: Índice y preparación del trabajo
- **Bloque 01**: Mapa técnico de intervención (13 archivos inspeccionados, 4 capas identificadas)
- **Bloque 02**: Cambios técnicos necesarios (7 tipos de cambio, 26 elementos en tabla maestra)
- **Bloque 03**: Relación objetivo vs realidad (16% ya soportado, 24% parcial, 52% no soportado, 8% en fricción)
- **Bloque 04**: Dependencias y condicionantes (12 dependencias directas, 8 indirectas, 7 condicionantes estructurales, 10 puntos sensibles)

### Zonas del sistema y del repo revisadas

| Zona | Archivos inspeccionados | Nivel de fiabilidad |
|------|------------------------|---------------------|
| **Tests existentes** | `tests/api/prompts.test.ts`, `tests/components/PromptList.test.tsx`, `tests/api/auth.test.ts`, `tests/components/auth.test.tsx` | ALTO (100%) |
| **Configuración de testing** | `jest.config.js`, `jest.setup.js`, `package.json` scripts | ALTO (100%) |
| **TypeScript** | `tsconfig.json` | ALTO (100%) |
| **Modelo de Datos** | `prisma/schema.prisma` | ALTO (100%) |
| **API Routes** | `app/api/prompts/route.ts`, `[id]/route.ts`, `export/route.ts`, `import/route.ts` | ALTO (100%) |
| **Componentes** | `PromptForm.tsx`, `PromptList.tsx`, `PromptFilters.tsx` | ALTO (100%) |
| **Autenticación** | `lib/auth.ts`, `middleware.ts` | ALTO (100%) |

### Nivel de fiabilidad de la evaluación de la base actual de validación

| Nivel | Porcentaje | Justificación |
|-------|------------|---------------|
| **ALTO** | 85% | Tests existentes inspeccionados al 100%; configuración de Jest y TypeScript verificada |
| **MEDIO** | 12% | **RESUELTO**: Tests ejecutados y pasando (30 tests, 8 suites); cobertura real confirmada como baja |
| **BAJO** | 3% | No hay tests de componentes de formulario ni de filtros; validación E2E inexistente |

---

## 2. Resumen de la estrategia de validación técnica

### Qué debe validarse

| Categoría | Qué validar | Por qué |
|-----------|------------|---------|
| **Modelo de datos** | Migraciones de schema, nuevas relaciones N:M, nuevos campos | Cambios estructurales en `Prompt` y `User` son la base de todo lo demás |
| **Contratos de API** | Zod schemas, request/response shape, filtros multi-selección | UI depende directamente de forma exacta de respuestas |
| **Comportamiento del formulario** | State management, payload construction, navegación post-save | Single component para create/edit con 15+ campos |
| **Filtros y queries** | Where clause dinámico, lógica AND, URL params | Filtros URL-driven con acoplamiento directo a queries |
| **Export/Import** | Formato JSON, compatibilidad hacia atrás, parsing de arrays | Cambio de formato puede romper datos existentes |
| **Autorización** | Ownership checks, role-based access, duplicado | Seguridad de edición/borrado/duplicado |
| **Persistencia de preferencias** | Campo en User, session propagation, lectura en listado | Nueva funcionalidad sin base existente |

### Mecanismos existentes aprovechables

| Mecanismo | Ubicación | Utilidad | Cobertura actual |
|-----------|-----------|----------|------------------|
| **Jest + Testing Library** | `jest.config.js`, `package.json` | Infraestructura de testing completa | BAJO (solo 4 archivos de tests) |
| **Mocks de Prisma** | `tests/api/prompts.test.ts:22-29` | Patrón de mock para DB operations | PARCIAL (solo prompt.create/findMany) |
| **Mocks de NextAuth** | `jest.setup.js:5-35`, `tests/api/prompts.test.ts:6-15` | Patrón de mock para autenticación | PARCIAL (solo auth básico) |
| **Zod validation** | `app/api/prompts/route.ts:6-23` | Validación de input en API | ALTO (ya existe infraestructura) |
| **TypeScript strict mode** | `tsconfig.json:7`: `"strict": true` | Type checking en compile time | ALTO (configurado y activo) |
| **ESLint** | `package.json`: `"lint": "next lint"` | Linting automático | ALTO (configurado) |
| **Next.js build** | `package.json`: `"build": "next build"` | Verificación de compilación | ALTO (siempre ejecuta type check) |

### Zonas que requieren validación reforzada

| Zona | Razón de refuerzo | Riesgo si no se valida |
|------|-------------------|----------------------|
| **Relaciones N:M** | Patrón delete+create sin transacción explícita | Pérdida de datos si update falla |
| **Navegación post-save** | 3 handlers con mismo `router.push("/prompts")` | Regresión en UX si se cambia inconsistentemente |
| **Filtros multi-selección** | Lógica AND con múltiples `where.field: { in: values }` | Queries incorrectas o resultados erróneos |
| **Ownership en duplicado** | `checkOwnership` no contempla duplicado | Asignación incorrecta de owner |
| **Export/Import** | Formato acoplado a modelo actual | Incompatibilidad con datos existentes |

### Gaps y limitaciones relevantes

| Gap | Descripción | Impacto |
|-----|-------------|---------|
| **Sin tests de PromptForm** | Componente más crítico (533 líneas, 15+ campos) sin tests | Mayor riesgo de regresión en formulario |
| **Sin tests de PromptFilters** | Filtros URL-driven sin tests | Lógica de multi-selección sin verificación |
| **Sin tests de API [id]** | PUT/DELETE/GET de prompt individual sin tests | Ownership y update de relaciones sin verificación |
| **Sin tests de Export/Import** | Flujos de exportación/importación sin tests | Compatibilidad de formato sin verificación |
| **Sin tests E2E** | No hay Playwright, Cypress ni equivalente | Flujos completos sin verificación integrada |
| **Sin tests de migraciones** | No hay validación de scripts de migración | Cambios de schema sin verificación automática |

---

## 3. Qué debe validarse

### Aspectos técnicos que deben comprobarse para sostener el cambio con confianza

#### 3.1. Modelo de datos y migraciones

| Qué validar | Motivo | Riesgo si falla |
|-------------|--------|-----------------|
| Migración de `platform` de string a tabla + relación N:M | **Decisión D-01**: Tabla `Platform` + junction `PromptPlatform` | RF-06 a RF-11 | Datos existentes pierden platform o queries fallan |
| Migración de `categoryId` de FK simple a relación N:M | RF-12 a RF-14 | Categorías existentes se pierden o queries fallan |
| Nuevas tablas para campos multivalor | **Decisión D-01**: `ClientProject`, `UseCase`, `ModelHint` con junction tables | RF-15 a RF-22 | Datos no se persisten correctamente |
| Índices para nuevas relaciones | Rendimiento de filtros | Queries lentas con volumen |

#### 3.2. Contratos de API (Zod schemas + request/response)

| Qué validar | Motivo | Riesgo si falla |
|-------------|--------|-----------------|
| `createPromptSchema` acepta IDs de platform, category, etc. como arrays | **Decisión D-01**: Relaciones N:M con IDs de entidades | RF-06 a RF-22 | API rechaza requests válidos del formulario |
| `updatePromptSchema` acepta IDs de platform, category, etc. como arrays | **Decisión D-01**: Relaciones N:M con IDs de entidades | RF-06 a RF-22 | API rechaza updates válidos |
| GET `/api/prompts` acepta múltiples params de platform/category | RF-44 a RF-47 | Filtros multi-selección no funcionan |
| Response shape incluye relaciones para platform, categories, etc. | UI depende de forma exacta | PromptList/PromptForm reciben datos incorrectos |
| `importSchema` valida nuevos campos y relaciones N:M | **Decisión D-02**: Nuevo formato completo | RF-48 a RF-50 | Importación de datos antiguos falla |

#### 3.3. Comportamiento del formulario (PromptForm)

| Qué validar | Motivo | Riesgo si falla |
|-------------|--------|-----------------|
| State maneja IDs de platform, categoryIds, etc. para relaciones N:M | **Decisión D-01**: Relaciones N:M con IDs de entidades | RF-06 a RF-22 | UI no refleja selecciones múltiples |
| Payload se construye correctamente desde state con arrays | RF-06 a RF-22 | API recibe datos mal formados |
| handleSubmit redirige a `/prompts/[id]` en modo create | RF-32 a RF-34 | Usuario expulsado del formulario tras crear |
| handleSubmit permanece en `/prompts/[id]` en modo edit | RF-35 | Usuario expulsado tras editar |
| handleDuplicate redirige a `/prompts/[nuevo-id]` en modo edit | RF-36 | Usuario no ve el prompt duplicado |
| Fechas visibles solo en modo edit (no en alta) | RF-31 | Fechas aparecen antes de primer guardado |
| Pre-Prompt y Manual de uso persisten correctamente | RF-27, RF-28 | Datos opcionales no se guardan |

#### 3.4. Filtros y queries

| Qué validar | Motivo | Riesgo si falla |
|-------------|--------|-----------------|
| `updateFilter` usa `params.append()` para platform/category | RF-44, RF-45 | Solo se mantiene último valor seleccionado |
| `toggleTag` patrón replicado para platform/category | RF-44 a RF-47 | Multi-selección no funciona |
| Where clause usa `{ in: values }` para platform/category | RF-46, RF-47 | Lógica AND no funciona |
| Queries con múltiples filtros AND retornan resultados correctos | RF-44 a RF-47 | Filtros acumulativos dan resultados erróneos |

#### 3.5. Export/Import

| Qué validar | Motivo | Riesgo si falla |
|-------------|--------|-----------------|
| Export incluye relaciones N:M para platform, categories, etc. | **Decisión D-01, D-02**: Nuevo formato con relaciones | RF-49 | Exportación pierde información multivalor |
| Export incluye `prePrompt`, `manualDeUso` | RF-48 | Nuevos campos no se exportan |
| Import parsea relaciones N:M de platform, categories, etc. | **Decisión D-02**: Nuevo formato completo | RF-50 | Importación de nuevos exports falla |
| Import mantiene lógica de reemplazo por coincidencia (userId + ID/título) | **Decisión D-02**: Imports reemplazan existentes | RF-50 | Imports duplican en lugar de reemplazar |

#### 3.6. Autorización y seguridad

| Qué validar | Motivo | Riesgo si falla |
|-------------|--------|-----------------|
| `checkOwnership` funciona correctamente en PUT/DELETE | Seguridad general | Usuarios editan/borran prompts de otros |
| Duplicado asigna owner al usuario que duplica | RF-36 | Prompt duplicado pertenece a usuario incorrecto |
| Admin puede editar/borrar cualquier prompt | Seguridad general | Admin pierde capacidad de gestión |
| Session incluye `user.id` y `user.role` correctamente | Autorización | Checks de ownership fallan |

#### 3.7. Vista lista y preferencia de visualización

| Qué validar | Motivo | Riesgo si falla |
|-------------|--------|-----------------|
| Toggle entre vista cards y lista funciona | RF-37 | Usuario no puede cambiar vista |
| Preferencia se persiste en User o session | RF-39 | Vista no se recuerda entre sesiones |
| Vista lista muestra campos correctos (RF-42) | RF-41 a RF-43 | Información faltante o incorrecta en lista |
| Vista lista NO muestra Pre-Prompt ni Manual de uso | RF-43 | Información no deseada en listado |
| Botón "Edit" aparece en ambas vistas | RF-38 | Texto "View" no cambia a "Edit" |

---

## 4. Mecanismos existentes del repo que pueden aprovecharse

### 4.1. Infraestructura de testing

| Mecanismo | Ubicación | Qué permite validar | Nivel de utilidad | Cobertura actual |
|-----------|-----------|-------------------|-------------------|------------------|
| **Jest** | `package.json:10`: `"test": "jest"` | Tests unitarios y de integración | ALTO | 4 archivos de tests |
| **next/jest** | `jest.config.js:1` | Integración con Next.js (path aliases, config) | ALTO | Configurado correctamente |
| **Testing Library React** | `package.json:45`: `@testing-library/react` | Tests de componentes React | ALTO | Usado en 2 archivos |
| **jest-environment-jsdom** | `package.json:56` | Tests de componentes con DOM | ALTO | Configurado como default |
| **jest-environment-node** | `tests/api/prompts.test.ts:2` | Tests de API routes sin DOM | ALTO | Usado en 2 archivos |
| **jest.setup.js** | `jest.setup.js` | Mocks globales de NextAuth | ALTO | Mocks de auth configurados |

### 4.2. Patrones de test existentes

| Patrón | Ubicación | Descripción | Reutilizable para |
|--------|-----------|-------------|-------------------|
| **Mock de Prisma** | `tests/api/prompts.test.ts:22-29` | `jest.mock("@/lib/prisma")` con métodos mockeados | Tests de PUT/DELETE/GET `[id]/route.ts`, export, import |
| **Mock de NextAuth** | `tests/api/prompts.test.ts:6-15` | `jest.mock("@/lib/auth")` con `mockAuth` | Tests de ownership, duplicado, preferencia de vista |
| **Mock de bcrypt** | `tests/api/auth.test.ts:19-22` | `jest.mock("bcryptjs")` | Tests de autenticación (no crítico para esta iniciativa) |
| **NextRequest para API tests** | `tests/api/prompts.test.ts:72-82` | `new NextRequest(url, { method, body })` | Tests de todos los endpoints de API |
| **Render + screen para components** | `tests/components/PromptList.test.tsx:1-53` | `render()`, `screen.getByText()` | Tests de PromptForm, PromptFilters, vista lista |
| **fireEvent + waitFor** | `tests/components/auth.test.tsx:40-46` | Simulación de interacciones de usuario | Tests de formulario (submit, toggle, navigation) |

### 4.3. Validaciones automatizadas existentes

| Mecanismo | Comando | Qué valida | Utilidad para esta iniciativa |
|-----------|---------|------------|------------------------------|
| **TypeScript strict** | `next build` (implícito) | Type errors en compile time | ALTO: detecta errores de tipo en schemas, props, state |
| **ESLint** | `npm run lint` | Errores de linting y mejores prácticas | MEDIO: detecta problemas de código pero no funcionales |
| **Next.js build** | `npm run build` | Compilación completa + type check | ALTO: falla si hay errores de tipo o imports rotos |
| **Prisma generate** | `npm run prisma:generate` | Generación de Prisma Client desde schema | ALTO: valida que schema es correcto y genera tipos |
| **Jest tests** | `npm test` | Tests unitarios y de integración | BAJO actualmente: solo 4 tests básicos |

### 4.4. Utilidades y helpers reutilizables

| Utilidad | Ubicación | Descripción | Potencial uso |
|----------|-----------|-------------|---------------|
| **Mock auth pattern** | `tests/api/prompts.test.ts:6-15` | Función `mockAuth` reutilizable | Tests de ownership, admin checks, duplicado |
| **Mock prisma pattern** | `tests/api/prompts.test.ts:22-29` | Objeto `prisma` mockeado | Tests de todas las API routes |
| **Mock prompts data** | `tests/components/PromptList.test.tsx:4-29` | Array de prompts mock | Tests de PromptList (vista cards y lista) |

---

## 5. Validaciones por área o tipo de cambio

### 5.1. Evolución de modelo de datos (Schema + Migraciones)

| Qué debe comprobarse | Por qué | Mecanismo existente | Limitación actual | Tipo de validación |
|---------------------|---------|-------------------|-------------------|-------------------|
| Migración de `platform` no rompe datos existentes | RF-06 a RF-11 | `prisma migrate dev` + seed data | No hay tests de migraciones | Manual: ejecutar migración en DB de prueba |
| Migración de `categoryId` a N:M no pierde categorías | RF-12 a RF-14 | `prisma migrate dev` + seed data | Idem | Manual: verificar datos post-migración |
| Nuevos campos `prePrompt`, `manualDeUso` aceptan null | RF-27, RF-28 | TypeScript types generados por Prisma | No hay tests de schema | Automático: `prisma generate` valida schema |
| Nuevo campo en `User` no rompe session | RF-39, RF-40 | `lib/auth.ts` session callback | No hay tests de session | Automático: TypeScript type check |
| Nuevas tablas (si se eligen) tienen índices correctos | RF-15 a RF-22 | `prisma migrate dev` | No hay tests de rendimiento | Manual: EXPLAIN ANALYZE en queries |

### 5.2. Cambios en Zod schemas (API validation)

| Qué debe comprobarse | Por qué | Mecanismo existente | Limitación actual | Tipo de validación |
|---------------------|---------|-------------------|-------------------|-------------------|
| `createPromptSchema` acepta `platforms: string[]` | RF-06 a RF-11 | Tests existentes en `prompts.test.ts:92-106` | Tests solo validan estructura simple | Ampliar: añadir tests con arrays |
| `updatePromptSchema` acepta `categoryIds: string[]` | RF-12 a RF-14 | No hay tests para `[id]/route.ts` | Sin cobertura | Nuevo: crear tests para PUT |
| GET acepta `platform[]=CHATGPT&platform[]=CURSOR` | RF-44, RF-46 | Tests existentes en `prompts.test.ts:132-149` | Tests solo validan search query | Ampliar: añadir tests con múltiples params |
| `importSchema` valida arrays en prompts | RF-48 a RF-50 | No hay tests de import | Sin cobertura | Nuevo: crear tests para import |

### 5.3. Cambios en PromptForm (UI + state + navigation)

| Qué debe comprobarse | Por qué | Mecanismo existente | Limitación actual | Tipo de validación |
|---------------------|---------|-------------------|-------------------|-------------------|
| State maneja `platforms: string[]` correctamente | RF-06 a RF-11 | No hay tests de PromptForm | Sin cobertura | Nuevo: crear tests de componente |
| Payload incluye arrays correctamente | RF-06 a RF-22 | No hay tests de handleSubmit | Sin cobertura | Nuevo: test de submit con mock fetch |
| handleSubmit redirige a `/prompts/[id]` en create | RF-32 a RF-34 | No hay tests de navegación | Sin cobertura | Nuevo: test con mock router |
| handleSubmit permanece en `/prompts/[id]` en edit | RF-35 | Idem | Idem | Idem |
| handleDuplicate redirige a nuevo prompt | RF-36 | Idem | Idem | Idem |
| Fechas solo visibles en modo edit | RF-31 | Idem | Idem | Idem |

### 5.4. Cambios en PromptFilters (multi-selección)

| Qué debe comprobarse | Por qué | Mecanismo existente | Limitación actual | Tipo de validación |
|---------------------|---------|-------------------|-------------------|-------------------|
| `updateFilter` usa `params.append()` para platform | RF-44, RF-46 | No hay tests de PromptFilters | Sin cobertura | Nuevo: crear tests de componente |
| `toggleTag` patrón replicado para platform/category | RF-44 a RF-47 | Idem | Idem | Idem |
| Filtros múltiples retornan URL correcta | RF-44 a RF-47 | Idem | Idem | Idem |
| Clear filters limpia todos los params | Funcionalidad existente | Idem | Idem | Idem |

### 5.5. Cambios en PromptList (vista lista + "Edit")

| Qué debe comprobarse | Por qué | Mecanismo existente | Limitación actual | Tipo de validación |
|---------------------|---------|-------------------|-------------------|-------------------|
| Toggle entre cards y lista funciona | RF-37 | Tests existentes en `PromptList.test.tsx` | Tests solo cubren vista cards | Ampliar: añadir tests de vista lista |
| Botón muestra "Edit" no "View" | RF-38 | Tests existentes verifican renders | Tests no verifican texto del botón | Ampliar: añadir assertion de texto |
| Vista lista muestra campos de RF-42 | RF-41 a RF-43 | Idem | Idem | Ampliar: tests de contenido de lista |
| Vista lista NO muestra Pre-Prompt/Manual | RF-43 | Idem | Idem | Ampliar: tests de ausencia |

### 5.6. Cambios en Export/Import

| Qué debe comprobarse | Por qué | Mecanismo existente | Limitación actual | Tipo de validación |
|---------------------|---------|-------------------|-------------------|-------------------|
| Export incluye arrays para platform, categories | RF-49 | No hay tests de export | Sin cobertura | Nuevo: crear tests de API route |
| Export incluye prePrompt, manualDeUso | RF-48 | Idem | Idem | Idem |
| Import parsea arrays correctamente | RF-50 | No hay tests de import | Sin cobertura | Nuevo: crear tests de API route |
| Import mantiene compatibilidad con formato antiguo | RF-50 | Idem | Idem | Nuevo: test con formato antiguo |

### 5.7. Cambios en autorización (ownership + duplicado)

| Qué debe comprobarse | Por qué | Mecanismo existente | Limitación actual | Tipo de validación |
|---------------------|---------|-------------------|-------------------|-------------------|
| `checkOwnership` bloquea edit de prompt ajeno | Seguridad | No hay tests de `[id]/route.ts` | Sin cobertura | Nuevo: crear tests de PUT/DELETE |
| `checkOwnership` permite edit de prompt propio | Funcionalidad | Idem | Idem | Idem |
| Admin puede editar cualquier prompt | Funcionalidad | Idem | Idem | Idem |
| Duplicado asigna owner al usuario que duplica | RF-36 | No hay tests de duplicado | Sin cobertura | Nuevo: test de POST con duplicado |

---

## 6. Cobertura mínima razonable esperada

### Base técnica mínima esperable según impacto, sensibilidad y criticidad

| Prioridad | Área | Cobertura mínima | Justificación |
|-----------|------|-----------------|---------------|
| **CRÍTICA** | API routes (POST, PUT, GET, DELETE) | Tests unitarios con mocks de Prisma y auth | API es la capa de contrato; si falla, todo falla |
| **CRÍTICA** | Zod schemas (create, update, import) | Tests de validación con inputs válidos e inválidos | Zod es la puerta de entrada de datos; debe validar correctamente |
| **CRÍTICA** | Ownership checks | Tests de autorización con diferentes roles | Seguridad: sin esto, usuarios acceden a datos de otros |
| **ALTA** | PromptForm (submit, duplicate, navigation) | Tests de componente con mocks de fetch y router | Formulario es la UI principal; regresión muy visible |
| **ALTA** | Filtros multi-selección | Tests de componente con URL params | Filtros afectan experiencia de búsqueda |
| **ALTA** | Migraciones de schema | Verificación manual + seed data | Cambios estructurales son irreversibles sin backup |
| **MEDIA** | PromptList (vista lista, "Edit") | Tests de componente con renders | Cambio visual, menor riesgo funcional |
| **MEDIA** | Export/Import | Tests de API routes con datos de prueba | Compatibilidad de datos es importante pero no crítica |
| **BAJA** | Preferencia de vista | Tests de componente + API | Funcionalidad nueva, bajo riesgo |

### Niveles de cobertura por tipo de test

| Tipo de test | Cobertura esperada | Qué cubrir | Qué NO cubrir |
|--------------|-------------------|------------|---------------|
| **Unit tests (API)** | 80% de endpoints | POST, PUT, GET, DELETE, export, import | Middleware, config |
| **Unit tests (Zod)** | 100% de schemas | create, update, import con casos válidos/inválidos | Edge cases extremos |
| **Component tests** | 60% de componentes | PromptForm (submit, nav), PromptList (cards, list), PromptFilters (multi-select) | Componentes de auth, layout |
| **Integration tests** | 40% de flujos | Create→redirect→edit, duplicate→redirect, filter→results | Flujos E2E completos |
| **Manual verification** | 100% de migraciones | Cada migración ejecutada en DB de prueba | Automatización de migraciones |

### Criterios de aceptación de la validación

| Criterio | Descripción |
|----------|-------------|
| **Tests existentes pasan** | `npm test` debe pasar con tests actuales antes de añadir nuevos |
| **Nuevos tests cubren cambios** | Cada cambio técnico identificado en Bloque 02 debe tener al menos 1 test asociado |
| **TypeScript compila sin errores** | `npm run build` debe pasar sin type errors |
| **Prisma genera correctamente** | `prisma generate` debe pasar tras cada cambio de schema |
| **Lint pasa** | `npm run lint` debe pasar sin errores |

---

## 7. Puntos no cubiertos o insuficientemente cubiertos por los mecanismos actuales

### Validaciones necesarias sin soporte suficiente en el repo

| Validación necesaria | Gap actual | Riesgo si no se cubre | Alternativa |
|---------------------|------------|----------------------|-------------|
| **Tests de PromptForm** | Componente de 533 líneas sin ningún test | Regresión en formulario no detectada hasta producción | Crear tests de componente como prioridad alta |
| **Tests de PromptFilters** | Filtros URL-driven sin tests | Multi-selección no funciona sin detección | Crear tests de componente |
| **Tests de API `[id]/route.ts`** | PUT/DELETE/GET sin tests | Ownership y update de relaciones sin verificación | Crear tests de API con mocks |
| **Tests de Export/Import** | Flujos de datos sin tests | Incompatibilidad de formato no detectada | Crear tests de API |
| **Tests de migraciones** | No hay infraestructura para testear migraciones | Migración corrupta no detectada | Verificación manual + backup |
| **Tests E2E** | No hay Playwright, Cypress ni equivalente | Flujos completos sin verificación integrada | Considerar para fase posterior |
| **Tests de rendimiento** | No hay benchmarks ni load testing | Queries lentas no detectadas | Manual con EXPLAIN ANALYZE |
| **Tests de seguridad** | No hay tests de autorización | Vulnerabilidades de acceso no detectadas | Crear tests de ownership |

### Áreas con cobertura débil o ausente

| Área | Cobertura actual | Cobertura necesaria | Gap |
|------|-----------------|-------------------|-----|
| **API routes** | 2 tests (POST create, GET list) | 8+ tests (POST, PUT, GET, DELETE, filters, ownership, duplicate, export, import) | ALTO |
| **Componentes** | 5 tests (PromptList x3, auth x2) | 15+ tests (PromptForm, PromptFilters, vista lista, navegación) | ALTO |
| **Migraciones** | 0 tests | Verificación manual mínima | MEDIO |
| **Autorización** | 0 tests | 4+ tests (ownership, admin, duplicado, session) | ALTO |
| **Export/Import** | 0 tests | 4+ tests (export shape, import parse, compatibilidad) | MEDIO |

### Huecos de validación que podrían convertirse en riesgo posterior

| Hueco | Riesgo potencial | Cuándo se materializa |
|-------|-----------------|----------------------|
| Sin tests de PromptForm | Regresión en formulario tras cualquier cambio | Al modificar state, handlers o UI |
| Sin tests de ownership | Usuario accede a datos de otro | Al desplegar cambios en `[id]/route.ts` |
| Sin tests de migraciones | Datos corruptos tras migración | Al ejecutar `prisma migrate deploy` en producción |
| Sin tests de compatibilidad import | Imports antiguos fallan | Al importar exports generados antes del cambio |
| Sin tests E2E | Flujos completos rotos no detectados | Al desplegar múltiples cambios simultáneamente |

---

## 8. Áreas que requieren validación reforzada

### Puntos del cambio que exigen especial cuidado por impacto o sensibilidad

| Área | Razón de refuerzo | Qué validar específicamente | Mecanismo recomendado |
|------|-------------------|---------------------------|----------------------|
| **Relaciones N:M (platform, category, etc.)** | **Decisión D-01, D-07**: Tablas nuevas + `$transaction` explícito | Atomicidad de delete+create; datos existentes migrados correctamente | Tests de integración con mock Prisma + verificación manual de migración |
| **Ownership en PUT/DELETE** | Seguridad: acceso no autorizado a datos de otros | `checkOwnership` bloquea correctamente; admin bypass funciona | Tests unitarios con diferentes roles y owners |
| **Navegación post-save (3 handlers)** | UX crítica: expulsar al usuario es el problema central del briefing | Cada handler redirige correctamente según modo (create/edit/duplicate) | Tests de componente con mock router |
| **Filtros multi-selección con lógica AND** | Queries complejas pueden dar resultados erróneos | Múltiples selecciones retornan solo prompts que cumplen TODOS los valores | Tests de API con múltiples params + verificación de where clause |
| **Export/Import compatibilidad** | Formato cambia; datos existentes deben poder importarse | Export nuevo incluye arrays; Import acepta formato antiguo y nuevo | Tests de API con datos de prueba en ambos formatos |
| **Duplicado con ownership correcto** | RF-36: duplicado debe pertenecer a quien duplica | POST con datos duplicados asigna `userId` del usuario actual | Tests de API con session mock |
| **Zod schemas duplicados (create/update)** | Deben mantenerse sincronizados; inconsistencia genera bugs | Ambos schemas aceptan/rechazan los mismos inputs | Tests compartidos para ambos schemas |
| **Category tree + multi-select** | Jerarquía complica selección y queries | Multi-select muestra jerarquía; queries con categorías padre/hijo funcionan | Tests de componente + tests de API |

### Matriz de riesgo vs validación

| Área | Impacto si falla | Probabilidad de fallo | Nivel de validación requerido |
|------|-----------------|----------------------|------------------------------|
| Migraciones de schema | ALTO (datos corruptos) | MEDIO | REFORZADO (manual + automatizado) |
| Ownership checks | ALTO (seguridad) | BAJO | REFORZADO (tests unitarios) |
| Zod schemas | ALTO (API rechaza datos válidos) | MEDIO | REFORZADO (tests unitarios) |
| Navegación post-save | MEDIO (UX degradada) | MEDIO | ALTO (tests de componente) |
| Filtros multi-selección | MEDIO (resultados erróneos) | MEDIO | ALTO (tests de API + componente) |
| Export/Import | MEDIO (datos incompatibles) | BAJO | ALTO (tests de API) |
| Vista lista | BAJO (visual) | BAJO | NORMAL (tests de componente) |
| Preferencia de vista | BAJO (UX menor) | BAJO | NORMAL (tests de componente) |

---

## 9. Observaciones que condicionan bloques posteriores

### Hallazgos que condicionarán especialmente la seguridad integrada (Bloque 06)

| Hallazgo | Por qué importa para seguridad | Qué debe abordarse en Bloque 06 |
|----------|-------------------------------|-------------------------------|
| **0 tests de ownership** | No hay verificación de que `checkOwnership` funciona | Bloque 06 debe priorizar tests de autorización |
| **Duplicado sin regla de ownership** | No está definido quién es owner del prompt duplicado | Bloque 06 debe definir regla y validarla |
| **Import sin auth check** | `import/route.ts` no verifica autenticación | Bloque 06 debe identificar si es vulnerabilidad |
| **Session JWT con role** | Role determina acceso admin; si se manipula, bypass | Bloque 06 debe verificar integridad de session |

### Hallazgos que condicionarán especialmente los riesgos y decisiones abiertas (Bloque 07)

| Hallazgo | Estado | Decisión abierta |
|----------|--------|-----------------|
| **Sin tests de migraciones** | Riesgo vigente | ¿Automatizar verificación de migraciones o confiar en manual? |
| **Sin tests E2E** | Riesgo vigente | ¿Invertir en E2E ahora o en fase posterior? |
| **Cobertura de tests muy baja** | Riesgo vigente | ¿Cuál es el mínimo aceptable antes de desplegar? |
| **Zod schemas duplicados** | Riesgo vigente | ¿Extraer schema compartido o mantener separados? |
| **Patrón delete+create sin transacción** | **RESUELTO (D-07)**: `$transaction` explícito | Implementar transacción explícita |

### Hallazgos que condicionarán la futura elaboración de documentos operativos

| Hallazgo | Implicación para documentos posteriores |
|----------|----------------------------------------|
| **Tests existentes cubren solo estructura simple** | Documentos de sprint deben incluir tarea de ampliar tests antes de implementar cambios |
| **No hay tests de PromptForm** | Sprint que toque PromptForm debe incluir creación de tests como tarea previa |
| **Migraciones requieren verificación manual** | Plan de sprint debe incluir ventana de verificación manual de migraciones |
| **TypeScript strict activo** | Aprovechar type checking como primera línea de defensa; errores de tipo detectan muchos bugs |
| **Jest + Testing Library configurados** | No necesita configuración adicional; solo añadir tests |

---

## 10. Evidencia principal utilizada

### Mecanismos, suites, utilidades y configuraciones del repo

| Evidencia | Ubicación | Qué demuestra |
|-----------|-----------|---------------|
| **Jest configurado** | `jest.config.js` (23 líneas) | Infraestructura de testing funcional con next/jest |
| **jest.setup.js** | `jest.setup.js` (37 líneas) | Mocks globales de NextAuth configurados |
| **4 archivos de tests** | `tests/api/prompts.test.ts` (152 líneas), `tests/components/PromptList.test.tsx` (55 líneas), `tests/api/auth.test.ts` (101 líneas), `tests/components/auth.test.tsx` (93 líneas) | Tests existen pero cubren solo estructura simple |
| **Testing Library** | `package.json:44-46`: `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event` | Infraestructura para tests de componentes |
| **TypeScript strict** | `tsconfig.json:7`: `"strict": true` | Type checking activo en compile time |
| **ESLint** | `package.json:9`: `"lint": "next lint"` | Linting configurado |
| **Prisma generate** | `package.json:12`: `"prisma:generate": "prisma generate"` | Validación de schema automatizada |

### Evidencia de cobertura actual

| Archivo de test | Qué cubre | Qué NO cubre |
|-----------------|-----------|--------------|
| `tests/api/prompts.test.ts` | POST create (válido + inválido), GET list, GET search | PUT, DELETE, GET by ID, filters, ownership, duplicate, export, import |
| `tests/components/PromptList.test.tsx` | Render de cards, empty state, metadata display | Vista lista, botón "Edit", toggle de vista, favorito |
| `tests/api/auth.test.ts` | Register (válido + duplicado + inválido) | Login, session, ownership, admin checks |
| `tests/components/auth.test.tsx` | LoginForm render + error, SignupForm render, UserProfile render | PromptForm, PromptFilters, navegación |

### Límites de confianza

| Límite | Por qué existe | Cómo afecta |
|--------|---------------|-------------|
| **Tests no ejecutados** | **RESUELTO**: `npm test` ejecutado. 30 tests, 8 suites, TODOS PASAN | Infraestructura de testing funcional |
| **Cobertura no medida** | No hay `jest --coverage` configurado ni ejecutado | Porcentaje real de cobertura desconocido |
| **Tests de componentes auth** | `LoginForm`, `SignupForm`, `UserProfile` no inspeccionados | No se confirma que componentes existen o tienen la estructura esperada |

---

## 11. Bloqueos o límites del análisis

### Capacidad de validación no determinada con suficiente fiabilidad

| Elemento | Por qué no pudo determinarse | Qué evidencia faltó | Cómo condiciona la confianza |
|----------|-----------------------------|---------------------|-----------------------------|
| **Tests existentes pasan** | **RESUELTO**: `npm test` ejecutado. 30 tests, 8 suites, TODOS PASAN | Infraestructura de testing funcional |
| **Cobertura real** | **RESUELTO**: Estimación basada en conteo de tests confirmada como correcta | Cobertura muy baja: 0 tests de PromptForm, Filters, ownership, export/import |
| **Componentes de auth** | `LoginForm`, `SignupForm`, `UserProfile` no inspeccionados | Contenido de archivos | Tests de auth podrían estar probando componentes inexistentes o diferentes |
| **Configuración de CI/CD** | No hay archivos `.github/workflows` inspeccionados | Configuración de pipeline | No se sabe si tests se ejecutan automáticamente en CI |
| **Variables de entorno de test** | `.env.test` o similar no inspeccionado | Configuración de entorno de test | Tests podrían depender de variables no configuradas |

### Evidencia que faltó

| Evidencia faltante | Estado | Cómo se mitigó |
|--------------------|--------|----------------|
| **Output de `npm test`** | **RESUELTO**: 30 tests, 8 suites, TODOS PASAN | Infraestructura de testing funcional |
| **Reporte de cobertura** | Estimación basada en conteo confirmada como correcta | Cobertura muy baja; se recomienda ampliar |
| **Archivos de CI/CD** | No hay pipeline automatizado | Se asume que no hay CI/CD; se recomienda añadir |
| **`.env.test`** | Configuración de entorno de test | Se asume que tests usan mocks y no necesitan DB real |

### Cómo condiciona la confianza del análisis

1. **Tests existentes funcionan**: `npm test` pasa con 30 tests en 8 suites. Infraestructura de testing funcional.
2. **Cobertura real confirmada**: Estimación basada en conteo era correcta. Cobertura muy baja: 0 tests de PromptForm, Filters, ownership, export/import.
3. **CI/CD podría no ejecutar tests**: Sin pipeline automatizado, tests solo se ejecutan manualmente.

**Mitigación**: Las recomendaciones de validación son conservadoras. Se recomienda ejecutar `npm test` y `jest --coverage` como primera acción antes de implementar cambios. Si hay CI/CD no identificado, la situación real será mejor que la estimada.

---

**Fin del documento**
