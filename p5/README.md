# Web · Clase de Iván (p5.js)

Copia del código de los sketches hechos en el [editor de p5.js](https://editor.p5js.org/elisavajoan/sketches).
Cada carpeta funciona sola: abre su `index.html` (p5.js 2.3.4 desde CDN).

| # | Carpeta | Sketch original | Fecha | Qué hace |
|---|---------|-----------------|-------|----------|
| 01 | [01-ritmo-diario](01-ritmo-diario/) | [Same slug](https://editor.p5js.org/elisavajoan/sketches/WEanNk8m6) | 19–20 oct 2026 | Círculos sobre una línea de 24 h: posición = hora, tamaño = caracteres. |
| 02 | [02-datos-david-joan](02-datos-david-joan/) | [Shrub situation](https://editor.p5js.org/elisavajoan/sketches/KlNYrT8Xe) | 1 nov 2026 | Lee `david.csv` y `joan.csv` (hora, longitud) y dibuja barras: negras David, blancas Joan. |
| 03 | [03-mapa-gps](03-mapa-gps/) | [Bygone stem](https://editor.p5js.org/elisavajoan/sketches/4HfOAkTJz) | 16 nov 2026 | Lee un recorrido GPS (`places.xml`, KML del 2 nov) y dibuja la ruta en rojo. |

Evolución: datos escritos a mano → datos en CSV → datos de localización reales.

## Fichas

### 01 · Ritmo diario
- **Datos:** dos arrays en el código, `horas` y `caracteres`.
- **Técnica:** `for`, `map()` de 0–24 h al ancho del lienzo, `circle()`.
- **Arreglado:** `horas.lenght` → `horas.length` (antes no se dibujaba nada).
- **Pendiente:** _qué pidió Iván / qué representa “caracteres”._

### 02 · Datos David y Joan
- **Datos:** `david.csv` y `joan.csv`, columnas `time,length`.
- **Técnica:** `loadTable()` con `await`, `for…of` sobre filas, barras con `rect()` desde el centro.
- **Arreglado:** se declara `let david` (antes `let otto`, sin usar); `fill(1000,…)` → `fill(255,…)`.
- **Pendiente:** _leyenda o etiquetas de horas._

### 03 · Mapa GPS
- **Datos:** `places.xml` (KML con puntos `gx:coord`).
- **Técnica:** `loadXML()`, extraer coordenadas, `map()` de lon/lat al lienzo, `beginShape()/vertex()`.
- **Arreglado:** `loadImage('.png')` no tenía archivo; queda comentado con instrucciones para añadir un mapa de fondo.
- **Pendiente:** _imagen de mapa de fondo y fondo de color._
