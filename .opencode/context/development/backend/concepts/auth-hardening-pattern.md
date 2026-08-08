<!-- Context: development/backend/concepts | Priority: high | Version: 1.0 | Updated: 2026-08-06 -->

# Concept: Auth Hardening Pattern

**Core Idea**: Protección contra fuerza bruta y revocación de sesiones **sin dependencias externas** (no hay Upstash): límite de intentos basado en BD (campos en `User`) y revocación vía `tokenVersion` en el JWT. Las sesiones revocadas se detectan con una query ligera en el callback `jwt` con política **fail-open** (si la BD falla, la sesión sigue válida).

**Key Points**:
- **Campos en `User`**: `failedLoginAttempts Int @default(0)`, `lockoutUntil DateTime?`, `tokenVersion Int @default(0)`.
- **Rate limiting login** (`lib/auth.ts` `authorize`): si `lockoutUntil > now` → `null` (credenciales inválidas genérico, NO revelar bloqueo); fallo → incrementar contador, a 5 fallos → lockout 15 min; acierto → resetear contador y lockout.
- **Rate limiting contraseña** (`PATCH /api/user/password`): misma lógica de contador; si está bloqueado → 400 `accountLocked` (clave i18n, paridad en-GB/es-ES); acierto → resetear y proceder.
- **Revocación de sesiones**: al cambiar la contraseña se hace `tokenVersion: { increment: 1 }` → todos los JWT emitidos antes quedan revocados. En el callback `jwt`: en login se guarda `token.tokenVersion = user.tokenVersion`; en requests posteriores (sin `user`) se hace `findUnique` ligero (`select: { tokenVersion: true }`); si difiere → devolver token "revocado" (sin `id`/`role`/`language`) que fuerza re-login. Si la query falla → fail-open (devolver token como está).
- **Errores genéricos**: nunca revelar si el bloqueo está activo (`invalidCredentials`); `accountLocked` solo tras verificar credenciales en el endpoint de contraseña.

**Quick example** (`lib/auth.ts`):
```ts
// authorize()
if (isAccountLocked(user.lockoutUntil)) return null   // no revela bloqueo
if (!(await bcrypt.compare(password, user.password))) {
  await prisma.user.update({ where: { id: user.id },
    data: failedAttemptUpdate(user.failedLoginAttempts) }) // 5 → lockout 15min
  return null
}
// jwt callback: verificación de revocación (fail-open)
if (!user && token.tokenVersion !== undefined && token.id) {
  if (await isSessionRevoked(token.id, token.tokenVersion)) return {}  // revocado
}
```

**Reference**: `lib/auth.ts` · `app/api/user/password/route.ts` · `prisma/schema.prisma` · `types/next-auth.d.ts`

**Related**: `concepts/nextauth-setup.md` (config base) · `errors/api-common-errors.md` · `../../project-intelligence/lookup/decisions-log.md` #13 · `../../project-intelligence/lookup/living-notes.md` (debt resuelto)
