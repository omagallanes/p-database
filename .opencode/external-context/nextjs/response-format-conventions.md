---
source: Next.js Official Documentation
library: Next.js
package: next
topic: Response Format Conventions
fetched: 2026-07-14T12:00:00Z
official_docs: https://nextjs.org/docs/app/api-reference/file-conventions/route
---

# Next.js App Router — Response Format Conventions

## ¿Hay guía oficial de Next.js sobre formato de respuestas JSON?

**No.** Next.js no tiene una guía oficial que prescriba un formato específico para respuestas JSON en Route Handlers. La documentación muestra ejemplos con respuestas directas sin ningún tipo de envelope estandarizado.

Los patrones que aparecen en la documentación son:

```ts
// Respuesta simple
return Response.json({ message: 'Hello World' })

// Respuesta con error y status
return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })

// Respuesta con datos dinámicos
return Response.json({ res })

// Respuesta con datos de array
return Response.json(posts)
```

## Diferencias App Router vs Pages Router

### Pages Router (API Routes)

```ts
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello World' })
}
```

- Usa `req`/`res` de Node.js (NextApiRequest/NextApiResponse)
- Método `.status().json()` encadenado
- Export default function handler

### App Router (Route Handlers)

```ts
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

- Usa Web API estándar (`Request`/`Response`)
- Export named functions por método HTTP (`GET`, `POST`, etc.)
- Return explícito en lugar de `res.json()`
- No necesita `bodyParser` config

### Cambios clave de migración

| Concepto | Pages Router | App Router |
|----------|-------------|------------|
| Data fetching | `getServerSideProps` / `getStaticProps` | `fetch()` en Server Components |
| Routing hooks | `useRouter` de `next/router` | `useRouter` de `next/navigation` |
| Layout | `_app.js` / `_document.js` | `layout.js` en cada segmento |
| Metadata | `next/head` | `export const metadata` |
| 404 | `pages/404.js` | `not-found.js` |
| Error | `_error.js` | `error.js` |

## Conclusión

No hay un formato de respuesta oficialmente recomendado más que usar el estándar Web API. La decisión de usar envelope o no es del desarrollador.
