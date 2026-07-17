# Documento de Correcciones por Sprints — Errores de Autenticación

**Fecha**: 2026-04-25  
**Estado**: ✅ CORREGIDO  
**URL Producción**: https://prompt-database-liard.vercel.app  
**Severidad**: CRÍTICA

---

## Resumen Ejecutivo

### Problema Reportado
- **Error**: "Bad request" después de ingresar credenciales
- **Síntoma**: Login no funcionaba, acceso a datos sin seguridad
- **Causa raíz**: Modificaciones incorrectas en `lib/auth.ts` y `middleware.ts`

### Solución Aplicada
- Revertir `lib/auth.ts` a versión original (HEAD)
- Revertir `middleware.ts` a versión original (HEAD)
- Redesplegar a producción

### Estado Actual
| Endpoint | Estado | Resultado |
|----------|--------|-----------|
| `/auth/signin` | ✅ Funcional | HTTP 200 |
| `/prompts` (sin auth) | ✅ Protegido | 307 → `/auth/signin` |
| Login con credenciales | ✅ Funcional | Sesión creada |

---

## Errores Introducidos (2026-04-25)

### Error 1: `lib/auth.ts` — basePath Incorrecto

**Archivo**: `lib/auth.ts`  
**Línea**: 61  
**Cambio incorrecto**:
```typescript
basePath: process.env.AUTH_URL ? new URL(process.env.AUTH_URL).pathname : "/auth",
```

**Problema**:
- NextAuth.js v5 usa `/api/auth` como basePath por defecto
- AUTH_URL es la URL de la app (`https://prompt-database-liard.vercel.app`), no el basePath
- Al extraer el pathname de AUTH_URL, se obtiene `/` (vacío)
- Esto rompe las rutas de autenticación: `/api/auth/[...nextauth]` → `//api/auth/[...nextauth]`

**Consecuencia**:
- Error "Bad request" al enviar credenciales
- NextAuth no puede procesar el callback de autenticación
- CSRF token validation falla

**Fuente de verdad**: `git show HEAD:lib/auth.ts` — NO tenía basePath

---

### Error 2: `middleware.ts` — Rutas Públicas Extra

**Archivo**: `middleware.ts`  
**Líneas**: 9-15  
**Cambio incorrecto**:
```typescript
const isPublicRoute =
  pathname === "/" ||
  pathname.startsWith("/auth/signin") ||
  pathname.startsWith("/auth/signup") ||
  pathname.startsWith("/auth/error") ||
  pathname.startsWith("/_next") ||
  pathname === "/favicon.ico"
```

**Problema**:
- Añadidas rutas públicas innecesarias (`/`, `/_next`, `/favicon.ico`)
- El middleware original ya excluía `/_next` y `/favicon.ico` en `config.matcher`
- Añadir `/` como pública permite acceso sin autenticación a la home

**Consecuencia**:
- `/prompts` redirigía a `/auth/signin` pero luego permitía acceso
- Inconsistencia en protección de rutas

**Fuente de verdad**: `git show HEAD:middleware.ts` — Solo 3 rutas públicas

---

### Error 3: `middleware.ts` — Lógica de Redirección

**Archivo**: `middleware.ts`  
**Líneas**: 24-26  
**Cambio incorrecto**:
```typescript
if (isLoggedIn && (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))) {
  return NextResponse.redirect(new URL("/prompts", req.nextUrl))
}
```

**Problema**:
- Original redirigía a `/` (home), no a `/prompts`
- Usuario autenticado en `/auth/signin` era redirigido incorrectamente

**Fuente de verdad**: `git show HEAD:middleware.ts:20-22`
```typescript
if (isLoggedIn && isPublicRoute) {
  return NextResponse.redirect(new URL("/", req.nextUrl))
}
```

---

## Correcciones Aplicadas

### Corrección 1: Revertir `lib/auth.ts`

**Acción**: Eliminar línea 61 (basePath incorrecto)

**Archivo corregido**:
```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await prisma.user.findUnique({ where: { email } })
          
          if (!user || !user.password) return null
          
          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
        }

        console.log("Invalid credentials")
        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    }
  },
  events: {
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`)
    }
  }
  // ✅ SIN basePath — NextAuth usa /api/auth por defecto
})
```

---

### Corrección 2: Revertir `middleware.ts`

**Acción**: Restaurar versión original de HEAD

**Archivo corregido**:
```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Rutas públicas (siempre accesibles sin autenticación)
  const isPublicRoute =
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup") ||
    pathname.startsWith("/auth/error")

  // Si no está autenticado y no es ruta pública → redirigir a signin
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl))
  }

  // Si está autenticado y visita ruta pública → redirigir a home
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
```

---

## Validación Post-Corrección

### Tests Ejecutados

| Test | Comando | Resultado Esperado | Resultado Real |
|------|---------|-------------------|----------------|
| Signin accesible | `curl -s -o /dev/null -w "%{http_code}" /auth/signin` | 200 | ✅ 200 |
| Prompts protegido | `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" /prompts` | 307 → /auth/signin | ✅ 307 |
| Build exitoso | `npm run build` | Sin errores | ✅ Completado |
| Deploy exitoso | `vercel --prod --yes` | Sin errores | ✅ Completado |

### Funcionalidades Validadas

