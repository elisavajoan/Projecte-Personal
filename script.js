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

  // Al pasar el ratón por un texto, las letras cercanas se "descolocan" un momento
  function activarGlitch(el) {
    if (sinMovimiento || !window.matchMedia('(hover: hover)').matches) return;
    let medidas = [];
    let medidoEn = 0;
    const medir = () => {
      medidas = $$('.let', el).map(s => ({ s, r: s.getBoundingClientRect() }));
      medidoEn = performance.now();
    };
    el.addEventListener('mousemove', e => {
      if (!medidas.length || performance.now() - medidoEn > 300) medir();
      for (const { s, r } of medidas) {
        if (!s._listo || s._glitch) continue;
        const dx = Math.abs(e.clientX - (r.left + r.width / 2));
        const dy = Math.abs(e.clientY - (r.top + r.height / 2));
        if (dx <= r.width * 1.2 && dy <= r.height) {
          s._glitch = true;
          glitchMosaico(el, s);
        }
      }
    });
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
    glitch:    { forma: .30, oculta: .1, letra: .55 },   // al pasar el ratón: la letra se descompone y se recompone
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

    // Dueño de cada casilla: la letra sobre la que cae (con un poco de margen arriba y abajo)
    const dueno = new Int16Array(cols * filas).fill(-1);
    medidas.forEach((d, i) => {
      const margen = d.tam * 0.12;
      const c0 = Math.max(0, Math.floor((d.x0 + ext) / celdaW));
      const c1 = Math.min(cols - 1, Math.floor((d.x1 + ext) / celdaW));
      const f0 = Math.max(0, Math.floor((d.y0 - margen + ext) / celdaH));
      const f1 = Math.min(filas - 1, Math.floor((d.y1 + margen + ext) / celdaH));
      for (let f = f0; f <= f1; f++) for (let c = c0; c <= c1; c++) dueno[f * cols + c] = i;
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
      const p = (ahora - a.inicio) / a.dur;
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

  // Al pasar el ratón, la letra se descompone en caracteres y vuelve a formarse
  function glitchMosaico(el, span) {
    const m = el._mosaico || crearMosaico(el);
    if (!m.medido) medirMosaico(m);
    const l = m.letras[span._idx];
    if (!m.medido || !l) { span._glitch = false; return; }
    l.anim = { modo: 'glitch', inicio: performance.now(), dur: 1000 };
    arrancarMosaicos();
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
      if (!sinMovimiento && el.hasAttribute('data-decode')) decodificar(el);
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

    textos.filter(el => !el.hasAttribute('data-manual')).forEach(el => observador.observe(el));
    $$('[data-reveal]').forEach(el => observador.observe(el));

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
