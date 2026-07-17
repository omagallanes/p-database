# Wizard `/add-context` — Actualizar contexto de OAC

> Generado el 2026-07-16 durante sesión de actualización de Project Intelligence.
> Comando: `/add-context` (Opción 2: Añadir nuevos patrones)

---

## Contexto existente detectado

```
Directorio: .opencode/context/project-intelligence/

Archivos encontrados:
  ✓ technical-domain.md  (Versión: 2.1, Actualizado: 2026-07-14)
  ✓ business-domain.md
  ✓ business-tech-bridge.md
  ✓ decisions-log.md
  ✓ living-notes.md
  ✓ navigation.md
  ✓ lookup/
```

### Patrones actuales detectados

| Aspecto | Valor actual |
|---|---|
| **📦 Tech Stack** | Next.js 14 + TypeScript 5.5 + PostgreSQL 14 + Prisma 5.19 + TailwindCSS/shadcn/ui |
| **🔐 Auth** | NextAuth.js v5 (JWT) + Credentials + bcryptjs |
| **🔧 API Pattern** | App Router → `auth()` → `Zod.parse` → `prisma.create` → Response |
| **🎨 Component Pattern** | Server Components por defecto, `"use client"` solo cuando hay interactividad |
| **📝 Naming** | kebab-case archivos, PascalCase componentes, camelCase funciones |
| **✅ Standards** | TypeScript strict, Zod validation, Prisma only, Server Components default |
| **🔒 Security** | Auth en todas las rutas API, validación Zod, consultas parametrizadas Prisma |

---

## Opciones presentadas

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opciones:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Revisar y actualizar patrones (mostrar cada uno)
  2. Añadir nuevos patrones (mantener todos los existentes)  ← SELECCIONADA
  3. Reemplazar todos los patrones (empezar de nuevo)
  4. Cancelar
```

---

## Wizard de 6 preguntas

### Pregunta 1 de 6: Tech Stack

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q 1/6: Tech Stack
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTUAL (ya registrado):
  Framework:  Next.js 14 (App Router)
  Language:   TypeScript 5.5 (strict mode)
  Database:   PostgreSQL 14
  ORM:        Prisma 5.19
  Styling:    TailwindCSS 3.4 + shadcn/ui
  Auth:       NextAuth.js v5 beta
  Validation: Zod 3.23
  Testing:    Jest 29.7 + React Testing Library
  Deploy:     Vercel
  Runtime:    Node.js 20+

¿Deseas añadir algo nuevo o actualizar alguna tecnología?
  (Ej: nueva librería, cambio de versión, nueva herramienta)

  Escribe tu respuesta o "skip" para saltar: _
```

### Pregunta 2 de 6: API Pattern

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q 2/6: API Pattern
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTUAL (ya registrado):
  auth() → Zod.parse → prisma.create → Response JSON
  try/catch con { data } o { error }

¿Deseas añadir otro patrón API o modificar el existente?
  (Ej: nuevos endpoints, nuevos patrones de respuesta)

  Escribe tu respuesta o "skip" para saltar: _
```

### Pregunta 3 de 6: Component Pattern

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q 3/6: Component Pattern
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTUAL (ya registrado):
  Server Components por defecto
  "use client" solo cuando hay interactividad
  Props tipadas con interface {Name}Props

¿Deseas añadir otro patrón de componente?
  (Ej: nuevos patrones de composición, layout, providers)

  Escribe tu respuesta o "skip" para saltar: _
```

### Pregunta 4 de 6: Naming Conventions

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q 4/6: Naming Conventions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTUAL (ya registrado):
  Files:          kebab-case
  Components:     PascalCase
  Functions:      camelCase
  Constants:      UPPER_SNAKE_CASE
  Types/Interfaces: PascalCase + Props suffix
  CSS:            Tailwind utility classes
  DB Models:      PascalCase

¿Deseas añadir alguna convención adicional?
  (Ej: nombres de carpetas, rutas, archivos de test)

  Escribe tu respuesta o "skip" para saltar: _
```

### Pregunta 5 de 6: Code Standards

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q 5/6: Code Standards
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTUAL (ya registrado):
  ✓ TypeScript strict: true
  ✓ Zod validation en toda entrada API
  ✓ Prisma only para base de datos
  ✓ Server Components por defecto
  ✓ Código en inglés, docs en español
  ✓ try/catch con { data } o { error }
  ✓ Funciones puras preferidas
  ✓ Relaciones N:M con tablas intermedias
  ✓ Auth vía NextAuth.js middleware
  ✓ Migraciones solo con Prisma

¿Deseas añadir algún estándar adicional?
  (Ej: formato de imports, organización de carpetas, linting)

  Escribe tu respuesta o "skip" para saltar: _
```

### Pregunta 6 de 6: Security Requirements

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q 6/6: Security Requirements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTUAL (ya registrado):
  ✓ Auth en todas las rutas API
  ✓ Validación Zod en cada endpoint
  ✓ Consultas parametrizadas via Prisma
  ✓ AUTH_SECRET requerido
  ✓ Variables de entorno validadas
  ✓ Sin secretos en control de versiones
  ✓ Rate limiting planificado
  ✓ Protección CORS via Next.js
  ✓ Password hashing con bcryptjs

¿Deseas añadir algún requisito de seguridad adicional?
  (Ej: CSRF, headers de seguridad, auditoría)

  Escribe tu respuesta o "skip" para saltar: _
```

---

## Instrucciones de uso

1. Responde cada pregunta con la información que desees añadir
2. Escribe "skip" para saltar una pregunta y mantener lo existente
3. Al finalizar, se generará el `technical-domain.md` actualizado
4. Se actualizará el `navigation.md` si es necesario
5. Se validará el resultado con MVI compliance (<200 líneas, frontmatter HTML, codebase refs)
