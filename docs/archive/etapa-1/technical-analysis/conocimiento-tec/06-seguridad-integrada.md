# Seguridad Integrada

**Documento:** `doc-plan/doc-implementar/conocimiento-tec/06-seguridad-integrada.md`  
**Bloque emisor:** 160-BLOQUE-06  
**Fecha de generación:** 2026-04-24  
**Versión:** 1.0

---

## 1. Alcance del análisis del bloque

### Parte del cambio tomada como referencia

Este análisis examina el impacto en seguridad de los **50 Requisitos Funcionales (RF-01 a RF-50)** definidos en `doc-plan/doc-base/02-Improvement-Spec.md`, tomando como referencia los hallazgos acumulados en los bloques 00 a 05:

- **Bloque 00**: Índice y preparación del trabajo
- **Bloque 01**: Mapa técnico de intervención (4 capas, 13 archivos inspeccionados)
- **Bloque 02**: Cambios técnicos necesarios (7 tipos de cambio, 26 elementos en tabla maestra)
- **Bloque 03**: Relación objetivo vs realidad (60% de RF requieren intervención significativa)
- **Bloque 04**: Dependencias y condicionantes (12 dependencias directas, 10 puntos sensibles)
- **Bloque 05**: Validación técnica (0 tests de ownership, 0 tests de PromptForm, cobertura baja)

### Zonas del sistema revisadas para el análisis de seguridad

| Zona | Archivos inspeccionados | Nivel de fiabilidad |
|------|------------------------|---------------------|
| **Autenticación** | `lib/auth.ts`, `middleware.ts` | ALTO (100%) |
| **Autorización** | `app/api/prompts/[id]/route.ts` (checkOwnership) | ALTO (100%) |
| **API Routes** | `app/api/prompts/route.ts`, `[id]/route.ts`, `export/route.ts`, `import/route.ts` | ALTO (100%) |
| **Modelo de Datos** | `prisma/schema.prisma` (User, Prompt, relaciones) | ALTO (100%) |
| **Formulario** | `components/prompt/PromptForm.tsx` | ALTO (100%) |
| **Validación** | Zod schemas en API routes | ALTO (100%) |
| **Tests de seguridad** | `tests/api/prompts.test.ts`, `tests/api/auth.test.ts` | ALTO (100%) |

### Nivel de fiabilidad del análisis de seguridad

| Nivel | Porcentaje | Justificación |
|-------|------------|---------------|
| **ALTO** | 80% | Mecanismos de auth, authorization y validación inspeccionados al 100% |
| **MEDIO** | 15% | APIs de creación de tags/categories no inspeccionadas; rate limiting no verificable |
| **BAJO** | 5% | Configuración de Vercel no accesible; variables de entorno no inspeccionadas |

---

## 2. Resumen del impacto en seguridad

### Síntesis del impacto

El cambio **afecta directamente a mecanismos relevantes de seguridad** en 4 áreas principales:

| Área de impacto | Gravedad | Descripción |
|-----------------|----------|-------------|
| **Autorización (ownership)** | ALTA | `checkOwnership` no contempla duplicado; import/export sin auth check |
| **Validación de entrada** | ALTA | Nuevos campos y arrays amplían superficie de validación; Zod schemas deben actualizarse |
| **Exposición de datos** | MEDIA | Nuevos campos (`prePrompt`, `manualDeUso`) se exponen en API responses |
| **Creación de valores globales** | MEDIA | Nuevos endpoints de creación (tags, platforms, etc.) necesitan control de permisos |

### Zonas que concentran mayor impacto o sensibilidad

| Zona | Sensibilidad | Razón |
|------|-------------|-------|
| **`[id]/route.ts` (PUT/DELETE)** | CRÍTICA | Ownership check gobierna acceso a datos de otros usuarios |
| **`import/route.ts`** | ALTA | Sin auth check; permite inyección masiva de datos |
| **`export/route.ts`** | ALTA | Sin auth check; expone todos los prompts del sistema |
| **`PromptForm.tsx`** | MEDIA | Payload construction debe validar arrays antes de enviar a API |
| **Nuevas APIs de creación** | MEDIA | Creación de valores reutilizables (tags, platforms) necesita control |

### Controles que deben preservarse

