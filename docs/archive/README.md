# docs/archive/ — Archivo Histórico del Proyecto

**Propósito:** Almacenar documentación histórica, planes de intervención completados y registros técnicos de etapas anteriores del proyecto.

---

## Estructura

```
docs/archive/
├── README.md                          ← Este archivo
├── plan-contexto-oac.md               ← Plan de contexto original para agentes OAC
├── reglas-abreviaciones.txt           ← Reglas e instrucciones generales + abreviaciones (v0.13)
├── etapa-1/                           ← Documentación base histórica
│   ├── analysis/                      ← Análisis técnicos puntuales
│   ├── doc-base/                      ← Documentación base del proyecto
│   ├── errors/                        ← Debug logs y correcciones de errores
│   ├── prompts/                       ← Prompts de sistema para agentes
│   ├── reports/                       ← Informes de implementación
│   ├── sprints/                       ← Sprints completados
│   └── technical-analysis/            ← Conocimiento técnico post-implementación
├── etapa-2-ESLint/                    ← Plan A: ESLint + correcciones de tipo
│   ├── 00-PREPARACION.md              ← Plan de trabajo
│   ├── 01-DIAGNOSTICO-CODEBASE.md     ← Diagnóstico previo
│   ├── 02-BEST-PRACTICES-EXTERNAS.md  ← Documentación externa consultada
│   └── README.md                      ← Explicación del directorio
└── etapa-3-Refactor/                  ← Plan C: Limpieza técnica y estabilización
    ├── estado-fase1-y-pendientes.md   ← Estado detallado post-Fase 1
    ├── reporte-y-plan-5-puntos.md     ← Plan original de 5 puntos
    ├── revision-y-hallazgos.md        ← Revisión cruzada y hallazgos
    └── README.md                      ← Explicación del directorio
```

## Contenido por etapa

### `etapa-1/` — Documentación histórica original

Corresponde a la documentación generada durante las fases iniciales del proyecto (sprints 1-5). Incluye análisis técnicos, informes de implementación, registros de errores, sprints completados y prompts de sistema. Fue movida aquí desde `docs/archive/` para agrupar la documentación base en un solo lugar.

### `etapa-2-ESLint/` — Plan A: ESLint + correcciones de tipo

Intervención técnica que configuró ESLint con reglas TypeScript y corrigió 11 tipos `any`, 2 `console.log` y 4 `catch(error: any)` en el código base.

| Recurso | Descripción |
|---------|-------------|
| `00-PREPARACION.md` | Plan de trabajo: fases, archivos a modificar, reglas ESLint finales, criterios de éxito |
| `01-DIAGNOSTICO-CODEBASE.md` | Diagnóstico previo: mapa completo de `any`, `console.log` y `catch(error: any)` archivo por archivo |
| `02-BEST-PRACTICES-EXTERNAS.md` | Documentación externa consultada y decisiones técnicas fundamentadas |
| `README.md` | Explicación del directorio y su finalidad |

**Commits:** `6664d84` (config ESLint), `9d78f7e` (type fixes)

### `etapa-3-Refactor/` — Plan C: Limpieza técnica y estabilización

Intervención técnica en 3 fases que corrigió tests rotos, eliminó warnings `no-unused-vars`, estandarizó formatos de API y dividió componentes grandes.

| Recurso | Descripción |
|---------|-------------|
| `reporte-y-plan-5-puntos.md` | Plan original: 5 puntos (P1a-P5), prioridades, orden de ejecución |
| `revision-y-hallazgos.md` | Revisión cruzada del plan: 11 hallazgos (H1-H11) con severidad y corrección |
| `estado-fase1-y-pendientes.md` | Estado detallado post-Fase 1 con checklist, errores conocidos y línea de tiempo |
| `README.md` | Explicación del directorio y su finalidad |

**Commits:** `8c37bec` + `866c866` (F1), `3072d07` + `9bf6043` (F2), `006a615` (F3)
**Tags:** `fase1-completa`, `fase2-completa`, `fase3-completa`
**Documento técnico consolidado:** `docs/technical-development-knowledge/PCI-plan-c-completo.md`

## Archivos raíz

| Archivo | Descripción |
|---------|-------------|
| `plan-contexto-oac.md` | Plan de contexto original utilizado para configurar agentes OpenAgentControl (OAC) |
| `reglas-abreviaciones.txt` | Reglas e instrucciones generales para el tratamiento de prompts, más tabla de abreviaciones del proyecto (v0.13) |

## Nota

Este directorio es histórico. Los documentos aquí almacenados registran intervenciones completadas y no deben modificarse salvo para corregir errores factuales. El conocimiento técnico activo y vigente se encuentra en `docs/technical-development-knowledge/`.
