---
source: Sonner Official Documentation
library: Sonner
package: sonner
topic: Toast API and Toaster Setup
fetched: 2026-07-14T12:00:00Z
official_docs: https://sonner.emilkowal.ski/getting-started
---

# Sonner — Toast Library API

## Instalación

```bash
pnpm add sonner
```

## API de Toast

### `toast()` — Toast básico

```tsx
import { toast } from 'sonner'

toast('My toast message')
// Con opciones:
toast('My toast message', {
  description: 'Optional description',
  duration: 4000,
  position: 'top-right',
})
```

### `toast.success()` — Toast con icono check

```tsx
toast.success('Operation completed successfully!')
```

### `toast.error()` — Toast con icono de error

```tsx
toast.error('Something went wrong!')
```

### `toast.promise()` — Promise loading/success/error

```tsx
toast.promise(
  fetch('/api/data'),
  {
    loading: 'Loading...',
    success: (data) => `Data loaded: ${data}`,
    error: (err) => `Error: ${err.message}`,
  }
)
```

### `toast.loading()` — Toast con spinner

```tsx
toast.loading('Processing...')
```

### `toast.custom()` — JSX personalizado

```tsx
toast.custom(<div>Custom toast content</div>)
```

### `toast.dismiss()` — Cerrar toast

```tsx
toast.dismiss()          // Cierra todos
toast.dismiss('toast-id')  // Cierra uno específico
```

## Props del toast

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `description` | `ReactNode` | - | Descripción del toast |
| `closeButton` | `boolean` | `false` | Muestra botón de cerrar |
| `duration` | `number` | `4000` | Duración en ms |
| `position` | `string` | `bottom-right` | Posición |
| `dismissible` | `boolean` | `true` | Permite descartar |
| `icon` | `ReactNode` | - | Icono personalizado |
| `action` | `ReactNode` | - | Botón de acción primario |
| `cancel` | `ReactNode` | - | Botón de acción secundario |
| `id` | `string` | - | ID único para el toast |

## `<Toaster />` — ¿Dónde colocarlo?

**Se coloca en el root layout** (puede estar incluso en Server Components):

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

**Importante:** El `<Toaster />` se puede colocar en cualquier parte del árbol de componentes. No requiere un provider adicional — renderiza y gestiona todos los toasts automáticamente.

### Props del Toaster

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `light` | light / dark / system |
| `richColors` | `boolean` | `false` | Colores con fondo para success/error |
| `expand` | `boolean` | `false` | Expandir toasts al hover |
| `visibleToasts` | `number` | `3` | Cantidad de toasts visibles |
| `position` | `string` | `bottom-right` | Posición global |
| `closeButton` | `boolean` | `false` | Botón de cerrar global |
| `offset` | `string|number|object` | `32px` | Offset del contenedor |
| `hotkey` | `string` | `⌥/alt + T` | Hotkey para abrir toasts |
| `toastOptions` | `object` | `{ duration: 4000 }` | Opciones por defecto |
| `gap` | `number` | `14` | Espacio entre toasts |
| `icons` | `object` | `-` | Iconos personalizados |

### Múltiples Toasters

```tsx
<Toaster id="global" position="top-right" />
<Toaster id="canvas" position="bottom-left" />

toast('Global toast', { toasterId: 'global' })
toast('Canvas toast', { toasterId: 'canvas' })
```

### Dynamic Theme con next-themes

```tsx
'use client'
import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'
import { useTheme } from 'next-themes'

export function Toaster() {
  const { resolvedTheme } = useTheme()
  return <SonnerToaster theme={resolvedTheme as ToasterProps['theme']} />
}
```

## Resumen para Plan C

- **No requiere provider adicional** — solo `<Toaster />` en el layout
- API simple: `toast()`, `toast.success()`, `toast.error()`, `toast.promise()`
- `<Toaster />` funciona en Server Components (es el componente que renderiza los toasts)
- Posición default: `bottom-right`
- Duración default: 4000ms
