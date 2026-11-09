/**
 * module3.js — Módulo 3: réplicas e inferencia estadística.
 *
 * Ejecuta el motor de simulación con semillas distintas y recalcula en vivo
 * la media, la desviación estándar, el margen de error, el intervalo de
 * confianza al 95 % y el error relativo. Incluye parada automática cuando
 * Er <= error objetivo (mismo criterio que el documento) y la comparación
 * con los valores publicados en el PDF.
 */
(function (global) {
  'use strict';

  var D = global.Datos;
  var S = global.Stats;
  var E = global.Engine;
  var U = global.UI;

  var LOTE = 8;                 // réplicas por actualización de pantalla
  var MAX_AUTO = 500;           // tope de seguridad en modo automático

  var estado = {
    medias: [],
    maxs: [],
    semillas: [],
    corriendo: false,
    timer: null,
    auto: false,
    objetivo: 0.10,
    nObjetivo: 89
  };

  /* ================================================================== *
   * Configuración leída de los controles                                *
   * ================================================================== */

  function cfg() {
    return {
      n: Math.max(5, Math.min(300, Number(document.getElementById('rep-n').value) || 89)),
      base: Math.max(1, Number(document.getElementById('rep-seed').value) || 101),
      paso: Math.max(1, Number(document.getElementById('rep-step').value) || 101),
      er: Number(document.getElementById('rep-er').value) || 0.10
    };
  }

  function semillaEn(i) {
    var c = cfg();
    return c.base + c.paso * i;
  }

  function inferencia() {
    return S.intervaloConfianza(estado.medias, 0.95);
  }

  /* ================================================================== *
   * Ejecución por lotes                                                *
   * ================================================================== */

  function progreso(actual, total) {
    var wrap = document.getElementById('rep-progress-wrap');
    wrap.hidden = false;
    document.getElementById('rep-progress').style.width =
      (total ? (actual / total) * 100 : 0).toFixed(1) + '%';
    document.getElementById('rep-progress-label').textContent =
      U.int(actual) + ' / ' + U.int(total) + ' réplicas';
  }

  function ocultarProgreso() {
    document.getElementById('rep-progress-wrap').hidden = true;
  }

  function resetear() {
    estado.medias = [];
    estado.maxs = [];
    estado.semillas = [];
  }

  /**
   * Ejecuta réplicas hasta alcanzar `nObjetivo` (modo fijo) o hasta que el
   * error relativo sea <= objetivo (modo automático).
   */
  function ejecutar(nObjetivo, auto) {
    parar();
    var c = cfg();
    resetear();
    estado.auto = !!auto;
    estado.objetivo = c.er;
    estado.nObjetivo = nObjetivo;
    estado.corriendo = true;
    pintarBotones();
    progreso(0, nObjetivo);

    (function lote() {
      if (!estado.corriendo) return;
      var hechas = 0;
      while (estado.corriendo && hechas < LOTE) {
        if (estado.auto) {
          /* Parada automática: se recalcula Er al final de cada lote. */
          if (estado.medias.length >= 2) {
            var inf = inferencia();
            if (inf.er <= estado.objetivo) break;
          }
          if (estado.medias.length >= MAX_AUTO) break;
        } else if (estado.medias.length >= nObjetivo) {
          break;
        }
        var s = semillaEn(estado.medias.length);
        var r = E.runReplica(s, 100);
        estado.medias.push(r.media);
        estado.maxs.push(r.max);
        estado.semillas.push(s);
        hechas++;
      }

      var total = estado.auto
        ? Math.max(nObjetivo, estado.medias.length)
        : nObjetivo;
      progreso(Math.min(estado.medias.length, total), total);
      pintarKpis();
      actualizarTabla();

      var mas = estado.auto
        ? (estado.medias.length < MAX_AUTO)
        : (estado.medias.length < nObjetivo);

      if (estado.corriendo && mas) {
        estado.timer = setTimeout(lote, 0);
      } else {
        estado.corriendo = false;
        pintarBotones();
        actualizarTodo();
        setTimeout(ocultarProgreso, 700);
      }
    })();
  }

  function parar() {
    estado.corriendo = false;
    if (estado.timer) clearTimeout(estado.timer);
    estado.timer = null;
    pintarBotones();
  }

  function pintarBotones() {
    var run = document.getElementById('btn-run');
    var auto = document.getElementById('btn-auto');
    run.disabled = estado.corriendo;
    auto.disabled = estado.corriendo;
    document.getElementById('btn-stop').disabled = !estado.corriendo;
    run.innerHTML = estado.corriendo
      ? '<i data-lucide="loader-2"></i> Ejecutando…'
      : '<i data-lucide="play"></i> Ejecutar réplicas';
    U.refreshIcons(run);
  }

  /* ================================================================== *
   * KPIs y verificaciones                                               *
   * ================================================================== */

  function pintarKpis() {
    var inf = inferencia();
    var n = estado.medias.length;

    document.getElementById('k-replicas').textContent = n ? U.int(n) : '—';
    document.getElementById('k-media').textContent = n ? U.num(inf.media, 4) : '—';
    document.getElementById('k-s').textContent = n >= 2 ? U.num(inf.s, 4) : '—';
    document.getElementById('k-h').textContent = n >= 2 ? U.num(inf.h, 4) : '—';
    document.getElementById('k-ic').textContent =
      n >= 2 ? '[' + U.num(inf.lo, 4) + '; ' + U.num(inf.hi, 4) + ']' : '—';
    document.getElementById('k-er').textContent = n >= 2 ? U.num(inf.er * 100, 2) + ' %' : '—';
    document.getElementById('k-nstar').textContent =
      n >= 2 ? U.int(S.replicasNecesarias(n, inf.er, estado.objetivo)) : '—';

    var clientes = n * 100;
    document.getElementById('k-clientes').textContent = U.int(clientes);

    var okEr = n >= 2 && inf.er <= estado.objetivo;
    var kpiEr = document.getElementById('k-er').closest('.kpi');
    kpiEr.classList.toggle('kpi-er-ok', okEr);
    kpiEr.classList.toggle('kpi-er-bad', n >= 2 && !okEr);
    document.getElementById('k-er-icon').className =
      'kpi-icon ' + (okEr ? 'green' : 'orange');
  }

  function chip(texto, ok) {
    return U.el('span', { class: 'verify ' + (ok ? 'ok' : 'bad'), html:
      (ok ? '<i data-lucide="check-circle-2"></i> ' : '<i data-lucide="x-circle"></i> ') + texto
    });
  }

  function cerca(a, b, tol) { return Math.abs(a - b) <= (tol || 0.0005); }

  function pintarVerificaciones() {
    var fila = document.getElementById('verify-row');
    fila.innerHTML = '';
    var n = estado.medias.length;
    var ref = D.REFERENCIA.global;

    if (n < 5) {
      fila.appendChild(U.el('span', { class: 'verify', html:
        '<i data-lucide="info"></i> Ejecute al menos 5 réplicas para ver las verificaciones.'
      }));
      U.refreshIcons(fila);
      return;
    }

    /* Primeras 5 réplicas del documento */
    var cinco = estado.medias.slice(0, 5);
    var docCinco = D.REFERENCIA.replica5.map(function (r) { return r.media; });
    var cincoOk = cinco.every(function (m, i) { return cerca(m, docCinco[i], 0.00005); });
    fila.appendChild(chip('Primeras 5 réplicas = 0,6200 · 0,5400 · 0,7800 · 0,5100 · 0,4000', cincoOk));

    if (n < ref.replicas) {
      var infParcial = inferencia();
      fila.appendChild(U.el('span', { class: 'verify', html:
        '<i data-lucide="info"></i> Faltan ' + U.int(ref.replicas - n) +
        ' réplicas para comparar con el resultado global del documento (89).'
      }));
      U.refreshIcons(fila);
      return;
    }

    var inf = inferencia();
    fila.appendChild(chip('n = 89 réplicas', n === ref.replicas));
    fila.appendChild(chip('Media = 0,5996 min', cerca(inf.media, ref.media, 0.00005)));
    fila.appendChild(chip('S = 0,2838 min', cerca(inf.s, ref.desviacion, 0.00005)));
    fila.appendChild(chip('h = 0,0598 min', cerca(inf.h, ref.hCorrecto, 0.00005)));
    fila.appendChild(chip(
      'IC95 % = [0,5398; 0,6593]', cerca(inf.lo, ref.lo, 0.00005) && cerca(inf.hi, ref.hi, 0.00005)
    ));
    fila.appendChild(chip('Er = 9,97 % ≤ 10 %', cerca(inf.er, ref.er, 0.00005)));
    U.refreshIcons(fila);
  }

  function pintarReferencia() {
    var caja = document.getElementById('ref-match');
    var n = estado.medias.length;
    var ref = D.REFERENCIA.global;

    if (n < ref.replicas) {
      caja.className = 'ref-match';
      caja.innerHTML = 'Ejecuta <strong>89 réplicas</strong> (botón «Reproducir resultado del ' +
        'documento») para comparar directamente con las cifras del PDF.';
      return;
    }

    var inf = inferencia();
    var exacto = cerca(inf.media, ref.media, 0.00005) &&
      cerca(inf.s, ref.desviacion, 0.00005) &&
      cerca(inf.h, ref.hCorrecto, 0.00005) &&
      cerca(inf.er, ref.er, 0.00005);

    caja.className = 'ref-match' + (exacto ? ' exacto' : '');
    caja.innerHTML = exacto
      ? '<strong>✓ Reproducción exacta:</strong> el motor en vivo coincide con las 89 réplicas ' +
        'del documento (media 0,5996 · S 0,2838 · h 0,0598 · Er 9,97 %).'
      : '<strong>⚠ Diferencia con el documento:</strong> media ' + U.num(inf.media, 4) +
        ' vs. 0,5996 · h ' + U.num(inf.h, 4) + ' vs. 0,0598. Revisa la semilla base (101) y el ' +
        'paso (101).';

    U.chart('chart-ref-compare', {
      type: 'bar',
      data: {
        labels: ['Media de espera (min)', 'Margen de error h (min)'],
        datasets: [
          {
            label: 'Motor en vivo',
            data: [inf.media, inf.h],
            backgroundColor: 'rgba(30,107,255,.85)',
            borderRadius: 7, maxBarThickness: 46
          },
          {
            label: 'Documento (89 réplicas)',
            data: [ref.media, ref.hCorrecto],
            backgroundColor: 'rgba(249,115,22,.85)',
            borderRadius: 7, maxBarThickness: 46
          }
        ]
      },
      options: {
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(16,35,63,.07)' } }
        }
      }
    });
  }

  /* ================================================================== *
   * Gráficos                                                            *
   * ================================================================== */

  function pintarGraficos() {
    var medias = estado.medias;
    var maxs = estado.maxs;
    var n = medias.length;
    if (!n) return;

    var etiquetas = medias.map(function (_, i) { return i + 1; });

    /* Media acumulada (camino convergente) */
    var acum = [];
    var s = 0;
    medias.forEach(function (m, i) { s += m; acum.push(s / (i + 1)); });

    U.chart('chart-rep-medias', {
      data: {
        labels: etiquetas,
        datasets: [
          {
            type: 'bar',
            label: 'Espera media de la réplica',
            data: medias,
            backgroundColor: 'rgba(30,107,255,.35)',
            borderColor: 'rgba(30,107,255,.75)',
            borderWidth: 1,
            borderRadius: 4,
            order: 2
          },
          {
            type: 'line',
            label: 'Media acumulada',
            data: acum,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249,115,22,.12)',
            borderWidth: 2.5,
            pointRadius: 0,
            tension: .25,
            fill: true,
            order: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              title: function (i) { return 'Réplica ' + i[0].label; },
              label: function (c) {
                return ' ' + c.dataset.label + ': ' + U.num(c.parsed.y, 4) + ' min';
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, title: { display: true, text: 'N.º de réplica', color: '#7a8aa1' } },
          y: { beginAtZero: true, grid: { color: 'rgba(16,35,63,.07)' }, title: { display: true, text: 'minutos', color: '#7a8aa1' } }
        }
      }
    });

    /* Error relativo evolutivo */
    var ers = [];
    for (var i = 1; i <= n; i++) {
      var inf = S.intervaloConfianza(medias.slice(0, i), 0.95);
      ers.push(inf.n >= 2 ? inf.er * 100 : null);
    }
    var objetivoPct = estado.objetivo * 100;

    U.chart('chart-er', {
      type: 'line',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: 'Error relativo (%)',
            data: ers,
            borderColor: '#1e6bff',
            backgroundColor: 'rgba(30,107,255,.1)',
            borderWidth: 2.2,
            pointRadius: n > 60 ? 0 : 2.5,
            pointBackgroundColor: '#1e6bff',
            tension: .2,
            fill: true
          },
          {
            label: 'Objetivo (' + U.num(objetivoPct, 0) + ' %)',
            data: ers.map(function () { return objetivoPct; }),
            borderColor: '#f97316',
            borderDash: [7, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { display: false }, title: { display: true, text: 'N.º de réplica', color: '#7a8aa1' } },
          y: { beginAtZero: true, grid: { color: 'rgba(16,35,63,.07)' }, title: { display: true, text: 'error relativo (%)', color: '#7a8aa1' } }
        }
      }
    });

    /* Intervalo de confianza evolutivo (barras flotantes) */
    var ics = [];
    for (var j = 1; j <= n; j++) {
      var infj = S.intervaloConfianza(medias.slice(0, j), 0.95);
      ics.push(infj.n >= 2 ? [infj.lo, infj.hi] : null);
    }

    U.chart('chart-ic', {
      data: {
        labels: etiquetas,
        datasets: [
          {
            type: 'bar',
            label: 'IC 95 %',
            data: ics,
            backgroundColor: 'rgba(22,163,74,.28)',
            borderColor: 'rgba(22,163,74,.7)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: .9,
            categoryPercentage: .95
          },
          {
            type: 'line',
            label: 'Media acumulada',
            data: acum,
            borderColor: '#0b1f3a',
            borderWidth: 2,
            pointRadius: 0,
            tension: .2
          }
        ]
      },
      options: {
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { grid: { display: false }, title: { display: true, text: 'N.º de réplica', color: '#7a8aa1' } },
          y: { grid: { color: 'rgba(16,35,63,.07)' }, title: { display: true, text: 'minutos', color: '#7a8aa1' } }
        }
      }
    });

    /* Espera máxima por réplica */
    U.chart('chart-max', {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Espera máxima (min)',
          data: maxs,
          backgroundColor: 'rgba(249,115,22,.75)',
          borderRadius: 4,
          maxBarThickness: 26
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, title: { display: true, text: 'N.º de réplica', color: '#7a8aa1' } },
          y: { beginAtZero: true, grid: { color: 'rgba(16,35,63,.07)' }, title: { display: true, text: 'minutos', color: '#7a8aa1' } }
        }
      }
    });
  }

  /* ================================================================== *
   * Tabla de resultados individuales                                    *
   * ================================================================== */

  function actualizarTabla() {
    var tbody = document.getElementById('tbody-replicas');
    var n = estado.medias.length;
    document.getElementById('rep-table-badge').textContent = U.int(n) + ' filas';
    if (!n) return;

    var inf = inferencia();
    var filas = [];
    for (var i = 0; i < n; i++) {
      filas.push({
        c: [
          { v: i + 1, cls: 'num' },
          { v: estado.semillas[i], cls: 'num' },
          { v: 100, cls: 'num' },
          { v: U.num(estado.medias[i], 4), cls: 'num' },
          { v: U.num(estado.maxs[i], 1), cls: 'num' }
        ]
      });
    }
    if (n >= 2) {
      filas.push({
        cls: 'total-row',
        c: [
          { v: 'Global' },
          { v: 'n = ' + n, cls: 'num' },
          { v: U.int(n * 100), cls: 'num' },
          { v: U.num(inf.media, 4), cls: 'num' },
          { v: 'IC [' + U.num(inf.lo, 4) + '; ' + U.num(inf.hi, 4) + ']', cls: 'num' }
        ]
      });
    }

    var tabla = U.table(
      [{ label: 'Réplica' }, { label: 'Semilla' }, { label: 'Clientes' }, { label: 'Espera media' }, { label: 'Espera máx.' }],
      filas, { compact: true, wrapClass: 'tabla-scroll tabla-rep' }
    );
    var vieja = document.querySelector('#tbody-replicas').closest('.tabla-wrap');
    tabla.id = vieja.id;
    vieja.replaceWith(tabla);
    /* el tbody conserva su id para las siguientes actualizaciones */
    tabla.querySelector('tbody').id = 'tbody-replicas';
  }

  /* ================================================================== *
   * Tablas de referencia (dos versiones de las 5 réplicas)              *
   * ================================================================== */

  function tablaCinco(id, filas, inferenciaRef, color) {
    var rows = filas.map(function (r) {
      return {
        c: [
          { v: r.rep, cls: 'num' },
          { v: r.semilla, cls: 'num' },
          { v: r.clientes, cls: 'num' },
          { v: U.num(r.media, 4), cls: 'num' },
          { v: U.num(r.max, 1), cls: 'num' }
        ]
      };
    });
    rows.push({
      cls: 'total-row',
      c: [
        { v: 'Media' },
        { v: '—', cls: 'num' },
        { v: '—', cls: 'num' },
        { v: U.num(inferenciaRef.media, 4), cls: 'num' },
        { v: 'S = ' + U.num(inferenciaRef.desviacion, 4), cls: 'num' }
      ]
    });
    rows.push({
      c: [
        { v: 'IC 95 %' },
        { v: '—', cls: 'num' },
        { v: '—', cls: 'num' },
        { v: '[' + U.num(inferenciaRef.lo, 4) + '; ' + U.num(inferenciaRef.hi, 4) + ']', cls: 'num' },
        { v: 'Er = ' + inferenciaRef.erTexto, cls: 'num' }
      ]
    });
    var nodo = document.getElementById(id);
    var tabla = U.table(
      [{ label: 'Rép.' }, { label: 'Semilla' }, { label: 'Clientes' }, { label: 'Media espera' }, { label: 'Espera máx.' }],
      rows, { compact: true }
    );
    tabla.id = id;
    tabla.style.borderLeft = '3px solid ' + color;
    nodo.replaceWith(tabla);
  }

  /* ================================================================== *
   * Panel de inconsistencias del documento                              *
   * ================================================================== */

  function pintarInconsistencias() {
    var cont = document.getElementById('inconsistencias');
    cont.innerHTML = '';

    cont.appendChild(U.el('div', { class: 'inconsistencias-head' }, [
      U.el('i', { 'data-lucide': 'triangle-alert' }),
      U.el('div', null, [
        U.el('h3', { text: 'Inconsistencias detectadas en el documento' }),
        U.el('p', { html:
          'Se identificaron <strong>' + D.INCONSISTENCIAS.length + '</strong> discrepancias entre el ' +
          'PDF y sus propias cifras. <strong>No se corrigieron en silencio:</strong> se conservan ' +
          'los valores impresos y se explica el origen de cada uno.'
        })
      ])
    ]));

    D.INCONSISTENCIAS.forEach(function (inc, i) {
      cont.appendChild(U.el('article', { class: 'inconsistencia ' + inc.gravedad }, [
        U.el('h4', { html:
          '<span class="badge ' + (inc.gravedad === 'alta' ? 'badge-red' : inc.gravedad === 'media' ? 'badge-orange' : 'badge-blue') + '">' +
          'Inconsistencia ' + (i + 1) + '</span>' + inc.titulo +
          '<span class="seccion">' + inc.seccion + '</span>'
        }),
        U.el('dl', null, [
          U.el('dt', { text: 'Qué dice el documento' }),
          U.el('dd', { text: inc.detalle }),
          U.el('dt', { text: 'Causa identificada' }),
          U.el('dd', { text: inc.causa }),
          U.el('dt', { text: 'Cómo se presenta en esta página' }),
          U.el('dd', { text: inc.resolucion })
        ])
      ]));
    });

    U.refreshIcons(cont);
  }

  /* ================================================================== *
   * Actualización general                                               *
   * ================================================================== */

  function actualizarTodo() {
    pintarKpis();
    pintarVerificaciones();
    pintarGraficos();
    pintarReferencia();
    actualizarTabla();
  }

  /* ================================================================== *
   * Enlaces                                                             *
   * ================================================================== */

  function bind() {
    var slider = document.getElementById('rep-n');
    slider.addEventListener('input', function () {
      document.getElementById('rep-n-val').textContent = this.value;
    });

    ['rep-seed', 'rep-step', 'rep-er'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', function () {
        if (!estado.corriendo) { resetear(); actualizarTodo(); }
      });
    });

    document.getElementById('btn-run').addEventListener('click', function () {
      ejecutar(cfg().n, false);
    });

    document.getElementById('btn-auto').addEventListener('click', function () {
      ejecutar(cfg().n, true);
    });

    document.getElementById('btn-stop').addEventListener('click', function () {
      parar();
      actualizarTodo();
      ocultarProgreso();
    });

    document.getElementById('btn-doc').addEventListener('click', function () {
      document.getElementById('rep-n').value = 89;
      document.getElementById('rep-n-val').textContent = '89';
      document.getElementById('rep-seed').value = 101;
      document.getElementById('rep-step').value = 101;
      document.getElementById('rep-er').value = '0.10';
      ejecutar(89, false);
      document.getElementById('replicas').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function init() {
    tablaCinco('tbl-5-numpy', D.REFERENCIA.salidaPrograma, D.REFERENCIA.inferencialPrograma, '#f97316');
    tablaCinco('tbl-5-aditivo', D.REFERENCIA.replica5, D.REFERENCIA.inferencial5, '#1e6bff');
    pintarInconsistencias();
    bind();
    pintarBotones();
    pintarVerificaciones();
    document.getElementById('rep-table-badge').textContent = '0 filas';
  }

  global.Module3 = { init: init, ejecutar: ejecutar };
})(window);
