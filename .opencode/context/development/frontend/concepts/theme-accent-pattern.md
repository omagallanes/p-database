<!-- Context: development/frontend/concepts | Priority: high | Version: 1.0 | Updated: 2026-08-06 -->

# Concept: Theme & Accent Color Pattern

**Core Idea**: El tema (light/dark) y el color de acento se persisten en `uiPreferences` (BD) y se aplican **globalmente** reemplazando colores fijos por variables CSS semánticas. La clase `dark` se aplica server-side en el root layout (sin FOUC al recargar) y el cliente la mantiene idempotente. Todo desde variables `hsl(var(--...))` para permitir sobreescritura dinámica del color elegido.

**Key Points**:
- **Barrido de colores**: los componentes usaban colores fijos (`bg-white`, `text-gray-800`, `border-purple-100`, `purple-600`...). Se sustituyen por variables (`bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-primary`) definidas en `:root` y `.dark` de `app/globals.css`. El sidebar usa `gradient-sidebar` (funciona en ambos modos).
- **Acento dinámico**: el color elegido (HEX) se convierte a HSL con `lib/color.ts` (función pura, testeada) y sobreescribe las variables de acento (`--primary`, `--ring`...). Default: morado `#7c3aed` = `hsl(262 83% 58%)`. Selector: ~8 presets + `input type="color"` libre.
- **Clase `dark` server-side (anti-FOUC)**: `app/layout.tsx` (root, server, `force-dynamic`) lee sesión + `parseUIPreferences` → `className="dark"` en `<html>` en el primer render. Visitantes sin sesión → light. Dos lecturas de BD por request (root + layout (app)): aceptable (selects ligeros por PK).
- **Toggle en cliente**: `UIContext`/ThemeProvider con `useEffect` sobre `[theme, accentColor]` → `document.documentElement.classList.toggle("dark")` (idempotente con el render server).
- **Persistence**: `theme: "light"|"dark"`, `accentColor: hex` en `User.uiPreferences` vía `PATCH /api/user/preferences` (ver `ui-preferences-pattern.md`). Tailwind `darkMode: ["class"]`.

**Arquitectura**:
```
app/layout.tsx (server: auth() + select uiPreferences → className="dark")
  → UIContextProvider (theme, accentColor)
    → useEffect → <html>.classList.toggle('dark') · variables --primary/--ring
```

**Quick example** (`lib/color.ts`):
```ts
// HEX → HSL para variables CSS
export function hexToHsl(hex: string): { h: number; s: number; l: number }
// → "262 83% 58%" listo para hsl(var(--primary) / <alpha>)
```

**Reference**: `contexts/UIContext.tsx` · `lib/color.ts` · `app/layout.tsx` · `app/globals.css` · `tailwind.config.ts`

**Related**: `concepts/ui-preferences-pattern.md` (persistencia) · `project-intelligence/decisions-log.md` #12 · `../backend/concepts/auth-hardening-pattern.md` (seguridad auth)
