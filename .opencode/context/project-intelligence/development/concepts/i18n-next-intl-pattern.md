<!-- Context: project-intelligence/development/i18n-next-intl | Priority: medium | Version: 1.1 | Updated: 2026-08-06 -->

# Concept: i18n Pattern (next-intl sin enrutado)

**Core Idea**: La app Prompt Database está internacionalizada con next-intl v4 en modo "without i18n routing": el locale se resuelve por la cabecera `accept-language` (sin selector, sin cookie, sin prefijo de URL, sin campo BD) y se sirven solo los `activeLocales` con traducción (`en-GB` base, `es-ES` completo; 8 idiomas más declarados sin mensajes).

**Key Points**:
- Resolución en `i18n/request.ts` (`getRequestConfig` async) → helper puro `lib/locale.ts` (`resolveLocaleFromAcceptLanguage`): coincidencia exacta primero, prefijos `es`→`es-ES`, `en`→`en-GB`, fallback `en-GB`; solo se sirven locales en `activeLocales`.
- `next.config.js` envuelto con `createNextIntlPlugin()` (obligatorio incluso sin enrutado); `app/layout.tsx` con `<html lang={locale}>`, `NextIntlClientProvider` y `generateMetadata` traducido; `export const dynamic = "force-dynamic"` porque se leen cabeceras.
- Catálogos `messages/{locale}.json`: 21 namespaces, **244 claves por idioma** (2026-08-06: `showFavoritesOnly` se MOVIÓ de `PromptFilters` a `Topbar` sin claves duplicadas; nuevas `Topbar.showFilters`/`hideFilters`/`filtersActive` — ICU plural — y `Sidebar.collapseSidebar`/`expandSidebar`), paridad de claves verificada por test (`tests/i18n/messages.test.ts`); claves camelCase, namespaces PascalCase.
- API routes: `getLocaleFromRequest(request)` + `getTranslations({ locale, namespace: "Api" })`; estructura de respuesta y códigos HTTP intactos.
- Fechas y números con `useFormatter`/`format.dateTime` (formato regional); plurales ICU por idioma (`one/other` en-GB; `=0/one/other` es-ES).
- Tests: envolver componentes con `NextIntlClientProvider` + mensajes reales; en tests de API mockear `next-intl/server`; Jest requiere `transformIgnorePatterns` sobrescrito con `next-intl|use-intl|intl-messageformat|@formatjs` (ESM-only).

**Example**:
```ts
// i18n/request.ts
export default getRequestConfig(async () => {
  const headersStore = await headers()
  const locale = resolveLocaleFromAcceptLanguage(headersStore.get("accept-language"))
  return { locale, messages: (await import(`../messages/${locale}.json`)).default }
})

// API route
const locale = getLocaleFromRequest(request)
const t = await getTranslations({ locale, namespace: "Api" })
return NextResponse.json({ error: t("promptNotFound") }, { status: 404 })
```

**Reference**: `docs/plan-traduccion-i18n.md` (estado, convenciones es-ES, cómo añadir idiomas) · caché externa `.opencode/external-context/next-intl/` (documentación oficial v4)

**Related**:
- `technical-domain.md` — stack y estado de la feature i18n
- `guides/deploy-to-vercel.md` — despliegue a producción
- `concepts/api-response-standards.md` — envoltorios de respuesta preservados
