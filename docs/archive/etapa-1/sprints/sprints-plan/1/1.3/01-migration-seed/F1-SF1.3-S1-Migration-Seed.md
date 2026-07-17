# F1-SF1.3-S1 — Migraciones + Seed Data

**Fase**: 1 — Database Foundation  
**Subfase**: 1.3 — Migraciones + seed data  
**Sprint**: 1 de 1  
**Nombre completo**: Data Migration + Seed Data  
**Ruta de salida**: `doc-plan/doc-implementar/sprints-plan/1/1.3/01-migration-seed/F1-SF1.3-S1-Migration-Seed.md`  
**Fecha de generación**: 2026-04-24  

---

## 1. Identificación

| Campo | Valor |
|-------|-------|
| **Fase** | 1 — Database Foundation |
| **Subfase** | 1.3 — Migraciones + seed data |
| **Sprint** | 1 |
| **Nombre completo** | F1-SF1.3-S1 — Data Migration + Seed Data |
| **Objetivo del Sprint** | Crear seed data para las 4 entidades nuevas (Platform, ClientProject, UseCase, ModelHint), crear y ejecutar script de migración de datos que transforme los campos string existentes (`platform`, `useCase`, `clientOrProject`, `modelHint`) en relaciones N:M, aplicar la migración en DB de desarrollo y verificar en Prisma Studio que los datos migraron correctamente. |

---

## 2. Base documental aplicada

✅ **Regla del Modelo 3**: Solo referencias, nunca transcripción.

### Documentos principales aplicados

| Documento | Secciones aplicadas | Relación con este Sprint |
|-----------|---------------------|--------------------------|
| `doc-plan/doc-base/04-Phases-Subphases-Plan.md` | SF-1.3 row (Fase 1 table) | Define alcance: migración aplicada sin pérdida de datos + seed data válido |
| `doc-plan/doc-base/04-Phases-Subphases-Plan-Definicion.md` | §4.3 (Sprint), §8.8 (Continuidad) | Marco conceptual de qué es un Sprint y cómo se relaciona con SF |
| `doc-plan/doc-base/01-Briefing.md` | §3 (Alcance), §5 (Impactos) | Contexto del cambio: evolución de modelo de datos |
| `doc-plan/doc-base/02-Improvement-Spec.md` | RF-06 a RF-22 (multivalor) | Justificación funcional de las relaciones N:M |
| `doc-plan/doc-base/03-Tech-Intervention-Plan.md` | §4.4 (Intervención estructural), §9 (Riesgos) | Base técnica: 5 entidades + 5 junction tables, riesgo de pérdida de datos |

### Documentos parciales aplicados

| Documento | Secciones aplicadas | Relación con este Sprint |
|-----------|---------------------|--------------------------|
| `conocimiento-tec/02-cambios-tecnicos-necesarios.md` | §4 (Tabla Maestra), §6 (Intervención Estructural) | Detalle de campos string que deben migrar a relaciones |
| `conocimiento-tec/07-riesgos-y-decisiones-abiertas.md` | §3 (Riesgos técnicos: pérdida de datos en migración), §7 (Decisiones D-01, D-02, D-07) | Riesgos de migración de datos; decisiones resueltas que condicionan el approach |

### Informes previos usados

| Informe | Sprint | Hallazgos relevantes para este Sprint |
|---------|--------|---------------------------------------|
| `F1-SF1.1-S1-informe.md` | Core Entities | 4 modelos + 4 junction tables definidos en schema; tipos generados |
| `F1-SF1.1-S2-informe.md` | Junction Tables & Migration | PromptCategory añadida; migración `20260424120213_add_multi_value_relations` creada y aplicada; código actualizado para N:M; **pendiente**: migración de datos existentes + seed data para nuevas entidades |
| `F1-SF1.2-S1-informe.md` | Zod + API N:M | Zod schemas aceptan arrays de IDs; POST/PUT con $transaction; **pendiente**: migración de datos existentes → SF-1.3 |

### Gobernanza aplicada

| Documento | Reglas/patrones aplicados |
|-----------|---------------------------|
| `.gobernanza/.governance/reglas_proyecto.md` | R9 (Migraciones de esquema), R10 (Estrategia de pruebas), R11 (Calidad de código) |
| `.gobernanza/.governance/inventario_recursos.md` | §4.1 (PostgreSQL), §10.2 (Comandos Prisma), Nota 9 (PostgreSQL como configuración principal) |
| `.gobernanza/.governance/conocimiento_tecnico_preventivo.md` | §3.1 ($transaction para N:M), §4.1 (PostgreSQL en desarrollo) |
| `.gobernanza/.governance/integracion-prisma-typescript.md` | Patrones de tipos Prisma, generación de cliente |