| Control | Ubicación | Por qué preservar |
|---------|-----------|-------------------|
| **Auth middleware** | `middleware.ts` | Protege todas las rutas excepto /api y auth |
| **Auth en API routes** | `auth()` en POST/PUT/DELETE | Verifica sesión antes de operaciones sensibles |
| **Ownership check** | `[id]/route.ts:26-41` | Impide que usuarios editen/borren prompts de otros |
| **Role-based admin access** | `session.user.role === "admin"` | Permite a admins gestionar todos los prompts |
| **Zod validation** | `route.ts:6-23`, `[id]/route.ts:6-23` | Previene inyección de datos malformados |
| **bcrypt password hashing** | `lib/auth.ts:32` | Protege contraseñas de usuarios |

### Revisiones, refuerzos y riesgos relevantes

| Tipo | Elemento | Acción requerida |
|------|----------|-----------------|
| **Revisión** | `checkOwnership` en duplicado | Definir y validar que duplicado asigna owner correcto |
| **Refuerzo** | `import/route.ts` | Añadir auth check |
| **Refuerzo** | `export/route.ts` | Añadir auth check + filtrar por userId |
| **Riesgo** | Nuevos endpoints de creación | Sin control de permisos, cualquier usuario crea valores globales |

---

## 3. Mecanismos de seguridad existentes relevantes

### Mecanismos observables en el repositorio

| Mecanismo | Tipo | Ubicación / evidencia | Función | Relevancia para el cambio |
|-----------|------|----------------------|---------|--------------------------|
| **NextAuth con JWT** | Autenticación | `lib/auth.ts:8-62` | Gestiona autenticación con Credentials provider, JWT strategy | Sesión contiene `user.id` y `user.role`; usado en todos los checks de auth |
| **Auth middleware** | Protección de rutas | `middleware.ts:1-31` | Redirige a `/auth/signin` si no autenticado; excluye `/api` | Middleware no protege API routes; auth se maneja manualmente en cada handler |
| **Session callback** | Propagación de identidad | `lib/auth.ts:42-47` | Inyecta `user.id` y `user.role` en session | Role determina acceso admin; id determina ownership |
| **JWT callback** | Token management | `lib/auth.ts:49-55` | Almacena `id` y `role` en JWT token | Token viaja en cookie; no puede ser manipulado desde cliente |
| **checkOwnership** | Autorización | `[id]/route.ts:26-41` | Verifica si user es owner o admin antes de edit/delete | **Decisión D-03**: No contempla duplicado; cualquiera puede duplicar cualquier prompt |
| **Zod schemas** | Validación de entrada | `route.ts:6-23`, `[id]/route.ts:6-23` | Valida input de create/update con enums y tipos | Debe actualizarse para aceptar arrays; si no, API rechaza requests válidos |
| **bcryptjs** | Hash de passwords | `lib/auth.ts:32` | Compara password hash en login | No afectado directamente por cambios de esta iniciativa |
| **Prisma parameterized queries** | Prevención de SQL injection | Todos los API routes | Prisma usa parameterized queries automáticamente | Protección inherente contra SQL injection |
| **Password field en User** | Protección de datos sensibles | `schema.prisma:17`: `password String?` | Password almacenado en DB (hasheado) | No se expone en API responses (no está en includes) |
| **onDelete: SetNull** | Integridad referencial | `schema.prisma:84`: `onDelete: SetNull` | Si user se borra, prompts quedan sin owner | Prompts huérfanos no son editables por nadie (excepto admin) |

### Patrones de seguridad observados

| Patrón | Descripción | Dónde se aplica |
|--------|-------------|-----------------|
| **Auth manual en API routes** | Cada handler llama `auth()` y verifica `session?.user` | POST, PUT, DELETE en prompts |
| **Role-based access** | `session.user.role === "admin"` permite bypass de ownership | PUT, DELETE en `[id]/route.ts` |
| **Ownership por userId** | `prompt.userId !== userId` bloquea acceso | PUT, DELETE en `[id]/route.ts` |
| **Zod como puerta de entrada** | Todo input pasa por Zod antes de Prisma | POST, PUT, import |
| **Error handling genérico** | `catch` returns 500 con mensaje genérico | Todos los API routes |

---

## 4. Puntos del cambio con impacto en seguridad

### Partes del cambio que afectan o pueden afectar a seguridad

#### 4.1. Acceso a recursos (ownership + duplicado)

