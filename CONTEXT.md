# CONTEXT · Les Hores En El Disseny
Última actualización: 24/11/2026

> El mapa del proyecto: de qué va, con qué datos, qué se ha decidido y en qué estado está cada entrega.
> Se actualiza cada vez que se decide algo. Cómo se trabaja va en [SOUL.md](SOUL.md), los criterios de cada petición en [INSTRUCTIONS.md](INSTRUCTIONS.md) y lo que se ha probado en la web en [LOG.md](LOG.md).
> El 24/11 se fusionó aquí el antiguo CONTEXTO.md y la parte de proyecto de MEMORIA.md (las copias originales están en `archivo/`).

**«Les Hores En El Disseny»** es una web, un prototipo en Figma y una memoria que responden a una pregunta con las horas reales de uso de Joan (6.486,48 h en siete programas).
Es el proyecto de la asignatura de Web de Joan, 3.º en Elisava (Barcelona), 2026. Tiene tres fases (Investigació, Contextualització y Conceptualització) y tres clases: **Daniel** (la web, en código), **Tona** (el prototipo en Figma y la memoria) e **Iván** (sketches de p5.js con datos propios).

## La pregunta
¿Cuánto tiempo dedican los diseñadores a aprender los programas de diseño?

- La frase que la abre en la web: «I tu, de què treballaràs? El que fas tu és fàcil, no? No feu exàmens?»
- A quien diseña siempre le preguntan lo mismo. Del diseño solo se ve el resultado: no se ven las mil pruebas, las ideas descartadas ni el tiempo que cuesta dominar cada programa. El proyecto ataca el prejuicio de que diseñar son «cuatro clics».
- La tesis: «El resultat es veu en un segon. Arribar-hi costa milers d'hores.»

## Los datos
**Informe de telemetría de Joan.** Es la base de todo el proyecto. Está en el Figma (frame «Informe de telemetría») y en la web (pantalla `#datos` de `index.html`).

| Programa | Horas | Sesión media | Patrón |
|---|---|---|---|
| Figma | 1.786,61 h (27,55 %) | 1 h 52 min | Bloques largos sin interrupción. Picos de 10:00 a 14:00 y de 16:00 a 19:30. +238 % entre 2022 y 2024. Herramienta troncal. |
| Photoshop | 1.415,25 h | 1 h 38 min | Sesiones segmentadas. Pico en 2022 (382,30 h) y estable en unas 240 h al año. |
| Illustrator | 1.238,80 h | 1 h 24 min | Branding y maquetación vectorial. Baja porque los layouts han pasado a Figma. |
| Premiere Pro | 867,95 h | 2 h 45 min | Sesiones largas de montaje. Sube desde 2023, unas 180–210 h al año. |
| After Effects | 602,80 h | 2 h 10 min | Ráfagas de motion graphics. En 2024 duplicó las horas de 2022. |
| InDesign | 430,29 h | 1 h 45 min | Bloques por entregas. Baja de forma sostenida. |
| Bridge | 144,78 h | 11 min | Microsesiones de 3 a 5 veces al día en días de rodaje. |

**Total: 6.486,48 h**, que son 270 días seguidos, de día y de noche.

**Datos de los sketches de p5 (Iván):** `david.csv` y `joan.csv` (horas del día), `places_gracia.xml` (117 puntos GPS del 2/11, de Gràcia hacia el centro) y `chat-1.txt` (un chat de WhatsApp, del que se usa el 27/8/24: 256 mensajes).

- Falta: las fechas exactas de inicio y fin del informe y con qué aplicación se midió. Por confirmar con Joan.
- No tengo: horas de otros diseñadores (todas las cifras de la web son de Joan) ni una medida del tiempo de *aprender* separada del tiempo de *usar*. La IA no debe suponer medias de «los diseñadores» ni inventar cifras.

## El tono
Silencioso y contundente. Blanco y negro, mucho aire y cifras enormes.
Una imagen: «un reloj de arena hecho de código: el tiempo que no se ve, cayendo».

