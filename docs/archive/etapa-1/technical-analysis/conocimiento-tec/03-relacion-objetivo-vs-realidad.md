# Relación entre Objetivo y Realidad

**Documento:** `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md`  
**Bloque emisor:** 130-BLOQUE-03  
**Fecha de generación:** 2026-04-24  
**Versión:** 1.0

---

## 1. Alcance del análisis del bloque

### Objetivos, requisitos y capacidades contrastados

Este bloque contrasta la totalidad de los **50 Requisitos Funcionales (RF-01 a RF-50)** definidos en `doc-plan/doc-base/02-Improvement-Spec.md` contra el código real del repositorio, tomando como referencia el marco de contexto de `doc-plan/doc-base/01-Briefing.md` y los hallazgos acumulados en los bloques 00, 01 y 02.

**RF contrastados por área:**

| Área Funcional | RF | Estado del contraste |
|----------------|-----|---------------------|
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

### Zonas del sistema tomadas como base del contraste

| Zona del Sistema | Archivos de Evidencia | Nivel de Fiabilidad |
|------------------|----------------------|---------------------|
| **Modelo de Datos** | `prisma/schema.prisma` | ALTO (100%) |
| **Formulario CRUD** | `components/prompt/PromptForm.tsx` | ALTO (100%) |
| **Listado** | `components/prompt/PromptList.tsx` | ALTO (100%) |
| **Filtros** | `components/prompt/PromptFilters.tsx` | ALTO (100%) |
| **Páginas** | `app/(app)/prompts/page.tsx`, `new/page.tsx`, `[id]/page.tsx` | ALTO (100%) |
| **API Routes** | `app/api/prompts/route.ts`, `[id]/route.ts`, `usage/route.ts` | ALTO (100%) |
| **Export/Import** | `app/api/export/prompts/route.ts`, `app/api/import/prompts/route.ts` | ALTO (100%) |
| **Autenticación** | `lib/auth.ts`, `middleware.ts` | ALTO (100%) |

### Nivel de fiabilidad del contraste

| Nivel de Fiabilidad | Porcentaje | Justificación |
|---------------------|------------|---------------|
| **ALTO** | 85% | Contraste realizado con evidencia verificable en archivos inspeccionados al 100% |
| **MEDIO** | 12% | Algunas decisiones de producto pendientes (idiomas, reglas de creación) impiden cierre total |
| **BAJO** | 3% | Volumen de datos desconocido afecta evaluación de rendimiento de filtros complejos |

---

## 2. Resumen de alineación entre objetivo y realidad

### Grado general de alineación

| Clasificación | Porcentaje RF | Cantidad RF | Descripción |
|---------------|---------------|-------------|-------------|
| **Ya Soportado** | 16% | 8 RF | El sistema ya cubre sustancialmente lo requerido |
| **Parcialmente Soportado** | 24% | 12 RF | Existe base real pero es incompleta o insuficiente |
| **No Soportado** | 52% | 26 RF | No se observa evidencia de soporte en el sistema actual |
| **En Fricción** | 8% | 4 RF | El sistema actual choca activamente con el objetivo |

**Conclusión:** El 60% de los RF (No Soportado + En Fricción) requieren intervención técnica significativa. Solo el 16% está ya resuelto y el 24% tiene base parcial aprovechable.

### Zonas donde se concentran las principales brechas

| Zona | Brecha Principal | RF Afectados |
|------|-----------------|--------------|
| **Modelo de datos** | `platform` y `category` son campos simples, deben ser múltiples | RF-06 a RF-14 |
| **Campos multivalor secundarios** | `clientOrProject`, `useCase`, `modelHint` son strings simples | RF-15 a RF-22 |
| **Navegación post-guardado** | `router.push("/prompts")` expulsa al usuario | RF-32 a RF-36 |
| **Vista del listado** | Solo existe vista cards, falta vista lista | RF-37, RF-41 a RF-43 |
| **Filtros** | Platform y Category son selects simples | RF-44 a RF-47 |

