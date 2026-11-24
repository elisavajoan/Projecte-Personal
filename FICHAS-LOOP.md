# FICHAS DEL LOOP · Les Hores En El Disseny
Última actualización: 24/11/2026

> Una ficha por cada scroll (pantalla) de la web que se ha trabajado con la IA.
> El loop es **pedir → la IA lo hace → se verifica → se decide → se ajusta**, hasta que cumple el criterio.
> En cada ficha se dice **dónde decides tú** (Joan) y **quién verifica el resultado**.
> Los datos salen de [LOG.md](LOG.md) (vueltas y commits) y de [INSTRUCTIONS.md](INSTRUCTIONS.md) (criterios).
> Lo que pasó entre el 18 y el 20/11 se reconstruyó a partir de los commits. Lo que no consta se marca *(por confirmar con Joan)*.

**Quién hace qué en todas las fichas**
- **Joan decide:** qué se pide, el criterio, qué se queda y qué se descarta entre vueltas, y el **Merge** de la PR, que es el sí final.
- **Claude verifica la parte técnica:** mide los fps antes y después, prueba en el ordenador, en el móvil, al cambiar el tamaño de la ventana y con «reducir movimiento», y adjunta capturas.
- **Joan verifica el resultado:** mira la web publicada (Cmd+Shift+R) y comprueba el «LO SABRÉ PORQUE» de INSTRUCTIONS.md.

## Mapa de scrolls
| # | Scroll | Ficha | Vueltas | Estado |
|---|---|---|---|---|
| 0 | Entrada (`#entrada`) | 1 | 6 | ✅ |
| 1 | Portada (`#portada`) | 2 | 6 | ✅ |
| 2 | Manifiesto (`#proceso`) | — | — | No se ha trabajado aparte (va en el rediseño del 18/11) |
| 3 | Torbellino (`#torbellino`) | 3 | 2 | ✅ |
| 4 | Datos (`#datos`) | 4 | 2 | ✅ |
| 5 | Referentes (`#ref-*`) | 5 | 2 | ✅ |
| 6 | Pie (`#pie`) | 6 | 1 | ✅ |
| ↕ | El recorrido del scroll (toda la página) | 7 | 4 | ✅ |

---

## Ficha 1 · Scroll 0 · Entrada

**Qué es:** la pantalla de carga negra con el reloj de arena de caracteres que gira, la barra «=», «CARREGANT n %», «CLICA PER ENTRAR» y la cascada de caracteres que descubre la portada.

**Pedido:** una entrada al estilo de aino.agency, hecha con caracteres de código.
**Criterio:** el reloj gira con el ratón, la cascada descubre la portada y va fluida (INSTRUCTIONS · 21/11 «Animaciones más fluidas»).

