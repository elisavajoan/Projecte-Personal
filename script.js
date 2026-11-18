/* =========================================================
   MI CONOCIMIENTO · script.js

   1. Utilidades y datos (se leen del HTML)
   2. Texto animado: letras, palabras y párrafo que se ilumina con el scroll
   3. Contadores de horas y barras
   4. Filas desplegables
   5. Botón de la pregunta
   6. Torbellino de horas (canvas)
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

  /* ---------- 2. Texto animado ---------- */

  // Parte el texto de un elemento según data-split: "chars", "words" o "scrub"
  function dividir(el) {
    const modo = el.dataset.split;
    const texto = el.textContent.trim().replace(/\s+/g, ' ');
    el.textContent = '';

    // Copia para lectores de pantalla (lo visual va con aria-hidden)
    const lector = document.createElement('span');
    lector.className = 'sr-only';
    lector.textContent = texto;

    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');

    let i = 0;
    const palabras = texto.split(' ');
    palabras.forEach((palabra, n) => {
      if (modo === 'scrub') {
        const s = document.createElement('span');
        s.className = 'luz';
        s.textContent = palabra;
        visual.append(s);
      } else {
        const mascara = document.createElement('span');
        mascara.className = 'pal';
        if (modo === 'chars') {
          for (const letra of palabra) {
            const c = document.createElement('span');
            c.className = 'let';
            c.style.setProperty('--i', i++);
            c.textContent = letra;
            mascara.append(c);
          }
        } else {
          const interior = document.createElement('span');
          interior.className = 'pal__i';
          interior.style.setProperty('--i', i++);
          interior.textContent = palabra;
          mascara.append(interior);
        }
        visual.append(mascara);
      }
      if (n < palabras.length - 1) visual.append(' ');
    });

    el.append(lector, visual);
    el.classList.add('dividido');
  }

  // Cuando un elemento entra en pantalla recibe la clase "in" y el texto sube.
  // Al salir se la quitamos, así la animación se repite al volver.
  const observador = new IntersectionObserver(entradas => {
    for (const e of entradas) {
      const el = e.target;
      if (e.isIntersecting && e.intersectionRatio >= 0.25) {
        if (!el.classList.contains('in')) {
          el.classList.add('in');
          if (el._alEntrar) el._alEntrar();
        }
      } else if (!e.isIntersecting && el.classList.contains('in')) {
        el.classList.remove('in');
        if (el._alSalir) el._alSalir();
      }
    }
  }, { threshold: [0, 0.25] });

  // Párrafo "scrub": cada palabra se enciende según avanza el scroll
  const parrafosScrub = [];
  function actualizarScrub() {
    const alto = window.innerHeight;
    for (const { el, palabras } of parrafosScrub) {
      const arriba = el.getBoundingClientRect().top;
      const progreso = Math.min(1, Math.max(0, (alto * 0.95 - arriba) / (alto * 0.75)));
      palabras.forEach((p, i) => p.classList.toggle('on', sinMovimiento || i / palabras.length < progreso));
    }
  }

  let scrubPendiente = false;
  function alHacerScroll() {
    if (scrubPendiente) return;
    scrubPendiente = true;
    requestAnimationFrame(() => { actualizarScrub(); scrubPendiente = false; });
  }

  /* ---------- 3. Contadores y barras ---------- */

  function contar(nodo, hasta, duracion = 1800) {
    cancelAnimationFrame(nodo._raf);
    if (sinMovimiento) { nodo.textContent = formato(hasta); return; }
    const inicio = performance.now();
    const paso = ahora => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const suavizado = 1 - Math.pow(1 - t, 4);          // frena al final
      nodo.textContent = formato(hasta * suavizado);
      if (t < 1) nodo._raf = requestAnimationFrame(paso);
    };
    nodo._raf = requestAnimationFrame(paso);
  }

  function reiniciar(nodo) {
    cancelAnimationFrame(nodo._raf);
    if (!sinMovimiento) nodo.textContent = formato(0);
  }

  /* ---------- 6. Torbellino ---------- */

  function iniciarTorbellino() {
    const lienzo = $('#lienzo');
    if (!lienzo) return;

    const banda = lienzo.parentElement;
    const ctx = lienzo.getContext('2d');
    const fuente = getComputedStyle(document.body).fontFamily;
    const admiteAncho = 'fontStretch' in ctx;
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
      const total = W > 900 ? 30 : 18;
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

        const tam = lerp(16, 70, p.peso) * escala * (0.4 + 0.6 * (r / rMax)) * (0.85 + 0.15 * delante);
        ctx.fillStyle = `rgba(255,255,255,${alfa.toFixed(3)})`;

        ctx.font = `800 ${tam.toFixed(1)}px ${fuente}`;
        if (admiteAncho) ctx.fontStretch = 'extra-condensed';
        ctx.fillText(p.texto, x, y);

        ctx.font = `500 ${Math.max(10, tam * 0.26).toFixed(1)}px ${fuente}`;
        if (admiteAncho) ctx.fontStretch = 'normal';
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

  /* ---------- Arranque ---------- */

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

    // Textos animados
    $$('[data-split]').forEach(dividir);

    $$('[data-split="scrub"]').forEach(el => {
      parrafosScrub.push({ el, palabras: $$('.luz', el) });
    });
    actualizarScrub();
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    window.addEventListener('resize', alHacerScroll);

    // Qué elementos se animan al entrar en pantalla
    const objetivos = new Set($$('[data-reveal]'));
    $$('[data-split]').forEach(el => {
      const esScrub = el.dataset.split === 'scrub';
      const esManual = el.hasAttribute('data-manual');
      const dentroDeReveal = el.closest('[data-reveal]');
      if (!esScrub && !esManual && !dentroDeReveal) objetivos.add(el);
    });

    // Contador del total
    const bloqueTotal = $('.total');
    if (bloqueTotal && cifraTotal) {
      reiniciar(cifraTotal);
      bloqueTotal._alEntrar = () => contar(cifraTotal, totalHoras, 2200);
      bloqueTotal._alSalir = () => reiniciar(cifraTotal);
    }

    // Contador y barra de cada programa
    for (const p of programas) {
      const nodo = $('[data-cuenta]', p.el);
      p.el.style.setProperty('--parte', (p.horas / maxHoras).toFixed(4));
      reiniciar(nodo);
      p.el._alEntrar = () => contar(nodo, p.horas);
      p.el._alSalir = () => reiniciar(nodo);
    }

    objetivos.forEach(el => observador.observe(el));

    /* ---------- 4. Filas desplegables ---------- */
    $$('.programa__cabecera').forEach(boton => {
      boton.addEventListener('click', () => {
        const fila = boton.closest('.programa');
        const abrir = !fila.classList.contains('abierto');
        // Solo una fila abierta a la vez
        $$('.programa.abierto').forEach(otra => {
          otra.classList.remove('abierto');
          $('.programa__cabecera', otra).setAttribute('aria-expanded', 'false');
        });
        fila.classList.toggle('abierto', abrir);
        boton.setAttribute('aria-expanded', String(abrir));
      });
    });

    /* ---------- 5. Botón de la pregunta ---------- */
    const boton = $('#boton');
    const texto = $('#texto');
    texto.setAttribute('aria-hidden', 'true');
    boton.addEventListener('click', () => {
      const mostrar = !texto.classList.contains('in');
      texto.classList.toggle('in', mostrar);
      texto.setAttribute('aria-hidden', String(!mostrar));
      boton.setAttribute('aria-expanded', String(mostrar));
      boton.textContent = mostrar ? 'Ocultar mi pregunta' : 'Ver mi pregunta';
    });

    iniciarTorbellino();
  }

  // Esperamos a la tipografía (máximo 1,2 s) para que el texto no salte al cargar
  const tipografia = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([tipografia, new Promise(ok => setTimeout(ok, 1200))]).then(iniciar);
})();
