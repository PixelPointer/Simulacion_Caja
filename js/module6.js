/**
 * module6.js — Módulo 6: visor del código fuente Python del documento.
 *
 * Incluye resaltado de sintaxis propio (sin dependencias), numeración de
 * líneas, pestañas por archivo y botón de copia al portapapeles.
 */
(function (global) {
  'use strict';

  var D = global.Datos;
  var U = global.UI;

  /* ================================================================== *
   * Resaltado de sintaxis Python (sin dependencias externas)            *
   * ================================================================== */

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var RE_FILA = new RegExp([
    '(#[^\\n]*)',                                                    // 1 comentario
    '("""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')', // 2 cadena
    '\\b(\\d+(?:\\.\\d+)?)\\b',                                      // 3 número
    '\\b(def|class|import|from|return|if|elif|else|while|for|in|not|and|or|None|True|False|' +
      'assert|with|as|lambda|break|continue|pass|try|except|finally|global|nonlocal|print|range)\\b', // 4 palabra clave
    '\\b(self)\\b',                                                  // 5 self
    '([A-Za-z_]\\w*)(?=\\s*\\()'                                     // 6 llamada / nombre definido
  ].join('|'), 'g');

  function resaltarLinea(linea) {
    var out = '';
    var ultimo = 0;
    var m;
    RE_FILA.lastIndex = 0;
    while ((m = RE_FILA.exec(linea)) !== null) {
      out += esc(linea.slice(ultimo, m.index));
      if (m[1]) out += '<span class="tk-com">' + esc(m[1]) + '</span>';
      else if (m[2]) out += '<span class="tk-str">' + esc(m[2]) + '</span>';
      else if (m[3]) out += '<span class="tk-num">' + esc(m[3]) + '</span>';
      else if (m[4]) out += '<span class="tk-kw">' + esc(m[4]) + '</span>';
      else if (m[5]) out += '<span class="tk-self">' + esc(m[5]) + '</span>';
      else if (m[6]) out += '<span class="tk-def">' + esc(m[6]) + '</span>';
      ultimo = RE_FILA.lastIndex;
      if (m[0] === '') RE_FILA.lastIndex++;
    }
    out += esc(linea.slice(ultimo));
    return out;
  }

  /** Resalta manteniendo el estado de los docstrings multilínea. */
  function resaltar(src) {
    var lineas = src.split('\n');
    var enDoc = false;
    return lineas.map(function (linea) {
      if (enDoc) {
        if (linea.indexOf('"""') !== -1) enDoc = false;
        return '<span class="ln"><span class="tk-str">' + esc(linea) + '</span></span>';
      }
      var i = linea.indexOf('"""');
      if (i !== -1 && linea.indexOf('"""', i + 3) === -1) {
        enDoc = true;
        return '<span class="ln">' + esc(linea.slice(0, i)) +
          '<span class="tk-str">' + esc(linea.slice(i)) + '</span></span>';
      }
      return '<span class="ln">' + resaltarLinea(linea) + '</span>';
    }).join('');
  }

  /* ================================================================== *
   * Copiar al portapapeles                                             *
   * ================================================================== */

  function copiar(texto, boton) {
    function listo() {
      var original = boton.innerHTML;
      boton.innerHTML = '<i data-lucide="check"></i> Copiado';
      boton.classList.add('copiado');
      U.refreshIcons(boton);
      setTimeout(function () {
        boton.innerHTML = original;
        boton.classList.remove('copiado');
        U.refreshIcons(boton);
      }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(listo, function () { fallback(texto, listo); });
    } else {
      fallback(texto, listo);
    }
  }

  function fallback(texto, listo) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); listo(); } catch (e) { /* sin portapapeles */ }
    document.body.removeChild(ta);
  }

  /* ================================================================== *
   * Construcción del visor                                              *
   * ================================================================== */

  function panel(codigo, i) {
    var explica = U.el('div', { class: 'code-explica' }, codigo.explicacion.map(function (p) {
      return U.el('div', { html: p });
    }));

    var boton = U.el('button', {
      class: 'btn btn-outline btn-icon', type: 'button',
      'data-tip': 'Copiar todo el código', html: U.iconSpan('copy') + '<span class="btn-label">Copiar</span>'
    });
    boton.addEventListener('click', function () { copiar(codigo.codigo, boton); });

    var pre = U.el('pre', { class: 'code' }, [
      U.el('code', { html: resaltar(codigo.codigo) })
    ]);

    var cuerpo = U.el('div', { class: 'code-body' }, [
      U.el('p', { class: 'code-desc', text: codigo.descripcion }),
      explica,
      U.el('div', { class: 'code-toolbar' }, [
        U.el('span', { html: '<strong>' + codigo.nombre + '</strong> · ' +
          codigo.codigo.split('\n').length + ' líneas' }),
        boton
      ]),
      pre
    ]);

    var tarjeta = U.el('article', { class: 'code-card', 'data-panel': String(i) }, [
      U.el('header', { class: 'code-head' }, [
        U.el('span', { class: 'ico', html: U.iconSpan(codigo.icono) }),
        U.el('h3', { text: codigo.nombre }),
        U.el('span', { class: 'etiqueta', text: codigo.etiqueta })
      ]),
      cuerpo
    ]);

    return tarjeta;
  }

  function init() {
    var cont = document.getElementById('codigo-container');
    cont.innerHTML = '';

    var tabs = U.el('div', { class: 'code-tabs', role: 'tablist' });
    var paneles = U.el('div', { class: 'code-panels' });

    D.CODIGOS.forEach(function (c, i) {
      var tab = U.el('button', {
        class: 'code-tab' + (i === 0 ? ' active' : ''), type: 'button', role: 'tab',
        'aria-selected': i === 0 ? 'true' : 'false', 'data-tab': String(i)
      }, [
        U.el('span', { class: 'tab-ico', html: U.iconSpan(c.icono) }),
        U.el('span', { class: 'tab-txt' }, [
          U.el('strong', { text: c.nombre }),
          U.el('small', { text: c.etiqueta })
        ])
      ]);
      tab.addEventListener('click', function () { mostrar(i); });
      tabs.appendChild(tab);

      var p = panel(c, i);
      if (i !== 0) p.hidden = true;
      paneles.appendChild(p);
    });

    function mostrar(i) {
      U.qsa('.code-tab', tabs).forEach(function (t, j) {
        t.classList.toggle('active', j === i);
        t.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
      U.qsa('.code-card', paneles).forEach(function (p, j) {
        p.hidden = j !== i;
      });
    }

    cont.appendChild(tabs);
    cont.appendChild(paneles);
    U.refreshIcons(cont);
  }

  global.Module6 = { init: init };
})(window);
