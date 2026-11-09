/**
 * module1.js — Módulo 1: análisis de datos, pruebas de ajuste y
 * generación de variables aleatorias.
 *
 * Todas las cifras se calculan en vivo a partir de las frecuencias del
 * documento (50 observaciones por variable).
 */
(function (global) {
  'use strict';

  var D = global.Datos;
  var RNG = global.RNG;
  var U = global.UI;

  var estado = { variable: 'llegada', u: 0.5046 };

  /* ================================================================== *
   * Utilidades                                                          *
   * ================================================================== */

  /** Tabla de frecuencias absolutas, relativas y acumuladas. */
  function renderTablaFrecuencias(dist, id) {
    var nodo = document.getElementById(id);
    if (!nodo) return;
    var filas = RNG.tablaFrecuencias(dist);
    var total = filas[0].total;
    var rows = filas.map(function (r) {
      return {
        c: [
          { v: r.valor, cls: 'num' },
          { v: r.frecuencia, cls: 'num' },
          { v: U.num(r.relativa, 2), cls: 'num' },
          { v: U.num(r.acumulada, 2), cls: 'num' }
        ]
      };
    });
    rows.push({
      cls: 'total-row',
      c: [{ v: 'Total' }, { v: total, cls: 'num' }, { v: '1,00', cls: 'num' }, { v: '1,00', cls: 'num' }]
    });
    var tabla = U.table(
      [{ label: 'Tiempo (min)' }, { label: 'Frecuencia' }, { label: 'Frec. relativa' }, { label: 'Frec. acumulada' }],
      rows
    );
    tabla.id = id;
    nodo.replaceWith(tabla);
  }

  function renderStats(dist, id) {
    var e = RNG.estadisticosEmpiricos(dist);
    var nodo = document.getElementById(id);
    nodo.innerHTML = '';
    [
      { v: U.int(e.n), l: 'Observaciones (N)', cls: '' },
      { v: U.num(e.media, 2) + ' min', l: 'Media', cls: '' },
      { v: U.num(e.varianza, 2) + ' min²', l: 'Varianza', cls: 'stat-orange' },
      { v: U.num(e.desviacion, 3) + ' min', l: 'Desviación estándar', cls: 'stat-orange' }
    ].forEach(function (s) {
      nodo.appendChild(U.el('div', { class: 'stat ' + s.cls }, [
        U.el('strong', { text: s.v }),
        U.el('span', { text: s.l })
      ]));
    });
  }

  function renderFormula(dist, id, etiqueta) {
    var e = RNG.estadisticosEmpiricos(dist);
    var nodo = document.getElementById(id);
    var numerador = e.suma;
    var sumaDesv = 0;
    RNG.tablaFrecuencias(dist).forEach(function (r) {
      sumaDesv += r.frecuencia * Math.pow(r.valor - e.media, 2);
    });
    nodo.innerHTML =
      '<div class="comment">// Cálculo paso a paso (sección 1.1 del documento)</div>' +
      '<div><b>X̄</b> = Σ(xᵢ · fᵢ) / N = ' + numerador + ' / ' + e.n +
      ' = <span class="res">' + U.num(e.media, 2) + ' min</span></div>' +
      '<div><b>σ²</b> = Σ fᵢ(xᵢ − X̄)² / N = ' + U.num(sumaDesv, 2) + ' / ' + e.n +
      ' = <span class="res">' + U.num(e.varianza, 2) + ' min²</span></div>' +
      '<div><b>σ</b> = √' + U.num(e.varianza, 2) +
      ' = <span class="res">' + U.num(e.desviacion, 3) + ' min</span></div>' +
      '<div class="comment">// ' + etiqueta + '</div>';
  }

  /* ================================================================== *
   * Gráficos de frecuencias                                            *
   * ================================================================== */

  function chartFrecuencias(id, dist, color, colorBorde, titulo) {
    var filas = RNG.tablaFrecuencias(dist);
    U.chart(id, {
      type: 'bar',
      data: {
        labels: filas.map(function (r) { return r.valor + ' min'; }),
        datasets: [{
          label: titulo,
          data: filas.map(function (r) { return r.frecuencia; }),
          backgroundColor: color,
          borderColor: colorBorde,
          borderWidth: 1.5,
          borderRadius: 8,
          maxBarThickness: 54
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var r = filas[c.dataIndex];
                return ' ' + r.frecuencia + ' obs · ' + U.num(r.relativa * 100, 0) + ' %';
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, title: { display: true, text: 'Tiempo (min)', color: '#7a8aa1', font: { weight: '600' } } },
          y: { beginAtZero: true, ticks: { stepSize: 5 }, grid: { color: 'rgba(16,35,63,.07)' }, title: { display: true, text: 'Frecuencia', color: '#7a8aa1', font: { weight: '600' } } }
        }
      }
    });
  }

  /* ================================================================== *
   * Pruebas chi-cuadrado                                               *
   * ================================================================== */

  function renderChi(id, dist, titulo, kEsperadas) {
    var filas = RNG.tablaFrecuencias(dist);
    var n = filas[0].total;
    var k = filas.length;
    var E = n / k;
    var chi = 0;
    var filasChi = filas.map(function (r) {
      var contrib = Math.pow(r.frecuencia - E, 2) / E;
      chi += contrib;
      return { x: r.valor, O: r.frecuencia, E: E, c: contrib };
    });
    var gl = k - 1;
    var critico = global.Stats.chi2inv(0.95, gl);
    var rechaza = chi > critico;

    var nodo = document.getElementById(id);
    nodo.innerHTML = '';

    nodo.appendChild(U.el('header', { class: 'card-head' }, [
      U.el('i', { 'data-lucide': 'sigma' }),
      U.el('h3', { text: titulo })
    ]));

    nodo.appendChild(U.el('div', { class: 'chi-hyp' }, [
      U.el('div', { class: 'hyp h0', html: '<strong>H₀:</strong> ' + (kEsperadas) }),
      U.el('div', { class: 'hyp h1', html: '<strong>H₁:</strong> ' + (kEsperadas.replace('siguen una', 'no siguen una')) })
    ]));

    nodo.appendChild(U.el('p', {
      class: 'card-note',
      html: 'Frecuencia esperada bajo H₀: <strong>Eᵢ = ' + n + ' / ' + k + ' = ' +
        U.num(E, 2) + '</strong> (nivel de significancia α = 0,05).'
    }));

    var rows = filasChi.map(function (f) {
      return {
        c: [
          { v: f.x, cls: 'num' },
          { v: f.O, cls: 'num' },
          { v: U.num(f.E, 2), cls: 'num' },
          { v: U.num(f.c, 2), cls: 'num' }
        ]
      };
    });
    rows.push({
      cls: 'total-row',
      c: [{ v: 'Total' }, { v: n, cls: 'num' }, { v: U.num(E * k, 2), cls: 'num' }, { v: U.num(chi, 2), cls: 'num' }]
    });
    nodo.appendChild(U.table(
      [{ label: 'Tiempo' }, { label: 'Observada Oᵢ' }, { label: 'Esperada Eᵢ' }, { label: 'Contribución' }],
      rows, { compact: true }
    ));

    nodo.appendChild(U.el('div', { class: 'chi-result' }, [
      U.el('div', { class: 'chi-metric' }, [U.el('span', { text: 'χ² calculado' }), U.el('strong', { text: U.num(chi, 2) })]),
      U.el('div', { class: 'chi-metric' }, [U.el('span', { text: 'Grados de libertad' }), U.el('strong', { text: gl })]),
      U.el('div', { class: 'chi-metric' }, [U.el('span', { text: 'χ² crítico (0,05)' }), U.el('strong', { text: U.num(critico, 3) })]),
      U.el('div', { class: 'chi-metric ' + (rechaza ? 'verdict-rechaza' : 'verdict-acepta') }, [
        U.el('span', { text: 'Decisión' }),
        U.el('strong', { text: rechaza ? 'Rechaza H₀' : 'No rechaza' })
      ])
    ]));

    nodo.appendChild(U.el('div', { class: 'chi-verdict ' + (rechaza ? 'rechaza' : 'acepta'), html:
      (rechaza
        ? '<strong>' + U.num(chi, 2) + ' &gt; ' + U.num(critico, 3) + ':</strong> se rechaza la hipótesis nula. La variable <em>no</em> sigue una distribución uniforme discreta.'
        : '<strong>' + U.num(chi, 2) + ' ≤ ' + U.num(critico, 3) + ':</strong> no se rechaza la hipótesis nula.')
    }));

    nodo.appendChild(U.el('div', { class: 'chi-formula', html:
      'χ² = Σ (Oᵢ − Eᵢ)² / Eᵢ = ' +
      filasChi.map(function (f) { return '(' + f.O + ' − ' + U.num(f.E, 1) + ')² / ' + U.num(f.E, 1); }).join(' + ') +
      ' = <strong>' + U.num(chi, 2) + '</strong>'
    }));

    return { chi: chi, gl: gl, critico: critico, filas: filasChi, E: E };
  }

  function chartObservados(id, res, titulo) {
    U.chart(id, {
      type: 'bar',
      data: {
        labels: res.filas.map(function (f) { return f.x + ' min'; }),
        datasets: [
          {
            label: 'Observada',
            data: res.filas.map(function (f) { return f.O; }),
            backgroundColor: 'rgba(30,107,255,.85)',
            borderRadius: 7, maxBarThickness: 40
          },
          {
            label: 'Esperada (uniforme)',
            data: res.filas.map(function (f) { return f.E; }),
            backgroundColor: 'rgba(249,115,22,.8)',
            borderRadius: 7, maxBarThickness: 40
          }
        ]
      },
      options: {
        plugins: {
          title: { display: true, text: titulo, color: '#12233d', font: { weight: '700', size: 13 }, padding: { bottom: 12 } },
          legend: { position: 'top' }
        },
        scales: {
          x: { grid: { display: false }, title: { display: true, text: 'Tiempo (min)', color: '#7a8aa1' } },
          y: { beginAtZero: true, grid: { color: 'rgba(16,35,63,.07)' }, title: { display: true, text: 'Frecuencia', color: '#7a8aa1' } }
        }
      }
    });
  }

  /* ================================================================== *
   * Distribuciones acumuladas                                          *
   * ================================================================== */

  function renderCdf(id, dist) {
    var filas = RNG.tablaFrecuencias(dist);
    var cdf = RNG.construirCdf(dist);
    var prev = 0;
    var rows = filas.map(function (r, i) {
      var acum = cdf.acum[i];
      var intervalo = U.num(prev, 2).replace(/^0,00$/, '0') + ' ≤ U < ' +
        (acum === 1 ? '1,00' : U.num(acum, 2));
      prev = acum;
      return {
        c: [
          { v: r.valor, cls: 'num' },
          { v: r.frecuencia, cls: 'num' },
          { v: U.num(r.relativa, 2), cls: 'num' },
          { v: U.num(acum, 2), cls: 'num' },
          { v: intervalo, cls: 'num' }
        ]
      };
    });
    var nodo = document.getElementById(id);
    var tabla = U.table(
      [{ label: 'Tiempo (min)' }, { label: 'Frecuencia' }, { label: 'Probabilidad' }, { label: 'Prob. acumulada F(x)' }, { label: 'Intervalo de U (§1.3)' }],
      rows, { compact: true }
    );
    tabla.id = id;
    nodo.replaceWith(tabla);
  }

  /* ================================================================== *
   * Herramienta interactiva U → tiempo                                 *
   * ================================================================== */

  function cdfActual() {
    return estado.variable === 'llegada' ? RNG.CDF_LLEGADA : RNG.CDF_SERVICIO;
  }

  function renderU() {
    var u = estado.u;
    var cdf = cdfActual();
    var idx = RNG.intervaloDe(u, cdf);
    var tiempo = RNG.inversa(u, cdf);
    var prev = idx === 0 ? 0 : cdf.acum[idx - 1];
    var acum = cdf.acum[idx];
    var esLlegada = estado.variable === 'llegada';

    /* --- Resultado --- */
    var res = document.getElementById('u-result');
    res.innerHTML =
      '<div class="u-value">Número aleatorio generado</div>' +
      '<div class="u-big">' + U.num(u, 4) + '</div>' +
      '<div class="u-arrow">transformada inversa</div>' +
      '<div class="u-time">' + tiempo + ' min</div>' +
      '<div class="u-interval">Intervalo: ' + U.num(prev, 2) + ' ≤ U &lt; ' + U.num(acum, 2) +
      ' &nbsp;→&nbsp; F(' + tiempo + ') = ' + U.num(acum, 2) + '</div>';

    /* --- Barras acumuladas + marcador --- */
    var vis = document.getElementById('u-visual');
    vis.innerHTML = '';
    vis.style.position = 'relative';
    cdf.valores.forEach(function (v, i) {
      var p = i === 0 ? cdf.acum[0] : cdf.acum[i] - cdf.acum[i - 1];
      var bar = U.el('div', {
        class: 'u-bar' + (i === idx ? ' hot' : ' dim'),
        style: 'flex:' + p + ' 1 0',
        text: v + ' min'
      });
      vis.appendChild(bar);
    });
    vis.appendChild(U.el('div', {
      class: 'u-marker',
      'data-u': 'U = ' + U.num(u, 4),
      style: 'left:calc(' + (u * 100).toFixed(3) + '% - 1.5px)'
    }));

    /* --- Pasos --- */
    var pasos = document.getElementById('u-steps');
    pasos.innerHTML = '';
    var enLimite = cdf.acum.indexOf(u) !== -1;
    var pasosArr = [
      'Se genera <strong>U = ' + U.num(u, 4) + '</strong> con el generador congruencial aditivo (uniforme entre 0 y 1).',
      'Se recorre la acumulada de la variable <strong>' + (esLlegada ? 'tiempos entre llegadas' : 'tiempos de servicio') +
        '</strong>: se busca el primer valor x tal que <strong>U ≤ F(x)</strong>.',
      'Como ' + U.num(prev, 2) + ' &lt; ' + U.num(u, 4) + ' ≤ ' + U.num(acum, 2) +
        ', el intervalo que contiene a U es el de <strong>x = ' + tiempo + ' min</strong>.',
      'Resultado: la transformada inversa asigna <strong>' + tiempo +
        (esLlegada ? ' minutos entre llegadas' : ' minutos de servicio') + '</strong>.' +
        (enLimite ? ' <em>(U coincide exactamente con el límite superior: el código del documento toma U ≤ F(x).)</em>' : '')
    ];
    pasosArr.forEach(function (txt, i) {
      pasos.appendChild(U.el('div', { class: 'u-step' + (i === 3 ? ' final' : '') }, [
        U.el('span', { class: 'n', text: String(i + 1) }),
        U.el('span', { html: txt })
      ]));
    });

    /* --- Presets --- */
    renderPresets();
    U.refreshIcons(pasos);
  }

  function renderPresets() {
    var cont = document.getElementById('u-presets');
    cont.innerHTML = '';
    var fuente = estado.variable === 'llegada' ? D.REFERENCIA.primerosAleatorios.map(function (r) { return r.uLlegada; })
      : D.REFERENCIA.primerosAleatorios.map(function (r) { return r.uServicio; });
    fuente.forEach(function (u) {
      cont.appendChild(U.el('button', {
        class: 'preset', type: 'button',
        text: U.num(u, 4),
        onclick: function () { setU(u); }
      }));
    });
  }

  function setU(v, origen) {
    var n = Number(String(v).replace(',', '.'));
    /* valor todavía incompleto o inválido: se conserva el último válido */
    if (!isFinite(n)) return;
    n = Math.min(1, Math.max(0, n));
    estado.u = Math.round(n * 10000) / 10000;
    document.getElementById('u-range').value = estado.u;
    /* al escribir directamente no se reescribe el campo para no cortar la edición */
    if (origen !== 'num') document.getElementById('u-num').value = U.num(estado.u, 4);
    renderU();
  }

  function bindU() {
    var r = document.getElementById('u-range');
    var n = document.getElementById('u-num');
    r.addEventListener('input', function () { setU(r.value); });
    n.addEventListener('input', function () { setU(n.value, 'num'); });
    n.addEventListener('blur', function () { n.value = U.num(estado.u, 4); });

    U.qsa('#u-variable .seg').forEach(function (btn) {
      btn.addEventListener('click', function () {
        U.qsa('#u-variable .seg').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        estado.variable = btn.dataset.var;
        renderU();
      });
    });
  }

  /* ================================================================== *
   * Números aleatorios y comparación de semillas                       *
   * ================================================================== */

  function renderAleatorios() {
    var ga = new RNG.CongruencialAditivo(101);
    var gs = new RNG.CongruencialAditivo(1101);
    var rows = [];
    for (var i = 1; i <= 10; i++) {
      var ua = ga.random();
      var us = gs.random();
      rows.push({
        cls: i <= 5 ? 'selected' : null,
        c: [
          { v: i, cls: 'num' },
          { v: U.num(ua, 4), cls: 'num' },
          { v: RNG.inversa(ua, RNG.CDF_LLEGADA) + ' min', cls: 'num' },
          { v: U.num(us, 4), cls: 'num' },
          { v: RNG.inversa(us, RNG.CDF_SERVICIO) + ' min', cls: 'num' }
        ]
      });
    }
    var nodo = document.getElementById('tbl-aleatorios');
    var tabla = U.table(
      [{ label: 'N.º' }, { label: 'U llegada' }, { label: 'T. entre llegadas' }, { label: 'U servicio' }, { label: 'T. servicio' }],
      rows, { compact: true }
    );
    tabla.id = 'tbl-aleatorios';
    nodo.replaceWith(tabla);
    var pie = U.el('p', { class: 'table-footnote', html:
      'Las cinco primeras filas (resaltadas) coinciden exactamente con la tabla del documento: ' +
      '<strong>0,5046 → 3</strong>, <strong>0,6328 → 4</strong>, <strong>0,0757 → 1</strong>, ' +
      '<strong>0,5205 → 3</strong>, <strong>0,1587 → 2</strong> y servicios ' +
      '<strong>0,7127 → 3</strong>, <strong>0,5385 → 2</strong>, <strong>0,0006 → 1</strong>.'
    });
    tabla.appendChild(pie);
  }

  function mediasDeSemilla(semilla) {
    var ga = new RNG.CongruencialAditivo(semilla);
    var gs = new RNG.CongruencialAditivo(semilla + 1000);
    var tl = [], ts = [];
    for (var i = 0; i < 10; i++) {
      tl.push(RNG.inversa(ga.random(), RNG.CDF_LLEGADA));
      ts.push(RNG.inversa(gs.random(), RNG.CDF_SERVICIO));
    }
    return { llegadas: tl.reduce(function (a, b) { return a + b; }, 0) / 10, servicio: ts.reduce(function (a, b) { return a + b; }, 0) / 10 };
  }

  function renderSeedCompare() {
    var cont = document.getElementById('seed-compare');
    cont.innerHTML = '';
    ['101', '573'].forEach(function (s, i) {
      var m = mediasDeSemilla(Number(s));
      var doc = D.REFERENCIA.semillas[s];
      cont.appendChild(U.el('div', { class: 'seed-card' + (i ? ' orange' : '') }, [
        U.el('h4', { html: (i ? '🟠' : '🔵') + ' Semilla ' + s + ' <span class="badge ' + (i ? 'badge-orange' : 'badge-blue') + '" style="margin-left:auto">10 valores</span>' }),
        U.el('div', { class: 'seed-vals' }, [
          U.el('div', null, [U.el('strong', { text: U.num(m.llegadas, 1) }), U.el('span', { text: 'Media llegadas (min)' })]),
          U.el('div', null, [U.el('strong', { text: U.num(m.servicio, 1) }), U.el('span', { text: 'Media servicio (min)' })])
        ]),
        U.el('p', { class: 'table-footnote', html:
          'Documento: <strong>' + U.num(doc.llegadas, 1) + '</strong> y <strong>' +
          U.num(doc.servicio, 1) + '</strong> minutos → ' +
          (Math.abs(m.llegadas - doc.llegadas) < 0.05 && Math.abs(m.servicio - doc.servicio) < 0.05
            ? '<span class="match ok">coincide</span>' : '<span class="match no">difiere</span>')
        })
      ]));
    });
    document.getElementById('seed-conclusion').innerHTML =
      'Las secuencias completas son distintas (otra semilla ⇒ otros tiempos individuales), pero las ' +
      'medias de 10 valores quedan próximas: <strong>2,8 / 2,4</strong> frente a <strong>2,5 / 2,1</strong> ' +
      'minutos. Ése es el comportamiento que el documento describe como "estable": con suficientes ' +
      'réplicas, los indicadores generales se mantienen.';
  }

  /* ================================================================== *
   * Pruebas de uniformidad de la secuencia U                            *
   * ================================================================== */

  function renderUniformidad() {
    var stream = document.getElementById('uni-stream').value;
    var n = Number(document.getElementById('uni-n').value);
    var alfa = Number(document.getElementById('uni-alfa').value);
    var semilla = stream === 'llegada' ? 101 : 1101;
    var g = new RNG.CongruencialAditivo(semilla);
    var u = [];
    for (var i = 0; i < n; i++) u.push(g.random());

    var pm = RNG.pruebaMedia(u, alfa);
    var pv = RNG.pruebaVarianza(u, alfa);
    var pc = RNG.pruebaCorridas(u, alfa);

    function fila(nombre, estadistico, criterio, acepta) {
      return {
        c: [
          { v: nombre },
          { v: estadistico, cls: 'num' },
          { v: criterio, cls: 'num' },
          { html: acepta
            ? '<span class="match ok">No se rechaza</span>'
            : '<span class="match no">SE RECHAZA</span>' }
        ]
      };
    }

    var rows = [
      fila('Media', 'X̄ = ' + U.num(pm.media, 4),
        U.num(pm.li, 4) + ' ≤ X̄ ≤ ' + U.num(pm.ls, 4), pm.acepta),
      fila('Varianza', 'S² = ' + U.num(pv.varianza, 4),
        U.num(pv.li, 4) + ' ≤ S² ≤ ' + U.num(pv.ls, 4), pv.acepta),
      fila('Corridas arriba/abajo', 'C₀ = ' + pc.corridas + ', Z₀ = ' + U.num(pc.z0, 3),
        '|Z₀| < ' + U.num(pc.zcrit, 3), pc.acepta)
    ];

    var nodo = document.getElementById('tbl-uniformidad');
    var tabla = U.table(
      [{ label: 'Prueba' }, { label: 'Estadístico' }, { label: 'Criterio de aceptación (α = ' + U.num(alfa, 2) + ')' }, { label: 'Decisión' }],
      rows, { compact: true }
    );
    tabla.id = 'tbl-uniformidad';
    nodo.replaceWith(tabla);
    tabla.appendChild(U.el('p', { class: 'table-footnote', html:
      'Secuencia: <strong>' + (stream === 'llegada' ? 'llegadas, semilla 101' : 'servicios, semilla 1101') +
      '</strong> · n = ' + n + ' · generador congruencial aditivo. ' +
      'La uniformidad de la media y de la varianza y la independencia (corridas) son las tres ' +
      'condiciones que el algoritmo de la sección 5 exige a la secuencia pseudoaleatoria.'
    }));
  }

  /* ================================================================== *
   * Inicialización                                                      *
   * ================================================================== */

  function init() {
    renderTablaFrecuencias(RNG.FRECUENCIAS_LLEGADA, 'tbl-llegadas');
    renderTablaFrecuencias(RNG.FRECUENCIAS_SERVICIO, 'tbl-servicio');

    renderStats(RNG.FRECUENCIAS_LLEGADA, 'stats-llegadas');
    renderStats(RNG.FRECUENCIAS_SERVICIO, 'stats-servicio');

    renderFormula(RNG.FRECUENCIAS_LLEGADA, 'formula-llegadas', 'Interpretación: los clientes llegan en promedio cada 3,10 minutos; los intervalos más frecuentes son de 3 y 4 minutos (30 % cada uno).');
    renderFormula(RNG.FRECUENCIAS_SERVICIO, 'formula-servicio', 'Interpretación: el cajero tarda en promedio 2,30 minutos por cliente; el tiempo más frecuente es de 2 minutos (40 %).');

    chartFrecuencias('chart-llegadas', RNG.FRECUENCIAS_LLEGADA, 'rgba(30,107,255,.85)', '#1e6bff', 'Tiempos entre llegadas');
    chartFrecuencias('chart-servicio', RNG.FRECUENCIAS_SERVICIO, 'rgba(249,115,22,.85)', '#f97316', 'Tiempos de servicio');

    var c1 = renderChi('chi-llegadas', RNG.FRECUENCIAS_LLEGADA,
      'A · Prueba para tiempos entre llegadas',
      'Los tiempos entre llegadas siguen una distribución uniforme discreta.');
    chartObservados('chart-obs-llegadas', c1, 'Observada vs. esperada · tiempos entre llegadas');

    var c2 = renderChi('chi-servicio', RNG.FRECUENCIAS_SERVICIO,
      'B · Prueba para tiempos de servicio',
      'Los tiempos de servicio siguen una distribución uniforme discreta.');
    chartObservados('chart-obs-servicio', c2, 'Observada vs. esperada · tiempos de servicio');

    renderCdf('tbl-cdf-llegadas', RNG.FRECUENCIAS_LLEGADA);
    renderCdf('tbl-cdf-servicio', RNG.FRECUENCIAS_SERVICIO);

    bindU();
    renderU();
    renderAleatorios();
    renderSeedCompare();
    renderUniformidad();

    ['uni-stream', 'uni-n', 'uni-alfa'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', renderUniformidad);
    });

    /* Flujo "por qué empíricas" */
    var flujo = document.getElementById('flujo-empirica');
    var pasos = [
      { t: '50 observaciones', d: 'Datos reales de llegadas y servicios (valores enteros 1–5 min).', cls: '' },
      { t: 'Prueba χ²', d: 'Se contrasta con la uniforme discreta.', cls: '' },
      { t: 'H₀ rechazada', d: 'χ² = 10,00 > 9,488 y > 7,815.', cls: 'no' },
      { t: 'Empírica discreta', d: 'Se conservan las probabilidades observadas.', cls: 'ok' }
    ];
    pasos.forEach(function (p, i) {
      if (i) flujo.appendChild(U.el('div', { class: 'flujo-arrow', text: '→' }));
      flujo.appendChild(U.el('div', { class: 'flujo-step ' + p.cls }, [
        U.el('b', { text: p.t }),
        U.el('span', { text: p.d })
      ]));
    });
  }

  global.Module1 = { init: init };
})(window);