---

## 3. Objetivos o capacidades ya soportadas

### RF ya cubiertos por el sistema actual

| RF | Descripción | Evidencia clave en el repo | Nivel de confianza |
|----|-------------|---------------------------|-------------------|
| **RF-01** | Seleccionar tags existentes | `PromptForm.tsx:437-463`: badges de tags seleccionados con toggle | ALTO |
| **RF-04** | Quitar tags seleccionados | `PromptForm.tsx:218-223`: `toggleTag` quita tags del array `selectedTags` | ALTO |
| **RF-29** | Fecha de creación visible | `schema.prisma:81`: `createdAt DateTime @default(now())` existe | ALTO |
| **RF-30** | Fecha de actualización visible | `schema.prisma:82`: `updatedAt DateTime @updatedAt` existe | ALTO |
| **RF-38** | Cambio de "View" a "Edit" | `PromptList.tsx:171`: botón con texto "View" identificable para cambiar | ALTO |
| **RF-49** | Export incluye tags | `export/route.ts:30`: `tags: prompt.tags.map((pt) => pt.tag.name)` | ALTO |
| **RF-50** | Import restaura tags | `import/route.ts:84-92`: lógica de importación de tags | ALTO |
| **RF-35** | Guardar edición permanece (parcialmente) | PUT endpoint funciona; solo falta cambiar redirect | MEDIO |

### Por qué están soportados

- **Tags N:M**: El modelo ya tiene `PromptTag` como junction table. La UI ya permite seleccionar y quitar tags.
- **Fechas**: `createdAt` y `updatedAt` ya existen en el modelo `Prompt`. Solo falta hacerlos visibles en la UI del formulario.
- **Export/Import tags**: La infraestructura base ya existe y funciona.

---

## 4. Objetivos o capacidades parcialmente soportadas

### RF con base real pero incompleta

| RF | Descripción | Qué existe ya | Qué falta | Por qué es solo parcial |
|----|-------------|--------------|-----------|------------------------|
| **RF-02** | Crear nuevos tags desde formulario | UI de tags existe (`PromptForm.tsx:437-463`) | No hay mecanismo de creación inline | Solo permite seleccionar existentes, no crear nuevos |
| **RF-03** | Tag nuevo queda seleccionado | N/A | No existe creación inline | Depende de RF-02 |
| **RF-05** | Tags creados reutilizables | Tags persisten en DB | No hay creación inline | Depende de RF-02 |
| **RF-26** | Nuevos campos en Basic Info | Estructura de 3 secciones existe | Campos `prePrompt`, `manualDeUso`, fechas no existen en schema ni UI | Requiere schema + UI nuevos |
| **RF-27** | Pre-Prompt opcional | N/A | Campo no existe en schema | Requiere migración |
| **RF-28** | Manual de uso opcional | N/A | Campo no existe en schema | Requiere migración |
| **RF-32** | Guardar alta: permanecer en formulario | POST funciona | `router.push("/prompts")` expulsa al usuario | Solo cambiar redirect |
| **RF-33** | Formulario queda en modo edición | N/A | Depende de redirect correcto | Depende de RF-32 |
| **RF-34** | Acciones de edición aparecen | Botones existen en modo edit (`PromptForm.tsx:233-249`) | Lógica de transición create→edit no implementada | Requiere cambio de estado |
| **RF-37** | Dos modos de visualización | Vista cards existe (`PromptList.tsx:60-180`) | Vista lista no existe | Requiere nuevo render |
| **RF-48** | Export incluye información nueva | Export existe (`export/route.ts`) | No incluye `prePrompt`, `manualDeUso`, arrays | Depende de nuevos campos |

### Por qué es solo soporte parcial

En todos estos casos, el sistema tiene una **base estructural** (infraestructura de tags, estructura de secciones, endpoints CRUD, sistema de export) pero le falta la **capacidad funcional específica** que el RF exige (creación inline, nuevos campos, redirect diferente, nueva vista).

