/**
 * module4.js — Módulo 4: preguntas y análisis crítico del documento.
 *
 * Renderiza las 13 preguntas (5 técnicas, 5 de pensamiento crítico y 3 del
 * escenario) con la respuesta transcrita del PDF, un complemento explicativo
 * y los datos estadísticos relacionados.
 */
(function (global) {
  'use strict';

  var D = global.Datos;
  var U = global.UI;

  /* ================================================================== *
   * Tablas embebidas en las respuestas                                  *
   * ================================================================== */

  function tablaAleatorios() {
    var nodo = document.getElementById('tbl-aleatorios-q');
    if (!nodo) return;
    var filas = D.REFERENCIA.primerosAleatorios.map(function (r) {
      return {
        c: [
          { v: r.n, cls: 'num' },
          { v: U.num(r.uLlegada, 4), cls: 'num' },
          { v: r.tLlegada + ' min', cls: 'num' },
          { v: U.num(r.uServicio, 4), cls: 'num' },
          { v: r.tServicio + ' min', cls: 'num' }
        ]
      };
    });
    var tabla = U.table(
      [{ label: 'N.º' }, { label: 'U llegada' }, { label: 'T. entre llegadas' }, { label: 'U servicio' }, { label: 'T. servicio' }],
      filas, { compact: true }
    );
    tabla.id = 'tbl-aleatorios-q';
    nodo.replaceWith(tabla);
  }

  function tablaReconstruccion() {
    var nodo = document.getElementById('tbl-reconstruccion-q');
    if (!nodo) return;
    var filas = D.REFERENCIA.reconstruccion.map(function (r) {
      return {
        c: [
          { v: r.cli, cls: 'num' },
          { v: r.llegada, cls: 'num' },
          { v: r.inicio, cls: 'num' },
          { v: r.fin, cls: 'num' },
          { v: r.espera + ' min', cls: 'num' }
        ]
      };
    });
    var tabla = U.table(
      [{ label: 'Cliente' }, { label: 'Hora de llegada' }, { label: 'Inicio de servicio' }, { label: 'Finalización' }, { label: 'Tiempo de espera' }],
      filas, { compact: true }
    );
    tabla.id = 'tbl-reconstruccion-q';
    nodo.replaceWith(tabla);
  }

  /* ================================================================== *
   * Tarjeta de pregunta                                                 *
   * ================================================================== */

  function tarjeta(item, indice, prefijo) {
    var id = prefijo + '-' + indice;

    var head = U.el('button', {
      class: 'qa-head', type: 'button', 'aria-expanded': 'false', 'aria-controls': id
    }, [
      U.el('span', { class: 'qa-num', text: String(indice + 1) }),
      U.el('span', { class: 'qa-text', text: item.enunciado }),
      U.el('i', { class: 'qa-chevron', 'data-lucide': 'chevron-down' })
    ]);

    var body = U.el('div', { class: 'qa-body', id: id }, [
      U.el('h5', { text: 'Respuesta (según el documento)' }),
      U.el('div', { class: 'qa-respuesta', html: item.respuesta }),
      U.el('h5', { text: 'Complemento explicativo' }),
      U.el('div', { class: 'qa-complemento', html: item.complemento }),
      U.el('h5', { text: 'Datos estadísticos relacionados' }),
      U.el('div', { class: 'qa-datos' }, item.datos.map(function (d, i) {
        return U.el('span', { class: 'chip' + (i % 2 ? ' chip-orange' : ''), text: d });
      }))
    ]);

    head.addEventListener('click', function () {
      var abierto = card.classList.toggle('open');
      head.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });

    var card = U.el('article', { class: 'qa' }, [head, body]);
    return card;
  }

  /* ================================================================== *
   * Categoría                                                           *
   * ================================================================== */

  function categoria(clave, datos, prefijo) {
    var cont = U.el('div', { class: 'categoria' });

    cont.appendChild(U.el('header', { class: 'categoria-head reveal' }, [
      U.el('span', { class: 'ico', html: U.iconSpan(datos.icono) }),
      U.el('div', { style: 'flex:1' }, [
        U.el('h3', { text: datos.titulo }),
        U.el('p', { text: datos.intro })
      ]),
      U.el('span', { class: 'count', text: datos.items.length + ' preguntas' })
    ]));

    datos.items.forEach(function (item, i) {
      cont.appendChild(tarjeta(item, i, prefijo));
    });

    return cont;
  }

  /* ================================================================== *
   * Inicialización                                                       *
   * ================================================================== */

  function init() {
    var cont = document.getElementById('preguntas-container');
    cont.innerHTML = '';

    var orden = [
      ['tecnicas', 'tec'],
      ['criticas', 'cri'],
      ['escenario', 'esc']
    ];

    orden.forEach(function (par) {
      cont.appendChild(categoria(par[0], D.PREGUNTAS[par[0]], par[1]));
    });

    tablaAleatorios();
    tablaReconstruccion();

    document.getElementById('btn-expand-all').addEventListener('click', function () {
      U.qsa('#preguntas-container .qa').forEach(function (c) {
        c.classList.add('open');
        c.querySelector('.qa-head').setAttribute('aria-expanded', 'true');
      });
    });

    document.getElementById('btn-collapse-all').addEventListener('click', function () {
      U.qsa('#preguntas-container .qa').forEach(function (c) {
        c.classList.remove('open');
        c.querySelector('.qa-head').setAttribute('aria-expanded', 'false');
      });
    });

    /* Abre por defecto la primera pregunta técnica */
    var primera = document.querySelector('#preguntas-container .qa');
    if (primera) {
      primera.classList.add('open');
      primera.querySelector('.qa-head').setAttribute('aria-expanded', 'true');
    }

    U.refreshIcons(cont);
  }

  global.Module4 = { init: init };
})(window);
