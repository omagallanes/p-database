# 130-BLOQUE-03

## Nombre del bloque

**Relación entre objetivo y realidad**

## Propósito del bloque

Este bloque tiene como objetivo hacer explícita la relación entre:

- lo que se quiere lograr según `doc-plan/doc-base/01-Briefing.md`
- lo que se define funcionalmente en `doc-plan/doc-base/02-Improvement-Spec.md`
- y lo que realmente existe, soporta o limita el código actual del repositorio

Su función es identificar con claridad:

- qué parte del objetivo ya está soportada por el sistema;
- qué parte está solo parcialmente soportada;
- qué parte no está soportada;
- dónde existen fricciones, vacíos o incompatibilidades;
- y qué diferencias entre intención y realidad condicionan la intervención técnica posterior.

Este bloque no debe proponer todavía una solución detallada ni ocultar tensiones entre objetivo y sistema actual.  
Su foco es **hacer visible el grado real de alineación entre lo que se desea y lo que existe**.

---

## Entradas obligatorias

Debes usar como entradas mínimas:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio

Debes usar también, como marco metodológico obligatorio:

- `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`

Debes tener en cuenta, si existen, las salidas previas relacionadas:

- `doc-plan/doc-implementar/conocimiento-tec/00-indice-doc-3.md`
- `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md`
- `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md`

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Debes mantener siempre esta jerarquía:

