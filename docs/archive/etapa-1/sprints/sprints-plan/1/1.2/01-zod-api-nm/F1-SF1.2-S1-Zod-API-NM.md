# F1-SF1.2-S1 — Zod Schemas + API Routes para N:M

**Fase**: 1 — Database Foundation  
**Subfase**: 1.2 — Zod schemas + API routes para N:M  
**Sprint**: 1 (único de la Subfase)  
**Fecha**: 2026-04-24  
**Estado**: Planificado

---

## 1. Identificación

| Campo | Valor |
|-------|-------|
| **Fase** | 1 — Database Foundation |
| **Subfase** | 1.2 — Zod schemas + API routes para N:M |
| **Sprint** | 1 — Zod schemas + API routes para N:M |
| **Objetivo del Sprint** | Actualizar todos los Zod schemas y API routes de prompts para aceptar, validar y persistir relaciones N:M (platforms, categories, clientProjects, useCases, modelHints) mediante arrays de IDs, con transaccionalidad explícita ($transaction) para operaciones de update. |
| **Dependencia directa** | SF-1.1 completada (4 entidades nuevas + 5 junction tables + migraciones aplicadas + tipos TypeScript generados) |

---

## 2. Base documental aplicada

### Documentos principales

| Documento | Secciones aplicadas | Uso |
|-----------|---------------------|-----|
| `doc-plan/doc-base/04-Phases-Subphases-Plan.md` | SF-1.2 (fila de tabla) | Definición de objetivo, dependencias, validación |
| `doc-plan/doc-base/04-Phases-Subphases-Plan-Definicion.md` | §4.3, §5 | Principios de nivel Sprint |
| `doc-plan/doc-base/01-Briefing.md` | §3 (Alcance), §5 (Impactos) | Contexto funcional |
| `doc-plan/doc-base/02-Improvement-Spec.md` | §1.1 (Metadata), RF-06 a RF-22 | Requisitos funcionales cubiertos |
| `doc-plan/doc-base/03-Tech-Intervention-Plan.md` | §4.3, §4.4, §6 | Mapa técnico de intervención |

### Documentos parciales aplicados

| Documento | Secciones aplicadas | Uso |
|-----------|---------------------|-----|
| `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md` | §4 (Tabla Maestra), §6 (Intervención Estructural), §12 (Dependencias) | Cambios técnicos concretos por archivo |
| `doc-plan/doc-implementar/conocimiento-tec/04-dependencias-y-condicionantes-tecnicos.md` | §3 (Dependencias directas), §5 (Condicionantes estructurales), §6 (Puntos sensibles) | Cadenas de dependencia y puntos de riesgo |
| `doc-plan/doc-implementar/conocimiento-tec/06-seguridad-integrada.md` | §4 (Puntos con impacto), §5 (Preservar), §6 (Reforzar) | Controles de seguridad y refuerzos necesarios |

### Informes previos usados

| Informe | Uso |
|---------|-----|
| `sprints-plan/1/1.1/01-core-entities/F1-SF1.1-S1-informe.md` | Verificar que entidades Platform, ClientProject, UseCase, ModelHint están creadas |
| `sprints-plan/1/1.1/02-junction-tables/F1-SF1.1-S2-informe.md` | Verificar que junction tables y migración están aplicadas; tipos TypeScript generados |

### Gobernanza aplicada

Ver `.gobernanza/.governance/reglas_proyecto.md` (R1-R18), `inventario_recursos.md`, `conocimiento_tecnico_preventivo.md`, `integracion-prisma-typescript.md`.

---

## 3. Alcance del Sprint

### Qué debe conseguir este Sprint

1. Zod schemas de create y update aceptan arrays de IDs para: `platformIds`, `categoryIds`, `clientProjectIds`, `useCaseIds`, `modelHintIds`
2. POST `/api/prompts` crea relaciones N:M en las 5 junction tables a partir de arrays de IDs
3. PUT `/api/prompts/[id]` actualiza relaciones N:M con patrón delete+create envuelto en `$transaction` explícito (D-07)
4. GET `/api/prompts` incluye las 5 relaciones N:M en la respuesta (include actualizado)
5. GET `/api/prompts/[id]` incluye las 5 relaciones N:M en la respuesta
6. Tests de validación Zod pasan con arrays de IDs
7. Tests de POST/PUT crean/actualizan relaciones N:M correctamente
8. `npm test` sin regresiones (30 tests existentes siguen pasando)

### Qué NO entra en este Sprint

- Cambios en el formulario UI (SF-2.1)
- Cambios en filtros multi-selección (SF-3.2)
- Cambios en export/import (SF-4.1, SF-4.2)
- Creación inline de nuevos valores (endpoints POST para Platform, etc.)
- Rate limiting (SF-4.3)
- Migraciones de datos existentes (ya aplicadas en SF-1.1-S2)
- Cambios en el schema Prisma (ya completados en SF-1.1)

