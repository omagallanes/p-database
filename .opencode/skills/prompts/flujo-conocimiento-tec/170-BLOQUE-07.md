# 170-BLOQUE-07

## Nombre del bloque

**Riesgos y decisiones abiertas**

## Propósito del bloque

Este bloque tiene como objetivo documentar de forma explícita:

- los riesgos técnicos reales asociados al cambio;
- los riesgos de seguridad, validación, integración o mantenimiento que se desprenden del análisis;
- las discrepancias relevantes entre el objetivo y la realidad del repositorio;
- y las decisiones abiertas que requieren intervención, aprobación o definición por parte del usuario.

Toma como referencia:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio
- y los hallazgos acumulados en los bloques anteriores

Su función es dejar visible, sin suavizar ni ocultar, qué puntos pueden comprometer, retrasar, complicar o desviar el trabajo posterior, y qué decisiones no deben cerrarse automáticamente por la IAI.

Este bloque no debe intentar resolver por su cuenta las discrepancias que requieran validación del usuario.  
Su foco es **hacer visibles los riesgos y estructurar correctamente las decisiones pendientes**.

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
- `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md`
- `doc-plan/doc-implementar/conocimiento-tec/04-dependencias-y-condicionantes-tecnicos.md`
- `doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md`
- `doc-plan/doc-implementar/conocimiento-tec/06-seguridad-integrada.md`

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Debes mantener siempre esta jerarquía:

