---
source: TypeScript Official Handbook
library: TypeScript
package: typescript
topic: Type Guards and Type Predicates
fetched: 2026-07-14T12:00:00Z
official_docs: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
---

# TypeScript — Type Guards / Type Predicates / Narrowing

## Type Predicates (User-Defined Type Guards)

Patrón recomendado: `parameterName is Type` como return type de una función.

```ts
type Fish = { swim: () => void }
type Bird = { fly: () => void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

// Uso: TypeScript narrows el tipo automáticamente
const pet = getSmallPet()
if (isFish(pet)) {
  pet.swim() // pet: Fish
} else {
  pet.fly() // pet: Bird
}
```

### Uso con `Array.filter()`

```ts
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet()]
const underWater: Fish[] = zoo.filter(isFish)
// También con lambda si necesitas lógica extra:
const underWater2: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === 'sharkey') return false
  return isFish(pet)
})
```

## Typeof Type Guards

**Para tipos primitivos.** Retorna: `"string"`, `"number"`, `"bigint"`, `"boolean"`, `"symbol"`, `"undefined"`, `"object"`, `"function"`.

```ts
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input  // padding: number
  }
  return padding + input  // padding: string
}
```

**⚠️ Atención:** `typeof null === "object"` — esto es un error histórico de JS. Siempre verifica null explícitamente.

```ts
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    // strs: string[] (null eliminado por truthiness check)
    for (const s of strs) { console.log(s) }
  }
}
```

## Instanceof Narrowing

**Para instancias de clases.** Verifica el prototype chain.

```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString())  // x: Date
  } else {
    console.log(x.toUpperCase())  // x: string
  }
}
```

## In Operator Narrowing

**Para verificar propiedades en objetos.** Útil para discriminated unions.

```ts
type Fish = { swim: () => void }
type Bird = { fly: () => void }

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim()  // animal: Fish
  }
  return animal.fly()     // animal: Bird
}
```

## Truthiness Narrowing

Valores que coercionan a `false`: `0`, `NaN`, `""`, `0n`, `null`, `undefined`.

```ts
function multiplyAll(values: number[] | undefined, factor: number) {
  if (!values) {
    return values  // values: undefined
  }
  return values.map(x => x * factor)  // values: number[]
}
```

## Equality Narrowing

`===`, `!==`, `==`, `!=` — TypeScript narrows tipos cuando son iguales.

```ts
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    x.toUpperCase()  // x: string (único tipo común)
    y.toLowerCase()  // y: string
  }
}
```

Nota: `x == null` también checkea `undefined`.

## Discriminated Unions

Patrón recomendado para modelar datos con variantes. Usar una propiedad `kind` con **literal types** como discriminante.

```ts
interface Circle {
  kind: "circle"
  radius: number
}
interface Square {
  kind: "square"
  sideLength: number
}
type Shape = Circle | Square

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2  // shape: Circle
    case "square":
      return shape.sideLength ** 2        // shape: Square
  }
}
```

### Exhaustiveness Checking con `never`

```ts
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2
    case "square": return shape.sideLength ** 2
    default:
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}
```

Si alguien agrega `Triangle` a la union `Shape`, TypeScript dará error en `_exhaustiveCheck`.

## Cuándo usar qué

| Técnica | Cuándo usarla | Ejemplo |
|---------|--------------|---------|
| `typeof` | Primitivos (string, number, boolean) | `typeof x === "string"` |
| `instanceof` | Clases/instancias | `x instanceof Date` |
| `in` | Propiedades en objetos | `"swim" in animal` |
| Discriminated union | Múltiples variantes con tipo conocido | `shape.kind === "circle"` |
| Type predicate | Lógica compleja de narrowing | `function isFish(pet): pet is Fish` |
| Truthiness | Null/undefined checks | `if (strs)` |
| Equality | Comparación directa entre variables | `if (x === y)` |
