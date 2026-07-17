# F1-SF1.1-S1-Core-Entities — Informe de Sprint

**Fase**: 1 — Database Foundation  
**Subfase**: 1.1 — Schema: nuevas entidades y junction tables  
**Sprint**: 1 de 2  
**Nombre completo**: Core Entities Schema  
**Ruta del plan de acción original**: `doc-plan/doc-implementar/sprints-plan/1/1.1/01-core-entities/F1-SF1.1-S1-Core-Entities.md`  
**Fecha de ejecución**: 2026-04-24  
**Fecha de finalización**: 2026-04-24  

---

## 1. Objetivo original del Sprint

Definir los 4 modelos de entidad base (Platform, ClientProject, UseCase, ModelHint) en `schema.prisma` con campos, índices y relaciones bidireccionales. Validar generación de tipos TypeScript.

---

## 2. Alcance realmente ejecutado

### ✅ Qué se consiguió finalmente

1. **4 modelos nuevos añadidos a `schema.prisma`**:
   - `Platform` — con campos id, name (@unique), slug (@unique), sortOrder, createdAt, updatedAt
   - `ClientProject` — con campos id, name (@unique), slug (@unique), sortOrder, createdAt, updatedAt
   - `UseCase` — con campos id, name (@unique), slug (@unique), sortOrder, createdAt, updatedAt
   - `ModelHint` — con campos id, name (@unique), slug (@unique), sortOrder, createdAt, updatedAt

2. **4 junction tables creadas** (originalmente planificadas para Sprint 2):
   - `PromptPlatform` — relación N:M entre Prompt y Platform
   - `PromptClientProject` — relación N:M entre Prompt y ClientProject
   - `PromptUseCase` — relación N:M entre Prompt y UseCase
   - `PromptModelHint` — relación N:M entre Prompt y ModelHint

3. **Relaciones bidireccionales en modelo Prompt**:
   - `platforms PromptPlatform[]`
   - `clientProjects PromptClientProject[]`
   - `useCases PromptUseCase[]`
   - `modelHints PromptModelHint[]`

4. **Validaciones ejecutadas exitosamente**:
   - `npx prisma validate` — ✅ Sin errores
   - `npx prisma generate` — ✅ Tipos TypeScript generados
   - `npm run build` — ✅ Compilación sin errores
   - `npm run lint` — ✅ Sin errores ESLint

### ✅ Qué parte del objetivo original se cumplió

**100% del objetivo cumplido.** Todos los modelos, relaciones y validaciones se completaron según lo planificado.

### ⚠️ Desviaciones respecto al plan original

**Desviación significativa**: Las junction tables (PromptPlatform, PromptClientProject, PromptUseCase, PromptModelHint) estaban planificadas para el **Sprint 2**, pero fueron creadas en este **Sprint 1**.

**Razón**: Las relaciones bidireccionales en el modelo Prompt referencian explícitamente a las junction tables (`PromptPlatform[]`, etc.). Sin estas definiciones, `prisma generate` habría fallado con errores de tipo no encontrado.

**Impacto**: Esta desviación es **positiva** — adelanta trabajo del Sprint 2 sin añadir complejidad adicional al Sprint 1. El Sprint 2 podrá centrarse exclusivamente en migraciones y seed data.

### ❌ Qué parte quedó pendiente

- **Migraciones de base de datos**: Originalmente planificadas para Sprint 2. No se ejecutaron en este Sprint porque el objetivo era solo la definición del schema y generación de tipos.
- **Seed data**: Originalmente planificado para Sprint 2. Pendiente.

---

## 3. Cambios reales realizados

### Archivos modificados

| Archivo | Líneas afectadas | Tipo de cambio |
|---------|------------------|----------------|
| `prisma/schema.prisma` | 137-227 (adición) | 4 modelos nuevos + 4 junction tables + 4 relaciones en Prompt |

### Archivos nuevos creados

Ninguno. Todos los cambios se realizaron en `schema.prisma` existente.

