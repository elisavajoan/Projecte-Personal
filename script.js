/* =========================================================
   LES HORES EN EL DISSENY · script.js

   1. Utilidades y datos (se leen del HTML)
   2. Texto "decodificado": cada letra pasa por una escala de símbolos
      hasta convertirse en la letra real (la técnica de aino.agency)
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

  // Símbolo que se ve durante el glitch al pasar el ratón: va hasta el otro
  // extremo de la escala y vuelve a la letra
  function glifoGlitch(letra, h) {
    const { rampa, indice } = rampaDe(letra);
    if (indice === -1) return letra;
    const u = 1 - 2 * Math.abs(h - 0.5);
    const lejos = indice < rampa.length / 2 ? rampa.length - 1 : 0;
    return rampa[Math.floor(lerp(indice, lejos, u))] ?? letra;
  }

  // Un único bucle de animación para todas las letras
  const activas = new Map();   // letra (span) -> { tipo, inicio, dur, c }
  let bucleActivo = false;

  function paso() {
    const ahora = performance.now();
    for (const [span, a] of activas) {
      if (ahora < a.inicio) continue;                      // todavía no le toca
      const t = Math.min(1, (ahora - a.inicio) / a.dur);
      if (t >= (a.tipo === 'glitch' ? 0.99 : 1)) {
        span.textContent = a.c;
        span._listo = true;
        span._glitch = false;
        activas.delete(span);
        continue;
      }
      const h = suavizar(t);
      span.textContent = a.tipo === 'glitch' ? glifoGlitch(a.c, h) : glifoAparicion(a.c, h);
    }
    if (activas.size) requestAnimationFrame(paso);
    else bucleActivo = false;
  }

  function arrancar() {
    if (bucleActivo) return;
    bucleActivo = true;
    requestAnimationFrame(paso);
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

  // Lanza la aparición. data-velocidad = ms de retraso entre una letra y la siguiente
  // (la ola de izquierda a derecha); data-duracion = ms que tarda cada letra en resolverse.
  function decodificar(el, retardo = 0) {
    const velocidad = parseFloat(el.dataset.velocidad) || 1;
    const duracion = parseFloat(el.dataset.duracion) || 400;
    const inicio = performance.now() + retardo;
    let espera = 0;
    for (const s of $$('.let', el)) {
      s.textContent = VACIO;
      s._listo = false;
      s._glitch = false;
      activas.set(s, { tipo: 'aparicion', inicio: inicio + espera, dur: duracion, c: s.dataset.c });
      espera += velocidad;
    }
    arrancar();
  }

  // Cambia el texto de un elemento y lo decodifica de nuevo
  function escribir(el, texto) {
    el.textContent = texto;
    if (sinMovimiento) return;
    el.classList.remove('dividido');
    preparar(el);
    decodificar(el);
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
          activas.set(s, { tipo: 'glitch', inicio: performance.now(), dur: 1000, c: s.dataset.c });
        }
      }
      arrancar();
    });
  }

  // Si la tipografía llega tarde, se vuelven a medir las letras
  function remedirTodo() {
    fijarAnchos($$('.let'));
  }

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
