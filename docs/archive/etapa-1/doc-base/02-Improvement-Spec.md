# Improvement Spec — Mejoras en Formulario y UX del CRUD de Prompts

## 1. Propuesta de cambio

La mejora se aplica al flujo principal de gestión de prompts, que hoy se concentra en un único formulario reutilizado para alta y edición, organizado en tres áreas visibles: **Basic Information**, **Metadata** y **Advanced**. El cambio debe mantener esa estructura general y su lógica visual actual, pero evolucionar el comportamiento funcional de los campos, la continuidad del flujo de edición y la forma de consultar el listado principal de prompts.  

### 1.1. Cambios funcionales en la sección Metadata

La sección **Metadata** pasa a ser uno de los focos principales de la mejora. Hoy contiene `Type`, `Platform`, `Model Hint`, `Language`, `Use Case`, `Client/Project`, `Status`, `Category`, `Tags` y `Favorite`, pero varios de esos campos siguen comportándose como valores únicos o demasiado rígidos respecto al uso real esperado.  

#### a) Tags

El campo `Tags` debe permitir dos comportamientos dentro del propio formulario:

* seleccionar tags ya existentes;
* crear nuevos tags desde el formulario;
* ver el nuevo tag inmediatamente seleccionado tras crearlo;
* quitar un tag seleccionado antes de guardar;
* dejar el nuevo tag disponible para reutilización posterior.

El patrón de interacción de `Tags` pasa a ser la referencia funcional para otros campos multivalor de Metadata. Actualmente `tags` ya es el único caso claramente multivalor en la UI y en el modelo funcional del prompt, por lo que esta mejora extiende ese patrón a otros campos.  

#### b) Platform

`Platform` deja de funcionar como un valor único y pasa a comportarse como un campo multivalor. El usuario debe poder:

* seleccionar plataformas ya existentes;
* crear plataformas nuevas desde el propio formulario;
* ver una nueva plataforma seleccionada inmediatamente después de crearla;
* quitar plataformas seleccionadas antes de guardar;
* reutilizar después las plataformas creadas.

Visualmente, el comportamiento debe seguir el mismo patrón funcional que `Tags`. El objetivo no es solo permitir más de una plataforma, sino que la interacción sea coherente con los campos multivalor del formulario. El análisis actual muestra que hoy `platform` es un único select con opciones cerradas, por lo que esta mejora cambia de forma visible el comportamiento esperado del campo.  

#### c) Category

`Category` deja de ser una selección única y pasa a permitir varias selecciones para un mismo prompt. El usuario debe poder:

* seleccionar varias categorías existentes;
* ver varias categorías asociadas a un mismo prompt;
* quitar categorías seleccionadas antes de guardar.

Esta mejora no incluye crear nuevas categorías desde el formulario. La selección debe limitarse a categorías ya existentes. El contexto actual muestra que hoy `category` se presenta como un único select y que el esquema documentado del producto lo trata como relación simple, por lo que el cambio funcional consiste en permitir una asociación múltiple visible para el usuario.   

#### d) Client/Project, Use Case y Model Hint

`Client/Project`, `Use Case` y `Model Hint` deben pasar a comportarse como campos multivalor, siguiendo el mismo patrón funcional que `Tags`. El usuario debe poder:

* seleccionar valores ya existentes;
* crear nuevos valores desde el formulario;
* ver inmediatamente seleccionados los valores recién creados;
* quitar valores seleccionados antes de guardar;
* reutilizar después los valores creados.

El requisito aquí no es solo admitir varios valores, sino hacerlo con una interacción consistente y reconocible dentro de la sección **Metadata**. Según el briefing actualizado, estos tres campos forman parte explícita del alcance y deben alinearse con el patrón funcional de `tags`. 

#### e) Language

`Language` deja de comportarse como un campo de texto libre y pasa a ser un **selector simple**. Su comportamiento esperado es:

* selección de un único idioma;
* obligatoriedad funcional;
* presencia de una opción por defecto;
* uso de un conjunto predefinido de opciones.

El análisis actual muestra que hoy `Language` es un input de texto con valor por defecto `en`, así que el cambio funcional no consiste en hacerlo multivalor, sino en sustituir el modo libre por una selección simple guiada.  

### 1.2. Cambios funcionales en la sección Basic Information

La sección **Basic Information** debe conservar su papel actual como bloque principal de contenido del prompt, pero ampliarse con nuevos campos visibles después de `Prompt Body`. Hoy esta sección solo contiene `Title`, `Description` y `Body`. La mejora añade cuatro piezas funcionales nuevas. 

Después de `Prompt Body`, y en este orden, deben incorporarse:

1. `Pre-Prompt`
2. `Manual de uso`
3. `Fecha de creación`
4. `Fecha de actualización`

El comportamiento esperado de estos campos es el siguiente:

* `Pre-Prompt` es un campo persistente del prompt;
* `Manual de uso` es un campo persistente del prompt;
* ambos son opcionales;
* `Fecha de creación` y `Fecha de actualización` son visibles pero no editables;
* en modo alta, antes del primer guardado, esas fechas no deben mostrarse;
* una vez que el prompt ya existe, ambas fechas deben ser visibles en el formulario.

El briefing actualizado fija expresamente que la mejora en Basic Information consiste en ampliar el contenido visible del prompt sin cambiar la estructura general del formulario. 

### 1.3. Continuidad del flujo tras guardar y duplicar

Hoy el comportamiento documentado del formulario hace que, tras guardar o duplicar, el usuario salga del contexto del prompt y vuelva al listado. La mejora cambia ese comportamiento para reforzar la continuidad del trabajo sobre el registro. 

#### a) Guardar desde alta

Cuando el usuario crea un prompt desde `New Prompt` y pulsa `Save`:

* no debe volver al listado;
* debe permanecer en la pantalla del formulario;
* el prompt debe pasar a estado de registro existente;
* el formulario debe quedar en modo edición del prompt recién creado;
* desde ese momento deben mostrarse las acciones correspondientes a edición.

#### b) Guardar desde edición

Cuando el usuario edita un prompt ya existente y pulsa `Save`:

* debe seguir en el mismo prompt;
* no debe volver al listado;
* debe mantenerse la continuidad del trabajo en esa misma pantalla.

#### c) Duplicar

Cuando el usuario pulsa `Duplicate` sobre un prompt existente:

* debe generarse el nuevo prompt duplicado;
* el usuario no debe volver al listado;
* debe abrirse directamente el nuevo prompt duplicado;
* el nuevo registro debe quedar en modo edición.

Esto responde al contraste entre el comportamiento actual documentado y el objetivo fijado en el briefing, que pone el foco en no expulsar al usuario del contexto del formulario.  

### 1.4. Cambio de denominación de la acción de acceso al prompt

En el listado de prompts, la acción visible hoy como `View` debe pasar a llamarse `Edit`. El análisis actual deja claro que ese acceso lleva realmente al formulario reutilizado en modo edición, no a una vista separada de lectura. Por tanto, la mejora debe alinear el texto visible con el comportamiento real del sistema. 

Este cambio debe aplicarse:

* en la vista actual en cards;
* en la nueva vista lista.

### 1.5. Cambios funcionales en el listado de prompts

Hoy el listado principal funciona como grid de cards con copy, badges, datos de uso y un botón `View`. La mejora debe conservar esa vista y añadir una segunda forma de consulta. 

#### a) Selector de visualización

El listado de `/prompts` debe ofrecer dos modos concretos de visualización:

* **cajas**
* **lista (grid)**

La vista actual en cajas se mantiene. La nueva vista lista se incorpora como alternativa funcional adicional.

#### b) Persistencia de la vista elegida

La vista elegida por el usuario debe mantenerse para ese usuario autenticado hasta que la cambie. La persistencia se aplica solo al listado de prompts y forma parte del comportamiento esperado de entrada a esa pantalla, no de una preferencia global para toda la aplicación. El briefing actualizado incluye expresamente esta persistencia como parte del alcance. 

#### c) Información mínima visible en la vista lista

En la nueva vista lista, cada registro debe mostrar al menos:

* acción `Copy`;
* acción `Edit`;
* título;
* icono de favorito como estrella;
* estado;
* plataformas;
* categorías;
* tags;
* cliente/proyecto.

No deben mostrarse en el listado:

* `Pre-Prompt`;
* `Manual de uso`.

La lista debe ser una forma más densa de consulta operativa, no una repetición exacta de la card actual ni una vista extendida de detalle.

### 1.6. Filtros afectados por la mejora

El listado actual dispone de filtros por `Category`, `Platform`, `Status`, `Language`, `Tags` y `Favorite`, con `Category` y `Platform` en modo simple. Dado que la mejora cambia la semántica visible de algunos campos del prompt, los filtros que dependan de esos campos deben alinearse con el nuevo comportamiento. 

En particular:

* `Platform` debe permitir varias selecciones;
* `Category` debe permitir varias selecciones;
* cuando haya varias selecciones dentro de uno de esos filtros, el listado solo debe mostrar prompts que cumplan **todos** los valores elegidos en ese filtro.