1. El código del repositorio manda como realidad actual.
2. `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.
3. Este bloque debe trabajar sobre contraste verificable entre intención y realidad.
4. Si algo no puede afirmarse con suficiente base, debes indicarlo explícitamente.
5. Toda discrepancia relevante debe hacerse visible, no suavizarse ni omitirse.

Este bloque debe ser **comparativo, técnico, trazable y no especulativo**.

---

## Qué debes hacer

1. ✅ **Validar dependencias**: Verificar que existen las salidas de los bloques anteriores:
   - `doc-plan/doc-implementar/conocimiento-tec/00-indice-doc-3.md`
   - `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md`
   - `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md`
   Si falta alguna, detente y notifícalo.
2. ✅ **Cargar contexto acumulado**: Leer las salidas de los bloques 00, 01 y 02. No repitas análisis ya realizado. Contrasta y amplía, no repites.
3. Leer `doc-plan/doc-base/01-Briefing.md` para recuperar el marco general, el problema y la dirección del trabajo.
4. Leer `doc-plan/doc-base/02-Improvement-Spec.md` para identificar con precisión:
   - qué comportamiento se quiere introducir;
   - qué requisitos funcionales deben cumplirse;
   - qué criterios de aceptación existen;
   - y qué condiciones, excepciones o dependencias funcionales pueden afectar al análisis.
5. Inspeccionar el repositorio para determinar qué parte del objetivo está ya soportada por el sistema actual y qué parte no.
6. Comparar intención y realidad de forma explícita, sin mezclar todavía la planificación de implementación.
7. Clasificar el grado de alineación de cada objetivo, capacidad, requisito o comportamiento relevante.
8. Distinguir claramente entre:
   - lo ya soportado;
   - lo parcialmente soportado;
   - lo no soportado;
   - lo incierto;
   - y lo incompatible o en fricción con la realidad actual observada.
9. Identificar vacíos estructurales, contractuales, funcionales o técnicos detectables en el repositorio.
10. Señalar qué hallazgos condicionarán:
    - los cambios técnicos necesarios;
    - las dependencias y condicionantes;
    - la validación técnica;
    - la seguridad integrada;
    - y los riesgos o decisiones abiertas.
11. Cuando existan discrepancias relevantes, prepararlas de forma clara para su tratamiento posterior como decisiones abiertas.

---

## Qué no debes hacer

No debes:

- proponer todavía una implementación detallada;
- cerrar decisiones técnicas que dependan de aprobación del usuario;
- ocultar fricciones o incompatibilidades bajo formulaciones ambiguas;
- convertir este bloque en backlog;
- convertir el contraste en una explicación genérica de arquitectura;
- limitarte a repetir el Improvement Spec sin contrastarlo con el repo;
- presentar como soporte real algo que solo sea una analogía superficial;
- inventar soporte técnico inexistente por similitud de nombres o estructuras;
- suavizar gaps importantes por prudencia narrativa.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Alcance del análisis del bloque
Debe indicar:

- qué objetivos, requisitos o capacidades se han contrastado;
- qué zonas del sistema se han tomado como base del contraste;
- y hasta qué nivel de fiabilidad ha sido posible realizar la comparación.

### 2. Resumen de alineación general
Debe sintetizar, de forma breve y precisa:

- el grado general de alineación entre objetivo y realidad;
- si el sistema ya ofrece una base sólida, parcial o insuficiente;
- y dónde se concentran las principales brechas o fricciones.

### 3. Objetivos o capacidades ya soportadas
Debe identificar los puntos donde el repositorio muestra evidencia suficiente de que el sistema ya soporta total o sustancialmente lo requerido.

Debes explicar:

- qué parte está soportada;
- en qué evidencia del repo se apoya esa afirmación;
- y qué nivel de confianza tiene esa conclusión.

### 4. Objetivos o capacidades parcialmente soportadas
Debe recoger los casos donde existe una base real, pero esta es:

- incompleta;
- limitada;
- insuficiente;
- o no alineada del todo con lo requerido.

Debes explicar:

- qué parte existe ya;
- qué parte falta;
- y por qué eso constituye solo soporte parcial.

### 5. Objetivos o capacidades no soportadas
Debe dejar claro qué parte del objetivo no encuentra base suficiente en el sistema actual.

Debes indicar:

- qué no está soportado;
- qué evidencia sugiere esa ausencia;
- y qué implicación técnica general tiene ese gap.

### 6. Puntos de fricción relevantes
Debe identificar tensiones claras entre el objetivo y la realidad actual observada, por ejemplo si aplica:

- flujos que no encajan;
- contratos incompatibles;
- estructuras rígidas;
- validaciones que bloquean el comportamiento deseado;
- supuestos del sistema que chocan con el objetivo;
- dependencias que dificultan el cambio;
- limitaciones observables del diseño actual.

### 7. Vacíos estructurales o funcionales detectados en el repo
Debe señalar qué carencias del sistema aparecen como relevantes para explicar por qué el objetivo no está total o parcialmente soportado.

Pueden ser, si la evidencia lo justifica:

- ausencia de capas;
- ausencia de puntos de extensión;
- falta de contratos;
- falta de mecanismos de validación;
- falta de integración;
- falta de componentes reutilizables;
- o estructuras que no cubren la necesidad definida.

### 8. Elementos inciertos o pendientes de confirmación
Debe recoger los casos donde no puede afirmarse con suficiente fiabilidad:

- si el sistema soporta o no una parte del objetivo;
- si el gap es real o aparente;
- o si existen piezas no visibles o no suficientemente trazables en el repo.

Debes dejar claro por qué existe esa incertidumbre.

### 9. Conclusiones para la intervención técnica
Debe indicar cómo el grado de alineación observado condiciona:

- la definición de cambios técnicos necesarios;
- la identificación de dependencias y condicionantes;
- la validación técnica;
- la seguridad integrada;
- y la posterior documentación de riesgos y decisiones abiertas.

### 10. Evidencia principal utilizada
Debe dejar trazabilidad mínima de:

- qué módulos, archivos, contratos, configuraciones o estructuras sostienen el contraste;
- dónde se apoyan las conclusiones principales;
- y dónde existen límites de confianza.

### 11. Bloqueos o límites del análisis
Solo si aplica.

Debe indicar:

- qué no pudo contrastarse con mínima fiabilidad;
- por qué;
- qué evidencia faltó;
- y cómo condiciona eso la interpretación del grado real de alineación.

---

## Formato recomendado

Debes priorizar formatos comparativos y de contraste.

Cuando sea útil, usa tablas como esta:

| Objetivo / capacidad esperada | Evidencia en `doc-plan/doc-base/01-Briefing.md` / `doc-plan/doc-base/02-Improvement-Spec.md` | Soporte actual en el repo | Clasificación | Gap detectado | Implicación técnica general | Nivel de confianza | Notas |
|---|---|---|---|---|---|---|---|

También puedes usar agrupaciones como:

- **ya soportado**
- **parcialmente soportado**
- **no soportado**
- **en fricción**
- **pendiente de confirmación**

Pero no uses estas categorías si no están justificadas por evidencia.

---

## Criterios de clasificación recomendados

Cuando clasifiques el grado de alineación, usa criterios como estos:

### Ya soportado
Cuando el repositorio muestra evidencia suficiente de que el sistema ya cubre lo requerido de forma total o sustancial.

### Parcialmente soportado
Cuando existe base real, pero es incompleta, insuficiente o no totalmente alineada con el objetivo.

### No soportado
Cuando no se observa evidencia suficiente de que el sistema cubra la capacidad, comportamiento o requisito deseado.

### En fricción
Cuando el sistema actual no solo no cubre bien el objetivo, sino que además muestra estructuras, contratos, flujos o supuestos que chocan con él.

### Pendiente de confirmación
Cuando existen indicios, pero no evidencia suficiente para afirmar con seguridad el grado de soporte real.

---

## Requisitos de calidad de este bloque

La salida debe ser:

- concreta;
- comparativa;
- verificable;
- trazable;
- no ambigua;
- no especulativa;
- útil para los bloques posteriores;
- y suficientemente clara como para evitar falsas percepciones de alineación entre objetivo y realidad.

No debe ser:

- retórica;
- complaciente;
- redundante;
- una simple repetición del Improvement Spec;
- ni una descripción superficial del sistema sin contraste explícito.

---

## Señales de mala ejecución que debes evitar

Evita especialmente estos errores:

- declarar como “ya soportado” algo que solo se parece superficialmente a lo requerido;
- no distinguir entre soporte parcial y soporte real suficiente;
- omitir fricciones para no complicar el análisis;
- tratar gaps importantes como detalles menores;
- no dejar clara la diferencia entre falta de soporte, fricción e incertidumbre;
- confundir intención funcional con implementación existente;
- no bajar al nivel de evidencia del repo cuando sí es posible;
- anticipar decisiones de solución que pertenecen a otros bloques.

---

## Instrucción final del bloque

Tu tarea en este bloque es **hacer visible, con precisión y evidencia, la distancia real entre lo que se quiere y lo que existe**.

Debes producir una salida clara, estructurada y basada en contraste verificable, que permita continuar con el menor nivel posible de ambigüedad hacia los siguientes bloques del **Plan Técnico de Intervención**.

## Salida/Resultado

Guarda tu respuesta/resultado en un archivo (con índice de contenido) en doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Alcance del análisis del bloque
2. Resumen de alineación entre objetivo y realidad
3. Análisis por área funcional
4. Clasificación de grado de alineación
5. Discrepancias y fricciones detectadas
6. Observaciones para bloques posteriores
7. Evidencia principal utilizada
8. Bloqueos o límites del análisis