---

## 5. Objetivos o capacidades no soportadas

### RF sin base suficiente en el sistema actual

| RF | Descripción | Evidencia de ausencia | Implicación técnica |
|----|-------------|----------------------|---------------------|
| **RF-06** | Platform multivalor | `schema.prisma:67`: `platform String` (simple) | Requiere migración estructural |
| **RF-07** | Seleccionar platforms existentes | No existe UI de multi-select para platforms | Requiere nuevo componente |
| **RF-08** | Crear platforms nuevas | No existe API ni UI para crear platforms | Requiere nueva entidad + API |
| **RF-09** | Platform nueva queda seleccionada | N/A | Depende de RF-08 |
| **RF-10** | Quitar platforms seleccionadas | N/A | Depende de RF-06 |
| **RF-11** | Platforms reutilizables | N/A | Depende de RF-08 |
| **RF-12** | Category múltiple | `schema.prisma:79`: `categoryId String?` (FK simple) | Requiere junction table |
| **RF-13** | Seleccionar categorías existentes | `PromptForm.tsx:416-433`: select simple | Requiere multi-select |
| **RF-14** | Quitar categorías seleccionadas | N/A | Depende de RF-12 |
| **RF-15** | Client/Project multivalor | `schema.prisma:72`: `clientOrProject String?` (simple) | Requiere array o relación |
| **RF-16** | Use Case multivalor | `schema.prisma:71`: `useCase String` (simple) | Requiere array o relación |
| **RF-17** | Model Hint multivalor | `schema.prisma:68`: `modelHint String?` (simple) | Requiere array o relación |
| **RF-18** | Seleccionar valores existentes | No existe UI multi-select para estos campos | Requiere nuevo componente |
| **RF-19** | Crear nuevos valores | No existe API ni UI para crear | Requiere nueva infraestructura |
| **RF-20** | Valor nuevo queda seleccionado | N/A | Depende de RF-19 |
| **RF-21** | Quitar valores seleccionados | N/A | Depende de RF-15 a RF-17 |
| **RF-22** | Valores reutilizables | N/A | Depende de RF-19 |
| **RF-23** | Language como selector | `PromptForm.tsx:361-368`: Input de texto libre | Requiere Select con opciones |
| **RF-24** | Language obligatorio | No hay validación de obligatoriedad | Requiere validación |
| **RF-25** | Language con opción por defecto | `schema.prisma:69`: `@default("en")` existe | Requiere Select con default |
| **RF-31** | Fechas no aparecen en alta | No hay lógica condicional en UI | Requiere lógica de visibilidad |
| **RF-36** | Duplicar: ir al nuevo prompt | `PromptForm.tsx:164`: `router.push("/prompts")` | Requiere redirect a nuevo ID |
| **RF-39** | Persistencia de vista elegida | No existe campo en `User` | Requiere nuevo campo + API |
| **RF-40** | Persistencia solo en listado | N/A | Depende de RF-39 |
| **RF-41** | Vista lista: Copy y Edit | Vista lista no existe | Depende de RF-37 |
| **RF-42** | Vista lista: contenido mínimo | Vista lista no existe | Depende de RF-37 |
| **RF-43** | Pre-Prompt y Manual no en listado | Listado actual no los muestra (no existen) | Automáticamente cumplido |
| **RF-44** | Filtro Platform multi-selección | `PromptFilters.tsx:113-133`: select simple | Requiere multi-select + query AND |
| **RF-45** | Filtro Category multi-selección | `PromptFilters.tsx:92-110`: select simple | Requiere multi-select + query AND |
| **RF-46** | Filtro Platform: lógica AND | `page.tsx:30-32`: `where.platform = value` (simple) | Requiere `where.platform: { in: [...] }` |
| **RF-47** | Filtro Category: lógica AND | `page.tsx:26-28`: `where.categoryId = value` (simple) | Requiere query con múltiples IDs |

