/**
 * ui.js — utilidades compartidas entre módulos (DOM, formato y gráficos).
 */
(function (global) {
  'use strict';

  /* ---------------- DOM ---------------- */

  /**
   * Crea un elemento con atributos e hijos.
   *   UI.el('div', {class:'card'}, [UI.el('h3', {}, 'Hola')])
   */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style') node.setAttribute('style', v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      });
    }
    append(node, children);
    return node;
  }

  function append(node, children) {
    if (children === null || children === undefined) return;
    if (Array.isArray(children)) {
      children.forEach(function (c) { append(node, c); });
      return;
    }
    if (children instanceof Node) { node.appendChild(children); return; }
    node.appendChild(document.createTextNode(String(children)));
  }

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function refreshIcons(root) {
    if (!global.lucide) return;
    /* Lucide conserva el atributo data-lucide en el SVG generado, así que sólo
       se invoca cuando existe algún <i> todavía sin convertir (evita rehacer
       todos los iconos del documento en cada render). */
    if (!document.querySelector('i[data-lucide]')) return;
    global.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
  }

  /* ---------------- Formato (español) ---------------- */

  function num(x, dec) {
    if (x === null || x === undefined || isNaN(x)) return '—';
    dec = dec === undefined ? 2 : dec;
    return Number(x).toFixed(dec).replace('.', ',');
  }

  function int(x) {
    if (x === null || x === undefined || isNaN(x)) return '—';
    return Number(Math.round(x)).toLocaleString('es-BO');
  }

  function pct(x, dec) {
    if (x === null || x === undefined || isNaN(x)) return '—';
    return num(x * 100, dec === undefined ? 2 : dec) + ' %';
  }

  /* ---------------- Tablas ---------------- */

  /**
   * Construye una tabla.
   *   headers: [{label, cls}] o [string]
   *   rows: array de arrays (celdas string/Node) o array de {c:[...], cls}
   */
  function table(headers, rows, opts) {
    opts = opts || {};
    var thead = el('thead', null, [
      el('tr', null, headers.map(function (h) {
        var o = typeof h === 'string' ? { label: h } : h;
        return el('th', { class: o.cls || null }, o.label);
      }))
    ]);
    var tbody = el('tbody', null, rows.map(function (r) {
      var cells = r && r.c ? r.c : r;
      var cls = r && r.cls ? r.cls : null;
      return el('tr', { class: cls }, cells.map(function (c) {
        var o = typeof c === 'object' && c !== null && !(c instanceof Node) ? c : { v: c };
        return el('td', { class: o.cls || null, html: o.html !== undefined ? o.html : null },
          o.html !== undefined ? null : (c instanceof Node ? c : String(o.v)));
      }));
    }));
    var t = el('table', { class: 'table ' + (opts.compact ? 'table-compact' : '') }, [thead, tbody]);
    return el('div', { class: 'tabla-wrap ' + (opts.wrapClass || '') }, [t]);
  }

  /* ---------------- Gráficos ---------------- */

  var chartInstances = {};

  function initChartDefaults() {
    if (!global.Chart) return;
    global.Chart.defaults.font.family =
      "'Inter','Segoe UI',Roboto,system-ui,sans-serif";
    global.Chart.defaults.font.size = 12;
    global.Chart.defaults.color = '#5b6b83';
    global.Chart.defaults.plugins.legend.labels.usePointStyle = true;
    global.Chart.defaults.plugins.legend.labels.boxWidth = 8;
    global.Chart.defaults.plugins.legend.labels.padding = 14;
    global.Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(11,31,58,.95)';
    global.Chart.defaults.plugins.tooltip.padding = 10;
    global.Chart.defaults.plugins.tooltip.cornerRadius = 8;
    global.Chart.defaults.plugins.tooltip.titleFont = { weight: '700' };
    global.Chart.defaults.animation.duration = 700;
    global.Chart.defaults.animation.easing = 'easeOutQuart';
  }

  /** Crea o reemplaza un gráfico por id de canvas. */
  function chart(canvasId, config) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !global.Chart) return null;
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
    config.options = config.options || {};
    config.options.responsive = true;
    config.options.maintainAspectRatio = false;
    var inst = new global.Chart(canvas.getContext('2d'), config);
    chartInstances[canvasId] = inst;
    return inst;
  }

  function destroyChart(id) {
    if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
  }

  /* ---------------- Extras ---------------- */

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms || 120);
    };
  }

  function iconSpan(name, cls) {
    return '<i data-lucide="' + name + '"' + (cls ? ' class="' + cls + '"' : '') + '></i>';
  }

  global.UI = {
    el: el, qs: qs, qsa: qsa, refreshIcons: refreshIcons,
    num: num, int: int, pct: pct,
    table: table, chart: chart, destroyChart: destroyChart,
    initChartDefaults: initChartDefaults, debounce: debounce, iconSpan: iconSpan
  };
})(window);
