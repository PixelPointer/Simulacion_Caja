/**
 * module2.js — Módulo 2: simulador interactivo de la caja del supermercado.
 *
 * La simulación es real: se procesan los eventos uno a uno con la lógica del
 * modelo (LLEGADA / FIN de servicio), se respeta la disciplina FIFO y todo es
 * reproducible a partir de la semilla elegida.
 */
(function (global) {
  'use strict';

  var D = global.Datos;
  var E = global.Engine;
  var U = global.UI;

  var sim = null;            // instancia de Engine.Simulator
  var corriendo = false;
  var timer = null;
  var velocidad = 1;
  var nodos = {};            // id -> elemento DOM del cliente
  var relojUltimo = 0;
  var finalizado = false;
  var orden = { clave: 'id', dir: 1 };
  var SVG_CLIENTE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
    'stroke-linecap="round" stroke-linejoin="round" width="20" height="20">' +
    '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  /* ================================================================== *
   * Escena                                                              *
   * ================================================================== */

  function stage() { return document.getElementById('scene-stage'); }

  function geometria() {
    var w = stage().clientWidth || 900;
    /* se mide la caja registradora (ancho fijo) y no el bloque completo de la
       caja, cuyo ancho cambia con el texto de la insignia "Libre/Atendiendo" */
    var caja = document.getElementById('register') || document.getElementById('counter');
    var izqCaja = (caja && caja.offsetLeft) ? caja.offsetLeft : w * 0.86;
    var limite = izqCaja - 34;                 // el cliente atendido no invade la caja
    var inicioCola = w * 0.15;
    var finCola = Math.max(inicioCola + 110, Math.min(w * 0.72, limite - 46));
    var atencion = Math.min(w * 0.845, limite);
    var salida = w * 0.955;
    return { w: w, inicioCola: inicioCola, finCola: finCola, atencion: atencion, salida: salida };
  }

  function crearNodo(cliente) {
    var n = U.el('div', {
      class: 'customer entering',
      'data-id': cliente.id,
      style: 'left:' + (geometria().w * 0.045) + 'px'
    }, [
      U.el('div', {
        class: 'avatar',
        html: SVG_CLIENTE +
          '<svg class="svc-ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20"></circle></svg>' +
          '<span class="wait-badge" hidden></span><span class="svc-badge" hidden></span>'
      }),
      U.el('div', { class: 'cid', text: '#' + cliente.id })
    ]);
    n.addEventListener('click', function () { mostrarDetalle(cliente.id); });
    document.getElementById('customers').appendChild(n);
    nodos[cliente.id] = n;
    // fuerza el reflow para que la transición de entrada se ejecute
    void n.offsetWidth;
    n.classList.remove('entering');
    return n;
  }

  function posicionar(n, x, estado) {
    n.style.left = Math.round(x) + 'px';
    n.className = 'customer ' + estado;
  }

  function renderEscena() {
    var g = geometria();
    /* sim.cola contiene objetos cliente en orden FIFO (el primero de la lista
       es el siguiente en ser atendido). El frente de la cola se dibuja junto
       a la caja (derecha) y el fondo, hacia la entrada (izquierda). */
    var cola = sim.cola.map(function (c) { return c.id; });
    var n = cola.length;
    var anchoDisponible = g.finCola - g.inicioCola;
    var pasoMin = 46;                       // separación mínima entre clientes
    var cap = Math.max(3, Math.floor(anchoDisponible / pasoMin));
    var visibles = Math.min(n, cap);
    var paso = visibles > 0 ? Math.min(62, anchoDisponible / visibles) : 62;
    var ocultos = n - visibles;

    cola.forEach(function (id, i) {
      var nodo = nodos[id];
      if (!nodo) return;

      /* Cola más larga que el espacio disponible: sólo se dibujan los que
         están junto a la caja y el resto se indica con el contador "+N". */
      if (i >= visibles) { nodo.style.display = 'none'; return; }
      nodo.style.display = '';

      posicionar(nodo, Math.round(g.finCola - i * paso), 'waiting');
      var cli = sim.clientes[id - 1];
      var esperaActual = Math.max(0, sim.reloj - cli.llegada);
      var badge = nodo.querySelector('.wait-badge');
      badge.hidden = false;
      badge.textContent = U.num(esperaActual, 0);
      badge.className = 'wait-badge' + (esperaActual > 0 ? '' : ' zero');
      var svc = nodo.querySelector('.svc-badge');
      svc.hidden = true;
      quitarAnillo(nodo);
    });

    /* Contador de clientes sin espacio en el dibujo (fondo de la cola) */
    var mas = document.getElementById('queue-more');
    if (ocultos > 0) {
      mas.hidden = false;
      mas.textContent = '+' + ocultos + ' más al fondo';
      mas.style.left = Math.round(Math.max(46, g.inicioCola - 26)) + 'px';
    } else {
      mas.hidden = true;
    }

    if (sim.servidor !== null) {
      var ns = nodos[sim.servidor];
      if (ns) {
        ns.style.display = '';
        posicionar(ns, g.atencion - 27, 'serving');
        var cs = sim.clientes[sim.servidor - 1];
        var badgeS = ns.querySelector('.wait-badge');
        badgeS.hidden = true;
        var svcS = ns.querySelector('.svc-badge');
        svcS.hidden = false;
        svcS.textContent = 'restan ' + U.num(Math.max(0, cs.fin ? cs.fin - sim.reloj : cs.tServ), 0) + ' min';
        pintarAnillo(ns, cs);
      }
    }
  }

  /** Anillo de progreso SVG: fracción del servicio ya consumida. */
  function pintarAnillo(nodo, cliente) {
    var c = nodo.querySelector('.svc-ring circle');
    if (!c || !cliente) return;
    var total = cliente.tServ || 1;
    var hecho = cliente.inicio !== null && cliente.inicio !== undefined
      ? Math.min(total, Math.max(0, sim.reloj - cliente.inicio))
      : 0;
    var p = Math.min(1, Math.max(0, hecho / total));
    c.style.strokeDasharray = '125.66';
    c.style.strokeDashoffset = (125.66 * (1 - p)).toFixed(2);
  }

  function quitarAnillo(nodo) {
    var c = nodo.querySelector('.svc-ring circle');
    if (c) { c.style.strokeDashoffset = '125.66'; }
  }

  function mostrarDetalle(id) {
    var c = sim.clientes[id - 1];
    if (!c || c.llegada === null) return;
    U.qsa('.customer').forEach(function (n) { n.classList.remove('dimmed'); });
    if (nodos[id]) nodos[id].classList.remove('dimmed');
    document.getElementById('scene-client-detail').innerHTML =
      'Cliente <b>#' + c.id + '</b> · llegada <b>' + fmtReloj(c.llegada) + '</b> · servicio <b>' +
      c.tServ + '</b> min · inicio <b>' + (c.inicio !== null ? fmtReloj(c.inicio) : '—') +
      '</b> · fin <b>' + (c.fin !== null ? fmtReloj(c.fin) : '—') +
      '</b> · espera <b>' + (c.espera !== null ? fmtReloj(c.espera) : '—') + '</b> min';
    U.qsa('#tbody-clientes tr').forEach(function (tr) {
      tr.classList.toggle('selected', tr.dataset.id === String(id));
    });
  }

  function salidaDe(id) {
    var nodo = nodos[id];
    if (!nodo) return;
    var g = geometria();
    nodo.style.display = '';
    nodo.className = 'customer leaving';
    nodo.style.left = Math.round(g.salida) + 'px';
    delete nodos[id];
    setTimeout(function () { if (nodo.parentNode) nodo.parentNode.removeChild(nodo); }, 600);
  }

  function limpiarEscena() {
    var cont = document.getElementById('customers');
    cont.innerHTML = '';
    nodos = {};
    document.getElementById('scene-client-detail').innerHTML = '';
  }

  /* ================================================================== *
   * Indicadores                                                         *
   * ================================================================== */

  function fmtReloj(t) {
    return U.num(t, t % 1 === 0 ? 0 : 1);
  }

  function actualizarKpis() {
    document.getElementById('kpi-reloj').textContent = fmtReloj(sim.reloj);
    document.getElementById('kpi-llegaron').textContent = sim.llegados;
    document.getElementById('kpi-cola').textContent = sim.cola.length;
    document.getElementById('kpi-atendidos').textContent = sim.atendidos.length;

    var cajero = document.getElementById('kpi-cajero');
    cajero.textContent = sim.servidor !== null ? 'Atendiendo #' + sim.servidor : 'Libre';

    var media = sim.esperaMedia();
    var max = sim.esperaMax();
    document.getElementById('kpi-espera-media').textContent = U.num(media, 2);
    document.getElementById('kpi-espera-max').textContent = U.num(max, 2);

    var prog = sim.nClientes ? (sim.atendidos.length / sim.nClientes) * 100 : 0;
    document.getElementById('kpi-progreso').textContent = U.num(prog, 0) + ' %';

    /* Cajero animado */
    var avatar = document.getElementById('cashier');
    var av = avatar.querySelector('.cashier-avatar');
    var badge = document.getElementById('cashier-badge');
    var ocupado = sim.servidor !== null;
    av.classList.toggle('busy', ocupado);
    badge.classList.toggle('busy', ocupado);
    badge.textContent = ocupado ? 'Atendiendo #' + sim.servidor : 'Libre';
    document.getElementById('register-screen').textContent =
      ocupado ? 'CLI #' + sim.servidor : 'CAJA 1';

    var svc = document.getElementById('counter-service');
    if (ocupado) {
      var c = sim.clientes[sim.servidor - 1];
      var falta = c.fin !== null ? Math.max(0, c.fin - sim.reloj) : c.tServ;
      svc.textContent = 'Servicio: ' + U.num(falta, 0) + ' min restantes';
      svc.classList.add('show');
    } else {
      svc.classList.remove('show');
    }

    /* --- HUD de la escena (reloj, avance y estado de la caja) --- */
    document.getElementById('hud-reloj').textContent = fmtReloj(sim.reloj);
    document.getElementById('hud-avance').textContent =
      U.int(sim.atendidos.length) + ' / ' + U.int(sim.nClientes);
    var fill = prog.toFixed(1) + '%';
    document.getElementById('hud-bar-fill').style.width = fill;
    document.getElementById('scene-progress-fill').style.width = fill;
    document.getElementById('counter').classList.toggle('busy', ocupado);
    document.getElementById('register').classList.toggle('busy', ocupado);
    document.getElementById('evolucion-badge').textContent =
      U.int(sim.pasos || 0) + ' eventos';
  }

  /* ================================================================== *
   * Estado de la escena                                                 *
   * ================================================================== */

  var ESTADOS = { idle: 'En pausa', run: 'En ejecución', end: 'Concluida' };

  function pintarEstado(cual) {
    var s = document.getElementById('scene-status');
    if (!s) return;
    s.className = 'scene-status is-' + cual;
    s.textContent = ESTADOS[cual] || ESTADOS.idle;
  }

  /* ================================================================== *
   * Bitácora                                                            *
   * ================================================================== */

  function agregarEvento(descriptor) {
    var cont = document.getElementById('bitacora');
    var vacio = cont.querySelector('.empty');
    if (vacio) vacio.remove();

    var lineas = [];
    if (descriptor.tipo === 'LLEGADA') {
      lineas.push({ cls: 'llegada', tag: 'Llegada', t: descriptor.t, txt: descriptor.mensaje });
    } else {
      lineas.push({ cls: 'fin', tag: 'Fin', t: descriptor.t, txt: descriptor.mensaje.split(' Caja libre')[0] });
      if (descriptor.mensaje.indexOf(' Caja libre') !== -1) {
        lineas.push({
          cls: 'inicio', tag: 'Inicio', t: descriptor.t,
          txt: descriptor.mensaje.substring(descriptor.mensaje.indexOf(' Caja libre') + 11)
        });
      }
    }
    if (descriptor.tipo === 'LLEGADA' && descriptor.inicio) {
      lineas.push({
        cls: 'inicio', tag: 'Inicio', t: descriptor.t,
        txt: 'Cliente #' + descriptor.inicio.id + ' inicia atención en t = ' +
          fmtReloj(descriptor.t) + ' min (espera ' + fmtReloj(descriptor.inicio.espera) + ' min).'
      });
    }

    lineas.forEach(function (l) {
      cont.appendChild(U.el('div', { class: 'ev-line ' + l.cls }, [
        U.el('span', { class: 't', text: 't = ' + fmtReloj(l.t) }),
        U.el('span', { class: 'tag', text: l.tag }),
        U.el('span', { text: l.txt })
      ]));
    });

    /* limita el tamaño de la bitácora para no saturar el DOM */
    while (cont.children.length > 400) cont.removeChild(cont.firstChild);
    cont.scrollTop = cont.scrollHeight;

    document.getElementById('bitacora-count').textContent =
      (parseInt(document.getElementById('bitacora-count').textContent, 10) || 0) + lineas.length + ' eventos';
  }

  function mensajeEscena(descriptor) {
    var box = document.getElementById('scene-event');
    var icono = descriptor.tipo === 'LLEGADA' ? 'log-in' : 'check-circle-2';
    box.className = 'scene-event ' + (descriptor.tipo === 'LLEGADA' ? 'ev-llegada' : 'ev-fin');
    box.innerHTML = '<i data-lucide="' + icono + '"></i><span>' + descriptor.mensaje + '</span>';
    U.refreshIcons(box);
    /* reinicia la animación de entrada del mensaje en cada evento */
    void box.offsetWidth;
    box.classList.add('ev-pop');
  }

  /* ================================================================== *
   * Efectos visuales de los eventos                                     *
   * ================================================================== */

  function efecto(tipo, texto) {
    var capa = document.getElementById('stage-fx');
    if (!capa) return;
    var g = geometria();

    if (tipo === 'fin') {
      var destello = U.el('span', { class: 'fx-flash' });
      capa.appendChild(destello);
      setTimeout(function () { if (destello.parentNode) destello.parentNode.removeChild(destello); }, 750);
      flotar('+1 atendido', 'fx-pop');
    } else if (tipo === 'llegada') {
      var onda = U.el('span', { class: 'fx-ripple' });
      capa.appendChild(onda);
      setTimeout(function () { if (onda.parentNode) onda.parentNode.removeChild(onda); }, 900);
      if (texto) flotar(texto, 'fx-wait', Math.round(g.w * 0.03));
    }
  }

  /** Texto flotante; si no se indica `left`, usa la posición por defecto. */
  function flotar(texto, cls, left) {
    var capa = document.getElementById('stage-fx');
    if (!capa) return;
    var n = U.el('span', { class: cls, text: texto });
    if (left === undefined) {
      var g = geometria();
      left = Math.round(Math.min(g.inicioCola + 30, g.w * 0.42));
    }
    n.style.left = left + 'px';
    capa.appendChild(n);
    setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 1250);
  }

  /** Confeti al concluir la réplica. */
  function celebrar() {
    var capa = document.getElementById('stage-fx');
    if (!capa) return;
    var colores = ['#38bdf8', '#22c55e', '#f97316', '#facc15', '#a78bfa', '#ffffff'];
    for (var i = 0; i < 20; i++) {
      (function (i) {
        var n = U.el('span', { class: 'fx-confetti' });
        n.style.left = (4 + Math.random() * 92).toFixed(1) + '%';
        n.style.background = colores[i % colores.length];
        n.style.animationDuration = (1.5 + Math.random() * 1.3).toFixed(2) + 's';
        n.style.animationDelay = (Math.random() * 0.6).toFixed(2) + 's';
        capa.appendChild(n);
        setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 3600);
      })(i);
    }
  }

  function limpiarEfectos() {
    var capa = document.getElementById('stage-fx');
    if (capa) capa.innerHTML = '';
  }

  /* ================================================================== *
   * Gráfico de evolución en vivo                                        *
   * ================================================================== */

  var chartVivo = null;
  var serie = null;

  function iniciarGrafico() {
    U.destroyChart('chart-sim-live');
    serie = { labels: [], cola: [], media: [], max: [] };
    chartVivo = U.chart('chart-sim-live', {
      data: {
        labels: [],
        datasets: [
          {
            type: 'bar',
            label: 'Clientes en cola',
            data: [],
            backgroundColor: 'rgba(30,107,255,.45)',
            borderColor: 'rgba(96,165,250,.95)',
            borderWidth: 1,
            borderRadius: 3,
            yAxisID: 'y',
            order: 3
          },
          {
            type: 'line',
            label: 'Espera media acumulada (min)',
            data: [],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249,115,22,.14)',
            borderWidth: 2.4,
            pointRadius: 0,
            tension: .25,
            fill: true,
            yAxisID: 'y1',
            order: 1
          },
          {
            type: 'line',
            label: 'Espera máxima (min)',
            data: [],
            borderColor: '#22c55e',
            borderWidth: 2,
            borderDash: [6, 5],
            pointRadius: 0,
            tension: .25,
            yAxisID: 'y1',
            order: 2
          }
        ]
      },
      options: {
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function (i) { return 'Evento en t = ' + i[0].label + ' min'; },
              label: function (c) {
                var v = U.num(c.parsed.y, 2);
                return c.datasetIndex === 0
                  ? ' En cola: ' + U.int(c.parsed.y) + ' clientes'
                  : ' ' + c.dataset.label + ': ' + v + ' min';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#93a9cd', maxTicksLimit: 12, autoSkip: true },
            title: { display: true, text: 'reloj de simulación (min)', color: '#7a8aa1' }
          },
          y: {
            beginAtZero: true, position: 'left',
            grid: { color: 'rgba(255,255,255,.07)' },
            ticks: { color: '#93a9cd', precision: 0 },
            title: { display: true, text: 'clientes en cola', color: '#7a8aa1' }
          },
          y1: {
            beginAtZero: true, position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#93a9cd' },
            title: { display: true, text: 'minutos', color: '#7a8aa1' }
          }
        }
      }
    });
  }

  function actualizarGrafico() {
    if (!chartVivo || !serie) return;
    serie.labels.push(fmtReloj(sim.reloj));
    serie.cola.push(sim.cola.length);
    serie.media.push(sim.esperaMedia());
    serie.max.push(sim.esperaMax());
    chartVivo.data.labels = serie.labels;
    chartVivo.data.datasets[0].data = serie.cola;
    chartVivo.data.datasets[1].data = serie.media;
    chartVivo.data.datasets[2].data = serie.max;
    chartVivo.update('none');
  }

  /* ================================================================== *
   * Tabla de clientes                                                   *
   * ================================================================== */

  function filasClientes() {
    var filas = [];
    for (var i = 0; i < sim.llegados && i < sim.clientes.length; i++) {
      var c = sim.clientes[i];
      filas.push(c);
    }
    var k = orden.clave, d = orden.dir;
    filas.sort(function (a, b) {
      var va = a[k] === null || a[k] === undefined ? -Infinity : a[k];
      var vb = b[k] === null || b[k] === undefined ? -Infinity : b[k];
      return (va - vb) * d;
    });
    return filas;
  }

  function renderTabla() {
    var tbody = document.getElementById('tbody-clientes');
    var filas = filasClientes();
    tbody.innerHTML = '';

    if (!filas.length) {
      tbody.appendChild(U.el('tr', null, [
        U.el('td', { colspan: '7', class: 'empty', text: 'Aún no ha llegado ningún cliente.' })
      ]));
    } else {
      filas.forEach(function (c) {
        tbody.appendChild(U.el('tr', {
          class: 'clickable',
          'data-id': c.id,
          onclick: function () { mostrarDetalle(c.id); }
        }, [
          U.el('td', { html: '<strong>#' + c.id + '</strong>' }),
          U.el('td', { class: 'num', text: c.tEntre + ' min' }),
          U.el('td', { class: 'num', text: fmtReloj(c.llegada) }),
          U.el('td', { class: 'num', text: c.tServ + ' min' }),
          U.el('td', { class: 'num', text: c.inicio !== null ? fmtReloj(c.inicio) : '—' }),
          U.el('td', { class: 'num', text: c.fin !== null ? fmtReloj(c.fin) : '—' }),
          U.el('td', {
            class: 'num',
            html: c.espera !== null
              ? '<span class="badge ' + (c.espera > 0 ? 'badge-orange' : 'badge-green') + '">' +
                fmtReloj(c.espera) + ' min</span>'
              : '—'
          })
        ]));
      });
    }

    document.getElementById('tabla-clientes-badge').textContent =
      filas.length + ' / ' + sim.nClientes + ' filas';
  }

  /* ================================================================== *
   * Procesar eventos                                                    *
   * ================================================================== */

  function paso() {
    if (!sim || sim.listo()) {
      detener();
      if (sim && sim.listo()) finalizar();
      return false;
    }
    var descriptor = sim.step();
    if (!descriptor) { detener(); finalizar(); return false; }

    /* Nuevos nodos para los clientes que acaban de llegar */
    if (descriptor.tipo === 'LLEGADA') {
      var cli = descriptor.cliente;
      if (!nodos[cli.id]) crearNodo(cli);
      /* el siguiente cliente ya quedó agendado: se materializa su nodo al llegar */
    }
    /* El cliente que inicia atención puede venir de la cola (ya tiene nodo) */

    renderEscena();
    actualizarKpis();
    agregarEvento(descriptor);
    mensajeEscena(descriptor);
    renderTabla();
    actualizarGrafico();

    if (descriptor.tipo === 'FIN') {
      salidaDe(descriptor.cliente.id);
      efecto('fin');
    } else if (descriptor.tipo === 'LLEGADA') {
      efecto('llegada', 'Cliente #' + descriptor.cliente.id + ' llega');
    }

    if (sim.listo()) { detener(); finalizar(); return false; }
    return true;
  }

  function finalizar() {
    if (finalizado) return;
    finalizado = true;
    var box = document.getElementById('scene-event');
    box.className = 'scene-event ev-fin';
    box.innerHTML = '<i data-lucide="party-popper"></i><span><strong>Simulación concluida:</strong> ' +
      sim.nClientes + ' clientes atendidos en ' + fmtReloj(sim.reloj) + ' min · espera media <strong>' +
      U.num(sim.esperaMedia(), 4) +
      '</strong> min · espera máxima <strong>' +
      fmtReloj(sim.esperaMax()) + '</strong> min · verificación FIFO <strong>correcta</strong>.</span>';
    void box.offsetWidth;
    box.classList.add('ev-pop');
    U.refreshIcons(box);
    pintarEstado('end');
    celebrar();
    document.getElementById('btn-play').classList.remove('running');
    document.getElementById('btn-play').innerHTML = '<i data-lucide="rotate-ccw"></i><span>Repetir</span>';
    U.refreshIcons(document.getElementById('btn-play'));
  }

  /* ================================================================== *
   * Reproducción                                                        *
   * ================================================================== */

  function msPorMinuto() { return 420 / velocidad; }

  function reproducir() {
    if (sim.listo()) reiniciar();
    corriendo = true;
    pintarBoton();
    pintarEstado('run');
    programarSiguiente();
  }

  function programarSiguiente() {
    if (!corriendo) return;
    var t0 = sim.reloj;
    var ok = paso();
    if (!ok || !corriendo) return;
    var delta = Math.max(0, sim.reloj - t0);
    var espera = Math.min(2400, Math.max(55, delta * msPorMinuto()));
    timer = setTimeout(programarSiguiente, espera);
  }

  function pausar() {
    corriendo = false;
    if (timer) clearTimeout(timer);
    timer = null;
    pintarBoton();
    pintarEstado(finalizado ? 'end' : 'idle');
  }

  function detener() { pausar(); }

  function pintarBoton() {
    var b = document.getElementById('btn-play');
    b.classList.toggle('running', corriendo);
    b.innerHTML = corriendo
      ? '<i data-lucide="pause"></i><span>Pausar</span>'
      : '<i data-lucide="play"></i><span>' + (sim && sim.pasos > 0 ? 'Continuar' : 'Iniciar') + '</span>';
    U.refreshIcons(b);
  }

  function reiniciar() {
    pausar();
    var semilla = Math.max(1, Number(document.getElementById('sim-seed').value) || 101);
    var n = Math.min(500, Math.max(10, Number(document.getElementById('sim-n').value) || 100));
    document.getElementById('sim-seed').value = semilla;
    document.getElementById('sim-n').value = n;
    sim = new E.Simulator(semilla, n);
    relojUltimo = 0;
    finalizado = false;
    limpiarEscena();
    limpiarEfectos();
    iniciarGrafico();
    document.getElementById('bitacora').innerHTML =
      '<p class="empty">Semilla ' + semilla + ' cargada. Pulse <strong>Iniciar</strong> para procesar el primer evento.</p>';
    document.getElementById('bitacora-count').textContent = '0 eventos';
    var box = document.getElementById('scene-event');
    box.className = 'scene-event';
    box.innerHTML = '<i data-lucide="radio"></i><span>Sistema en estado inicial: caja libre, cola vacía, reloj en 0. ' +
      'Semilla <strong>' + semilla + '</strong> · <strong>' + n + '</strong> clientes por réplica.</span>';
    U.refreshIcons(box);
    pintarEstado('idle');
    actualizarKpis();
    renderTabla();
    pintarBoton();
    document.getElementById('recon-compare').innerHTML = '';
  }

  /* ================================================================== *
   * Reconstrucción manual                                               *
   * ================================================================== */

  function reconstruir() {
    var cont = document.getElementById('recon-steps');
    cont.innerHTML = '';

    var ga = new global.RNG.CongruencialAditivo(101);
    var gs = new global.RNG.CongruencialAditivo(1101);
    var datos = [];
    for (var i = 0; i < 3; i++) {
      var ua = ga.random(), us = gs.random();
      datos.push({
        n: i + 1,
        ua: ua, us: us,
        tE: global.RNG.inversa(ua, global.RNG.CDF_LLEGADA),
        tS: global.RNG.inversa(us, global.RNG.CDF_SERVICIO)
      });
    }

    /* Simulación manual de los tres clientes */
    var reloj = 0, libreHasta = 0, resumen = [];
    datos.forEach(function (d) {
      reloj += d.tE;
      var llegada = reloj;
      var inicio = Math.max(llegada, libreHasta);
      var fin = inicio + d.tS;
      libreHasta = fin;
      resumen.push({ n: d.n, llegada: llegada, inicio: inicio, fin: fin, espera: inicio - llegada, d: d });
    });

    var textos = [
      '<strong>Cliente 1:</strong> U llegada = ' + U.num(datos[0].ua, 4) + ' → ' + datos[0].tE +
        ' min. Llega en t = <b>' + resumen[0].llegada + '</b>. El servidor está libre → inicia en <b>' +
        resumen[0].inicio + '</b> y termina en <b>' + resumen[0].fin + '</b> (' +
        U.num(datos[0].us, 4) + ' → ' + datos[0].tS + ' min de servicio). Espera = <b>' +
        resumen[0].espera + ' min</b>.',
      '<strong>Cliente 2:</strong> U llegada = ' + U.num(datos[1].ua, 4) + ' → ' + datos[1].tE +
        ' min. Llega en t = <b>' + resumen[1].llegada + '</b> (el anterior terminó en ' +
        resumen[0].fin + ') → inicia en <b>' + resumen[1].inicio + '</b> y termina en <b>' +
        resumen[1].fin + '</b>. Espera = <b>' + resumen[1].espera + ' min</b>.',
      '<strong>Cliente 3:</strong> U llegada = ' + U.num(datos[2].ua, 4) + ' → ' + datos[2].tE +
        ' min. Llega en t = <b>' + resumen[2].llegada + '</b>, pero el servidor está ocupado hasta <b>' +
        resumen[1].fin + '</b> → espera y comienza en <b>' + resumen[2].inicio + '</b>, terminando en <b>' +
        resumen[2].fin + '</b>. Espera = <b>' + resumen[2].espera + ' min</b>.'
    ];

    textos.forEach(function (txt, i) {
      cont.appendChild(U.el('div', { class: 'recon-step' }, [
        U.el('h4', { html: '<span class="n">' + (i + 1) + '</span> Cálculo del cliente ' + (i + 1) }),
        U.el('div', { html: txt }),
        U.el('div', { class: 'calc', html:
          'regla: <b>inicio = max(llegada, fin anterior)</b> · <b>espera = inicio − llegada</b>' })
      ]));
    });

    /* Resumen */
    var tabla = U.table(
      [{ label: 'Cliente' }, { label: 'Hora de llegada' }, { label: 'Inicio de servicio' }, { label: 'Finalización' }, { label: 'Tiempo de espera' }],
      resumen.map(function (r) {
        return { c: [{ v: r.n, cls: 'num' }, { v: r.llegada, cls: 'num' }, { v: r.inicio, cls: 'num' }, { v: r.fin, cls: 'num' }, { v: r.espera + ' min', cls: 'num' }] };
      }),
      { compact: true }
    );
    tabla.classList.add('tabla-recon');
    var nota = U.el('p', { class: 'table-footnote', html:
      'Resumen de la reconstrucción (idéntico al documento): llegadas <strong>3, 7, 8</strong> · ' +
      'inicios <strong>3, 7, 9</strong> · finales <strong>6, 9, 10</strong> · esperas <strong>0, 0, 1</strong> min.'
    });
    var wrap = U.el('div', null, [tabla, nota]);
    cont.appendChild(wrap);
    U.refreshIcons(cont);
  }

  function comparar() {
    var semilla = Math.max(1, Number(document.getElementById('sim-seed').value) || 101);
    var fuente;
    if (sim.llegados >= 3) {
      fuente = sim.clientes.slice(0, 3);
    } else {
      fuente = E.runReplica(semilla, 100).clientes.slice(0, 3);
    }

    var esperado = D.REFERENCIA.reconstruccion;
    var todoOk = true;
    var rows = fuente.map(function (c, i) {
      var e = esperado[i];
      var ok = semilla === 101 &&
        c.llegada === e.llegada && c.inicio === e.inicio && c.fin === e.fin && c.espera === e.espera;
      if (!ok) todoOk = false;
      return {
        c: [
          { v: '#' + c.id },
          { v: fmtReloj(c.llegada), cls: 'num' },
          { v: fmtReloj(c.inicio), cls: 'num' },
          { v: fmtReloj(c.fin), cls: 'num' },
          { v: fmtReloj(c.espera), cls: 'num' },
          { html: ok
            ? '<span class="match ok">✓ coincide</span>'
            : '<span class="match no">✕ difiere</span>' }
        ]
      };
    });

    var cont = document.getElementById('recon-compare');
    cont.innerHTML = '';
    cont.appendChild(U.table(
      [{ label: 'Cliente' }, { label: 'Llegada' }, { label: 'Inicio' }, { label: 'Fin' }, { label: 'Espera' }, { label: 'Comparación' }],
      rows, { compact: true }
    ));

    var msj;
    if (semilla !== 101) {
      msj = 'La simulación actual usa la semilla <strong>' + semilla +
        '</strong>; la reconstrucción del documento corresponde a la semilla <strong>101</strong>, ' +
        'por lo que los valores pueden diferir. Cambie la semilla a 101 para comparar directamente.';
    } else if (todoOk) {
      msj = 'Los tres primeros clientes de la simulación <strong>coinciden exactamente</strong> con la ' +
        'reconstrucción manual del documento: llegadas 3, 7, 8 · inicios 3, 7, 9 · finales 6, 9, 10 · ' +
        'esperas 0, 0, 1 min.';
    } else {
      msj = 'Algunos valores no coinciden con la reconstrucción del documento (semilla 101).';
    }
    cont.appendChild(U.el('p', { class: 'table-footnote', html: msj }));
  }

  /* ================================================================== *
   * Nota sobre los tiempos del documento                                *
   * ================================================================== */

  function notaDocumento() {
    document.getElementById('nota-simulador').innerHTML =
      'El PDF contiene dos trazas distintas para la semilla 101. La <strong>sección 2</strong> ' +
      '(salida del programa con <code>numpy.random.default_rng</code>) muestra tiempos entre ' +
      'llegadas 5, 4, 2, 4, 5 y primera llegada en t = 5. La <strong>reconstrucción manual</strong> ' +
      '(§1.3 y §4.1.2, generador congruencial aditivo) muestra 3, 4, 1 y primera llegada en t = 3. ' +
      'Este simulador usa el <strong>generador congruencial aditivo</strong>, el mismo que produjo los ' +
      'resultados finales de 89 réplicas, por eso con la semilla 101 reproduce la reconstrucción ' +
      'manual del documento. Ambas cifras se conservan sin modificar en el módulo de inconsistencias.';
  }

  /* ================================================================== *
   * Enlaces y ordenamiento de la tabla                                  *
   * ================================================================== */

  function bind() {
    document.getElementById('btn-play').addEventListener('click', function () {
      if (corriendo) pausar();
      else reproducir();
    });

    document.getElementById('btn-step').addEventListener('click', function () {
      pausar();
      paso();
    });

    document.getElementById('btn-reset').addEventListener('click', reiniciar);
    document.getElementById('btn-apply').addEventListener('click', reiniciar);

    document.getElementById('sim-speed').addEventListener('input', function () {
      velocidad = Number(this.value);
      document.getElementById('sim-speed-out').textContent =
      String(velocidad).replace('.', ',') + '×';
    });

    document.getElementById('btn-reconstruir').addEventListener('click', reconstruir);
    document.getElementById('btn-comparar').addEventListener('click', comparar);

    U.qsa('#tabla-clientes th[data-sort]').forEach(function (th) {
      th.style.cursor = 'pointer';
      th.addEventListener('click', function () {
        var k = th.dataset.sort;
        if (orden.clave === k) orden.dir *= -1;
        else { orden.clave = k; orden.dir = 1; }
        U.qsa('#tabla-clientes th').forEach(function (o) { o.classList.remove('sorted'); });
        th.classList.add('sorted');
        renderTabla();
      });
    });

    window.addEventListener('resize', U.debounce(function () {
      if (sim && sim.pasos > 0) renderEscena();
    }, 200));
  }

  function init() {
    notaDocumento();
    bind();
    reiniciar();
  }

  global.Module2 = { init: init, getSim: function () { return sim; } };
})(window);
