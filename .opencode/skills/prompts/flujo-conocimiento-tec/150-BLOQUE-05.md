# 150-BLOQUE-05

## Nombre del bloque

**Validación técnica**

## Propósito del bloque

Este bloque tiene como objetivo definir qué debe comprobarse técnicamente para sostener con confianza el cambio deseado, tomando como referencia:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio
- y los hallazgos acumulados en los bloques anteriores

Su función es dejar explícito:

- qué aspectos técnicos deben validarse;
- qué mecanismos de validación ya existentes en el repo pueden y deben aprovecharse;
- qué cobertura mínima razonable debería contemplarse;
- qué zonas del cambio exigen especial atención en pruebas o comprobaciones;
- y qué limitaciones de validación existen en el estado actual del proyecto.

Este bloque no debe detallar todavía casos de prueba exhaustivos por sprint ni convertirse en un plan detallado de QA.  
Su foco es **definir la base técnica mínima de validación que el trabajo posterior deberá respetar y aprovechar**.

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

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Debes mantener siempre esta jerarquía:

1. El código del repositorio manda como realidad actual.
2. `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.
3. Las necesidades de validación deben derivarse del cambio real, no de plantillas genéricas.
4. La validación debe apoyarse preferentemente en mecanismos existentes del repo.
5. Si una validación parece necesaria pero el repo no ofrece soporte suficiente, debes indicarlo explícitamente como limitación, gap o riesgo.

Este bloque debe ser **técnico, concreto, trazable y no especulativo**.

---

## Qué debes hacer

1. ✅ **Validar dependencias**: Verificar que existen las salidas de los bloques 00 a 04. Si falta alguna, detente y notifícalo.
2. ✅ **Cargar contexto acumulado**: Leer las salidas de los bloques 00 a 04. Usa los cambios técnicos y dependencias ya identificados para centrar el análisis de validación.
3. Leer `doc-plan/doc-base/01-Briefing.md` para recuperar el marco del cambio, sus límites y su propósito.
4. Leer `doc-plan/doc-base/02-Improvement-Spec.md` para identificar:
   - qué comportamientos deben quedar soportados;
   - qué requisitos funcionales deben cumplirse;
   - qué criterios de aceptación existen;
   - qué condiciones, excepciones y casos especiales deben contemplarse.
5. Revisar los hallazgos previos sobre:
   - mapa técnico de intervención;
   - cambios técnicos necesarios;
   - grado de alineación entre objetivo y realidad;
   - dependencias y condicionantes técnicos.
4. Inspeccionar el repositorio para localizar mecanismos de validación ya existentes, por ejemplo si aplica:
   - suites de pruebas;
   - utilidades de test;
   - helpers;
   - fixtures;
   - mocks;
   - patrones de testing;
   - tests unitarios;
   - tests de integración;
   - validaciones contractuales;
   - verificaciones automatizadas;
   - scripts de comprobación;
   - linters relevantes;
   - validaciones de build;
   - mecanismos de smoke o chequeos automáticos;
   - observabilidad o señales de verificación ya integradas.
5. Identificar qué debe validarse técnicamente para sostener el cambio con suficiente confianza.
6. Relacionar cada necesidad de validación con:
   - el tipo de cambio técnico;
   - el riesgo asociado;
   - el mecanismo existente que podría aprovecharse;
   - o la limitación actual del proyecto si dicho mecanismo no existe o no es suficiente.
7. Distinguir claramente entre:
   - validaciones que ya tienen soporte razonable en el repo;
   - validaciones que requieren ampliar o adaptar mecanismos existentes;
   - y validaciones necesarias que hoy carecen de cobertura suficiente.
8. Señalar qué partes del cambio exigen validación reforzada por:
   - sensibilidad funcional;
   - dependencia transversal;
   - impacto en seguridad;
   - riesgo de regresión;
   - complejidad de integración;
   - o acoplamiento relevante.
9. Indicar qué hallazgos de este bloque condicionarán especialmente:
   - seguridad integrada;
   - riesgos y decisiones abiertas;
   - y la posterior generación de documentos operativos de mayor detalle.

---

## Qué no debes hacer

No debes:

- diseñar todavía casos de prueba exhaustivos por sprint;
- convertir este bloque en un test plan completo de ejecución;
- proponer una estrategia de testing completamente nueva ignorando la infraestructura existente del repo;
- listar tipos de pruebas genéricos sin vincularlos al cambio real;
- usar lenguaje abstracto como “habría que probarlo bien” sin concretar qué debe validarse y por qué;
- asumir cobertura inexistente por simple presencia de una carpeta de tests;
- mezclar validación técnica con checklist funcional de usuario final;
- convertir este bloque en backlog de QA o plan de despliegue.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Alcance del análisis del bloque
Debe indicar:

- qué parte del cambio se ha tomado como referencia para definir validación;
- qué zonas del sistema y del repo se han revisado;
- y hasta qué nivel de fiabilidad ha podido evaluarse la base actual de validación.

### 2. Resumen de la estrategia de validación técnica
Debe sintetizar, de forma breve y precisa:

- qué debe validarse;
- qué mecanismos existentes parecen aprovechables;
- qué zonas requieren validación reforzada;
- y dónde existen gaps o limitaciones relevantes.

### 3. Qué debe validarse
Debe identificar los aspectos técnicos que deben comprobarse para sostener el cambio con confianza.

Pueden incluir, si la evidencia lo justifica:

- comportamiento de módulos afectados;
- coherencia entre capas;
- contratos;
- integraciones;
- validaciones de datos;
- control de errores;
- persistencia;
- side effects;
- compatibilidad;
- regresión funcional/técnica;
- o condiciones sensibles derivadas del cambio.

No debes usar esta lista si no está ligada al sistema real.

### 4. Mecanismos existentes del repo que pueden aprovecharse
Debe identificar qué piezas reales del proyecto pueden reutilizarse o servir de base para validación, por ejemplo si aplica:

- suites existentes;
- patrones de test ya presentes;
- utilidades compartidas;
- helpers;
- infraestructura de testing;
- verificaciones automatizadas;
- scripts;
- comandos;
- pipelines;
- linters;
- checks de build;
- o mecanismos observables equivalentes.

Debes explicar:

- qué mecanismo existe;
- dónde está;
- qué permite validar;
- y con qué nivel de utilidad o cobertura.

### 5. Validaciones por área o tipo de cambio
Debe relacionar la validación necesaria con las áreas o cambios técnicos identificados en bloques anteriores.

Para cada área o tipo de cambio relevante, debe indicar:

- qué debe comprobarse;
- por qué;
- qué mecanismo existente podría aprovecharse;
- y qué limitaciones presenta la base actual.

### 6. Cobertura mínima razonable esperada
Debe dejar explícito qué nivel mínimo de validación parece razonable exigir para no arrastrar riesgos evitables.

No debes expresarlo como plan cerrado de tests, sino como base técnica mínima esperable según:

- el impacto del cambio;
- la sensibilidad de las piezas afectadas;
- la criticidad funcional;
- la exposición a regresión;
- y la infraestructura real del proyecto.

### 7. Puntos no cubiertos o insuficientemente cubiertos por los mecanismos actuales
Debe identificar:

- qué validaciones parecen necesarias pero no encuentran soporte suficiente en el repo;
- qué áreas tienen cobertura débil o ausente;
- qué huecos de validación podrían convertirse en riesgo posterior.

### 8. Áreas que requieren validación reforzada
Debe señalar los puntos del cambio que exigen especial cuidado por su impacto o sensibilidad, por ejemplo si aplica:

- zonas con alta probabilidad de regresión;
- piezas transversales;
- contratos compartidos;
- integraciones sensibles;
- validaciones críticas;
- mecanismos de seguridad;
- persistencia;
- o flujos con efectos indirectos significativos.

### 9. Observaciones que condicionan bloques posteriores
Debe indicar qué hallazgos de este bloque condicionarán especialmente:

- seguridad integrada;
- riesgos y decisiones abiertas;
- y la futura elaboración de documentos operativos más detallados.

### 10. Evidencia principal utilizada
Debe dejar trazabilidad mínima de:

- qué mecanismos, suites, utilidades, scripts, configuraciones o estructuras del repo sostienen el análisis;
- qué evidencia permite afirmar que existe o no base suficiente de validación;
- y dónde existen límites de confianza.

### 11. Bloqueos o límites del análisis
Solo si aplica.

Debe indicar:

- qué parte de la capacidad de validación no pudo determinarse con suficiente fiabilidad;
- por qué;
- qué evidencia faltó;
- y cómo condiciona eso la confianza del análisis.

---

## Formato recomendado

Debes priorizar formatos estructurados y comparativos.

Cuando sea útil, usa tablas como esta:

| Área o cambio a validar | Motivo | Riesgo asociado | Mecanismo existente en el repo | Tipo de validación posible | Cobertura actual estimada | Gap o limitación | Notas |
|---|---|---|---|---|---|---|---|

También puedes usar agrupaciones como:

- **validación ya soportada**
- **validación parcialmente soportada**
- **requiere ampliar mecanismos existentes**
- **sin cobertura suficiente**
- **requiere validación reforzada**

Pero no uses estas categorías si no están justificadas por evidencia.

---

## Criterios de clasificación recomendados

Cuando clasifiques necesidades de validación, usa criterios como estos:

### Validación ya soportada
Cuando el repo ofrece mecanismos existentes razonablemente adecuados para comprobar el aspecto afectado.

### Validación parcialmente soportada
Cuando existe base de validación, pero es incompleta, limitada o no cubre suficientemente el cambio esperado.

### Requiere ampliar mecanismos existentes
Cuando el repo tiene infraestructura útil, pero esta debe extenderse o adaptarse para sostener el cambio con confianza.

### Sin cobertura suficiente
Cuando no se observa soporte real suficiente para validar adecuadamente un aspecto relevante del cambio.

### Requiere validación reforzada
Cuando, por sensibilidad o impacto, el cambio exige un nivel superior de atención aunque existan mecanismos base disponibles.

---

## Requisitos de calidad de este bloque

La salida debe ser:

- concreta;
- técnica;
- verificable;
- trazable;
- no ambigua;
- no especulativa;
- útil para los bloques posteriores;
- y suficientemente clara como para evitar falsas sensaciones de cobertura o seguridad.

No debe ser:

- retórica;
- genérica;
- redundante;
- una lista abstracta de tipos de test;
- ni una recomendación desconectada del repositorio real.

---

## Señales de mala ejecución que debes evitar

Evita especialmente estos errores:

- asumir que por existir tests ya existe cobertura útil;
- enumerar tipos de prueba estándar sin conectarlos con el cambio real;
- no relacionar validación con riesgo, sensibilidad o impacto;
- ignorar mecanismos existentes del repo;
- proponer reemplazar todo el enfoque actual de validación sin base suficiente;
- no distinguir entre cobertura razonable, parcial e insuficiente;
- olvidar que seguridad, integración y regresión pueden exigir validación reforzada;
- mezclar validación técnica con pruebas de usuario final o checklist de aceptación funcional.

---

## Instrucción final del bloque

Tu tarea en este bloque es **definir la base técnica mínima de validación que el trabajo posterior deberá respetar y aprovechar**, con base en evidencia real del proyecto.

Debes producir una salida clara, estructurada y verificable, que permita continuar con el menor nivel posible de ambigüedad hacia los siguientes bloques del **Plan Técnico de Intervención**.

## Salida/Resultado

Guarda tu respuesta/resultado en un archivo (con índice de contenido) en doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Alcance del análisis del bloque
2. Resumen de validación técnica
3. Mecanismos de validación existentes
4. Validaciones necesarias por área
5. Recomendaciones de cobertura
6. Observaciones para bloques posteriores
7. Evidencia principal utilizada
8. Bloqueos o límites del análisis