### Archivos eliminados

Ninguno.

### Cambios en `prisma/schema.prisma` (detalle)

**Modelos añadidos (líneas 137-183)**:
```prisma
model Platform { ... }
model ClientProject { ... }
model UseCase { ... }
model ModelHint { ... }
```

**Junction tables añadidas (líneas 185-227)**:
```prisma
model PromptPlatform { ... }
model PromptClientProject { ... }
model PromptUseCase { ... }
model PromptModelHint { ... }
```

**Relaciones añadidas en Prompt (líneas 86-89)**:
```prisma
platforms       PromptPlatform[]
clientProjects  PromptClientProject[]
useCases        PromptUseCase[]
modelHints      PromptModelHint[]
```

---

## 4. Componentes, módulos y recursos afectados

| Componente/Módulo | Impacto | Estado |
|-------------------|---------|--------|
| `prisma/schema.prisma` | 4 modelos nuevos + 4 junction tables + 4 relaciones | ✅ Modificado |
| `node_modules/.prisma/client/` | Tipos TypeScript regenerados | ✅ Actualizado |
| `node_modules/@prisma/client` | Prisma Client v5.22.0 generado | ✅ Actualizado |
| Modelo `Prompt` | 4 nuevas relaciones de array | ✅ Modificado |
| Modelos existentes (User, Account, Session, etc.) | Sin cambios | ✅ Preservados |

---

## 5. Cambios de configuración

**No hubo cambios de configuración** en este Sprint.

- No se modificaron variables de entorno
- No se cambiaron archivos de configuración (package.json, tsconfig.json, next.config.js, etc.)
- No se alteró la configuración de Prisma (generator client, datasource db)
- Los binary targets se mantuvieron intactos

---

## 6. Pruebas ejecutadas y resultados

### Prueba 1: Validación de schema
- **Qué se probó**: Sintaxis y estructura del schema Prisma
- **Cómo se probó**: `npx prisma validate`
- **Resultado**: ✅ Sin errores
- **Comando**: `DATABASE_URL="postgresql://user:pass@localhost:5432/test_db" npx prisma validate`

### Prueba 2: Generación de tipos TypeScript
- **Qué se probó**: Prisma Client genera tipos para nuevos modelos
- **Cómo se probó**: `npx prisma generate`
- **Resultado**: ✅ Tipos generados para Platform, ClientProject, UseCase, ModelHint
- **Verificación**: `grep -E "export (type|interface) (Platform|ClientProject|UseCase|ModelHint)" node_modules/.prisma/client/index.d.ts`

### Prueba 3: Compilación del proyecto
- **Qué se probó**: El proyecto compila sin errores de tipo con los nuevos tipos de Prisma
- **Cómo se probó**: `npm run build`
- **Resultado**: ✅ Build exitoso
- **Nota**: Error esperado durante generación estática (base de datos no disponible) no afecta compilación

### Prueba 4: Linting
- **Qué se probó**: Código sin errores ESLint
- **Cómo se probó**: `npm run lint`
- **Resultado**: ✅ Sin errores ni warnings

### Cobertura
- No se ejecutaron tests unitarios (no aplica para cambios de schema)
- Tests de integración de base de datos pendientes para Sprint 2

---

## 7. Incidencias detectadas

### Incidencia 1: DATABASE_URL no encontrada durante validación
- **Qué ocurrió**: `npx prisma validate` falló con error P1012: "Environment variable not found: DATABASE_URL"
- **Cuándo se detectó**: Durante ejecución de `prisma validate`
- **Impacto**: Alto — bloquea validación y generación de tipos
- **Cómo se resolvió**: Pasar DATABASE_URL temporal como variable de entorno en el comando:
  ```bash
  DATABASE_URL="postgresql://user:pass@localhost:5432/test_db" npx prisma validate
  ```
- **Lección**: El proyecto está configurado para PostgreSQL pero `.env.development` usa SQLite. Se requiere documentación clara sobre configuración de entorno.

