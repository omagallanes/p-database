import { headers } from "next/headers"
import { getRequestConfig } from "next-intl/server"
import { resolveLocaleFromAcceptLanguage } from "../lib/locale"

export default getRequestConfig(async () => {
  const headersStore = await headers()
  const acceptLanguage = headersStore.get("accept-language")
  const locale = resolveLocaleFromAcceptLanguage(acceptLanguage)

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
