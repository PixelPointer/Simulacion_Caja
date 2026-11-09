/**
 * rng.js — Generador congruencial aditivo + transformada inversa.
 *
 * Réplica exacta, en JavaScript, del generador descrito en el documento
 * (sección 5: "Código de algoritmo para generar números aleatorios"):
 *
 *     x_{n} = ( x_{n-j} + x_{n-k} ) mod m      j = 24, k = 55, m = 2^31
 *     semilla inicial: LCG  x <- (1103515245·x + 12345) mod 2^31 (55 veces)
 *
 * Verificado contra el documento (semilla 101):
 *   U llegada  : 0.5046, 0.6328, 0.0757, 0.5205, 0.1587   -> 3, 4, 1, 3, 2
 *   U servicio : 0.7127, 0.5385, 0.0006, 0.7961, 0.4502   -> 3, 2, 1, 3, 2
 *   medias (10 valores): 2.8 (llegadas) y 2.4 (servicio)  -> iguales al PDF
 *   semilla 573: 2.5 (llegadas) y 2.1 (servicio)          -> iguales al PDF
 */
(function (global) {
  'use strict';

  var M = 2147483648; // 2^31

  /* ------------------------------------------------------------------ *
   * 1. Generador congruencial aditivo                                   *
   * ------------------------------------------------------------------ */

  function CongruencialAditivo(semilla, j, k, m) {
    this.j = j === undefined ? 24 : j;
    this.k = k === undefined ? 55 : k;
    this.m = m === undefined ? M : m;
    this.hist = [];
    // Semilla inicial con LCG: 1103515245·x + 12345 (mod 2^31).
    // Se usa BigInt porque el producto supera la precisión exacta de 2^53.
    var x = BigInt(semilla);
    var A = 1103515245n;
    var B = 12345n;
    var MB = 2147483648n;
    for (var i = 0; i < this.k; i++) {
      x = (A * x + B) % MB;
      this.hist.push(Number(x));
    }
  }

  /** Siguiente entero del generador aditivo. */
  CongruencialAditivo.prototype.siguiente = function () {
    var a = this.hist[this.hist.length - this.j];
    var b = this.hist[this.hist.length - this.k];
    var x = (a + b) % this.m;
    this.hist.push(x);
    this.hist.shift();
    return x;
  };

  /** Siguiente número uniforme U ~ U(0, 1). */
  CongruencialAditivo.prototype.random = function () {
    return this.siguiente() / this.m;
  };

  /* ------------------------------------------------------------------ *
   * 2. Distribuciones empíricas del documento                           *
   * ------------------------------------------------------------------ */

  // Frecuencias absolutas observadas (50 observaciones por variable)
  var FRECUENCIAS_LLEGADA = { 1: 5, 2: 10, 3: 15, 4: 15, 5: 5 };
  var FRECUENCIAS_SERVICIO = { 1: 10, 2: 20, 3: 15, 4: 5 };

  function construirCdf(dist) {
    var total = 0;
    Object.keys(dist).forEach(function (k) { total += dist[k]; });
    var valores = [];
    var acum = [];
    var s = 0;
    Object.keys(dist)
      .map(Number)
      .sort(function (a, b) { return a - b; })
      .forEach(function (v) {
        s += dist[v] / total;
        valores.push(v);
        acum.push(Math.round(s * 1e10) / 1e10);
      });
    return { valores: valores, acum: acum };
  }

  var CDF_LLEGADA = construirCdf(FRECUENCIAS_LLEGADA);
  var CDF_SERVICIO = construirCdf(FRECUENCIAS_SERVICIO);

  /**
   * Transformada inversa discreta.
   * Convención del código del documento: primer valor x tal que U <= F(x).
   */
  function inversa(u, cdf) {
    var v = cdf.valores;
    var f = cdf.acum;
    for (var i = 0; i < v.length; i++) {
      if (u <= f[i] + 1e-12) return v[i];
    }
    return v[v.length - 1];
  }

  /** Índice del intervalo [F(x_{i-1}), F(x_i)] que contiene a U. */
  function intervaloDe(u, cdf) {
    for (var i = 0; i < cdf.acum.length; i++) {
      if (u <= cdf.acum[i] + 1e-12) return i;
    }
    return cdf.acum.length - 1;
  }

  /* ------------------------------------------------------------------ *
   * 3. Tablas de frecuencia / estadísticos descriptivos                 *
   * ------------------------------------------------------------------ */

  /** Devuelve filas con frecuencia absoluta, relativa y acumulada. */
  function tablaFrecuencias(dist) {
    var total = 0;
    Object.keys(dist).forEach(function (k) { total += dist[k]; });
    var acum = 0;
    return Object.keys(dist)
      .map(Number)
      .sort(function (a, b) { return a - b; })
      .map(function (x) {
        var f = dist[x];
        acum += f;
        return {
          valor: x,
          frecuencia: f,
          relativa: f / total,
          acumulada: acum / total,
          total: total
        };
      });
  }

  /** Media, varianza y desviación estándar de una distribución empírica. */
  function estadisticosEmpiricos(dist) {
    var filas = tablaFrecuencias(dist);
    var n = 0;
    var suma = 0;
    filas.forEach(function (r) { n += r.frecuencia; suma += r.valor * r.frecuencia; });
    var media = suma / n;
    var varianza = 0;
    filas.forEach(function (r) {
      varianza += r.frecuencia * Math.pow(r.valor - media, 2);
    });
    varianza /= n;
    return {
      n: n,
      suma: suma,
      media: media,
      varianza: varianza,
      desviacion: Math.sqrt(varianza)
    };
  }

  /* ------------------------------------------------------------------ *
   * 4. Pruebas de uniformidad de los números U (sección 5 del PDF)      *
   * ------------------------------------------------------------------ */

  function pruebaMedia(u, alfa) {
    alfa = alfa === undefined ? 0.05 : alfa;
    var n = u.length;
    var xbar = u.reduce(function (a, b) { return a + b; }, 0) / n;
    var zc = global.Stats.norminv(1 - alfa / 2);
    var li = 0.5 - zc / Math.sqrt(12 * n);
    var ls = 0.5 + zc / Math.sqrt(12 * n);
    var z0 = ((xbar - 0.5) * Math.sqrt(n)) / Math.sqrt(1 / 12);
    return { n: n, media: xbar, z0: z0, zcrit: zc, li: li, ls: ls, acepta: li <= xbar && xbar <= ls };
  }

  function pruebaVarianza(u, alfa) {
    alfa = alfa === undefined ? 0.05 : alfa;
    var n = u.length;
    var xbar = u.reduce(function (a, b) { return a + b; }, 0) / n;
    var s2 = u.reduce(function (a, x) { return a + Math.pow(x - xbar, 2); }, 0) / (n - 1);
    var li = global.Stats.chi2inv(alfa / 2, n - 1) / (12 * (n - 1));
    var ls = global.Stats.chi2inv(1 - alfa / 2, n - 1) / (12 * (n - 1));
    return { n: n, varianza: s2, li: li, ls: ls, acepta: li <= s2 && s2 <= ls };
  }

  function pruebaCorridas(u, alfa) {
    alfa = alfa === undefined ? 0.05 : alfa;
    var n = u.length;
    var s = [];
    for (var i = 0; i < n - 1; i++) s.push(u[i + 1] > u[i] ? 1 : 0);
    var c0 = 1;
    for (var j = 1; j < s.length; j++) if (s[j] !== s[j - 1]) c0++;
    var mu = (2 * n - 1) / 3;
    var v = (16 * n - 29) / 90;
    var z0 = (c0 - mu) / Math.sqrt(v);
    var zc = global.Stats.norminv(1 - alfa / 2);
    return { n: n, corridas: c0, mu: mu, varianza: v, z0: z0, zcrit: zc, acepta: Math.abs(z0) < zc };
  }

  /* ------------------------------------------------------------------ *
   * 5. API pública                                                      *
   * ------------------------------------------------------------------ */

  global.RNG = {
    CongruencialAditivo: CongruencialAditivo,
    FRECUENCIAS_LLEGADA: FRECUENCIAS_LLEGADA,
    FRECUENCIAS_SERVICIO: FRECUENCIAS_SERVICIO,
    CDF_LLEGADA: CDF_LLEGADA,
    CDF_SERVICIO: CDF_SERVICIO,
    construirCdf: construirCdf,
    inversa: inversa,
    intervaloDe: intervaloDe,
    tablaFrecuencias: tablaFrecuencias,
    estadisticosEmpiricos: estadisticosEmpiricos,
    pruebaMedia: pruebaMedia,
    pruebaVarianza: pruebaVarianza,
    pruebaCorridas: pruebaCorridas
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = global.RNG;
})(typeof window !== 'undefined' ? window : globalThis);
