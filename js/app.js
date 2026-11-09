/**
 * app.js — arranque de la página: navegación, progreso de lectura,
 * animaciones de entrada, tooltips, glosario y contenido del Módulo 0.
 */
(function (global) {
  'use strict';

  var D = global.Datos;
  var U = global.UI;

  /* ================================================================== *
   * 1. Módulo 0 · contenido estático                                    *
   * ================================================================== */

  function renderIntegrantes() {
    var tbody = document.getElementById('tbody-integrantes');
    tbody.innerHTML = '';
    D.PORTADA.integrantes.forEach(function (p, i) {
      tbody.appendChild(U.el('tr', null, [
        U.el('td', { class: 'num', text: String(i + 1) }),
        U.el('td', { html: '<strong>' + p.nombre + '</strong>' }),
        U.el('td', { class: 'num', text: String(p.numero) }),
        U.el('td', { text: p.curso })
      ]));
    });
  }

  function renderContexto() {
    document.getElementById('contexto-texto').textContent = D.ESCENARIO.contexto;
  }

  function renderCaracteristicas() {
    var cont = document.getElementById('caracteristicas');
    var items = [
      { ico: 'git-merge', t: 'Disciplina FIFO', d: 'Primero en llegar, primero en ser atendido.' },
      { ico: 'user-check', t: '1 servidor', d: 'Una sola caja; si está ocupada se forma cola.' },
      { ico: 'users', t: '100 clientes / réplica', d: 'Cada réplica procesa exactamente 100 clientes.' },
      { ico: 'timer', t: 'Unidad: minutos', d: 'Todos los tiempos se expresan en minutos.' },
      { ico: 'activity', t: 'Eventos discretos', d: 'El reloj salta entre llegadas y fin de servicio.' },
      { ico: 'dice-5', t: 'Semilla reproducible', d: 'La misma semilla reproduce la misma réplica.' },
      { ico: 'ruler', t: 'IC 95 %', d: 'Intervalo de confianza con t de Student.' },
      { ico: 'target', t: 'Error relativo ≤ 10 %', d: 'Criterio de parada del documento.' }
    ];
    cont.innerHTML = '';
    items.forEach(function (it) {
      cont.appendChild(U.el('article', { class: 'caracteristica' }, [
        U.el('span', { class: 'ico', html: U.iconSpan(it.ico) }),
        U.el('strong', { text: it.t }),
        U.el('span', { text: it.d })
      ]));
    });
  }

  function renderMapa() {
    var cont = document.getElementById('mapa-modulos');
    var descripciones = {
      datos: 'Frecuencias, estadísticos, χ² y transformada inversa.',
      sim: 'Simulación animada evento por evento con bitácora.',
      replicas: 'Dashboard inferencial con parada en Er ≤ 10 %.',
      preguntas: '13 preguntas con respuesta y complemento.',
      conclusiones: 'Las 7 conclusiones y la conclusión general.',
      codigo: 'El código Python del documento, explicado.'
    };
    cont.innerHTML = '';
    D.MODULOS.filter(function (m) { return m.num !== '0'; }).forEach(function (m) {
      cont.appendChild(U.el('a', { class: 'mapa-card reveal', href: '#' + m.id, 'data-nav': true }, [
        U.el('span', { class: 'ico', html: U.iconSpan(m.icono) }),
        U.el('div', null, [
          U.el('span', { class: 'n', text: 'Módulo ' + m.num }),
          U.el('h4', { text: m.nombre }),
          U.el('p', { text: descripciones[m.id] || '' })
        ])
      ]));
    });
  }

  /* ================================================================== *
   * 2. Navegación                                                       *
   * ================================================================== */

  function renderNav() {
    var nav = document.getElementById('nav-links');
    nav.innerHTML = '';
    D.MODULOS.forEach(function (m) {
      nav.appendChild(U.el('a', {
        class: 'nav-link', href: '#' + m.id, 'data-nav': true, 'data-seccion': m.id
      }, [
        U.el('span', { class: 'num', text: m.num }),
        U.el('span', { class: 'label', text: m.nombre })
      ]));
    });

    U.qsa('[data-nav]').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });

    document.getElementById('btn-menu').addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function activarSeccion() {
    var scroll = window.scrollY + 120;
    var actual = null;
    D.MODULOS.forEach(function (m) {
      var sec = document.getElementById(m.id);
      if (sec && sec.offsetTop <= scroll) actual = m.id;
    });
    U.qsa('.nav-link').forEach(function (a) {
      a.classList.toggle('active', a.dataset.seccion === actual);
    });
  }

  /* ================================================================== *
   * 3. Barra de progreso y botón "volver arriba"                        *
   * ================================================================== */

  function progreso() {
    var doc = document.documentElement;
    var alto = doc.scrollHeight - doc.clientHeight;
    var pct = alto > 0 ? (window.scrollY / alto) * 100 : 0;
    document.getElementById('progress-bar').style.width = pct.toFixed(2) + '%';
    document.getElementById('to-top').classList.toggle('show', window.scrollY > 600);
    activarSeccion();
  }

  /* ================================================================== *
   * 4. Animaciones de entrada                                            *
   * ================================================================== */

  function reveal() {
    var nodos = U.qsa('.reveal');
    if (!('IntersectionObserver' in global)) {
      nodos.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    nodos.forEach(function (n) { obs.observe(n); });
  }

  /* ================================================================== *
   * 5. Tooltips                                                         *
   * ================================================================== */

  function tooltips() {
    var tip = document.getElementById('tooltip');

    function mostrar(nodo) {
      var texto = nodo.getAttribute('data-tip');
      if (!texto) return;
      tip.textContent = texto;
      tip.hidden = false;
      var r = nodo.getBoundingClientRect();
      var w = tip.offsetWidth;
      var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), global.innerWidth - w - 8);
      var top = r.top - tip.offsetHeight - 10;
      if (top < 8) top = r.bottom + 10;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }

    function ocultar() { tip.hidden = true; }

    document.addEventListener('mouseover', function (e) {
      var n = e.target.closest ? e.target.closest('[data-tip]') : null;
      if (n) mostrar(n);
    });
    document.addEventListener('mouseout', function (e) {
      var n = e.target.closest ? e.target.closest('[data-tip]') : null;
      if (n) ocultar();
    });
    document.addEventListener('focusin', function (e) {
      var n = e.target.closest ? e.target.closest('[data-tip]') : null;
      if (n) mostrar(n);
    });
    document.addEventListener('focusout', ocultar);
    global.addEventListener('scroll', ocultar, true);
  }

  /* ================================================================== *
   * 6. Glosario modal                                                   *
   * ================================================================== */

  function glosario() {
    var modal = document.getElementById('glosario-modal');
    var lista = document.getElementById('glosario-lista');

    lista.innerHTML = '';
    D.GLOSARIO.forEach(function (g) {
      lista.appendChild(U.el('div', { class: 'glos-item' }, [
        U.el('span', { class: 'glos-ico', html: U.iconSpan(g.icono) }),
        U.el('div', null, [
          U.el('h4', { text: g.termino }),
          U.el('p', { text: g.definicion }),
          U.el('p', { class: 'ejemplo', html: '<b>Ejemplo:</b> ' + g.ejemplo })
        ])
      ]));
    });

    U.refreshIcons(lista);

    function abrir() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      U.refreshIcons(lista);
    }
    function cerrar() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }

    ['btn-glosario', 'btn-glosario-2'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', abrir);
    });
    U.qsa('[data-close]', modal).forEach(function (n) {
      n.addEventListener('click', cerrar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) cerrar();
    });
  }

  /* ================================================================== *
   * 7. Arranque                                                         *
   * ================================================================== */

  function init() {
    U.initChartDefaults();

    renderNav();
    renderIntegrantes();
    renderContexto();
    renderCaracteristicas();
    renderMapa();

    /* Módulos */
    global.Module1.init();
    global.Module2.init();
    global.Module3.init();
    global.Module4.init();
    global.Module5.init();
    global.Module6.init();

    /* Efectos globales */
    U.refreshIcons();
    reveal();
    tooltips();
    glosario();

    /* Listeners de scroll */
    var tick = false;
    global.addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () { progreso(); tick = false; });
    }, { passive: true });
    global.addEventListener('resize', U.debounce(progreso, 150));
    progreso();

    document.getElementById('to-top').addEventListener('click', function () {
      global.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
