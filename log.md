# LOG · Actualizaciones de la web

> Todos los cambios de la web **Les Hores En El Disseny**, del primero al último, con el enlace a cada commit y a cada pull request.
> Web publicada: https://elisavajoan.github.io/Projecte-Personal/
> Hay que añadir una entrada cada vez que se actualice la web.

---

## Resumen

| Fecha | Qué cambió | PR |
|---|---|---|
| 18/11 | Primera versión subida por Joan | – |
| 18/11 | Rediseño en blanco y negro con cuatro pantallas | – |
| 19/11 | Textos decodificados al estilo de aino.agency, Helvetica Bold y las cinco pantallas de referentes | – |
| 20/11 | Portada igual que el Figma, mosaico de caracteres, pantalla de entrada, pie y torbellino | – |
| 21/11 | Vuelve el reloj de arena a la entrada (fuera el corredor) | – |
| 21/11 | Toda la web en catalán y animaciones más fluidas | [#1](https://github.com/elisavajoan/Projecte-Personal/pull/1) |
| 21/11 | Título «La Importància Del Temps» y reloj de arena que acompaña el scroll | [#3](https://github.com/elisavajoan/Projecte-Personal/pull/3) |
| 21/11 | Título en Bold Oblique, de lado a lado | [#4](https://github.com/elisavajoan/Projecte-Personal/pull/4) |
| 21/11 | Tipografía Bricolage Grotesque en toda la web | [#5](https://github.com/elisavajoan/Projecte-Personal/pull/5) |
| 24/11 | Documentos del proyecto en el repositorio | [#6](https://github.com/elisavajoan/Projecte-Personal/pull/6) |
| 24/11 | Título más pequeño y reloj de arena grande a la derecha de la portada. Este log | [#7](https://github.com/elisavajoan/Projecte-Personal/pull/7) |

---

## 18 de noviembre de 2026

### Primera versión
- Joan crea el repositorio y sube la primera web: `index.html`, `style.css` y `script.js`. ([92bb286](https://github.com/elisavajoan/Projecte-Personal/commit/92bb286), [91db0e3](https://github.com/elisavajoan/Projecte-Personal/commit/91db0e3))

### Rediseño en blanco y negro
- La web pasa a blanco y negro puro, con cuatro pantallas: la portada, un manifiesto con el total de horas, un torbellino de horas dibujado en canvas y la lista de datos por programa con filas desplegables. ([bb9cc56](https://github.com/elisavajoan/Projecte-Personal/commit/bb9cc56))

---

## 19 de noviembre de 2026

### Texto decodificado (como aino.agency)
- Cada letra empieza en blanco y pasa por una escala de símbolos hasta convertirse en la letra real, en una ola de izquierda a derecha. ([b563315](https://github.com/elisavajoan/Projecte-Personal/commit/b563315))
- Las letras tienen un ancho fijo para que el texto no se mueva mientras cambian los símbolos.
- Se quitan las animaciones anteriores: la máscara, el párrafo que se iluminaba con el scroll y los contadores.

### Tipografía, cabecera y título
- La tipografía pasa a **Helvetica Bold** con el tracking apretado y se deja de usar Google Fonts. ([fd11a11](https://github.com/elisavajoan/Projecte-Personal/commit/fd11a11))
- Cabecera fija con el logo. Título «Les Hores En El Disseny», también en la pestaña del navegador.
- El efecto de las letras al pasar el ratón funciona en cualquier texto.
- El texto del botón ya no se parte en dos líneas. ([d6319a7](https://github.com/elisavajoan/Projecte-Personal/commit/d6319a7))

### Las cinco pantallas de referentes
- Mesh 3D, State of AI Design, aino.agency, Pinnacl y Studio Mirage, cada una con su captura (`images/*.webp`), su texto y el enlace a la web real. ([a919887](https://github.com/elisavajoan/Projecte-Personal/commit/a919887))
- La captura va pegada al borde y el texto al lado, como en el Figma. Entran por los lados al llegar a la pantalla.
- La portada tiene cinco enlaces que saltan a cada referente.
- En el móvil, la captura va arriba y el texto debajo.

### Logo
- Prueba con letras blancas y contorno negro, y después se vuelve al logo original sin tocar, con las letras más juntas. ([0032c1d](https://github.com/elisavajoan/Projecte-Personal/commit/0032c1d), [5a4808a](https://github.com/elisavajoan/Projecte-Personal/commit/5a4808a))

---

## 20 de noviembre de 2026

### Cabecera y portada iguales que el Figma
- Se quita el logo de la cabecera. Arriba a la derecha hay tres botones: Investigació, Contextualització y Conceptualització. ([39a7071](https://github.com/elisavajoan/Projecte-Personal/commit/39a7071))
- Portada idéntica al Figma: el título en dos líneas, el menú en catalán y los cinco referentes en Bold Oblique abajo a la izquierda, en sus posiciones exactas. Todas las medidas salen del marco de 1710 px del Figma. ([6a5a786](https://github.com/elisavajoan/Projecte-Personal/commit/6a5a786))
- Se quitan el botón de la pregunta y la pista «Baja para ver las horas», que no estaban en el diseño.

### Mosaico de caracteres en los textos
- Los textos grandes se forman con un mosaico de caracteres. ([2294134](https://github.com/elisavajoan/Projecte-Personal/commit/2294134))
- El mosaico pasa a todo el texto y se recorta con la forma exacta de cada letra. ([6a751a7](https://github.com/elisavajoan/Projecte-Personal/commit/6a751a7))
- La tinta que sobresale de la letra también se anima. ([557bbbe](https://github.com/elisavajoan/Projecte-Personal/commit/557bbbe))
- Hover: el efecto se mantiene mientras el puntero está encima, incluso con el ratón quieto, y afecta a la palabra entera. ([3b3a43e](https://github.com/elisavajoan/Projecte-Personal/commit/3b3a43e), [aa8ee45](https://github.com/elisavajoan/Projecte-Personal/commit/aa8ee45), [7594b2e](https://github.com/elisavajoan/Projecte-Personal/commit/7594b2e))

### Pantalla de entrada y pie al estilo de aino.agency
- Pantalla de carga negra con una barra de «=», un reloj de arena 3D hecho de caracteres que gira con el ratón y el aviso «CLICA PER ENTRAR». ([8a14b38](https://github.com/elisavajoan/Projecte-Personal/commit/8a14b38))
- Al hacer clic, el reloj se deshace de arriba abajo y la portada aparece detrás, en cascada.
- Pie con la estructura de aino: la fila «Explora» en cuatro columnas, el nombre gigante y la hora en directo.

### Scroll y cabecera
- Se quita el **scroll imantado**, que paraba en cada pantalla. El scroll vuelve a ser libre. ([f99510a](https://github.com/elisavajoan/Projecte-Personal/commit/f99510a))
- La cabecera siempre se queda fija y ya no se esconde al bajar. ([4b22430](https://github.com/elisavajoan/Projecte-Personal/commit/4b22430))

### Torbellino de horas
- Un huracán de miles de caracteres de código que suben en espiral, con forma de embudo doble. Las cifras de horas se dibujan por encima. ([d2b1007](https://github.com/elisavajoan/Projecte-Personal/commit/d2b1007))
- Si el ordenador va justo, se reduce poco a poco el número de caracteres.

### El corredor (descartado)
- En la entrada se prueba una silueta de persona corriendo hecha de caracteres, primero plana y después con volumen 3D. ([aecca1d](https://github.com/elisavajoan/Projecte-Personal/commit/aecca1d), [e1b2353](https://github.com/elisavajoan/Projecte-Personal/commit/e1b2353), [07d41a6](https://github.com/elisavajoan/Projecte-Personal/commit/07d41a6))

---

## 21 de noviembre de 2026

### Vuelve el reloj de arena
- Se prueba el corredor plano con un fondo de huracán de código y, al final, se vuelve al **reloj de arena sin corredor**. ([d9e3f8b](https://github.com/elisavajoan/Projecte-Personal/commit/d9e3f8b), [8850187](https://github.com/elisavajoan/Projecte-Personal/commit/8850187))
- `script.js` y `style.css` llevan un número de versión para que el navegador no muestre copias antiguas. ([536c68e](https://github.com/elisavajoan/Projecte-Personal/commit/536c68e))

### Toda la web en catalán · [PR #1](https://github.com/elisavajoan/Projecte-Personal/pull/1)
- Todos los textos, los datos, las descripciones de las imágenes y la nota de horas pasan al catalán. ([c588523](https://github.com/elisavajoan/Projecte-Personal/commit/c588523))
- La frase de la portada: «I tu, de què treballaràs? El que fas tu és fàcil, no? No feu exàmens?».

### Animaciones más fluidas · [PR #1](https://github.com/elisavajoan/Projecte-Personal/pull/1)
- Menos trabajo en cada fotograma: la entrada pasa de 43 a 55 fps y el torbellino de 21 a 36 en el peor caso. ([6215ae2](https://github.com/elisavajoan/Projecte-Personal/commit/6215ae2))
- Scroll suave con inercia (con la rueda del ratón o el trackpad) y deslizamiento suave en los enlaces.
- Los referentes entran como una cortina con zoom y el texto sube línea a línea.

### «La Importància Del Temps» y el reloj que acompaña el scroll · [PR #3](https://github.com/elisavajoan/Projecte-Personal/pull/3)
- El título de la portada pasa a «La Importància / Del Temps». El nombre «Les Hores En El Disseny» se queda en la entrada, el pie y la pestaña. ([916fcb4](https://github.com/elisavajoan/Projecte-Personal/commit/916fcb4))
- Un reloj de arena pequeño, fijo arriba a la izquierda como un logo. Gira con el scroll (al revés si subes) y la arena cae a medida que avanzas por la página.
- Primero se probó abajo a la derecha, pero tapaba los textos de los referentes en el móvil.

### Título en Bold Oblique y de lado a lado · [PR #4](https://github.com/elisavajoan/Projecte-Personal/pull/4)
- El tamaño del título se calcula midiendo la tinta real de las letras, para que la línea más larga llene todo el ancho. En una pantalla de 1440 px pasa de unos 190 a 248 px de alto. ([785bc6c](https://github.com/elisavajoan/Projecte-Personal/commit/785bc6c))

### Tipografía Bricolage Grotesque · [PR #5](https://github.com/elisavajoan/Projecte-Personal/pull/5)
- **Bricolage Grotesque** en toda la web. Va dentro del repositorio (`fonts/`), sin depender de Google Fonts. ([68e41bc](https://github.com/elisavajoan/Projecte-Personal/commit/68e41bc))
- El tracking es más suave, porque la tipografía ya es estrecha en los tamaños grandes.
- Los tres botones de la cabecera van en fila a la derecha. Con las posiciones fijas del Figma se pisaban.
- Bricolage no tiene cursiva propia, así que la cursiva del título la genera el navegador.

---

## 24 de noviembre de 2026

### Documentos del proyecto · [PR #6](https://github.com/elisavajoan/Projecte-Personal/pull/6)
- Se suben `CONTEXTO.md`, `PERSONALIDAD.md` y `MEMORIA.md`, los documentos que explican el proyecto. La web no cambia. ([0d31d0d](https://github.com/elisavajoan/Projecte-Personal/commit/0d31d0d))

### Título más pequeño y reloj de arena grande · [PR #7](https://github.com/elisavajoan/Projecte-Personal/pull/7)
- En pantalla ancha, el título ocupa el 56 % del ancho, a la izquierda. En 1440 px pasa de 248 a 132 px. En el móvil sigue de lado a lado. ([a6c8fb0](https://github.com/elisavajoan/Projecte-Personal/commit/a6c8fb0))
- A la derecha de la portada aparece el reloj de arena de la entrada, en grande. Gira con el ratón y con el scroll, los caracteres se desordenan cerca del puntero y la arena cae a medida que bajas. En el móvil va entre el título y los referentes.
- Mientras se ve la portada, el reloj pequeño de arriba a la izquierda se esconde. Al bajar, el reloj se queda de logo.
- Rendimiento: 58 fps en la portada con el ratón en movimiento (antes 60).
- Se añade este archivo, `log.md`.

---

## Ideas que se probaron y se descartaron

| Idea | Qué la sustituyó |
|---|---|
| Animación de máscara y párrafo que se iluminaba con el scroll (18/11) | El texto decodificado al estilo de aino.agency. |
| Logo en la cabecera (19/11) | Los tres botones del Figma: Investigació, Contextualització y Conceptualització. |
| Scroll imantado que paraba en cada pantalla (20/11) | El scroll libre y, después, el scroll suave con inercia. |
| Cabecera que se escondía al bajar (20/11) | La cabecera siempre fija. |
| Corredor de caracteres, plano y en 3D, en la entrada (20–21/11) | El reloj de arena de caracteres. |
| Fondo de huracán de código en la entrada (21/11) | La entrada negra solo con el reloj de arena. |
| Reloj de arena pequeño abajo a la derecha (21/11) | Arriba a la izquierda, porque abajo tapaba los textos de los referentes en el móvil. |