---

## 3. Alcance del Sprint

### Qué debe conseguir este Sprint

1. **Seed data** para las 4 entidades nuevas (Platform, ClientProject, UseCase, ModelHint) con valores representativos
2. **Script de migración de datos** que transforme los campos string existentes en `Prompt` (`platform`, `useCase`, `clientOrProject`, `modelHint`) en registros de las entidades nuevas + entradas en las junction tables correspondientes
3. **Migración aplicada** en DB de desarrollo sin pérdida de datos
4. **Verificación en Prisma Studio** de que los datos migraron correctamente
5. **Seed data actualizado** para que los prompts de ejemplo usen relaciones N:M en lugar de campos string

### Qué NO entra en este Sprint

- Eliminar los campos string legacy del schema (`platform`, `useCase`, `clientOrProject`, `modelHint`) → SF-2.1 o posterior
- Actualizar Zod schemas para eliminar compatibilidad dual → Ya hecho en SF-1.2-S1
- Modificar componentes UI para multi-selección → SF-2.1
- Cambios en API routes para aceptar solo arrays → Ya hecho en SF-1.2-S1
- Migración de producción → SF-5.2

---

## 4. Elementos afectados

### Archivos concretos

| Archivo | Tipo de cambio | Qué se cambia |
|---------|---------------|---------------|
| `prisma/seed.ts` | Modificación | Añadir seed data para Platform, ClientProject, UseCase, ModelHint; actualizar prompts de ejemplo para usar relaciones N:M |
| `prisma/migrations/20260424120213_add_multi_value_relations/migration.sql` | Verificación | Confirmar que la migración existente crea todas las tablas necesarias (ya creada en SF-1.1-S2) |
| `prisma/schema.prisma` | Verificación | Confirmar que los 4 modelos + 4 junction tables están definidos (ya hecho en SF-1.1-S1/S2) |

### Scripts nuevos

| Archivo | Propósito |
|---------|-----------|
| `prisma/migrate-data.ts` (nuevo) | Script de migración de datos: lee campos string existentes, crea entidades si no existen, crea entradas en junction tables |

### Módulos y capas

| Capa | Elemento | Impacto |
|------|----------|---------|
| **Datos** | `Platform`, `ClientProject`, `UseCase`, `ModelHint` | Poblados con seed data |
| **Datos** | `PromptPlatform`, `PromptClientProject`, `PromptUseCase`, `PromptModelHint` | Poblados con datos migrados de campos string |
| **Datos** | `Prompt` | Campos string legacy conservados (compatibilidad dual); nuevas relaciones pobladas |

### Configuración

| Elemento | Cambio |
|----------|--------|
| `package.json` | Añadir script `"db:migrate-data": "tsx prisma/migrate-data.ts"` (si `tsx` no está disponible, usar `npx ts-node`) |

---

## 5. Plan de acción

### Acción 1: Verificar estado actual del schema y migración

**Qué**: Confirmar que `schema.prisma` tiene los 4 modelos nuevos + 4 junction tables y que la migración `20260424120213_add_multi_value_relations` existe y es correcta.

**Cómo**:
1. Leer `prisma/schema.prisma` y verificar modelos: Platform, ClientProject, UseCase, ModelHint, PromptPlatform, PromptClientProject, PromptUseCase, PromptModelHint
2. Leer `prisma/migrations/20260424120213_add_multi_value_relations/migration.sql` y verificar que crea todas las tablas
3. Ejecutar `npx prisma validate` para confirmar que el schema es válido
4. Ejecutar `npx prisma generate` para regenerar tipos TypeScript

**Por qué**: Asegurar que la base estructural está completa antes de añadir datos.

**Criterio de éxito**: `prisma validate` y `prisma generate` sin errores.

---

### Acción 2: Crear seed data para las 4 entidades nuevas

**Qué**: Añadir en `prisma/seed.ts` la creación de datos iniciales para Platform, ClientProject, UseCase, ModelHint usando `upsert` para idempotencia.

**Cómo**:
1. Añadir seed para **Platform** con valores representativos basados en los valores existentes del campo `platform` en prompts actuales:
   - `CHATGPT`, `CURSOR`, `MIDJOURNEY`, `SUNO`, `OTHER` (mismos valores del enum Zod legacy)
   - Cada uno con `name`, `slug` (lowercase), `sortOrder`