La lógica funcional esperada es acumulativa dentro del propio filtro.

### 1.7. Exportación afectada por la mejora

La mejora afecta funcionalmente a la exportación porque el prompt pasa a incorporar nuevos campos visibles y nuevos comportamientos multivalor. El briefing actualizado ya asume que la exportación es un impacto asociado de la mejora y que el formato actual debe mantenerse como base.

A nivel funcional, el resultado esperado es que la exportación:

* no pierda la información nueva añadida al prompt;
* refleje correctamente los campos que pasan a admitir varios valores;
* siga siendo coherente con el formato funcional actual del producto.

## 2. Requisitos funcionales

### Formulario — Metadata

**RF-01.** El sistema debe permitir seleccionar tags existentes desde el formulario del prompt.

**RF-02.** El sistema debe permitir crear nuevos tags desde el formulario del prompt.

**RF-03.** Todo tag nuevo creado desde el formulario debe quedar seleccionado de inmediato.

**RF-04.** El usuario debe poder quitar tags seleccionados antes de guardar.

**RF-05.** Los tags creados desde el formulario deben quedar disponibles para reutilización posterior.

**RF-06.** `Platform` debe admitir varios valores para un mismo prompt.

**RF-07.** El usuario debe poder seleccionar plataformas existentes desde el formulario.

**RF-08.** El usuario debe poder crear plataformas nuevas desde el formulario.

**RF-09.** Toda plataforma nueva creada desde el formulario debe quedar seleccionada de inmediato.

**RF-10.** El usuario debe poder quitar plataformas seleccionadas antes de guardar.

**RF-11.** Las plataformas creadas desde el formulario deben quedar disponibles para reutilización posterior.

**RF-12.** `Category` debe admitir varias categorías para un mismo prompt.

**RF-13.** El usuario solo debe poder seleccionar categorías ya existentes.

**RF-14.** El usuario debe poder quitar categorías seleccionadas antes de guardar.

**RF-15.** `Client/Project` debe admitir varios valores.

**RF-16.** `Use Case` debe admitir varios valores.

**RF-17.** `Model Hint` debe admitir varios valores.

**RF-18.** En `Client/Project`, `Use Case` y `Model Hint`, el usuario debe poder seleccionar valores existentes.

**RF-19.** En `Client/Project`, `Use Case` y `Model Hint`, el usuario debe poder crear nuevos valores desde el formulario.

**RF-20.** En `Client/Project`, `Use Case` y `Model Hint`, todo valor nuevo creado debe quedar seleccionado de inmediato.

**RF-21.** En `Client/Project`, `Use Case` y `Model Hint`, el usuario debe poder quitar valores seleccionados antes de guardar.

**RF-22.** Los valores creados en `Client/Project`, `Use Case` y `Model Hint` deben quedar disponibles para reutilización posterior.

**RF-23.** `Language` debe pasar a ser un selector simple.

**RF-24.** `Language` debe ser obligatorio.

**RF-25.** `Language` debe mostrar una opción por defecto.

### Formulario — Basic Information

**RF-26.** Después de `Prompt Body`, el formulario debe mostrar `Pre-Prompt`, `Manual de uso`, `Fecha de creación` y `Fecha de actualización`, en ese orden.

**RF-27.** `Pre-Prompt` debe ser opcional.

**RF-28.** `Manual de uso` debe ser opcional.

**RF-29.** `Fecha de creación` debe ser visible y no editable cuando el prompt ya exista.

**RF-30.** `Fecha de actualización` debe ser visible y no editable cuando el prompt ya exista.

**RF-31.** En modo alta, `Fecha de creación` y `Fecha de actualización` no deben mostrarse antes del primer guardado.

### Continuidad del flujo

**RF-32.** Al guardar un prompt nuevo, el usuario debe permanecer en la pantalla del formulario.

**RF-33.** Tras guardar un prompt nuevo, el formulario debe quedar en modo edición del registro creado.

**RF-34.** Tras guardar un prompt nuevo, deben aparecer las acciones propias del modo edición.

**RF-35.** Al guardar un prompt existente, el usuario debe permanecer en la pantalla del mismo prompt.

**RF-36.** Al duplicar un prompt existente, el usuario debe pasar al prompt duplicado en modo edición.

### Listado y navegación

**RF-37.** El listado de prompts debe ofrecer dos modos de visualización: `cajas` y `lista (grid)`.

**RF-38.** La acción visible hoy como `View` debe pasar a mostrarse como `Edit` en el listado.

**RF-39.** La preferencia de visualización elegida por el usuario debe mantenerse hasta que el propio usuario la cambie.