### Incidencia 2: Error de conexión a base de datos durante build
- **Qué ocurrió**: Durante `npm run build`, generación estática de páginas falló: "Can't reach database server at localhost:5432"
- **Cuándo se detectó**: Durante fase de generación estática del build
- **Impacto**: Bajo — el build completó exitosamente a pesar del error
- **Cómo se resolvió**: No requirió resolución. Error esperado porque las rutas API se ejecutan durante SSG pero no hay BD real en entorno de build.
- **Nota**: Las páginas se generaron correctamente (17/17). El error no bloqueó el build.

---

## 8. Correcciones y ajustes aplicados

### Ajuste 1: Creación anticipada de junction tables
- **Qué estaba planificado**: Crear junction tables en Sprint 2
- **Qué se hizo**: Crear junction tables en Sprint 1
- **Por qué**: Las relaciones bidireccionales en el modelo Prompt (`platforms PromptPlatform[]`, etc.) requieren que las junction tables estén definidas. Prisma no permite referencias a tipos no definidos.
- **Impacto**: Positivo — Sprint 2 tendrá menos trabajo y podrá centrarse en migraciones

### Ajuste 2: Uso de DATABASE_URL temporal
- **Qué estaba planificado**: Usar configuración de entorno existente
- **Qué se hizo**: Pasar DATABASE_URL como variable inline en comandos
- **Por qué**: `.env.development` usa SQLite (`file:./dev.db`) pero el schema está configurado para PostgreSQL
- **Impacto**: Neutro — solución temporal válida para validación y generación de tipos

---

## 9. Despliegue

**No hubo despliegue en este Sprint.**

Este Sprint fue exclusivamente de definición de schema y validación local. El despliegue está planificado para:
- **Sprint 2**: Migraciones y seed data
- **Fase 5 (SF-5.2)**: Validación integral + smoke test de producción

---

## 10. Validación por parte del usuario

**No hubo validación del usuario en este Sprint.**

Este Sprint fue técnico (schema + tipos) sin impacto visible para el usuario. La validación del usuario está planificada para:
- **Sprint 2**: Verificar migraciones en DB de desarrollo
- **Fase 2 (SF-2.1)**: Probar formulario con campos multivalor

---

## 11. Conocimiento técnico reutilizable

### Error 1: Relaciones bidireccionales requieren definición previa de junction tables

**Estado**: ✅ Validado  
**Código relacionado**: `prisma/schema.prisma`  
**Descripción**: En Prisma, cuando un modelo A tiene una relación de array hacia una junction table B (`prompts PromptPlatform[]`), la junction table B debe estar definida **antes** o **después** del modelo A, pero debe existir en el schema. No se puede referenciar un tipo no definido.

**Prevención**:
- Siempre definir junction tables antes o inmediatamente después de los modelos principales que las referencian
- No separar definición de junction tables en sprints diferentes si las relaciones ya existen
- Validar con `prisma validate` después de cada cambio de relación

### Error 2: DATABASE_URL requerida para operaciones de Prisma CLI

**Estado**: ✅ Validado  
**Código relacionado**: `prisma/schema.prisma:8`  
**Descripción**: Prisma CLI requiere `DATABASE_URL` incluso para operaciones que no conectan a la BD (validate, generate). El schema usa `env("DATABASE_URL")` y Prisma valida la presencia de la variable.

**Prevención**:
- Asegurar que DATABASE_URL esté disponible en todos los entornos (desarrollo, CI/CD, staging)
- Usar `.env.development` con valor válido para PostgreSQL (no SQLite si el schema es PostgreSQL)
- Documentar discrepancia entre schema (PostgreSQL) y `.env.development` (SQLite)

### Patrón 1: Binary targets para despliegue en Vercel

**Estado**: ✅ Validado  
**Código relacionado**: `prisma/schema.prisma:3`  
**Descripción**: Los binary targets están configurados correctamente para múltiples plataformas:
```prisma
binaryTargets = ["native", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-3.0.x", "debian-openssl-3.0.x"]
```