2. Añadir seed para **UseCase** con valores basados en datos existentes:
   - Extraer valores únicos del campo `useCase` de prompts existentes
   - Crear cada uno con `name`, `slug`, `sortOrder`
3. Añadir seed para **ClientProject** (valores de ejemplo, ya que los datos existentes pueden variar):
   - Crear 2-3 valores de ejemplo con `name`, `slug`, `sortOrder`
4. Añadir seed para **ModelHint** con valores basados en datos existentes:
   - Extraer valores únicos del campo `modelHint` de prompts existentes
   - Crear cada uno con `name`, `slug`, `sortOrder`
5. Actualizar los prompts de ejemplo en seed.ts para usar relaciones N:M (`platforms: { create: { platformId: ... } }`) en lugar de campos string

**Por qué**: Las junction tables requieren IDs de entidades existentes. Sin seed data, la migración de datos no tiene entidades a las que referenciar.

**Criterio de éxito**: `npx prisma db seed` ejecuta sin errores; las 4 entidades nuevas tienen datos; los prompts de ejemplo tienen relaciones N:M.

---

### Acción 3: Crear script de migración de datos

**Qué**: Crear `prisma/migrate-data.ts` que transforme los campos string existentes en relaciones N:M.

**Cómo**:
1. Leer todos los prompts que tienen valores no nulos en `platform`, `useCase`, `clientOrProject`, `modelHint`
2. Para cada campo string único encontrado:
   - Buscar o crear la entidad correspondiente (Platform, UseCase, ClientProject, ModelHint) usando `upsert` por `name`
   - Normalizar: `trim()` + `toUpperCase()` para Platform (coincidir con enum legacy), `trim()` para los demás
3. Para cada prompt procesado:
   - Crear entrada en la junction table correspondiente (`PromptPlatform`, `PromptUseCase`, etc.) vinculando el prompt con la entidad
   - Usar `upsert` o verificar existencia previa para evitar duplicados
4. Envolver todo en una transacción Prisma para atomicidad
5. Loggear el progreso: cuántos prompts procesados, cuántas entidades creadas, cuántas relaciones creadas

**Lógica de migración por campo**:

| Campo string | Entidad destino | Junction table | Normalización |
|-------------|-----------------|----------------|---------------|
| `platform` | `Platform` | `PromptPlatform` | `trim()` + `toUpperCase()` |
| `useCase` | `UseCase` | `PromptUseCase` | `trim()` |
| `clientOrProject` | `ClientProject` | `PromptClientProject` | `trim()` |
| `modelHint` | `ModelHint` | `PromptModelHint` | `trim()` |

**Consideraciones**:
- Los campos string legacy **NO se eliminan** en este Sprint (compatibilidad dual)
- Si un prompt tiene `platform: "CURSOR"`, se crea/usa Platform "CURSOR" y se crea PromptPlatform
- Si un campo string está vacío o null, no se crea relación
- Usar `$transaction` para garantizar atomicidad (D-07)

**Criterio de éxito**: Script ejecuta sin errores; todos los prompts con valores string tienen relaciones N:M correspondientes; log muestra conteo de entidades y relaciones creadas.

---

### Acción 4: Ejecutar migración de datos en DB de desarrollo

**Qué**: Ejecutar el script de migración contra la DB de desarrollo.

**Cómo**:
1. Asegurar que PostgreSQL está corriendo (`docker-compose -f docker-compose.dev.yml up -d postgres`)
2. Ejecutar `npx prisma migrate deploy` para aplicar la migración de schema (si no está ya aplicada)
3. Ejecutar `npx prisma db seed` para poblar entidades nuevas
4. Ejecutar `npx tsx prisma/migrate-data.ts` (o el comando configurado) para migrar datos existentes
5. Verificar resultados con queries de comprobación

**Criterio de éxito**: Script completa sin errores; log confirma migración exitosa.

---

### Acción 5: Verificar migración en Prisma Studio

**Qué**: Abrir Prisma Studio y verificar visualmente que los datos migraron correctamente.