**RF-40.** La persistencia de esa preferencia debe aplicarse solo al listado de prompts.

**RF-41.** La vista lista debe mostrar `Copy` y `Edit` como acciones visibles por registro.

**RF-42.** La vista lista debe mostrar título, estrella de favorito, estado, plataformas, categorías, tags y cliente/proyecto.

**RF-43.** `Pre-Prompt` y `Manual de uso` no deben mostrarse en el listado.

### Filtros

**RF-44.** El filtro de `Platform` debe admitir varias selecciones.

**RF-45.** El filtro de `Category` debe admitir varias selecciones.

**RF-46.** Cuando haya varios valores seleccionados en `Platform`, el listado debe mostrar solo prompts que cumplan todos esos valores.

**RF-47.** Cuando haya varios valores seleccionados en `Category`, el listado debe mostrar solo prompts que cumplan todos esos valores.

### Exportación

**RF-48.** La exportación debe incluir la información nueva que forme parte del prompt tras esta mejora.

**RF-49.** La exportación debe reflejar correctamente los campos que pasan a admitir varios valores.

**RF-50.** La exportación debe seguir siendo coherente con el formato funcional actual del producto.

## 3. Criterios de aceptación

1. **Tags**

   * Dado un formulario de prompt, cuando el usuario crea un tag nuevo, el tag queda seleccionado en ese prompt y puede volver a usarse más adelante.

2. **Platform multivalor**

   * Dado un formulario de prompt, cuando el usuario selecciona o crea varias plataformas, el prompt puede conservar varias plataformas asociadas y el usuario puede quitar cualquiera antes de guardar.

3. **Category múltiple**

   * Dado un formulario de prompt, cuando el usuario selecciona varias categorías existentes, el prompt queda asociado a varias categorías y el usuario puede quitar cualquiera antes de guardar.

4. **Client/Project, Use Case y Model Hint**

   * Dado un formulario de prompt, cada uno de esos campos permite seleccionar varios valores, crear nuevos valores y quitar valores seleccionados antes de guardar, con un comportamiento coherente con el de `Tags`.

5. **Language**

   * Dado un formulario de prompt, `Language` se presenta como selector simple, requiere un valor y muestra una opción por defecto.

6. **Nuevos campos en Basic Information**

   * Dado un prompt existente, el formulario muestra `Pre-Prompt` y `Manual de uso` como campos editables y persistentes.
   * Dado un prompt existente, el formulario muestra `Fecha de creación` y `Fecha de actualización` como valores visibles y no editables.
   * Dado un prompt nuevo aún no guardado, las fechas no aparecen.

7. **Guardar desde alta**

   * Dado un prompt nuevo, cuando el usuario pulsa `Save` y la operación se completa correctamente, permanece en el formulario y el registro pasa a modo edición.

8. **Guardar desde edición**

   * Dado un prompt existente, cuando el usuario pulsa `Save` y la operación se completa correctamente, permanece en el mismo prompt.

9. **Duplicar**

   * Dado un prompt existente, cuando el usuario pulsa `Duplicate` y la operación se completa correctamente, se abre el nuevo prompt duplicado en modo edición.

10. **Cambio de etiqueta View → Edit**

    * En cualquier vista del listado, la acción para abrir el prompt se muestra como `Edit`.

11. **Nueva vista del listado**

    * Dado el listado de prompts, el usuario puede alternar entre `cajas` y `lista (grid)`.

12. **Persistencia de vista**

    * Dado un usuario autenticado, cuando cambia de vista, la siguiente vez que accede al listado de prompts encuentra la última vista que eligió.

13. **Contenido de la vista lista**

    * En la vista lista, cada prompt muestra `Copy`, `Edit`, título, estrella de favorito, estado, plataformas, categorías, tags y cliente/proyecto.

14. **Filtros multivalor**

    * Dado el listado, cuando el usuario selecciona varios valores en `Platform` o en `Category`, solo se muestran prompts que cumplen todos los valores elegidos en ese filtro.

15. **Exportación**

    * Cuando se exportan prompts, el resultado mantiene la información nueva añadida por esta mejora y representa correctamente los campos que pasan a ser multivalor.

## 4. Condiciones, excepciones y casos especiales

* `Pre-Prompt` y `Manual de uso` son opcionales y su ausencia no debe impedir guardar el prompt.

* `Fecha de creación` y `Fecha de actualización` no aparecen en modo alta antes del primer guardado.

* `Language` debe tener una opción por defecto visible y no debe quedar sin valor seleccionado.

* `Client/Project`, `Use Case` y `Model Hint` deben seguir un patrón funcional coherente con `Tags`, aunque no tengan por qué describirse visualmente como una copia textual del mismo campo en todos los documentos posteriores.

