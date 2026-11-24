# CONTEXTO · ASSIGNATURA WEB

> Qué es este proyecto, de qué trata, quién pide qué y con qué herramientas se trabaja.
> Última actualización: 23 de noviembre de 2026.

---

## 1. En una frase

**«Les Hores En El Disseny»**: una web, un prototipo en Figma y una memoria que responden a la pregunta *¿Cuánto tiempo dedican los diseñadores a aprender los programas de diseño?*, a partir de las horas reales de uso de Joan (6.486,48 h en siete programas).

Es el proyecto de la asignatura de web de Joan en **Elisava (Barcelona), 2026**. El proyecto se divide en tres fases: **Investigació, Contextualització, Conceptualització**.

---

## 2. El concepto

### La pregunta
«I tu, de què treballaràs? El que fas tu és fàcil, no? No feu exàmens?»
A quien diseña siempre le preguntan lo mismo. Del diseño solo se ve el resultado. No se ven las mil pruebas, las ideas descartadas ni el tiempo que cuesta dominar cada programa. El proyecto ataca el prejuicio de que diseñar son «cuatro clics».

### La tesis
> «El resultat es veu en un segon. Arribar-hi costa milers d'hores.»

### Los datos (informe de telemetría)
Son la base de todo el proyecto. Están en el Figma («Informe de telemetría») y en la web.

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

### Identidad visual
- **Marca:** «nolla.» (logo en `logo*.png` del repositorio).
- **Color:** blanco y negro puro (`#000` y `#fff`). Bandas oscuras y claras que se alternan. Los grises son solo para texto secundario (`#9a9a9a` sobre negro y `#666` sobre blanco).
- **Tipografía:**
  - En la web es **Bricolage Grotesque** (desde el 21 de noviembre). Va dentro del repositorio en `fonts/` y no depende de Google Fonts. Los caracteres de código (entrada y torbellino) van en monoespaciada.
  - En Figma la identidad original es **Helvetica Bold**, aunque las secciones nuevas están en Arimo (ver MEMORIA.md).
- **Lenguaje gráfico:** caracteres de código y arte ASCII. Hay un reloj de arena hecho de caracteres, efectos de descodificación del texto y cascadas de caracteres. El tiempo se representa con caracteres que caen.
- **Idioma de la web y del Figma:** **catalán**.

### Referentes (benchmarking)
| Referente | Qué aporta al proyecto |
|---|---|
| **Mesh 3D** | Scrollytelling con elementos 3D que reaccionan. Convierte estadísticas frías en una experiencia viva. |
| **State of AI Design** (stateofaidesign.com) | Estructura de revista digital por capítulos, con datos de encuestas y testimonios. |
| **aino.agency** | Entrada con composiciones de caracteres y código (ASCII) que reaccionan al ratón y dan paso a un espacio blanco, geométrico y limpio. Es el referente principal de la entrada y del pie. |
| **Pinnacl** (pinnacl.co) | Diseño oscuro y contundente. Las cifras de impacto encabezan la jerarquía, con bloques numerados. |
| **Studio Mirage** (studiomirage.io/works/ubisoft) | Experiencia colectiva: miles de piezas individuales que forman un monumento común. |

---

## 3. Las tres clases y sus entregas

### Daniel · Web con IA (código)
- **Entrega:** la web publicada.
- **Repositorio:** https://github.com/elisavajoan/Projecte-Personal
- **Web publicada (GitHub Pages):** https://elisavajoan.github.io/Projecte-Personal/
- **Tecnología:** HTML, CSS y JavaScript sin frameworks (`index.html`, `style.css`, `script.js`, unos 70 KB de JS). Las imágenes de los referentes van en `images/*.webp`.
- **Estructura de la web (de arriba abajo):**
  1. `#entrada`: pantalla de carga negra con el reloj de arena de caracteres que gira, la barra «=», «CARREGANT n %» y una cascada de caracteres que descubre la página.
  2. Cabecera fija con el logo «nolla.» y tres botones: Investigació · Contextualització · Conceptualització.
  3. `#portada`: el título «La Importància / Del Temps» en Bold Oblique, de lado a lado, y los enlaces a los 5 referentes.
  4. `#proceso`: el manifiesto con la frase de la pregunta.
  5. `#torbellino`: un huracán de código en forma de embudo doble con «6.486,48 h» encima.
  6. `#datos`: los 7 programas con su ficha desplegable.
  7. `#ref-*`: las 5 pantallas de referentes, con una captura que entra como una cortina.
  8. `#pie`: el pie al estilo de aino con «Les Hores En El Disseny · BCN · Elisava · Investigació, contextualització i conceptualització · 2026».
  - Un reloj de arena pequeño, fijo arriba a la izquierda, gira y se vacía con el scroll.

