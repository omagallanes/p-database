# 140-BLOQUE-04

## Nombre del bloque

**Dependencias y condicionantes técnicos**

## Propósito del bloque

Este bloque tiene como objetivo identificar las dependencias técnicas reales y los condicionantes estructurales que afectan al trabajo, tomando como referencia:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio
- y los hallazgos acumulados en los bloques anteriores

Su función es dejar explícito qué piezas del sistema condicionan la intervención técnica, qué relaciones o acoplamientos hay que tener en cuenta y qué restricciones observables pueden limitar, complicar o reorientar el trabajo posterior.

Este bloque debe permitir responder, con base en evidencia real del repo:

- de qué elementos depende técnicamente el cambio;
- qué contratos, configuraciones o integraciones condicionan la intervención;
- qué restricciones estructurales impone el sistema actual;
- qué acoplamientos o puntos sensibles deben respetarse;
- qué dependencias transversales pueden amplificar el impacto del cambio;
- y qué hallazgos aquí deberán tenerse especialmente en cuenta en validación, seguridad, riesgos y decisiones abiertas.

Este bloque no debe convertirse en un análisis abstracto de arquitectura ni en una planificación de ejecución.  
Su foco es **hacer visible qué condiciona técnicamente el trabajo y por qué**.

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

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Debes mantener siempre esta jerarquía:

1. El código del repositorio manda como realidad actual.
2. `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.
3. Los bloques previos ayudan a acotar y enriquecer el análisis, pero no sustituyen la verificación directa en el repo.
4. Solo puedes afirmar dependencias o condicionantes cuando exista evidencia suficiente.
5. Si una dependencia o restricción no puede sostenerse con mínima fiabilidad, debes indicarlo como incertidumbre o necesidad de confirmación.

Este bloque debe ser **técnico, comparativo, trazable y no especulativo**.

---

## Qué debes hacer

1. ✅ **Validar dependencias**: Verificar que existen las salidas de los bloques 00 a 03. Si falta alguna, detente y notifícalo.
2. ✅ **Cargar contexto acumulado**: Leer las salidas de los bloques 00, 01, 02 y 03. Usa los análisis previos para centrarte en identificar dependencias, no para repetir mapeos.
3. Leer `doc-plan/doc-base/01-Briefing.md` para recuperar el marco del cambio, sus límites y el tipo de impacto esperado.
4. Leer `doc-plan/doc-base/02-Improvement-Spec.md` para identificar qué requisitos funcionales, comportamientos y condiciones deben quedar soportados.
5. Revisar los hallazgos previos sobre:
   - mapa técnico de intervención;
   - cambios técnicos necesarios;
   - y grado de alineación entre objetivo y realidad.
6. Inspeccionar el repositorio para localizar dependencias reales que condicionan el trabajo.
7. Identificar, cuando exista evidencia suficiente:
   - dependencias internas entre módulos, servicios, componentes o capas;
   - dependencias con contratos, APIs, modelos, esquemas o eventos;
   - dependencias con integraciones internas o externas;
   - dependencias derivadas de configuración, inicialización, wiring, DI, registro, bootstrap o runtime;
   - dependencias transversales de validación, seguridad, logging, observabilidad, permisos o despliegue;
   - condicionantes impuestos por la estructura actual del sistema.
8. Distinguir claramente entre:
   - dependencias directas;
   - dependencias indirectas;
   - condicionantes estructurales;
   - restricciones técnicas observables;
   - y puntos sensibles que deben respetarse.
9. Identificar acoplamientos relevantes que puedan:
   - aumentar el alcance real;
   - complicar el cambio;
   - exigir consistencia entre varias piezas;
   - o afectar la estrategia posterior de validación.
10. Señalar configuraciones, contratos, convenciones, patrones o decisiones técnicas existentes que limiten o condicionen la intervención.
11. Indicar qué hallazgos de este bloque deberán tenerse especialmente en cuenta en:
    - la validación técnica;
    - la seguridad integrada;
    - los riesgos y decisiones abiertas;
    - y la futura organización del trabajo técnico posterior.

---

## Qué no debes hacer

No debes:
- inventar dependencias o condicionantes no soportados por evidencia;
- listar componentes sin explicar por qué condicionan el trabajo;
- confundir una relación superficial con una dependencia real;
- omitir condicionantes estructurales relevantes;
- convertir este bloque en un análisis general de arquitectura;
- proponer cambios estructurales;
- plantear ya soluciones o estrategias de implementación;
- omitir puntos sensibles transversales.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-implementar/conocimiento-tec/04-dependencias-y-condicionantes-tecnicos.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Alcance del análisis del bloque
Debe indicar:

- qué parte del cambio se ha tomado como referencia para el análisis;
- qué zonas del sistema se han revisado;
- y hasta qué nivel de fiabilidad ha podido evaluarse.

### 2. Resumen de dependencias y condicionantes
Debe sintetizar, de forma breve y precisa:

- tipo de dependencias más relevantes detectadas;
- qué zonas concentran condicionantes estructurales;
- qué puntos sensibles aparecen;
- y qué limitaciones o incertidumbres relevantes existen.

### 3. Dependencias internas
Debe identificar dependencias entre módulos, servicios, componentes o capas del propio sistema.

Para cada una, debe indicar:
- qué elemento depende de qué otro;
- tipo de relación;
- ubicación o evidencia en el repo;
- y cómo condiciona la intervención.

### 4. Dependencias externas e integraciones
Debe identificar dependencias con sistemas, APIs, servicios externos o integraciones.

### 5. Condicionantes estructurales
Debe señalar restricciones impuestas por la arquitectura actual, patrones, convenciones o decisiones técnicas existentes que condicionan la forma en que puede realizarse el cambio.

### 6. Puntos sensibles y de alto impacto
Debe identificar piezas, relaciones o mecanismos que por su naturaleza pueden amplificar el riesgo, la complejidad o la necesidad de validación.

### 7. Observaciones para bloques posteriores
Debe indicar qué hallazgos de este bloque condicionarán especialmente:

- la validación técnica;
- la seguridad integrada;
- los riesgos y decisiones abiertas;
- y la futura planificación del trabajo.

### 8. Evidencia principal utilizada
Debe dejar trazabilidad mínima de:

- qué módulos, archivos, contratos, configuraciones o estructuras sostienen el análisis;
- dónde se apoya cada tipo principal de dependencia o condicionante;
- y dónde existen límites de confianza.

### 9. Bloqueos o límites del análisis
Solo si aplica.

Debe indicar:

- qué dependencias o condicionantes no pudieron determinarse con suficiente fiabilidad;
- por qué;
- qué evidencia faltó;
- y cómo condiciona eso la solidez del análisis.

---

## Formato recomendado

Debes priorizar formatos estructurados y comparativos.

Cuando sea útil, usa tablas como esta:

| Elemento / relación | Tipo de dependencia o condicionante | Ubicación / evidencia | Qué condiciona | Impacto potencial | Nivel de certeza | Notas |
|---|---|---|---|---|---|---|

También puedes usar agrupaciones como:

- **dependencias directas**
- **dependencias indirectas**
- **condicionantes estructurales**
- **restricciones observables**
- **puntos sensibles**
- **pendientes de confirmación**

Pero no uses estas categorías si no están justificadas por evidencia.

---

## Criterios de clasificación recomendados

Cuando clasifiques dependencias y condicionantes, usa criterios como estos:

### Dependencia directa
Cuando un elemento del cambio depende de otro de forma inmediata y observable en el sistema actual.

### Dependencia indirecta
Cuando la relación no es inmediata, pero el cambio queda condicionado por una cadena técnica verificable de relaciones.

### Condicionante estructural
Cuando la estructura actual del sistema impone una limitación, rigidez o forma de trabajo relevante para el cambio.

### Restricción observable
Cuando existe una condición real del sistema que limita o encuadra lo que puede hacerse.

### Punto sensible
Cuando una pieza o relación puede amplificar impacto, complejidad, riesgo o necesidad de validación.

### Pendiente de confirmación
Cuando existen indicios razonables, pero no suficiente evidencia para afirmar la dependencia o el condicionante con seguridad.

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
- y suficientemente clara como para evitar subestimar dependencias o restricciones reales.

No debe ser:

- retórica;
- genérica;
- redundante;
- una lista indiscriminada de dependencias;
- ni un comentario abstracto sobre arquitectura sin foco en el objetivo.

---

## Señales de mala ejecución que debes evitar

Evita especialmente estos errores:

- llamar “dependencia” a cualquier relación superficial;
- listar integraciones o módulos sin explicar por qué condicionan realmente el trabajo;
- no distinguir entre dependencia directa, indirecta y condicionante estructural;
- olvidar restricciones derivadas de configuración, contratos o runtime;
- omitir puntos sensibles transversales como validación, seguridad o integración cuando el cambio los toca;
- inflar el número de condicionantes “por prudencia” sin evidencia suficiente;
- no señalar límites de confianza cuando la observación del repo sea insuficiente.

---

## Instrucción final del bloque

Tu tarea en este bloque es **hacer visible qué relaciones, restricciones y acoplamientos condicionan realmente la intervención técnica**, con base en evidencia del sistema actual.

Debes producir una salida clara, estructurada y verificable, que permita continuar con el menor nivel posible de ambigüedad hacia los siguientes bloques del **Plan Técnico de Intervención**.

## Salida/Resultado

Guarda tu respuesta/resultado en un archivo (con índice de contenido) en doc-plan/doc-implementar/conocimiento-tec/04-dependencias-y-condicionantes-tecnicos.md

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Alcance del análisis del bloque
2. Resumen de dependencias y condicionantes
3. Dependencias internas
4. Dependencias externas e integraciones
5. Condicionantes estructurales
6. Observaciones para bloques posteriores
7. Evidencia principal utilizada
8. Bloqueos o límites del análisis