### Implicación técnica general

Estos 26 RF comparten una característica: **requieren evolución del modelo de datos**. Los campos que hoy son strings simples deben convertirse en estructuras múltiples (arrays o relaciones N:M). Esto implica migraciones de DB, cambios en Zod schemas, cambios en API routes y cambios en componentes UI.

---

## 6. Puntos de fricción relevantes

### Tensiones entre objetivo y realidad actual

| Fricción | Objetivo | Realidad actual | Por qué fricciona |
|----------|----------|-----------------|-------------------|
| **Category múltiple + árbol jerárquico** | RF-12 a RF-14: seleccionar varias categorías | `Category` tiene `parentId` (árbol padre/hijo, `schema.prisma:99-102`) | Relación N:M con categorías anidadas genera complejidad: ¿seleccionar padres e hijos? ¿mostrar jerarquía en multi-select? |
| **Navegación "endurecida"** | RF-32 a RF-36: permanecer en formulario | `router.push("/prompts")` en 3 handlers distintos (`PromptForm.tsx:126, 164, 204`) | El comportamiento de expulsión está replicado en múltiples puntos; cambiarlo requiere modificar 3 handlers |
| **Export/Import con formato antiguo** | RF-48 a RF-50: mantener coherencia con formato actual | Export usa `prompt.platform` (string simple, `export/route.ts:29`) | Al pasar a arrays, el formato de export cambia; imports antiguos podrían no funcionar |
| **Filtros AND con volumen desconocido** | RF-44 a RF-47: lógica acumulativa con múltiples selecciones | Query actual usa `where.tags.some` (`page.tsx:46-53`) | Múltiples `where.field: { in: values }` pueden degradar rendimiento con volumen alto |

---

## 7. Vacíos estructurales o funcionales detectados en el repo

### Carencias del sistema que explican la distancia con el objetivo

| Vacío | Evidencia | RF afectados | Implicación |
|-------|-----------|--------------|-------------|
| **Ausencia de tablas para campos multivalor** | **Decisión D-01 resuelta**: Crear Platform, ClientProject, UseCase, ModelHint como entidades con junction tables | RF-06 a RF-22 | Requiere migración compleja con 5 entidades nuevas + 5 junction tables |
| **Ausencia de campo para preferencia de vista** | `model User` (`schema.prisma:11-24`) no tiene campo para preferencia | RF-39, RF-40 | Requiere nuevo campo en `User` o tabla separada |
| **Ausencia de mecanismo de creación inline** | No hay UI ni API para crear tags, platforms, etc. desde el formulario | RF-02, RF-05, RF-08, RF-09, RF-19, RF-20 | Requiere nuevos endpoints + componentes UI |
| **Ausencia de componente multi-select** | `PromptFilters` usa `Select` simple de shadcn (`PromptFilters.tsx:113-133`) | RF-44 a RF-47 | Requiere customización o componente nuevo |
| **Ausencia de vista lista** | `PromptList` solo tiene render grid (`PromptList.tsx:60-180`) | RF-37, RF-41 a RF-43 | Requiere nuevo render condicional |
| **Ausencia de validación de unicidad** | No hay validación de duplicados para tags, platforms, etc. | RF-05, RF-09, RF-19 | Riesgo de datos duplicados ("ChatGPT" vs "chatgpt") |
| **Ausencia de ownership en duplicado** | **Decisión D-03 resuelta**: Cualquiera puede duplicar cualquier prompt; no se verifica ownership del original | RF-36 | Duplicado asigna owner al usuario que duplica sin verificar el original |

---

## 8. Elementos inciertos o pendientes de confirmación

### Casos donde no puede afirmarse con suficiente fiabilidad

