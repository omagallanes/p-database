<!-- Context: ui/styling | Priority: high | Version: 2.0 | Updated: 2026-07-14 -->
# UI Styling Standards

**Core Idea**: Tailwind CSS utility-first + Flowbite components. Mobile-first responsive with OKLCH color system. `!important` allowed for framework overrides, but prefer Tailwind utilities.

**Framework**: Tailwind CSS + Flowbite (default) | **Approach**: Mobile-first | **Format**: Utility-first

---

## CSS Framework Conventions

### Tailwind CSS
**Loading** (preferred): `<script src="https://cdn.tailwindcss.com"></script>` — allows JIT compilation.
**Avoid**: `<link>` stylesheet — no JIT support.

### Flowbite
```html
<link href="https://cdn.jsdelivr.net/npm/flowbite@2.0.0/dist/flowbite.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/flowbite@2.0.0/dist/flowbite.min.js"></script>
```
**Components**: Buttons, forms, modals, nav, dropdowns, tabs, cards, alerts, badges, tables, pagination, tooltips, popovers.

---

## Responsive Design

**Rule**: ALL designs MUST be responsive. Mobile-first — base styles apply to mobile, breakpoints add up.

**Breakpoints** (Tailwind defaults):
| Prefix | Min-Width | Usage |
|--------|-----------|-------|
| *(none)* | 0 | Mobile base styles |
| `sm:` | 640px | Large phones, tablets |
| `md:` | 768px | Tablets landscape |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Wide desktop |
| `2xl:` | 1536px | Ultra-wide |

```html
<!-- Mobile: stack, Desktop: side-by-side -->
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/2">Left</div>
  <div class="w-full md:w-1/2">Right</div>
</div>

<!-- Mobile: full width, Desktop: constrained -->
<div class="w-full lg:w-3/4 xl:w-1/2 mx-auto">Content</div>
```

**Testing**: Test at 375px, 768px, 1024px, 1440px. Touch targets min 44x44px. Verify images scale, navigation works, text readable at all sizes.

---

## Color Palette

**Rule**: NEVER use Bootstrap blue (#007bff) unless explicitly requested. Overused, lacks personality.

```css
/* ✅ Use semantic OKLCH colors */
--primary: oklch(0.6489 0.2370 26.9728);    /* Vibrant orange */
--accent: oklch(0.5635 0.2408 260.8178);     /* Rich purple */
--info: oklch(0.6200 0.1900 260);            /* Modern blue */
--success: oklch(0.7323 0.2492 142.4953);    /* Fresh green */
```

**Rules**: Semantic names (`--primary`, not `--blue`). Contrast WCAG AA (4.5:1). Use theme variables consistently.

---

## Layout Patterns

### Flexbox (1D layouts)
```html
<div class="flex items-center gap-4">          <!-- Horizontal -->
<div class="flex flex-col gap-4">               <!-- Vertical -->
<div class="flex items-center justify-center min-h-screen">  <!-- Centered -->
```

### Grid (2D layouts)
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  <!-- Responsive grid -->
<div class="grid grid-cols-12 gap-4">                                <!-- Dashboard -->
  <aside class="col-span-12 lg:col-span-3">Sidebar</aside>
  <main class="col-span-12 lg:col-span-9">Content</main>
</div>
```

### Containers
```html
<div class="container mx-auto px-4 max-w-7xl">Content</div>
<section class="w-full bg-gray-50">
  <div class="container mx-auto px-4 py-12 max-w-6xl">Content</div>
</section>
```

---

## Component Styling Patterns

| Component | Tailwind Classes |
|-----------|-----------------|
| **Primary button** | `bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity` |
| **Secondary button** | `bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80` |
| **Outline button** | `border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground` |
| **Basic card** | `bg-card text-card-foreground rounded-lg shadow-md p-6` |
| **Interactive card** | Same + `hover:shadow-lg transition-shadow cursor-pointer` |
| **Input field** | `w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent` |

---

## Typography

**Font**: Inter (Google Fonts) loaded with preconnect + preload. Fallback: system sans-serif.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Scale**: `h1:text-4xl/5xl/6xl font-bold` → `h2:text-3xl/4xl font-semibold` → `h3:text-2xl/3xl font-semibold` → `body:text-base md:text-lg` → `caption:text-xs text-gray-500`.

**Readability**: 60-80 chars/line, line-height 1.5-1.75, min 16px body, 4.5:1 contrast.

---

## CSS Specificity & Overrides

Use `!important` for properties that might be overwritten by Tailwind or Flowbite:
```css
h1 { font-size: 2.5rem !important; }
body { font-family: 'Inter', sans-serif !important; color: var(--foreground) !important; }
.custom-button { background-color: var(--primary) !important; }
```

**Don't** over-use: `margin: 1rem !important` is wrong — use `m-4` instead.

---

## Accessibility

- **Semantic HTML**: `<header> <nav> <main> <article> <aside> <footer>` — no div soup
- **ARIA labels**: `<button aria-label="Close dialog"><svg>...</svg></button>`
- **Focus states**: `button:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }`
- **WCAG AA**: 4.5:1 contrast minimum for normal text

---

## Performance

- Preconnect to font origins
- Responsive images with `srcset` + `sizes` + `loading="lazy"`
- Inline critical CSS, load full CSS async (`<link rel="stylesheet" media="print" onload="this.media='all'">`)

---

## Best Practices

| ✅ Do | ❌ Don't |
|-------|----------|
| Tailwind utilities for rapid dev | Bootstrap blue (#007bff) without request |
| Load Tailwind via script tag (JIT) | Load Tailwind as stylesheet link |
| Mobile-first responsive | Skip responsive design |
| Semantic HTML | Div soup |
| CSS custom properties for theming | Hardcode colors |
| `!important` for framework overrides | Over-use `!important` everywhere |
| WCAG AA contrast (4.5:1) | Tiny touch targets (<44px) |
| ARIA labels on icon-only elements | Mix color formats |

## References

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Flowbite Components](https://flowbite.com/docs/)
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