---

## 4. Elementos afectados

### Archivos concretos

| Archivo | Ruta | Tipo de cambio |
|---------|------|----------------|
| `route.ts` (GET/POST) | `app/api/prompts/route.ts` | Zod schemas + POST handler + GET include |
| `route.ts` (PUT/DELETE) | `app/api/prompts/[id]/route.ts` | Zod schemas + PUT handler con $transaction + GET include |
| `prompts.test.ts` | `tests/api/prompts.test.ts` | Nuevos tests de validación y relaciones N:M |

### Módulos y capas implicadas

| Capa | Elemento | Qué se cambia |
|------|----------|---------------|
| **Validación (Zod)** | `createPromptSchema` | `platform: z.enum(...)` → `platformIds: z.array(z.string()).optional()`; `categoryId: z.string().optional()` → `categoryIds: z.array(z.string()).optional()`; añadir `clientProjectIds`, `useCaseIds`, `modelHintIds` como arrays opcionales |
| **Validación (Zod)** | `updatePromptSchema` | Mismos cambios que createPromptSchema |
| **API (POST)** | `POST /api/prompts` handler | Crear relaciones N:M en 5 junction tables desde arrays de IDs (replicar patrón de `tags.create`) |
| **API (PUT)** | `PUT /api/prompts/[id]` handler | Delete+create de relaciones N:M envuelto en `$transaction` explícito (D-07) |
| **API (GET)** | `GET /api/prompts` handler | Actualizar `include` para añadir: `platforms`, `categories`, `clientProjects`, `useCases`, `modelHints` |
| **API (GET by ID)** | `GET /api/prompts/[id]` handler | Mismo include actualizado |
| **Tests** | `prompts.test.ts` | Tests de validación Zod con arrays; tests de POST con relaciones N:M; tests de PUT con $transaction |

---

## 5. Plan de acción

### Acción 1: Actualizar Zod schemas en POST route

**Archivo**: `app/api/prompts/route.ts`

1. En `createPromptSchema`:
   - Eliminar `platform: z.enum([...])`
   - Añadir `platformIds: z.array(z.string()).optional()`
   - Cambiar `categoryId: z.string().optional()` por `categoryIds: z.array(z.string()).optional()`
   - Eliminar `clientOrProject: z.string().optional()`
   - Añadir `clientProjectIds: z.array(z.string()).optional()`
   - Eliminar `useCase: z.string()`
   - Añadir `useCaseIds: z.array(z.string()).optional()`
   - Eliminar `modelHint: z.string().optional()`
   - Añadir `modelHintIds: z.array(z.string()).optional()`
   - Cambiar `language: z.string().default("en")` por `language: z.enum(["en", "es", "nl"]).default("en")` (D-05)

2. En `updatePromptSchema` (en `[id]/route.ts`): aplicar los mismos cambios

**Por qué**: Los schemas actuales validan strings simples; las nuevas relaciones N:M requieren arrays de IDs de entidades existentes.

**Relación con SF-1.2**: Es el primer bloque de la cadena Schema → Zod → State → UI. Sin Zod actualizado, la API rechaza payloads válidos.

### Acción 2: Actualizar POST handler para crear relaciones N:M

**Archivo**: `app/api/prompts/route.ts`

1. En el handler POST, tras crear el prompt con `prisma.prompt.create`:
   - Para cada array de IDs recibido (`platformIds`, `categoryIds`, `clientProjectIds`, `useCaseIds`, `modelHintIds`):
     - Crear entradas en la junction table correspondiente usando `prisma.promptPlatform.createMany`, `prisma.promptCategory.createMany`, etc.
   - Replicar el patrón existente de `tags.create` (ver `route.ts:119-146`) pero usando `createMany` para eficiencia

2. Alternativa más limpia: usar nested writes en el `prisma.prompt.create`:
   ```typescript
   prisma.prompt.create({
     data: {
       // ... campos básicos
       platforms: { create: platformIds?.map(id => ({ platform: { connect: { id } } })) || [] },
       categories: { create: categoryIds?.map(id => ({ category: { connect: { id } } })) || [] },
       // ... repetir para clientProjects, useCases, modelHints
     }
   })
   ```

**Por qué**: El POST actual solo crea relaciones de tags; debe extenderse a las 5 nuevas relaciones N:M.

**Relación con Improvement-Spec**: RF-06 a RF-22 (todos los campos multivalor de Metadata).

### Acción 3: Actualizar PUT handler con $transaction para relaciones N:M

**Archivo**: `app/api/prompts/[id]/route.ts`