**Aplicación**:
- Mantener esta configuración para asegurar compatibilidad con Vercel (linux-musl) y otros entornos
- No modificar a menos que cambie la plataforma de despliegue

### Patrón 2: Estructura de junction tables N:M

**Estado**: ✅ Validado  
**Código relacionado**: `prisma/schema.prisma:185-227`  
**Descripción**: Las junction tables siguen patrón consistente:
- ID compuesto o generado (se usó `@id @default(cuid())` para flexibilidad)
- Dos campos de ID con relaciones Cascade onDelete
- Índice único compuesto `@@unique([campo1, campo2])`
- Índices individuales en ambos campos

**Aplicación**:
- Reutilizar este patrón para futuras relaciones N:M
- Considerar ID compuesto (`@@id([promptId, platformId])`) vs ID generado según necesidad de queries

---

## 12. Comprobaciones y preguntas pendientes para el usuario

### Para el usuario revisar:

1. **Schema de base de datos**:
   - ✅ Verificar que los 4 modelos nuevos (Platform, ClientProject, UseCase, ModelHint) tienen la estructura correcta
   - ✅ Confirmar que las junction tables son apropiadas para relaciones N:M
   - ✅ Validar que las relaciones bidireccionales en Prompt son correctas

2. **Preparación para Sprint 2**:
   - ⚠️ **IMPORTANTE**: Las junction tables se crearon en este Sprint. El Sprint 2 debe actualizar su plan para reflejar este cambio.
   - ⚠️ Confirmar que el usuario entiende que Sprint 2 ahora solo requiere migraciones + seed data (menos trabajo del esperado)

3. **Configuración de entorno**:
   - ⚠️ Discrepancia: `.env.development` usa SQLite pero schema es PostgreSQL. ¿Debe actualizarse `.env.development` para usar PostgreSQL local?

### Para el siguiente Sprint:

1. **Migraciones**:
   - Ejecutar `npx prisma migrate dev --name add_core_entities`
   - Aplicar migración en DB de desarrollo
   - Verificar que todas las tablas se crearon correctamente

2. **Seed data**:
   - Actualizar `prisma/seed.ts` para incluir datos de Platform, ClientProject, UseCase, ModelHint
   - Ejecutar `npx prisma db seed`
   - Verificar en Prisma Studio

3. **Documentación**:
   - Actualizar plan de Sprint 2 para reflejar que junction tables ya existen
   - Actualizar `inventario_recursos.md` con nuevos modelos

---

## 13. Estado de salida para el siguiente Sprint

### ✅ Qué queda listo y cerrado

- **Schema completo**: 4 modelos nuevos + 4 junction tables + relaciones bidireccionales
- **Tipos TypeScript generados**: Platform, ClientProject, UseCase, ModelHint disponibles en `@prisma/client`
- **Validación completada**: Schema válido, build exitoso, lint sin errores
- **Modelos existentes preservados**: User, Account, Session, VerificationToken, Prompt, Category, Tag, PromptTag sin cambios estructurales

### ⚠️ Qué queda pendiente para siguientes Sprints de esta Subfase

**Sprint 2 — Migraciones + Seed Data**:
- Crear migración de base de datos para nuevas tablas
- Aplicar migración en entorno de desarrollo
- Actualizar seed data con valores iniciales para Platform, ClientProject, UseCase, ModelHint
- Verificar migración en Prisma Studio
- Actualizar inventario de recursos

### 🔗 Qué debe tener en cuenta obligatoriamente el siguiente Sprint

1. **Junction tables ya existen**: No es necesario crearlas. El plan de Sprint 2 debe ajustarse.
2. **Relaciones ya definidas**: El modelo Prompt ya tiene las 4 relaciones de array.
3. **Tipos ya generados**: El código TypeScript puede importar y usar los nuevos tipos.
4. **DATABASE_URL requerida**: Asegurar que PostgreSQL esté disponible para migraciones.

