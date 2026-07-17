---
source: Jest Official Documentation
library: Jest
package: jest
topic: Mocking Patterns
fetched: 2026-07-14T12:00:00Z
official_docs: https://jestjs.io/docs/mock-function-api
---

# Jest — Mocking Patterns (v30.4)

## Mock Functions API

### `jest.fn(implementation?)`

Crea una mock function. Si no se da implementación, retorna `undefined` por defecto.

```ts
import { jest } from '@jest/globals'

const mockFn = jest.fn()
mockFn() // undefined
```

### Valores de retorno por defecto

```ts
const mockFn = jest.fn(() => 42)
mockFn() // 42

// O usando mockReturnValue
const mockFn = jest.fn().mockReturnValue(42)
mockFn() // 42
```

## Diferencias clave

| Método | Equivalente | Uso |
|--------|------------|-----|
| `mockReturnValue(value)` | `jest.fn().mockImplementation(() => value)` | Síncrono |
| `mockResolvedValue(value)` | `jest.fn().mockImplementation(() => Promise.resolve(value))` | Async (Promise resuelta) |
| `mockRejectedValue(value)` | `jest.fn().mockImplementation(() => Promise.reject(value))` | Async (Promise rechazada) |
| `mockImplementation(fn)` | Control total sobre implementación | Ambos |

### mockResolvedValue — Para funciones async

```ts
const asyncMock = jest.fn().mockResolvedValue(43)
await asyncMock() // 43
```

### mockReturnValue — Para funciones síncronas

```ts
const mock = jest.fn().mockReturnValue(42)
mock() // 42
```

### mockImplementation — Control total

```ts
const mockFn = jest.fn(scalar => 42 + scalar)
mockFn(0) // 42

// También para mockear clases
const mockMethod = jest.fn()
SomeClass.mockImplementation(() => {
  return { method: mockMethod }
})
```

## Mockear `prisma.$transaction()`

Para mockear `prisma.$transaction()`, se usa `jest.fn()` con `mockImplementation()` o `mockResolvedValue()`:

```ts
import { PrismaClient } from '@prisma/client'

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $transaction: jest.fn(),
    // otros métodos
  })),
}))

// En el test:
const mockTransaction = jest.fn().mockImplementation(async (cb) => {
  return cb({
    user: { create: jest.fn().mockResolvedValue({ id: '1', name: 'Test' }) },
  })
})
```

### Variantes según el uso de $transaction:

| Patrón | Mock |
|--------|------|
| `prisma.$transaction([...])` (array de queries) | `mockResolvedValue([result1, result2])` |
| `prisma.$transaction(callback)` (interactive) | `mockImplementation(cb => cb(txPrisma))` |
| `prisma.$transaction([...], { isolationLevel })` | `mockImplementation(async (queries, opts) => [...] )` |

## TypeScript Usage

```ts
import { expect, jest, test } from '@jest/globals'

// Tipado con typeof
const mockAdd = jest.fn<typeof add>()

// jest.Mocked<Source>
const mockedFetch: jest.Mocked<typeof fetch> = jest.fn()

// jest.mocked()
const mockedSong = jest.mocked(song)
mockedSong.one.more.time.mockReturnValue(12)
```

## Métodos útiles

| Método | Descripción |
|--------|-------------|
| `mockClear()` | Limpia calls/instances/results |
| `mockReset()` | Como clear + resetea implementación a undefined |
| `mockRestore()` | Como reset + restaura implementación original (solo con spyOn) |
| `mockReturnValueOnce(value)` | Retorna value solo para la próxima llamada |
| `mockResolvedValueOnce(value)` | Retorna Promise resuelta solo para la próxima llamada |