| Cambio | Impacto en seguridad | Evidencia | Nivel de riesgo |
|--------|---------------------|-----------|-----------------|
| **Duplicado de prompt** | **Decisión D-03**: Cualquiera puede duplicar cualquier prompt; no se verifica ownership del original; nuevo prompt asigna owner al usuario que duplica | `[id]/route.ts:26-41` solo verifica edit/delete | BAJO |
| **Nuevas relaciones N:M** | Creación de relaciones (platforms, categories) debe respetar ownership | `route.ts:119-146` crea tags; patrón a replicar | MEDIO |
| **Preferencia de vista por usuario** | Nuevo campo en User; debe ser accesible solo por el propio usuario | `schema.prisma:11-24` no tiene campo | BAJO |

#### 4.2. Exposición de datos

| Cambio | Impacto en seguridad | Evidencia | Nivel de riesgo |
|--------|---------------------|-----------|-----------------|
| **Nuevos campos `prePrompt`, `manualDeUso`** | Se exponen en GET responses; pueden contener información sensible | `route.ts:78-91` incluye todos los campos del prompt | MEDIO |
| **Arrays de platforms, categories, etc.** | Más datos expuestos en responses | `PromptList.tsx:9-31` interface define campos expuestos | BAJO |
| **Export sin auth** | **Decisión D-04**: Usuario solo exporta sus propios prompts; filtrar por userID | `export/route.ts:4-58` no verifica auth | ALTO |
| **Import sin auth** | **Decisión D-04**: Usuario solo importa sus propios prompts; asigna a sí mismos | `import/route.ts:13-142` no verifica auth | ALTO |

#### 4.3. Validaciones de entrada

| Cambio | Impacto en seguridad | Evidencia | Nivel de riesgo |
|--------|---------------------|-----------|-----------------|
| **Zod schemas deben aceptar arrays** | Si no se actualizan, API rechaza requests válidos; si se relajan demasiado, acepta inválidos | `route.ts:11`: `z.enum([...])` para platform | ALTO |
| **Nuevos campos opcionales** | `prePrompt`, `manualDeUso` deben validarse (longitud, caracteres) | No hay validación de longitud para strings en schemas actuales | MEDIO |
| **Creación de nuevos valores** | **Decisión D-06**: Cualquier usuario autenticado puede crear; normalización (trim + lowercase) | Tags, platforms, etc. creados desde formulario necesitan validación de unicidad y sanitización | MEDIO |

#### 4.4. Flujos autenticados

| Cambio | Impacto en seguridad | Evidencia | Nivel de riesgo |
|--------|---------------------|-----------|-----------------|
| **Navegación post-save** | Redirigir a `/prompts/[id]` tras create; debe verificar que user es owner del nuevo prompt | `PromptForm.tsx:126`: `router.push("/prompts")` | BAJO |
| **Session JWT con preferencia** | Añadir preferencia de vista al token aumenta payload; JWT tiene límite de tamaño | `auth.ts:42-47`: session callback | BAJO |

#### 4.5. Acciones privilegiadas

| Cambio | Impacto en seguridad | Evidencia | Nivel de riesgo |
|--------|---------------------|-----------|-----------------|
| **Creación de valores globales** | Crear tags, platforms, categories afecta a todos los usuarios | No hay API de creación observada | ALTO |
| **Admin access** | Admin puede editar/borrar cualquier prompt; debe mantenerse tras cambios | `[id]/route.ts:37`: `!isAdmin && prompt.userId !== userId` | MEDIO |

---

## 5. Elementos que deben preservarse

### Controles que no deben degradarse

| Control | Ubicación | Por qué preservar | Riesgo si se altera |
|---------|-----------|-------------------|---------------------|
| **Auth middleware** | `middleware.ts:1-31` | Protege todas las rutas de aplicación contra acceso no autenticado | Usuarios no autenticados acceden a datos de otros |
| **Auth en API routes (POST/PUT/DELETE)** | `route.ts:105-112`, `[id]/route.ts:80-87` | Verifica sesión antes de operaciones de escritura | Creación/edición/borrado sin autenticación |
| **Ownership check** | `[id]/route.ts:26-41` | Impide que usuarios editen/borren prompts de otros | **Violación de datos**: usuarios acceden a prompts ajenos |
| **Role-based admin bypass** | `[id]/route.ts:37`: `session.user.role === "admin"` | Permite a admins gestionar contenido del sistema | Admins pierden capacidad de gestión |
| **Zod validation en POST** | `route.ts:115`: `createPromptSchema.parse(body)` | Previene inyección de datos malformados | Datos corruptos en DB; posible explotación |
| **Zod validation en PUT** | `[id]/route.ts:103`: `updatePromptSchema.parse(body)` | Idem para updates | Idem para updates |
| **Password hashing con bcrypt** | `lib/auth.ts:32` | Protege contraseñas de usuarios | Contraseñas expuestas si se debilita |
| **Prisma parameterized queries** | Implícito en todas las queries | Previene SQL injection | SQL injection si se usan raw queries |
| **Password no expuesto en responses** | No está en `include` de ninguna query | Contraseñas no viajan en responses | Exposición de hashes de password |
| **onDelete: SetNull para user** | `schema.prisma:84` | Prompts no se borran cuando user se borra | Pérdida de datos si cambia a Cascade |