**Cómo**:
1. Ejecutar `npx prisma studio`
2. Verificar en tabla **Platform**: existen registros para CHATGPT, CURSOR, MIDJOURNEY, SUNO, OTHER
3. Verificar en tabla **UseCase**: existen registros con los valores de prompts existentes
4. Verificar en tabla **ClientProject**: existen registros de seed data
5. Verificar en tabla **ModelHint**: existen registros con los valores de prompts existentes
6. Verificar en tabla **PromptPlatform**: cada prompt con `platform` string tiene entrada correspondiente
7. Verificar en tabla **PromptUseCase**: cada prompt con `useCase` string tiene entrada correspondiente
8. Verificar en tabla **PromptClientProject**: cada prompt con `clientOrProject` string tiene entrada correspondiente
9. Verificar en tabla **PromptModelHint**: cada prompt con `modelHint` string tiene entrada correspondiente
10. Verificar que los campos string legacy (`platform`, `useCase`, `clientOrProject`, `modelHint`) **siguen existiendo** en Prompt (compatibilidad dual)

**Criterio de éxito**: Todas las verificaciones visuales confirman datos correctos; no hay prompts con valores string que carezcan de relación N:M correspondiente.

---

### Acción 6: Ejecutar validación completa

**Qué**: Ejecutar todas las pruebas del proyecto para confirmar que la migración no rompió nada.

**Cómo**:
1. `npx prisma validate` — schema válido
2. `npx prisma generate` — tipos TypeScript generados
3. `npm run build` — compilación sin errores
4. `npm run lint` — sin errores ESLint
5. `npm test` — todos los tests pasan (40 tests, 8 suites)

**Criterio de éxito**: Todos los comandos ejecutan sin errores.

---

### Acción 7: Actualizar seed.ts para usar relaciones N:M en prompts de ejemplo

**Qué**: Modificar los prompts creados en `seed.ts` para que usen las relaciones N:M (`platforms`, `useCases`, etc.) en lugar de los campos string legacy.

**Cómo**:
1. En cada `prisma.prompt.upsert` del seed, añadir nested writes para las junction tables:
   ```typescript
   platforms: { create: { platformId: platformCursor.id } },
   useCases: { create: { useCaseId: useCaseCodeReview.id } },
   ```
2. Mantener los campos string legacy por compatibilidad dual (no eliminarlos aún)

**Criterio de éxito**: `npx prisma db seed` ejecuta sin errores; prompts de ejemplo tienen tanto campos string como relaciones N:M.

---

## 6. Validación y pruebas

### Qué debe validarse

| Elemento | Qué validar | Cómo |
|----------|------------|------|
| **Schema** | Válidez del schema Prisma | `npx prisma validate` |
| **Tipos** | Tipos TypeScript generados para nuevos modelos | `npx prisma generate` + verificar imports |
| **Migración** | Tablas creadas en DB | `npx prisma migrate status` |
| **Seed data** | Entidades nuevas pobladas | `npx prisma db seed` + verificar en Prisma Studio |
| **Migración de datos** | Campos string transformados a relaciones | Ejecutar `migrate-data.ts` + verificar conteos |
| **Integridad** | No hay prompts con valores string sin relación N:M | Query: prompts con platform != null pero sin PromptPlatform |
| **No regresión** | Tests existentes pasan | `npm test` |
| **Compilación** | Proyecto compila sin errores | `npm run build` |
| **Linting** | Sin errores ESLint | `npm run lint` |

### Mecanismos existentes del repositorio

| Mecanismo | Ubicación | Uso en este Sprint |
|-----------|-----------|-------------------|
| `npx prisma validate` | Prisma CLI | Validar schema |
| `npx prisma generate` | Prisma CLI | Generar tipos |
| `npx prisma migrate status` | Prisma CLI | Verificar estado de migraciones |
| `npx prisma db seed` | Prisma CLI (configurado en package.json) | Poblar DB con seed data |
| `npx prisma studio` | Prisma CLI | Verificación visual de datos |
| `npm test` | Jest | Tests existentes (40 tests) |
| `npm run build` | Next.js | Compilación |
| `npm run lint` | ESLint | Linting |

### Queries de comprobación post-migración

```typescript
// Verificar que todos los prompts con platform string tienen relación
const promptsWithoutPlatformRelation = await prisma.prompt.findMany({
  where: {
    platform: { not: null },
    platforms: { none: {} }
  }
})
// Debe retornar []

// Verificar conteo de relaciones creadas
const platformRelations = await prisma.promptPlatform.count()
const useCaseRelations = await prisma.promptUseCase.count()
const clientProjectRelations = await prisma.promptClientProject.count()
const modelHintRelations = await prisma.promptModelHint.count()
// Deben ser > 0 si hay prompts con valores string
```

---

## 7. Seguridad y no regresión

### Qué debe preservarse

