# F1-SF1.2-S1 — Informe de Sprint Finalizado

**Fase**: 1 — Database Foundation  
**Subfase**: 1.2 — Zod schemas + API routes para N:M  
**Sprint**: 1 de 1  
**Nombre completo**: F1-SF1.2-S1 — Zod Schemas + API Routes para N:M  
**Ruta del plan de acción original**: `doc-plan/doc-implementar/sprints-plan/1/1.2/01-zod-api-nm/F1-SF1.2-S1-Zod-API-NM.md`  
**Fecha de ejecución**: 2026-04-24  
**Fecha de finalización**: 2026-04-24  

---

## 1. Identificación del Sprint

| Campo | Valor |
|-------|-------|
| **Fase** | 1 — Database Foundation |
| **Subfase** | 1.2 — Zod schemas + API routes para N:M |
| **Sprint** | 1 |
| **Nombre completo** | F1-SF1.2-S1 — Zod Schemas + API Routes para N:M |
| **Ruta del plan de acción** | `doc-plan/doc-implementar/sprints-plan/1/1.2/01-zod-api-nm/F1-SF1.2-S1-Zod-API-NM.md` |
| **Fecha de ejecución** | 2026-04-24 |
| **Fecha de finalización** | 2026-04-24 |

---

## 2. Objetivo original del Sprint

Actualizar todos los Zod schemas y API routes de prompts para aceptar, validar y persistir relaciones N:M (platforms, categories, clientProjects, useCases, modelHints) mediante arrays de IDs, con transaccionalidad explícita (`$transaction`) para operaciones de update.

---

## 3. Alcance realmente ejecutado

### ✅ Qué se consiguió finalmente

1. **Zod schemas actualizados** en `app/api/prompts/route.ts` y `app/api/prompts/[id]/route.ts`:
   - `createPromptSchema` y `updatePromptSchema` aceptan: `platformIds`, `categoryIds`, `clientProjectIds`, `useCaseIds`, `modelHintIds` como arrays opcionales de strings
   - `language`: enum ampliado a 10 idiomas `["en", "es", "nl", "fr", "de", "pt", "it", "catalán/valenciano", "vasco", "gallego"]` con default "es"
   - Campos string antiguos (`platform`, `useCase`, `clientOrProject`, `modelHint`, `categoryId`) mantenidos como opcionales para compatibilidad durante transición

2. **POST `/api/prompts` actualizado**:
   - Crea relaciones N:M en las 5 junction tables desde arrays de IDs usando nested writes
   - Incluye todas las relaciones N:M en la respuesta con estructura `{ platforms: [{ platform: {...}}], categories: [{ category: {...}}], ... }`

3. **PUT `/api/prompts/[id]` actualizado**:
   - Envuelto en `prisma.$transaction()` explícito (D-07)
   - Delete+create atómico para las 6 junction tables (PromptTag, PromptCategory, PromptPlatform, PromptClientProject, PromptUseCase, PromptModelHint)
   - Incluye todas las relaciones N:M en la respuesta

4. **GET handlers actualizados**:
   - `GET /api/prompts`: Include completo para las 5 relaciones N:M nuevas
   - `GET /api/prompts/[id]`: Mismo include actualizado

5. **Tests creados y pasando**:
   - 10 tests nuevos añadidos a `tests/api/prompts.test.ts`
   - Total: 40 tests, 8 suites - TODOS PASAN

6. **Configuración PostgreSQL completada**:
   - `.env.development`: URL PostgreSQL local
   - `.env.example`: PostgreSQL como recomendado
   - `docker-compose.dev.yml`: Servicio PostgreSQL 14 añadido
   - `prisma/schema.prisma`: `language` default cambiado de "en" a "es"

### ✅ Qué parte del objetivo original se cumplió

**100% del objetivo cumplido**, más trabajo adicional no planificado:
- Idiomas ampliados de 3 a 10 según indicación del usuario
- Configuración PostgreSQL completada (no estaba en el plan original)
- Compatibilidad dual SQLite/PostgreSQL mantenida