---

## 6. Elementos que deben revisarse o reforzarse

### Puntos donde el cambio exige revisar, adaptar o reforzar seguridad

#### 6.1. A revisar

| Elemento | Ubicación | Por qué necesita revisión | Naturaleza del ajuste |
|----------|-----------|--------------------------|----------------------|
| **checkOwnership para duplicado** | `[id]/route.ts:26-41` | **Decisión D-03**: Cualquiera puede duplicar cualquier prompt; no se requiere verificación de ownership del original | No extender; duplicado sin restricción |
| **Zod schemas para arrays** | `route.ts:6-23`, `[id]/route.ts:6-23` | `platform: z.enum([...])` debe cambiar a `platforms: z.array(z.enum([...]))` | Actualizar schemas manteniendo validación estricta de enum values |
| **Export sin auth** | `export/route.ts:4-58` | **Decisión D-04**: Añadir `auth()` check + filtrar por `userId` | Añadir `auth()` check + filtrar por `userId` |
| **Import sin auth** | `import/route.ts:13-142` | **Decisión D-04**: Añadir `auth()` check + asignar `userId` del importador | Añadir `auth()` check + asignar `userId` del importador |
| **importSchema con `z.any()`** | `import/route.ts:5-11` | `prompts: z.array(z.any())` no valida estructura | Definir schema específico para prompts importados |

#### 6.2. A reforzar

| Elemento | Ubicación | Por qué necesita refuerzo | Naturaleza del refuerzo |
|----------|-----------|--------------------------|------------------------|
| **Nuevos endpoints de creación** | `app/api/tags/route.ts`, `app/api/platforms/route.ts` (no existen aún) | **Decisión D-06**: Cualquier usuario autenticado puede crear; normalización (trim + lowercase) | Auth check + validación de unicidad + sanitización de nombre + normalización |
| **Validación de longitud para nuevos campos** | `route.ts:6-23` | `prePrompt`, `manualDeUso` sin validación de longitud | Añadir `.max()` a schemas para prevenir payloads masivos |
| **Sanitización de nombres de valores creados** | Nuevos endpoints de creación | Nombres de tags, platforms, etc. pueden contener caracteres peligrosos | Trim + lowercase + regex de caracteres permitidos |
| **Transaccionalidad en relaciones N:M** | `[id]/route.ts:108-123` | **Decisión D-07**: `$transaction` explícito para delete+create | Envolver en `$transaction` para atomicidad |
| **Rate limiting en endpoints de creación** | Todos los endpoints POST | **Decisión D-08**: Middleware con rate limiting en middleware.ts | Implementar en middleware.ts |

#### 6.3. Matriz de preservación/revisión/refuerzo

| Mecanismo | Acción | Prioridad | RF afectados | Justificación |
|-----------|--------|-----------|--------------|---------------|
| Auth middleware | Preservar | CRÍTICA | Todos | Base de protección de rutas |
| Auth en API routes | Preservar | CRÍTICA | RF-01 a RF-50 | Base de protección de operaciones |
| Ownership check | Preservar + **D-03**: No extender a duplicado | CRÍTICA | RF-36 | Duplicado sin restricción de ownership |
| Zod validation | Preservar + Revisar | CRÍTICA | RF-01 a RF-50 | Debe aceptar arrays sin relajar validación |
| Export sin auth | Reforzar | ALTA | RF-48 a RF-50 | **D-04**: Añadir auth + filtrado por user |
| Import sin auth | Reforzar | ALTA | RF-48 a RF-50 | **D-04**: Añadir auth + owner assignment |
| Nuevos endpoints de creación | Reforzar | ALTA | RF-02, RF-08, RF-19 | **D-06**: Auth + unicidad + sanitización + normalización |
| Transaccionalidad N:M | Reforzar | MEDIA | RF-06 a RF-22 | **D-07**: `$transaction` explícito |
| Rate limiting | Reforzar | MEDIA | Todos los POST | **D-08**: Middleware con rate limiting |
| Validación de longitud | Reforzar | BAJA | RF-26 a RF-28 | Prevenir payloads masivos |

