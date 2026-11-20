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

  const NUMEROS = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

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
      s.textContent = VACIO;
      s._listo = false;
    }
    el.classList.add('dividido');
  }

  // Mide cada letra y fija su ancho (en em, para que siga siendo fluido).
  // Así la línea no se mueve cuando la letra pasa por símbolos más anchos o más estrechos.
  function fijarAnchos(letras) {
    const previos = letras.map(s => s.textContent);
    letras.forEach(s => { s.style.width = ''; s.textContent = s.dataset.c; });
    const anchos = letras.map(s => s.getBoundingClientRect().width);
    const tamanos = letras.map(s => parseFloat(getComputedStyle(s.parentNode.parentNode).fontSize));
    letras.forEach((s, i) => {
      s.style.width = (anchos[i] / tamanos[i]) + 'em';
      s.textContent = previos[i];
    });
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
    fijarAnchos($$('.let'));
    mosaicos.forEach(m => { if (m.medido) medirMosaico(m); });
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
      sprites: new Map(), mascara: null, medido: false, celdaW: 1, celdaH: 1, dpr: 1,
    };
    el._mosaico = m;
    mosaicos.push(m);
    return m;
  }

  // Dibuja las letras en canvas ocultos (la máscara y el raster para medir) y reparte un carácter por casilla
  function medirMosaico(m) {
    const { el, letras } = m;
    const caja = el.getBoundingClientRect();
    m.medido = false;
    if (!caja.width || !caja.height) return;

    const host = anfitrionDe(el);
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    if (lienzoNoEn(m, host)) host.append(m.lienzo);
    m.anfitrion = host;
    const cajaHost = host.getBoundingClientRect();

    // Con la letra real puesta se mide dónde cae cada una; después se deja como estaba
    const previos = letras.map(l => l.span.textContent);
    letras.forEach(l => { l.span.textContent = l.c; });
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
    letras.forEach((l, i) => { l.span.textContent = previos[i]; });

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

    letras.forEach((l, i) => { l.celdas = []; l.color = medidas[i].color; });
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
        letras[i].celdas.push({ c, f, car: nivel[1], r1: Math.random(), r2: Math.random() });
      }
    }

    // Canvas visible: mismo sitio que el texto, con el margen extra
    m.dpr = dpr; m.celdaW = celdaW; m.celdaH = celdaH; m.mascara = mascara; m.sprites.clear();
    const lz = m.lienzo;
    lz.width = mascara.width; lz.height = mascara.height;
    lz.style.width = W + 'px'; lz.style.height = H + 'px';
    lz.style.left = (caja.left - cajaHost.left - host.clientLeft - ext) + 'px';
    lz.style.top = (caja.top - cajaHost.top - host.clientTop - ext) + 'px';
    m.medido = true;
  }

  function lienzoNoEn(m, host) { return m.lienzo.parentNode !== host; }

  // Cuando termina la animación se libera la memoria del canvas
  function liberarMosaico(m) {
    if (!m.medido) return;
    m.lienzo.width = 0; m.lienzo.height = 0;
    m.mascara = null; m.sprites.clear(); m.medido = false;
    m.letras.forEach(l => { l.celdas = []; });
  }

  // Un carácter ya dibujado en una casilla (se reutiliza en cada fotograma)
  function spriteMosaico(m, car, color) {
    const clave = color + car;
    let sp = m.sprites.get(clave);
    if (!sp) {
      const w = Math.max(1, Math.round(m.celdaW * m.dpr));
      const h = Math.max(1, Math.round(m.celdaH * m.dpr));
      sp = document.createElement('canvas');
      sp.width = w; sp.height = h;
      const c = sp.getContext('2d');
      c.fillStyle = color;
      c.font = `600 ${h * 0.92}px ${FUENTE_MOSAICO}`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(car, w / 2, h / 2 + h * 0.04);
      m.sprites.set(clave, sp);
    }
    return sp;
  }

  // Dibuja un fotograma. Devuelve true mientras alguna letra siga animándose.
  function dibujarMosaico(m, ahora) {
    if (!m.medido) return false;
    const { ctx, lienzo, dpr, celdaW, celdaH } = m;
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
        if (s.textContent !== l.c) s.textContent = l.c;
        s._listo = true; s._glitch = false; l.anim = null;
        continue;
      }
      // La letra real se esconde mientras se forma el mosaico y vuelve cuando toca
      const real = p >= f.letra;
      const visible = real || p < f.oculta;
      const quiere = visible ? l.c : VACIO;
      if (s.textContent !== quiere) s.textContent = quiere;

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
        ctx.drawImage(spriteMosaico(m, car, l.color), Math.round(k.c * celdaW * dpr), Math.round(k.f * celdaH * dpr));
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
        l.span.textContent = l.c; l.span._listo = true; return;
      }
      l.span.textContent = VACIO;
      l.span._listo = false;
      l.anim = { modo: 'aparicion', inicio: inicio + i * velocidad, dur: duracion };
    });
    if (m.medido) arrancarMosaicos();
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
    esperaTamano = setTimeout(() => mosaicos.forEach(m => { if (m.medido) medirMosaico(m); }), 200);
  });

  // Cada elemento se anima una sola vez, cuando entra en pantalla (como en aino.agency)
  const observador = new IntersectionObserver(entradas => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      observador.unobserve(el);
      el.classList.add('in');
      if (!sinMovimiento && el.hasAttribute('data-decode')) decodificar(el, retardoCascada(el));
    }
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

    let particulas = [];
    let totalActual = 0;
    let W = 0, H = 0;
    let tiempo = 3, reloj = 0, impulso = 0;
    let corriendo = false, previo = 0;

    function ajustar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = banda.clientWidth;
      H = banda.clientHeight;
      const total = W > 900 ? 24 : 15;
      if (total !== totalActual) {
        totalActual = total;
        particulas = crearParticulas(total);
      }
      lienzo.width = Math.round(W * dpr);
      lienzo.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dibujar();
    }

    function dibujar() {
      ctx.clearRect(0, 0, W, H);
      const ancha = W > 900;
      const cx = W * (ancha ? 0.68 : 0.5);
      const yAbajo = H * 0.9, yArriba = H * 0.1;
      const rMax = Math.min(W * (ancha ? 0.29 : 0.46), H * 0.5);
      const rMin = rMax * 0.16;
      const inclinacion = 0.24;
      const escala = Math.max(0.55, Math.min(1, W / 900));     // cifras más pequeñas en móvil

      // Anillos tenues que dibujan el embudo
      ctx.strokeStyle = 'rgba(255,255,255,.09)';
      ctx.lineWidth = 1;
      for (let k = 0; k <= 9; k++) {
        const v = k / 9;
        const r = lerp(rMin, rMax, Math.pow(v, 1.3));
        ctx.beginPath();
        ctx.ellipse(cx, lerp(yAbajo, yArriba, v), r, r * inclinacion, 0, 0, TAU);
        ctx.stroke();
      }

      // Posición de cada cifra: sube girando y se ensancha
      const items = particulas.map(p => {
        const u = (tiempo / p.periodo + p.fase) % 1;           // 0 abajo, 1 arriba
        const r = lerp(rMin, rMax, Math.pow(u, 1.3));
        const ang = p.angulo0 + reloj * p.giro;
        const prof = Math.sin(ang);                            // -1 detrás, 1 delante
        return {
          p, u, r, prof,
          x: cx + Math.cos(ang) * r,
          y: lerp(yAbajo, yArriba, u) + prof * r * inclinacion,
        };
      }).sort((a, b) => a.prof - b.prof);                      // primero las de atrás

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (const { p, u, r, prof, x, y } of items) {
        const delante = (prof + 1) / 2;
        // Aparece al nacer, desaparece al llegar arriba; las de atrás se ven menos
        const alfa = suave(0, 0.3, u) * (1 - suave(0.78, 1, u)) * (0.25 + 0.75 * delante);
        if (alfa < 0.01) continue;

        const tam = lerp(14, 58, p.peso) * escala * (0.4 + 0.6 * (r / rMax)) * (0.85 + 0.15 * delante);
        ctx.fillStyle = `rgba(255,255,255,${alfa.toFixed(3)})`;

        ctx.font = `700 ${tam.toFixed(1)}px ${fuente}`;
        if (admiteTracking) ctx.letterSpacing = `${(-tam * 0.04).toFixed(2)}px`;
        ctx.fillText(p.texto, x, y);

        const tamNombre = Math.max(10, tam * 0.26);
        ctx.font = `700 ${tamNombre.toFixed(1)}px ${fuente}`;
        if (admiteTracking) ctx.letterSpacing = `${(-tamNombre * 0.025).toFixed(2)}px`;
        ctx.fillText(p.nombre, x, y + tam * 0.62);
      }
    }

    function bucle(ahora) {
      if (!corriendo) return;
      const dt = Math.min(0.05, (ahora - previo) / 1000);
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
    let celdas, prof;                                  // código de carácter de cada casilla y profundidad
    const sprites = new Map();

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
      sprites.clear();
    }

    function sprite(cod) {
      let sp = sprites.get(cod);
      if (!sp) {
        const w = Math.max(1, Math.round(cw * dpr)), h = Math.max(1, Math.round(ch * dpr));
        sp = document.createElement('canvas');
        sp.width = w; sp.height = h;
        const c = sp.getContext('2d');
        c.fillStyle = '#fff';
        c.font = `500 ${tam * dpr}px ${FUENTE_MOSAICO}`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String.fromCharCode(cod), w / 2, h / 2 + h * 0.04);
        sprites.set(cod, sp);
      }
      return sp;
    }

    // --- La figura: un reloj de arena acanalado y retorcido, dibujado con una escala de caracteres ---
    // Dos parches de superficie: el cuerpo (de arriba abajo) y las dos tapas planas.
    const NT = 170, NTH = 320, NC = 36;
    const costh = new Float32Array(NTH + 1), senth = new Float32Array(NTH + 1);
    for (let i = 0; i <= NTH; i++) { costh[i] = Math.cos(i / NTH * TAU); senth[i] = Math.sin(i / NTH * TAU); }
    const LUZ = (() => { const v = [-0.45, 0.6, -0.65]; const n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]); return v.map(x => x / n); })();
    const pt = new Float32Array(9);
    const DIST = 3.4, ALTO = 1.15, R_TAPA = 0.72;
    let rotA = 1, rotB = 0, rotC = 1, rotD = 0, formaAct = 1, giroAct = 0;

    // Radio según la altura (s = 0 en el cuello, 1 en las tapas): cuello fino, panza a media altura
    function radio(s) {
      if (s < 0.5) return 0.1 + 0.9 * Math.pow(Math.sin(s / 0.5 * Math.PI / 2), 1.2);
      const u = (s - 0.5) / 0.5;
      return 1 - (1 - R_TAPA) * u * u;
    }

    // Punto de la superficie con la rotación ya aplicada. parche 0 = cuerpo, 1 y 2 = tapas
    function punto(out, o, parche, i, a) {
      const c = costh[i], sn = senth[i];
      let x0, y0, z0;
      if (parche === 0) {
        const t = -1 + a * (2 / NT);
        const r = radio(Math.abs(t)) * formaAct * (1 + 0.16 * Math.cos(5 * (i / NTH * TAU + giroAct) + 3 * t));
        x0 = r * c; z0 = r * sn; y0 = t * ALTO;
      } else {
        const r = (a / NC) * R_TAPA * formaAct;
        x0 = r * c; z0 = r * sn; y0 = (parche === 1 ? 1 : -1) * ALTO;
      }
      const x1 = x0 * rotA + z0 * rotB, z1 = -x0 * rotB + z0 * rotA;                 // giro sobre su eje
      out[o] = x1;
      out[o + 1] = y0 * rotC - z1 * rotD;                                              // inclinación
      out[o + 2] = y0 * rotD + z1 * rotC;
    }

    function figura(forma, giro, inclina) {
      celdas.fill(0); prof.fill(0);
      rotA = Math.cos(giro * 0.35); rotB = Math.sin(giro * 0.35);
      rotC = Math.cos(inclina); rotD = Math.sin(inclina);
      formaAct = forma; giroAct = giro;
      const aspecto = ch / cw;
      // la figura cabe en alto y también en ancho (en vertical, en móvil)
      const escala = Math.min(filas * 0.33, cols * 0.4 / aspecto) * DIST;
      const cx = cols / 2, cy = filas / 2;
      for (let parche = 0; parche < 3; parche++) {
        const n = parche === 0 ? NT : NC;
        for (let a = 0; a < n; a++) {
          for (let i = 0; i < NTH; i++) {
            punto(pt, 0, parche, i, a);
            punto(pt, 3, parche, i + 1, a);
            punto(pt, 6, parche, i, a + 1);
            const z = pt[2] + DIST;
            const col = Math.floor(cx + pt[0] * escala * aspecto / z);
            const fila = Math.floor(cy - pt[1] * escala / z);
            if (col < 0 || col >= cols || fila < 0 || fila >= filas) continue;
            const k = fila * cols + col;
            const inv = 1 / z;
            if (inv <= prof[k]) continue;
            // Normal = producto vectorial de las dos tangentes
            const ux = pt[3] - pt[0], uy = pt[4] - pt[1], uz = pt[5] - pt[2];
            const vx = pt[6] - pt[0], vy = pt[7] - pt[1], vz = pt[8] - pt[2];
            let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
            const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            nx /= nl; ny /= nl; nz /= nl;
            if (nz > 0) { nx = -nx; ny = -ny; nz = -nz; }                              // la cara que mira a la cámara
            const luz = Math.max(0, nx * LUZ[0] + ny * LUZ[1] + nz * LUZ[2]);
            const v = 0.22 * (-nz) + 0.78 * luz;                                        // los bordes salen más claros
            prof[k] = inv;
            celdas[k] = RAMPA_ESCENA.charCodeAt(1 + Math.min(RAMPA_ESCENA.length - 2, Math.floor(v * (RAMPA_ESCENA.length - 1))));
          }
        }
      }
    }

    // --- Textos sobre la rejilla ---
    function escribir(texto, fila, col, t, retraso = 0) {
      for (let i = 0; i < texto.length; i++) {
        const c = col + i;
        if (fila < 0 || fila >= filas || c < 0 || c >= cols) continue;
        const letra = texto[i];
        if (letra === ' ') { celdas[fila * cols + c] = 0; continue; }
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
      giroVel = lerp(giroVel, 0.35 + (raton.x - 0.5) * 2.8, 0.04);
      giro += giroVel * dt;
      inclina = lerp(inclina, 0.05 + raton.y * 0.6, 0.05);

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
      for (let i = 0; i < barra; i++) celdas[i] = 61;                                // «=»
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
      ctx.fillStyle = '#000';
      ctx.fillRect(0, Math.round(yFrente * ch * dpr), lienzo.width, lienzo.height);   // el negro tapa lo que aún no ha llegado
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
          ctx.drawImage(sprite(cod), Math.round(c * cw * dpr), Math.round(f * ch * dpr));
        }
      }

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
        if (cod && cod !== 32) ctx.drawImage(sprite(cod), Math.round(c * cw * dpr), Math.round(f * ch * dpr));
      }
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

  /* ---------- 4. Arranque ---------- */

  function iniciar() {
    // Total de horas y nota de días: se calculan con los datos
    const cifraTotal = $('[data-total]');
    if (cifraTotal) cifraTotal.textContent = formato(totalHoras);

    const nota = $('[data-nota-dias]');
    if (nota) {
      const dias = Math.round(totalHoras / 24);
      const cuantos = NUMEROS[programas.length] || programas.length;
      nota.textContent = `horas en ${cuantos} programas de diseño. Son ${dias} días seguidos, de día y de noche.`;
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
    };
    iniciarReloj();
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
          $$('dt, dd', fila).forEach((el, i) => decodificar(el, i * 90));
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

    /* Cabecera: se esconde al bajar y reaparece al subir */
    const cabecera = $('.cabecera');
    if (cabecera) {
      let previo = window.scrollY;
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const cambio = y - previo;
        if (Math.abs(cambio) < 6) return;        // ignora los temblores pequeños
        cabecera.classList.toggle('oculta', cambio > 0 && y > 120);
        previo = y;
      }, { passive: true });
    }

    iniciarTorbellino();
  }

  // Esperamos a la tipografía (máximo 2,5 s) para medir bien las letras
  const tipografia = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([tipografia, new Promise(ok => setTimeout(ok, 2500))]).then(iniciar);
})();
