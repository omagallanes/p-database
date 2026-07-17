# 100-BLOQUE-00

## Nombre del bloque

**Índice y preparación del Plan Técnico de Intervención**

## Propósito del bloque

Este bloque prepara el trabajo del **Plan Técnico de Intervención** y fija el marco mínimo para poder ejecutar los bloques posteriores con orden, coherencia y trazabilidad.

Su objetivo es:

- localizar las entradas documentales necesarias;
- verificar la estructura mínima de trabajo;
- dejar explícito qué documento se va a construir;
- fijar el índice de salidas parciales dentro de `doc-plan/doc-implementar/conocimiento-tec/`;
- y registrar el marco metodológico que gobernará los siguientes bloques.

Este bloque no debe realizar todavía análisis técnico profundo del repositorio ni definir cambios de implementación detallados.  
Su función es **preparar y encuadrar correctamente el trabajo**.

---

## Entradas obligatorias

Debes localizar y reconocer como entradas principales:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`

Debes reconocer también como elementos estructurales del sistema documental:

- `doc-plan/doc-base/03-Tech-Intervention-Plan.md` documento objetivo final
- `doc-plan/doc-base/04-Phases-Subphases-Plan.md` documento posterior, no objeto de este bloque
- `doc-plan/doc-implementar/conocimiento-tec/` carpeta de salidas parciales del Plan Técnico de Intervención
- `doc-plan/doc-implementar/sprints-plan/` carpeta reservada para documentos posteriores de ejecución

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Este bloque debe obedecer completamente las reglas comunes.

En caso de conflicto entre este bloque y el prompt común, prevalece el prompt común, salvo instrucción explícita posterior del usuario.

---

## Qué debes hacer

1. ✅ **Validar documentos base**: Verificar explícitamente la existencia de:
   - `doc-plan/doc-base/01-Briefing.md`
   - `doc-plan/doc-base/02-Improvement-Spec.md`
   - `doc-plan/doc-base/01-ANALISIS_ESTRUCTURA_UI.md`
   - `doc-plan/doc-base/07_ESQUEMA_DB_POSTGRESQL.md`
2. ✅ **Verificar/crear estructura de directorios**:
   - Verificar que existe o crear el directorio `doc-plan/doc-implementar/conocimiento-tec/`
   - Verificar que existe o crear el directorio `doc-plan/doc-implementar/sprints-plan/`
3. Verificar si existe ya `doc-plan/doc-base/03-Tech-Intervention-Plan.md`.
4. Verificar si existe ya `doc-plan/doc-base/04-Phases-Subphases-Plan.md`.
5. Detectar si en `doc-plan/doc-implementar/conocimiento-tec/` existen materiales previos que puedan formar parte del trabajo acumulativo.
6. Redactar un resumen operativo breve de qué se pretende construir técnicamente a partir de `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md`.
7. Definir el índice previsto de bloques/salidas parciales del trabajo.
8. Dejar explícitos los criterios metodológicos con los que se continuará.

✅ **Nota**: Este bloque debe ejecutarse SIEMPRE primero, antes que ningún otro bloque.

---

## Qué no debes hacer

No debes todavía:

- ejecutar análisis técnico detallado del repo;
- identificar cambios de implementación concretos;
- bajar a nivel de módulos, servicios, componentes o archivos afectados;
- proponer soluciones técnicas;
- resolver discrepancias;
- planificar fases, subfases o sprints;
- consolidar contenido de bloques aún no ejecutados.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-implementar/conocimiento-tec/00-indice-doc-3.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Entradas localizadas
Debe indicar de forma explícita:

- si se ha localizado `doc-plan/doc-base/01-Briefing.md`
- si se ha localizado `doc-plan/doc-base/02-Improvement-Spec.md`
- si se ha localizado `doc-plan/doc-base/01-ANALISIS_ESTRUCTURA_UI.md`
- si se ha localizado `doc-plan/doc-base/07_ESQUEMA_DB_POSTGRESQL.md`
- si existe `doc-plan/doc-base/03-Tech-Intervention-Plan.md`
- si existe `doc-plan/doc-base/04-Phases-Subphases-Plan.md`
- si existe `doc-plan/doc-implementar/conocimiento-tec/`
- si existe `doc-plan/doc-implementar/sprints-plan/`

### 2. Resumen operativo del objetivo del trabajo
Debe explicar brevemente:

- qué se pretende construir técnicamente;
- con qué propósito;
- y sobre qué base documental se hará.

### 3. Índice previsto de salidas parciales
Debe listar de forma ordenada las salidas previstas dentro de `doc-plan/doc-implementar/conocimiento-tec/`.

Como referencia, el índice esperado es:

- `doc-plan/doc-implementar/conocimiento-tec/00-indice-doc-3.md`
- `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md`
- `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md`
- `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md`
- `doc-plan/doc-implementar/conocimiento-tec/04-dependencias-y-condicionantes-tecnicos.md`
- `doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md`
- `doc-plan/doc-implementar/conocimiento-tec/06-seguridad-integrada.md`
- `doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md`
- `doc-plan/doc-base/03-Tech-Intervention-Plan.md`

### 4. Criterios metodológicos aplicados
Debe dejar explícito que el trabajo se regirá por estos principios:

- el código del repositorio manda como realidad actual;
- `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección;
- no se permite especulación;
- toda discrepancia relevante debe documentarse;
- la seguridad debe tratarse de forma integrada;
- la validación técnica debe apoyarse en mecanismos existentes del repo;
- las salidas parciales deben ser consistentes entre sí.

### 5. Bloqueos detectados
Solo si aplica.

Debe indicar:

- qué falta;
- por qué bloquea;
- qué evidencia no se ha encontrado;
- y qué insumo o decisión hace falta para continuar.

---

## Criterios de calidad de este bloque

La salida debe ser:

- clara;
- concreta;
- no ambigua;
- verificable;
- útil como punto de arranque para los siguientes bloques;
- y coherente con el marco definido en `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

No debe ser retórica, decorativa ni redundante.

---

## Instrucción final del bloque

Tu tarea en este bloque es **preparar correctamente el trabajo del Plan Técnico de Intervención**, no ejecutarlo en profundidad todavía.

Debes producir una salida ordenada, verificable y útil para iniciar los siguientes bloques con el menor nivel posible de ambigüedad.

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Entradas localizadas
2. Resumen operativo del objetivo del trabajo
3. Índice previsto de salidas parciales
4. Criterios metodológicos aplicados
5. Observaciones, limitaciones o bloqueos
