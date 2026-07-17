# 120-BLOQUE-02

## Nombre del bloque

**Cambios técnicos necesarios**

## Propósito del bloque

Este bloque tiene como objetivo definir qué cambios técnicos parecen necesarios para soportar lo pedido en:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`

tomando como referencia obligatoria:

- el código real del repositorio
- el mapa técnico identificado previamente
- y el marco metodológico definido en `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`

Su función no es planificar tareas ni secuencias de ejecución, sino **identificar, organizar y describir de forma concreta la intervención técnica que el sistema parece requerir** para soportar el cambio deseado.

Este bloque debe permitir responder, con base en evidencia real del repo:

- qué debe modificarse;
- qué debe ampliarse;
- qué debe adaptarse;
- qué debe conectarse o desacoplarse;
- qué debe endurecerse, revisarse o alinearse;
- qué parece ya soportado por el sistema actual;
- qué requiere intervención real;
- y qué puntos siguen siendo inciertos o incompatibles.

Este bloque es uno de los núcleos principales del **Plan Técnico de Intervención**.  
Debe bajar a un nivel técnico suficiente para que el trabajo posterior pueda planificarse con precisión, pero **sin convertirse aún en backlog, sprint plan o secuencia de implementación**.

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

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Debes mantener siempre esta jerarquía:

1. El código del repositorio manda como realidad actual.
2. `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.
3. El mapa técnico previo delimita la zona principal de análisis, pero no sustituye la verificación directa en el repo.
4. Solo puedes afirmar cambios técnicos necesarios cuando exista evidencia suficiente.
5. Si un cambio no puede sostenerse con mínima fiabilidad, debes indicarlo como incertidumbre, limitación o discrepancia, no presentarlo como hecho.

Este bloque debe ser **concreto, técnico, trazable y no especulativo**.

---

## Qué debes hacer

1. ✅ **Validar dependencias**: Verificar que existe la salida del Bloque 01: `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md`. Si no existe, detente y notifícalo.
2. ✅ **Cargar contexto acumulado**: Leer y considerar como base obligatoria la salida del Bloque 01. No repitas el análisis de mapeo ya realizado. Úsalo como punto de partida.
3. Leer `doc-plan/doc-base/01-Briefing.md` para recordar el objetivo, los límites y el marco general del trabajo.
4. Leer `doc-plan/doc-base/02-Improvement-Spec.md` para identificar con precisión qué cambio funcional se desea y qué exigencias funcionales debe soportar el sistema.
5. Contrastar el objetivo funcional con la realidad actual del código.
6. Identificar qué elementos técnicos requieren intervención para soportar el cambio deseado.
7. Determinar, con base en evidencia, qué debe:
   - modificarse,
   - ampliarse,
   - adaptarse,
   - conectarse,
   - desacoplarse,
   - endurecerse,
   - revisarse,
   - alinearse,
   - o preservarse.
8. Describir los cambios técnicos de forma concreta y orientada a intervención real.
9. Distinguir claramente entre:
   - lo ya soportado por el sistema actual,
   - lo que requiere cambio real,
   - lo que requiere ampliación o adaptación,
   - y lo que no puede afirmarse todavía con suficiente certeza.
10. Relacionar cada cambio técnico con el objetivo funcional que pretende soportar.
11. Indicar qué cambios parecen estructurales, qué cambios parecen localizados y qué cambios dependen de otros elementos.
12. Señalar observaciones que condicionarán:
    - validación técnica,
    - seguridad integrada,
    - dependencias y condicionantes,
    - y riesgos o decisiones abiertas.

---

## Qué no debes hacer

No debes:

- convertir este bloque en backlog;
- dividir el trabajo en tareas de sprint;
- proponer ya una secuencia de ejecución;
- redactar como si el cambio ya estuviera implementándose;
- presentar hipótesis no verificadas como si fueran hechos;
- inventar módulos, archivos, contratos o piezas inexistentes;
- repetir el mapa técnico sin aportar definición de intervención;
- limitarte a decir “habrá que revisar X” sin concretar qué tipo de cambio parece necesario y por qué;
- cerrar todavía decisiones que dependan de discrepancias no resueltas;
- convertir este bloque en diseño exhaustivo de arquitectura si el repo no lo justifica.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Alcance del análisis del bloque
Debe indicar:

- qué parte del objetivo funcional se ha contrastado;
- qué zona técnica del sistema se ha revisado;
- y hasta qué nivel de detalle ha sido posible llegar con la evidencia encontrada.

### 2. Resumen general de los cambios técnicos necesarios
Debe sintetizar de forma breve y precisa:

- qué grandes tipos de cambio parecen necesarios;
- qué zonas del sistema concentran el mayor esfuerzo técnico;
- qué parte parece ya resuelta por el sistema actual;
- y qué parte exige intervención real.

### 3. Cambios técnicos por área
Debe organizar los cambios por áreas reales del sistema, por ejemplo si aplica:

- frontend
- backend
- servicios
- persistencia
- integración
- validación
- seguridad
- configuración
- observabilidad
- despliegue
- utilidades compartidas

No debes forzar esta estructura si el repo no la soporta.  
Debes reflejar lo que realmente exista.

### 4. Cambios por módulo, servicio, componente, contrato, integración o archivo
Debe bajar al máximo nivel que permita la evidencia del repo.

Para cada elemento relevante, debe indicar:

- qué elemento es;
- dónde está;
- cuál es su situación actual observada;
- qué tipo de cambio parece necesario;
- y por qué ese cambio sería necesario para soportar el objetivo funcional.