* La mejora no incluye crear categorías nuevas desde el formulario del prompt.

* La mejora no cambia el comportamiento funcional de `Type`, `Status`, `Favorite`, `Version`, `Changelog` o `Notes`, salvo el impacto visual indirecto de permanecer en edición tras guardar o duplicar. El análisis actual los describe como campos ya presentes en el formulario y sin petición específica de cambio dentro de esta iniciativa. 

* La vista lista debe incluir estrella de favorito solo como icono.

* `Pre-Prompt` y `Manual de uso` no forman parte del contenido visible del listado.

* La lógica acumulativa de filtros aplica dentro del propio filtro cuando hay más de un valor seleccionado.

* Esta mejora debe convivir con las reglas actuales de edición y borrado de prompts existentes, incluidas las restricciones por ownership y rol ya documentadas. 

## 5. Impactos y dependencias funcionales

* La mejora afecta el flujo principal de trabajo sobre prompts: alta, edición, duplicado, consulta del listado y gestión de la información visible del prompt. El análisis de UI deja claro que estas son las pantallas y componentes centrales del producto.

* Afecta directamente la coherencia entre las áreas **Basic Information** y **Metadata**, porque la mejora reparte cambios funcionales relevantes entre ambas secciones del formulario. El briefing actualizado define estas dos áreas como foco principal del cambio.

* Depende de mantener una experiencia coherente entre todos los campos multivalor que comparten patrón de uso: `Tags`, `Platform`, `Client/Project`, `Use Case` y `Model Hint`.

* Impacta la comprensión funcional del listado, porque la acción principal de acceso al prompt deja de llamarse `View` y pasa a expresarse como `Edit`.

* Impacta el comportamiento esperado de entrada al listado, ya que la vista elegida deja de ser efímera y pasa a recordarse para el usuario autenticado. El briefing actualizado incorpora expresamente esa expectativa. 

* Puede afectar la coherencia con filtros y exportación, ya que ambos flujos consumen o representan información del prompt que cambia de comportamiento visible con esta mejora. El briefing actualizado ya identifica ambos como impactos asociados.

* Depende de mantener la organización actual del formulario en tres áreas visibles, ya que la mejora se apoya en esa estructura en lugar de sustituirla.

## 6. Instrumentación / analytics

Deben quedar medibles, como mínimo, las siguientes señales funcionales:

1. **Uso de creación de valores desde el formulario**

   * creación de nuevo tag;
   * creación de nueva plataforma;
   * creación de nuevo valor en `Client/Project`;
   * creación de nuevo valor en `Use Case`;
   * creación de nuevo valor en `Model Hint`.

2. **Uso de selección multivalor**

   * número de prompts guardados con más de una plataforma;
   * número de prompts guardados con más de una categoría;
   * número de prompts guardados con más de un valor en `Client/Project`;
   * número de prompts guardados con más de un valor en `Use Case`;
   * número de prompts guardados con más de un valor en `Model Hint`.

3. **Continuidad del flujo**

   * número de altas que terminan permaneciendo en el formulario en modo edición;
   * número de guardados en edición que terminan manteniendo al usuario en el mismo prompt;
   * número de duplicados que terminan abriendo el nuevo prompt duplicado en modo edición.

4. **Uso de la nueva visualización del listado**

   * cambio de vista entre `cajas` y `lista (grid)`;
   * vista elegida;
   * aplicación de una preferencia de vista previamente recordada.

5. **Uso de filtros afectados**

   * número de veces que se usan varias selecciones en `Platform`;
   * número de veces que se usan varias selecciones en `Category`.

6. **Cambio de acceso principal al prompt**

   * uso de la acción `Edit` desde el listado, tanto en vista `cajas` como en vista `lista (grid)`.

## 7. Dudas o decisiones abiertas

1. **Exportación**

   * Debe confirmarse la representación funcional exacta de los nuevos campos y de los campos que pasan a ser multivalor dentro del formato actual de exportación/importación.

2. **Filtros**

   * Aunque ya está definido que `Platform` y `Category` deben admitir varias selecciones con lógica acumulativa, debe validarse si esta misma intervención incluye también todos los ajustes visibles necesarios del panel de filtros o si parte de ese trabajo se tratará como impacto asociado.

3. **Explicitud documental**

   * Conviene decidir si en documentos posteriores debe describirse de forma totalmente explícita que `Client/Project`, `Use Case` y `Model Hint` siguen el mismo patrón funcional que `Tags`, para evitar interpretaciones distintas entre diseño, desarrollo y validación.