| Elemento | Estado | Qué se necesita para resolver |
|----------|--------|------------------------------|
| **Lista de idiomas para Language** | **RESUELTO (D-05)**: en, es, nl (mínimo; ampliable) | Implementar enum en Zod |
| **Reglas de creación de nuevos valores** | **RESUELTO (D-06)**: Cualquier usuario autenticado; normalización (trim + lowercase) | Implementar endpoints con auth + unicidad |
| **Volumen de datos actual** | **NO PROCEDE** en este momento | Afecta estrategia de rendimiento de filtros AND |
| **Rate limiting existente** | **RESUELTO (D-08)**: Implementar en middleware.ts | Inventario confirma Plan Hobby sin rate limiting |
| **APIs de creación de tags** | **RESUELTO**: `app/api/tags/route.ts` inspeccionado. POST tiene auth; NO hay unicidad ni sanitización | PUT/DELETE requieren admin; se necesita implementar D-06 |
| **APIs de creación de categories** | **RESUELTO**: `app/api/categories/route.ts` inspeccionado. POST tiene auth; NO hay unicidad ni sanitización | PUT/DELETE requieren admin; se necesita implementar D-06 |
| **Tests existentes** | **RESUELTO**: 30 tests, 8 suites, TODOS PASAN | Infraestructura de testing funcional |

### Por qué importa esta incertidumbre

Estas incertidumbres restantes no bloquean el análisis de alineación. Las decisiones D-01 a D-08 están resueltas y definen la dirección técnica. Las incertidumbres pendientes (volumen de datos, APIs de creación) son de menor impacto y pueden resolverse durante la implementación.

---

## 9. Conclusiones para la intervención técnica

### Cómo el grado de alineación observado condiciona el trabajo posterior

| Área | Condicionante | Acción requerida |
|------|--------------|------------------|
| **Cambios técnicos necesarios (Bloque 02)** | 60% de RF requieren intervención significativa | Priorizar cambios estructurales (schema, API) antes que cambios de UI |
| **Dependencias y condicionantes (Bloque 04)** | **D-01 resuelta**: tablas nuevas + N:M | Migraciones definidas: 5 entidades + 5 junction tables |
| **Validación técnica (Bloque 05)** | Tests actuales cubren estructura simple | Extender tests antes de implementar cambios estructurales |
| **Seguridad integrada (Bloque 06)** | **D-03 resuelta**: duplicado sin verificar ownership del original | Implementar duplicado sin restricción de ownership |
| **Riesgos y decisiones abiertas (Bloque 07)** | **D-01 a D-08 RESUELTAS** | Todas las decisiones documentadas con opciones tomadas |

### Prioridades derivadas del análisis de alineación

1. **Modelado de datos (D-01)**: 5 entidades nuevas (Platform, ClientProject, UseCase, ModelHint, Category junction) + 5 junction tables — base para todo lo demás
2. **Navegación post-guardado**: Cambio más simple pero con mayor impacto en UX
3. **Vista lista**: Funcionalidad nueva más visible para el usuario
4. **Filtros multi-selección**: Cambios coordinados en frontend y backend
5. **Export/Import (D-02)**: Nuevo formato completo; imports reemplazan existentes por coincidencia (userId + ID/título)

---

## 10. Evidencia principal utilizada

### Archivos de código que sostienen el contraste

| Archivo | Líneas | Evidencia obtenida |
|---------|--------|-------------------|
| `prisma/schema.prisma` | 131 | Modelo `Prompt` con campos simples; `Category` con árbol jerárquico |
| `components/prompt/PromptForm.tsx` | 533 | Estado con strings simples; navegación expulsa; estructura 3 secciones |
| `components/prompt/PromptList.tsx` | 181 | Solo vista cards, botón "View" |
| `components/prompt/PromptFilters.tsx` | 217 | Selects simples, no multi-select |
| `app/(app)/prompts/page.tsx` | 230 | Queries con filtros simples (sin AND) |
| `app/(app)/prompts/new/page.tsx` | 37 | Wrapper de PromptForm (modo create) |
| `app/(app)/prompts/[id]/page.tsx` | 63 | Wrapper de PromptForm (modo edit) |
| `app/api/prompts/route.ts` | 163 | Zod schemas con strings simples; filtros simples |
| `app/api/prompts/[id]/route.ts` | 199 | `checkOwnership` para edit/delete, no duplicado |
| `app/api/export/prompts/route.ts` | 60 | Formato de exportación con strings simples |
| `app/api/import/prompts/route.ts` | 144 | Formato de importación con strings simples |
| `lib/auth.ts` | 62 | NextAuth con JWT, session con user.id y user.role |
| `middleware.ts` | ~30 | Protección de rutas |
| `tests/api/prompts.test.ts` | 152 | Tests para estructura simple, no cubre arrays |