---

## 7. Validaciones de seguridad a contemplar

### Comprobaciones específicas de seguridad que deberán tenerse en cuenta

| Qué verificar | Por qué | Base actual aprovechable | Tipo de validación |
|---------------|---------|-------------------------|-------------------|
| **Ownership bloquea edit de prompt ajeno** | Seguridad fundamental del sistema | `checkOwnership` existe; tests de API con mocks | Tests unitarios con session mock de user diferente al owner |
| **Admin puede editar cualquier prompt** | Funcionalidad de administración requerida | `session.user.role === "admin"` en `[id]/route.ts` | Tests unitarios con session mock de admin |
| **Duplicado asigna owner al usuario que duplica** | RF-36: nuevo prompt debe pertenecer a quien duplica | `route.ts:122`: `userId: session.user.id` en POST | Tests de API con session mock |
| **Export requiere autenticación** | RF-48 a RF-50: export no debe ser público | `auth()` pattern existente en otros routes | Tests de API: verificar 401 sin auth |
| **Export filtra por userId** | Usuarios solo deben exportar sus propios prompts | `session.user.id` disponible en auth | Tests de API: verificar que solo retorna prompts del user |
| **Import requiere autenticación** | Import no debe ser público | `auth()` pattern existente | Tests de API: verificar 401 sin auth |
| **Import asigna owner al importador** | Prompts importados deben pertenecer a quien importa | `session.user.id` disponible en auth | Tests de API: verificar userId del prompt creado |
| **Zod rechaza platform no válido** | Validación de entrada debe mantenerse estricta | `z.enum([...])` en schemas actuales | Tests de API: enviar platform inválido, verificar 400 |
| **Zod acepta arrays de platforms válidos** | Nuevos schemas deben aceptar arrays | Patrón de `z.array()` ya usado para `tagIds` | Tests de API: enviar array de platforms válidos |
| **Zod rechaza arrays con valores inválidos** | Arrays deben validar cada elemento | `z.array(z.string())` para tagIds | Tests de API: enviar array con platform inválido |
| **Nuevos campos no exponen datos sensibles** | `prePrompt`, `manualDeUso` pueden contener información sensible | No hay datos sensibles identificados aún | Revisión manual de contenido esperado |
| **Rate limiting funciona en POST** | Prevenir creación masiva automática | No hay rate limiting observable | Tests de carga o configuración de Vercel |
| **Sanitización de nombres de valores creados** | Prevenir XSS o inyección en nombres de tags, platforms | No hay sanitización observada | Tests de API: enviar nombre con caracteres especiales |
| **Transaccionalidad en delete+create de relaciones** | Prevenir pérdida de datos si update falla | Prisma `$transaction` disponible | Tests de integración: simular fallo en create después de delete |

---

## 8. Riesgos de seguridad identificados o amplificados

### Riesgos que el cambio introduce, amplifica o deja expuestos

| Riesgo | Tipo | Causa | Impacto | Probabilidad | Severidad | RF relacionados |
|--------|------|-------|---------|--------------|-----------|-----------------|
| **Acceso no autorizado a prompts de otros** | Autorización | **Decisión D-03**: Cualquiera puede duplicar cualquier prompt; no se verifica ownership del original | Duplicado intencionalmente sin restricción | BAJO | MEDIA | RF-36 |
| **Export público de todos los prompts** | Exposición de datos | **Decisión D-04**: Implementar auth + filtrar por userID | Si no se implementa correctamente, exposición de datos | ALTA | ALTA | RF-48 a RF-50 |
| **Import público sin restricciones** | Inyección de datos | **Decisión D-04**: Implementar auth + asignar userId del importador | Si no se implementa correctamente, inyección masiva | MEDIA | ALTA | RF-48 a RF-50 |
| **Bypass de validación por schemas desactualizados** | Validación | Zod schemas no actualizados para arrays | MEDIO | MEDIA | MEDIA | RF-06 a RF-22 |
| **Creación de valores duplicados** | Integridad de datos | **Decisión D-06**: Normalización automática (trim + lowercase) previene duplicados por case | Duplicados por caracteres distintos al case aún posibles | BAJO | ALTA | BAJA | RF-02, RF-08, RF-19 |
| **Incoherencia entre capas de control** | Arquitectura | Auth en API routes pero no en middleware para /api | MEDIO | BAJA | MEDIA | Todos los API endpoints |
| **Ampliación de superficie de ataque** | Superficie | Nuevos endpoints de creación (tags, platforms, etc.) | MEDIO | MEDIA | MEDIA | RF-02, RF-05, RF-08, RF-11, RF-19, RF-22 |
| **Pérdida de datos por transacción incompleta** | Integridad | **Decisión D-07**: `$transaction` explícito para delete+create | Riesgo mitigado si se implementa correctamente | ALTO | BAJA | ALTA | RF-06 a RF-22 |
| **JWT payload excesivo** | Rendimiento/seguridad | Añadir preferencia de vista al token aumenta tamaño | BAJO | BAJA | BAJA | RF-39, RF-40 |
| **XSS en nombres de valores creados** | Inyección | Sin sanitización de nombres de tags, platforms, etc. | MEDIO | MEDIA | MEDIA | RF-02, RF-08, RF-19 |