### ⚠️ Dependencias, acoplamientos o problemas que arrastramos

1. **Discrepancia SQLite/PostgreSQL**: `.env.development` usa SQLite pero schema es PostgreSQL. Esto puede causar confusión en desarrollo.
2. **Migración de datos existentes**: Los prompts existentes tienen campos `platform`, `useCase`, `clientOrProject`, `modelHint` como strings. La migración deberá transformar estos valores a relaciones.
3. **Unicidad de name/slug**: Los modelos nuevos tienen `@unique` en name y slug. El seed data debe asegurar unicidad.

---

## 14. Nuevo conocimiento generado para incorporación

### Para `conocimiento_tecnico_preventivo.md`:

```markdown
### 2.4 Junction Tables en Prisma requieren definición explícita
**Estado**: ✅ Validado  
**Código relacionado**: `prisma/schema.prisma`  
**Descripción**: Cuando se implementan relaciones N:M con junction tables en Prisma, las junction tables deben definirse explícitamente en el schema antes de que las relaciones bidireccionales puedan referenciarlas. No es posible separar la definición de junction tables en sprints diferentes si las relaciones ya existen en los modelos principales.

**Prevención**:
- Planificar creación de modelos principales + junction tables en el mismo Sprint
- No dividir definición de relaciones N:M en múltiples sprints
- Validar con `prisma validate` después de añadir cada relación

### 2.5 DATABASE_URL requerida para todas las operaciones de Prisma CLI
**Estado**: ✅ Validado  
**Código relacionado**: `prisma/schema.prisma:8`  
**Descripción**: Prisma CLI valida la presencia de `DATABASE_URL` incluso para operaciones que no requieren conexión a base de datos (validate, generate). El schema usa `env("DATABASE_URL")` y Prisma exige que la variable esté disponible.

**Prevención**:
- Configurar DATABASE_URL en todos los entornos (desarrollo, CI/CD, staging)
- Usar valores válidos aunque la BD no esté disponible
- Documentar requerimiento en guía de desarrollo local
```

### Para `inventario_recursos.md`:

```markdown
### 4.1 PostgreSQL — Modelos actualizados

**Modelos añadidos (2026-04-24, Sprint F1-SF1.1-S1)**:
| Modelo | Descripción | Campos Principales | Estado |
|--------|-------------|-------------------|--------|
| `Platform` | Plataformas destino para prompts (multivalor) | id, name, slug, sortOrder, timestamps | ✅ |
| `ClientProject` | Clientes y proyectos (multivalor) | id, name, slug, sortOrder, timestamps | ✅ |
| `UseCase` | Casos de uso para prompts (multivalor) | id, name, slug, sortOrder, timestamps | ✅ |
| `ModelHint` | Sugerencias de modelo (multivalor) | id, name, slug, sortOrder, timestamps | ✅ |

**Junction Tables añadidas (2026-04-24, Sprint F1-SF1.1-S1)**:
| Tabla | Relación | Descripción | Estado |
|-------|----------|-------------|--------|
| `PromptPlatform` | Prompt ↔ Platform | Relación N:M para plataformas | ✅ |
| `PromptClientProject` | Prompt ↔ ClientProject | Relación N:M para clientes/proyectos | ✅ |
| `PromptUseCase` | Prompt ↔ UseCase | Relación N:M para casos de uso | ✅ |
| `PromptModelHint` | Prompt ↔ ModelHint | Relación N:M para sugerencias de modelo | ✅ |

**Modelo Prompt actualizado**:
| Modificación | Estado |
|-------------|--------|
| Agregadas 4 relaciones de array (platforms, clientProjects, useCases, modelHints) | ✅ |
```

---

## 15. Historial de cambios del informe

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2026-04-24 | Creación inicial del informe de Sprint F1-SF1.1-S1 | Agente Orquestador |

---

**Fin del informe**
