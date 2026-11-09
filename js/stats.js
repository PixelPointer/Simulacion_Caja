/**
 * stats.js — Estadística matemática para el módulo de inferencia.
 *
 * Implementa sin dependencias externas:
 *   - Función log-gamma (Lanczos)
 *   - Gamma incompleta regularizada P(a, x)   -> chi-cuadrado
 *   - Beta incompleta regularizada Ix(a, b)   -> t de Student
 *   - Cuantiles: chi2inv, tinv, norminv
 *   - Estadísticos descriptivos e intervalo de confianza (t de Student)
 *
 * Verificación de referencia (scipy 1.18):
 *   chi2inv(0.95, 4) = 9.4877 | chi2inv(0.95, 3) = 7.8147
 *   tinv(0.975, 4)   = 2.7764 | tinv(0.975, 88) = 1.9873
 */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1. Función gamma y gamma incompleta (Numerical Recipes)             *
   * ------------------------------------------------------------------ */

  function gammaln(x) {
    const cof = [
      76.18009172947146, -86.50532032941677, 24.01409824083091,
      -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
    ];
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) ser += cof[j] / ++y;
    return -tmp + Math.log((2.5066282746310005 * ser) / x);
  }

  function gser(a, x) {
    let ap = a;
    let del = 1 / a;
    let sum = del;
    for (let n = 0; n < 1000; n++) {
      ap++;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-15) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - gammaln(a));
  }

  function gcf(a, x) {
    const FPMIN = 1e-300;
    let b = x + 1 - a;
    let c = 1 / FPMIN;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i < 1000; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = b + an / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return Math.exp(-x + a * Math.log(x) - gammaln(a)) * h;
  }

  /** P(a, x) = gamma incompleta regularizada inferior. */
  function gammaincP(a, x) {
    if (x <= 0) return 0;
    return x < a + 1 ? gser(a, x) : 1 - gcf(a, x);
  }

  /* ------------------------------------------------------------------ *
   * 2. Beta incompleta (para la t de Student)                           *
   * ------------------------------------------------------------------ */

  function betacf(a, b, x) {
    const MAXIT = 400;
    const EPS = 3e-16;
    const FPMIN = 1e-300;
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - (qab * x) / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= MAXIT; m++) {
      const m2 = 2 * m;
      let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      h *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }

  /** Ix(a, b) = beta incompleta regularizada. */
  function betaincI(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(
      gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x)
    );
    return x < (a + 1) / (a + b + 2)
      ? (bt * betacf(a, b, x)) / a
      : 1 - (bt * betacf(b, a, 1 - x)) / b;
  }

  /* ------------------------------------------------------------------ *
   * 3. Cuantiles                                                        *
   * ------------------------------------------------------------------ */

  /** Cuantil de la chi-cuadrado con k grados de libertad: P(X^2 <= x) = p. */
  function chi2inv(p, k) {
    if (p <= 0) return 0;
    if (p >= 1) return Infinity;
    let lo = 0;
    let hi = Math.max(50, k * 10);
    while (gammaincP(k / 2, hi / 2) < p) hi *= 2;
    for (let i = 0; i < 300; i++) {
      const mid = (lo + hi) / 2;
      if (gammaincP(k / 2, mid / 2) < p) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /** Cuantil de la t de Student: P(T <= t) = p. */
  function tinv(p, v) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    if (Math.abs(p - 0.5) < 1e-15) return 0;
    if (p < 0.5) return -tinv(1 - p, v);
    const target = 2 * (1 - p); // = I_{v/(v+t^2)}(v/2, 1/2)
    let lo = 0;
    let hi = 1;
    while (betaincI(v / (v + hi * hi), v / 2, 0.5) > target) hi *= 2;
    for (let i = 0; i < 300; i++) {
      const mid = (lo + hi) / 2;
      if (betaincI(v / (v + mid * mid), v / 2, 0.5) > target) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /** Aproximación de la normal estándar inversa (Acklam). */
  function norminv(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
      1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
    const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
      6.680131188771972e1, -1.328068155288572e1];
    const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
      -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
      3.754408661907416];
    const pl = 0.02425;
    let q, r;
    if (p < pl) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    if (p > 1 - pl) {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }

  /* ------------------------------------------------------------------ *
   * 4. Estadísticos descriptivos e inferencia                           *
   * ------------------------------------------------------------------ */

  function mean(xs) {
    if (!xs.length) return 0;
    let s = 0;
    for (const x of xs) s += x;
    return s / xs.length;
  }

  /** Varianza muestral (ddof = 1) y desviación estándar muestral. */
  function varianceSample(xs) {
    const n = xs.length;
    if (n < 2) return 0;
    const m = mean(xs);
    let s = 0;
    for (const x of xs) s += (x - m) * (x - m);
    return s / (n - 1);
  }

  function sdSample(xs) {
    return Math.sqrt(varianceSample(xs));
  }

  /**
   * Intervalo de confianza para la media (t de Student).
   * Devuelve exactamente las mismas magnitudes que el documento:
   * media, desviación estándar S, valor t, margen de error h,
   * límites del IC y error relativo Er = h / media.
   */
  function intervaloConfianza(medias, conf) {
    conf = conf === undefined ? 0.95 : conf;
    const n = medias.length;
    if (n < 2) {
      const m = mean(medias);
      return { n: n, media: m, s: 0, t: 0, h: 0, lo: m, hi: m, er: 0, conf: conf };
    }
    const m = mean(medias);
    const s = sdSample(medias);
    const t = tinv(1 - (1 - conf) / 2, n - 1);
    const h = (t * s) / Math.sqrt(n);
    return {
      n: n,
      media: m,
      s: s,
      t: t,
      h: h,
      lo: m - h,
      hi: m + h,
      er: m === 0 ? 0 : h / m,
      conf: conf
    };
  }

  /** n* = n · (Er / er_deseado)^2  (fórmula de estimación de réplicas). */
  function replicasNecesarias(n, er, erDeseado) {
    erDeseado = erDeseado === undefined ? 0.1 : erDeseado;
    if (er <= erDeseado) return n;
    return Math.ceil(n * Math.pow(er / erDeseado, 2));
  }

  global.Stats = {
    gammaln: gammaln,
    gammaincP: gammaincP,
    betaincI: betaincI,
    chi2inv: chi2inv,
    tinv: tinv,
    norminv: norminv,
    mean: mean,
    varianceSample: varianceSample,
    sdSample: sdSample,
    intervaloConfianza: intervaloConfianza,
    replicasNecesarias: replicasNecesarias
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = global.Stats;
})(typeof window !== 'undefined' ? window : globalThis);
