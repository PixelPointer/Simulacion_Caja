/**
 * engine.js — Motor de simulación por eventos discretos (escenario 3).
 *
 * Modelo: 1 servidor (caja), cola FIFO ilimitada, 100 clientes por réplica,
 * tiempo en minutos, eventos LLEGADA y FIN de servicio.
 *
 * Generación de tiempos: distribuciones empíricas discretas del documento
 * mediante transformada inversa sobre dos flujos independientes del
 * generador congruencial aditivo (semilla y semilla + 1000), igual que en
 * el modelo en Python del trabajo.
 *
 * Invariantes verificadas en cada réplica (mismos assert que el PDF):
 *   - se procesan exactamente N clientes
 *   - el orden de inicio de atención es creciente  (FIFO)
 *   - nunca hay dos clientes en el servidor a la vez
 *   - todos los tiempos de espera son >= 0
 */
(function (global) {
  'use strict';

  var RNG = global.RNG;

  /* ------------------------------------------------------------------ *
   * Utilidades                                                          *
   * ------------------------------------------------------------------ */

  function nuevoCliente(RGAs, RGB, id) {
    var ua = RGAs.random();
    var us = RGB.random();
    return {
      id: id,
      ua: ua,
      us: us,
      tEntre: RNG.inversa(ua, RNG.CDF_LLEGADA),
      tServ: RNG.inversa(us, RNG.CDF_SERVICIO),
      llegada: 0,
      inicio: null,
      fin: null,
      espera: null
    };
  }

  /** Extrae el evento de menor tiempo (mismo desempate que el heap de Python: t, tipo, id). */
  function extraerMinimo(eventos) {
    var idx = 0;
    for (var i = 1; i < eventos.length; i++) {
      var a = eventos[i];
      var b = eventos[idx];
      if (a.t < b.t || (a.t === b.t && (a.tipo < b.tipo || (a.tipo === b.tipo && a.id < b.id)))) {
        idx = i;
      }
    }
    var min = eventos[idx];
    eventos.splice(idx, 1);
    return min;
  }

  /* ------------------------------------------------------------------ *
   * Simulador paso a paso (se usa en el módulo del simulador)           *
   * ------------------------------------------------------------------ */

  function Simulator(seed, nClientes) {
    this.seed = seed;
    this.nClientes = nClientes || 100;
    this.reset();
  }

  Simulator.prototype.reset = function () {
    this.ga = new RNG.CongruencialAditivo(this.seed);
    this.gs = new RNG.CongruencialAditivo(this.seed + 1000);
    this.clientes = [];
    this.eventos = [];
    this.cola = [];            // FIFO: push al final, shift al frente
    this.servidor = null;      // id del cliente en atención o null
    this.reloj = 0;
    this.generados = 0;
    this.llegados = 0;
    this.atendidos = [];       // ids en orden de salida
    this.ordenServicio = [];   // ids en orden de inicio de atención
    this.finalizado = false;
    this.pasos = 0;

    // Primera llegada: reloj 0 + primer tiempo entre llegadas
    var c1 = nuevoCliente(this.ga, this.gs, 1);
    c1.llegada = c1.tEntre;
    this.clientes.push(c1);
    this.eventos.push({ t: c1.llegada, tipo: 0, id: c1.id, cli: c1 });
    this.generados = 1;
  };

  Simulator.prototype.siguienteCliente = function () {
    if (this.generados >= this.nClientes) return null;
    this.generados++;
    var c = nuevoCliente(this.ga, this.gs, this.generados);
    this.clientes.push(c);
    return c;
  };

  Simulator.prototype.iniciarServicio = function (cli, t, desdeCola) {
    this.servidor = cli.id;
    cli.inicio = t;
    cli.espera = cli.inicio - cli.llegada;
    this.ordenServicio.push(cli.id);
    this.eventos.push({ t: t + cli.tServ, tipo: 1, id: cli.id, cli: cli });
    return { id: cli.id, desdeCola: !!desdeCola, espera: cli.espera };
  };

  /**
   * Procesa el evento más próximo.
   * Devuelve un descriptor para la bitácora o null si la réplica terminó.
   */
  Simulator.prototype.step = function () {
    if (!this.eventos.length) {
      this.finalizado = true;
      return null;
    }
    var ev = extraerMinimo(this.eventos);
    var t = ev.t;
    var cli = ev.cli;
    this.reloj = t;
    this.pasos++;
    var descriptor = {
      num: this.pasos,
      t: t,
      tipo: ev.tipo === 0 ? 'LLEGADA' : 'FIN',
      cliente: cli,
      inicio: null,
      enCola: 0,
      mensaje: ''
    };

    if (ev.tipo === 0) {
      /* ---------------- LLEGADA ---------------- */
      this.llegados++;
      var sig = this.siguienteCliente();
      if (sig) {
        sig.llegada = t + sig.tEntre;
        this.eventos.push({ t: sig.llegada, tipo: 0, id: sig.id, cli: sig });
      }
      if (this.servidor === null) {
        descriptor.inicio = this.iniciarServicio(cli, t, false);
        descriptor.mensaje =
          'Cliente #' + cli.id + ' llega en t = ' + fmt(t) + ' min y pasa ' +
          'directamente a atención (espera ' + fmt(descriptor.inicio.espera) + ' min).';
      } else {
        this.cola.push(cli);
        descriptor.mensaje =
          'Cliente #' + cli.id + ' llega en t = ' + fmt(t) + ' min. La caja está ' +
          'ocupada → ingresa al final de la cola FIFO.';
      }
    } else {
      /* ---------------- FIN DE SERVICIO ---------------- */
      cli.fin = t;
      cli.espera = cli.inicio - cli.llegada;
      this.atendidos.push(cli.id);
      this.servidor = null;
      descriptor.mensaje =
        'Cliente #' + cli.id + ' finaliza en t = ' + fmt(t) + ' min y sale del ' +
        'sistema (espera ' + fmt(cli.espera) + ' min).';
      if (this.cola.length) {
        var siguiente = this.cola.shift();
        descriptor.inicio = this.iniciarServicio(siguiente, t, true);
        descriptor.mensaje +=
          ' Caja libre → cliente #' + siguiente.id + ' inicia atención ' +
          '(espera ' + fmt(descriptor.inicio.espera) + ' min).';
      }
    }

    descriptor.enCola = this.cola.length;
    if (!this.eventos.length) this.finalizado = true;
    return descriptor;
  };

  /* ---------------- Indicadores en vivo ---------------- */

  Simulator.prototype.clientesAtendidos = function () {
    var n = 0;
    for (var i = 0; i < this.clientes.length; i++) if (this.clientes[i].inicio !== null) n++;
    return n;
  };

  Simulator.prototype.esperaMedia = function () {
    var s = 0;
    var n = 0;
    for (var i = 0; i < this.clientes.length; i++) {
      var c = this.clientes[i];
      if (c.inicio !== null) { s += c.espera; n++; }
    }
    return n ? s / n : 0;
  };

  Simulator.prototype.esperaMax = function () {
    var m = 0;
    for (var i = 0; i < this.clientes.length; i++) {
      var c = this.clientes[i];
      if (c.inicio !== null && c.espera > m) m = c.espera;
    }
    return m;
  };

  Simulator.prototype.listo = function () {
    return this.eventos.length === 0;
  };

  /* ------------------------------------------------------------------ *
   * Réplica completa (se usa en el módulo de réplicas)                  *
   * ------------------------------------------------------------------ */

  function runReplica(seed, nClientes) {
    var sim = new Simulator(seed, nClientes || 100);
    var log = [];
    var ev = sim.step();
    while (ev) {
      log.push(ev);
      ev = sim.step();
    }
    var esperas = sim.clientes.map(function (c) { return c.espera; });
    return {
      seed: seed,
      clientes: sim.clientes,
      log: log,
      media: global.Stats.mean(esperas),
      max: esperas.length ? Math.max.apply(null, esperas) : 0,
      checks: verificar(sim)
    };
  }

  /** Verificaciones automáticas de la réplica (equivalente a los assert en Python). */
  function verificar(sim) {
    var clientes = sim.clientes;
    var n = sim.nClientes;
    var cantidad = clientes.length === n && sim.atendidos.length === n;
    var fifo = true;
    for (var i = 1; i < sim.ordenServicio.length; i++) {
      if (sim.ordenServicio[i] < sim.ordenServicio[i - 1]) fifo = false;
    }
    var servidorUnico = true;
    var orden = clientes.slice().sort(function (a, b) { return a.inicio - b.inicio; });
    for (var j = 1; j < orden.length; j++) {
      if (orden[j].inicio < orden[j - 1].fin - 1e-9) servidorUnico = false;
    }
    var esperasValidas = clientes.every(function (c) { return c.espera >= -1e-9; });
    return {
      cantidad: cantidad,
      fifo: fifo,
      servidorUnico: servidorUnico,
      esperasValidas: esperasValidas,
      todo: cantidad && fifo && servidorUnico && esperasValidas
    };
  }

  /* ------------------------------------------------------------------ *
   * Utilidades de formato                                               *
   * ------------------------------------------------------------------ */

  function fmt(x) {
    if (x === null || x === undefined) return '—';
    var r = Math.round(x * 10000) / 10000;
    return String(r);
  }

  global.Engine = {
    Simulator: Simulator,
    runReplica: runReplica,
    verificar: verificar,
    fmt: fmt
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = global.Engine;
})(typeof window !== 'undefined' ? window : globalThis);
