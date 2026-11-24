# MEMORIA · Decisiones, aprendizajes y estado de ASSIGNATURA WEB

> Lo que se ha decidido, lo que se ha aprendido, cómo está cada entrega y lo que falta.
> Última actualización: 23 de noviembre de 2026. Hay que actualizarlo cada vez que cambie algo importante.

---

## 1. Estado de las entregas

| Clase | Entrega | Estado |
|---|---|---|
| Daniel | Web publicada | ✅ Publicada y al día (PR #1, #3, #4 y #5 fusionadas). Quedan mejoras pendientes. |
| Tona | Prototipo en Figma (WEB 1) | ✅ Secciones integradas y animadas, en Bricolage Grotesque como la web. Hay que revisar los textos. |
| Tona | Memoria | 🟡 Hay una estructura propuesta, pero falta el borrador y saber qué formato pide Tona. |
| Iván | 1 · Datos («Shrub situation») | ✅ Hecha. No se toca. |
| Iván | 2 · Recorrido sobre mapa («gps-data copy») | ✅ Mapa y ruta cuadrados. |
| Iván | 3 · Chat («text-chat copy») | ✅ Funciona con el día 27/8/24. |

---

## 2. Historial de decisiones

### Web (Daniel) · repositorio `elisavajoan/Projecte-Personal`
Antes de trabajar con este proyecto (historial de commits):
- Se probaron y **descartaron** un **corredor** (una silueta de persona corriendo hecha de caracteres, primero plana y después en 3D), un fondo de huracán en la entrada y un **scroll imantado** que paraba en cada pantalla. Al final se volvió al **reloj de arena sin corredor** y al scroll libre.
- La entrada es al estilo de aino.agency, con una cascada hacia la portada y el pie con la estructura de aino.
- El efecto de mosaico de caracteres en los textos grandes se recorta con la forma exacta de la letra. El hover afecta a la palabra entera.
- La cabecera siempre está fija y no se esconde al bajar.

Dentro de este proyecto (21 de noviembre):
1. **Toda la web en catalán** (PR #1). Joan: «ponlo todo en catalan». La frase inicial quedó así: «I tu, de què treballaràs? El que fas tu és fàcil, no? No feu exàmens?».
2. **Animaciones más fluidas** (PR #1). Menos trabajo por fotograma: la entrada pasó de 43 a 55 fps y el torbellino de 21 a 36 en el peor caso. Scroll con inercia (solo con ratón o trackpad), enlaces con deslizamiento suave y referentes que entran como una cortina con zoom y texto línea a línea.
3. **Título «La Importància / Del Temps»** (PR #3), en lugar del anterior. El nombre «Les Hores En El Disseny» se queda en la entrada, el pie y la pestaña.
4. **Reloj de arena que acompaña el scroll** (PR #3). Va fijo arriba a la izquierda, como un logo. Gira con la velocidad del scroll, al revés si se sube, y se inclina si se baja rápido. La arena cae según el avance de la página. *Primero se probó abajo a la derecha, pero tapaba los textos de los referentes en el móvil.*
5. **Título en Bold Oblique y de lado a lado** (PR #4). Se ajusta solo al ancho y en una pantalla de 1440 px pasa de unos 190 a 248 px de alto.
6. **Tipografía Bricolage Grotesque en toda la web** (PR #5). Va dentro del repositorio. Se suavizó el tracking pensado para Helvetica y los botones de la cabecera van en fila a la derecha. **No tiene cursiva propia**, así que la cursiva la genera el navegador.

### Figma (Tona) · archivo `6D1aD6nIipQGMjvi4Brt6i`
1. **Primera revisión** (solo lectura). Se comparó el Figma con la web: la web añade la entrada, la descodificación, el torbellino y las secciones de manifiesto y datos, y no usa el fondo de manchas desenfocadas del Figma. Esa evolución es material para la memoria.
2. **Página «Entrega 2 · Memòria web»** (15 pantallas) con la estructura de la referencia del compañero y el concepto de nolla.
3. **Corrección de Joan:** las secciones tienen que ir **dentro de WEB 1** (Page 2), como partes de la web. Se integraron Les 4Q, Keywords, Valors, To i personalitat, Conclusions y Concepte del projecte entre los referentes y el pie, y el frame creció hasta 9.164 px.
4. **El menú de la cabecera** ahora dice *investigació · contextualització · conceptualització* (componente «Header / ítem»). Cada palabra hace scroll a su parte:
   - investigació → la portada con la pregunta
   - contextualització → los 5 referentes
   - conceptualització → Les 4Q y todo lo que va debajo
5. **Animaciones de estudio:**
   - Flujo «Web nolla. · amb entrada» con el reloj de arena en 30 fotogramas, generado con el mismo algoritmo que la web.
   - Barra «[====]», «CARREGANT 0→100 %» y «CLICA PER ENTRAR_».
   - Una cortina de caracteres que descubre la web y un contador de 6.486,48 h que sube desde cero.
   - *Glitch* en los títulos y en las tarjetas 4Q, donde el blanco sube desde abajo y aparece una flecha ↗.
   - El flujo «Web nolla.» va directo, sin entrada.
6. **«Villà» se cambió por «Antiheroi»** («Contra què lluito?») en WEB 1 y en Entrega 2.
7. **Tipografía Bricolage Grotesque en todo el Figma** (23/11), igual que la web.

### p5.js (Iván)
1. Se hizo un inventario de 3 sketches y se arreglaron dos errores (`lenght` → `length` y un `loadImage('.png')` vacío). Se abrió la PR #2 para guardarlos en GitHub…
2. …pero **Joan no quiere p5 en GitHub**. La PR #2 se cerró sin fusionar.
3. Se prepararon las plantillas del mapa y del chat. Joan instaló **Claude in Chrome** y se crearon en su p5 `IVAN_02_Mapa-recorrido` e `IVAN_03_Chat`.
4. **Corrección de Joan:** al profesor no le gusta que se use lo que no se ha enseñado. Se reescribió todo línea por línea igual que los ejemplos de los compañeros.
5. **El chat** («text-chat copy», `chat-1.txt`) se filtra con `line.startsWith('[27/8/24 ')`. Es el martes 27 de agosto de 2024, con 256 mensajes y el día con más mensajes de todo el chat. El segundo día entre semana es el martes 10/6/25 (146) y el segundo de todo el chat es el domingo 25/2/24 (171).
6. **El mapa** es una copia de `ccaatt/OxWgTgE1x` → «gps-data copy» con `places_gracia.xml`. Límites: lon 2,153871 – 2,176066 y lat 41,378031 – 41,402912. El mapa de OpenStreetMap se generó con el mismo método que la página `minimal-map-lines.html` (500 × 747 px, `mapa.svg`). Se cambió el 597 del código por 747 en dos sitios. La ruta sigue el Passeig de Gràcia.

---

## 3. Aprendizajes (qué funciona con Joan)

- **Joan corrige rápido y en una frase.** Hay que hacer caso de lo que dice al pie de la letra («todo en catalán», «dentro de WEB 1», «nada de p5 en GitHub», «solo lo que nos han enseñado»).
- **Prefiere que lo hagas tú.** «Hazlo tú», «todo esto lo subes a p5». Si hay una forma de hacerlo sin su contraseña (Claude in Chrome), se usa.
- **Quiere un nivel profesional y llevarlo al máximo.** Lo ha pedido varias veces: «llevar a un nivel superior», «mucho más fluidas y profesionales» y «al máximo que permita Figma».
- **Se fija en la tipografía.** Ha pedido títulos grandes de lado a lado, cursiva bold y el cambio a Bricolage. La tipografía es la herramienta principal de la identidad.
- **Escribe en castellano y en catalán**, a veces en mayúsculas. No es enfado, es su forma de escribir.
- **Las referencias de los compañeros** sirven para saber qué se pide. Joan quiere su propio concepto.
- **Los límites técnicos que ya se conocen:**
  - Claude in Chrome no abre archivos `file://`. Hay que subir el archivo o recrear el método.
  - Desde el conector de Figma no hay Helvetica (no se puede editar texto en Helvetica). Ahora el Figma usa Bricolage Grotesque, que sí está disponible.
  - El editor de p5 no permite compartir el acceso. Solo se puede trabajar en él con Chrome y la sesión de Joan.
  - En p5, la consola avisa de que `line` es una función de p5. No afecta a nada y al ejemplo del compañero le pasa lo mismo.
- **Cuando se descarta una idea, hay que apuntarla** (el corredor, el scroll imantado, el reloj abajo a la derecha). Es material para la memoria («cómo evolucionó el diseño»).

---

## 4. Pendientes

### Web (Daniel)
- [ ] **Los botones de la cabecera no hacen nada** en la web (en el Figma sí). Hay que enlazarlos con scroll a las mismas secciones que en el prototipo.
- [ ] Idea: pasar los referentes a una **rejilla de fichas al estilo de aino**, con imagen, nombre y un texto que se abre.
- [ ] Idea: **contacto y redes en el pie**. Faltan los enlaces de Joan.
- [ ] Detalles de entrega: el README todavía dice «Projecte-Inicial» y faltan el icono de la pestaña (favicon) y la imagen para compartir el enlace (og:image).
- [ ] Ajustar la velocidad del scroll suave si a Joan no le convence (es un número).
- [ ] Decidir si el título se queda en cursiva sintética o pasa a recto (Bricolage no tiene cursiva).

### Figma (Tona)
- [x] **Tipografía alineada con la web (23/11):** todo el Figma pasa a **Bricolage Grotesque**, en los estilos de texto (h1, body, etiqueta, Text y memòria/…) y en los textos sueltos de ENTREGA 2 y MEMÒRIA. Bricolage no tiene cursiva, así que Bold Oblique e Italic pasan a Bold y Regular. El texto mono de la entrada (IBM Plex Mono) se mantiene. El título de la portada se ensanchó a 1.100 px con un tracking de −3 % para que siga en 3 líneas.
- [ ] Revisar los **textos borrador escritos por Claude**: hipótesis, 4Q, keywords, valores, tono y conclusión.
- [ ] Captura del proceso con el texto «Genera mierdas con ia» en Prototipado: decidir si se cambia.
- [ ] El frame «GITHUB Y EDICIÓN WEB» enlaza a `joan-nolla.github.io` en lugar de la URL actual.
- [ ] Decidir qué se hace con la página «Entrega 2 · Memòria web»: se mantiene, o se vacía y se dejan solo los componentes.
- [ ] **Memoria:** saber qué formato y extensión pide Tona (hay un A4 empezado en Figma) y escribir el borrador con esta estructura:
  1. Portada y resumen
  2. Introducción y pregunta de investigación
  3. Investigación y datos (telemetría, metodología y resultados)
  4. Referentes
  5. Concepto e identidad (nolla., blanco y negro, tipografía y guía HOME)
  6. Arquitectura y wireframes
  7. Prototipo en Figma
  8. Del prototipo al código (cambios e ideas descartadas)
  9. Relación con las clases de Daniel e Iván
  10. Conclusiones, bibliografía y anexos

### p5.js (Iván)
- [ ] Citar **OpenStreetMap** en el mapa si se publica.
- [ ] Rellenar los enunciados de Iván en las fichas de cada ejercicio, si Joan los pasa.
- [ ] Limpiar los duplicados: `IVAN_02_Mapa-recorrido` e `IVAN_03_Chat` eran las primeras plantillas y las entregas son «gps-data copy» y «text-chat copy». Se pueden renombrar con el formato `IVAN_0X_…` y meter en una colección «Web – Iván».
- [ ] «Same slug» sigue con `lenght` en el editor, salvo que Joan lo haya corregido.