| Funcionalidad | Estado | Notas |
|---------------|--------|-------|
| Página `/auth/signin` | ✅ Funcional | Formulario visible |
| Login con credenciales | ✅ Funcional | Credenciales: admin@example.com / Admin123! |
| Logout desde Topbar | ✅ Funcional | Destruye sesión |
| Protección `/prompts` | ✅ Funcional | Redirige a login sin sesión |
| Acceso `/prompts` con sesión | ✅ Funcional | HTTP 200 |
| Guardado de prompts | ✅ Funcional | Sin error 401 |

---

## Lecciones Aprendidas

### 1. No Modificar Configuración que Funciona

**Regla**: Si un componente funciona correctamente, NO modificarlo sin:
1. Leer documentación oficial
2. Consultar inventario de errores conocidos
3. Probar en entorno de desarrollo
4. Validar con tests existentes

**Violación**: Se añadió `basePath` sin consultar documentación de NextAuth.js v5

---

### 2. Usar Git como Fuente de Verdad

**Regla**: Antes de "corregir" algo, verificar qué había antes:
```bash
git show HEAD:<archivo>
git diff HEAD <archivo>
git log --oneline -10 <archivo>
```

**Violación**: No se verificó el estado original de `lib/auth.ts` y `middleware.ts`

---

### 3. Consultar Conocimiento Técnico Preventivo

**Regla**: Leer `.gobernanza/.governance/conocimiento_tecnico_preventivo.md` ANTES de modificar autenticación

**Sección relevante**: §1.1 Error `MissingSecret` en Middleware
> NextAuth.js requiere `AUTH_SECRET` para firmar tokens. La falta de esta variable causa `MissingSecret`.

**Violación**: No se consultó el documento antes de modificar

---

### 4. Probar Flujos Críticos Después de Cada Cambio

**Regla**: Después de cualquier cambio en autenticación:
1. Probar login manual
2. Probar logout manual
3. Probar protección de rutas
4. Probar guardado de datos con sesión

**Violación**: Se desplegó sin probar el flujo completo

---

## Checklist de Prevención (Actualizado)

### Antes de Modificar Autenticación

- [ ] Leer `conocimiento_tecnico_preventivo.md` sección 1 (Errores de Autenticación)
- [ ] Verificar estado original con `git show HEAD:<archivo>`
- [ ] Consultar documentación oficial de NextAuth.js v5
- [ ] Probar en desarrollo local
- [ ] Ejecutar tests de autenticación: `npm test -- auth.test`
- [ ] Validar flujo completo: login → acceso → logout → protección

### Después de Modificar Autenticación

- [ ] Build exitoso: `npm run build`
- [ ] Deploy a producción: `vercel --prod --yes`
- [ ] Probar signin accesible: HTTP 200
- [ ] Probar rutas protegidas: 307 a login
- [ ] Probar login con credenciales reales
- [ ] Probar logout destruye sesión
- [ ] Probar guardado de datos sin error 401

---

## Referencias Cruzadas

### Documentos Consultados

| Documento | Ubicación | Estado |
|-----------|-----------|--------|
| Inventario de Recursos | `.gobernanza/.governance/inventario_recursos.md` | ✅ Leído |
| Conocimiento Técnico Preventivo | `.gobernanza/.governance/conocimiento_tecnico_preventivo.md` | ✅ Leído |
| Plan de Fases | `doc-plan/doc-base/04-Phases-Subphases-Plan.md` | ✅ Leído |

### Archivos Modificados

| Archivo | Acción | Commit Original |
|---------|--------|-----------------|
| `lib/auth.ts` | Revertido a HEAD | 43a0b62 (Fin F3-SF3.2) |
| `middleware.ts` | Revertido a HEAD | 43a0b62 (Fin F3-SF3.2) |

### Variables de Entorno Requeridas

| Variable | Ubicación | Estado |
|----------|-----------|--------|
| `DATABASE_URL` | Vercel Production | ✅ Configurada |
| `AUTH_SECRET` | Vercel Production | ✅ Configurada |
| `AUTH_URL` | Vercel Production | ✅ Configurada |

---

## Historial de Correcciones

| Fecha/Hora | Acción | Responsable | Resultado |
|------------|--------|-------------|-----------|
| 2026-04-25 08:00 | Identificado error basePath | Orquestador | Causa raíz encontrada |
| 2026-04-25 08:15 | Revertido lib/auth.ts | Orquestador | basePath eliminado |
| 2026-04-25 08:15 | Revertido middleware.ts | Orquestador | Lógica original restaurada |
| 2026-04-25 08:30 | Build local | Orquestador | ✅ Exitoso |
| 2026-04-25 08:35 | Deploy a Vercel | Orquestador | ✅ Completado |
| 2026-04-25 08:40 | Validación funcional | Orquestador | ✅ Login funciona |

---

## Estado Final

**Producción**: https://prompt-database-liard.vercel.app

| Componente | Estado | Validación |
|------------|--------|------------|
| Autenticación | ✅ Funcional | Login/Logout working |
| Middleware | ✅ Funcional | Rutas protegidas |
| Base de Datos | ✅ Funcional | 17 modelos en Neon |
| Variables Entorno | ✅ Configuradas | DATABASE_URL, AUTH_SECRET, AUTH_URL |

---

**Documento creado**: 2026-04-25 08:45  
**Última actualización**: 2026-04-25 08:45  
**Estado**: ✅ CERRADO — Autenticación restaurada correctamente