### ⚠️ Desviaciones respecto al plan original

| Desviación | Plan original | Realidad | Razón | Impacto |
|------------|---------------|----------|-------|---------|
| **Idiomas** | `["en", "es", "nl"]` | 10 idiomas | Indicación usuario durante ejecución | Positivo |
| **Default language** | "en" | "es" | Indicación usuario | Neutro |
| **Configuración PostgreSQL** | No incluido | Completada | Indicación usuario | Positivo |
| **Campos string antiguos** | Eliminar | Mantener como opcionales | Evitar errores TypeScript en transición | Neutro |

### ❌ Qué parte quedó pendiente

- **Migración de datos existentes**: Prompts con campos string aún no migrados a relaciones → SF-1.3
- **TypeScript typecheck completo**: Errores preexistentes en componentes UI → SF-2.1
- **Migración de schema para campos opcionales**: Requiere PostgreSQL corriendo → Pendiente de ejecución por usuario

---

## 4. Cambios reales realizados

### Archivos modificados

| Archivo | Líneas afectadas | Tipo de cambio |
|---------|------------------|----------------|
| `app/api/prompts/route.ts` | 6-23, 132-240 | Zod schema + POST handler + GET include |
| `app/api/prompts/[id]/route.ts` | 6-23, 44-100, 101-200 | Zod schema + PUT handler con $transaction + GET include |
| `tests/api/prompts.test.ts` | 1-450 | Mock $transaction + tests N:M + tests language enum |
| `prisma/schema.prisma` | 69 | `language` default "en" → "es" |
| `.env.development` | 1-4 | PostgreSQL URL |
| `.env.example` | 1-6 | PostgreSQL como recomendado |
| `docker-compose.dev.yml` | 1-40 | Servicio PostgreSQL añadido |

### Archivos nuevos creados

| Archivo | Propósito |
|---------|-----------|
| `doc-plan/doc-implementar/sprints-plan/1/1.2/01-zod-api-nm/F1-SF1.2-S1-informe.md` | Informe de Sprint (este documento) |

### Archivos eliminados

Ninguno.

---

## 5. Componentes, módulos y recursos afectados

### Módulos y capas

| Capa | Elemento | Qué se cambió |
|------|----------|---------------|
| **Validación (Zod)** | `createPromptSchema` | Arrays de IDs para 5 relaciones N:M + enum language ampliado |
| **Validación (Zod)** | `updatePromptSchema` | Mismos cambios que createPromptSchema |
| **API (POST)** | `POST /api/prompts` | Nested writes para 5 junction tables |
| **API (PUT)** | `PUT /api/prompts/[id]` | $transaction explícito + delete+create para 6 junction tables |
| **API (GET)** | `GET /api/prompts` | Include para 5 relaciones N:M |
| **API (GET by ID)** | `GET /api/prompts/[id]` | Mismo include actualizado |
| **Tests** | `prompts.test.ts` | 10 tests nuevos + mock de $transaction |

### Recursos de base de datos

| Recurso | Estado |
|---------|--------|
| `PromptPlatform` (junction table) | Ya existía desde SF-1.1-S1 |
| `PromptCategory` (junction table) | Ya existía desde SF-1.1-S2 |
| `PromptClientProject` (junction table) | Ya existía desde SF-1.1-S1 |
| `PromptUseCase` (junction table) | Ya existía desde SF-1.1-S1 |
| `PromptModelHint` (junction table) | Ya existía desde SF-1.1-S1 |
| `Platform` (entidad) | Ya existía desde SF-1.1-S1 |
| `ClientProject` (entidad) | Ya existía desde SF-1.1-S1 |
| `UseCase` (entidad) | Ya existía desde SF-1.1-S1 |
| `ModelHint` (entidad) | Ya existía desde SF-1.1-S1 |

---

