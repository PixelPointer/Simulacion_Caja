/**
 * data.js — Contenido académico del documento
 * "Segundo Parcial - Escenario 3: Caja de supermercado en horario de baja demanda".
 *
 * Todo el texto de este archivo fue transcrito del PDF fuente. Las cifras
 * estadísticas que se muestran en vivo se calculan con el motor de la página;
 * aquí sólo se guardan los valores tal como aparecen en el documento para
 * poder compararlos y señalar las inconsistencias detectadas.
 */
(function (global) {
  'use strict';

  /* ================================================================== *
   * 1. PORTADA / DATOS DEL PROYECTO                                     *
   * ================================================================== */

  var PORTADA = {
    universidad: 'Universidad Mayor de San Andrés',
    facultad: 'Facultad de Ciencias Puras y Naturales',
    carrera: 'Carrera de Informática',
    materia: 'Simulación de Sistemas',
    evaluacion: 'Segundo Parcial - Escenario 3',
    titulo: 'Caja de supermercado en horario de baja demanda',
    docente: 'Lic. Rosa Flores Morales',
    lugar: 'La Paz - Bolivia',
    anio: '2026',
    integrantes: [
      { nombre: 'Bautista Villcacuti Cristian William', numero: 10, curso: 'INF-381' },
      { nombre: 'Llujtaparo Machaca Tania', numero: 82, curso: 'INF-381' },
      { nombre: 'Mamani Chavez Rafael Alejandro', numero: 92, curso: 'INF-381' },
      { nombre: 'Mamani Quispe Dussan David', numero: 101, curso: 'INF-381' },
      { nombre: 'Salgado Llusco Carlos Alejandro', numero: 133, curso: 'INF-381' }
    ]
  };

  var ESCENARIO = {
    contexto:
      'Una caja atiende a clientes que realizan compras pequeñas. El gerente considera que ' +
      'mantener la caja abierta durante las horas de baja demanda podría ser innecesario.',
    disciplina: 'FIFO',
    servidores: 1,
    clientes: 100,
    unidad: 'minutos',
    observaciones: 50
  };

  /* ================================================================== *
   * 2. RESULTADOS DE REFERENCIA DEL DOCUMENTO                           *
   * ================================================================== */

  var REFERENCIA = {
    replica5: [
      { rep: 1, semilla: 101, clientes: 100, media: 0.62, max: 5.0 },
      { rep: 2, semilla: 202, clientes: 100, media: 0.54, max: 5.0 },
      { rep: 3, semilla: 303, clientes: 100, media: 0.78, max: 5.0 },
      { rep: 4, semilla: 404, clientes: 100, media: 0.51, max: 4.0 },
      { rep: 5, semilla: 505, clientes: 100, media: 0.40, max: 3.0 }
    ],
    inferencial5: {
      media: 0.57,
      desviacion: 0.1414,
      t: 2.7764,
      h: 0.1756,
      lo: 0.3944,
      hi: 0.7456,
      er: 0.3081,
      erTexto: '30,81 %',
      teoricas: 48,
      adicionales: 43
    },
    /* Salida del programa de la sección 2 del documento (otro generador). */
    salidaPrograma: [
      { rep: 1, semilla: 101, clientes: 100, media: 0.700, max: 4.0 },
      { rep: 2, semilla: 202, clientes: 100, media: 0.590, max: 5.0 },
      { rep: 3, semilla: 303, clientes: 100, media: 0.260, max: 3.0 },
      { rep: 4, semilla: 404, clientes: 100, media: 0.600, max: 5.0 },
      { rep: 5, semilla: 505, clientes: 100, media: 0.400, max: 3.0 }
    ],
    inferencialPrograma: {
      media: 0.510,
      desviacion: 0.177,
      lo: 0.290,
      hi: 0.730,
      erTexto: '43,1 %'
    },
    global: {
      replicas: 89,
      media: 0.5996,
      desviacion: 0.2838,
      hDocumento: 0.1756,   // valor impreso en el bloque de resultados (inconsistente)
      hCorrecto: 0.0598,    // valor impreso en la pregunta 4.1.4 y coherente con el IC
      lo: 0.5398,
      hi: 0.6593,
      er: 0.0997,
      erTexto: '9,97 %'
    },
    trazaSemilla101: [
      { cli: 1, tEntre: 5, llegada: 5.0, inicio: 5.0, tServ: 2, fin: 7.0, espera: 0.0 },
      { cli: 2, tEntre: 4, llegada: 9.0, inicio: 9.0, tServ: 2, fin: 11.0, espera: 0.0 },
      { cli: 3, tEntre: 2, llegada: 11.0, inicio: 11.0, tServ: 4, fin: 15.0, espera: 0.0 },
      { cli: 4, tEntre: 4, llegada: 15.0, inicio: 15.0, tServ: 2, fin: 17.0, espera: 0.0 },
      { cli: 5, tEntre: 5, llegada: 20.0, inicio: 20.0, tServ: 2, fin: 22.0, espera: 0.0 }
    ],
    reconstruccion: [
      { cli: 1, llegada: 3, inicio: 3, fin: 6, espera: 0 },
      { cli: 2, llegada: 7, inicio: 7, fin: 9, espera: 0 },
      { cli: 3, llegada: 8, inicio: 9, fin: 10, espera: 1 }
    ],
    primerosAleatorios: [
      { n: 1, uLlegada: 0.5046, tLlegada: 3, uServicio: 0.7127, tServicio: 3 },
      { n: 2, uLlegada: 0.6328, tLlegada: 4, uServicio: 0.5385, tServicio: 2 },
      { n: 3, uLlegada: 0.0757, tLlegada: 1, uServicio: 0.0006, tServicio: 1 },
      { n: 4, uLlegada: 0.5205, tLlegada: 3, uServicio: 0.7961, tServicio: 3 },
      { n: 5, uLlegada: 0.1587, tLlegada: 2, uServicio: 0.4502, tServicio: 2 }
    ],
    semillas: {
      '101': { llegadas: 2.8, servicio: 2.4 },
      '573': { llegadas: 2.5, servicio: 2.1 }
    },
    evidencia: '124 réplicas (semillas 1000 a 1123) con exactamente 100 clientes cada una.'
  };

  /* ================================================================== *
   * 3. INCONSISTENCIAS DETECTADAS EN EL DOCUMENTO                       *
   * ================================================================== */

  var INCONSISTENCIAS = [
    {
      titulo: 'Dos generadores distintos para las 5 réplicas iniciales',
      seccion: '§2 (salida del programa) vs §3 (tabla de réplicas)',
      gravedad: 'alta',
      detalle:
        'La salida impresa en la sección 2 reporta esperas medias de 0,700 / 0,590 / 0,260 / ' +
        '0,600 / 0,400 (media 0,510; S = 0,177; IC95 % = [0,290; 0,730]; Er = 43,1 %), mientras ' +
        'que la tabla de la sección 3 reporta 0,6200 / 0,5400 / 0,7800 / 0,5100 / 0,4000 ' +
        '(media 0,57; S = 0,1414; IC95 % = [0,3944; 0,7456]; Er = 30,81 %). Ambas tablas usan ' +
        'las mismas semillas 101–505 pero valores distintos.',
      causa:
        'La sección 2 se ejecutó con numpy.random.default_rng(semilla), mientras que la sección 3 ' +
        'y los resultados finales de 89 réplicas se generaron con el generador congruencial aditivo ' +
        'de la sección 5. Verificado: con default_rng(101) la traza de llegadas es 5, 4, 2, 4, 5 ' +
        '(como muestra el PDF) y con el generador aditivo es 3, 4, 1, 3, 2 (como muestra la ' +
        'reconstrucción manual).',
      resolucion:
        'No se modificó ningún valor: en esta página la sección 2 se presenta tal cual como ' +
        '"salida con numpy" y la tabla de la sección 3 se presenta como "salida con el generador ' +
        'congruencial aditivo". El motor en vivo reproduce exactamente la tabla de la sección 3 y ' +
        'el resultado final de 89 réplicas.'
    },
    {
      titulo: 'Error relativo impreso con un denominador que no corresponde',
      seccion: '§3 · Evaluación D',
      gravedad: 'media',
      detalle:
        'Se imprime Er = h / X̄ = 0,1756 / 0,51 = 0,3081 ⇒ 30,81 %. Sin embargo, 0,1756 / 0,51 ' +
        'da 0,3443 (34,43 %). El valor 30,81 % se obtiene con 0,1756 / 0,57, que es la media ' +
        'calculada en la misma sección.',
      causa: 'Errata en el denominador de la fracción impresa (0,51 en lugar de 0,57).',
      resolucion:
        'Se conserva el resultado 30,81 % (correcto para la tabla de la sección 3) y se señala la ' +
        'errata del denominador. El simulador recalcula el error relativo en vivo.'
    },
    {
      titulo: 'Tres valores distintos para el error relativo de las 5 réplicas',
      seccion: '§2 (43,1 %) · §3 texto (43,07 %) · §3 cálculo (30,81 %)',
      gravedad: 'media',
      detalle:
        'El párrafo de evaluación de la sección 3 dice "Al ser 43,07 % > 10 %, las 5 réplicas ' +
        'iniciales no alcanzan la precisión requerida", pero el cálculo inmediatamente anterior ' +
        'de la misma sección dio 30,81 %, y la sección 2 reporta 43,1 %.',
      causa:
        '43,07 % / 43,1 % pertenecen a la salida de la sección 2 (generador numpy); 30,81 % ' +
        'pertenece a la tabla de la sección 3 (generador aditivo).',
      resolucion:
        'Se muestran los tres valores con su procedencia y sin corregirlos en silencio. Los dos ' +
        'caminos conducen a la misma conclusión cualitativa: las 5 réplicas no alcanzan el 10 %.'
    },
    {
      titulo: 'Margen de error de las 89 réplicas',
      seccion: '§3 (bloque final) vs §4.1 pregunta 4',
      gravedad: 'alta',
      detalle:
        'El bloque "Resultados globales con réplicas adicionales n = 89" imprime "Margen de Error ' +
        'h = 0,1756 min", pero con media 0,5996 e IC95 % = [0,5398; 0,6593] el semiancho real es ' +
        'h = 0,0598 min, que es el valor que sí se reporta en la pregunta 4.1.4.',
      causa:
        '0,1756 min es el margen de error de las 5 réplicas iniciales; se arrastró al bloque final.',
      resolucion:
        'Se conserva el valor impreso y se indica que es el de la etapa de 5 réplicas. Con el motor ' +
        'en vivo se calcula h = 0,0598 min y Er = 9,97 %, coincidentes con el intervalo publicado.'
    },
    {
      titulo: 'La reconstrucción manual no coincide con la traza del programa',
      seccion: '§1.3 / §4.1.2 vs §2 (traza semilla 101)',
      gravedad: 'alta',
      detalle:
        'La reconstrucción manual afirma que con la semilla 101 el primer cliente llega en el ' +
        'minuto 3 (tiempos 3, 4, 1). La traza del programa de la sección 2, también con la semilla ' +
        '101, muestra el primer cliente llegando en el minuto 5 (tiempos 5, 4, 2, 4, 5). El texto ' +
        'afirma que "los resultados coinciden con los obtenidos por el programa".',
      causa:
        'Misma causa que la inconsistencia 1: la reconstrucción usa el generador congruencial ' +
        'aditivo y la traza del §2 usa numpy.default_rng.',
      resolucion:
        'El simulador de esta página usa el generador congruencial aditivo (el de los resultados ' +
        'finales), por lo que reproduce exactamente la reconstrucción manual: llegadas 3, 7, 8; ' +
        'inicios 3, 7, 9; finales 6, 9, 10; esperas 0, 0, 1.'
    },
    {
      titulo: 'Convención de los intervalos de U en los extremos',
      seccion: '§1.3 (0 ≤ U < 0,10) vs §2 (0,00 < U ≤ 0,10) vs código (U ≤ F(x))',
      gravedad: 'baja',
      detalle:
        'La sección 1.3 presenta intervalos semiabiertos por la izquierda [a, b); la tabla de la ' +
        'sección 2 los presenta (a, b]; y el código ejecutable toma el primer valor x tal que ' +
        'U ≤ F(x).',
      causa: 'Redacción distinta en secciones distintas.',
      resolucion:
        'Sólo afecta a los valores límite exactos (0,10; 0,30; …), cuya probabilidad es cero en una ' +
        'distribución continua. La página aplica la convención del código (U ≤ F(x)) y muestra las ' +
        'tablas del documento tal como están impresas.'
    },
    {
      titulo: 'Número final de réplicas: 89 en el PDF, 93 en el script',
      seccion: '§3 / §4.4 vs modelo_caja.py (citado en §2.8)',
      gravedad: 'media',
      detalle:
        'El documento reporta 89 réplicas como resultado final. El archivo modelo_caja.py que la ' +
        'sección 2.8 indica para ejecutar ("python modelo_caja.py") fija N_MINIMO = 93 réplicas, ' +
        'y verificacion.py repite ese mínimo.',
      causa:
        'El criterio de parada del documento (primera vez que Er ≤ 10 %, sin mínimo) se alcanza en ' +
        'la réplica 89; los scripts de la carpeta exigen además un mínimo de 93 ejecuciones.',
      resolucion:
        'Se conservan ambos datos. El motor en vivo aplica el criterio del documento (parada en ' +
        'Er ≤ 10 %) y reproduce 89 réplicas con Er = 9,97 %.'
    }
  ];

  /* ================================================================== *
   * 4. PREGUNTAS Y RESPUESTAS                                          *
   * ================================================================== */

  var PREGUNTAS = {
    tecnicas: {
      titulo: 'Preguntas técnicas de verificación',
      icono: 'clipboard-check',
      intro:
        'Verifican que la generación de números aleatorios, la transformada inversa y el ' +
        'cálculo de los tiempos de la cola funcionen correctamente.',
      items: [
        {
          enunciado:
            'Presenten los primeros cinco números aleatorios utilizados y muestren cómo ' +
            'transformaron al menos dos de ellos en tiempos entre llegadas y tiempos de servicio.',
          respuesta:
            '<p>Para generar los tiempos entre llegadas y los tiempos de servicio se utilizó un ' +
            '<strong>generador congruencial aditivo</strong>, inicializado con la semilla 101.</p>' +
            '<p>Se generaron dos secuencias pseudoaleatorias independientes: una para los tiempos ' +
            'entre llegadas y otra para los tiempos de servicio. Los números obtenidos se encuentran ' +
            'entre 0 y 1 y se transformaron mediante el método de la <strong>transformada inversa</strong>, ' +
            'utilizando las distribuciones empíricas acumuladas de los datos observados.</p>' +
            '<p>Los primeros cinco números aleatorios obtenidos fueron:</p>' +
            '<div class="tabla-wrap" id="tbl-aleatorios-q"></div>' +
            '<p><strong>Ejemplo de transformación.</strong></p>' +
            '<p>Para los tiempos entre llegadas, la distribución acumulada es:</p>' +
            '<ul class="lista-puntos">' +
            '<li>1 minuto: 0,10</li><li>2 minutos: 0,30</li><li>3 minutos: 0,60</li>' +
            '<li>4 minutos: 0,90</li><li>5 minutos: 1,00</li></ul>' +
            '<p>Si obtenemos el número aleatorio <strong>0,5046</strong>, observamos que se encuentra ' +
            'entre 0,30 y 0,60. Por lo tanto, el tiempo entre llegadas correspondiente es de ' +
            '<strong>3 minutos</strong>.</p>' +
            '<p>Para los tiempos de servicio, la distribución acumulada es:</p>' +
            '<ul class="lista-puntos">' +
            '<li>1 minuto: 0,20</li><li>2 minutos: 0,60</li><li>3 minutos: 0,90</li>' +
            '<li>4 minutos: 1,00</li></ul>' +
            '<p>Si obtenemos el número aleatorio <strong>0,7127</strong>, observamos que se encuentra ' +
            'entre 0,60 y 0,90. Por lo tanto, el tiempo de servicio correspondiente es de ' +
            '<strong>3 minutos</strong>.</p>' +
            '<p>De esta manera, los números pseudoaleatorios uniformes entre 0 y 1 se transforman en ' +
            'tiempos discretos que respetan las probabilidades obtenidas de las observaciones originales.</p>',
          complemento:
            'Las dos secuencias se desplazan 1000 unidades de semilla entre sí (101 y 1101) para que ' +
            'las llegadas y los servicios no compartan valores. Las tablas interactivas de la sección ' +
            'de generación permiten verificar cada transformación paso a paso.',
          datos: ['Semilla 101', 'U = 0,5046 → 3 min', 'U = 0,7127 → 3 min', 'Medias 2,8 y 2,4 min']
        },
        {
          enunciado:
            'Seleccionen tres clientes consecutivos y reconstruyan manualmente su hora de llegada, ' +
            'inicio de servicio, finalización y tiempo de espera.',
          respuesta:
            '<p>Se seleccionaron los tres primeros clientes de la réplica con semilla 101.</p>' +
            '<ul>' +
            '<li><strong>Cliente 1:</strong> su tiempo entre llegadas es de 3 minutos, por lo que ' +
            'llega en el minuto 3. Como el servidor está libre, inicia su atención inmediatamente y ' +
            'termina en el minuto 6. Su tiempo de espera es de 0 minutos.</li>' +
            '<li><strong>Cliente 2:</strong> su tiempo entre llegadas es de 4 minutos, por lo que ' +
            'llega en el minuto 7. El servidor terminó de atender al primer cliente en el minuto 6, ' +
            'por lo que comienza su atención inmediatamente y finaliza en el minuto 9. Su tiempo de ' +
            'espera es de 0 minutos.</li>' +
            '<li><strong>Cliente 3:</strong> su tiempo entre llegadas es de 1 minuto, por lo que ' +
            'llega en el minuto 8. Sin embargo, el servidor todavía está atendiendo al segundo ' +
            'cliente hasta el minuto 9. Por esta razón, debe esperar hasta que el servidor quede ' +
            'libre. Inicia su atención en el minuto 9 y finaliza en el minuto 10. Su tiempo de ' +
            'espera es de 1 minuto.</li></ul>' +
            '<p><strong>Resumen de la reconstrucción:</strong></p>' +
            '<div class="tabla-wrap" id="tbl-reconstruccion-q"></div>' +
            '<p>Los resultados coinciden con los obtenidos por el programa, comprobando que el ' +
            'cálculo de las llegadas, los inicios de atención, las finalizaciones y los tiempos de ' +
            'espera funciona correctamente.</p>',
          complemento:
            'La regla utilizada es inicio = max(llegada, fin del cliente anterior) y espera = inicio − ' +
            'llegada. En el módulo del simulador puede reconstruir estos tres clientes paso a paso y ' +
            'compararlos con la ejecución real.',
          datos: ['Llegadas 3, 7, 8', 'Inicios 3, 7, 9', 'Finales 6, 9, 10', 'Esperas 0, 0, 1 min']
        },
        {
          enunciado:
            '¿Qué resultados cambian al utilizar otra semilla aleatoria y cuáles deberían permanecer ' +
            'aproximadamente estables?',
          respuesta:
            '<p>Al utilizar una semilla aleatoria diferente se generan nuevas secuencias de números ' +
            'pseudoaleatorios. Por lo tanto, cambian los tiempos individuales entre llegadas, los ' +
            'tiempos de servicio, los tiempos de espera de cada cliente y los resultados particulares ' +
            'de cada réplica.</p>' +
            '<p>Sin embargo, deberían permanecer aproximadamente estables los indicadores generales ' +
            'cuando se realizan suficientes réplicas, como el tiempo medio de espera, la utilización ' +
            'del servidor y las proporciones de clientes que esperan o son atendidos inmediatamente.</p>' +
            '<p>Esto ocurre porque todas las réplicas utilizan las mismas distribuciones empíricas y ' +
            'las mismas condiciones del sistema, aunque los números aleatorios generados sean ' +
            'diferentes.</p>',
          complemento:
            'El documento lo demuestra con dos ejecuciones de 10 valores: semilla 101 (medias 2,8 y ' +
            '2,4 minutos) y semilla 573 (medias 2,5 y 2,1 minutos). Las medias difieren poco mientras ' +
            'que las secuencias completas son distintas.',
          datos: ['Semilla 101 → 2,8 y 2,4 min', 'Semilla 573 → 2,5 y 2,1 min', 'IC95 % con 89 réplicas: [0,5398; 0,6593]']
        },
        {
          enunciado:
            'Expliquen cómo obtuvieron el intervalo de confianza y qué significa para el tiempo medio ' +
            'de espera.',
          respuesta:
            '<p>El intervalo de confianza se calculó utilizando la media y la desviación estándar de ' +
            'los resultados de las 89 réplicas, junto con el valor crítico de la distribución t de ' +
            'Student para un nivel de confianza del 95 %.</p>' +
            '<p>Los resultados finales fueron:</p>' +
            '<ul>' +
            '<li>Número de réplicas: <strong>89</strong>.</li>' +
            '<li>Media de espera: <strong>0,5996 minutos</strong>.</li>' +
            '<li>Desviación estándar: <strong>0,2838 minutos</strong>.</li>' +
            '<li>Margen de error: <strong>0,0598 minutos</strong>.</li></ul>' +
            '<p>El intervalo obtenido fue:</p>' +
            '<p class="formula-destacada">IC 95 % = [0,5398; 0,6593] minutos.</p>' +
            '<p>Esto significa que, mediante el procedimiento estadístico utilizado, se obtiene un ' +
            'intervalo de confianza del 95 % para estimar el verdadero tiempo medio de espera del ' +
            'sistema.</p>' +
            '<p>En términos prácticos, el tiempo medio de espera estimado es de aproximadamente 0,60 ' +
            'minutos, es decir, cerca de <strong>36 segundos</strong>.</p>' +
            '<p>Además, se obtuvo un error relativo del 9,97 %, cumpliendo con el criterio ' +
            'establecido de no superar el 10 %.</p>',
          complemento:
            'El cálculo sigue la fórmula h = t(α/2, n−1) · S / √n con n = 89, S = 0,2838 y ' +
            't(0,025; 88) = 1,9873, lo que da h = 0,0598 min. El error relativo Er = h / X̄ = ' +
            '0,0598 / 0,5996 = 9,97 %.',
          datos: ['n = 89', 'S = 0,2838 min', 't(0,025; 88) = 1,9873', 'h = 0,0598 min', 'Er = 9,97 %']
        },
        {
          enunciado:
            'Si duplicaran el número de réplicas, ¿qué esperan que suceda con la amplitud del ' +
            'intervalo de confianza?',
          respuesta:
            '<p>Si se duplica el número de réplicas, se espera que la amplitud del intervalo de ' +
            'confianza disminuya, siempre que la variabilidad de los resultados se mantenga ' +
            'aproximadamente estable.</p>' +
            '<p>Esto sucede porque al aumentar el número de réplicas disminuye el error estándar de ' +
            'la media, lo que permite obtener una estimación más precisa del tiempo medio de espera.</p>' +
            '<p>Sin embargo, duplicar el número de réplicas no significa que el intervalo se reduzca ' +
            'exactamente a la mitad. Su amplitud disminuye aproximadamente en proporción inversa a la ' +
            'raíz cuadrada del número de réplicas.</p>',
          complemento:
            'Al duplicar n, el semiancho se multiplica por 1/√2 ≈ 0,707: pasar de 89 a 178 réplicas ' +
            'reduciría el margen de 0,0598 a unos 0,0423 minutos. Esto puede comprobarse en vivo en el ' +
            'módulo de réplicas.',
          datos: ['Factor 1/√2 ≈ 0,707', 'h(89) = 0,0598 min', 'h(178) ≈ 0,0423 min']
        }
      ]
    },

    criticas: {
      titulo: 'Preguntas de pensamiento crítico',
      icono: 'brain',
      intro:
        'Evalúan la capacidad de interpretar los resultados, distinguir errores de modelamiento y ' +
        'comunicar la evidencia estadística.',
      items: [
        {
          enunciado:
            'Si el modelo produce una cola creciente, ¿cómo distinguirían entre un error de ' +
            'programación y una demanda superior a la capacidad del servidor?',
          respuesta:
            '<p>Primero verificaríamos que el programa funcione correctamente, comprobando la ' +
            'disciplina FIFO, el procesamiento de los eventos, los tiempos generados y que el ' +
            'servidor atienda a un solo cliente a la vez.</p>' +
            '<p>Después compararíamos la frecuencia de llegada de los clientes con la capacidad de ' +
            'atención del servidor.</p>' +
            '<p>Si los clientes llegan más rápido de lo que el servidor puede atenderlos, la cola ' +
            'puede crecer debido a que la demanda supera la capacidad de atención.</p>' +
            '<p>En cambio, si existe una inconsistencia en la programación, como errores en los ' +
            'tiempos o en la asignación de eventos, la cola podría crecer incluso cuando la capacidad ' +
            'del servidor sea suficiente.</p>' +
            '<p>En nuestro escenario, el tiempo medio entre llegadas es de 3,10 minutos y el tiempo ' +
            'medio de servicio es de 2,30 minutos. Esto indica que, en promedio, el servidor tiene ' +
            'capacidad suficiente para atender la demanda durante el período analizado.</p>',
          complemento:
            'La relación entre ambas medias da una utilización teórica ρ = 2,30 / 3,10 ≈ 0,742, es ' +
            'decir, el cajero está ocupado alrededor del 74 % del tiempo: hay colas ocasionales, pero ' +
            'no crecimiento indefinido. Las verificaciones automáticas (FIFO, servidor único, 100 ' +
            'clientes) descartan errores de programación antes de interpretar la cola.',
          datos: ['Media entre llegadas: 3,10 min', 'Media de servicio: 2,30 min', 'Utilización ≈ 74,2 %']
        },
        {
          enunciado:
            '¿Puede un modelo tener un intervalo de confianza muy estrecho y, sin embargo, ' +
            'representar mal la realidad?',
          respuesta:
            '<p>Sí. Un intervalo de confianza estrecho indica que los resultados de las simulaciones ' +
            'presentan poca incertidumbre estadística respecto a la media estimada.</p>' +
            '<p>Sin embargo, esto no garantiza que el modelo represente correctamente la realidad.</p>' +
            '<p>Por ejemplo, si los tiempos de llegada o de servicio no representan adecuadamente el ' +
            'comportamiento real de los clientes, los resultados podrían ser estadísticamente ' +
            'precisos, pero incorrectos en la práctica.</p>' +
            '<p>Por eso es importante verificar tanto el funcionamiento del programa como la calidad ' +
            'de los datos y las condiciones utilizadas para construir el modelo.</p>',
          complemento:
            'La precisión estadística (poca variabilidad entre réplicas) y la validez externa (que los ' +
            'datos representen la realidad) son propiedades distintas: la primera se mide con el error ' +
            'relativo y la segunda sólo con datos externos al modelo. En este trabajo, los datos ' +
            'proviene de 50 observaciones por variable.',
          datos: ['Er = 9,97 % (precisión)', '50 observaciones por variable', 'IC95 % = [0,5398; 0,6593]']
        },
        {
          enunciado:
            'Si una réplica da un resultado favorable y otra desfavorable, ¿cuál presentarían a la ' +
            'gerencia? ¿Por qué?',
          respuesta:
            '<p>Presentaríamos todas las réplicas y sus resultados, incluyendo los favorables y ' +
            'desfavorables, junto con la media general, la desviación estándar y el intervalo de ' +
            'confianza.</p>' +
            '<p>No sería correcto seleccionar únicamente la réplica que presente el resultado más ' +
            'conveniente.</p>' +
            '<p>La gerencia necesita conocer el comportamiento general del sistema y también las ' +
            'situaciones desfavorables que podrían afectar a los clientes. De esta manera, las ' +
            'decisiones se basarían en el conjunto de los resultados y no en un caso aislado.</p>',
          complemento:
            'Entre las 5 réplicas iniciales del documento las esperas medias van de 0,40 a 0,78 ' +
            'minutos y las esperas máximas de 3 a 5 minutos: presentar sólo la réplica 5 (0,40 min) ' +
            'ocultaría el peor caso (réplica 3, 0,78 min). El dashboard de réplicas muestra la ' +
            'distribución completa.',
          datos: ['Mínimo 0,40 min', 'Máximo 0,78 min', 'Media global 0,5996 min']
        },
        {
          enunciado:
            '¿Qué cambiarían primero para reducir la espera: el tiempo de servicio, la política de ' +
            'atención o el número de servidores? ¿Qué evidencia necesitarían?',
          respuesta:
            '<p>Primero analizaríamos la posibilidad de reducir el tiempo de servicio mediante ' +
            'mejoras en el proceso de atención, siempre que no se afecte la calidad del servicio.</p>' +
            '<p>También podríamos evaluar otros escenarios, como modificar la política de atención o ' +
            'incorporar un servidor adicional.</p>' +
            '<p>Para tomar una decisión necesitaríamos comparar diferentes alternativas mediante ' +
            'nuevas simulaciones, utilizando las mismas condiciones de demanda y suficientes ' +
            'réplicas.</p>' +
            '<p>Además, analizaríamos el tiempo medio de espera, el tiempo máximo, la utilización de ' +
            'los servidores y los costos de cada alternativa.</p>',
          complemento:
            'La evidencia mínima sería un experimento comparativo con el mismo generador aleatorio y ' +
            'el mismo número de réplicas en cada alternativa, comparando los intervalos de confianza ' +
            'de las medias de espera. Con ρ ≈ 0,74 el cuello de botella no es estructural, por lo que ' +
            'reducir el tiempo de servicio suele ser la palanca más económica antes de sumar personal.',
          datos: ['Utilización ≈ 74,2 %', 'IC95 % base [0,5398; 0,6593]', 'Criterio: Er ≤ 10 %']
        },
        {
          enunciado:
            'Si la media de espera disminuye, pero aumenta el tiempo máximo de espera, ¿considerarían ' +
            'que la modificación fue exitosa?',
          respuesta:
            '<p>No necesariamente.</p>' +
            '<p>Aunque una disminución del tiempo medio de espera representa una mejora para la ' +
            'mayoría de los clientes, un aumento del tiempo máximo puede indicar que algunos clientes ' +
            'están experimentando esperas considerablemente mayores.</p>' +
            '<p>Por lo tanto, evaluaríamos ambos indicadores antes de considerar exitosa la ' +
            'modificación. También sería importante analizar cuántos clientes se ven afectados por ' +
            'esas esperas prolongadas y si la mejora general compensa los casos desfavorables.</p>',
          complemento:
            'La media resume el comportamiento típico y el máximo captura el peor caso; ninguno de ' +
            'los dos es suficiente por sí solo. Complementarlos con el porcentaje de clientes que ' +
            'espera y con los percentiles de espera permite detectar si la mejora se paga con ' +
            'colas largas para unos pocos.',
          datos: ['Media global 0,5996 min', 'Espera máxima observada en la réplica 101: 5,0 min']
        }
      ]
    },

    escenario: {
      titulo: 'Preguntas específicas del escenario',
      icono: 'store',
      intro:
        'Vinculan los resultados de la simulación con la decisión gerencial sobre mantener abierta ' +
        'la caja en horario de baja demanda.',
      items: [
        {
          enunciado: '¿Un tiempo promedio de espera cercano a cero justifica cerrar la caja?',
          respuesta:
            '<p><strong>No necesariamente.</strong></p>' +
            '<p>En nuestro modelo, el tiempo medio de espera fue de 0,5996 minutos, equivalente ' +
            'aproximadamente a 36 segundos, lo que representa una espera relativamente reducida.</p>' +
            '<p>Sin embargo, un tiempo medio de espera bajo no significa que ningún cliente tenga ' +
            'que esperar. Algunos clientes pueden encontrar la caja ocupada y necesitar esperar antes ' +
            'de recibir atención.</p>' +
            '<p>Además, la caja cumple una función importante al permitir que los clientes sean ' +
            'atendidos durante el horario de baja demanda.</p>' +
            '<p>Por lo tanto, no recomendaríamos cerrar la caja únicamente porque el tiempo promedio ' +
            'de espera sea bajo. Antes de tomar esa decisión sería necesario analizar los costos de ' +
            'mantenerla abierta y las consecuencias que tendría para los clientes.</p>',
          complemento:
            'El intervalo de confianza [0,5398; 0,6593] minutos confirma que la espera media es baja ' +
            'con un 95 % de confianza, pero el tiempo máximo de espera (5 minutos en la réplica 101) ' +
            'muestra que sí existen clientes que esperan. La decisión requiere información económica ' +
            'que el modelo no contiene.',
          datos: ['Media 0,5996 min ≈ 36 s', 'IC95 % [0,5398; 0,6593]', 'Máximo 5,0 min (réplica 101)']
        },
        {
          enunciado: '¿Qué costos o beneficios no están representados en el modelo?',
          respuesta:
            '<p>El modelo se concentra principalmente en los tiempos de llegada, servicio y espera ' +
            'de los clientes. Sin embargo, existen otros factores económicos y operativos que no ' +
            'están incluidos.</p>' +
            '<p><strong>Costos no representados:</strong></p>' +
            '<ul>' +
            '<li>Salario del cajero.</li>' +
            '<li>Consumo de electricidad.</li>' +
            '<li>Mantenimiento y funcionamiento de la caja.</li>' +
            '<li>Costos de equipos y recursos utilizados.</li>' +
            '<li>Costos administrativos y operativos.</li></ul>' +
            '<p><strong>Beneficios no representados:</strong></p>' +
            '<ul>' +
            '<li>Mayor satisfacción de los clientes.</li>' +
            '<li>Reducción de la incomodidad y las molestias durante la espera.</li>' +
            '<li>Mejor atención en períodos de mayor demanda.</li>' +
            '<li>Fidelización de los clientes.</li>' +
            '<li>Prevención de pérdidas de ventas por clientes que decidan retirarse al encontrar ' +
            'una fila.</li></ul>' +
            '<p>Por esta razón, los resultados de la simulación deben complementarse con un análisis ' +
            'económico y operativo antes de decidir si conviene mantener abierta o cerrar la caja.</p>',
          complemento:
            'El modelo sólo contiene variables de tiempo (llegada, servicio, espera). Ninguna de las ' +
            'cinco categorías anteriores entra en el cálculo, por lo que el resultado de la ' +
            'simulación es un insumo para la decisión, no la decisión misma.',
          datos: ['Variables del modelo: llegada, servicio, espera', 'Costos: 5 categorías fuera del modelo', 'Beneficios: 5 categorías fuera del modelo']
        },
        {
          enunciado: '¿Cómo distinguirían una mejora real de una diferencia debida al azar?',
          respuesta:
            '<p>Para distinguir una mejora real de una diferencia debida al azar, compararíamos el ' +
            'sistema original con el sistema modificado mediante varias réplicas independientes.</p>' +
            '<p>Ambas alternativas deberían utilizar las mismas condiciones de demanda y los mismos ' +
            'criterios de medición.</p>' +
            '<p>Después analizaríamos las medias de espera, los intervalos de confianza y otros ' +
            'indicadores importantes.</p>' +
            '<p>Si la mejora se mantiene de forma consistente en las diferentes réplicas y existe ' +
            'evidencia estadística suficiente de que la reducción no se debe únicamente a la ' +
            'variabilidad aleatoria, podríamos considerar que se trata de una mejora real.</p>',
          complemento:
            'La herramienta natural es comparar los intervalos de confianza de ambas alternativas: si ' +
            'los intervalos se solapan de forma amplia, la diferencia no es concluyente. Se mantienen ' +
            'las mismas semillas (diseño por bloques) para reducir la varianza del contraste.',
          datos: ['Réplicas independientes por alternativa', 'IC95 % base [0,5398; 0,6593]', 'Criterio de precisión: Er ≤ 10 %']
        }
      ]
    }
  };

  /* ================================================================== *
   * 5. CONCLUSIONES FINALES                                             *
   * ================================================================== */

  var CONCLUSIONES = [
    {
      icono: 'git-merge',
      titulo: 'Funcionamiento del modelo FIFO',
      texto:
        'Se comprobó que el modelo de simulación representa el funcionamiento de una caja de ' +
        'supermercado con un único servidor y una cola FIFO. Las verificaciones realizadas permiten ' +
        'comprobar que se respeta el orden de atención y que no se atiende a dos clientes ' +
        'simultáneamente.',
      destacado: false
    },
    {
      icono: 'clipboard-check',
      titulo: 'Validación de la reconstrucción manual',
      texto:
        'La reconstrucción manual de los primeros tres clientes de la réplica con semilla 101 ' +
        'permitió verificar que los tiempos de llegada, inicio de atención, finalización y espera ' +
        'coinciden con los resultados generados por el programa.',
      destacado: false
    },
    {
      icono: 'dice-5',
      titulo: 'Tiempos generados',
      texto:
        'Los tiempos generados mediante el generador congruencial aditivo y la transformada inversa ' +
        'utilizan como referencia las distribuciones empíricas obtenidas de las 50 observaciones de ' +
        'los tiempos entre llegadas y de servicio.',
      destacado: false
    },
    {
      icono: 'repeat',
      titulo: 'De 5 a 89 réplicas',
      texto:
        'Se ejecutaron inicialmente cinco réplicas, con las cuales se obtuvo un error relativo del ' +
        '30,81 %. Mediante la fórmula de estimación se calcularon 48 réplicas teóricas. Sin embargo, ' +
        'al continuar agregando ejecuciones y recalculando el error relativo, el programa alcanzó un ' +
        'total de 89 réplicas.',
      destacado: false
    },
    {
      icono: 'target',
      titulo: 'Resultados de las 89 réplicas',
      texto:
        'Después de las 89 réplicas se obtuvo un tiempo medio de espera de 0,5996 minutos, con un ' +
        'intervalo de confianza del 95 % entre 0,5398 y 0,6593 minutos. El error relativo fue del ' +
        '9,97 %, cumpliendo con el criterio de precisión establecido del 10 %.',
      destacado: false,
      cifras: [
        { etiqueta: 'Réplicas', valor: '89' },
        { etiqueta: 'Media de espera', valor: '0,5996 min' },
        { etiqueta: 'IC 95 %', valor: '[0,5398; 0,6593]' },
        { etiqueta: 'Error relativo', valor: '9,97 %' }
      ]
    },
    {
      icono: 'timer',
      titulo: 'Espera reducida, pero no nula',
      texto:
        'Los resultados muestran que, durante el horario de baja demanda analizado, el sistema ' +
        'presenta un tiempo medio de espera relativamente reducido. Sin embargo, esto no significa ' +
        'que todos los clientes sean atendidos inmediatamente, ya que pueden producirse situaciones ' +
        'de espera cuando el servidor se encuentra ocupado.',
      destacado: false
    },
    {
      icono: 'scale',
      titulo: 'No cerrar la caja sólo por la espera media',
      texto:
        'Finalmente, no se recomienda cerrar la caja únicamente porque el tiempo medio de espera ' +
        'sea bajo. Es necesario considerar también los costos de funcionamiento, la satisfacción de ' +
        'los clientes y las posibles consecuencias de reducir la capacidad de atención. Por lo ' +
        'tanto, la decisión debe basarse en una evaluación conjunta de los resultados operativos y ' +
        'económicos.',
      destacado: true
    }
  ];

  var CONCLUSION_GENERAL = {
    titulo: 'Conclusión general',
    texto:
      'El modelo permitió evaluar el funcionamiento de la caja del supermercado, comprobar su ' +
      'comportamiento mediante simulaciones y obtener resultados estadísticamente aceptables. La ' +
      'decisión de mantener abierta o cerrar la caja no debe basarse exclusivamente en el tiempo ' +
      'medio de espera, sino también en la utilización del servidor, los tiempos máximos, la demanda ' +
      'y los factores económicos que no fueron incluidos en el modelo.',
    regla:
      'No se debe cerrar la caja únicamente por tener un tiempo medio de espera bajo: hay que ' +
      'considerar también los costos operativos, la satisfacción del cliente y la demanda.'
  };

  /* ================================================================== *
   * 6. GLOSARIO                                                        *
   * ================================================================== */

  var GLOSARIO = [
    {
      termino: 'FIFO',
      icono: 'git-merge',
      definicion:
        'First In, First Out (primero en llegar, primero en ser atendido). En la cola, los clientes ' +
        'ingresan por el final y son atendidos por el frente, sin posibilidad de saltear la fila.',
      ejemplo: 'Si el cliente 7 espera y llega el cliente 8, atiende primero el 7.'
    },
    {
      termino: 'Réplica',
      icono: 'repeat',
      definicion:
        'Ejecución completa independiente del modelo, con una semilla distinta, que procesa los 100 ' +
        'clientes y devuelve una espera media y una espera máxima.',
      ejemplo: 'Cada fila de la tabla de réplicas (semillas 101, 202, 303…) es una réplica.'
    },
    {
      termino: 'Semilla',
      icono: 'sprout',
      definicion:
        'Valor inicial del generador de números pseudoaleatorios. La misma semilla reproduce ' +
        'exactamente la misma secuencia, lo que hace verificable y repetible la simulación.',
      ejemplo: 'La semilla 101 genera los primeros U: 0,5046; 0,6328; 0,0757…'
    },
    {
      termino: 'Transformada inversa',
      icono: 'arrow-left-right',
      definicion:
        'Método para convertir un número U ~ U(0,1) en una variable aleatoria: se toma el primer ' +
        'valor x cuya probabilidad acumulada F(x) satisface U ≤ F(x).',
      ejemplo: 'U = 0,5046 cae en (0,30; 0,60] → 3 minutos entre llegadas.'
    },
    {
      termino: 'Chi-cuadrado',
      icono: 'sigma',
      definicion:
        'Prueba de bondad de ajuste que compara las frecuencias observadas con las esperadas: ' +
        'χ² = Σ (Oi − Ei)² / Ei. Si χ² supera el valor crítico se rechaza H0.',
      ejemplo: 'Llegadas: χ² = 10,00 > 9,488 (gl = 4) → se rechaza la uniformidad.'
    },
    {
      termino: 'Intervalo de confianza',
      icono: 'ruler',
      definicion:
        'Rango [X̄ − h; X̄ + h] construido con la t de Student que, con un 95 % de confianza, ' +
        'contiene la verdadera media de espera del sistema.',
      ejemplo: 'IC 95 % = [0,5398; 0,6593] minutos con 89 réplicas.'
    },
    {
      termino: 'Eventos discretos',
      icono: 'activity',
      definicion:
        'Técnica de simulación en la que el reloj salta de un evento a otro (llegada, fin de ' +
        'servicio) en lugar de avanzar en pasos fijos de tiempo.',
      ejemplo: 'El reloj pasa de t = 3 directamente a t = 6 si no ocurre nada entre ambos.'
    }
  ];

  /* ================================================================== *
   * 7. CÓDIGO PYTHON                                                   *
   * ================================================================== */

  var CODIGOS = [
    {
      id: 'generador',
      nombre: 'generador_aleatorio.py',
      etiqueta: '§5 · Sección 5 del documento',
      icono: 'dices',
      descripcion:
        'Generador congruencial aditivo para producir los números uniformes, transformada inversa ' +
        'para convertirlos en tiempos y las tres pruebas de uniformidad (media, varianza y corridas) ' +
        'que valida la secuencia pseudoaleatoria. Es el código que reproduce los primeros números ' +
        'aleatorios del trabajo (U = 0,5046; 0,6328; 0,0757…).',
      explicacion: [
        '<strong>Inicialización:</strong> la semilla se expande con un LCG de 55 pasos para llenar ' +
        'el historial que necesita el generador aditivo (j = 24, k = 55, m = 2³¹).',
        '<strong>Generación:</strong> cada nuevo entero es la suma de dos términos anteriores del ' +
        'historial (x[n] = x[n−24] + x[n−55] mod 2³¹) y se divide entre m para obtener U ~ U(0,1).',
        '<strong>Transformación:</strong> construir_cdf() acumula las probabilidades empíricas y ' +
        'inversa() devuelve el primer tiempo cuya acumulada alcanza a U.',
        '<strong>Pruebas:</strong> media (Z sobre X̄ de U), varianza (χ² sobre S² de U) y corridas ' +
        '(Z sobre el número de cambios de tendencia) deciden si la secuencia es uniforme e ' +
        'independiente.'
      ],
      codigo: [
        'import math, bisect',
        'from scipy.stats import chi2, norm',
        '',
        '# ---------------------------------------------------------------',
        '# 1. GENERADOR CONGRUENCIAL ADITIVO (semilla -> secuencia U(0,1))',
        '# ---------------------------------------------------------------',
        'class CongruencialAditivo:',
        '    def __init__(self, semilla, j=24, k=55, m=2**31):',
        '        self.j, self.k, self.m = j, k, m',
        '        x, self.hist = semilla, []',
        '        for _ in range(k):',
        '            x = (1103515245 * x + 12345) % 2**31   # LCG de calentamiento',
        '            self.hist.append(x)',
        '',
        '    def siguiente(self):',
        '        x = (self.hist[-self.j] + self.hist[-self.k]) % self.m',
        '        self.hist.append(x); self.hist.pop(0)',
        '        return x',
        '',
        '    def random(self):',
        '        return self.siguiente() / self.m',
        '',
        '',
        '# ---------------------------------------------------------------',
        '# 2. DISTRIBUCIONES EMPÍRICAS ACUMULADAS (50 observaciones)',
        '# ---------------------------------------------------------------',
        'llegadas = {1: 0.10, 2: 0.20, 3: 0.30, 4: 0.30, 5: 0.10}',
        'servicio = {1: 0.20, 2: 0.40, 3: 0.30, 4: 0.10}',
        '',
        'def construir_cdf(dist):',
        '    valores, acum, s = [], [], 0',
        '    for v, p in dist.items():',
        '        s += p',
        '        valores.append(v); acum.append(round(s, 10))',
        '    return valores, acum',
        '',
        'def inversa(u, valores, acum):',
        '    return valores[bisect.bisect_right(acum, u)]   # transformada inversa',
        '',
        'cdf_a, cdf_s = construir_cdf(llegadas), construir_cdf(servicio)',
        '',
        '',
        '# ---------------------------------------------------------------',
        '# 3. GENERACIÓN DE N TIEMPOS DE CADA VARIABLE',
        '# ---------------------------------------------------------------',
        'def generar(n, semilla):',
        '    ga = CongruencialAditivo(semilla)          # flujo de llegadas',
        '    gs = CongruencialAditivo(semilla + 1000)   # flujo de servicios (independiente)',
        '    ua = [ga.random() for _ in range(n)]',
        '    us = [gs.random() for _ in range(n)]',
        '    ta = [inversa(u, *cdf_a) for u in ua]',
        '    ts = [inversa(u, *cdf_s) for u in us]',
        '    return ua, ta, us, ts',
        '',
        '',
        '# ---------------------------------------------------------------',
        '# 4. PRUEBAS DE UNIFORMIDAD E INDEPENDENCIA',
        '# ---------------------------------------------------------------',
        'def prueba_media(u, alfa=0.05):',
        '    n = len(u); xbar = sum(u) / n',
        '    z0 = (xbar - 0.5) * math.sqrt(n) / math.sqrt(1/12)',
        '    zc = norm.ppf(1 - alfa/2)',
        '    li = 0.5 - zc / math.sqrt(12 * n)',
        '    ls = 0.5 + zc / math.sqrt(12 * n)',
        '    return {"media": xbar, "Z0": z0, "Zcrit": zc, "lim_inf": li, "lim_sup": ls,',
        '            "acepta": li <= xbar <= ls}',
        '',
        'def prueba_varianza(u, alfa=0.05):',
        '    n = len(u); xbar = sum(u) / n',
        '    s2 = sum((x - xbar)**2 for x in u) / (n - 1)',
        '    li = chi2.ppf(alfa/2, n - 1) / (12 * (n - 1))',
        '    ls = chi2.ppf(1 - alfa/2, n - 1) / (12 * (n - 1))',
        '    return {"varianza": s2, "lim_inf": li, "lim_sup": ls, "acepta": li <= s2 <= ls}',
        '',
        'def prueba_corridas(u, alfa=0.05):',
        '    n = len(u)',
        '    s = [1 if u[i+1] > u[i] else 0 for i in range(n - 1)]',
        '    c0 = 1 + sum(1 for i in range(1, len(s)) if s[i] != s[i-1])',
        '    mu = (2*n - 1) / 3',
        '    var = (16*n - 29) / 90',
        '    z0 = (c0 - mu) / math.sqrt(var)',
        '    zc = norm.ppf(1 - alfa/2)',
        '    return {"C0": c0, "mu_C": mu, "var_C": var, "Z0": z0, "Zcrit": zc,',
        '            "acepta": abs(z0) < zc}',
        '',
        'def decision(p):',
        '    return "No se rechaza" if p["acepta"] else "SE RECHAZA"',
        '',
        'def reporte_pruebas(nombre, u, alfa=0.05):',
        '    pm = prueba_media(u, alfa)',
        '    pv = prueba_varianza(u, alfa)',
        '    pc = prueba_corridas(u, alfa)',
        '    print(f"\\n___Flujo: {nombre} (n = {len(u)}, alfa = {alfa})___")',
        '    print(f"{\'Prueba\':<22}{\'Estadístico\':<28}{\'Criterio de aceptación\':<30}{\'Decisión\'}")',
        '    print("-" * 95)',
        '    print(f"{\'Media\':<22}{\'media = %.4f\' % pm[\'media\']:<28}"',
        '          f"{\'%.4f <= media <= %.4f\' % (pm[\'lim_inf\'], pm[\'lim_sup\']):<30}{decision(pm)}")',
        '    print(f"{\'Varianza\':<22}{\'s2 = %.4f\' % pv[\'varianza\']:<28}"',
        '          f"{\'%.4f <= s2 <= %.4f\' % (pv[\'lim_inf\'], pv[\'lim_sup\']):<30}{decision(pv)}")',
        '    print(f"{\'Corridas arriba/abajo\':<22}{\'C_0 = %d, Z_0 = %.3f\' % (pc[\'C0\'], pc[\'Z0\']):<28}"',
        '          f"{\'|Z_0| < %.3f\' % pc[\'Zcrit\']:<30}{decision(pc)}")',
        '',
        '',
        'if __name__ == "__main__":',
        '    n = 10',
        '    semilla = 101',
        '',
        '    ua, ta, us, ts = generar(n, semilla)',
        '',
        '    print(f"SEMILLA: {semilla}   |   n = {n}")',
        '    print(f"\\n___Primeros {n*2} números aleatorios y su transformación___")',
        '    print(f"{\'#\':<4}{\'U llegada\':<12}{\'T. entre llegadas\':<20}{\'U servicio\':<12}{\'T. servicio\'}")',
        '    for i in range(n):',
        '        print(f"{i+1:<4}{ua[i]:<12.4f}{ta[i]:<20}{us[i]:<12.4f}{ts[i]}")',
        '',
        '    print("\\n___Medias generadas___")',
        '    print(f"Entre llegadas: {sum(ta)/n:.2f}")',
        '    print(f"Servicio:       {sum(ts)/n:.2f}")',
        '    reporte_pruebas("llegadas", ua)',
        '    reporte_pruebas("servicio", us)'
      ].join('\n')
    },
    {
      id: 'modelo',
      nombre: 'modelo_caja.py',
      etiqueta: '§2 · Algoritmo y configuración del modelo',
      icono: 'shopping-cart',
      descripcion:
        'Modelo completo por eventos discretos: entidad Cliente, cola FIFO con collections.deque, ' +
        'servidor único, generación de tiempos con transformada inversa y verificaciones automáticas ' +
        '(assert) de cantidad de clientes, disciplina FIFO y servidor único. Es el archivo que la ' +
        'sección 2.8 indica para ejecutar.',
      explicacion: [
        '<strong>Entidad:</strong> la clase Cliente guarda id, tiempo entre llegadas, tiempo de ' +
        'servicio y las horas registradas (llegada, inicio, fin); la espera se calcula como ' +
        'inicio − llegada.',
        '<strong>Cola FIFO:</strong> deque con append() al encontrar la caja ocupada y popleft() al ' +
        'liberarse: el orden de entrada es el orden de atención, sin necesidad de ordenar.',
        '<strong>Servidor:</strong> la variable servidor_ocupado inicia en False (caja libre); ' +
        'iniciar_servicio() lo marca ocupado, registra el inicio y programa el evento FIN en ' +
        'inicio + tiempo de servicio.',
        '<strong>Eventos:</strong> un heap (heapq) mantiene los eventos futuros ordenados por tiempo; ' +
        'en cada paso se procesa el más próximo: LLEGADA agenda la siguiente llegada y atiende o ' +
        'enqueuea; FIN libera la caja y activa al primero de la cola.',
        '<strong>Verificaciones:</strong> 100 clientes procesados, orden de atención creciente ' +
        '(FIFO) y que ningún inicio sea anterior al fin del cliente anterior (servidor único).'
      ],
      codigo: [
        '"""',
        'INTEGRANTE 3 - Construccion y programacion del modelo',
        'Escenario 3: Caja de supermercado en horario de baja demanda',
        'Simulacion por eventos discretos: 1 entidad Cliente, 1 cola FIFO, 1 servidor.',
        'Unidad de tiempo: minutos. Cada replica procesa exactamente 100 clientes.',
        '"""',
        'import heapq',
        'import math',
        'from collections import deque',
        '',
        'import numpy as np',
        'from scipy import stats',
        '',
        '# ---------------------------------------------------------------',
        '# 1. PARAMETROS DEL SISTEMA',
        '# ---------------------------------------------------------------',
        'N_CLIENTES = 100                       # clientes por replica',
        'SERVIDORES = 1                         # servidor unico',
        '# Distribuciones empiricas (valor, frecuencia observada de 50 datos)',
        'LLEGADAS = {1: 5, 2: 10, 3: 15, 4: 15, 5: 5}',
        'SERVICIO = {1: 10, 2: 20, 3: 15, 4: 5}',
        '',
        '',
        'def acumulada(dic):',
        '    """Devuelve (valores, F(x)) de la distribucion empirica."""',
        '    total = sum(dic.values())',
        '    xs = sorted(dic)',
        '    F, acum = [], 0.0',
        '    for x in xs:',
        '        acum += dic[x] / total',
        '        F.append(acum)',
        '    return xs, F',
        '',
        '',
        'XS_LLEG, F_LLEG = acumulada(LLEGADAS)',
        'XS_SERV, F_SERV = acumulada(SERVICIO)',
        '',
        '',
        'def inversa(u, xs, F):',
        '    """Transformada inversa discreta: primer x con u <= F(x)."""',
        '    for x, f in zip(xs, F):',
        '        if u <= f + 1e-12:',
        '            return x',
        '    return xs[-1]',
        '',
        '',
        '# ---------------------------------------------------------------',
        '# 2. ENTIDAD CLIENTE',
        '# ---------------------------------------------------------------',
        'class Cliente:',
        '    def __init__(self, ident, t_entre_llegadas, t_servicio):',
        '        self.id = ident',
        '        self.t_entre = t_entre_llegadas   # tiempo desde el cliente anterior',
        '        self.t_serv = t_servicio          # duracion de su atencion',
        '        self.llegada = None',
        '        self.inicio = None',
        '        self.fin = None',
        '',
        '    @property',
        '    def espera(self):',
        '        return self.inicio - self.llegada',
        '',
        '',
        '# ---------------------------------------------------------------',
        '# 3. MODELO DE UNA REPLICA (eventos: LLEGADA y FIN de servicio)',
        '# ---------------------------------------------------------------',
        'def replica(semilla, n_clientes=N_CLIENTES):',
        '    rng = np.random.default_rng(semilla)',
        '',
        '    def nuevo_cliente(i):',
        '        ua, us = rng.random(), rng.random()      # numeros U(0,1)',
        '        return Cliente(i, inversa(ua, XS_LLEG, F_LLEG), inversa(us, XS_SERV, F_SERV))',
        '',
        '    cola = deque()                 # COLA FIFO (append al final, popleft al frente)',
        '    servidor_ocupado = False       # estado inicial: servidor libre',
        '    eventos = []                   # lista de eventos futuros (heap por tiempo)',
        '    atendidos = []                 # clientes que ya salieron',
        '    orden_servicio = []            # para verificar FIFO',
        '',
        '    def iniciar_servicio(cli, t):',
        '        nonlocal servidor_ocupado',
        '        servidor_ocupado = True',
        '        cli.inicio = t',
        '        orden_servicio.append(cli.id)',
        '        heapq.heappush(eventos, (t + cli.t_serv, 1, cli.id, cli))   # evento FIN',
        '',
        '    # primera llegada: reloj 0 + primer tiempo entre llegadas',
        '    c = nuevo_cliente(1)',
        '    c.llegada = c.t_entre',
        '    heapq.heappush(eventos, (c.llegada, 0, c.id, c))                # evento LLEGADA',
        '    generados = 1',
        '',
        '    while eventos:',
        '        t, tipo, _, cli = heapq.heappop(eventos)',
        '        if tipo == 0:                                   # ---- LLEGADA ----',
        '            if generados < n_clientes:                  # programa la siguiente llegada',
        '                generados += 1',
        '                sig = nuevo_cliente(generados)',
        '                sig.llegada = t + sig.t_entre',
        '                heapq.heappush(eventos, (sig.llegada, 0, sig.id, sig))',
        '            if not servidor_ocupado:',
        '                iniciar_servicio(cli, t)                # atencion inmediata (espera 0)',
        '            else:',
        '                cola.append(cli)                        # espera en la cola FIFO',
        '        else:                                           # ---- FIN DE SERVICIO ----',
        '            cli.fin = t',
        '            atendidos.append(cli)                       # SALIDA del sistema',
        '            servidor_ocupado = False',
        '            if cola:',
        '                iniciar_servicio(cola.popleft(), t)     # el primero de la cola pasa',
        '',
        '    # ---------------- verificaciones del modelo ----------------',
        '    assert len(atendidos) == n_clientes, "la replica no proceso 100 clientes"',
        '    assert orden_servicio == sorted(orden_servicio), "se violo la disciplina FIFO"',
        '    ordenados = sorted(atendidos, key=lambda x: x.inicio)',
        '    for a, b in zip(ordenados, ordenados[1:]):',
        '        assert b.inicio >= a.fin - 1e-9, "dos clientes en el servidor a la vez"',
        '    return sorted(atendidos, key=lambda x: x.id)',
        '',
        '',
        'def estadisticos(clientes):',
        '    esperas = [c.espera for c in clientes]',
        '    return float(np.mean(esperas)), float(max(esperas))',
        '',
        '',
        'def intervalo_confianza(medias, conf=0.95):',
        '    n = len(medias)',
        '    m = float(np.mean(medias))',
        '    s = float(np.std(medias, ddof=1))',
        '    t = stats.t.ppf(1 - (1 - conf) / 2, n - 1)',
        '    h = t * s / math.sqrt(n)',
        '    return m, s, h, m - h, m + h, h / m',
        '',
        '',
        '# ---------------------------------------------------------------',
        '# 4. EJECUCION DE LAS REPLICAS',
        '# ---------------------------------------------------------------',
        'if __name__ == "__main__":',
        '    TOTAL_REPLICAS = 93',
        '    semillas = [101 * i for i in range(1, TOTAL_REPLICAS + 1)]',
        '',
        '    medias = []',
        '    print(f"Ejecutando {TOTAL_REPLICAS} réplicas...")',
        '    for i, s in enumerate(semillas, 1):',
        '        cl = replica(s)',
        '        m, mx = estadisticos(cl)',
        '        medias.append(m)',
        '',
        '    # Cálculo inferencial con las réplicas completas',
        '    m, s, h, lo, hi, er = intervalo_confianza(medias)',
        '',
        '    print("\\n" + "=" * 55)',
        '    print("RESULTADOS GLOBALES TRAS LAS REPLICAS")',
        '    print("=" * 55)',
        '    print(f"Total de réplicas procesadas: {len(medias)}")',
        '    print(f"Media global de espera (X_bar): {m:.4f} min")',
        '    print(f"Desviación estándar (s):        {s:.4f} min")',
        '    print(f"Margen de error (h):            {h:.4f} min")',
        '    print(f"Intervalo de Confianza al 95%:  [{lo:.4f}; {hi:.4f}] min")',
        '    print(f"Error relativo alcanzado:       {er * 100:.2f}%")',
        '    print("=" * 55)',
        '',
        '    if er <= 0.10:',
        '        print("-> Criterio cumplido: El error relativo es menor al 10%.")',
        '    else:',
        '        print("-> No cumple: Se requieren más réplicas.")'
      ].join('\n')
    },
    {
      id: 'integracion',
      nombre: 'modelo.py',
      etiqueta: 'Integración completa · reproduce las 89 réplicas',
      icono: 'blocks',
      descripcion:
        'Integración de las tres partes del trabajo: generador congruencial aditivo, modelo FIFO ' +
        'por eventos discretos y análisis inferencial. Ejecuta 5 réplicas iniciales (semillas 101–505), ' +
        'calcula el error relativo, estima las réplicas necesarias con la fórmula de ProModel y ' +
        'agrega réplicas (606, 707, 808…) hasta alcanzar Er ≤ 10 %. Con este script se obtiene el ' +
        'resultado final del documento: 89 réplicas, media 0,5996 min, IC95 % [0,5398; 0,6593] y ' +
        'Er = 9,97 %.',
      explicacion: [
        '<strong>Fase inicial:</strong> 5 réplicas con semillas 101, 202, 303, 404 y 505 → espera ' +
        'media 0,57 min, S = 0,1414, IC95 % [0,3944; 0,7456] y Er = 30,81 %.',
        '<strong>Estimación:</strong> n* = n · (Er / 0,10)² = 5 · (0,3081 / 0,10)² = 47,45 → 48 ' +
        'réplicas teóricas (43 adicionales).',
        '<strong>Fase secuencial:</strong> se siguen agregando semillas (606, 707, …) recalculando ' +
        'el error relativo en cada paso hasta que no supere el 10 %.',
        '<strong>Resultado:</strong> la parada se produce en la réplica 89 con Er = 9,97 %, es decir, ' +
        'la precisión exigida se cumple.'
      ],
      codigo: [
        '"""',
        'SIMULACION DE SISTEMAS - SEGUNDO PARCIAL (ESCENARIO 3)',
        'Integracion completa:',
        '- Generador Congruencial Aditivo (Integrante 2)',
        '- Modelo por Eventos Discretos FIFO (Integrante 3)',
        '- Ejecucion, Tablas y Analisis Inferencial (Integrante 4)',
        '"""',
        '',
        'import bisect',
        'from collections import deque',
        'import heapq',
        'import math',
        'import numpy as np',
        'from scipy import stats',
        'from scipy.stats import chi2, norm',
        '',
        '# ===============================================================',
        '# 1. GENERADOR CONGRUENCIAL ADITIVO',
        '# ===============================================================',
        'class CongruencialAditivo:',
        '    def __init__(self, semilla, j=24, k=55, m=2**31):',
        '        self.j, self.k, self.m = j, k, m',
        '        x, self.hist = semilla, []',
        '        for _ in range(k):',
        '            x = (1103515245 * x + 12345) % (2**31)',
        '            self.hist.append(x)',
        '',
        '    def siguiente(self):',
        '        x = (self.hist[-self.j] + self.hist[-self.k]) % self.m',
        '        self.hist.append(x)',
        '        self.hist.pop(0)',
        '        return x',
        '',
        '    def random(self):',
        '        return self.siguiente() / self.m',
        '',
        '# Distribuciones empiricas acumuladas',
        'llegadas = {1: 0.10, 2: 0.20, 3: 0.30, 4: 0.30, 5: 0.10}',
        'servicio = {1: 0.20, 2: 0.40, 3: 0.30, 4: 0.10}',
        '',
        'def construir_cdf(dist):',
        '    valores, acum, s = [], [], 0',
        '    for v, p in dist.items():',
        '        s += p',
        '        valores.append(v)',
        '        acum.append(round(s, 10))',
        '    return valores, acum',
        '',
        'def inversa(u, valores, acum):',
        '    idx = bisect.bisect_right(acum, u)',
        '    if idx >= len(valores):',
        '        return valores[-1]',
        '    return valores[idx]',
        '',
        'cdf_a, cdf_s = construir_cdf(llegadas), construir_cdf(servicio)',
        '',
        '# ===============================================================',
        '# 2. MODELO DE SIMULACION',
        '# ===============================================================',
        'class Cliente:',
        '    def __init__(self, ident, t_entre_llegadas, t_servicio):',
        '        self.id = ident',
        '        self.t_entre = t_entre_llegadas',
        '        self.t_serv = t_servicio',
        '        self.llegada = 0.0',
        '        self.inicio = 0.0',
        '        self.fin = 0.0',
        '',
        '    @property',
        '    def espera(self):',
        '        return self.inicio - self.llegada',
        '',
        'def replica(semilla, n_clientes=100):',
        '    # Dos generadores desfasados para independencia de llegadas y servicios',
        '    ga = CongruencialAditivo(semilla)',
        '    gs = CongruencialAditivo(semilla + 1000)',
        '',
        '    def nuevo_cliente(i):',
        '        ua, us = ga.random(), gs.random()',
        '        return Cliente(i, inversa(ua, *cdf_a), inversa(us, *cdf_s))',
        '',
        '    cola = deque()',
        '    servidor_ocupado = False',
        '    eventos = []',
        '    atendidos = []',
        '    orden_servicio = []',
        '',
        '    def iniciar_servicio(cli, t):',
        '        nonlocal servidor_ocupado',
        '        servidor_ocupado = True',
        '        cli.inicio = t',
        '        orden_servicio.append(cli.id)',
        '        heapq.heappush(eventos, (t + cli.t_serv, 1, cli.id, cli))',
        '',
        '    c1 = nuevo_cliente(1)',
        '    c1.llegada = float(c1.t_entre)',
        '    heapq.heappush(eventos, (c1.llegada, 0, c1.id, c1))',
        '    generados = 1',
        '',
        '    while eventos:',
        '        t, tipo, _, cli = heapq.heappop(eventos)',
        '        if tipo == 0:  # LLEGADA',
        '            if generados < n_clientes:',
        '                generados += 1',
        '                sig = nuevo_cliente(generados)',
        '                sig.llegada = t + sig.t_entre',
        '                heapq.heappush(eventos, (sig.llegada, 0, sig.id, sig))',
        '            if not servidor_ocupado:',
        '                iniciar_servicio(cli, t)',
        '            else:',
        '                cola.append(cli)',
        '        else:          # FIN DE SERVICIO',
        '            cli.fin = t',
        '            atendidos.append(cli)',
        '            servidor_ocupado = False',
        '            if cola:',
        '                iniciar_servicio(cola.popleft(), t)',
        '',
        '    assert len(atendidos) == n_clientes, "No se procesaron 100 clientes"',
        '    assert orden_servicio == sorted(orden_servicio), "Se violo la disciplina FIFO"',
        '    return sorted(atendidos, key=lambda x: x.id)',
        '',
        'def estadisticos(clientes):',
        '    esperas = [c.espera for c in clientes]',
        '    return float(np.mean(esperas)), float(max(esperas))',
        '',
        'def intervalo_confianza(medias, conf=0.95):',
        '    n = len(medias)',
        '    m = float(np.mean(medias))',
        '    s = float(np.std(medias, ddof=1))',
        '    t = stats.t.ppf(1 - (1 - conf) / 2, n - 1)',
        '    h = t * s / math.sqrt(n)',
        '    return m, s, h, m - h, m + h, h / m',
        '',
        '# ===============================================================',
        '# 3. EJECUCION Y ANALISIS INFERENCIAL',
        '# ===============================================================',
        'if __name__ == "__main__":',
        '',
        '    # 1. FASE INICIAL: 5 REPLICAS',
        '    semillas_ini = [101, 202, 303, 404, 505]',
        '    medias_5 = []',
        '    print("\\nTABLA 1: REPLICAS INICIALES (n = 5)")',
        '    for i, s in enumerate(semillas_ini, 1):',
        '        cl = replica(s)',
        '        m, mx = estadisticos(cl)',
        '        medias_5.append(m)',
        '        print(f"{i:>4} | {s:>8} | {len(cl):>9} | {m:>20.4f} | {mx:>11.1f}")',
        '',
        '    m5, s5, h5, lo5, hi5, er5 = intervalo_confianza(medias_5)',
        '    print(f"Media global (X_bar):    {m5:.4f} min")',
        '    print(f"Desviacion estandar (s): {s5:.4f} min")',
        '    print(f"Margen de error (h):     {h5:.4f} min")',
        '    print(f"Intervalo 95%:           [{lo5:.4f}; {hi5:.4f}] min")',
        '    print(f"Error relativo actual:   {er5 * 100:.2f}%")',
        '',
        '    # Formula de ProModel: n* = n * (error_actual / error_deseado)^2',
        '    n_star = math.ceil(len(medias_5) * (er5 / 0.10)**2)',
        '    print(f">> Replicas totales estimadas requeridas: {n_star}")',
        '    print(f">> Replicas adicionales necesarias:       {n_star - len(medias_5)}")',
        '',
        '    # 2. FASE SECUENCIAL: REPLICAS ADICIONALES HASTA ERROR <= 10%',
        '    todas_medias = list(medias_5)',
        '    todas_semillas = list(semillas_ini)',
        '    sig_semilla = 606',
        '',
        '    while True:',
        '        m_c, s_c, h_c, _, _, er_c = intervalo_confianza(todas_medias)',
        '        if er_c <= 0.10:',
        '            break',
        '        todas_semillas.append(sig_semilla)',
        '        cl = replica(sig_semilla)',
        '        m, _ = estadisticos(cl)',
        '        todas_medias.append(m)',
        '        sig_semilla += 101',
        '',
        '    print("\\n" + "=" * 68)',
        '    print(f"TABLA 2: RESULTADOS GLOBALES CON REPLICAS ADICIONALES (n = {len(todas_medias)})")',
        '    print("=" * 68)',
        '    m_fin, s_fin, h_fin, lo_fin, hi_fin, er_fin = intervalo_confianza(todas_medias)',
        '    print(f"Replicas totales ejecutadas:    {len(todas_medias)}")',
        '    print(f"Media final de espera:          {m_fin:.4f} min")',
        '    print(f"Desviacion estandar final:      {s_fin:.4f} min")',
        '    print(f"Margen de error final (h):      {h_fin:.4f} min")',
        '    print(f"Intervalo de Confianza al 95%:  [{lo_fin:.4f}; {hi_fin:.4f}] min")',
        '    print(f"Error relativo alcanzado:       {er_fin * 100:.2f}% (<= 10.00% CUMPLE)")',
        '',
        '    # 3. VERIFICACION DE LOS PRIMEROS 3 CLIENTES (SEMILLA 101)',
        '    print("\\nVERIFICACION: Reconstruccion de los primeros 3 clientes (Semilla 101):")',
        '    for c in replica(101)[:3]:',
        '        print(f"{c.id:>4} | {c.t_entre:>8} | {c.llegada:>8.1f} | {c.inicio:>8.1f} | "',
        '              f"{c.t_serv:>8} | {c.fin:>6.1f} | {c.espera:>7.1f}")'
      ].join('\n')
    }
  ];

  /* ================================================================== *
   * 8. SECCIONES Y NAVEGACIÓN                                           *
   * ================================================================== */

  var MODULOS = [
    { id: 'presentacion', num: '0', nombre: 'Presentación', icono: 'presentation' },
    { id: 'datos', num: '1', nombre: 'Análisis de datos', icono: 'bar-chart-3' },
    { id: 'sim', num: '2', nombre: 'Simulador', icono: 'shopping-cart' },
    { id: 'replicas', num: '3', nombre: 'Réplicas', icono: 'repeat' },
    { id: 'preguntas', num: '4', nombre: 'Preguntas', icono: 'help-circle' },
    { id: 'conclusiones', num: '5', nombre: 'Conclusiones', icono: 'badge-check' },
    { id: 'codigo', num: '6', nombre: 'Código', icono: 'code-2' }
  ];

  global.Datos = {
    PORTADA: PORTADA,
    ESCENARIO: ESCENARIO,
    REFERENCIA: REFERENCIA,
    INCONSISTENCIAS: INCONSISTENCIAS,
    PREGUNTAS: PREGUNTAS,
    CONCLUSIONES: CONCLUSIONES,
    CONCLUSION_GENERAL: CONCLUSION_GENERAL,
    GLOSARIO: GLOSARIO,
    CODIGOS: CODIGOS,
    MODULOS: MODULOS
  };
})(typeof window !== 'undefined' ? window : globalThis);
