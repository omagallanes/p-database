# Documentación Oficial de NextAuth.js (vía Context7)

**Fecha de consulta:** 2026-04-18  
**Library ID:** `/nextauthjs/next-auth`  
**Trust Score:** 9.3/10  
**Total Snippets:** 911

---

## 1. Búsqueda de Librería

### Resultado de búsqueda
```json
{
  "id": "/nextauthjs/next-auth",
  "title": "NextAuth.js",
  "description": "Auth.js is a set of open-source packages for authentication in modern applications, offering flexibility, data ownership, and security features for any framework, platform, or JS runtime.",
  "branch": "main",
  "lastUpdateDate": "2026-04-13T18:24:07.517Z",
  "state": "finalized",
  "totalTokens": 193918,
  "totalSnippets": 911,
  "stars": 26709,
  "trustScore": 9.3,
  "benchmarkScore": 88.27
}
```

---

## 2. Prisma Adapter

### Instalación de dependencias

```bash
npm install @prisma/client @prisma/extension-accelerate @auth/prisma-adapter
npm install prisma --save-dev
```

O alternativamente:
```bash
npm install @prisma/client @auth/prisma-adapter
npm install prisma --save-dev
npx prisma init
```

### Configuración básica

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [],
})
```

### Configuración con GitHub Provider

```typescript
// auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GitHub from "next-auth/providers/github"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub]
})
```

### Requisitos del Schema Prisma

El Prisma Adapter requiere definir los siguientes modelos en el schema:
- **User**: Modelo de usuario
- **Account**: Cuentas de proveedores OAuth
- **Session**: Sesiones de usuario
- **VerificationToken**: Tokens de verificación

Estos modelos establecen las relaciones necesarias para la gestión de sesiones y la integración con proveedores OAuth.

---

## 3. Credentials Provider

### Configuración básica con authorize function

```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ request }) {
        const response = await fetch(request)
        if (!response.ok) return null
        return (await response.json()) ?? null
      },
    }),
  ],
})
```

### Configuración con Email y Password

```typescript
Credentials({
  credentials: {
    email: {
      type: "email",
      label: "Email",
      placeholder: "johndoe@gmail.com",
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "*****",
    },
  },
})
```

### Configuración completa con validación

```typescript
// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword } from "@/utils/password"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const pwHash = saltAndHashPassword(credentials.password)
        const user = await getUserFromDb(credentials.email, pwHash)

        if (!user) {
          throw new Error("Invalid credentials.")
        }
        return user
      }
    })
  ]
})
```

### Pasos para configurar el Credentials Provider

1. Importar el provider
2. Agregarlo al array `providers` en la configuración de Auth.js
3. Definir los campos `credentials` y la función `authorize`

### Propósito del Credentials Provider

El `Credentials Provider` está diseñado para reenviar cualquier credencial insertada en el formulario de inicio de sesión (es decir, nombre de usuario/contraseña, pero no limitado a esto) a su servicio de autenticación. Es ideal para implementar lógica de inicio de sesión personalizada basada en valores de entrada de formulario.

---

## 4. Database Session Strategy

### Concepto

Alternativamente a una estrategia de sesión JWT, Auth.js también soporta sesiones de base de datos. En este caso, en lugar de guardar un JWT con datos de usuario después de iniciar sesión, Auth.js creará una sesión en su base de datos. Un ID de sesión se guarda en una cookie `HttpOnly`. Esto es similar a la estrategia de sesión JWT, pero en lugar de guardar los datos del usuario en la cookie, solo almacena un valor oscuro que apunta a la sesión en la base de datos.

### Características

- Solo se persiste el token de sesión, referencia de usuario y tiempo de expiración del lado del servidor
- Cuando un usuario cierra sesión, la sesión se elimina de la base de datos y el ID de sesión se elimina de las cookies
- Cada vez que se intenta acceder a la sesión de usuario, se consulta la base de datos para obtener los datos

### Agregar User ID a la sesión (Database Strategy)

```typescript
callbacks: {
  session({ session, user }) {
    session.user.id = user.id
    return session
  }
}
```

### Configuración completa con PrismaAdapter

```typescript
// auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [...],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    }
  }
})
```

### Diferencias clave con JWT Strategy

- Con database strategy, el objeto `user` representa los datos del usuario almacenados en la base de datos
- No se involucra un token JWT de la misma manera
- El objeto de sesión en sí no se persiste del lado del servidor, solo los datos principales (token de sesión/ID, usuario y tiempo de expiración)
- Para persistir datos adicionales de sesión del lado del servidor, deben guardarse independientemente

---

## 5. Next.js 14 App Router Integration

### Configuración principal (auth.ts)

```typescript
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
})
```

### Crear ruta API para handlers

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

### Proxy opcional para gestión de sesión

```typescript
export { auth as proxy } from "@/auth"
```

### Botón de Sign In con Server Action

```typescript
import { signIn } from "@/auth"

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn()
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  )
}
```

### Protección de Server Components

```tsx
import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
```

### Obtener datos de sesión en el lado del servidor

```tsx
// app/page.tsx (Next.js App Router)
import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <img src={session.user.image} alt="Avatar" />
      <p>Welcome, {session.user.name}!</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
```

### Pasos para la integración con App Router

1. Crear el archivo de configuración principal `auth.ts`
2. Definir los handlers de ruta API para autenticación
3. Configurar un proxy opcional para gestión de sesión
4. Usar `auth()` en Server Components para obtener la sesión
5. Usar `signIn()` y `signOut()` en Server Actions para autenticación

---

## Referencias

- **Documentación oficial:** https://authjs.dev
- **Repositorio GitHub:** https://github.com/nextauthjs/next-auth
- **Context7 API:** https://context7.com

---

## Notas Importantes

1. **PrismaAdapter**: Requiere modelos específicos en el schema de Prisma (User, Account, Session, VerificationToken)
2. **Credentials Provider**: No usa OAuth, requiere implementación personalizada de validación
3. **Database Session Strategy**: Más seguro que JWT ya que los datos del usuario no se almacenan en la cookie
4. **Next.js 14 App Router**: Usa Server Components y Server Actions para autenticación
5. **Extensión de sesión**: Con database strategy, se accede directamente al objeto `user` en el callback

---

**Documentación generada automáticamente vía Context7 API**