## Identidad visual
- **Marca:** «nolla.» (logo en `logo*.png` del repositorio). El logo original no se retoca.
- **Color:** blanco y negro puro (`#000` y `#fff`), con bandas oscuras y claras que se alternan. Los grises son solo para texto secundario (`#9a9a9a` sobre negro y `#666` sobre blanco).
- **Tipografía:** **Bricolage Grotesque** en la web (desde el 21/11, dentro del repositorio en `fonts/`, sin Google Fonts) y en el Figma (desde el 23/11). No tiene cursiva propia: en la web el navegador genera la inclinación y en el Figma Bold Oblique e Italic pasaron a Bold y Regular. Los caracteres de código (entrada y torbellino) van en monoespaciada (IBM Plex Mono en el Figma).
- **Lenguaje gráfico:** caracteres de código y arte ASCII. Hay un reloj de arena hecho de caracteres, efectos de descodificación del texto y cascadas de caracteres. El tiempo se representa con caracteres que caen.
- **Curvas de movimiento:** `cubic-bezier(.16, 1, .3, 1)` para las salidas y `cubic-bezier(.77, 0, .18, 1)` para las transiciones (variables `--ease-out` y `--ease-in-out` en `style.css`).
- **Idioma de la web y del Figma:** catalán.

## Referentes
- **aino.agency:** la entrada con caracteres ASCII que reaccionan al ratón y dan paso a un espacio blanco y limpio, y la estructura del pie. Es el referente principal. No: su contenido de agencia.
- **Mesh 3D:** el scrollytelling que convierte estadísticas frías en una experiencia. No: el 3D realista ni el color.
- **Pinnacl** (pinnacl.co): las cifras de impacto encabezan la jerarquía, con bloques numerados y un diseño oscuro.
- **State of AI Design** (stateofaidesign.com): la estructura de revista digital por capítulos. No: las encuestas a terceros (aquí los datos son de una sola persona).
- **Studio Mirage** (studiomirage.io/works/ubisoft): miles de piezas individuales que forman un monumento común, como los caracteres que forman el reloj y el torbellino.
- **Contrarreferente:** un panel de estadísticas con gráficos de colores, y la propuesta de los compañeros (sirve para ver qué apartados se piden, no cómo resolverlos).

## Las tres clases y sus entregas

### Daniel · Web con IA (código)
- **Entrega:** la web publicada.
- **Repositorio:** https://github.com/elisavajoan/Projecte-Personal · **Web (GitHub Pages):** https://elisavajoan.github.io/Projecte-Personal/
- **Tecnología:** HTML, CSS y JavaScript sin frameworks (`index.html`, `style.css`, `script.js`). Las capturas de los referentes van en `images/*.webp`.
- **Estructura de la web (de arriba abajo):**
  1. `#entrada`: pantalla de carga negra con el reloj de arena de caracteres que gira, la barra «=», «CARREGANT n %» y una cascada de caracteres que descubre la página.
  2. Cabecera fija con el logo «nolla.» y tres botones: Investigació · Contextualització · Conceptualització.
  3. `#portada`: el título «La Importància / Del Temps» en Bold Oblique, con el reloj de arena grande a la derecha, y los enlaces a los 5 referentes.
  4. `#proceso`: el manifiesto con la frase de la pregunta.
  5. `#torbellino`: un huracán de código en forma de embudo doble con «6.486,48 h» encima.
  6. `#datos`: los 7 programas con su ficha desplegable.
  7. `#ref-*`: las 5 pantallas de referentes, con una captura que entra como una cortina.
  8. `#pie`: el pie al estilo de aino con «Les Hores En El Disseny · BCN · Elisava · Investigació, contextualització i conceptualització · 2026».
  - Un reloj de arena pequeño, fijo arriba a la izquierda, gira y se vacía con el scroll. Se esconde mientras se ve el grande de la portada.