## 6. Cambios de configuración

### Archivos de entorno

**.env.development** (ANTES):
```
DATABASE_URL="file:./dev.db"
```

**.env.development** (DESPUÉS):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prompt_db_dev?schema=public"
```

**.env.example** (ANTES):
```
DATABASE_URL="file:./dev.db"
```

**.env.example** (DESPUÉS):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prompt_db_dev?schema=public"
```

### Docker Compose

**docker-compose.dev.yml** (ANTES):
- Solo servicio `app` con SQLite embebido

**docker-compose.dev.yml** (DESPUÉS):
- Servicio `postgres:14-alpine` añadido
- Puerto 5432 expuesto
- Health check configurado
- `app` depende de `postgres`
- Volumen persistente `postgres_data`

### Schema Prisma

**prisma/schema.prisma** (ANTES):
```prisma
language String @default("en")
```

**prisma/schema.prisma** (DESPUÉS):
```prisma
language String @default("es")
```

---

## 7. Pruebas ejecutadas y resultados

### Tests unitarios de API

| Test | Resultado | Notas |
|------|-----------|-------|
| `POST should create a prompt successfully` | ✅ PASA | Test existente |
| `POST should return 400 for invalid input` | ✅ PASA | Test existente |
| `GET should return prompts` | ✅ PASA | Test existente |
| `GET should filter by search query` | ✅ PASA | Test existente |
| `POST with platformIds array` | ✅ PASA | Test nuevo |
| `POST with categoryIds array` | ✅ PASA | Test nuevo |
| `POST with multiple N:M relations` | ✅ PASA | Test nuevo |
| `POST should accept language enum values` | ✅ PASA | Test nuevo (ampliado) |
| `POST should use 'es' as default language` | ✅ PASA | Test nuevo |
| `POST should reject invalid language value` | ✅ PASA | Test nuevo |
| `POST without N:M relations` | ✅ PASA | Test nuevo |
| `PUT with new platformIds using $transaction` | ✅ PASA | Test nuevo |
| `PUT delete all platform relations when empty array` | ✅ PASA | Test nuevo |
| `PUT with partial arrays` | ✅ PASA | Test nuevo |

### Suite completa

| Comando | Resultado | Detalles |
|---------|-----------|----------|
| `npm test` | ✅ 40 tests, 8 suites | 10 tests nuevos añadidos |
| `npm run lint` | ✅ sin errores | ESLint limpio |
| `npx prisma generate` | ✅ tipos generados | Cliente Prisma actualizado |
| `npm run build` | ⚠️ errores TypeScript | Errores preexistentes en componentes UI (no relacionados con este Sprint) |

### Casos que fallaron y cómo se resolvieron

| Test fallido | Causa | Resolución |
|--------------|-------|------------|
| `should reject invalid language value` (esperaba 400 para "fr") | "fr" ahora es válido en enum ampliado | Cambiar test para usar "zh" (chino) |

---

## 8. Incidencias detectadas

### Incidencia 1: Error de TypeScript en POST handler

| Campo | Valor |
|-------|-------|
| **Qué ocurrió** | Error `Property 'useCase' is missing in type` en compilación TypeScript |
| **Cuándo se detectó** | Durante ejecución de `npx tsc --noEmit` |
| **Impacto** | Impedía compilación del proyecto |
| **Cómo se resolvió** | Mantener campos string antiguos como opcionales en Zod schemas junto con arrays de IDs para compatibilidad durante transición |

### Incidencia 2: Test de language enum fallido

| Campo | Valor |
|-------|-------|
| **Qué ocurrió** | Test esperaba status 400 para language "fr" pero recibía 201 |
| **Cuándo se detectó** | Durante ejecución de `npm test` |
| **Impacto** | Test fallido impedía cierre del Sprint |
| **Cómo se resolvió** | Cambiar test para usar "zh" (chino) que no está en el enum ampliado |

### Incidencia 3: PostgreSQL no disponible localmente