### Riesgos amplificados por el cambio

| Riesgo existente | Cómo se amplifica | Consecuencia |
|-----------------|-------------------|--------------|
| **Auth manual en API routes** | Más endpoints = más puntos donde olvidar auth check | Cada nuevo endpoint debe incluir auth manualmente |
| **Zod schemas duplicados** | Más campos = más riesgo de inconsistencia entre create y update | Schema de create acepta algo que update rechaza (o viceversa) |
| **Include repetido en queries** | Más relaciones = más puntos donde olvidar incluir datos | Query retorna datos incompletos; UI falla |
| **Sin tests de seguridad** | Más cambios = más riesgo de regresión no detectada | Vulnerabilidades introducidas sin detección |

---

## 9. Puntos inciertos o pendientes de confirmación

### Casos donde no puede afirmarse con suficiente fiabilidad el impacto de seguridad

| Punto incierto | Por qué existe incertidumbre | Qué se necesita para resolver | Impacto potencial si se confirma |
|----------------|-----------------------------|------------------------------|----------------------------------|
| **APIs de creación de tags** | **RESUELTO**: `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts` inspeccionados | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **APIs de creación de categories** | **RESUELTO**: `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` inspeccionados | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **Rate limiting en Vercel** | Configuración de plataforma no accesible | Dashboard de Vercel o configuración de middleware | Si no existe, endpoints POST son vulnerables a abuso |
| **Variables de entorno sensibles** | `.env` no inspeccionado | Verificar que DATABASE_URL, AUTH_SECRET no están expuestas | Si están expuestas, credenciales de DB comprometidas |
| **HTTPS enforcement** | No se observa redirect de HTTP a HTTPS | Configuración de Vercel o middleware | Si no existe, traffic no encriptado |
| **Cookie security flags** | NextAuth session cookie config no inspeccionada a fondo | Verificar flags `Secure`, `HttpOnly`, `SameSite` | Sin flags, cookies vulnerables a robo |
| **CSRF protection** | No se observa protección CSRF explícita | NextAuth puede tener CSRF built-in para Credentials | Si no existe, formularios vulnerables a CSRF |
| **Headers de seguridad** | No se observan headers como CSP, X-Frame-Options | Configuración de Next.js o Vercel | Sin headers, aplicación vulnerable a clickjacking, etc. |

### Indicios sin evidencia suficiente

| Indicio | Evidencia parcial | Qué falta |
|---------|-------------------|-----------|
| **CSRF protection en NextAuth** | NextAuth beta tiene CSRF para OAuth, pero Credentials puede no tenerlo | Verificar si Credentials provider tiene CSRF token |
| **Session cookie secure** | JWT strategy usa cookies por defecto | Verificar configuración de cookies en `lib/auth.ts` |
| **Password policy** | `lib/auth.ts:23`: `z.string().min(6)` para password | Mínimo 6 caracteres es bajo; no hay validación de complejidad |

---

## 10. Observaciones que condicionan bloques posteriores

### Hallazgos que condicionarán especialmente la validación técnica (Bloque 05 ya generado, pero aplica a ejecución)