### 5. Qué parte parece ya soportada por el sistema actual
Debe distinguir los elementos o comportamientos donde el sistema ya ofrece una base útil y no parece requerir intervención significativa, o solo requeriría ajustes menores.

Esta sección es importante para evitar sobreintervenir o inflar el alcance técnico.

### 6. Qué parte requiere adaptación, ampliación o intervención real
Debe dejar claro qué elementos sí requieren trabajo técnico relevante.

Aquí debes ser especialmente preciso.

No basta con indicar que un área “está implicada”; debes explicar:

- qué tipo de intervención parece necesaria;
- por qué;
- y cuál es su relación con el cambio deseado.

### 7. Qué parte es incierta, incompatible o dependiente de validación adicional
Debe recoger:

- zonas del sistema donde no puede afirmarse aún un cambio concreto con suficiente fiabilidad;
- incompatibilidades aparentes entre el objetivo y la realidad del repo;
- limitaciones de observación;
- o casos donde el cambio depende de validar antes otras decisiones o elementos técnicos.

### 8. Observaciones que condicionan implementación posterior
Debe indicar qué hallazgos de este bloque condicionarán especialmente:

- dependencias y condicionantes técnicos;
- validación técnica;
- seguridad integrada;
- riesgos y decisiones abiertas;
- y la futura organización del trabajo técnico posterior.

### 9. Evidencia principal utilizada
Debe dejar trazabilidad mínima de la base real del análisis.

No hace falta copiar grandes fragmentos, pero sí dejar claro:

- qué módulos, rutas, archivos, contratos o estructuras sostienen el análisis;
- qué evidencia ha permitido deducir los cambios necesarios;
- y dónde existen límites de confianza.

### 10. Bloqueos o límites del análisis
Solo si aplica.

Debe indicar:

- qué no se ha podido determinar con suficiente fiabilidad;
- por qué;
- qué evidencia ha faltado;
- y cómo condiciona eso la definición de cambios técnicos necesarios.

---

## Formato recomendado

Debes priorizar formatos estructurados y comparativos.

Cuando sea útil, usa tablas como esta:

| Elemento afectado | Tipo | Ubicación | Situación actual observada | Cambio técnico necesario | Motivo | Relación con el objetivo funcional | Nivel de certeza | Notas |
|---|---|---|---|---|---|---|---|---|

También puedes usar agrupaciones como:

- **ya soportado**
- **requiere ajuste**
- **requiere ampliación**
- **requiere intervención estructural**
- **pendiente de confirmación**
- **potencial incompatibilidad**

Pero no uses estas categorías si no están sustentadas en evidencia.

---

## Criterios de clasificación recomendados

Cuando clasifiques cambios, usa criterios como estos:

### Ya soportado
Cuando el sistema actual parece cubrir razonablemente lo necesario o dispone ya de la pieza base requerida, sin que se observe una necesidad clara de intervención relevante.

### Requiere ajuste
Cuando la base técnica ya existe, pero necesita adaptación puntual o corrección localizada para soportar el objetivo.

### Requiere ampliación
Cuando existe base parcial, pero falta capacidad, cobertura o extensión funcional/técnica suficiente.

### Requiere intervención estructural
Cuando el cambio parece afectar piezas centrales, contratos, flujos, integraciones o estructuras que no pueden resolverse solo con retoques menores.

### Pendiente de confirmación
Cuando hay indicios de intervención necesaria, pero no suficiente base para afirmarla con seguridad.

### Potencial incompatibilidad
Cuando el objetivo deseado parece entrar en fricción con la estructura, contratos o comportamiento actual observados en el repo.

---

## Requisitos de calidad de este bloque

La salida debe ser:

- concreta;
- técnica;
- verificable;
- trazable;
- no ambigua;
- no especulativa;
- útil para bloques posteriores;
- y suficientemente detallada como para evitar malentendidos sobre qué parece requerir realmente intervención.

No debe ser:

- retórica;
- genérica;
- redundante;
- una simple repetición del mapa técnico;
- ni una lista abstracta de “posibles cambios” sin anclaje claro en el repositorio.

---

## Señales de mala ejecución que debes evitar

Evita especialmente estos errores:

- describir cambios demasiado abstractos;
- no diferenciar entre lo ya soportado y lo que realmente necesita intervención;
- convertir cada elemento implicado en cambio obligatorio sin justificarlo;
- no bajar a nivel de módulo, servicio, componente o archivo cuando el repo lo permite;
- mezclar intervención técnica necesaria con decisiones de planificación;
- usar lenguaje débil o vago en lugar de describir el tipo real de cambio esperado;
- omitir la relación entre cambio técnico y objetivo funcional;
- ignorar que algunos cambios pueden depender de contratos, integraciones, validaciones o seguridad.

---

## Instrucción final del bloque

Tu tarea en este bloque es **definir con precisión qué cambios técnicos parecen necesarios para soportar el objetivo**, basándote en el contraste entre la intención funcional y la realidad del código.

Debes producir una salida clara, estructurada y basada en evidencia, que permita continuar con el menor nivel posible de ambigüedad hacia los siguientes bloques del **Plan Técnico de Intervención**.

## Salida/Resultado

Guarda tu respuesta/resultado en un archivo (con índice de contenido) en doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Alcance del análisis del bloque
2. Resumen de cambios técnicos necesarios
3. Cambios por componente / área
4. Clasificación por tipo de cambio
5. Dependencias y condicionantes
6. Observaciones para bloques posteriores
7. Evidencia principal utilizada
8. Bloqueos o límites del análisis