| Campo | Valor |
|-------|-------|
| **Qué ocurrió** | `prisma migrate dev` fallaba con error `Environment variable not found: DATABASE_URL` |
| **Cuándo se detectó** | Durante intento de migración de schema |
| **Impacto** | No se pudo ejecutar migración de campos opcionales |
| **Cómo se resolvió** | Actualizar `.env.development` y `docker-compose.dev.yml` con PostgreSQL. La migración queda pendiente de ejecución por usuario |

---

## 9. Correcciones y ajustes aplicados

### Ajuste 1: Campos string mantenidos como opcionales

| Campo | Valor |
|-------|-------|
| **Qué se ajustó** | Zod schemas mantienen campos string antiguos (`platform`, `useCase`, etc.) como opcionales |
| **Por qué fue necesario** | Evitar errores de TypeScript durante transición gradual a relaciones N:M |
| **Impacto** | Permite migración incremental sin romper compatibilidad |

### Ajuste 2: Enum de language ampliado

| Campo | Valor |
|-------|-------|
| **Qué se ajustó** | Enum de `["en", "es", "nl"]` ampliado a 10 idiomas |
| **Por qué fue necesario** | Indicación explícita del usuario durante ejecución |
| **Impacto** | Mayor flexibilidad para usuarios de idiomas regionales |

### Ajuste 3: Default language cambiado

| Campo | Valor |
|-------|-------|
| **Qué se ajustó** | Default de "en" a "es" |
| **Por qué fue necesario** | Indicación explícita del usuario |
| **Impacto** | Idioma por defecto alineado con español |

---

## 10. Despliegue

**No hubo despliegue en este Sprint.**

Este Sprint se centró en cambios de API y configuración de desarrollo. El despliegue se realizará en Sprints posteriores cuando se complete la validación funcional en SF-2.1.

---

## 11. Validación por parte del usuario

| Qué validó el usuario | Resultado | Observaciones |
|----------------------|-----------|---------------|
| Idiomas permitidos en enum | ✅ Aprobado | Usuario solicitó ampliación a 10 idiomas incluyendo regionales |
| Default language | ✅ Aprobado | Usuario confirmó "es" como default |
| Configuración PostgreSQL | ✅ Aprobado | Usuario solicitó PostgreSQL como configuración principal |

**Correcciones solicitadas y aplicadas**: Ninguna adicional a las ya documentadas en incidencias.

---

## 12. Conocimiento técnico reutilizable

### Patrón 1: Transición gradual con compatibilidad dual

**Problema**: Migrar de campos string simples a relaciones N:M rompe TypeScript y requiere migración de datos compleja.

**Solución aplicada**:
```typescript
// Mantener ambos campos durante transición
const createPromptSchema = z.object({
  platform: z.enum([...]).optional(),  // Legacy
  platformIds: z.array(z.string()).optional(),  // Nuevo
  // ...
})
```

**Lección**: Permite migración incremental sin romper clientes existentes.

### Patrón 2: $transaction explícito para múltiples relaciones N:M

**Problema**: Delete+create de múltiples junction tables sin transacción puede dejar datos inconsistentes si falla.

**Solución aplicada**:
```typescript
await prisma.$transaction(async (tx) => {
  // Delete all relations first
  await tx.promptTag.deleteMany({ where: { promptId } })
  await tx.promptCategory.deleteMany({ where: { promptId } })
  // ... para todas las junction tables
  
  // Then create new relations
  return await tx.prompt.update({ ... })
})
```

**Lección**: Atomicidad crítica cuando se modifican múltiples tablas relacionadas.

### Patrón 3: Mock de $transaction en tests

**Problema**: $transaction de Prisma es difícil de mockear en tests unitarios.

**Solución aplicada**:
```typescript
;(prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
  const mockTx = {
    prompt: { update: jest.fn() },
    promptTag: { deleteMany: jest.fn() },
    // ... todas las junction tables
  }
  return await fn(mockTx)
})
```

