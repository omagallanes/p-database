Usa la skill `pre-prompt-generator`.

Quiero que analices esta petición de trabajo teniendo en cuenta:
1. el estado actual del repositorio;
2. la gobernanza vigente;
3. la necesidad de usar la skill de Context7 como fuente de verdad externa antes de asumir conocimiento técnico no confirmado.

Tu objetivo no es ejecutar la tarea todavía, sino generar un documento previo de ejecución en `_pre-prompt/` con:
- índice de contenido;
- análisis;
- prompt final listo para revisar y, si se aprueba, usar en una nueva tarea de Roo.

## Petición de trabajo

### Contexto
<describe aquí el contexto>

### Objetivo
<describe aquí el objetivo>

### Requisitos
<lista aquí los requisitos>

### Restricciones
<lista aquí las restricciones>

### Salida esperada
<describe qué resultado final se espera>

### Información adicional
<añade cualquier detalle útil>

## Instrucciones de comportamiento

- Analiza la petición contra el repositorio actual, no contra supuestos antiguos.
- Revisa la gobernanza aplicable antes de proponer enfoque.
- Usa la skill de Context7 siempre que sea útil o necesaria para validar documentación externa, versiones, integraciones, APIs, librerías o frameworks.
- Si tras revisar repositorio, gobernanza y Context7 faltan datos críticos, no inventes nada.
- El documento debe servir para que yo revise:
  - si has entendido bien la petición;
  - si el enfoque es correcto;
  - si el prompt final es apto para ejecutarse en Roo.
- El prompt final debe asumir que el `agente-orquestador` coordinará la ejecución.
- No selecciones agentes ejecutores por nombre de archivo en la salida principal; describe las funciones necesarias y deja que el `agente-orquestador` resuelva qué agentes concretos aplicar.
- Guarda el resultado en `_pre-prompt/` con el nombre más adecuado según el trabajo solicitado.