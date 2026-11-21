/* =========================================================
   LES HORES EN EL DISSENY · script.js

   1. Utilidades y datos (se leen del HTML)
   2. Texto "decodificado": cada letra se forma con muchos caracteres
      (como el wordmark de aino.agency), recortados con la forma exacta
      de la tipografía, hasta convertirse en la letra real
   3. Torbellino de horas (canvas)
   4. Arranque: totales, aparición al entrar en pantalla,
      filas desplegables
   ========================================================= */

(() => {
  'use strict';

  /* ---------- 1. Utilidades y datos ---------- */

  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

  const TAU = Math.PI * 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const suave = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  // 1786.61 -> "1.786,61"
  function formato(n, decimales = 2) {
    const [entero, resto] = n.toFixed(decimales).split('.');
    const conPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return decimales ? `${conPuntos},${resto}` : conPuntos;
  }

  // Los datos viven en el HTML (data-horas). Aquí solo se leen.
  const programas = $$('.programa').map(el => ({
    el,
    nombre: el.dataset.nombre,
    horas: parseFloat(el.dataset.horas),
  }));
  const totalHoras = programas.reduce((suma, p) => suma + p.horas, 0);
  const maxHoras = Math.max(...programas.map(p => p.horas));

  const NUMEROS = ['', 'un', 'dos', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou', 'deu'];

  /* ---------- 2. Texto decodificado ---------- */

  // Escala de símbolos, de más densos a más claros (es la escala de aino.agency).
  // Cada letra recorre esta escala desde el final (blanco) hasta su propio sitio.
  const RAMPA = '$MBNQØW@&R8GD6S9ÖOH#ÉE5UK0ÄÅA2XP34ZC%VIF17YTJL[]?}{()<>|=+\\/^!";*_:~,\'-.·` ';
  // Las minúsculas usan la misma escala sin números ni símbolos raros
  const RAMPA_MIN = RAMPA.toLowerCase().replace(/[0-9@&#$%()[\]{}|\\/?!;*^]/g, '');

  const VACIO = '​';   // espacio de ancho cero: mantiene la altura de la línea
  const suavizar = e => (e < 0.5 ? 2 * e * e : (4 - 2 * e) * e - 1);   // easeInOutQuad

  function rampaDe(letra) {
    const esMinuscula = letra === letra.toLowerCase() && letra !== letra.toUpperCase();
    const rampa = esMinuscula ? RAMPA_MIN : RAMPA;
    return { rampa, indice: rampa.indexOf(esMinuscula ? letra : letra.toUpperCase()) };
  }

  // Símbolo que se ve durante la aparición (h va de 0 a 1)
  function glifoAparicion(letra, h) {
    const { rampa, indice } = rampaDe(letra);
    if (indice === -1) return letra;                       // acentos y signos fuera de la escala: aparecen directos
    return rampa[Math.floor(lerp(rampa.length, indice, h))] ?? VACIO;
  }

  // Convierte el texto de un elemento en letras sueltas (.let) con ancho fijo
  function preparar(el) {
    const completo = el.textContent.replace(/\s+/g, ' ').trim();

    const nodos = [];
    const recorrido = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = recorrido.nextNode(); n; n = recorrido.nextNode()) nodos.push(n);

    // Copia para lectores de pantalla (lo visual va con aria-hidden)
    const lector = document.createElement('span');
    lector.className = 'sr-only';
    lector.textContent = completo;

    const letras = [];
    for (const nodo of nodos) {
      if (!nodo.textContent.trim()) continue;
      const envoltorio = document.createElement('span');
      envoltorio.setAttribute('aria-hidden', 'true');
      nodo.textContent.replace(/\s+/g, ' ').split(' ').forEach((trozo, i) => {
        if (i > 0) envoltorio.append(' ');
        if (!trozo) return;
        const pal = document.createElement('span');
        pal.className = 'pal';
        for (const c of trozo) {
          const s = document.createElement('span');
          s.className = 'let';
          s.dataset.c = c;
          s.textContent = c;
          pal.append(s);
          letras.push(s);
        }
        envoltorio.append(pal);
      });
      nodo.replaceWith(envoltorio);
    }
    el.prepend(lector);

    fijarAnchos(letras);
    for (const s of letras) {
      s.classList.add('oc');
      s._oc = true;
      s._listo = false;
    }
    el.classList.add('dividido');
  }

  // Muestra u oculta la letra real. La letra siempre está en el DOM: solo cambia su color,
  // así el navegador repinta pero no vuelve a maquetar la línea en cada fotograma.
  function verLetra(s, visible) {
    if (s._oc === !visible) return;
    s._oc = !visible;
    s.classList.toggle('oc', !visible);
  }

  // Mide cada letra y fija su ancho (en em, para que siga siendo fluido).
  // Así la línea no se mueve cuando la letra pasa por símbolos más anchos o más estrechos.
  function fijarAnchos(letras) {
    letras.forEach(s => { s.style.width = ''; });
    const anchos = letras.map(s => s.getBoundingClientRect().width);
    const tamanos = letras.map(s => parseFloat(getComputedStyle(s.parentNode.parentNode).fontSize));
    letras.forEach((s, i) => { s.style.width = (anchos[i] / tamanos[i]) + 'em'; });
  }

  /* Hover. El estado NO depende de los eventos de entrada y salida del ratón (los navegadores
     los disparan de más cuando el texto cambia bajo un puntero quieto): mientras el puntero esté
     sobre un texto, cada fotograma se comprueba dónde está y qué letras tiene debajo. */

  const TEXTO_GRANDE = 40;                  // desde este tamaño (px) la palabra solo se activa con el puntero dentro de ella; en texto fino se deja un margen
  const RETARDO_LETRA = 22;                 // ms entre una letra y la siguiente cuando se deshace una palabra
  const puntero = { x: -1, y: -1, dentro: false };
  let versionScroll = 0;                    // sube con cada scroll: las medidas guardadas dejan de valer
  const evaluadores = new Set();
  let bucleHover = false;

  window.addEventListener('mousemove', e => {
    puntero.x = e.clientX; puntero.y = e.clientY; puntero.dentro = true;
  }, { passive: true, capture: true });
  window.addEventListener('mouseout', e => { if (!e.relatedTarget) puntero.dentro = false; });   // el puntero sale de la ventana
  window.addEventListener('blur', () => { puntero.dentro = false; });
  window.addEventListener('scroll', () => { versionScroll++; }, { passive: true });

  function pasoHover() {
    for (const evaluar of [...evaluadores]) evaluar();
    if (evaluadores.size) requestAnimationFrame(pasoHover);
    else bucleHover = false;
  }
  function despertarHover(evaluar) {
    evaluadores.add(evaluar);
    if (!bucleHover) { bucleHover = true; requestAnimationFrame(pasoHover); }
  }

  function activarGlitch(el) {
    if (sinMovimiento || !window.matchMedia('(hover: hover)').matches) return;
    let medidas = [];                       // una entrada por palabra: sus letras y su caja
    let medidoEn = 0;
    let medidoVersion = -1;
    let margen = 0;
    const retenidas = new Set();            // letras que se mantienen deshechas porque el puntero sigue encima

    const medir = () => {
      medidas = $$('.pal', el).map(p => ({ letras: $$('.let', p), r: p.getBoundingClientRect() }));
      medidoEn = performance.now();
      medidoVersion = versionScroll;
      // el texto fino es difícil de acertar: se deja un pequeño margen alrededor de la palabra
      margen = parseFloat(getComputedStyle(el).fontSize) >= TEXTO_GRANDE ? 0 : 4;
    };

    const soltarTodas = () => {
      for (const s of retenidas) soltarMosaico(el, s);
      retenidas.clear();
    };

    // Se ejecuta en cada fotograma mientras el puntero esté sobre este texto
    const evaluar = () => {
      const bajo = puntero.dentro ? document.elementFromPoint(puntero.x, puntero.y) : null;
      if (!bajo || !el.contains(bajo)) {      // el puntero ya no está sobre el texto
        soltarTodas();
        evaluadores.delete(evaluar);
        return;
      }
      if (!medidas.length || medidoVersion !== versionScroll || performance.now() - medidoEn > 300) medir();

      // La palabra que tienes debajo (si los márgenes de dos se pisan, la de centro más cercano)
      const { x, y } = puntero;
      let activa = null, mejor = Infinity;
      for (const w of medidas) {
        const r = w.r;
        if (x < r.left - margen || x >= r.right + margen || y < r.top - margen || y >= r.bottom + margen) continue;
        const d = Math.abs(x - (r.left + r.width / 2));
        if (d < mejor) { mejor = d; activa = w; }
      }

      // Toda la palabra se deshace a la vez (con un pequeño desfase de una letra a otra) y se mantiene mientras sigas encima
      for (const w of medidas) {
        const dentro = w === activa;
        w.letras.forEach((s, i) => {
          if (retenidas.has(s) && !letraRetenida(el, s)) retenidas.delete(s);   // la animación se acabó o la cambió otra: se vuelve a lanzar si sigue debajo
          if (dentro) {
            if (s._listo && !retenidas.has(s) && glitchMosaico(el, s, Math.min(i * RETARDO_LETRA, 220))) retenidas.add(s);
          } else if (retenidas.has(s)) {
            soltarMosaico(el, s);
            retenidas.delete(s);
          }
        });
      }
    };

    // Los eventos solo sirven para "despertar" la comprobación
    el.addEventListener('mouseenter', () => despertarHover(evaluar));
    el.addEventListener('mousemove', () => despertarHover(evaluar));
  }

  // Si la tipografía llega tarde, se vuelven a medir las letras
  function remedirTodo() {
    ajustarTitulo();
    fijarAnchos($$('.let'));
    medirMosaicos(mosaicos.filter(m => m.medido));
  }

  /* ---------- 2b. Mosaico ----------
     Todo el texto se forma con muchos caracteres, como el wordmark de aino.agency:
     cada letra se dibuja en un canvas, se divide en una rejilla y cada casilla recibe
     un carácter según lo llena que esté (N = llena, 9, ?, +, - y . = casi vacía).
     Una máscara con la forma exacta de la tipografía recorta los caracteres, así que
     nunca sobresalen del perímetro de la letra.
     Los caracteres aparecen pasando por la escala de símbolos, y cuando la letra
     está formada entra la letra real y el mosaico se deshace. */

  // De más llena a más vacía: [cobertura mínima, carácter]
  const NIVELES_MOSAICO = [[.5, 'N'], [.32, '9'], [.18, '?'], [.08, '+'], [.01, '-']];
  const FUENTE_MOSAICO = '"SF Mono", ui-monospace, Menlo, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';
  const FILAS_POR_EM = 16;      // filas de caracteres por cada em de texto (más = caracteres más pequeños)
  const CELDA_MIN = 3.5;        // alto mínimo de una casilla, en px
  const MAX_CELDAS = 36000;
  const PROPORCION = 0.56;      // ancho / alto de una casilla (la de una tipografía monoespaciada)

  // En qué momento (fracción de la duración de la letra) pasa cada cosa
  const FASES = {
    aparicion: { forma: .40, oculta: 0,  letra: .70 },   // se forma el mosaico, entra la letra real, el mosaico se deshace
    glitch:    { forma: .30, oculta: .1, letra: .55, sosten: .46 },   // al pasar el ratón: la letra se descompone, se mantiene mientras el puntero esté encima y se recompone al irse
  };

  const mosaicos = [];
  let bucleMosaicos = false;

  // El canvas va dentro del propio elemento; si es "inline" (un enlace dentro de un párrafo),
  // dentro del primer ascendiente que sea un bloque
  function anfitrionDe(el) {
    let a = el;
    while (a.parentElement && getComputedStyle(a).display === 'inline') a = a.parentElement;
    return a;
  }

  function crearMosaico(el) {
    const lienzo = document.createElement('canvas');
    lienzo.className = 'mosaico';
    lienzo.setAttribute('aria-hidden', 'true');
    const m = {
      el, lienzo, ctx: lienzo.getContext('2d'), anfitrion: null,
      letras: $$('.let', el).map((span, i) => {
        span._idx = i;
        return { span, c: span.dataset.c, anim: null, celdas: [], color: '#fff' };
      }),
      atlas: null, mascara: null, medido: false, celdaW: 1, celdaH: 1, dpr: 1,
    };
    el._mosaico = m;
    mosaicos.push(m);
    return m;
  }

  // Atlas de caracteres: todos los glifos de un lienzo dibujados en una sola imagen (16 × 16 huecos).
  // Copiar siempre desde la misma imagen deja que la tarjeta gráfica agrupe miles de copias
  // en unas pocas operaciones, en lugar de cambiar de imagen en cada carácter.
  function crearAtlas(w, h, pintar) {
    const LADO = 16;
    const lienzo = document.createElement('canvas');
    lienzo.width = w * LADO; lienzo.height = h * LADO;
    const c = lienzo.getContext('2d');
    const huecos = new Map();
    return {
      lienzo, w, h,
      // Posición [x, y] del glifo dentro del atlas (se dibuja la primera vez que se pide)
      hueco(clave, ...datos) {
        let pos = huecos.get(clave);
        if (pos === undefined) {
          if (huecos.size >= LADO * LADO) { c.clearRect(0, 0, lienzo.width, lienzo.height); huecos.clear(); }
          const n = huecos.size;
          pos = [(n % LADO) * w, Math.floor(n / LADO) * h];
          c.save();
          c.beginPath(); c.rect(pos[0], pos[1], w, h); c.clip();
          pintar(c, pos[0], pos[1], ...datos);
          c.restore();
          huecos.set(clave, pos);
        }
        return pos;
      },
    };
  }

  // Mide varios textos a la vez: primero se leen todas las medidas y después se escribe.
  // Así el navegador calcula la maquetación una sola vez, y no una vez por cada texto.
  function medirMosaicos(lista) {
    const datos = lista.map(leerMosaico);
    lista.forEach((m, i) => aplicarMosaico(m, datos[i]));
  }
  function medirMosaico(m) { medirMosaicos([m]); }

  // Lee dónde cae cada letra, dibuja las letras en canvas ocultos (la máscara y el raster
  // para medir) y reparte un carácter por casilla. No toca la página.
  function leerMosaico(m) {
    const { el, letras } = m;
    const caja = el.getBoundingClientRect();
    if (!caja.width || !caja.height) return null;

    const host = anfitrionDe(el);
    const hacerRelativo = getComputedStyle(host).position === 'static';
    const cajaHost = host.getBoundingClientRect();

    // Las letras reales siempre están en su sitio (ocultas solo con el color), así que se miden tal cual
    const rango = document.createRange();
    const medidas = letras.map(l => {
      const cs = getComputedStyle(l.span);
      rango.selectNodeContents(l.span);
      const r = rango.getBoundingClientRect();
      const rs = l.span.getBoundingClientRect();
      return {
        fuente: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
        tam: parseFloat(cs.fontSize), color: cs.color,
        x: r.left - caja.left, arriba: r.top - caja.top, alto: r.height,
        x0: rs.left - caja.left, x1: rs.right - caja.left,
        y0: rs.top - caja.top, y1: rs.bottom - caja.top,
      };
    });

    // El canvas sobresale del texto (rabos de la y, etc.)
    const tamMax = Math.max(...medidas.map(d => d.tam));
    const ext = Math.ceil(tamMax * 0.35);
    const W = Math.ceil(caja.width + ext * 2);
    const H = Math.ceil(caja.height + ext * 2);
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    // Las letras tal cual son: sirven para medir la cobertura y, a doble resolución, de máscara
    const pintar = (cv, escala) => {
      const c = cv.getContext('2d', { willReadFrequently: escala === 1 });
      c.scale(escala, escala);
      c.fillStyle = '#fff';
      c.textBaseline = 'alphabetic';
      letras.forEach((l, i) => {
        const d = medidas[i];
        c.font = d.fuente;
        const ascenso = c.measureText(l.c).fontBoundingBoxAscent ?? d.alto * 0.8;
        c.fillText(l.c, ext + d.x, ext + d.arriba + ascenso);
      });
      return c;
    };
    const crudo = document.createElement('canvas');
    crudo.width = W; crudo.height = H;
    const alfa = pintar(crudo, 1).getImageData(0, 0, W, H).data;
    const mascara = document.createElement('canvas');
    mascara.width = Math.round(W * dpr); mascara.height = Math.round(H * dpr);
    pintar(mascara, dpr);

    // Tamaño de las casillas
    let celdaH = Math.max(CELDA_MIN, tamMax / FILAS_POR_EM);
    const celdasDe = h => (W / (h * PROPORCION)) * (H / h);
    if (celdasDe(celdaH) > MAX_CELDAS) celdaH *= Math.sqrt(celdasDe(celdaH) / MAX_CELDAS);
    const celdaW = celdaH * PROPORCION;
    const cols = Math.ceil(W / celdaW);
    const filas = Math.ceil(H / celdaH);

    // Cobertura de cada casilla = media del alfa de sus píxeles
    const suma = new Float32Array(cols * filas);
    const colDe = new Uint16Array(W);
    for (let x = 0; x < W; x++) colDe[x] = Math.min(cols - 1, Math.floor(x / celdaW));
    for (let y = 0; y < H; y++) {
      const base = Math.min(filas - 1, Math.floor(y / celdaH)) * cols;
      const fila = y * W * 4 + 3;
      for (let x = 0; x < W; x++) suma[base + colDe[x]] += alfa[fila + x * 4];
    }

    // Dónde cae la tinta de cada letra. Con el tracking negativo de los titulares el dibujo sobresale
    // de la caja de la letra (la «D» de «Disseny» invade la caja de la «i»), y esa parte tiene que
    // animarse con su letra y no con la vecina.
    const medidor = document.createElement('canvas').getContext('2d');
    medidas.forEach((d, i) => {
      medidor.font = d.fuente;
      const tm = medidor.measureText(letras[i].c);
      d.tintaI = d.x - tm.actualBoundingBoxLeft;
      d.tintaD = d.x + tm.actualBoundingBoxRight;
      d.conTinta = tm.actualBoundingBoxLeft + tm.actualBoundingBoxRight > 0;
    });

    // Dueño de cada casilla: la letra sobre la que cae (con un poco de margen arriba y abajo)
    const dueno = new Int16Array(cols * filas).fill(-1);
    const filasDe = d => {
      const margen = d.tam * 0.12;
      return [Math.max(0, Math.floor((d.y0 - margen + ext) / celdaH)),
              Math.min(filas - 1, Math.floor((d.y1 + margen + ext) / celdaH))];
    };
    medidas.forEach((d, i) => {
      const c0 = Math.max(0, Math.floor((d.x0 + ext) / celdaW));
      const c1 = Math.min(cols - 1, Math.floor((d.x1 + ext) / celdaW));
      const [f0, f1] = filasDe(d);
      for (let f = f0; f <= f1; f++) for (let c = c0; c <= c1; c++) dueno[f * cols + c] = i;
    });
    // Lo que sobresale de la caja pasa a su letra, siempre que esa zona no sea tinta de la letra vecina
    medidas.forEach((d, i) => {
      if (!d.conTinta) return;
      const c0 = Math.max(0, Math.floor((d.tintaI + ext) / celdaW));
      const c1 = Math.min(cols - 1, Math.floor((d.tintaD + ext) / celdaW));
      const f0 = Math.max(0, Math.floor((d.y0 + ext) / celdaH));
      const f1 = Math.min(filas - 1, Math.floor((d.y1 + ext) / celdaH));
      for (let c = c0; c <= c1; c++) {
        const cx = (c + .5) * celdaW - ext;
        if (cx < d.tintaI || cx > d.tintaD) continue;
        for (let f = f0; f <= f1; f++) {
          const k = f * cols + c;
          const j = dueno[k];
          if (j === i) continue;
          if (j >= 0) {
            const dj = medidas[j];
            const cy = (f + .5) * celdaH - ext;
            if (dj.conTinta && cy >= dj.y0 && cy <= dj.y1 && cx >= dj.tintaI && cx <= dj.tintaD) continue;
          }
          dueno[k] = i;
        }
      }
    });

    const celdas = letras.map(() => []);
    const area = celdaW * celdaH * 255;
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < cols; c++) {
        const cob = suma[f * cols + c] / area;
        const nivel = NIVELES_MOSAICO.find(([min]) => cob >= min);
        if (!nivel) continue;
        let i = dueno[f * cols + c];
        if (i < 0) {                                  // fuera de todas las letras: la más cercana
          const cx = (c + .5) * celdaW - ext;
          const cy = (f + .5) * celdaH - ext;
          let distMin = Infinity;
          for (let j = 0; j < medidas.length; j++) {
            const d = medidas[j];
            const dx = Math.max(d.x0 - cx, 0, cx - d.x1);
            const dy = Math.max(d.y0 - cy, 0, cy - d.y1);
            const dist = dx * dx + dy * dy;
            if (dist < distMin) { distMin = dist; i = j; }
          }
        }
        celdas[i].push({ c, f, car: nivel[1], r1: Math.random(), r2: Math.random() });
      }
    }

    return {
      host, hacerRelativo, celdas, colores: medidas.map(d => d.color),
      dpr, celdaW, celdaH, mascara, W, H,
      left: caja.left - cajaHost.left - host.clientLeft - ext,
      top: caja.top - cajaHost.top - host.clientTop - ext,
    };
  }

  // Coloca el canvas visible en el mismo sitio que el texto, con el margen extra
  function aplicarMosaico(m, d) {
    if (!d) { m.medido = false; return; }
    if (d.hacerRelativo) d.host.style.position = 'relative';
    if (m.lienzo.parentNode !== d.host) d.host.append(m.lienzo);
    m.anfitrion = d.host;
    m.letras.forEach((l, i) => { l.celdas = d.celdas[i]; l.color = d.colores[i]; });
    m.dpr = d.dpr; m.celdaW = d.celdaW; m.celdaH = d.celdaH; m.mascara = d.mascara;
    const aw = Math.max(1, Math.round(d.celdaW * d.dpr));
    const ah = Math.max(1, Math.round(d.celdaH * d.dpr));
    m.atlas = crearAtlas(aw, ah, (c, x, y, car, color) => {
      c.fillStyle = color;
      c.font = `600 ${ah * 0.92}px ${FUENTE_MOSAICO}`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(car, x + aw / 2, y + ah / 2 + ah * 0.04);
    });
    const lz = m.lienzo;
    lz.width = d.mascara.width; lz.height = d.mascara.height;
    lz.style.width = d.W + 'px'; lz.style.height = d.H + 'px';
    lz.style.left = d.left + 'px';
    lz.style.top = d.top + 'px';
    m.medido = true;
  }

  // Cuando termina la animación se libera la memoria del canvas
  function liberarMosaico(m) {
    if (!m.medido) return;
    m.lienzo.width = 0; m.lienzo.height = 0;
    m.mascara = null; m.atlas = null; m.medido = false;
    m.letras.forEach(l => { l.celdas = []; });
  }

  // Dibuja un fotograma. Devuelve true mientras alguna letra siga animándose.
  function dibujarMosaico(m, ahora) {
    if (!m.medido) return false;
    const { ctx, lienzo, dpr, celdaW, celdaH, atlas } = m;
    const aw = atlas.w, ah = atlas.h, fuente = atlas.lienzo;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    let activo = false;
    for (const l of m.letras) {
      const a = l.anim;
      if (!a) continue;
      activo = true;
      if (ahora < a.inicio) continue;
      const f = FASES[a.modo];
      let p;
      if (a.modo === 'glitch') {
        // Se queda deshecha (en f.sosten) hasta que el puntero se va; entonces sigue hasta recomponerse
        p = a.soltar == null ? Math.min(f.sosten, (ahora - a.inicio) / a.dur) : a.pFijo + (ahora - a.soltar) / a.dur;
      } else {
        p = (ahora - a.inicio) / a.dur;
      }
      const s = l.span;

      if (p >= 1) {                                   // terminó: queda la letra real
        verLetra(s, true);
        s._listo = true; s._glitch = false; l.anim = null;
        continue;
      }
      // La letra real se esconde mientras se forma el mosaico y vuelve cuando toca
      verLetra(s, p >= f.letra || p < f.oculta);

      for (const k of l.celdas) {
        const edad = (p - k.r1 * f.forma) / .16;                       // la casilla aparece
        if (edad <= 0) continue;
        const funde = f.letra + k.r2 * (1 - f.letra - .12);            // y luego se deshace
        const fase = (p - funde) / .12;
        if (fase >= 1) continue;
        let car = k.car;
        if (edad < 1) car = glifoAparicion(k.car, suavizar(edad));
        else if (fase > 0) car = glifoAparicion(k.car, 1 - fase);
        if (!car || car === VACIO || car === ' ') continue;
        const [sx, sy] = atlas.hueco(l.color + car, car, l.color);
        ctx.drawImage(fuente, sx, sy, aw, ah, Math.round(k.c * celdaW * dpr), Math.round(k.f * celdaH * dpr), aw, ah);
      }
    }
    // La máscara deja los caracteres solo dentro del perímetro de las letras
    if (activo) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(m.mascara, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    }
    return activo;
  }

  function pasoMosaicos() {
    const ahora = performance.now();
    let sigue = false;
    for (const m of mosaicos) {
      if (dibujarMosaico(m, ahora)) sigue = true;
      else liberarMosaico(m);
    }
    if (sigue) requestAnimationFrame(pasoMosaicos);
    else bucleMosaicos = false;
  }

  function arrancarMosaicos() {
    if (bucleMosaicos) return;
    bucleMosaicos = true;
    requestAnimationFrame(pasoMosaicos);
  }

  // Aparición. data-velocidad = ms de retraso entre una letra y la siguiente (la ola de izquierda a derecha);
  // data-duracion = ms que tarda cada letra en formarse
  function decodificar(el, retardo = 0) {
    const m = el._mosaico || crearMosaico(el);
    if (!m.medido) medirMosaico(m);
    const velocidad = parseFloat(el.dataset.velocidad) || 1;
    const duracion = parseFloat(el.dataset.duracion) || 400;
    const inicio = performance.now() + retardo;
    m.letras.forEach((l, i) => {
      l.span._glitch = false;
      if (!m.medido) {                                // texto oculto o sin medidas: se muestra directamente
        verLetra(l.span, true); l.span._listo = true; return;
      }
      verLetra(l.span, false);
      l.span._listo = false;
      l.anim = { modo: 'aparicion', inicio: inicio + i * velocidad, dur: duracion };
    });
    if (m.medido) arrancarMosaicos();
  }

  // Varios textos que empiezan a la vez: se miden todos juntos y después arrancan.
  // retardoDe(el, i) dice cuántos ms espera cada uno.
  function decodificarVarios(els, retardoDe) {
    if (!els.length) return;
    const retardos = els.map(retardoDe);              // lecturas antes de escribir nada
    const ms = els.map(el => el._mosaico || crearMosaico(el));
    medirMosaicos(ms.filter(m => !m.medido));
    els.forEach((el, i) => decodificar(el, retardos[i]));
  }

  // Al pasar el ratón, la letra se descompone en caracteres y se mantiene así mientras el puntero siga encima.
  // Devuelve false si no se pudo (todavía no hay medidas, o la letra aún se está formando).
  function glitchMosaico(el, span, retardo = 0) {
    const m = el._mosaico || crearMosaico(el);
    if (!m.medido) medirMosaico(m);
    const l = m.letras[span._idx];
    if (!m.medido || !l) return false;
    if (l.anim && l.anim.modo === 'aparicion') return false;
    span._glitch = true;
    l.anim = { modo: 'glitch', inicio: performance.now() + retardo, dur: 1000, soltar: null, pFijo: 0 };
    arrancarMosaicos();
    return true;
  }

  // ¿Sigue la letra deshecha por el puntero (animación de glitch sin soltar)?
  function letraRetenida(el, span) {
    const m = el._mosaico;
    const l = m && m.letras[span._idx];
    return !!(l && l.anim && l.anim.modo === 'glitch' && l.anim.soltar == null);
  }

  // El puntero se va: la letra deja de estar retenida y se recompone
  function soltarMosaico(el, span) {
    const m = el._mosaico;
    const l = m && m.letras[span._idx];
    const a = l && l.anim;
    if (!a || a.modo !== 'glitch' || a.soltar != null) return;
    const ahora = performance.now();
    if (ahora < a.inicio) { l.anim = null; span._glitch = false; return; }   // el puntero se fue antes de que le tocara: no llegó a deshacerse
    a.pFijo = Math.min(FASES.glitch.sosten, (ahora - a.inicio) / a.dur);
    a.soltar = ahora;
  }

  // Si cambia el tamaño de la ventana, se vuelve a medir
  let tamanoPrevio = window.innerWidth;
  let esperaTamano;
  window.addEventListener('resize', () => {
    if (window.innerWidth === tamanoPrevio) return;       // en móvil, la barra de direcciones no cuenta
    tamanoPrevio = window.innerWidth;
    clearTimeout(esperaTamano);
    esperaTamano = setTimeout(() => medirMosaicos(mosaicos.filter(m => m.medido)), 200);
  });

  // Cada elemento se anima una sola vez, cuando entra en pantalla (como en aino.agency)
  const observador = new IntersectionObserver(entradas => {
    const nuevos = [];
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      observador.unobserve(el);
      el.classList.add('in');
      if (!sinMovimiento && el.hasAttribute('data-decode')) nuevos.push(el);
    }
    decodificarVarios(nuevos, retardoCascada);
  }, { threshold: 0.2 });

  /* ---------- 3. Torbellino ---------- */

  function iniciarTorbellino() {
    const lienzo = $('#lienzo');
    if (!lienzo) return;

    const banda = lienzo.parentElement;
    const ctx = lienzo.getContext('2d');
    const fuente = getComputedStyle(document.body).fontFamily;
    const admiteTracking = 'letterSpacing' in ctx;   // tracking apretado también en el canvas
    // Cada programa aparece tantas veces como le corresponde por sus horas.
    // En pantallas pequeñas hay menos cifras para que no se amontonen.
    function crearParticulas(total) {
      const lista = [];
      let g = 0;
      for (const p of programas) {
        const n = Math.max(1, Math.round(p.horas / totalHoras * total));
        for (let k = 0; k < n; k++, g++) {
          lista.push({
            nombre: p.nombre,
            texto: formato(p.horas) + ' h',
            peso: Math.sqrt(p.horas / maxHoras),    // 0..1, decide el tamaño
            fase: (g * 0.618034) % 1,               // reparte los momentos de vida
            periodo: 12 + (g % 5) * 1.3,            // segundos que tarda en subir
            angulo0: (g * 2.399963) % TAU,          // reparte los ángulos
            giro: 0.45 + (g % 4) * 0.12,            // velocidad de giro
          });
        }
      }
      return lista;
    }

    // --- El huracán de código: miles de caracteres que suben girando por un embudo doble ---
    // Ancho arriba, fino en el centro y otra vez ancho abajo (un hiperboloide, como un huracán visto de lado).
    const BRAZOS = 5;                                  // las corrientes en espiral que se ven en el huracán
    const GIRO_ESPIRAL = 2.4;                          // cuánto se retuerce de un extremo al otro (radianes por unidad de altura)
    const SIMBOLOS = '0123456789' + '0123456789' + '{}[]()<>;:=+-*/\\|&%$#@!?_~^' + 'abcdefnxuvtrsi';
    let CELDA = 0;                                     // tamaño de cada carácter en el atlas (px reales)

    // Todos los caracteres se dibujan una vez en una tira y después solo se copian a su tamaño.
    // El atlas se hace del tamaño al que se van a ver los caracteres: así casi no hay que escalarlos,
    // la copia es más rápida y se ven nítidos.
    const atlas = document.createElement('canvas');
    function pintarAtlas(celda) {
      if (celda === CELDA) return;
      CELDA = celda;
      atlas.width = CELDA * SIMBOLOS.length;
      atlas.height = CELDA;
      const c = atlas.getContext('2d');
      c.fillStyle = '#fff';
      c.font = `500 ${CELDA * 0.8}px ${FUENTE_MOSAICO}`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      for (let i = 0; i < SIMBOLOS.length; i++) c.fillText(SIMBOLOS[i], CELDA * i + CELDA / 2, CELDA / 2 + CELDA * 0.04);
    }
    // Tamaño base de un carácter del código, en px de pantalla
    const celdaBaseDe = ancho => 14.5 * 1.25 * Math.max(0.6, Math.min(1, ancho / 900)) * (ancho > 900 ? 1 : 1.35);

    function crearCodigo(total) {
      const lista = [];
      for (let i = 0; i < total; i++) {
        const interior = Math.random() < 0.16;          // algunos caracteres van por dentro y dan volumen
        lista.push({
          v0: Math.random(),
          vel: 1 / (11 + Math.random() * 7),            // altura que sube por segundo
          brazo: (i % BRAZOS) * TAU / BRAZOS + (Math.random() + Math.random() - 1) * 0.3,
          radio: interior ? 0.3 + Math.random() * 0.5 : 0.93 + Math.random() * 0.15,
          interior,
          brillo: 0.5 + Math.random() * 0.5,
          tam: 0.8 + Math.random() * 0.45,
          ritmo: 0.4 + Math.random() * 1.6,             // veces por segundo que cambia de carácter
          semilla: Math.floor(Math.random() * 65536),
        });
      }
      return lista;
    }

    let particulas = [];
    let codigo = [];
    let totalActual = 0;
    let W = 0, H = 0;
    let tiempo = 3, reloj = 0, impulso = 0;
    let corriendo = false, previo = 0;
    let mediaCuadro = 16, cuadros = 0;      // si el equipo va justo, se reduce poco a poco el número de caracteres

    function ajustar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = banda.clientWidth;
      H = banda.clientHeight;
      const total = W > 900 ? 18 : 12;
      if (total !== totalActual) {
        totalActual = total;
        particulas = crearParticulas(total);
        codigo = crearCodigo(W > 900 ? 4200 : 2300);
      }
      lienzo.width = Math.round(W * dpr);
      lienzo.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pintarAtlas(Math.max(12, Math.ceil(celdaBaseDe(W) * 1.2 * dpr)));
      dibujar();
    }

    function dibujar() {
      ctx.clearRect(0, 0, W, H);
      const ancha = W > 900;
      const cx = W * (ancha ? 0.7 : 0.5);
      const yAbajo = H * 0.92, yArriba = H * 0.08;
      const rMax = Math.min(W * (ancha ? 0.28 : 0.46), H * 0.5);
      const rMin = rMax * 0.17;
      const inclinacion = 0.22;
      const escala = Math.max(0.6, Math.min(1, W / 900));     // todo más pequeño en móvil

      // Forma del huracán: u = 0 abajo, 1 arriba
      const radioEn = u => {
        const x = 2 * u - 1;
        return Math.sqrt(rMin * rMin + (rMax * rMax - rMin * rMin) * x * x);
      };
      const balanceo = u => Math.sin(reloj * 0.3 + (2 * u - 1) * 1.8) * rMax * 0.06;   // el eje se mece un poco
      const giroBase = reloj * 0.55;

      // --- Código ---
      ctx.imageSmoothingQuality = 'low';                                // el atlas ya tiene el tamaño justo: no hace falta el filtro caro
      const celdaBase = celdaBaseDe(W);                                 // en móvil el código va algo más grande para que se lea
      for (const c of codigo) {
        const u = (c.v0 + tiempo * c.vel) % 1;
        const bordes = suave(0, 0.12, u) * (1 - suave(0.88, 1, u));     // los extremos se deshacen
        if (bordes < 0.01) continue;
        const x = 2 * u - 1;
        const R = radioEn(u) * c.radio;
        const ang = c.brazo + GIRO_ESPIRAL * x + giroBase;
        const prof = Math.sin(ang);                                     // -1 detrás, 1 delante
        const delante = (prof + 1) / 2;
        const alfa = c.brillo * (0.12 + 0.88 * delante) * bordes * (c.interior ? 0.55 : 1);
        if (alfa < 0.02) continue;
        const px = cx + balanceo(u) + Math.cos(ang) * R;
        const py = lerp(yAbajo, yArriba, u) + prof * R * inclinacion;
        const lado = celdaBase * c.tam * (0.55 + 0.45 * (R / rMax)) * (0.8 + 0.35 * delante);
        const k = Math.floor(tiempo * c.ritmo);
        const g = ((c.semilla + k * 2654435761) >>> 0) % SIMBOLOS.length;   // el carácter cambia solo, como código en movimiento
        ctx.globalAlpha = alfa;
        ctx.drawImage(atlas, g * CELDA, 0, CELDA, CELDA, px - lado / 2, py - lado / 2, lado, lado);
      }
      ctx.globalAlpha = 1;

      // --- Datos por encima del código: cada cifra sube girando por el mismo huracán ---
      const items = particulas.map(p => {
        const u = (tiempo / p.periodo + p.fase) % 1;
        const R = radioEn(u);
        const ang = p.angulo0 + reloj * p.giro + GIRO_ESPIRAL * (2 * u - 1);
        const prof = Math.sin(ang);
        return {
          p, u, R, prof,
          x: cx + balanceo(u) + Math.cos(ang) * R,
          y: lerp(yAbajo, yArriba, u) + prof * R * inclinacion,
        };
      }).sort((a, b) => a.prof - b.prof);                      // primero las de atrás

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';

      for (const { p, u, R, prof, x, y } of items) {
        const delante = (prof + 1) / 2;
        // Aparece al nacer, desaparece al llegar arriba; las de atrás se ven menos
        const alfa = suave(0, 0.25, u) * (1 - suave(0.8, 1, u)) * (0.3 + 0.7 * delante);
        if (alfa < 0.01) continue;

        const tam = lerp(14, 54, p.peso) * escala * (0.5 + 0.5 * (R / rMax)) * (0.85 + 0.15 * delante);
        const tamNombre = Math.max(10, tam * 0.26);

        // Un borde negro separa las cifras del código que tienen detrás
        ctx.strokeStyle = `rgba(0,0,0,${(alfa * 0.9).toFixed(3)})`;
        ctx.fillStyle = `rgba(255,255,255,${alfa.toFixed(3)})`;

        ctx.font = `700 ${tam.toFixed(1)}px ${fuente}`;
        if (admiteTracking) ctx.letterSpacing = `${(-tam * 0.04).toFixed(2)}px`;
        ctx.lineWidth = tam * 0.18;
        ctx.strokeText(p.texto, x, y);
        ctx.fillText(p.texto, x, y);

        ctx.font = `700 ${tamNombre.toFixed(1)}px ${fuente}`;
        if (admiteTracking) ctx.letterSpacing = `${(-tamNombre * 0.025).toFixed(2)}px`;
        ctx.lineWidth = tamNombre * 0.28;
        ctx.strokeText(p.nombre, x, y + tam * 0.62);
        ctx.fillText(p.nombre, x, y + tam * 0.62);
      }
    }

    function bucle(ahora) {
      if (!corriendo) return;
      const dt = Math.min(0.05, (ahora - previo) / 1000);
      mediaCuadro = lerp(mediaCuadro, Math.min(ahora - previo, 100), 0.06);
      if (++cuadros % 45 === 0 && mediaCuadro > 30 && codigo.length > 1400) codigo.length = Math.floor(codigo.length * 0.8);
      previo = ahora;
      impulso *= Math.exp(-dt * 1.6);
      tiempo += dt * (1 + impulso * 0.6);
      reloj += dt * (1 + impulso * 2);
      dibujar();
      requestAnimationFrame(bucle);
    }

    // Solo se anima mientras la pantalla está a la vista
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !sinMovimiento) {
        if (!corriendo) {
          corriendo = true;
          previo = performance.now();
          requestAnimationFrame(bucle);
        }
      } else {
        corriendo = false;
      }
    }).observe(banda);

    // El scroll acelera el torbellino un momento
    let ultimoY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      impulso = Math.min(5, impulso + Math.abs(y - ultimoY) * 0.012);
      ultimoY = y;
    }, { passive: true });

    new ResizeObserver(ajustar).observe(banda);
    ajustar();
  }

  /* ---------- 3b. Pantalla de entrada ----------
     Como en aino.agency: una barra de «=» que se llena, una figura 3D hecha de números
     y letras (aquí, un reloj de arena) que gira con el ratón, y no se pasa a la web
     hasta hacer clic. Al hacer clic, la figura se deshace de arriba abajo y la portada
     se va formando detrás, en cascada. */

  const RAMPA_ESCENA = ' .-:/+=<>!?I73254689ON';   // de más claro a más denso
  const ONDA_MS = 1900;                            // lo que tarda el frente de la cascada en cruzar la pantalla
  const ONDA_BANDA = 14;                           // filas de caracteres sueltos que van delante del frente
  let cascada = null;                              // { t0, ms, filas, ch, banda } mientras dura la cascada

  // Cuándo (ms desde ahora) llega el frente de la cascada a la altura de un elemento
  function retardoCascada(el) {
    if (!cascada) return 0;
    const fila = Math.max(0, el.getBoundingClientRect().top) / cascada.ch;
    return Math.max(0, cascada.t0 + (fila / (cascada.filas + cascada.banda)) * cascada.ms - performance.now());
  }

  /* El reloj de arena de caracteres: acanalado y retorcido, dibujado en una rejilla con una escala
     de caracteres (de claro a denso según la luz). Lo usan la pantalla de entrada y el reloj que
     acompaña el scroll. NT, NTH y NC = cuántos puntos se calculan (más = más detalle).
     dibujar(rejilla, forma, giro, inclina, arena):
       rejilla = { cols, filas, cw, ch, celdas, prof [, arena] }
       arena   = 0..1 (opcional): cuánta arena ha caído. Sin arena, el reloj es macizo. */
  function crearRelojArena(NT, NTH, NC) {
    const costh = new Float32Array(NTH + 1), senth = new Float32Array(NTH + 1);
    for (let i = 0; i <= NTH; i++) { costh[i] = Math.cos(i / NTH * TAU); senth[i] = Math.sin(i / NTH * TAU); }
    const LUZ = (() => { const v = [-0.45, 0.6, -0.65]; const n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]); return v.map(x => x / n); })();
    const DIST = 3.4, ALTO = 1.15, R_TAPA = 0.72;
    const ARENA_MAX = 0.8;                          // hasta qué altura llega la arena en cada mitad
    const CHORRO = ':|!:.|';                        // la arena que cae por el cuello
    const nRampa = RAMPA_ESCENA.length;
    let rotA = 1, rotB = 0, rotC = 1, rotD = 0, formaAct = 1, giroAct = 0;

    // Radio según la altura (s = 0 en el cuello, 1 en las tapas): cuello fino, panza a media altura
    function radio(s) {
      if (s < 0.5) return 0.1 + 0.9 * Math.pow(Math.sin(s / 0.5 * Math.PI / 2), 1.2);
      const u = (s - 0.5) / 0.5;
      return 1 - (1 - R_TAPA) * u * u;
    }

    // Puntos de una fila de la superficie, con la rotación ya aplicada. parche 0 = cuerpo, 1 y 2 = tapas.
    // Cada punto sirve para dos filas (la suya y la anterior), así que se calcula una sola vez.
    const filaA = new Float32Array((NTH + 1) * 3), filaB = new Float32Array((NTH + 1) * 3);
    function calcularFila(out, parche, a) {
      let r0, y0, t = 0;
      if (parche === 0) {
        t = -1 + a * (2 / NT);
        r0 = radio(Math.abs(t)) * formaAct;
        y0 = t * ALTO;
      } else {
        r0 = (a / NC) * R_TAPA * formaAct;
        y0 = (parche === 1 ? 1 : -1) * ALTO;
      }
      const yC = y0 * rotC, yD = y0 * rotD;
      for (let i = 0, o = 0; i <= NTH; i++, o += 3) {
        const r = parche === 0 ? r0 * (1 + 0.16 * Math.cos(5 * (i / NTH * TAU + giroAct) + 3 * t)) : r0;
        const x0 = r * costh[i], z0 = r * senth[i];
        const z1 = -x0 * rotB + z0 * rotA;                                             // giro sobre su eje
        out[o] = x0 * rotA + z0 * rotB;
        out[o + 1] = yC - z1 * rotD;                                                     // inclinación
        out[o + 2] = yD + z1 * rotC;
      }
    }

    function dibujar(rejilla, forma, giro, inclina, arena) {
      const { cols, filas, cw, ch, celdas, prof } = rejilla;
      const mascara = rejilla.arena;
      celdas.fill(0); prof.fill(0);
      if (mascara) mascara.fill(0);
      rotA = Math.cos(giro * 0.35); rotB = Math.sin(giro * 0.35);
      rotC = Math.cos(inclina); rotD = Math.sin(inclina);
      formaAct = forma; giroAct = giro;
      const aspecto = ch / cw;
      // la figura cabe en alto y también en ancho (en vertical, en móvil)
      const escala = Math.min(filas * 0.33, cols * 0.4 / aspecto) * DIST;
      const cx = cols / 2, cy = filas / 2;
      const conArena = arena != null;
      const nivelArriba = conArena ? ARENA_MAX * (1 - arena) : 0;     // arriba: del cuello hacia arriba
      const nivelAbajo = conArena ? -1 + ARENA_MAX * arena : -1;      // abajo: desde la base hacia arriba
      for (let parche = 0; parche < 3; parche++) {
        const n = parche === 0 ? NT : NC;
        let fa = filaA, fb = filaB;
        calcularFila(fa, parche, 0);
        for (let a = 0; a < n; a++) {
          calcularFila(fb, parche, a + 1);
          // ¿Esta fila está llena de arena?
          let llena = false;
          if (conArena) {
            if (parche === 0) {
              const t = -1 + a * (2 / NT);
              llena = (t >= 0 && t <= nivelArriba) || (t < 0 && t <= nivelAbajo);
            } else if (parche === 2) {
              llena = arena > 0.02;
            }
          }
          for (let i = 0, o = 0; i < NTH; i++, o += 3) {
            const px = fa[o], py = fa[o + 1], pz = fa[o + 2];
            const z = pz + DIST;
            const col = Math.floor(cx + px * escala * aspecto / z);
            const fila = Math.floor(cy - py * escala / z);
            if (col < 0 || col >= cols || fila < 0 || fila >= filas) continue;
            const k = fila * cols + col;
            const inv = 1 / z;
            if (inv <= prof[k]) continue;
            // Normal = producto vectorial de las dos tangentes (hacia el punto de al lado y hacia la fila siguiente)
            const ux = fa[o + 3] - px, uy = fa[o + 4] - py, uz = fa[o + 5] - pz;
            const vx = fb[o] - px, vy = fb[o + 1] - py, vz = fb[o + 2] - pz;
            let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
            const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            nx /= nl; ny /= nl; nz /= nl;
            if (nz > 0) { nx = -nx; ny = -ny; nz = -nz; }                              // la cara que mira a la cámara
            const luz = Math.max(0, nx * LUZ[0] + ny * LUZ[1] + nz * LUZ[2]);
            let v = 0.22 * (-nz) + 0.78 * luz;                                          // los bordes salen más claros
            // Con arena: el cristal vacío se dibuja con caracteres finos y la arena con los densos
            if (conArena) v = llena ? 0.5 + 0.5 * v : v * 0.34;
            prof[k] = inv;
            celdas[k] = RAMPA_ESCENA.charCodeAt(1 + Math.min(nRampa - 2, Math.floor(v * (nRampa - 1))));
            if (mascara) mascara[k] = llena ? 1 : 0;
          }
          const tmp = fa; fa = fb; fb = tmp;
        }
      }

      // El chorro de arena que cae por el cuello, por delante del cristal vacío
      if (conArena && arena > 0.005 && arena < 0.995) {
        const pasos = Math.ceil(filas * 1.5);
        for (let j = 0; j <= pasos; j++) {
          const t = (j / pasos) * nivelAbajo;                           // de 0 (cuello) hasta la arena de abajo
          const y0 = t * ALTO;
          const py = y0 * rotC, z = y0 * rotD + DIST;
          const col = Math.floor(cx);
          const fila = Math.floor(cy - py * escala / z);
          if (fila < 0 || fila >= filas) continue;
          const k = fila * cols + col;
          if (mascara && mascara[k]) continue;
          celdas[k] = CHORRO.charCodeAt(Math.floor(Math.random() * CHORRO.length));
        }
      }
    }

    return { dibujar };
  }

  /* ---------- 3e. Reloj de arena que acompaña el scroll ----------
     El mismo reloj de arena de la entrada, en pequeño, arriba a la izquierda (en la cabecera,
     donde iría un logo). Gira al hacer scroll
     (más rápido cuanto más deprisa bajas; hacia atrás si subes) y la arena va cayendo a medida
     que avanzas: arriba del todo de la página está lleno y al llegar al final ya ha caído toda. */

  function iniciarRelojScroll() {
    const lienzo = $('.reloj-scroll');
    if (!lienzo) return;
    const ctx = lienzo.getContext('2d');
    const reloj = crearRelojArena(64, 120, 14);
    const raizHtml = document.documentElement;
    let rejilla = null, atlas = null, dpr = 1;

    function medir() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const pequeno = window.innerWidth <= 720;
      const tam = pequeno ? 3.6 : Math.max(4.5, Math.min(6.5, window.innerWidth * 0.0038));
      const cols = 22, filas = 15;
      ctx.font = `600 ${tam}px ${FUENTE_MOSAICO}`;
      const cw = ctx.measureText('M').width + tam * 0.045;
      const ch = tam * 1.25;
      const W = cols * cw, H = filas * ch;
      lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
      lienzo.style.width = W + 'px'; lienzo.style.height = H + 'px';
      rejilla = {
        cols, filas, cw, ch,
        celdas: new Uint16Array(cols * filas), prof: new Float32Array(cols * filas), arena: new Uint8Array(cols * filas),
      };
      const w = Math.max(1, Math.round(cw * dpr)), h = Math.max(1, Math.round(ch * dpr));
      atlas = crearAtlas(w, h, (c, x, y, cod) => {
        c.fillStyle = '#fff';
        c.font = `600 ${tam * dpr}px ${FUENTE_MOSAICO}`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String.fromCharCode(cod), x + w / 2, y + h / 2 + h * 0.04);
      });
    }

    function pintar(giro, inclina, arena) {
      reloj.dibujar(rejilla, 1, giro, inclina, arena);
      const { cols, filas, cw, ch, celdas } = rejilla;
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
          const cod = celdas[f * cols + c];
          if (!cod || cod === 32) continue;
          const [sx, sy] = atlas.hueco(cod, cod);
          ctx.drawImage(atlas.lienzo, sx, sy, atlas.w, atlas.h, Math.round(c * cw * dpr), Math.round(f * ch * dpr), atlas.w, atlas.h);
        }
      }
    }

    // Parte de la página recorrida: 0 arriba, 1 al final
    const recorrido = () => {
      const max = raizHtml.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    medir();
    let tamanoPrevio = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth === tamanoPrevio) return;
      tamanoPrevio = window.innerWidth;
      medir();
      if (sinMovimiento) pintar(0.6, 0.45, recorrido());
    });

    if (sinMovimiento) {
      // Sin movimiento: el reloj no gira; solo cambia la arena cuando haces scroll
      let pendiente = false;
      const repintar = () => { pendiente = false; pintar(0.6, 0.45, recorrido()); };
      window.addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(repintar); } }, { passive: true });
      repintar();
      lienzo.classList.add('visible');
      return;
    }

    let giro = 0, giroVel = 0.25, inclina = 0.4, arena = recorrido();
    let previo = performance.now(), yPrevio = window.scrollY, velocidad = 0;
    function cuadro(ahora) {
      const dt = Math.min(0.05, Math.max(0.001, (ahora - previo) / 1000));
      previo = ahora;
      const y = window.scrollY;
      // Velocidad del scroll (px/s), suavizada
      velocidad = lerp(velocidad, (y - yPrevio) / dt, 1 - Math.exp(-dt * 10));
      yPrevio = y;
      const v = Math.max(-1, Math.min(1, velocidad / 2500));
      // Quieto gira muy despacio; con el scroll se acelera, y al subir gira al revés
      giroVel = lerp(giroVel, 0.25 + v * 7, 1 - Math.exp(-dt * 4));
      giro += giroVel * dt;
      // Al bajar deprisa se inclina un poco, como si lo arrastraras
      inclina = lerp(inclina, 0.4 + v * 0.3, 1 - Math.exp(-dt * 5));
      // La arena sigue a la parte recorrida, con un poco de retraso: cae
      arena = lerp(arena, recorrido(), 1 - Math.exp(-dt * 3));
      pintar(giro, inclina, arena);
      requestAnimationFrame(cuadro);
    }
    requestAnimationFrame(cuadro);
    lienzo.classList.add('visible');
  }

  function iniciarEntrada() {
    const raiz = $('#entrada');
    if (!raiz) return null;
    if (location.hash) { raiz.remove(); return null; }     // un enlace directo a una sección va sin pantalla de entrada

    const lienzo = $('.entrada__lienzo', raiz);
    const boton = $('.entrada__boton', raiz);
    const ctx = lienzo.getContext('2d');
    const raizHtml = document.documentElement;
    raiz.dataset.activa = '';
    raizHtml.classList.add('cargando');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    let resolver;
    const clic = new Promise(ok => { resolver = ok; });

    // --- Rejilla de caracteres ---
    let cols = 0, filas = 0, cw = 8, ch = 16, dpr = 1, tam = 12;
    let celdas, prof, brillo;                          // código de carácter de cada casilla, profundidad y opacidad (0-255)
    let rejilla = null;
    let atlas = null;                                  // todos los caracteres en una sola imagen

    function medir() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = window.innerWidth, H = window.innerHeight;
      tam = Math.max(10, Math.min(15, W / 120));
      ctx.font = `500 ${tam}px ${FUENTE_MOSAICO}`;
      cw = ctx.measureText('M').width + tam * 0.045;
      ch = tam * 1.32;
      cols = Math.floor(W / cw);
      filas = Math.floor(H / ch);
      lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
      celdas = new Uint16Array(cols * filas);
      prof = new Float32Array(cols * filas);
      brillo = new Uint8Array(cols * filas).fill(255);
      rejilla = { cols, filas, cw, ch, celdas, prof };
      const w = Math.max(1, Math.round(cw * dpr)), h = Math.max(1, Math.round(ch * dpr));
      atlas = crearAtlas(w, h, (c, x, y, cod) => {
        c.fillStyle = '#fff';
        c.font = `500 ${tam * dpr}px ${FUENTE_MOSAICO}`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String.fromCharCode(cod), x + w / 2, y + h / 2 + h * 0.04);
      });
    }

    // Copia un carácter del atlas a su casilla
    function pintarCaracter(cod, c, f) {
      const [sx, sy] = atlas.hueco(cod, cod);
      ctx.drawImage(atlas.lienzo, sx, sy, atlas.w, atlas.h, Math.round(c * cw * dpr), Math.round(f * ch * dpr), atlas.w, atlas.h);
    }

    // --- La figura: el reloj de arena (ver crearRelojArena) ---
    const reloj = crearRelojArena(170, 320, 36);
    function figura(forma, giro, inclina) {
      brillo.fill(255);
      reloj.dibujar(rejilla, forma, giro, inclina);
    }

    // --- Textos sobre la rejilla ---
    function escribir(texto, fila, col, t, retraso = 0) {
      for (let i = 0; i < texto.length; i++) {
        const c = col + i;
        if (fila < 0 || fila >= filas || c < 0 || c >= cols) continue;
        const letra = texto[i];
        if (letra === ' ') { celdas[fila * cols + c] = 0; continue; }
        brillo[fila * cols + c] = 255;
        // las letras aparecen entre ruido y se asientan una tras otra
        const edad = (t - retraso - i * 28) / 380;
        const cod = edad >= 1 ? letra.charCodeAt(0)
          : edad > 0 ? RAMPA.charCodeAt(Math.floor(Math.random() * 40)) : 0;
        celdas[fila * cols + c] = cod;
      }
    }

    // --- Estado ---
    let fase = 'cargando';                  // cargando → lista → saliendo
    const t0 = performance.now();
    let listo = false;
    let tClic = 0;
    let giro = 0, inclina = 0.3, giroVel = 0.5;
    const raton = { x: 0.5, y: 0.5, cx: -99, cy: -99 };
    const DUR_CARGA = 2300;
    const cargada = document.readyState === 'complete'
      ? Promise.resolve() : new Promise(ok => window.addEventListener('load', ok, { once: true }));
    let paginaCargada = false;
    cargada.then(() => { paginaCargada = true; });
    const fuentes = (document.fonts && document.fonts.ready) || Promise.resolve();
    let fuentesListas = false;
    fuentes.then(() => { fuentesListas = true; });

    window.addEventListener('pointermove', e => {
      raton.x = e.clientX / window.innerWidth; raton.y = e.clientY / window.innerHeight;
      raton.cx = e.clientX / cw; raton.cy = e.clientY / ch;
    }, { passive: true });

    const formato2 = n => String(n).padStart(2, '0');
    const suaveSalida = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

    let ultimo = t0;
    function cuadro(ahora) {
      const dt = Math.min(0.05, (ahora - ultimo) / 1000);
      ultimo = ahora;
      const t = ahora - t0;

      // El ratón manda: a la derecha gira más rápido, arriba y abajo inclina
      giroVel = lerp(giroVel, 0.35 + (raton.x - 0.5) * 2.8, 1 - Math.pow(1 - 0.04, dt * 60));
      giro += giroVel * dt;
      inclina = lerp(inclina, 0.05 + raton.y * 0.6, 1 - Math.pow(1 - 0.05, dt * 60));

      // La figura empieza como una línea de caracteres y se abre
      const forma = 0.02 + 0.98 * suaveSalida((t - 1000) / 1700);
      figura(forma, giro, inclina);

      // Caracteres que se alborotan cerca del puntero
      const R = 7;
      for (let f = Math.max(0, Math.floor(raton.cy - R)); f <= Math.min(filas - 1, Math.ceil(raton.cy + R)); f++) {
        for (let c = Math.max(0, Math.floor(raton.cx - R * 1.8)); c <= Math.min(cols - 1, Math.ceil(raton.cx + R * 1.8)); c++) {
          const k = f * cols + c;
          if (!celdas[k]) continue;
          const dx = (c - raton.cx) / 1.8, dy = f - raton.cy;
          if (dx * dx + dy * dy < R * R && Math.random() < 0.4) {
            celdas[k] = RAMPA.charCodeAt(Math.floor(Math.random() * RAMPA.length));
          }
        }
      }

      // Barra de carga, textos y aviso
      const progreso = Math.min(1, t / DUR_CARGA);
      const barra = Math.round(suaveSalida(progreso) * Math.min(40, cols * 0.3));
      for (let i = 0; i < barra; i++) { celdas[i] = 61; brillo[i] = 255; }           // «=»
      escribir('LES HORES EN EL DISSENY', 1, 0, t, 200);
      const hora = new Date();
      const reloj = `${formato2(hora.getHours())}:${formato2(hora.getMinutes())}:${formato2(hora.getSeconds())}`;
      if (cols > 90) escribir('BCN ' + reloj, 1, cols - 12, t, 400);

      if (!listo && progreso >= 1 && t > 2700 && paginaCargada && fuentesListas) {
        listo = true; fase = 'lista';
        boton.disabled = false;
        boton.focus({ preventScroll: true });
      }
      if (fase === 'cargando') {
        escribir(`CARREGANT ${formato2(Math.round(progreso * 100))}%`, filas - 2, Math.floor((cols - 14) / 2), t, 300);
      } else if (fase === 'lista') {
        const parpadeo = Math.floor(ahora / 520) % 2 === 0;
        escribir('CLICA PER ENTRAR' + (parpadeo ? '_' : ' '), filas - 2, Math.floor((cols - 17) / 2), t, 0);
      }

      // --- Dibujo ---
      let yFrente = 0;                                    // por encima de esta fila ya se ve la web
      let frente = -1;
      if (fase === 'saliendo') {
        frente = (ahora - tClic) / ONDA_MS * (filas + ONDA_BANDA);
        yFrente = Math.max(0, Math.min(filas, frente - ONDA_BANDA));
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, Math.round(yFrente * ch * dpr), lienzo.width, lienzo.height);   // el negro tapa lo que aún no ha llegado
      let alfaActual = 255;
      for (let f = 0; f < filas; f++) {
        const d = frente - f;                              // cuánto ha pasado el frente por esta fila
        if (fase === 'saliendo' && d >= ONDA_BANDA) continue;
        for (let c = 0; c < cols; c++) {
          let cod = celdas[f * cols + c];
          if (fase === 'saliendo' && d > 0) {              // dentro de la franja: se deshace en caracteres sueltos
            const vivo = 1 - d / ONDA_BANDA;
            if (Math.random() > vivo) continue;
            if (Math.random() < 0.6 || !cod) cod = RAMPA.charCodeAt(Math.floor(Math.random() * RAMPA.length));
          }
          if (!cod || cod === 32) continue;
          const br = brillo[f * cols + c];
          if (br !== alfaActual) { ctx.globalAlpha = br / 255; alfaActual = br; }
          pintarCaracter(cod, c, f);
        }
      }
      ctx.globalAlpha = 1;

      if (fase === 'saliendo' && frente - filas >= ONDA_BANDA) { terminar(); return; }
      requestAnimationFrame(cuadro);
    }

    function terminar() {
      raiz.remove();
      raizHtml.classList.remove('cargando');
      cascada = null;
    }

    function entrar() {
      if (fase !== 'lista') return;
      fase = 'saliendo';
      tClic = performance.now();
      boton.disabled = true;
      cascada = { t0: tClic, ms: ONDA_MS, filas, ch, banda: ONDA_BANDA };
      resolver();
    }
    boton.addEventListener('click', entrar);

    medir();
    window.addEventListener('resize', () => { if (raiz.isConnected) medir(); });

    if (sinMovimiento) {
      // Sin movimiento: figura quieta y un solo clic; la web aparece de golpe
      fase = 'lista'; listo = true;
      figura(1, 0.6, 0.55);
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, lienzo.width, lienzo.height);
      for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) {
        const cod = celdas[f * cols + c];
        if (cod && cod !== 32) {
          ctx.globalAlpha = brillo[f * cols + c] / 255;
          pintarCaracter(cod, c, f);
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = `500 ${tam * dpr}px ${FUENTE_MOSAICO}`;
      ctx.textAlign = 'center';
      ctx.fillText('CLICA PER ENTRAR', lienzo.width / 2, (filas - 1.5) * ch * dpr);
      boton.disabled = false;
      boton.addEventListener('click', () => { raiz.classList.add('fuera'); setTimeout(terminar, 450); resolver(); }, { once: true });
      return clic;
    }

    requestAnimationFrame(cuadro);
    return clic;
  }

  /* ---------- 3c. Hora en directo del pie (como el reloj de aino.agency) ---------- */

  function iniciarReloj() {
    const marcas = $$('[data-reloj]');
    if (!marcas.length) return;
    const dia = new Intl.DateTimeFormat('ca', { weekday: 'long' });
    const pon = n => String(n).padStart(2, '0');
    const pinta = () => {
      const d = new Date();
      const nombre = dia.format(d);
      const texto = `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${pon(d.getHours())}:${pon(d.getMinutes())}:${pon(d.getSeconds())}`;
      marcas.forEach(m => { m.textContent = texto; });
    };
    pinta();
    setInterval(pinta, 1000);
  }

  /* ---------- 3d. Scroll suave ----------
     Con ratón o trackpad la rueda ya no da saltos: la página se desliza hasta su sitio con inercia.
     Los enlaces internos (#…) llevan a su sección con un movimiento suave en lugar de un salto.
     En pantallas táctiles el scroll sigue siendo el del sistema, que ya es suave.
     El teclado y la barra de scroll funcionan como siempre. */

  const SUAVIDAD = 7;                                       // más alto = llega antes (por segundo)
  const curvaEnlace = t => (t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);   // easeInOutQuart

  function iniciarScrollSuave() {
    if (sinMovimiento) return;
    const raizHtml = document.documentElement;
    const limitar = y => Math.max(0, Math.min(raizHtml.scrollHeight - window.innerHeight, y));
    let actual = window.scrollY, objetivo = actual, escrito = actual;
    let animando = false, previo = 0;
    let viaje = null;                                       // { desde, hasta, inicio, dur } al seguir un enlace

    const parar = () => { animando = false; viaje = null; };

    function paso(ahora) {
      if (!animando) return;
      const dt = Math.min(0.05, Math.max(0, (ahora - previo) / 1000));
      previo = ahora;
      // Si algo más ha movido la página (teclado, barra de scroll, el dedo), se le deja hacer
      if (Math.abs(window.scrollY - escrito) > 3) { parar(); return; }
      if (viaje) {
        const t = Math.min(1, (ahora - viaje.inicio) / viaje.dur);
        actual = lerp(viaje.desde, viaje.hasta, curvaEnlace(t));
        if (t >= 1) { viaje = null; objetivo = actual; }
      } else {
        actual += (objetivo - actual) * (1 - Math.exp(-dt * SUAVIDAD));
        if (Math.abs(objetivo - actual) < 0.4) actual = objetivo;
      }
      window.scrollTo(0, actual);
      escrito = window.scrollY;
      if (!viaje && actual === objetivo) { animando = false; return; }
      requestAnimationFrame(paso);
    }

    function arrancar() {
      if (animando) return;
      animando = true;
      previo = performance.now();
      requestAnimationFrame(paso);
    }

    // Rueda del ratón y trackpad
    window.addEventListener('wheel', e => {
      if (e.ctrlKey || e.defaultPrevented || raizHtml.classList.contains('cargando')) return;   // zoom o pantalla de entrada
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;                                     // gesto horizontal
      e.preventDefault();
      const factor = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;     // líneas o páginas → px
      if (!animando) { actual = objetivo = escrito = window.scrollY; }
      if (viaje) { viaje = null; objetivo = actual; }                                          // la rueda manda sobre un enlace en curso
      objetivo = limitar(objetivo + e.deltaY * factor);
      arrancar();
    }, { passive: false });

    // Enlaces internos: viaje suave hasta la sección
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const destino = id && document.getElementById(id);
      if (!destino) return;
      e.preventDefault();
      const desde = window.scrollY;
      const hasta = limitar(destino.getBoundingClientRect().top + desde);
      const distancia = Math.abs(hasta - desde);
      if (distancia < 1) return;
      actual = escrito = desde;
      objetivo = hasta;
      viaje = { desde, hasta, inicio: performance.now(), dur: Math.min(1900, 650 + distancia * 0.14) };
      arrancar();
      history.pushState(null, '', '#' + id);
    });
  }

  /* ---------- 3f. Título de la portada de lado a lado ----------
     El tamaño se calcula para que la línea más larga ocupe todo el ancho, con el mismo margen a la
     izquierda y a la derecha. Se mide la tinta real de las letras (cursiva y tracking incluidos),
     así funciona con Helvetica, con Arial o con la tipografía que tenga cada ordenador. */

  function ajustarTitulo() {
    const h1 = $('.portada h1');
    if (!h1) return;
    const lineas = $$('.linea', h1);
    if (!lineas.length) return;
    h1.style.fontSize = '';
    const cs = getComputedStyle(h1);
    const fs = parseFloat(cs.fontSize);
    const tracking = parseFloat(cs.letterSpacing) || 0;
    const medidor = document.createElement('canvas').getContext('2d');
    medidor.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
    if ('fontKerning' in medidor) medidor.fontKerning = 'none';          // las letras van sueltas, sin kerning
    // Hasta dónde llega la tinta de cada línea, contando desde el inicio del texto
    const tinta = Math.max(...lineas.map(l => {
      const texto = l.textContent.replace(/\s+/g, ' ').trim();
      const m = medidor.measureText(texto);
      return m.actualBoundingBoxRight + (texto.length - 1) * tracking;
    }));
    const izquierda = h1.getBoundingClientRect().left;
    const objetivo = document.documentElement.clientWidth - 2 * izquierda;
    if (!(tinta > 0) || objetivo <= 0) return;
    // En vw, para que siga llenando el ancho si cambia la ventana antes de volver a medir
    h1.style.fontSize = (fs * objetivo / tinta / window.innerWidth * 100).toFixed(3) + 'vw';
  }

  /* ---------- 4. Arranque ---------- */

  function iniciar() {
    // El título de la portada se ajusta al ancho antes de partirlo en letras
    ajustarTitulo();
    window.addEventListener('resize', ajustarTitulo);

    // Total de horas y nota de días: se calculan con los datos
    const cifraTotal = $('[data-total]');
    if (cifraTotal) cifraTotal.textContent = formato(totalHoras);

    const nota = $('[data-nota-dias]');
    if (nota) {
      const dias = Math.round(totalHoras / 24);
      const cuantos = NUMEROS[programas.length] || programas.length;
      nota.textContent = `hores en ${cuantos} programes de disseny. Són ${dias} dies seguits, de dia i de nit.`;
    }

    // Barra de cada programa: su largo es la parte de horas respecto al que más tiene
    for (const p of programas) {
      p.el.style.setProperty('--parte', (p.horas / maxHoras).toFixed(4));
    }

    // Textos decodificados
    const textos = $$('[data-decode]');
    const detalles = $$('.programa__interior dt, .programa__interior dd');
    if (sinMovimiento) {
      textos.forEach(el => el.classList.add('dividido'));
    } else {
      textos.forEach(preparar);
      detalles.forEach(preparar);
      // El efecto al pasar el ratón vale para cualquier texto de la página
      [...textos, ...detalles].forEach(activarGlitch);
      if (document.fonts && document.fonts.addEventListener) {
        document.fonts.addEventListener('loadingdone', remedirTodo);
      }
    }

    // Los textos solo se animan cuando ya se ha entrado en la web (si hay pantalla de entrada)
    const empezar = () => {
      textos.filter(el => !el.hasAttribute('data-manual')).forEach(el => observador.observe(el));
      $$('[data-reveal]').forEach(el => observador.observe(el));
      iniciarRelojScroll();
    };
    iniciarReloj();
    iniciarScrollSuave();
    const entrada = iniciarEntrada();
    if (entrada) entrada.then(empezar); else empezar();

    /* Filas desplegables */
    $$('.programa__cabecera').forEach(cabecera => {
      cabecera.addEventListener('click', () => {
        const fila = cabecera.closest('.programa');
        const abrir = !fila.classList.contains('abierto');
        // Solo una fila abierta a la vez
        $$('.programa.abierto').forEach(otra => {
          otra.classList.remove('abierto');
          $('.programa__cabecera', otra).setAttribute('aria-expanded', 'false');
        });
        fila.classList.toggle('abierto', abrir);
        cabecera.setAttribute('aria-expanded', String(abrir));
        // El detalle se decodifica al abrirse, un dato detrás de otro
        if (abrir && !sinMovimiento) {
          decodificarVarios($$('dt, dd', fila), (el, i) => i * 90);
        }
      });
    });

    /* Referentes: la captura y el texto entran por los lados al llegar a la pantalla */
    const referentes = $$('.ref');
    if (sinMovimiento) {
      referentes.forEach(r => r.classList.add('activa'));
    } else {
      const observadorRef = new IntersectionObserver(entradas => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('activa');
          observadorRef.unobserve(e.target);
        }
      }, { threshold: 0.35 });
      referentes.forEach(r => observadorRef.observe(r));
    }

    iniciarTorbellino();
  }

  // Esperamos a la tipografía (máximo 2,5 s) para medir bien las letras
  const tipografia = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([tipografia, new Promise(ok => setTimeout(ok, 2500))]).then(iniciar);
})();