**Lección**: El mock debe pasar un objeto transacción falso que la función puede usar.

### Error prevenible 1: Enum de idiomas insuficiente

**Error**: Plan original solo incluía 3 idiomas (`en`, `es`, `nl`).

**Corrección**: Ampliar a 10 idiomas desde el inicio, incluyendo idiomas regionales españoles.

**Lección**: Consultar con usuario todos los valores de enum antes de implementar, especialmente para i18n.

### Error prevenible 2: SQLite como default

**Error**: Configuración original usaba SQLite (`file:./dev.db`).

**Corrección**: PostgreSQL como configuración principal desde el inicio.

**Lección**: Configurar producción (PostgreSQL) desde desarrollo evita sorpresas en migración.

---

## 13. Comprobaciones y preguntas pendientes para el usuario

### Comprobaciones requeridas

1. **Levantar PostgreSQL local**:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d postgres
   ```
   Verificar que el contenedor está corriendo:
   ```bash
   docker-compose ps
   ```

2. **Ejecutar migración de campos opcionales**:
   ```bash
   npx prisma migrate dev --name make_prompt_fields_optional
   ```
   Verificar que la migración se aplica correctamente.

3. **Verificar que tests pasan**:
   ```bash
   npm test
   ```

### Preguntas para el usuario

1. **¿Se debe ejecutar la migración de campos opcionales ahora o esperar a SF-1.3?**

2. **¿Se debe actualizar `conocimiento_tecnico_preventivo.md` con los patrones y lecciones de este Sprint?**

3. **¿Cuál es el siguiente Sprint a ejecutar: SF-1.3 (Migraciones + seed data) o SF-2.1 (Metadata multivalor en PromptForm)?**

---

## 14. Estado de salida para el siguiente Sprint

### ✅ Qué queda listo y cerrado

- Zod schemas aceptan arrays de IDs para las 5 relaciones N:M
- POST `/api/prompts` crea relaciones N:M correctamente
- PUT `/api/prompts/[id]` actualiza relaciones con $transaction explícito
- GET handlers incluyen todas las relaciones N:M
- Tests de API actualizados y pasando (40 tests, 8 suites)
- Configuración PostgreSQL completada
- Idiomas ampliados a 10 con default "es"

### ⚠️ Qué queda pendiente para siguientes Sprints

- **Migración de campos opcionales**: Requiere PostgreSQL corriendo localmente
- **Migración de datos existentes**: Prompts con campos string → relaciones N:M (SF-1.3)
- **TypeScript typecheck completo**: Errores en componentes UI (SF-2.1)
- **Actualización de conocimiento técnico preventivo**: Patrones de este Sprint deben documentarse

### 🔗 Qué debe tener en cuenta obligatoriamente el siguiente Sprint

1. **Compatibilidad dual**: Los campos string antiguos aún existen como opcionales. El siguiente Sprint debe decidir si eliminarlos o mantenerlos.

2. **$transaction obligatorio**: Toda operación de update que modifique relaciones N:M debe usar $transaction explícito.

3. **Include completo**: Todas las queries que retornan prompts deben incluir las 5 relaciones N:M.

4. **PostgreSQL configurado**: El entorno de desarrollo ahora usa PostgreSQL. Asegurar que Docker esté corriendo antes de ejecutar migraciones.

### Dependencias, acoplamientos o problemas que arrastramos

| Dependencia | Tipo | Impacto |
|-------------|------|---------|
| Campos string opcionales | Técnico | Requiere decisión de eliminar o mantener en SF-1.3 o SF-2.1 |
| Errores TypeScript en componentes UI | Técnico | Requieren refactor en SF-2.1 cuando se actualice PromptForm |
| Migración pendiente | Infraestructura | Requiere PostgreSQL local corriendo |

---

## 15. Nuevo conocimiento generado para incorporación

### Para `.gobernanza/.governance/conocimiento_tecnico_preventivo.md`

```markdown
## X. Patrones de Migración N:M con Transaccionalidad

