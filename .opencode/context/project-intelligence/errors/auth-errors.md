<!-- Context: project-intelligence/errors/auth-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Autenticación (NextAuth.js)

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
# Autenticación NextAuth.js

## 1. Error `MissingSecret` en Middleware

**Estado:** ✅ Validado  
**Código:** `middleware.ts`, `lib/auth.ts`  
**Descripción:** NextAuth.js requiere `AUTH_SECRET` para firmar tokens. La falta de esta variable causa `MissingSecret`.

**Prevención:**
- Verificar que `AUTH_SECRET` esté configurada en todos los entornos (desarrollo, staging, producción)
- Validar presencia de variable en tiempo de inicialización de la aplicación
- Usar validación Zod para variables críticas de autenticación

---

## 2. Redirecciones Incorrectas en Páginas de Autenticación

**Estado:** 🔧 Corregido  
**Código:** `middleware.ts` (líneas 14-22)  
**Descripción:** Error original causado por `MissingSecret`. Corregido al resolver la configuración.

**Prevención:**
- Probar middleware localmente con diferentes estados de sesión (autenticado/no autenticado)
- Verificar que redirecciones respeten la lógica "deny-all" como patrón por defecto
- Implementar logging para errores de autenticación (más allá de `console.log`)

---

## 3. Protección Insuficiente de Rutas (Middleware)

**Estado:** 🔧 Corregido  
**Código:** `middleware.ts` (líneas 8-22)  
**Descripción:** El middleware protege todas las rutas excepto `/auth/signin`, `/auth/signup`, `/auth/error`.

**Prevención:**
- Implementar siempre enfoque "deny-all" como patrón por defecto
- Documentar explícitamente las rutas públicas en el middleware
- Validar que nuevas rutas sean consideradas en la protección
- Mantener separación clara entre rutas públicas y privadas en estructura de archivos

---

## 4. Sidebar Visible en Páginas de Autenticación

**Estado:** 🔧 Corregido  
**Código:** `app/(auth)/layout.tsx`, `app/(app)/layout.tsx`  
**Descripción:** Layouts separados resuelven problema de UX.

**Prevención:**
- Usar layouts separados para áreas de autenticación vs aplicación
- Validar que componentes de UI (Sidebar, Topbar) no aparezcan en contextos inapropiados

---

## 5. Falta de Página de Administración de Usuarios

**Estado:** 🔧 Corregido (Fase C, 2026-08-06)  
**Código:** `app/api/users/`, `app/api/users/[id]/`  
**Descripción:** Backend implementado sin frontend correspondiente. **Resuelto por la Fase C (2026-08-06)**: pestaña "Usuarios" en el perfil del administrador (alta, edición, desactivar/reactivar con `isActive`, eliminación transaccional de prompts y usuario, protección del último administrador activo). Ver decisión #15 de `../lookup/decisions-log.md`.

**Prevención:**
- Planificar desarrollo frontend/backend en paralelo
- Validar que cada endpoint API tenga su correspondiente interfaz de usuario
- Documentar funcionalidades incompletas explícitamente

---

## 6. Falta de Página de Error de Autenticación

**Estado:** 🔧 Corregido (2026-08-06)  
**Código:** `lib/auth.ts` (línea 13), `app/(auth)/auth/error/`  
**Descripción:** NextAuth.js configura `error: "/auth/error"` pero la página no existía. **Resuelto (2026-08-06)**: página de error creada e internacionalizada en `app/(auth)/auth/error/`; los fallos de autenticación muestran la página propia.

**Prevención:**
- Crear páginas de error para todos los flujos posibles de autenticación
- Revisar que todas las páginas personalizadas de NextAuth.js existan
- Validar consistencia entre configuración e implementación

---

## 7. TypeError `(0 , ys.cache…)` en PROD tras envolver `auth()` con `cache()` de React

**Estado:** 🔧 Corregido (revertido)  
**Código:** `lib/auth.ts`  
**Descripción:** Envolver la exportación de `auth()` de NextAuth con `cache()` de React rompió TODAS las rutas en producción: 500 en Vercel con logs `TypeError: (0 , ys.cache…`. Causa: incompatibilidad del cache de React con la exportación de NextAuth en el bundle de producción (resolución de módulos). No se detectó en local ni en build.

**Prevención:**
- NO envolver `auth()` con React `cache()` en este proyecto
- Si se quiere deduplicar llamadas, validar primero con un deploy de preview antes de merge
- Ante 500 masivos con `ys.cache` en logs de Vercel: revertir a la exportación simple de `auth()` (como estaba)

**Cross-ref:** `nextjs-build-errors.md` §2 (force-dynamic para páginas que usan `auth()`)

---

## 8. NextAuth v5 JWT cachea `name`: cambiar nombre en BD no se refleja en sesión

**Estado:** ✅ Validado (Fase B, 2026-08-06)  
**Código:** `lib/auth.ts` · `app/api/user/profile/route.ts` · `components/auth/UserProfile.tsx`  
**Descripción:** Con estrategia JWT, el token cachea `token.name` en login. Si se actualiza el nombre del usuario en BD, la sesión del cliente sigue mostrando el antiguo hasta que el token se refresque. El endpoint de perfil devuelve el nuevo nombre, pero NextAuth v5 no re-lee la BD automáticamente.

**Solución:**
- El callback `jwt` ya contempla `trigger === "update"` (y ahora también `language`, `tokenVersion`) para reflejar cambios sin re-login.
- El cliente llama `useSession().update()` (next-auth/react) tras el PATCH de perfil para propagar la nueva sesión (`session.user.name`).
- No confiar en que `auth()` re-lea la BD: la estrategia JWT cachea hasta expiración o `update()`.

**Cross-ref:** §7 (no envolver `auth()` con `cache()`), `development/backend/concepts/auth-hardening-pattern.md` (tokenVersion)

---

# Prisma y Base de Datos