### Tona · Figma y memoria (diseño)
- **Entrega:** el prototipo web en Figma y la memoria del proyecto.
- **Archivo de Figma de Joan:** `6D1aD6nIipQGMjvi4Brt6i` ([abrir](https://www.figma.com/design/6D1aD6nIipQGMjvi4Brt6i/))
  - **Page 1** es la mesa de trabajo. Tiene la guía de estilo «H O M E» (H1, H2, Body, Etiqueta y paleta), los componentes 1–8 (menú, fichas de los referentes con su hover, el cierre con el rombo y «nolla.», y el fondo animado), el componente «Header / ítem», el «Informe de telemetría», el frame «GITHUB Y EDICIÓN WEB» y un A4 empezado para la memoria.
  - **Page 2** es la maqueta final, el frame **«WEB 1»** ([nodo 102-53](https://www.figma.com/design/6D1aD6nIipQGMjvi4Brt6i/?node-id=102-53)), de 1440 × 9.164 px. Flujos del prototipo: «Web nolla. · amb entrada» (con la pantalla de carga) y «Web nolla.» (directo).
  - Página **«Entrega 2 · Memòria web»** ([nodo 147-59](https://www.figma.com/design/6D1aD6nIipQGMjvi4Brt6i/?node-id=147-59)): 15 pantallas y el origen de los componentes nuevos.
- **Archivo de referencia de un compañero:** `Y1wmc5oMDJ3M6hfKuy0RaS` («Blanch_Entrega1_Investigación»). Solo sirve para ver **qué apartados** se piden. Su concepto no se copia.
- **Apartados que pide la entrega** (según la referencia): Inicio, Pregunta de investigación, Datos, Benchmarking, Narrativa (**Les 4Q**: Visió, Superpoder, Antiheroi, Persones), Keywords, Valors, To i personalitat, Conclusions, Concepte del projecte y Prototipado.

### Iván · p5.js (código creativo con datos)
- **p5 va totalmente aparte de GitHub.** Son proyectos diferentes y nada de p5 se sube al repositorio.
- **Cuenta:** editor.p5js.org, usuario `elisavajoan`. p5 versión 2.3.4.
- **Norma del profesor:** no usar nada que no se haya enseñado en clase. El código sigue la estructura de los ejemplos de los compañeros.
- **Tres entregas:**
  1. **Datos:** [Shrub situation](https://editor.p5js.org/elisavajoan/sketches/KlNYrT8Xe). Barras de las 24 h, negras para David y blancas para Joan. Ya está hecha y no se toca.
  2. **Recorrido sobre mapa:** [gps-data copy](https://editor.p5js.org/elisavajoan/sketches/kthvzVxWS). Copia de `ccaatt/OxWgTgE1x` con `places_gracia.xml` sobre `mapa.svg` de OpenStreetMap (500 × 747 px). Límites: lon 2,153871 – 2,176066 y lat 41,378031 – 41,402912. La ruta sigue el Passeig de Gràcia.
  3. **Chat:** «text-chat copy», con `chat-1.txt` (WhatsApp). Frases al azar que siguen al ratón, solo del martes 27/8/24 (filtro `line.startsWith('[27/8/24 ')`). El segundo día entre semana con más mensajes es el martes 10/6/25 (146) y el segundo de todo el chat, el domingo 25/2/24 (171).
- **Ejemplos de los compañeros:** `tell0/w7wIgOIyW`, `tell0/eTI5FN1O-` y `ccaatt/OxWgTgE1x`.
- **Otros sketches de Joan:** «Same slug» (círculos por horas), «Bygone stem» (primer mapa GPS), `IVAN_02_Mapa-recorrido` (1vgM_QmWI) e `IVAN_03_Chat` (IS6TO3TeL), que fueron las primeras plantillas.
- **Copia local de las plantillas:** `ivan-p5/` e `ivan-p5/INSTRUCCIONES.md` en la carpeta del proyecto.

### Cómo se relacionan las tres clases
Los tres trabajos tratan el mismo tema, el tiempo y los datos personales de Joan. La **web (Daniel)** lo cuenta con código, el **Figma (Tona)** lo diseña y lo documenta en la memoria, y el **p5 (Iván)** experimenta visualizando datos propios: las horas, un recorrido y un chat. La memoria de Tona debería conectar las tres partes.

## Decisiones
- 18/11 · Blanco y negro puro y una sola familia tipográfica. Motivo: el contraste viene de la escala y del ritmo, no del color.
- 20/11 · La portada y la cabecera de la web siguen el Figma (WEB 1). Motivo: la web y el prototipo tienen que parecer del mismo autor.
- 20/11 · Entrada al estilo de aino.agency con un reloj de arena de caracteres que gira con el ratón. Motivo: el reloj que se vacía es el tiempo.
- 20/11 · El mosaico de caracteres de los textos grandes se recorta con la forma exacta de la letra, y el hover afecta a la palabra entera.
- 21/11 · Toda la web en catalán. Motivo: lo pidió Joan («ponlo todo en catalán»).
- 21/11 · Scroll con inercia (solo con ratón o trackpad), enlaces con deslizamiento suave y referentes que entran como una cortina con zoom y texto línea a línea. En el móvil y con «reducir movimiento», scroll normal.
- 21/11 · Título «La Importància / Del Temps». El nombre «Les Hores En El Disseny» se queda en la entrada, el pie y la pestaña.
- 21/11 · Reloj de arena pequeño, fijo arriba a la izquierda, que gira con el scroll (al revés si se sube, inclinado si se baja rápido) y se vacía según el avance de la página.
- 21/11 · Bricolage Grotesque en toda la web, dentro del repositorio. En el Figma, desde el 23/11. Motivo: lo pidió Joan, y el Figma tiene que ir igual que la web.
- 21/11 · Nada de p5 en GitHub. Motivo: Joan no lo quiere (se cerró la PR #2 sin fusionar).
- 21/11 · En p5, solo lo que se ha enseñado en clase, con la estructura de los ejemplos de los compañeros. Motivo: al profesor no le gusta que se use lo que no ha enseñado.
- 21/11 · El chat de p5 usa el martes 27/8/24. Motivo: es el día con más mensajes de todo el chat (256).
- 21/11 · El mapa de p5 se genera con el método de `minimal-map-lines.html` (OpenStreetMap) y en el código el 597 pasa a 747 en dos sitios.
- 21–23/11 · Las secciones de la memoria (Les 4Q, Keywords, Valors, To i personalitat, Conclusions y Concepte) van dentro de WEB 1, entre los referentes y el pie. Motivo: corrección de Joan.
- 21/11 · Menú del Figma: investigació → la portada con la pregunta; contextualització → los 5 referentes; conceptualització → Les 4Q y lo que va debajo (scroll-to).
- 21/11 · Animaciones del Figma: reloj de arena en 30 fotogramas con el mismo algoritmo que la web, barra «[====]», «CARREGANT 0→100 %», «CLICA PER ENTRAR_», cortina de caracteres, contador de 6.486,48 h, glitch en los títulos y tarjetas 4Q que se rellenan de blanco con una flecha ↗.
- 24/11 · Título de la portada más pequeño (56 % del ancho, de 248 a 132 px en 1440) y reloj de arena grande a la derecha. En el móvil va entre el título y los referentes. Motivo: lo pidió Joan.
- 24/11 · Los documentos del proyecto siguen las plantillas de clase (CONTEXT, SOUL, INSTRUCTIONS y LOG), con lo que había en CONTEXTO, PERSONALIDAD y MEMORIA fusionado dentro. Cada cambio de la web se apunta en LOG.md. Motivo: lo pidió Joan.

## Hipótesis (sin comprobar)
- Las horas de uso sirven para medir lo que cuesta aprender un programa: se aprende usándolo.
- Si la gente ve las horas que hay detrás, deja de pensar que diseñar son «cuatro clics».
- Figma ha sustituido a Illustrator y a InDesign en la maquetación (sus horas bajan mientras las de Figma suben).

## Descartado
- 19/11 · Animación de máscara y párrafo que se iluminaba con el scroll: se sustituyó por el texto decodificado de aino.agency.
- 20/11 · Logo en la cabecera: en su lugar van los tres botones del Figma.
- 20/11 · Scroll imantado que paraba en cada pantalla: el scroll libre se queda.
- 20/11 · Cabecera que se escondía al bajar: siempre fija.
- 20–21/11 · Corredor de caracteres (plano y en 3D) y fondo de huracán en la entrada: se volvió al reloj de arena.
- 21/11 · Reloj de arena pequeño abajo a la derecha: tapaba los textos de los referentes en el móvil.
- 21/11 · Guardar los sketches de p5 en GitHub: Joan no lo quiere.
- 21/11 · Plantillas de p5 con `try/catch`, teclas para ajustar y fórmula de proyección: no se había enseñado en clase.
- 21–23/11 · Las secciones de la memoria como láminas sueltas en una página aparte: tienen que ir dentro de WEB 1.
- 21–23/11 · «Villà» en Les 4Q: se cambió por «Antiheroi» («Contra què lluito?»).
- 21–23/11 · El fondo de manchas desenfocadas del Figma: la web no lo usa.

## Estado
| Clase | Entrega | Estado |
|---|---|---|
| Daniel | Web publicada | ✅ Publicada y al día (PR #1 a #7). La PR #8 (estos documentos) espera el Merge. |
| Tona | Prototipo en Figma (WEB 1) | ✅ Secciones integradas y animadas, en Bricolage Grotesque. Hay que revisar los textos. |
| Tona | Memoria | 🟡 Estructura propuesta. Falta el borrador y saber qué formato pide Tona. |
| Iván | 1 · Datos (Shrub situation) | ✅ Hecha. No se toca. |
| Iván | 2 · Recorrido sobre mapa (gps-data copy) | ✅ Mapa y ruta cuadrados. |
| Iván | 3 · Chat (text-chat copy) | ✅ Funciona con el 27/8/24. |

**Siguiente · Web (Daniel):**
- [ ] Los botones de la cabecera no llevan a ninguna sección (en el Figma sí). Enlazarlos con scroll a las mismas secciones que en el prototipo.
- [ ] Idea: referentes en una rejilla de fichas al estilo de aino, con imagen, nombre y un texto que se abre.
- [ ] Idea: contacto y redes en el pie. Faltan los enlaces de Joan.
- [ ] El README todavía dice «Projecte-Inicial». Faltan el favicon y la imagen para compartir el enlace (og:image).
- [ ] Ajustar la velocidad del scroll suave si a Joan no le convence (es un número).
- [ ] Decidir si el título se queda con la cursiva que genera el navegador o pasa a recto.

**Siguiente · Figma y memoria (Tona):**
- [ ] Revisar los textos borrador escritos por Claude: hipótesis, 4Q, keywords, valores, tono y conclusión.
- [ ] La captura del proceso con el texto «Genera mierdas con ia» en Prototipado: decidir si se cambia.
- [ ] El frame «GITHUB Y EDICIÓN WEB» enlaza a `joan-nolla.github.io` en lugar de la URL actual.
- [ ] Decidir qué se hace con la página «Entrega 2 · Memòria web»: se mantiene, o se vacía y se dejan solo los componentes.
- [ ] Memoria: saber qué formato y extensión pide Tona (hay un A4 empezado en el Figma) y escribir el borrador con esta estructura:
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

**Siguiente · p5 (Iván):**
- [ ] Citar OpenStreetMap en el mapa si se publica.
- [ ] Rellenar los enunciados de Iván en las fichas de cada ejercicio, si Joan los pasa.
- [ ] Limpiar duplicados: `IVAN_02_Mapa-recorrido` e `IVAN_03_Chat` eran las primeras plantillas; las entregas son «gps-data copy» y «text-chat copy». Se pueden renombrar `IVAN_0X_…` y meter en una colección «Web – Iván».
- [ ] «Same slug» sigue con `lenght` en el editor, salvo que Joan lo haya corregido.

## Herramientas y accesos
| Herramienta | Uso | Cómo accede Claude |
|---|---|---|
| GitHub (`elisavajoan/Projecte-Personal`) | Código de la web y estos documentos | Rama y pull request. Joan fusiona y se publica en GitHub Pages en unos minutos. |
| Figma | Prototipo y memoria | Lectura y escritura con el conector de Figma. Helvetica no se puede editar desde ahí. |
| editor.p5js.org | Sketches de Iván | Solo con Claude in Chrome en el Chrome de Joan (macOS), con su sesión abierta. Nunca con contraseña. |
| Carpeta del proyecto | Capturas, plantillas y estos documentos | Directo. |

**Carpeta del proyecto:**
- `daniel-web/`: capturas de la portada, el reloj de arena con el scroll, el título en cursiva y las secciones con Bricolage.
- `ivan-p5/`: las plantillas `chat/` y `mapa-recorrido/`, `INSTRUCCIONES.md`, `mapa-gracia-cuadrado.jpg` y `sketches-funcionando.png`.
- `CONTEXT.md`, `SOUL.md`, `INSTRUCTIONS.md` y `LOG.md`: los documentos del proyecto.
- `archivo/`: los documentos antiguos (CONTEXTO, PERSONALIDAD y MEMORIA), ya fusionados en estos.
