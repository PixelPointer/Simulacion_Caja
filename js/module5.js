/**
 * module5.js — Módulo 5: conclusiones finales y evaluación de la conveniencia.
 */
(function (global) {
  'use strict';

  var D = global.Datos;
  var U = global.UI;

  function general() {
    var cont = document.getElementById('conclusion-general');
    var g = D.CONCLUSION_GENERAL;
    cont.innerHTML = '';
    cont.appendChild(U.el('article', { class: 'conclusion-general reveal' }, [
      U.el('h3', { html: U.iconSpan('badge-check') + ' ' + g.titulo }),
      U.el('p', { text: g.texto }),
      U.el('div', { class: 'conclusion-regla', html:
        '<i data-lucide="scale" style="width:18px;height:18px;vertical-align:-3px;margin-right:8px"></i>' +
        g.regla
      })
    ]));
  }

  function tarjetas() {
    var cont = document.getElementById('conclusiones-container');
    cont.innerHTML = '';

    D.CONCLUSIONES.forEach(function (c, i) {
      var cuerpo = [
        U.el('span', { class: 'concl-ico', html: U.iconSpan(c.icono) }),
        U.el('h4', { text: (i + 1) + '. ' + c.titulo }),
        U.el('p', { text: c.texto })
      ];

      if (c.cifras) {
        cuerpo.push(U.el('div', { class: 'cifras' }, c.cifras.map(function (x) {
          return U.el('div', { class: 'cifra' }, [
            U.el('strong', { text: x.valor }),
            U.el('span', { text: x.etiqueta })
          ]);
        })));
      }

      cont.appendChild(U.el('article', {
        class: 'concl-card reveal' + (c.destacado ? ' destacado' : '')
      }, cuerpo));
    });
  }

  function evaluacion() {
    var cont = document.getElementById('evaluacion');
    cont.innerHTML = '';

    var ref = D.REFERENCIA.global;
    var items = [
      {
        ico: 'clock',
        titulo: 'La espera es baja, pero no cero',
        txt: 'Con 89 réplicas el tiempo medio de espera es de ' + ref.media.toFixed(4).replace('.', ',') +
          ' minutos (≈ 36 segundos) con IC95 % = [' + ref.lo.toFixed(4).replace('.', ',') + '; ' +
          ref.hi.toFixed(4).replace('.', ',') + '] minutos. Es una espera reducida, pero el modelo ' +
          'muestra que sí existen clientes que esperan cuando la caja está ocupada.'
      },
      {
        ico: 'alarm-clock',
        titulo: 'Hay que mirar también el peor caso',
        txt: 'La media resume el comportamiento típico y oculta los picos: en las réplicas iniciales ' +
          'la espera máxima va de 3 a 5 minutos. Presentar sólo el promedio a la gerencia sería ' +
          'incompleto; hay que comunicar la media, la desviación, el intervalo y los máximos.'
      },
      {
        ico: 'calculator',
        titulo: 'La decisión requiere datos fuera del modelo',
        txt: 'El modelo sólo contiene variables de tiempo (llegada, servicio, espera). Salario del ' +
          'cajero, electricidad, mantenimiento, satisfacción y fidelización de clientes no están ' +
          'incluidos: la simulación es un insumo para la decisión, no la decisión misma.'
      }
    ];

    items.forEach(function (it) {
      cont.appendChild(U.el('article', { class: 'eval-card reveal' }, [
        U.el('h4', { html: U.iconSpan(it.ico) + ' ' + it.titulo }),
        U.el('p', { text: it.txt })
      ]));
    });
  }

  function init() {
    general();
    tarjetas();
    evaluacion();
    U.refreshIcons(document.getElementById('conclusiones'));
  }

  global.Module5 = { init: init };
})(window);
