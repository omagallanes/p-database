# Lanzador — "Tech Intervention Plan"

Vas a ejecutar el sistema de generación del **"Tech Intervention Plan"**.

✅ **Documentos base garantizados y disponibles SIEMPRE**:
- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- `doc-plan/doc-base/01-ANALISIS_ESTRUCTURA_UI.md`
- `doc-plan/doc-base/07_ESQUEMA_DB_POSTGRESQL.md`

---

## Reglas globales de flujo y dependencias

✅ **Orden de ejecución OBLIGATORIO**:
El sistema debe ejecutarse estrictamente en este orden. Ningún bloque puede ejecutarse si no existen todas las salidas de los bloques que le preceden:

| Orden | Bloque | Dependencias obligatorias | Salida generada |
|-------|--------|----------------------------|-----------------|
| 1 | 000-Lanzador | Ninguna | Define el flujo |
| 2 | 100-BLOQUE-00 | Lanzador + 4 documentos base | `00-indice-doc-3.md` |
| 3 | 110-BLOQUE-01 | Salida Bloque 00 | `01-mapa-tecnico-intervencion.md` |
| 4 | 120-BLOQUE-02 | Salidas Bloques 00 + 01 | `02-cambios-tecnicos-necesarios.md` |
| 5 | 130-BLOQUE-03 | Salidas Bloques 00 + 01 + 02 | `03-relacion-objetivo-vs-realidad.md` |
| 6 | 140-BLOQUE-04 | Salidas Bloques 00 a 03 | `04-dependencias-y-condicionantes-tecnicos.md` |
| 7 | 150-BLOQUE-05 | Salidas Bloques 00 a 04 | `05-validacion-tecnica.md` |
| 8 | 160-BLOQUE-06 | Salidas Bloques 00 a 05 | `06-seguridad-integrada.md` |
| 9 | 170-BLOQUE-07 | Salidas Bloques 00 a 06 | `07-riesgos-y-decisiones-abiertas.md` |
| 10 | 199-BLOQUE-99 | Salidas TODOS los bloques 00 a 07 | `03-Tech-Intervention-Plan.md` |

✅ **Regla irrenunciable de reutilización de contexto**:
Cada bloque debe leer y considerar TODAS las salidas de bloques anteriores ya generados. No repitas análisis ya realizados. Contrástalos, actualízalos si es necesario, pero nunca los ignores.

✅ **Regla de resolución de contradicciones**:
Si un bloque posterior detecta información que contradice un bloque anterior, no lo corrijas silenciosamente. Documentalo explícitamente como una nueva discrepancia.

## Cómo debes trabajar

Debes ejecutar el sistema del **"Tech Intervention Plan"** por bloques.

Antes de ejecutar cualquier bloque, debes:

1. leer y aplicar primero el **Prompt Común — Reglas y Directrices Generales**;
2. asumir que esas reglas comunes siguen vigentes durante toda la ejecución;
3. después ejecutar únicamente el bloque que el usuario autorice;
4. generar siempre la salida **en el chat**, en **formato Markdown (MD)** y dentro de un **lienzo de código**;
5. no cambiar de bloque por iniciativa propia;
6. no ejecutar bloques no autorizados;
7. no consolidar ni resumir resultados de bloques no ejecutados;
8. si falta evidencia suficiente, detenerte y reportarlo sin inventar.

---

## Regla metodológica principal

Debes trabajar siempre con esta jerarquía:

1. **El código del repositorio manda como realidad actual.**
2. **`doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.**
3. **Las reglas comunes especificadas más adelante mandan como marco metodológico obligatorio.**
4. Si hay discrepancias/inccompatibilidad entre objetivo y realidad, **debes documentarlas**, no ocultarlas ni resolverlas arbitrariamente.

---

## Qué son las reglas comunes y cómo debes aplicarlas

Las **reglas comunes** son el marco obligatorio que gobierna todos los bloques del "Tech Intervention Plan".

Debes seguirlas siempre para:

- contrastar lo pedido contra el repo real;
- no inventar;
- no asumir arquitectura no observada;
- no rellenar huecos con patrones genéricos;
- mantener seguridad integrada;
- definir validación técnica usando mecanismos existentes del repo;
- documentar discrepancias y decisiones abiertas;
- producir salidas concretas, trazables y no ambiguas.

Aunque cada bloque tenga sus propias instrucciones, **las reglas comunes siempre prevalecen**.

---

## Qué bloques existen

El sistema del "Tech Intervention Plan" se organiza en estos bloques:

### B1 — Mapa técnico de intervención
Identifica qué zonas reales del sistema están implicadas según el repo.

### B2 — Cambios técnicos necesarios
Define qué cambios técnicos parecen necesarios para soportar lo pedido en `doc-plan/doc-base/02-Improvement-Spec.md`.

### B3 — Relación entre objetivo y realidad
Expone qué parte del objetivo ya está soportada, cuál no y dónde hay fricción entre objetivo y repo.

### B4 — Dependencias y condicionantes técnicos
Identifica dependencias técnicas reales, contratos, restricciones y condicionantes estructurales.

### B5 — Validación técnica
Define qué debe validarse técnicamente y qué mecanismos existentes del repo pueden aprovecharse.

### B6 — Seguridad integrada
Analiza el impacto del cambio sobre seguridad, controles existentes y validaciones necesarias.

### B7 — Riesgos y decisiones abiertas
Documenta riesgos técnicos reales, discrepancias y decisiones que requieren intervención del usuario.

### B99 — Consolidación del "Tech Intervention Plan"
Consolida los bloques ya ejecutados en el documento final `doc-plan/doc-base/03-Tech-Intervention-Plan.md`.

---

## Regla de ejecución de bloques

Debes asumir esta disciplina:

- el usuario decide con qué bloque comenzar;
- solo ejecutas el bloque autorizado;
- cada bloque debe respetar las reglas comunes;
- cada salida debe ser útil por sí misma y compatible con las siguientes;
- no debes anticipar el contenido de bloques futuros;
- no debes convertir un bloque en backlog, sprint o plan de ejecución detallado.

---

Explica brevemente qué has entendido y espera las siguientes instrucciones.