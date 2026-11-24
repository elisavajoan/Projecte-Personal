# LOG · Les Hores En El Disseny

> Lo que se ha probado con la IA en la web y qué ha pasado: una entrada por petición, con su fecha.
> Lo importante es «Aprendido»: la próxima vez va al criterio ([INSTRUCTIONS.md](INSTRUCTIONS.md)) o a [SOUL.md](SOUL.md).
> Web: https://elisavajoan.github.io/Projecte-Personal/ · Hay que añadir una entrada cada vez que cambie la web.
> Las entradas del 18 al 20/11 se reconstruyeron a partir de los commits, porque las peticiones no se apuntaron.

## 18/11 · Primera versión de la web
Joan crea el repositorio y sube `index.html`, `style.css` y `script.js`. Es el punto de partida.
Cambios: [92bb286](https://github.com/elisavajoan/Projecte-Personal/commit/92bb286), [91db0e3](https://github.com/elisavajoan/Projecte-Personal/commit/91db0e3)

## 18/11 · Rediseño en blanco y negro
Criterio: blanco y negro puro, con cuatro pantallas (portada, manifiesto con el total de horas, torbellino y datos por programa). 1 vuelta. ✅
Aprendido: el contraste viene de la escala y del ritmo, no del color.
Cambios: [bb9cc56](https://github.com/elisavajoan/Projecte-Personal/commit/bb9cc56)

## 19/11 · Texto decodificado como en aino.agency
Criterio: cada letra pasa por una escala de símbolos hasta la letra real, sin que el texto se mueva. 1 vuelta. ✅
Aprendido: con un ancho fijo para cada letra, la maquetación no salta mientras cambian los símbolos.
Cambios: [b563315](https://github.com/elisavajoan/Projecte-Personal/commit/b563315)

## 19/11 · Helvetica Bold, cabecera con logo y título «Les Hores En El Disseny»
Criterio: una sola tipografía, sin Google Fonts, y el efecto del ratón en todos los textos. 2 vueltas (el texto del botón se partía en dos líneas). ✅
Aprendido: después se cambiaron la tipografía (21/11) y la cabecera (20/11), así que estas decisiones se apuntan en CONTEXT.md para no volver atrás.
Cambios: [fd11a11](https://github.com/elisavajoan/Projecte-Personal/commit/fd11a11), [d6319a7](https://github.com/elisavajoan/Projecte-Personal/commit/d6319a7)

## 19/11 · Las cinco pantallas de referentes
Criterio: cada referente con su captura, su texto y el enlace a la web real, como en el Figma. 1 vuelta. ✅
Aprendido: en el móvil, la captura arriba y el texto debajo.
Cambios: [a919887](https://github.com/elisavajoan/Projecte-Personal/commit/a919887)

## 19/11 · Logo en la cabecera
Criterio: el logo original, sin tocar. 2 vueltas (primero con letras blancas y contorno negro). ❌ Se quitó el 20/11.
Aprendido: el logo original no se retoca.
Cambios: [0032c1d](https://github.com/elisavajoan/Projecte-Personal/commit/0032c1d), [5a4808a](https://github.com/elisavajoan/Projecte-Personal/commit/5a4808a)

## 20/11 · Cabecera y portada iguales que el Figma
Criterio: el título, el menú y los referentes en la misma posición y tamaño que WEB 1. 2 vueltas. ✅
Aprendido: las medidas salen del marco de 1710 px del Figma y se pasan a vw para que escalen con la pantalla.
Cambios: [39a7071](https://github.com/elisavajoan/Projecte-Personal/commit/39a7071), [6a5a786](https://github.com/elisavajoan/Projecte-Personal/commit/6a5a786)

## 20/11 · Mosaico de caracteres y efecto al pasar el ratón
Criterio: el mosaico se recorta con la forma exacta de cada letra y el efecto se mantiene mientras el ratón está encima. 6 vueltas. ✅
Aprendido: el efecto se entiende mejor si afecta a la palabra entera y no a una sola letra.
Cambios: [2294134](https://github.com/elisavajoan/Projecte-Personal/commit/2294134), [6a751a7](https://github.com/elisavajoan/Projecte-Personal/commit/6a751a7), [3b3a43e](https://github.com/elisavajoan/Projecte-Personal/commit/3b3a43e), [aa8ee45](https://github.com/elisavajoan/Projecte-Personal/commit/aa8ee45), [557bbbe](https://github.com/elisavajoan/Projecte-Personal/commit/557bbbe), [7594b2e](https://github.com/elisavajoan/Projecte-Personal/commit/7594b2e)

## 20/11 · Pantalla de entrada y pie al estilo de aino.agency
Criterio: un reloj de arena de caracteres que gira con el ratón, «CLICA PER ENTRAR» y una cascada que descubre la portada. 1 vuelta. ✅
Aprendido: con un enlace directo a una sección, la entrada se salta.
Cambios: [8a14b38](https://github.com/elisavajoan/Projecte-Personal/commit/8a14b38)

## 20/11 · Scroll libre y cabecera siempre fija
Criterio: el scroll no se para en cada pantalla y la cabecera no se esconde. 1 vuelta. ✅
Aprendido: Joan prefiere el scroll libre y la cabecera siempre a la vista.
Cambios: [f99510a](https://github.com/elisavajoan/Projecte-Personal/commit/f99510a), [4b22430](https://github.com/elisavajoan/Projecte-Personal/commit/4b22430)

## 20/11 · Torbellino de horas
Criterio: un huracán de código con forma de embudo doble y las cifras legibles por encima. 1 vuelta. ✅
Aprendido: si el ordenador va justo, se reduce poco a poco el número de caracteres en lugar de ir a tirones.
Cambios: [d2b1007](https://github.com/elisavajoan/Projecte-Personal/commit/d2b1007)

## 20–21/11 · Corredor de caracteres en la entrada
Criterio: una persona corriendo hecha de caracteres dentro del código. 5 vueltas (plano, con volumen, en 3D, plano con fondo de huracán). ❌ Se volvió al reloj de arena.
Aprendido: antes de modelar una figura nueva, hay que comprobar que cuente el concepto del tiempo, como ya hacía el reloj de arena (suposición).
Cambios: [aecca1d](https://github.com/elisavajoan/Projecte-Personal/commit/aecca1d), [e1b2353](https://github.com/elisavajoan/Projecte-Personal/commit/e1b2353), [07d41a6](https://github.com/elisavajoan/Projecte-Personal/commit/07d41a6), [d9e3f8b](https://github.com/elisavajoan/Projecte-Personal/commit/d9e3f8b), [8850187](https://github.com/elisavajoan/Projecte-Personal/commit/8850187)

## 21/11 · Que el navegador no enseñe copias antiguas
Criterio: después de publicar, se ve la versión nueva sin borrar la caché. 1 vuelta. ✅
Aprendido: cada cambio en `script.js` o `style.css` sube el número de versión (`?v=`).
Cambios: [536c68e](https://github.com/elisavajoan/Projecte-Personal/commit/536c68e)

## 21/11 · Toda la web en catalán
Criterio: ningún texto en castellano, tampoco en las descripciones de las imágenes. 1 vuelta. ✅
Aprendido: los textos de la web y del Figma van siempre en catalán.
Cambios: [c588523](https://github.com/elisavajoan/Projecte-Personal/commit/c588523) · [PR #1](https://github.com/elisavajoan/Projecte-Personal/pull/1)

## 21/11 · Animaciones más fluidas y profesionales
Criterio: más fps que antes, medidos. 1 vuelta. ✅ La entrada pasó de 43 a 55 fps y el torbellino de 21 a 36. Se añadieron el scroll suave y la cortina de los referentes.
Aprendido: se mide antes y después; sin cifras no se puede decir que va más fluido.
Cambios: [6215ae2](https://github.com/elisavajoan/Projecte-Personal/commit/6215ae2) · [PR #1](https://github.com/elisavajoan/Projecte-Personal/pull/1)

## 21/11 · «La Importància Del Temps» y reloj de arena que acompaña el scroll
Criterio: el reloj gira con el scroll, la arena cae con el avance y no tapa ningún texto. 2 vueltas (abajo a la derecha tapaba los referentes en el móvil, y pasó arriba a la izquierda). ✅
Aprendido: un elemento fijo se prueba en el móvil antes de decidir dónde va.
Cambios: [916fcb4](https://github.com/elisavajoan/Projecte-Personal/commit/916fcb4) · [PR #3](https://github.com/elisavajoan/Projecte-Personal/pull/3)

## 21/11 · Título en Bold Oblique, de lado a lado
Criterio: la línea más larga llena el ancho, con el mismo margen a cada lado, en cualquier pantalla. 1 vuelta. ✅ En 1440 px pasó de unos 190 a 248 px de alto.
Aprendido: el tamaño se calcula midiendo la tinta real de las letras, no con un número fijo.
Cambios: [785bc6c](https://github.com/elisavajoan/Projecte-Personal/commit/785bc6c) · [PR #4](https://github.com/elisavajoan/Projecte-Personal/pull/4)

## 21/11 · Bricolage Grotesque en toda la web
Criterio: ninguna letra se pisa y los botones de la cabecera no se solapan. 2 vueltas (con el tracking de Helvetica las letras se pisaban y los botones chocaban). ✅
Aprendido: al cambiar de tipografía hay que revisar el tracking y las posiciones fijas. Bricolage no tiene cursiva: la genera el navegador.
Cambios: [68e41bc](https://github.com/elisavajoan/Projecte-Personal/commit/68e41bc) · [PR #5](https://github.com/elisavajoan/Projecte-Personal/pull/5)

## 24/11 · Documentos del proyecto en GitHub
Criterio: los documentos en la raíz del repositorio, sin tocar la web. 1 vuelta. ✅
Cambios: [0d31d0d](https://github.com/elisavajoan/Projecte-Personal/commit/0d31d0d) · [PR #6](https://github.com/elisavajoan/Projecte-Personal/pull/6)

## 24/11 · Título más pequeño y reloj de arena grande a la derecha de la portada
Criterio: el título y el reloj no se tocan, no hay dos relojes a la vez y la portada no pierde fluidez. 2 vueltas (en la tableta el dibujo tenía huecos y los caracteres eran demasiado pequeños). ✅ 58 fps (antes 60).
Aprendido: el tamaño de los caracteres va según la caja del reloj, no según el ancho de la ventana.
Cambios: [a6c8fb0](https://github.com/elisavajoan/Projecte-Personal/commit/a6c8fb0) · [PR #7](https://github.com/elisavajoan/Projecte-Personal/pull/7)

## 24/11 · Log de las actualizaciones de la web
Criterio: todas las actualizaciones, con su fecha y su enlace. 2 vueltas (primero como `log.md`, una lista de cambios, y después con el formato de la plantilla de clase en este LOG.md). ✅
Aprendido: el log se escribe con el formato de clase desde el principio.
Cambios: [eeb98f3](https://github.com/elisavajoan/Projecte-Personal/commit/eeb98f3) · [PR #7](https://github.com/elisavajoan/Projecte-Personal/pull/7)

## 24/11 · Documentos con las plantillas de clase
Criterio: CONTEXT, SOUL, INSTRUCTIONS y LOG personalizados, sin huecos de la plantilla, sin datos inventados y sin perder nada de lo que había. 2 vueltas (primero los antiguos se sustituyeron y quedaron en `archivo/`; después Joan pidió fusionar su contenido dentro: CONTEXTO y MEMORIA en CONTEXT, PERSONALIDAD en SOUL, y la lista de antes de entregar y las peticiones de Figma y p5 en INSTRUCTIONS). Pendiente de que Joan lo revise.
Aprendido: cuando Joan pide cambiar unos documentos por otros, quiere conservar el contenido: se fusiona en el archivo que toca, no se archiva.
Cambios: [PR #8](https://github.com/elisavajoan/Projecte-Personal/pull/8)