1. El código del repositorio manda como realidad actual.
2. `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.
3. Los bloques previos aportan hallazgos acumulados, pero este bloque debe seguir apoyándose en evidencia verificable.
4. Toda discrepancia relevante entre objetivo y realidad debe hacerse explícita.
5. Ninguna decisión abierta que requiera criterio del usuario debe cerrarse automáticamente.

Este bloque debe ser **concreto, técnico, trazable y no especulativo**.

---

## Qué debes hacer

1. ✅ **Validar dependencias**: Verificar que existen las salidas de TODOS los bloques 00 a 06. Si falta alguna, detente y notifícalo.
2. ✅ **Cargar contexto acumulado**: Leer TODAS las salidas de los bloques 00 a 06 ya generadas. Este bloque debe consolidar riesgos y discrepancias de TODOS los bloques anteriores, no solo identificar nuevos.
3. Leer `doc-plan/doc-base/01-Briefing.md` para recuperar el marco general, los límites y el propósito del cambio.
4. Leer `doc-plan/doc-base/02-Improvement-Spec.md` para identificar:
   - qué se pretende lograr;
   - qué requisitos funcionales deben cumplirse;
   - qué condiciones, excepciones y criterios de aceptación pueden condicionar riesgos o decisiones.
5. Revisar los hallazgos acumulados de los bloques anteriores para identificar:
   - riesgos técnicos;
   - riesgos de seguridad;
   - riesgos de validación;
   - riesgos derivados de dependencias y condicionantes;
   - discrepancias entre objetivo y realidad;
   - y puntos inciertos que requieran decisión.
6. Inspeccionar el repositorio, cuando sea necesario, para confirmar o reforzar la base de esos riesgos o discrepancias.
7. Distinguir claramente entre:
   - riesgo técnico;
   - riesgo de seguridad;
   - riesgo de validación o cobertura;
   - discrepancia entre objetivo y realidad;
   - decisión abierta;
   - e incertidumbre pendiente de confirmación.
8. Documentar los riesgos de forma concreta, indicando:
   - qué podría ocurrir;
   - por qué;
   - qué parte del sistema o del cambio se vería afectada;
   - y por qué sería relevante.
9. Documentar toda discrepancia relevante entre lo que se quiere lograr y lo que realmente permite o muestra el repo.
10. Proponer alternativas técnicas tentativas solo cuando hagan falta para estructurar una decisión del usuario.
11. Formular las decisiones abiertas de forma explícita, concreta y accionable.
12. Indicar qué riesgos o decisiones deberían arrastrarse con especial cuidado a trabajos posteriores.

---

## Qué no debes hacer

No debes:

- cerrar por tu cuenta decisiones que requieran aprobación del usuario;
- ocultar discrepancias por comodidad narrativa;
- convertir este bloque en una lista genérica de riesgos típicos;
- formular riesgos abstractos sin base suficiente en el sistema real;
- confundir un riesgo con una decisión abierta;
- confundir una incertidumbre puntual con una incompatibilidad real;
- inventar alternativas técnicas sin anclaje razonable en el repo;
- suavizar un problema real usando lenguaje ambiguo;
- convertir este bloque en un plan de mitigación exhaustivo o en una planificación de sprint.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Alcance del análisis del bloque
Debe indicar:

- qué parte del cambio se ha tomado como referencia;
- qué hallazgos previos se han usado;
- y hasta qué nivel de fiabilidad ha podido consolidarse el análisis de riesgos y decisiones abiertas.

### 2. Resumen ejecutivo de riesgos y decisiones
Debe sintetizar, de forma breve y precisa:

- cuáles son los principales riesgos detectados;
- qué discrepancias relevantes existen;
- qué decisiones abiertas requieren intervención del usuario;
- y qué puntos podrían condicionar especialmente el trabajo posterior.

### 3. Riesgos técnicos
Debe documentar riesgos derivados, por ejemplo si aplica, de:

- cambios estructurales;
- acoplamientos;
- dependencias críticas;
- integraciones;
- contratos rígidos;
- complejidad de modificación;
- impacto transversal;
- regresión técnica;
- compatibilidad;
- mantenimiento;
- o baja observabilidad del cambio.

Cada riesgo debe formularse de forma concreta.

### 4. Riesgos de seguridad
Debe recoger los riesgos de seguridad identificados o amplificados por el cambio, conectados con el análisis real del sistema.

No debes repetir el bloque de seguridad, sino traer aquí solo los riesgos que deban quedar expresamente registrados como tales.

### 5. Riesgos de validación o cobertura
Debe señalar riesgos derivados de:

- cobertura insuficiente;
- mecanismos de validación débiles o ausentes;
- dificultad para verificar partes sensibles del cambio;
- o exposición a regresión sin soporte suficiente de comprobación.

### 6. Discrepancias entre objetivo y realidad
Debe documentar toda discrepancia relevante entre:

- lo que se quiere lograr según `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md`;
- y lo que realmente permite o muestra el repositorio.

No debes ocultar ni resumir en exceso estas discrepancias.

### 7. Decisiones abiertas que requieren intervención del usuario
Debe recoger los puntos que no deben cerrarse automáticamente y que exigen decisión, validación o alineación por parte del usuario.

Solo deben incluirse decisiones que afecten realmente:

- al enfoque técnico;
- a la viabilidad del cambio;
- al alcance técnico real;
- a la compatibilidad con el sistema actual;
- a riesgos relevantes;
- o a discrepancias no resueltas.

### 8. Alternativas técnicas tentativas
Cuando una discrepancia o decisión abierta lo requiera, debes proponer alternativas técnicas tentativas.

Estas alternativas no son decisiones finales.  
Su función es ayudar al usuario a decidir con mejor base.

Debes plantearlas de forma:

- concreta;
- razonada;
- compatible con la realidad observada del repo;
- y claramente marcadas como alternativas, no como cierre automático.

### 9. Recomendaciones razonadas
Debe indicar, cuando exista base suficiente:

- qué alternativa parece más coherente con el estado actual del sistema;
- qué opción reduce más fricción, riesgo o desviación;
- o qué decisión convendría priorizar antes de avanzar.

No debes convertir esta sección en una imposición.  
Debe ser una recomendación razonada, no una resolución unilateral.

### 10. Observaciones para trabajos posteriores
Debe indicar qué riesgos y decisiones deberían arrastrarse de forma explícita a la siguiente capa de trabajo técnico y documental.

### 11. Evidencia principal utilizada
Debe dejar trazabilidad mínima de:

- qué módulos, archivos, contratos, configuraciones o hallazgos previos sostienen los riesgos y discrepancias documentados;
- qué evidencia respalda cada grupo principal de observaciones;
- y dónde existen límites de confianza.

### 12. Bloqueos o límites del análisis
Solo si aplica.

Debe indicar:

- qué parte del análisis de riesgos o decisiones no pudo cerrarse con suficiente fiabilidad;
- por qué;
- qué evidencia faltó;
- y cómo condiciona eso la confianza del bloque.

---

## Estructura obligatoria para cada discrepancia relevante

Cada discrepancia relevante debe documentarse con esta estructura exacta:

- **Discrepancia detectada**
- **Evidencia en el repo**
- **Impacto sobre la implementación**
- **Alternativas de vía técnica**
- **Recomendación razonada**
- **Decisión requerida al usuario**

Esta estructura es obligatoria.  
No debes sustituirla por formulaciones más vagas o resumidas.

---

## Formato recomendado

Debes priorizar formatos estructurados y comparativos.

Cuando sea útil, usa tablas como esta para riesgos:

| Riesgo | Tipo | Origen / causa | Área afectada | Impacto potencial | Nivel de certeza | Notas |
|---|---|---|---|---|---|---|

Y tablas como esta para decisiones abiertas:

| Decisión abierta | Motivo | Evidencia relacionada | Alternativas tentativas | Recomendación razonada | Requiere decisión de usuario |
|---|---|---|---|---|---|

También puedes usar agrupaciones como:

- **riesgos técnicos**
- **riesgos de seguridad**
- **riesgos de validación**
- **discrepancias**
- **decisiones abiertas**
- **pendientes de confirmación**

Pero no uses estas categorías si no están justificadas por evidencia.

---

## Criterios de clasificación recomendados

Cuando clasifiques hallazgos en este bloque, usa criterios como estos:

### Riesgo técnico
Cuando existe una posibilidad relevante de fallo, complejidad, regresión, incompatibilidad o impacto no deseado derivado de la intervención técnica.

### Riesgo de seguridad
Cuando existe una posibilidad relevante de degradación de controles, exposición, acceso indebido o debilitamiento de protecciones.

### Riesgo de validación o cobertura
Cuando el proyecto no ofrece soporte suficiente para comprobar con confianza un aspecto importante del cambio.

### Discrepancia
Cuando existe una diferencia significativa entre el objetivo definido y la realidad observable del sistema.

### Decisión abierta
Cuando hay un punto relevante que no debe cerrarse automáticamente y requiere criterio del usuario.

### Pendiente de confirmación
Cuando existen indicios razonables, pero no suficiente evidencia para afirmar el hallazgo con seguridad.

---

## Requisitos de calidad de este bloque

La salida debe ser:

- concreta;
- técnica;
- verificable;
- trazable;
- no ambigua;
- no especulativa;
- útil para el trabajo posterior;
- y suficientemente clara como para evitar que riesgos o decisiones importantes queden difuminados.

No debe ser:

- retórica;
- genérica;
- complaciente;
- alarmista sin evidencia;
- una lista de riesgos estándar;
- ni una recopilación desordenada de dudas sin estructura.

---

## Señales de mala ejecución que debes evitar

Evita especialmente estos errores:

- mezclar riesgo, discrepancia y decisión abierta como si fueran lo mismo;
- documentar riesgos sin explicar por qué importan;
- formular decisiones abiertas demasiado vagas para que el usuario pueda responderlas;
- proponer alternativas sin anclaje real en el repo;
- suavizar fricciones importantes entre objetivo y realidad;
- ocultar incertidumbre cuando la evidencia no sea suficiente;
- registrar como “discrepancia” algo que solo es una duda menor;
- dejar recomendaciones ambiguas o sin justificación.

---

## Instrucción final del bloque

Tu tarea en este bloque es **hacer visibles, con claridad y evidencia, los riesgos reales y las decisiones que no deben cerrarse automáticamente**, para que el trabajo posterior no arrastre problemas ocultos ni supuestos no validados.

Debes producir una salida clara, estructurada y verificable, que permita cerrar el análisis del **Plan Técnico de Intervención** con el menor nivel posible de ambigüedad.

## Salida/Resultado

Guarda tu respuesta/resultado en un archivo (con índice de contenido) en doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Alcance del análisis del bloque
2. Resumen ejecutivo de riesgos y decisiones
3. Riesgos técnicos
4. Riesgos de seguridad
5. Riesgos de validación o cobertura
6. Discrepancias entre objetivo y realidad
7. Decisiones abiertas que requieren intervención del usuario
8. Alternativas técnicas tentativas
9. Recomendaciones razonadas
10. Observaciones para trabajos posteriores
11. Evidencia principal utilizada
12. Bloqueos o límites del análisis
