---
source: Next.js Official Documentation
library: Next.js
package: next
topic: Route Handlers (API Routes)
fetched: 2026-07-14T12:00:00Z
official_docs: https://nextjs.org/docs/app/api-reference/file-conventions/route
---

# Next.js App Router — Route Handlers

## Recommended Response Pattern

Route Handlers use the standard Web `Request` and `Response` APIs. The canonical example is:

```ts
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

### `Response.json()` vs `NextResponse.json()`

- **`Response.json()`** (standard Web API) — used as the primary example throughout the docs. Preferred for simple JSON responses.
- **`NextResponse.json()`** — extension with additional convenience methods (cookie manipulation, redirects, rewrites). Useful when you need those features.

```ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

**Veredicto:** `Response.json()` es el estándar y el que aparece como ejemplo principal. `NextResponse.json()` solo es necesario si usas cookies/redirects/rewrites.

## Response Format (Envelope)

**No hay un formato de envelope requerido.** Los ejemplos muestran respuestas directas sin wrapper:

```ts
return Response.json({ message: 'Hello World' })
return Response.json({ error: 'Internal Server Error' }, { status: 500 })
return Response.json({ res }) // POST response body
```

No se menciona ni prescribe un patrón `{ data }` o cualquier otro envelope.

## Parámetro `request: NextRequest` en GET

**Sí, se puede omitir completamente** si no se usa:

```ts
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

El primer ejemplo de la documentación oficial no recibe ningún parámetro.

## Status Code para PUT

La documentación no prescribe un status code específico para PUT. Los Route Handlers soportan: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`. El status code se define explícitamente en el init object de `Response`.

## HTTP Methods Soportados

```ts
export async function GET(request: Request) {}
export async function HEAD(request: Request) {}
export async function POST(request: Request) {}
export async function PUT(request: Request) {}
export async function DELETE(request: Request) {}
export async function PATCH(request: Request) {}
// OPTIONS se implementa automáticamente si no se define
export async function OPTIONS(request: Request) {}
```

## Dynamic Route Params (v15+)

`params` es una **Promise** (desde v15.0.0-RC):

```ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
}
```

## CORS

Se configura con headers estándar en el Response:

```ts
return new Response('Hello', {
  status: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
})
```

## Diferencia con Pages Router (API Routes)

| Aspecto | Pages Router (`pages/api`) | App Router (`route.ts`) |
|---------|---------------------------|------------------------|
| API | `req, res` (Node.js) | `request: Request` (Web API) |
| Response | `res.status(200).json({})` | `return Response.json({})` |
| Body parsing | `bodyParser` config | `request.json()` (Web API) |
| Caching GET | No cache por defecto | No cache por defecto (v15+) |
