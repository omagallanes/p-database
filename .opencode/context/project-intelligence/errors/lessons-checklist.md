<!-- Context: project-intelligence/errors/lessons-checklist | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Lecciones Generales y Checklist de Prevención

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Validación de Configuración

**Estado:** ✅ Validado  
**Descripción:** El código muestra uso de variables de entorno para configuración flexible, pero no hay validación automática.

**Prevención:**
- Validar todas las variables de entorno requeridas antes del despliegue
- Verificar formato de URLs (postgresql://, https://)
- Crear backup de archivos críticos (.env, package.json) antes de modificaciones

---

## 2. Desarrollo Balanceado

**Estado:** ✅ Validado  
**Descripción:** Backend implementado sin frontend correspondiente crea funcionalidad incompleta.

**Prevención:**
- Planificar desarrollo frontend/backend en paralelo
- Validar que cada endpoint API tenga su correspondiente interfaz de usuario
- Documentar funcionalidades incompletas explícitamente

---

## 3. Pruebas de Flujos Críticos

**Estado:** ✅ Validado  
**Descripción:** Existen tests para API y componentes, pero no se verifica cobertura completa.

**Prevención:**
- Implementar pruebas end-to-end para flujos críticos (autenticación, CRUD)
- Validar cobertura de tests para código sensible
- Automatizar pruebas en pipeline de CI/CD

---

## 4. Middleware Sensible

**Estado:** ✅ Validado  
**Descripción:** Middleware actual maneja autenticación correctamente, con logs limitados.

**Prevención:**
- Implementar logging estructurado en middleware
- Validar que middleware maneje correctamente todos los casos de error
- Documentar decisiones de diseño del middleware

---

## 5. Cache y Dependencias en Plataformas Cloud

**Estado:** ✅ Validado  
**Descripción:** Script postinstall mitiga cache de Vercel.

**Prevención:**
- Incluir scripts postinstall para regenerar dependencias sensibles
- Considerar cache de build en diferentes plataformas cloud
- Validar que dependencias estén actualizadas en producción

---

## 6. Configuración Explícita vs Implícita

**Estado:** ✅ Validado  
**Descripción:** Configuración explícita de seed presente en package.json.

**Prevención:**
- Preferir configuración explícita sobre implícita
- Documentar todas las configuraciones requeridas
- Validar que configuraciones estén presentes en todos los entornos

---

## 7. Relación de Categorías Recursiva

**Estado:** 📝 Información adicional  
**Código:** `prisma/schema.prisma:107-108` (parent/children relation)  
**Descripción:** Modelo `Category` tiene relación consigo mismo (`parent`, `children`) para árboles de categorías.

**Relevancia preventiva:**
- Considerar relaciones recursivas en diseño de esquema
- Documentar estructuras de datos complejas
- Validar que UI soporte relaciones recursivas

---

# Checklist de Prevención

### Configuración y Variables
- [ ] Validar todas las variables de entorno requeridas antes del despliegue
- [ ] Verificar formato de URLs (postgresql://, https://)
- [ ] Crear backup de archivos críticos (.env, package.json) antes de modificaciones

### Prisma y Base de Datos
- [ ] Usar `@@id([campo1, campo2])` para junction tables N:M
- [ ] Envolver updates de múltiples relaciones en `$transaction`
- [ ] Delete todas las relaciones antes de crear nuevas
- [ ] Incluir TODAS las junction tables en la transacción
- [ ] Usar `upsert` para crear/obtener entidades (evita errores unique constraint)
- [ ] Normalizar nombres (trim + uppercase) antes de upsert
- [ ] Campos nullable en TypeScript: `Type | null`
- [ ] Null coalescing (`??`) para campos no nullable con datos externos
- [ ] Switch statement en lugar de `as any` para acceso dinámico a Prisma
- [ ] Usar `prisma db push` en entornos no interactivos
- [ ] `prisma migrate deploy` en producción (no `migrate dev`)
- [ ] Script `postinstall: "prisma generate"` en package.json
- [ ] Configurar seed de Prisma explícitamente
- [ ] Validar conexión a BD antes de migraciones

### Autenticación y Seguridad
- [ ] Auth check como PRIMERA operación en handlers
- [ ] Filtrar queries por `userId` en endpoints multi-usuario
- [ ] Probar middleware con diferentes estados de sesión
- [ ] Implementar logging para errores de autenticación
- [ ] Crear páginas de error para todos los flujos de auth
- [ ] Revisar que todas las custom pages de NextAuth.js existan
- [ ] Protección de rutas con enfoque "deny-all"

### Desarrollo de APIs
- [ ] Incluir campos legacy como opcionales durante transición de schema
- [ ] Transformar relaciones N:M a arrays de nombres en export
- [ ] Zod validation estricta en cada endpoint
- [ ] Mantener compatibilidad dual entre formatos legacy y N:M
- [ ] Verificar consistencia de basePath entre entornos

### Testing
- [ ] Ejecutar `npm test` antes de añadir tests nuevos
- [ ] Documentar tests fallidos pre-existentes
- [ ] Mock de $transaction debe ejecutar fn(mockTx)
- [ ] Incluir TODOS los campos requeridos en datos de test
- [ ] Mock de URLSearchParams: reemplazar global.URLSearchParams, no jest.mock
- [ ] Mock de upsert con estructura completa (id, name, slug)
- [ ] Mock de relaciones N:M con arrays anidados completos

### UI y Filtros
- [ ] ToggleFilter genérico con params.append/getAll para arrays en URL
- [ ] Lógica OR con `some` (cambiar a `every` si se necesita AND)
- [ ] Parseo de searchParams: `Array.isArray(x) ? x : x ? [x] : []`
- [ ] Serializar fechas a ISO string antes de pasar a componentes cliente
- [ ] Router.push() para create, router.refresh() para edit
- [ ] ViewToggle con useTransition y fallback "cards"

---
