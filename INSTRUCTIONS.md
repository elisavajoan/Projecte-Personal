# INSTRUCTIONS · Les Hores En El Disseny

> Lo que tiene que cumplir cada resultado para darlo por bueno. Se escribe **antes** de pedir.
> Si no se puede comprobar mirando el resultado, no es un criterio: es un deseo.
> Los bloques del 21/11 y del 24/11 se reconstruyeron el 24/11 a partir de lo que se pidió, porque este archivo aún no existía.

## 21/11 · Toda la web en catalán

QUIERO: que todos los textos de la web estén en catalán.

SERÁ BUENO SI:
- No queda ninguna palabra en castellano en la web: títulos, botones, datos, descripciones de las imágenes ni la pestaña.
- El HTML lleva `lang="ca"`.
- Las cifras usan la coma decimal y el punto de los miles (6.486,48 h).

NO SIRVE SI:
- Queda un texto en castellano escondido, por ejemplo en un `alt` o en una ficha desplegable.
- Cambia el sentido de una frase al traducirla.

LO SABRÉ PORQUE: recorro la web de arriba abajo, abro las 7 fichas de datos y busco palabras en castellano en `index.html`.

## 21/11 · Animaciones más fluidas y profesionales

QUIERO: que las animaciones de la web vayan mucho más fluidas, al nivel de una web de estudio.

SERÁ BUENO SI:
- La entrada y el torbellino van a más fotogramas por segundo que antes (se mide antes y después).
- El scroll y los enlaces internos se deslizan con suavidad.
- Con «reducir movimiento» no hay animaciones.

NO SIRVE SI:
- Algún efecto va a tirones en un ordenador normal.
- Se pierde algún efecto que ya funcionaba.

LO SABRÉ PORQUE: las cifras de fps antes y después (la entrada pasó de 43 a 55 fps y el torbellino de 21 a 36) y la prueba de la web con «reducir movimiento».

## 21/11 · «La Importància Del Temps» y reloj que acompaña el scroll

QUIERO: el título «La Importància Del Temps» en grande y un reloj de arena que acompañe el scroll.

SERÁ BUENO SI:
- El título de la portada dice «La Importància / Del Temps», en dos líneas.
- El reloj de arena gira al hacer scroll (al revés si subes) y la arena cae a medida que avanzas por la página.
- El reloj no tapa ningún texto, tampoco en el móvil.

NO SIRVE SI:
- El reloj tapa los textos de los referentes en el móvil (pasó con la primera posición, abajo a la derecha).

LO SABRÉ PORQUE: bajo la página entera en el ordenador y en el móvil y miro el reloj al principio, a la mitad y al final.

## 21/11 · Título en Bold Oblique, de lado a lado

QUIERO: el título en cursiva bold, que ocupe de lado a lado de la página y que sea más grande.

SERÁ BUENO SI:
- La línea más larga llega de un margen al otro, con el mismo margen a cada lado.
- Sigue llenando el ancho al cambiar el tamaño de la ventana.
- No aparece scroll horizontal.

NO SIRVE SI:
- El título se sale de la pantalla o se corta.

LO SABRÉ PORQUE: lo miro en 1440 px, en 1920 px, en el móvil y cambiando el tamaño de la ventana.

## 21/11 · Bricolage Grotesque en toda la web

QUIERO: cambiar toda la tipografía de la web a Bricolage Grotesque.

SERÁ BUENO SI:
- Todos los textos de la web usan Bricolage Grotesque, menos los caracteres de código (la entrada y el torbellino), que son monoespaciados.
- La fuente va dentro del repositorio y no depende de Google Fonts.
- Ninguna letra se pisa con la de al lado y los botones de la cabecera no se solapan.

NO SIRVE SI:
- En algún sitio sigue apareciendo Helvetica o Arial.
- Al cargar, el texto salta de una tipografía a otra de forma visible.

LO SABRÉ PORQUE: reviso la web en el ordenador y en el móvil, y en el inspector del navegador la fuente que se usa es Bricolage Grotesque.

## 24/11 · Título más pequeño y reloj de arena a la derecha de la portada

QUIERO: hacer más pequeño el título de la web y añadir el reloj de arena a la derecha de la portada.

SERÁ BUENO SI:
- En el ordenador, el título ocupa la parte izquierda y el reloj, la derecha, sin tocarse.
- El reloj se mueve con el ratón y con el scroll, y la arena cae a medida que bajas.
- En el móvil, el reloj cabe entre el título y los referentes.
- No hay dos relojes a la vez en la pantalla.

NO SIRVE SI:
- La portada va más lenta que antes de forma apreciable.
- El reloj se corta por los lados.

LO SABRÉ PORQUE: lo pruebo en 1440 px, en 1920 px, en una tableta, en el móvil y con «reducir movimiento», y mido los fps de la portada (58, antes 60).

## 24/11 · Log de las actualizaciones de la web

QUIERO: un archivo con cada actualización que he hecho en la web, subido a GitHub.

SERÁ BUENO SI:
- Están todas las actualizaciones, desde la primera versión (18/11) hasta la última.
- Cada una tiene su fecha y el enlace a su commit o a su pull request.
- Se puede leer en pocos minutos.

NO SIRVE SI:
- Falta alguna actualización o algún enlace no funciona.

LO SABRÉ PORQUE: comparo el log con el historial de commits del repositorio.

## 24/11 · Documentos del proyecto con las plantillas de clase

QUIERO: cambiar los documentos de contexto, personalidad y memoria por las plantillas de clase (CONTEXT, SOUL, INSTRUCTIONS y LOG), personalizadas con mi proyecto.

SERÁ BUENO SI:
- Los cuatro archivos tienen los mismos apartados que las plantillas y no queda ningún [corchete] por rellenar.
- SOUL.md tiene unas 20 líneas y habla de cómo trabajar, no del proyecto.
- Lo que no se sabe dice «por confirmar» o «no lo sé», en lugar de inventarse.
- No se pierde nada de lo que había: lo largo está en `archivo/`.

NO SIRVE SI:
- Hay una cifra o una fecha inventada.
- Desaparece información que necesitan el Figma o los sketches de p5.

LO SABRÉ PORQUE: busco «[» en los cuatro archivos, cuento las líneas de SOUL.md y comparo CONTEXT.md con los documentos antiguos.