| Hallazgo | Implicación para validación |
|----------|---------------------------|
| **0 tests de ownership** | Tests de autorización deben crearse como prioridad antes de implementar cambios |
| **0 tests de export/import** | Tests de auth en export/import deben crearse antes de desplegar |
| **0 tests de duplicado** | Tests de ownership en duplicado deben crearse antes de implementar RF-36 |
| **Sin tests de sanitización** | Tests de input con caracteres especiales deben añadirse |

### Hallazgos que condicionarán especialmente los riesgos y decisiones abiertas (Bloque 07)

| Hallazgo | Estado | Decisión abierta |
|----------|--------|-----------------|
| **Export sin auth** | **RESUELTO (D-04)**: Usuario solo exporta sus propios prompts | Implementar auth + filtrado por userID |
| **Import sin auth** | **RESUELTO (D-04)**: Usuario solo importa sus propios prompts | Implementar auth + owner assignment |
| **checkOwnership no cubre duplicado** | **RESUELTO (D-03)**: Cualquiera puede duplicar cualquier prompt | No se requiere verificación de ownership |
| **Sin sanitización de nombres** | **RESUELTO (D-06)**: Normalización (trim + lowercase) | Implementar normalización en endpoints de creación |
| **Sin transaccionalidad en N:M** | **RESUELTO (D-07)**: `$transaction` explícito | Implementar transacción explícita |
| **Password mínimo 6 caracteres** | Contraseñas débiles | ¿Aumentar mínimo a 8+ y añadir complejidad? |

### Hallazgos que condicionarán la futura documentación operativa

| Hallazgo | Implicación para documentos de sprint |
|----------|--------------------------------------|
| **Auth debe añadirse a export/import** | Sprint de export/import debe incluir tarea de auth (**D-04**: filtrar por userID) |
| **Duplicado sin ownership** | Sprint de duplicado: no verificar ownership del original (**D-03**) |
| **Nuevos endpoints necesitan auth + unicidad + normalización** | Sprint de creación de valores debe incluir seguridad + normalización (**D-06**: trim + lowercase) |
| **Transaccionalidad en relaciones N:M** | Sprint de migraciones debe incluir `$transaction` explícito (**D-07**) |
| **Rate limiting en middleware** | Sprint de seguridad/infraestructura debe implementar en middleware.ts (**D-08**) |
| **Tests de seguridad como prioridad** | Cada sprint debe incluir tests de seguridad antes de funcionalidad |

---

## 11. Evidencia principal utilizada

### Módulos, archivos, controles y configuraciones del repo

| Evidencia | Ubicación | Qué demuestra |
|-----------|-----------|---------------|
| **NextAuth con JWT** | `lib/auth.ts:8-62` | Autenticación configurada con Credentials, JWT, session con id y role |
| **Auth middleware** | `middleware.ts:1-31` | Protección de rutas de aplicación; /api excluido |
| **checkOwnership** | `[id]/route.ts:26-41` | Verificación de ownership para edit/delete; no cubre duplicado |
| **Auth en POST** | `route.ts:105-112` | Verificación de sesión antes de crear prompt |
| **Auth en PUT/DELETE** | `[id]/route.ts:80-87`, `163-170` | Verificación de sesión + ownership antes de editar/borrar |
| **Sin auth en export** | `export/route.ts:4-58` | Export no verifica autenticación |
| **Sin auth en import** | `import/route.ts:13-142` | Import no verifica autenticación |
| **Zod schemas** | `route.ts:6-23`, `[id]/route.ts:6-23` | Validación de entrada con enums estrictos |
| **Password hashing** | `lib/auth.ts:32` | bcrypt.compare para verificación de password |
| **APIs de creación de tags** | `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts` | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **APIs de creación de categories** | `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` | POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |
| **Inventario de recursos Vercel** | `.gobernanza/.governance/inventario_recursos.md` | Plan Hobby, sin rate limiting, despliegue manual, token en GitHub Secrets |
| **Password mínimo 6 chars** | `lib/auth.ts:23`: `z.string().min(6)` | Validación de password en registro |
| **Prisma parameterized queries** | Implícito en todas las queries | Protección contra SQL injection |
| **onDelete: SetNull** | `schema.prisma:84` | Prompts no se borran con user |
| **Session callback** | `lib/auth.ts:42-47` | Inyección de user.id y user.role en session |

### Matriz de trazabilidad: impacto en seguridad → evidencia

