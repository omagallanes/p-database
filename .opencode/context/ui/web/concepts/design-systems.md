<!-- Context: ui/design-systems | Priority: high | Version: 2.0 | Updated: 2026-07-14 -->
# Design Systems

**Core Idea**: Reusable theme templates using CSS custom properties in OKLCH color space. Two primary templates provided: Neo-Brutalism (bold, sharp) and Modern Dark Mode (clean, professional). Start with template, adjust colors/radius/shadow for brand.

**Color Format**: OKLCH (perceptually uniform) — `oklch(L C H)` where L=0-1, C=0-0.4, H=0-360
**Font Sources**: Google Fonts | **Responsive**: Mobile-first

---

## Theme 1: Neo-Brutalism Style

**Characteristics**: 90s aesthetic, bold borders, flat offset shadows, high contrast. For retro/vintage, creative portfolios, bold consumer apps.

```css
:root {
  /* Colors - High contrast */
  --background: oklch(1.0000 0 0);       --foreground: oklch(0 0 0);
  --card: oklch(1.0000 0 0);             --card-foreground: oklch(0 0 0);
  --primary: oklch(0.6489 0.2370 26.9728);  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9680 0.2110 109.7692);  --secondary-foreground: oklch(0 0 0);
  --muted: oklch(0.9551 0 0);            --muted-foreground: oklch(0.3211 0 0);
  --accent: oklch(0.5635 0.2408 260.8178);    --accent-foreground: oklch(1.0000 0 0);
  --destructive: oklch(0 0 0);           --border: oklch(0 0 0);
  --input: oklch(0 0 0);                 --ring: oklch(0.6489 0.2370 26.9728);

  /* Sidebar */
  --sidebar: oklch(0.9551 0 0);          --sidebar-foreground: oklch(0 0 0);
  --sidebar-primary: oklch(0.6489 0.2370 26.9728);
  --sidebar-accent: oklch(0.5635 0.2408 260.8178);

  /* Typography */
  --font-sans: 'DM Sans', sans-serif;    --font-mono: 'Space Mono', monospace;

  /* Border radius - Sharp */
  --radius: 0px;  --radius-sm: -4px;  --radius-md: -2px;  --radius-lg: 0px;  --radius-xl: 4px;

  /* Shadows - Bold offset */
  --shadow: 4px 4px 0px 0px hsl(0 0% 0% / 1);
  --shadow-lg: 4px 4px 0px 0px hsl(0 0% 0% / 1), 4px 4px 6px -1px hsl(0 0% 0% / 1);

  /* Spacing */
  --spacing: 0.25rem;
}
```

---

## Theme 2: Modern Dark Mode

**Characteristics**: Clean, minimal, professional (Vercel/Linear aesthetic). For SaaS, dev tools, dashboards, enterprise.

```css
:root {
  /* Colors - Subtle, professional */
  --background: oklch(1 0 0);            --foreground: oklch(0.1450 0 0);
  --card: oklch(1 0 0);                 --card-foreground: oklch(0.1450 0 0);
  --primary: oklch(0.2050 0 0);         --primary-foreground: oklch(0.9850 0 0);
  --secondary: oklch(0.9700 0 0);       --muted: oklch(0.9700 0 0);
  --accent: oklch(0.9700 0 0);          --destructive: oklch(0.5770 0.2450 27.3250);
  --border: oklch(0.9220 0 0);          --ring: oklch(0.7080 0 0);

  /* Sidebar */
  --sidebar: oklch(0.9850 0 0);         --sidebar-foreground: oklch(0.1450 0 0);
  --sidebar-primary: oklch(0.2050 0 0); --sidebar-accent: oklch(0.9700 0 0);

  /* Typography - System fonts */
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ...;

  /* Border radius - Rounded */
  --radius: 0.625rem;

  /* Shadows - Subtle, soft */
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);

  --spacing: 0.25rem;
}
```

---

## Color System & Guidelines

**OKLCH Format**: `oklch(L C H)` — `oklch(0.6489 0.2370 26.9728)` = vibrant orange.

**Rules**:
- Semantic naming: `--primary`, `--destructive`, not `--blue`, `--red`
- Avoid Bootstrap blue (#007bff) unless explicitly requested
- WCAG AA contrast minimum (4.5:1 for text)
- Use theme variables everywhere, never hardcoded colors
- Test light and dark modes if applicable

**Background/Foreground pairing**: Light component → dark background. Dark component → light background.

---

## Typography System

| Category | Recommended Fonts |
|----------|------------------|
| **Sans-serif (UI)** | Inter, Roboto, Open Sans, Poppins, Outfit, DM Sans, Geist, Space Grotesk |
| **Monospace (Code)** | JetBrains Mono, Fira Code, Source Code Pro, IBM Plex Mono, Space Mono, Geist Mono |
| **Serif (Editorial)** | Merriweather, Playfair Display, Lora, Source Serif Pro, Libre Baskerville |
| **Display** | Oxanium, Architects Daughter |

**Loading**: Always Google Fonts. Preconnect + preload for performance.

---

## Spacing, Radius & Shadows

| System | Values |
|--------|--------|
| **Spacing base** | `--spacing: 0.25rem` (4px). Scale: 1x=4px, 2x=8px, 4x=16px, 6x=24px, 8x=32px, 12x=48px, 16x=64px |
| **Radius** | Sharp (0) / Subtle (6px) / Rounded (10px) / Pill (9999px) |
| **Shadows** | Soft (modern): `0 1px 3px hsl(0 0% 0% / 0.1)` • Hard (brutalism): `4px 4px 0px hsl(0 0% 0% / 1)` |

---

## When to Use Each Theme

| Style | Best For | Avoid For |
|-------|----------|-----------|
| **Neo-Brutalism** | Creative/artistic, retro/vintage, bold statement designs | Enterprise/corporate, accessibility-critical |
| **Modern Dark** | SaaS, dev tools, dashboards, enterprise | Creative/artistic portfolios |

## References

- [OKLCH Color Picker](https://oklch.com/)
- [Google Fonts](https://fonts.google.com/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