| Control | Por qué preservar | Cómo |
|---------|-------------------|------|
| **Campos string legacy** | Compatibilidad dual con código que aún los lee (SF-1.2-S1 mantiene ambos formatos) | NO eliminar campos del schema en este Sprint |
| **Datos existentes** | Los prompts existentes son datos de producción potenciales | Migración debe ser idempotente y reversible |
| **Índices existentes** | Rendimiento de queries | La migración no modifica índices |
| **Foreign keys** | Integridad referencial | La migración usa IDs de entidades existentes |

### Qué debe revisarse

| Elemento | Qué revisar |
|----------|------------|
| **Atomicidad de migración** | El script usa `$transaction` para que si falla, no queden datos a medio migrar |
| **Idempotencia** | El script puede ejecutarse múltiples veces sin crear duplicados (usar `upsert` o verificar existencia) |
| **Seed data** | Los valores de seed no colisionan con datos migrados (usar `upsert` por `name`/`slug`) |

### Riesgos de regresión

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Duplicados en entidades** | MEDIA | MEDIO | Usar `upsert` por `name` único |
| **Relaciones huérfanas** | BAJA | ALTO | Verificar que cada relación apunta a entidad existente |
| **Pérdida de datos string** | BAJA | ALTO | NO eliminar campos string; solo añadir relaciones |
| **Seed data colisiona con datos migrados** | MEDIA | BAJO | Usar `upsert`; seed se ejecuta antes de migración de datos |

---

## 8. Criterios de finalización

Este Sprint se considera completado cuando **TODOS** los siguientes criterios se cumplen:

### Lista de comprobación

- [ ] `npx prisma validate` ejecuta sin errores
- [ ] `npx prisma generate` ejecuta sin errores
- [ ] `npx prisma db seed` ejecuta sin errores
- [ ] Las 4 entidades nuevas (Platform, ClientProject, UseCase, ModelHint) tienen datos en DB
- [ ] Script de migración de datos (`migrate-data.ts`) existe y ejecuta sin errores
- [ ] Todos los prompts con valores string tienen relaciones N:M correspondientes
- [ ] No hay duplicados en entidades (verificar con `upsert`)
- [ ] Campos string legacy siguen existiendo en el schema (compatibilidad dual)
- [ ] `npm test` — 40 tests, 8 suites, TODOS PASAN
- [ ] `npm run build` — compilación sin errores
- [ ] `npm run lint` — sin errores ESLint
- [ ] Verificación en Prisma Studio confirma datos correctos
- [ ] Informe de Sprint generado (acción penúltima del flujo de gobernanza)

---

## 9. Riesgos o advertencias

### Incidencias previsibles

| Incidencia | Probabilidad | Impacto | Cómo prevenir |
|------------|-------------|---------|---------------|
| **PostgreSQL no disponible** | MEDIA | ALTO | Verificar con `docker-compose ps` antes de ejecutar; levantar con `docker-compose -f docker-compose.dev.yml up -d postgres` |
| **Valores string con formato inconsistente** | MEDIA | MEDIO | Normalizar con `trim()` + `toUpperCase()` para Platform; `trim()` para los demás |
| **Colisión entre seed data y datos migrados** | MEDIA | BAJO | Ejecutar seed antes de migración de datos; usar `upsert` en ambos |
| **Migración parcial por error de transacción** | BAJA | ALTO | Envolver todo en `$transaction`; si falla, rollback automático |

### Dependencias sensibles

| Dependencia | Por qué es sensible | Cómo gestionar |
|-------------|---------------------|----------------|
| **SF-1.1-S1/S2 completadas** | Este Sprint asume que schema y migración de tablas ya existen | Verificar con `prisma validate` y `prisma migrate status` |
| **SF-1.2-S1 completada** | Este Sprint asume que Zod schemas aceptan arrays | Verificar que `platformIds`, `useCaseIds`, etc. existen en schemas |
| **PostgreSQL corriendo** | Sin DB, ninguna operación de migración funciona | Comprobar antes de empezar; documentar comando de arranque |

### Limitaciones y alertas

1. **Los campos string legacy NO se eliminan en este Sprint**. La compatibilidad dual es necesaria para que el código actual (que aún lee campos string) siga funcionando hasta SF-2.1.
2. **La migración de datos es irreversible** una vez ejecutada (las relaciones se crean pero los campos string se conservan). Si se necesita rollback, se deben eliminar las relaciones manualmente.
3. **El script de migración debe ejecutarse DESPUÉS del seed data**, porque el seed crea las entidades a las que las relaciones apuntan.
4. **Prisma Studio requiere PostgreSQL corriendo**. Si se usa Docker, asegurar que el contenedor está activo.

---

**Fin del plan de acción**