| Impacto en seguridad | Evidencia clave | Conclusión |
|---------------------|-----------------|------------|
| **Ownership no cubre duplicado** | `[id]/route.ts:26-41` solo verifica edit/delete | Riesgo: duplicado sin verificación de ownership del original |
| **Export sin auth** | `export/route.ts:4-58` sin `auth()` call | Riesgo: cualquier usuario exporta todos los prompts |
| **Import sin auth** | `import/route.ts:13-142` sin `auth()` call | Riesgo: cualquier usuario importa datos masivamente |
| **Zod acepta solo string para platform** | `route.ts:11`: `z.enum([...])` | Riesgo: schemas deben actualizarse para arrays |
| **Auth en API pero no en middleware para /api** | `middleware.ts:28-29`: excluye `/api` | Riesgo: cada endpoint debe incluir auth manualmente |
| **APIs de creación sin unicidad** | `tags/route.ts:47-52`, `categories/route.ts:51-73` | POST crea sin verificar duplicados; se necesita D-06 |

### Límites de confianza

| Límite | Estado | Cómo afecta |
|--------|--------|-------------|
| **APIs de creación** | **RESUELTO**: `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts`, `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` inspeccionados | POST tiene auth; PUT/DELETE requieren admin. Pero NO hay unicidad ni sanitización. D-06 es necesaria. |
| **Configuración de Vercel** | **RESUELTO**: Inventario consultado (`.gobernanza/.governance/inventario_recursos.md`) | Plan Hobby sin rate limiting. D-08 (middleware) es necesaria. |
| **`.env` no inspeccionado** | Archivo sensible | Variables de entorno y secretos no verificables |
| **Cookie config no inspeccionada a fondo** | NextAuth config puede tener defaults no obvios | Flags de seguridad de cookies no confirmados explícitamente |
| **CSRF no verificado** | NextAuth Credentials puede o no tener CSRF | Vulnerabilidad CSRF posible pero no confirmada |

---

## 12. Bloqueos o límites del análisis

### Impacto en seguridad no determinado con suficiente fiabilidad

| Elemento | Estado | Qué evidencia faltó | Cómo condiciona la confianza |
|----------|--------|---------------------|-----------------------------|
| **Seguridad de APIs de creación** | **RESUELTO**: `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts`, `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` inspeccionados | — | POST tiene auth; PUT/DELETE requieren admin. Pero NO hay unicidad ni sanitización. Riesgos confirmados. |
| **Rate limiting** | **RESUELTO**: Inventario confirma Plan Hobby sin rate limiting | — | Confirmado: no existe. D-08 (middleware) es necesaria. |
| **HTTPS enforcement** | Configuración de plataforma no accesible | Vercel config | Si Vercel fuerza HTTPS, riesgo de traffic no encriptado es nulo |
| **Cookie security flags** | NextAuth defaults no inspeccionados a fondo | Código fuente de NextAuth o config explícita | Si defaults son seguros, riesgo de robo de session es menor |
| **CSRF protection** | NextAuth Credentials CSRF no verificado | Documentación de NextAuth o tests | Si CSRF está activo, riesgo de CSRF es menor |

### Evidencia que faltó

| Evidencia faltante | Estado | Cómo se mitigó |
|--------------------|--------|----------------|
| **APIs de creación** | **RESUELTO**: Inspeccionados. POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización | D-06 aborda: normalización trim + lowercase + unicidad |
| **Configuración de Vercel** | **RESUELTO**: Inventario consultado | Plan Hobby sin rate limiting. D-08 (middleware) necesaria. |
| **`.env`** | Archivo sensible | Se asume que secrets están protegidos; se recomienda auditar |
| **NextAuth cookie config** | Flags de seguridad de session | Se asume defaults; se recomienda verificar configuración |

### Cómo condiciona la confianza del análisis

1. **APIs de creación inspeccionadas**: POST de tags y categories tiene auth; PUT/DELETE requieren admin. Pero NO hay validación de unicidad ni sanitización. Los riesgos de creación de valores son confirmados, no estimados. D-06 (normalización trim + lowercase + unicidad) es necesaria.
2. **Vercel confirmado sin rate limiting**: Plan Hobby no tiene rate limiting. D-08 (middleware) es necesaria.
3. **Recomendaciones son conservadoras**: Se asume lo peor (sin protecciones adicionales); la situación real probablemente sea mejor.

**Mitigación**: Las recomendaciones de seguridad son conservadoras. Se recomienda verificar APIs de creación, configuración de Vercel y settings de NextAuth como primera acción antes de implementar cambios.

---

**Fin del documento**