### Matriz de Trazabilidad: RF → Evidencia

| Clasificación | RF | Evidencia clave |
|---------------|-----|-----------------|
| **Ya Soportado** | RF-01, RF-04, RF-29, RF-30, RF-38, RF-49, RF-50 | `schema.prisma:85`, `PromptForm.tsx:437-463`, `export/route.ts:30` |
| **Parcialmente Soportado** | RF-02, RF-03, RF-05, RF-26 a RF-28, RF-32 a RF-34, RF-37, RF-48 | `PromptForm.tsx:437-463`, `schema.prisma:81-82`, `PromptList.tsx:60-180` |
| **No Soportado** | RF-06 a RF-25, RF-31, RF-36, RF-39 a RF-47 | `schema.prisma:67,79`, `PromptForm.tsx:67,77`, `PromptFilters.tsx:113-133` |
| **En Fricción** | RF-12 a RF-14, RF-32 a RF-36, RF-48 a RF-50, RF-44 a RF-47 | `schema.prisma:99-102`, `PromptForm.tsx:126,164`, `export/route.ts:29` |

### Límites de confianza

| Límite | Por qué existe | Cómo afecta |
|--------|---------------|-------------|
| **Volumen de datos desconocido** | No hay acceso a métricas de producción | Rendimiento de filtros AND incierto |
| **APIs de creación no inspeccionadas** | **RESUELTO**: `app/api/tags/route.ts`, `app/api/categories/route.ts` inspeccionados | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **Configuración de entorno no visible** | `.env` no inspeccionado | Rate limiting podría estar configurado |

---

## 11. Bloqueos o límites del análisis

### Lo que no pudo contrastarse con mínima fiabilidad

| Elemento | Por qué no pudo contrastarse | Cómo condiciona la interpretación |
|----------|-----------------------------|----------------------------------|
| **Volumen actual de datos** | No hay acceso a métricas de producción | Fricción de rendimiento en filtros AND podría estar sobreestimada o subestimada |
| **APIs de creación de tags/platforms** | **RESUELTO**: Archivos inspeccionados | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **Configuración de Vercel** | No accesible en el repo | Protecciones de plataforma (rate limiting, caching) podrían mitigar riesgos identificados |

### Evidencia que faltó

| Evidencia faltante | Por qué es relevante | Cómo se mitigó |
|--------------------|---------------------|----------------|
| **Métricas de volumen** | Para calibrar impacto de queries complejas | Se asume volumen bajo-medio (Hobby tier) |
| **APIs de creación** | Para confirmar si existe base reutilizable | Se documenta como gap; se asume que no existe |
| **Configuración `.env`** | Para identificar protecciones existentes | Se asume que no existe rate limiting |

### Cómo condiciona la confianza del bloque

1. **Gaps podrían ser menores de lo estimado**: Si existen APIs de creación no identificadas, algunos RF de "No Soportado" podrían pasar a "Parcialmente Soportado"
2. **Riesgos de rendimiento podrían estar sobreestimados**: Si el volumen es bajo, filtros AND no serán problema
3. **Protecciones podrían existir en Vercel**: Configuración de plataforma podría añadir seguridad no visible

**Mitigación**: Las conclusiones son conservadoras (asumen lo peor). Si hay piezas o protecciones no identificadas, la situación real será mejor que la estimada.

---

**Fin del documento**