1. Envolver toda la operación de update en `prisma.$transaction([...])` (D-07)
2. Dentro de la transacción:
   - `prisma.prompt.update` para campos básicos
   - Para cada relación N:M:
     - `prisma.promptPlatform.deleteMany({ where: { promptId } })`
     - `prisma.promptPlatform.createMany({ data: platformIds?.map(id => ({ promptId, platformId: id })) || [] })`
   - Repetir para: `PromptCategory`, `PromptClientProject`, `PromptUseCase`, `PromptModelHint`
3. Mantener el patrón existente de tags (deleteMany + create) pero dentro de la misma transacción

**Por qué**: El patrón actual de delete+create no es transaccional; si el create falla después del delete, se pierden datos. D-07 exige `$transaction` explícito.

**Relación con SF-1.2**: Validación técnica requiere atomicidad en operaciones de update de relaciones N:M.

### Acción 4: Actualizar includes en GET handlers

**Archivos**: `app/api/prompts/route.ts`, `app/api/prompts/[id]/route.ts`

1. En el `include` de `GET /api/prompts`:
   - Añadir: `platforms: { include: { platform: true } }`
   - Añadir: `categories: { include: { category: true } }`
   - Añadir: `clientProjects: { include: { clientProject: true } }`
   - Añadir: `useCases: { include: { useCase: true } }`
   - Añadir: `modelHints: { include: { modelHint: true } }`
   - Mantener existentes: `category` (eliminar si ya no existe como FK simple), `tags: { include: { tag: true } }`

2. Aplicar el mismo include en `GET /api/prompts/[id]`

**Por qué**: Las queries actuales no incluyen las nuevas relaciones; sin include, la respuesta no contiene los datos N:M.

**Nota**: Verificar en `schema.prisma` los nombres exactos de las relaciones (plural/singular) tras las migraciones de SF-1.1.

### Acción 5: Crear tests de validación Zod con arrays

**Archivo**: `tests/api/prompts.test.ts`

1. Test: `createPromptSchema` acepta payload con `platformIds: ["id1", "id2"]`
2. Test: `createPromptSchema` acepta payload con `categoryIds: ["id1"]`
3. Test: `createPromptSchema` acepta payload vacío (todos los arrays opcionales)
4. Test: `createPromptSchema` rechaza `platformIds: [123]` (números en lugar de strings)
5. Test: `updatePromptSchema` acepta payload con arrays parciales (solo actualizar algunas relaciones)
6. Test: `language` acepta solo "en", "es", "nl"; rechaza "fr"

**Por qué**: Sin tests de validación, no hay verificación de que los schemas aceptan el nuevo formato.

### Acción 6: Crear tests de POST con relaciones N:M

**Archivo**: `tests/api/prompts.test.ts`

1. Test: POST con `platformIds` crea entradas en `PromptPlatform`
2. Test: POST con múltiples arrays (platformIds + categoryIds) crea entradas en ambas junction tables
3. Test: POST sin arrays crea prompt sin relaciones N:M
4. Test: POST con `language: "es"` persiste correctamente

**Por qué**: Verificar que la lógica de creación de relaciones funciona end-to-end.

### Acción 7: Crear tests de PUT con $transaction

**Archivo**: `tests/api/prompts.test.ts`

1. Test: PUT con nuevos `platformIds` reemplaza relaciones existentes
2. Test: PUT con `platformIds: []` elimina todas las relaciones de platform
3. Test: PUT con arrays parciales (solo platformIds, sin categoryIds) no afecta otras relaciones
4. Test: Verificar que la transacción es atómica (si un create falla, no se pierden datos)

**Por qué**: Verificar que el patrón delete+create con $transaction funciona correctamente.

### Acción 8: Ejecutar suite completa de tests

1. `npm test` — verificar que los 30 tests existentes siguen pasando
2. Ejecutar nuevos tests añadidos
3. Verificar cobertura en archivos modificados

**Por qué**: Comprobación de no regresión obligatoria antes de cerrar el Sprint.

---

## 6. Validación y pruebas

### Qué debe validarse

| Elemento | Validación | Mecanismo |
|----------|-----------|-----------|
| Zod schemas aceptan arrays | Tests unitarios de schemas | Tests de Acción 5 |
| POST crea relaciones N:M | Tests de API con mock Prisma | Tests de Acción 6 |
| PUT actualiza relaciones con atomicidad | Tests de API con mock Prisma | Tests de Acción 7 |
| GET retorna relaciones N:M | Tests de API verificando include | Tests integrados en Acciones 6-7 |
| No regresión | `npm test` completo | Tests existentes (30 tests) |

### Qué pruebas deben ejecutarse

1. `npm test` — suite completa (30 tests existentes + nuevos tests)
2. `npm run lint` — sin errores
3. `npm run typecheck` — sin errores de tipo
4. `npx prisma generate` — verificar que tipos TypeScript están actualizados (deberían estarlo tras SF-1.1-S2)