### Tona · Figma y memoria (diseño)
- **Entrega:** el prototipo web en Figma y la memoria del proyecto.
- **Archivo de Figma de Joan:** `6D1aD6nIipQGMjvi4Brt6i` ([abrir](https://www.figma.com/design/6D1aD6nIipQGMjvi4Brt6i/))
  - **Page 1** es la mesa de trabajo. Tiene la guía de estilo «H O M E» (H1, H2, Body, Etiqueta y paleta), los componentes 1–8 (menú, fichas de los referentes con su hover, el cierre con el rombo y «nolla.», y el fondo animado), el componente «Header / ítem», el «Informe de telemetría», el frame «GITHUB Y EDICIÓN WEB» y un A4 empezado para la memoria.
  - **Page 2** es la maqueta final, el frame **«WEB 1»** ([nodo 102-53](https://www.figma.com/design/6D1aD6nIipQGMjvi4Brt6i/?node-id=102-53)), de 1440 × 9.164 px.
  - Página **«Entrega 2 · Memòria web»** ([nodo 147-59](https://www.figma.com/design/6D1aD6nIipQGMjvi4Brt6i/?node-id=147-59)): 15 pantallas y el origen de los componentes nuevos.
- **Archivo de referencia de un compañero:** `Y1wmc5oMDJ3M6hfKuy0RaS` («Blanch_Entrega1_Investigación»). Solo sirve para ver **qué apartados** se piden. Su concepto no se copia.
- **Apartados que pide la entrega** (según la referencia): Inicio, Pregunta de investigación, Datos, Benchmarking, Narrativa (**Les 4Q**: Visió, Superpoder, Antiheroi, Persones), Keywords, Valors, To i personalitat, Conclusions, Concepte del projecte y Prototipado.

### Iván · p5.js (código creativo con datos)
- **Importante:** p5 va **totalmente aparte de GitHub**. Son proyectos diferentes y nada de p5 se sube al repositorio.
- **Cuenta:** editor.p5js.org, usuario `elisavajoan`. p5 versión 2.3.4.
- **Norma del profesor:** no usar nada que no se haya enseñado en clase. El código sigue la estructura de los ejemplos de los compañeros.
- **Tres entregas:**
  1. **Datos:** «Shrub situation» ([abrir](https://editor.p5js.org/elisavajoan/sketches/KlNYrT8Xe)). Usa `david.csv` y `joan.csv` y dibuja barras de las 24 h, negras para David y blancas para Joan. **Ya está hecha y no se toca.**
  2. **Recorrido sobre mapa:** «gps-data copy» ([abrir](https://editor.p5js.org/elisavajoan/sketches/kthvzVxWS)). Es una copia de `ccaatt/OxWgTgE1x` con `places_gracia.xml` (117 puntos, la ruta del 2 de noviembre de Gràcia hacia el centro) sobre `mapa.svg` de OpenStreetMap, de 500 × 747 px.
  3. **Chat:** «text-chat copy», con `chat-1.txt` (WhatsApp). Muestra frases al azar del chat que siguen al ratón, solo del **martes 27/8/24** (256 mensajes, el día en que más se habló).
- **Ejemplos de los compañeros:** `tell0/w7wIgOIyW`, `tell0/eTI5FN1O-` y `ccaatt/OxWgTgE1x`.
- **Otros sketches de Joan:** «Same slug» (círculos por horas), «Bygone stem» (el primer mapa GPS), `IVAN_02_Mapa-recorrido` (1vgM_QmWI) e `IVAN_03_Chat` (IS6TO3TeL), las primeras plantillas.
- **Copia local de las plantillas:** [ivan-p5/](ivan-p5/) e [INSTRUCCIONES.md](ivan-p5/INSTRUCCIONES.md).

### Cómo se relacionan las tres clases
Los tres trabajos tratan el mismo tema, el tiempo y los datos personales de Joan. La **web (Daniel)** lo cuenta con código. El **Figma (Tona)** lo diseña y lo documenta en la memoria. El **p5 (Iván)** experimenta visualizando datos propios: las horas, un recorrido y un chat. La memoria de Tona debería conectar las tres partes.

---

## 4. Herramientas y accesos

| Herramienta | Uso | Cómo accede Claude |
|---|---|---|
| GitHub (`elisavajoan/Projecte-Personal`) | Código de la web | Rama y pull request. Joan fusiona y se publica en GitHub Pages en unos minutos. |
| Figma | Prototipo y memoria | Lectura y escritura con el conector de Figma. Helvetica **no** está disponible desde ahí. |
| editor.p5js.org | Sketches de Iván | Solo con **Claude in Chrome** en el Chrome de Joan (macOS), con su sesión abierta. Nunca con contraseña. |
| Carpeta del proyecto (`/mnt/project-files/`) | Capturas, plantillas y estos archivos | Directo. |

### Archivos en la carpeta del proyecto
- `daniel-web/`: capturas de la portada, el reloj de arena con el scroll, el título en cursiva y las secciones con Bricolage.
- `ivan-p5/`: las plantillas `chat/` y `mapa-recorrido/`, `INSTRUCCIONES.md`, `mapa-gracia-cuadrado.jpg` y `sketches-funcionando.png`.
- `CONTEXTO.md`, `PERSONALIDAD.md` y `MEMORIA.md`: estos tres archivos.
