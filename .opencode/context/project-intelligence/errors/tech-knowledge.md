<!-- Context: project-intelligence/errors/tech-knowledge | Priority: high | Version: 2.0 | Updated: 2026-08-08 -->

# Catálogo de Errores y Conocimiento Preventivo — Índice

> **Finalidad:** Fuente única de verdad para errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Importante:** Consultar el archivo temático correspondiente antes de planificar, desarrollar, modificar, depurar, probar o desplegar cambios.
> **Relación:** Complementa `../concepts/technical-domain.md` (Known Pitfalls — resumen de alto nivel) con el catálogo detallado.

---

## Leyenda de Estados

| Símbolo | Significado |
|---------|-------------|
| ✅ | Validado contra código actual |
| 🔧 | Corregido en implementación actual |
| ❌ | Activo — requiere corrección |
| ⚠️ | Advertencia crítica |
| 📝 | Información adicional descubierta en código |

---

## Archivos Temáticos

| Archivo | Contenido |
|---------|-----------|
| `auth-errors.md` | Autenticación NextAuth.js (MissingSecret, redirecciones, middleware, JWT cache) |
| `prisma-junction-errors.md` | Prisma: junction tables N:M (IDs compuestos, migración, seed, $transaction) |
| `prisma-schema-errors.md` | Prisma: schema y tipos (nullable, null coalescing, compatibilidad dual, switch type-safe) |
| `deployment-errors.md` | Despliegue y migración PostgreSQL (Vercel, seed, binary targets) |
| `nextjs-build-errors.md` | Next.js y build (ESLint, pre-renderizado, standalone, server actions) |
| `filters-ui-errors.md` | Filtros multi-select y UI (badges, include N:M, selector de idioma) |
| `navigation-ui-errors.md` | Navegación y estado de UI (navegación condicional, toggle de vista, render condicional) |
| `filter-state-errors.md` | Estado de filtros URL-driven (checkboxes, lógica OR con `some`, searchParams) |
| `security-errors.md` | Seguridad y autorización (auth check, filtrado por userId, endpoints de creación) |
| `testing-errors.md` | Testing: planificación y mocks (baseline, $transaction, Zod, URLSearchParams) |
| `testing-mock-errors.md` | Testing: mocks avanzados (cobertura, relaciones N:M, findUnique, batches) |
| `export-import-errors.md` | Export/Import (transformación N:M, campos legacy) |
| `lessons-checklist.md` | Lecciones generales y checklist de prevención |

---

## Historial de Cambios

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2026-08-08 | v2.0: dividido en 13 archivos temáticos (<200 líneas c/u); este archivo pasa a ser índice | Context Organizer |
| 2026-08-06 | v1.2: §1.5 y §1.6 marcadas como resueltas (Fase C y página `/auth/error` creada e internacionalizada); cifras de pruebas actualizadas a 388/40 con histórico | Context Organizer |
| 2026-08-06 | Añadido §1.7 (TypeError `ys.cache` en PROD) y §3.4 marcada obsoleta (BD única Neon, sin SQLite local) | Context Organizer |
| 2026-07-16 | Creación inicial desde tech-knowledge.md del proyecto | Repo Manager |
| 2026-04-25 | Última actualización de fuente original (Fase 4 COMPLETADA, SF-5.1 ✅, SF-5.2 ✅ Build+Lint) | agente-inventariador |
| 2026-04-24 | Añadido Selector de Idioma con Códigos ISO (SF-2.1-S2) | agente-inventariador |
| 2026-04-24 | Añadidos Multi-Select con Badges + Creación Inline, Include de Relaciones N:M, Verificación DB (SF-2.1-S1) | agente-inventariador |
| 2026-04-24 | Añadidos IDs compuestos, migración String→N:M, seed con relaciones múltiples, campos nullable (SF-1.3-S1) | agente-inventariador |
| 2026-04-20 | Creación inicial basada en DOC-RECOPILATORIO | agente-orquestador |

---

> **Nota final:** Este índice es la puerta de entrada al catálogo detallado. Para resumen de alto nivel, consultar `../concepts/technical-domain.md` → Known Pitfalls. Cualquier discrepancia entre estos documentos y el código debe resolverse a favor del código como fuente de verdad definitiva.