**El loop**
| Vuelta | Qué hizo la IA | Qué se vio | Decisión |
|---|---|---|---|
| 1 · 20/11 | Entrada con reloj de arena y cascada ([8a14b38](https://github.com/elisavajoan/Projecte-Personal/commit/8a14b38)) | Funciona | Se queda |
| 2–5 · 20–21/11 | Corredor de caracteres: plano, con volumen, en 3D y plano con fondo de huracán ([aecca1d](https://github.com/elisavajoan/Projecte-Personal/commit/aecca1d), [e1b2353](https://github.com/elisavajoan/Projecte-Personal/commit/e1b2353), [07d41a6](https://github.com/elisavajoan/Projecte-Personal/commit/07d41a6), [d9e3f8b](https://github.com/elisavajoan/Projecte-Personal/commit/d9e3f8b)) | No cuenta el tiempo como el reloj | ❌ Se descarta |
| 6 · 21/11 | Vuelta al reloj de arena sin corredor ([8850187](https://github.com/elisavajoan/Projecte-Personal/commit/8850187)) y menos trabajo por fotograma ([6215ae2](https://github.com/elisavajoan/Projecte-Personal/commit/6215ae2)) | De 43 a 55 fps en el peor caso | ✅ Se queda |

**Dónde decides tú**
- Pedir la entrada al estilo de aino.agency.
- Descartar el corredor y volver al reloj de arena, después de 4 vueltas.
- Dar el Merge a la PR #1.

**Quién verifica**
- Claude: los fps antes y después (43 → 55) y la prueba con «reducir movimiento».
- Joan: que el reloj se vea, gire y descubra la portada en la web publicada. Que hiciera esta comprobación con el corredor está *(por confirmar con Joan)*.

**Aprendido:** antes de modelar una figura nueva, hay que comprobar que cuente el concepto del tiempo, como ya hacía el reloj de arena.

---

## Ficha 2 · Scroll 1 · Portada

**Qué es:** el título grande, el reloj de arena grande a la derecha y los enlaces a los 5 referentes.

**Pedido (en tus palabras):** «En el títol m'agradaria posar l'importància del Temps en gran», «el titulo en cursiva bold i que ocupe de lado a lado», «fer més petit el títol» y «el rellotge de sorra a la dreta de la home».
**Criterio:** INSTRUCTIONS · 21/11 «Título en Bold Oblique, de lado a lado» y 24/11 «Título más pequeño y reloj de arena a la derecha».

**El loop**
| Vuelta | Qué hizo la IA | Qué se vio | Decisión |
|---|---|---|---|
| 1–2 · 20/11 | Portada igual que WEB 1 del Figma ([39a7071](https://github.com/elisavajoan/Projecte-Personal/commit/39a7071), [6a5a786](https://github.com/elisavajoan/Projecte-Personal/commit/6a5a786)) | Igual que el Figma | ✅ |
| 3 · 21/11 | Título «La Importància / Del Temps» ([916fcb4](https://github.com/elisavajoan/Projecte-Personal/commit/916fcb4), PR #3) | En dos líneas, grande | ✅ Merge |
| 4 · 21/11 | Bold Oblique de lado a lado, medido según la tinta real de las letras ([785bc6c](https://github.com/elisavajoan/Projecte-Personal/commit/785bc6c), PR #4) | En 1440 px, de 190 a 248 px de alto | ✅ Merge |
| 5–6 · 24/11 | Título al 56 % del ancho y reloj grande a la derecha. En la tableta el dibujo tenía huecos y se corrigió ([a6c8fb0](https://github.com/elisavajoan/Projecte-Personal/commit/a6c8fb0), PR #7) | 58 fps (antes 60). No hay dos relojes a la vez | ✅ |

**Dónde decides tú**
- El texto del título («La Importància Del Temps»).
- La cursiva bold y que ocupe de lado a lado.
- Hacerlo más pequeño y poner el reloj a la derecha.
- El Merge de las PR #3, #4 y #7.

**Quién verifica**
- Claude: lo prueba en 1440 px, en 1920 px, en la tableta, en el móvil y al cambiar el tamaño de la ventana, y mide los fps de la portada. Adjunta capturas.
- Joan: que el título se lea como quiere y que el reloj no tape nada en la web publicada.

**Aprendido:** el tamaño se calcula midiendo la tinta real de las letras, y el de los caracteres del reloj según su caja, no según el ancho de la ventana.

---

## Ficha 3 · Scroll 3 · Torbellino

**Qué es:** un huracán de código en forma de embudo doble con «6.486,48 h» encima.

**Pedido:** un torbellino de horas que haga sentir el volumen de tiempo.
**Criterio:** las cifras se leen por encima del huracán y no va a tirones (INSTRUCTIONS · 21/11 «Animaciones más fluidas»).

**El loop**
| Vuelta | Qué hizo la IA | Qué se vio | Decisión |
|---|---|---|---|
| 1 · 20/11 | Huracán con forma de embudo doble y los datos por encima ([d2b1007](https://github.com/elisavajoan/Projecte-Personal/commit/d2b1007)) | Se ve bien, pero en un ordenador justo va a 21 fps | Se queda y se optimiza |
| 2 · 21/11 | Menos trabajo por fotograma ([6215ae2](https://github.com/elisavajoan/Projecte-Personal/commit/6215ae2), PR #1) | De 21 a 36 fps, con el mismo aspecto | ✅ Merge |

**Dónde decides tú**
- Pedir que las animaciones sean «mucho más fluidas y profesionales».
- Aceptar que se vea igual pero vaya más rápido (Merge de la PR #1).

**Quién verifica**
- Claude: mide los fps en el peor caso, un ordenador sin tarjeta gráfica (21 → 36).
- Joan: que se vea fluido en su ordenador.

**Aprendido:** sin cifras no se puede decir que va más fluido. Si el ordenador va justo, se reduce poco a poco el número de caracteres en lugar de ir a tirones.

---

## Ficha 4 · Scroll 4 · Datos

**Qué es:** los 7 programas, cada uno con su ficha desplegable (horas, sesión media, patrón y tendencia).

**Pedido:** las horas por programa del informe de telemetría, en catalán.
**Criterio:** INSTRUCTIONS · 21/11 «Toda la web en catalán»: no queda ninguna palabra en castellano, tampoco en las 7 fichas, y las cifras usan la coma decimal.

**El loop**
| Vuelta | Qué hizo la IA | Qué se vio | Decisión |
|---|---|---|---|
| 1 · 18/11 | Rediseño en blanco y negro con la pantalla de datos por programa ([bb9cc56](https://github.com/elisavajoan/Projecte-Personal/commit/bb9cc56)) | Datos en castellano | Se queda |
| 2 · 21/11 | Traducción al catalán de las 7 fichas y de la nota de horas ([c588523](https://github.com/elisavajoan/Projecte-Personal/commit/c588523), PR #1) | Ninguna palabra en castellano | ✅ Merge |

**Dónde decides tú**
- Las cifras: salen de tu informe de telemetría, la IA no las inventa ni las cambia.
- «Ponlo todo en catalán».
- El Merge de la PR #1.

**Quién verifica**
- Claude: busca palabras en castellano en `index.html` y abre las 7 fichas.
- Joan: que las cifras coinciden con su informe y que el catalán suena como él lo diría.

**Aprendido:** los textos de la web y del Figma van siempre en catalán.

---

## Ficha 5 · Scroll 5 · Referentes

**Qué es:** las 5 pantallas (Mesh 3D, State of AI Design, aino.agency, Pinnacl y Studio Mirage), cada una con su captura, su texto y el enlace.

**Pedido:** los referentes del Figma, en la web, con una entrada más profesional.
**Criterio:** cada referente con su captura, su texto y su enlace, como en el Figma, y la entrada fluida.

**El loop**
| Vuelta | Qué hizo la IA | Qué se vio | Decisión |
|---|---|---|---|
| 1 · 19/11 | Las cinco pantallas del Figma ([a919887](https://github.com/elisavajoan/Projecte-Personal/commit/a919887)) | En el móvil, la captura arriba y el texto debajo | ✅ |
| 2 · 21/11 | La captura entra como una cortina con zoom y el texto sube línea a línea ([6215ae2](https://github.com/elisavajoan/Projecte-Personal/commit/6215ae2), PR #1) | Más fluido, sin tirones | ✅ Merge |

**Dónde decides tú**
- Qué cinco referentes van y qué texto lleva cada uno.
- El Merge de la PR #1.
- Si pasan a una rejilla de fichas al estilo de aino (idea pendiente).

**Quién verifica**
- Claude: la prueba en el ordenador y en el móvil y con «reducir movimiento».
- Joan: que el texto de cada referente dice lo que él quiere.

**Aprendido:** un elemento fijo (el reloj pequeño) se prueba en el móvil antes de decidir dónde va, porque aquí tapaba los textos de los referentes.

---

## Ficha 6 · Scroll 6 · Pie

**Qué es:** el pie con la estructura de aino: «Les Hores En El Disseny · BCN · Elisava · Investigació, contextualització i conceptualització · 2026».

**Pedido:** un pie al estilo de aino.agency.
**Criterio:** la misma estructura que el pie de aino, con los datos del proyecto.

**El loop**
| Vuelta | Qué hizo la IA | Qué se vio | Decisión |
|---|---|---|---|
| 1 · 20/11 | Pie con la estructura de aino, junto con la entrada ([8a14b38](https://github.com/elisavajoan/Projecte-Personal/commit/8a14b38)) | Funciona | ✅ |

**Dónde decides tú**
- Tomar aino.agency como referente del pie.
- Qué contacto y qué redes se añaden (idea pendiente: faltan tus enlaces).

**Quién verifica**
- Claude: la prueba en el ordenador y en el móvil.
- Joan: que los datos del pie son correctos *(por confirmar con Joan)*.

**Aprendido:** con un enlace directo a una sección, la entrada se salta.

---

## Ficha 7 · ↕ El recorrido del scroll (toda la página)

**Qué es:** cómo se mueve la página al hacer scroll: scroll libre, cabecera fija, scroll suave con inercia y el reloj de arena pequeño que gira y se vacía con el avance.

**Pedido (en tus palabras):** «la animació del rellotge de arena que vagi acompanyant amb l'scroll» y «llevar a un nivel superior la web y las animaciones».
**Criterio:** INSTRUCTIONS · 21/11 «“La Importància Del Temps” y reloj que acompaña el scroll»: el reloj gira con el scroll (al revés si se sube), la arena cae con el avance y no tapa ningún texto, tampoco en el móvil.

**El loop**
| Vuelta | Qué hizo la IA | Qué se vio | Decisión |
|---|---|---|---|
| 1 · 20/11 | Se quita el scroll imantado y la cabecera deja de esconderse ([f99510a](https://github.com/elisavajoan/Projecte-Personal/commit/f99510a), [4b22430](https://github.com/elisavajoan/Projecte-Personal/commit/4b22430)) | Scroll libre y cabecera siempre a la vista | ✅ |
| 2 · 21/11 | Scroll con inercia (solo con ratón o trackpad) y enlaces con deslizamiento suave ([6215ae2](https://github.com/elisavajoan/Projecte-Personal/commit/6215ae2), PR #1) | En el móvil y con «reducir movimiento», scroll normal | ✅ Merge |
| 3 · 21/11 | Reloj de arena pequeño abajo a la derecha | Tapaba los textos de los referentes en el móvil | ❌ Se descarta |
| 4 · 21/11 | El reloj pasa arriba a la izquierda, como un logo ([916fcb4](https://github.com/elisavajoan/Projecte-Personal/commit/916fcb4), PR #3) | Capturas al 0 %, 33 %, 66 % y 100 % del scroll | ✅ Merge |

**Dónde decides tú**
- Scroll libre en lugar de imantado, y cabecera siempre fija.
- Que el reloj acompañe el scroll.
- La velocidad del scroll suave (se ajusta con un número si no te convence).
- El Merge de las PR #1 y #3.

**Quién verifica**
- Claude: baja la página entera en el ordenador y en el móvil, mira el reloj al principio, a la mitad y al final, y comprueba que no tape ningún texto.
- Joan: que el movimiento le parezca natural con su ratón o su trackpad.

**Aprendido:** un elemento fijo se prueba en el móvil antes de decidir dónde va.

---

## Plantilla para la próxima ficha

```
## Ficha N · Scroll X · [Nombre]

**Qué es:** [qué se ve en ese scroll].
**Pedido (en tus palabras):** «…»
**Criterio:** [bloque de INSTRUCTIONS.md].

**El loop**
| Vuelta | Qué hizo la IA | Qué se vio | Decisión |
|---|---|---|---|
| 1 · dd/mm | … ([commit]) | … | ✅ / ❌ |

**Dónde decides tú**
- [qué pides, qué se queda, qué se descarta, el Merge]

**Quién verifica**
- Claude: [la prueba técnica: fps, móvil, «reducir movimiento», capturas].
- Joan: [la comprobación final en la web publicada].

**Aprendido:** [lo que va a SOUL.md o a INSTRUCTIONS.md].
```