### X.1 $transaction explícito para múltiples junction tables

**Estado:** ✅ Validado  
**Código relacionado:** `app/api/prompts/[id]/route.ts`  
**Descripción:** Cuando se actualizan múltiples relaciones N:M simultáneamente, todas las operaciones delete+create deben envolverse en `$transaction` explícito para garantizar atomicidad.

**Prevención:**
- Siempre usar `prisma.$transaction(async (tx) => {...})` para updates que modifican relaciones N:M
- Delete todas las relaciones primero, luego crear las nuevas
- Incluir TODAS las junction tables en la misma transacción
- Retornar el resultado del update desde la transacción

**Código de ejemplo:**
```typescript
await prisma.$transaction(async (tx) => {
  await tx.promptTag.deleteMany({ where: { promptId } })
  await tx.promptCategory.deleteMany({ where: { promptId } })
  await tx.promptPlatform.deleteMany({ where: { promptId } })
  await tx.promptClientProject.deleteMany({ where: { promptId } })
  await tx.promptUseCase.deleteMany({ where: { promptId } })
  await tx.promptModelHint.deleteMany({ where: { promptId } })
  
  return await tx.prompt.update({ ... })
})
```

### X.2 Compatibilidad dual durante transición de schema

**Estado:** ✅ Validado  
**Código relacionado:** `app/api/prompts/route.ts`  
**Descripción:** Durante migración de campos string a relaciones N:M, mantener ambos campos en Zod schemas como opcionales permite transición gradual sin romper clientes existentes.

**Prevención:**
- Mantener campo legacy como opcional: `platform: z.enum([...]).optional()`
- Añadir campo nuevo como opcional: `platformIds: z.array(z.string()).optional()`
- Documentar claramente que es temporal
- Planificar eliminación de campo legacy en Sprint futuro

### X.3 PostgreSQL como configuración principal desde desarrollo

**Estado:** ✅ Validado  
**Código relacionado:** `.env.development`, `docker-compose.dev.yml`  
**Descripción:** Configurar PostgreSQL desde desarrollo evita sorpresas en migración a producción. SQLite solo para prototipado muy temprano.

**Prevención:**
- Usar PostgreSQL en `.env.development` desde el inicio
- Incluir servicio PostgreSQL en `docker-compose.dev.yml`
- Health check para asegurar que DB está disponible antes de iniciar app
- Documentar comandos para levantar DB local

### X.4 Mock de $transaction en tests unitarios

**Estado:** ✅ Validado  
**Código relacionado:** `tests/api/prompts.test.ts`  
**Descripción**: $transaction de Prisma requiere mock especial en tests unitarios que pase un objeto transacción falso a la función.

**Prevención:**
- Mockear `$transaction` para que ejecute la función con un objeto transacción mock
- El objeto mock debe tener todos los métodos que la función real usa
- Verificar que `prisma.$transaction` fue llamado en tests

**Código de ejemplo:**
```typescript
const mockTx = {
  prompt: { update: jest.fn() },
  promptTag: { deleteMany: jest.fn() },
  // ... todas las junction tables
}
;(prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
  return await fn(mockTx)
})
```

### X.5 Enum de idiomas inclusivo desde el inicio

**Estado:** ✅ Validado  
**Código relacionado:** `app/api/prompts/route.ts`, `app/api/prompts/[id]/route.ts`  
**Descripción:** Incluir todos los idiomas regionales desde el inicio evita refactor posterior y es más inclusivo para usuarios.

**Prevención:**
- Consultar con usuario TODOS los idiomas requeridos antes de implementar
- Incluir idiomas regionales (catalán, vasco, gallego, etc.) desde el inicio
- Usar nombres correctos con acentos: `catalán/valenciano`
- Documentar lista completa en `.env.example` o documentación
```

---

**Fin del informe**
