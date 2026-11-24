# CONTEXT · Les Hores En El Disseny
Última actualización: 24/11/2026

> El mapa del proyecto: de qué va, con qué datos y qué está decidido. Lo largo solo se nombra y se dice dónde está.
> Se actualiza cada vez que se decide algo. Cómo se trabaja va en [SOUL.md](SOUL.md), los criterios de cada petición en [INSTRUCTIONS.md](INSTRUCTIONS.md) y lo que se ha probado en [LOG.md](LOG.md).

Proyecto de la asignatura de Web de Joan, 3.º en Elisava (Barcelona), 2026. Tiene tres fases (Investigació, Contextualització y Conceptualització) y tres clases: **Daniel** (la web, en código), **Tona** (el prototipo en Figma y la memoria) e **Iván** (sketches de p5.js con datos propios).

## La pregunta
¿Cuánto tiempo dedican los diseñadores a aprender los programas de diseño?

- La frase que la abre en la web: «I tu, de què treballaràs? El que fas tu és fàcil, no? No feu exàmens?»
- La tesis: «El resultat es veu en un segon. Arribar-hi costa milers d'hores.»

## Los datos
- **Informe de telemetría de Joan:** horas de uso de 7 programas, con la sesión media y el patrón de uso de cada uno. Total: **6.486,48 h**, que son 270 días seguidos.
  - Figma 1.786,61 h (27,55 %) · Photoshop 1.415,25 h · Illustrator 1.238,80 h · Premiere Pro 867,95 h · After Effects 602,80 h · InDesign 430,29 h · Bridge 144,78 h.
  - Están en el Figma (frame «Informe de telemetría») y en la web (pantalla `#datos` de `index.html`).
- **Datos de los sketches de p5 (Iván):** `david.csv` y `joan.csv` (horas del día), `places_gracia.xml` (117 puntos GPS del 2/11, de Gràcia hacia el centro) y `chat-1.txt` (un chat de WhatsApp, del que se usa el 27/8/24: 256 mensajes).
- Falta: las fechas exactas de inicio y fin del informe y con qué aplicación se midió. Por confirmar con Joan.
- No tengo: horas de otros diseñadores (todas las cifras de la web son de Joan) ni una medida del tiempo de *aprender* separada del tiempo de *usar*. La IA no debe suponer medias de «los diseñadores» ni inventar cifras.

## El tono
Silencioso y contundente. Blanco y negro, mucho aire y cifras enormes.
Una imagen: «un reloj de arena hecho de código: el tiempo que no se ve, cayendo».

## Referentes
- **aino.agency:** la entrada con caracteres ASCII que reaccionan al ratón y dan paso a un espacio blanco y limpio, y la estructura del pie. No: su contenido de agencia.
- **Mesh 3D:** el scrollytelling que convierte estadísticas frías en una experiencia. No: el 3D realista ni el color.
- **Pinnacl:** las cifras de impacto encabezan la jerarquía, con bloques numerados y un diseño oscuro.
- **State of AI Design:** la estructura de revista digital por capítulos. No: las encuestas a terceros (aquí los datos son de una sola persona).
- **Studio Mirage (Ubisoft):** miles de piezas individuales que forman un monumento común, como los caracteres que forman el reloj y el torbellino.
- **Contrarreferente:** un panel de estadísticas con gráficos de colores, y la propuesta de los compañeros (sirve para ver qué apartados se piden, no cómo resolverlos).

## Decisiones
- 18/11 · Blanco y negro puro y una sola familia tipográfica. Motivo: el contraste viene de la escala y del ritmo, no del color.
- 20/11 · La portada y la cabecera de la web siguen el Figma (WEB 1). Motivo: la web y el prototipo tienen que parecer del mismo autor.
- 20/11 · Entrada al estilo de aino.agency con un reloj de arena de caracteres que gira con el ratón. Motivo: el reloj que se vacía es el tiempo.
- 21/11 · Toda la web en catalán. Motivo: lo pidió Joan («ponlo todo en catalán»).
- 21/11 · Título «La Importància / Del Temps». El nombre «Les Hores En El Disseny» se queda en la entrada, el pie y la pestaña.
- 21/11 · Reloj de arena pequeño, fijo arriba a la izquierda, que gira con el scroll y se vacía según el avance de la página.
- 21/11 · Bricolage Grotesque en toda la web, dentro del repositorio (`fonts/`). En el Figma, desde el 23/11. Motivo: lo pidió Joan, y el Figma tiene que ir igual que la web.
- 21/11 · Nada de p5 en GitHub. Motivo: Joan no lo quiere (se cerró la PR #2 sin fusionar).
- 21/11 · En p5, solo lo que se ha enseñado en clase, con la estructura de los ejemplos de los compañeros. Motivo: al profesor no le gusta que se use lo que no ha enseñado.
- 21/11 · El chat de p5 usa el martes 27/8/24. Motivo: es el día con más mensajes de todo el chat (256).
- 21–23/11 · Las secciones de la memoria (Les 4Q, Keywords, Valors, To i personalitat, Conclusions y Concepte) van dentro de WEB 1, como partes de la web. Motivo: corrección de Joan.
- 24/11 · Título de la portada más pequeño (56 % del ancho) y reloj de arena grande a la derecha. Motivo: lo pidió Joan.
- 24/11 · Los documentos del proyecto siguen las plantillas de clase (CONTEXT, SOUL, INSTRUCTIONS y LOG) y cada cambio de la web se apunta en LOG.md. Motivo: lo pidió Joan.

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
- 21–23/11 · Las secciones de la memoria como láminas sueltas en una página aparte: tienen que ir dentro de WEB 1.
- 21–23/11 · «Villà» en Les 4Q: se cambió por «Antiheroi».

## Estado
**Hecho:**
- Web publicada y al día (PR #1 a #7): https://elisavajoan.github.io/Projecte-Personal/ · Repositorio: https://github.com/elisavajoan/Projecte-Personal
- Prototipo en Figma, frame WEB 1 (Page 2), con las secciones integradas y animadas: [archivo `6D1aD6nIipQGMjvi4Brt6i`](https://www.figma.com/design/6D1aD6nIipQGMjvi4Brt6i/?node-id=102-53).
- Las tres entregas de p5 (usuario `elisavajoan`): [Shrub situation](https://editor.p5js.org/elisavajoan/sketches/KlNYrT8Xe) (datos), [gps-data copy](https://editor.p5js.org/elisavajoan/sketches/kthvzVxWS) (recorrido sobre mapa) y «text-chat copy» (chat).

**Siguiente:**
- Web: los botones de la cabecera todavía no llevan a ninguna sección.
- Figma: revisar los textos borrador escritos por Claude (hipótesis, 4Q, keywords, valores, tono y conclusión).
- Memoria de Tona: saber qué formato y extensión pide y escribir el borrador.

El historial anterior (los tres documentos antiguos, con los detalles de Figma y de p5) está en la carpeta del proyecto, en `archivo/`, y en el historial de GitHub.