### Mecanismos existentes del repositorio

Ver `05-validacion-tecnica.md` §7.2: Jest + Testing Library configurados, mocks de Prisma y NextAuth existentes, patrón de mock en `tests/api/prompts.test.ts:22-29`.

---

## 7. Seguridad y no regresión

### Qué debe preservarse

| Control | Ubicación | Por qué preservar |
|---------|-----------|-------------------|
| Auth en POST | `route.ts:105-112` | Verificar sesión antes de crear prompt |
| Auth en PUT/DELETE | `[id]/route.ts:80-87` | Verificar sesión + ownership antes de editar |
| Ownership check | `[id]/route.ts:26-41` | Impide edición de prompts de otros usuarios |
| Zod validation como puerta de entrada | Ambos route.ts | Previene inyección de datos malformados |
| Role-based admin bypass | `[id]/route.ts:37` | Admins pueden gestionar todos los prompts |

### Qué debe revisarse

1. **Zod schemas**: Validar que los arrays de IDs no aceptan valores vacíos dentro del array (cada ID debe ser string no vacío)
2. **Include en GET**: Verificar que no se exponen campos sensibles (password, etc.) a través de las nuevas relaciones
3. **$transaction**: Confirmar que todas las operaciones de delete+create están dentro de la misma transacción

### Riesgos de regresión a controlar

| Riesgo | Mitigación |
|--------|-----------|
| Tests existentes fallan por cambio en response shape | Ejecutar `npm test` antes de cerrar Sprint; si fallan, ajustar assertions |
| Zod schemas duplicados se desincronizan | Aplicar exactamente los mismos cambios en create y update schemas |
| Include repetido olvidado en algún handler | Revisar los 4 puntos donde se usa include (GET, GET by ID, POST response, PUT response) |

---

## 8. Criterios de finalización

Este Sprint se considera completado cuando se cumplan TODOS los siguientes criterios:

### Checklist de finalización

- [X] `createPromptSchema` acepta `platformIds`, `categoryIds`, `clientProjectIds`, `useCaseIds`, `modelHintIds` como arrays opcionales de strings
- [X] `updatePromptSchema` tiene los mismos campos de array que `createPromptSchema`
- [X] `language` en ambos schemas es `z.enum(["en", "es", "nl", "fr", "de", "pt", "it", "catalán/valenciano", "vasco", "gallego"]).default("es")`
- [X] POST `/api/prompts` crea relaciones N:M en las 5 junction tables
- [X] PUT `/api/prompts/[id]` actualiza relaciones N:M con `$transaction` explícito
- [X] GET `/api/prompts` incluye las 5 relaciones N:M en la respuesta
- [X] GET `/api/prompts/[id]` incluye las 5 relaciones N:M en la respuesta
- [X] Tests de validación Zod con arrays creados y pasando
- [X] Tests de POST con relaciones N:M creados y pasando
- [X] Tests de PUT con $transaction creados y pasando
- [X] `npm test` completo sin fallos (40 tests existentes + nuevos)
- [X] `npm run lint` sin errores
- [X] `npm run typecheck` sin errores

---

## 9. Riesgos o advertencias

### Incidencias previsibles

1. **Nombres de relaciones en Prisma**: Los nombres exactos de las relaciones (plural/singular) dependen de cómo se definieron en `schema.prisma` durante SF-1.1. Verificar con `npx prisma generate` y revisar los tipos generados antes de escribir código.
2. **Include repetido**: El mismo `include` está copiado en 4+ lugares. Riesgo de olvidar actualizar uno. Mitigación: buscar todos los `include` en los dos archivos route.ts.
3. **Zod schemas duplicados**: Create y update están en archivos distintos. Riesgo de desincronización. Mitigación: aplicar cambios en paralelo.

### Dependencias sensibles

- **SF-1.1 debe estar completada**: Este Sprint asume que las 4 entidades nuevas + 5 junction tables existen y los tipos TypeScript están generados. Si SF-1.1 no está completa, este Sprint no puede empezar.
- **SF-1.3 (migraciones)**: Puede ejecutarse en paralelo con este Sprint, ya que SF-1.2 no depende de migraciones aplicadas (solo del schema definido).

### Limitaciones o alertas relevantes

- **Cobertura de tests**: Este Sprint añade tests de API pero no tests de componente (PromptForm). Los tests de formulario corresponden a SF-2.1.
- **Auth manual en API**: El middleware excluye `/api`; cada handler debe incluir `auth()` manualmente. Verificar que ningún handler nuevo lo omite.
- **Volumen de datos desconocido**: El rendimiento de queries con múltiples includes no puede predecirse; se asume volumen bajo-medio (Hobby tier).

---

**Fin del documento**
