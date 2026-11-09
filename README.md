# Caja de supermercado · Simulación por eventos discretos (Escenario 3)

Sitio web interactivo que presenta y reproduce el trabajo **«Segundo Parcial – Escenario 3»** de la
materia *Simulación de Sistemas* (FCyN / Informática – UMA, La Paz, 2026): el modelado de una caja
de supermercado en horario de baja demanda mediante **simulación por eventos discretos**.

Todo lo que se muestra en la página se calcula **en vivo en el navegador**: los estadísticos, la prueba
de chi-cuadrado, la transformada inversa, la simulación animada y las réplicas inferenciales.
No hay números precargados ni imágenes de resultados.

---

## Cómo ejecutarla

No hay build ni dependencias de ejecución: basta abrir `index.html`.

```bash
# opción 1: doble clic en index.html
open index.html

# opción 2: servidor local (recomendado)
python3 -m http.server 8080
# → http://localhost:8080
```

> **Sin conexión a Internet:** Chart.js y Lucide están *vendorizados* en `assets/vendor/`.
> La página no pide nada a un CDN ni a ningún otro servicio externo.

### Despliegue en GitHub Pages

1. Subir el repositorio a GitHub.
2. *Settings → Pages → Deploy from a branch* → rama `main`, carpeta `/ (root)`.
3. La sitio queda en `https://<usuario>.github.io/<repositorio>/`.

La navegación usa *hashes* (`#sim`, `#replicas`, …), así que funciona igualmente en un subdirectorio.

---

## Estructura

```
index.html                 Página única con los 7 módulos
css/styles.css             Tema, escena del simulador, responsive
js/
  stats.js                 Estadística propia: χ², t de Student, IC 95 %, norminv
  rng.js                   Generador congruencial aditivo (§5 del PDF) + transformada inversa
  engine.js                Motor de simulación por eventos discretos (FIFO, 1 servidor)
  data.js                  Contenido académico: tablas, fórmulas, preguntas, conclusiones, códigos
  ui.js                    Utilidades compartidas (DOM, formato, tablas, Chart.js)
  module1.js               Módulo 1 · Análisis de los datos
  module2.js               Módulo 2 · Simulador animado
  module3.js               Módulo 3 · Réplicas e inferencia estadística
  module4.js               Módulo 4 · Preguntas y análisis crítico
  module5.js               Módulo 5 · Conclusiones
  module6.js               Módulo 6 · Código fuente
  app.js                   Navegación, progreso, tooltips, glosario, arranque
assets/vendor/             Chart.js 4.4.1 y Lucide (offline)
salida.txt                 Salida cruda del programa del documento (§2: 5 réplicas e inferencia)
salida2.txt                Salida cruda del §1 (frecuencias y distribuciones acumuladas)
```

> El código Python no vive en archivos sueltos del repositorio: los tres bloques
> (`generador_aleatorio.py`, `modelo_caja.py` y `modelo.py`) están incrustados en `js/data.js` y se
> muestran con resaltado en el Módulo 6.

---

## Los 7 módulos

| # | Módulo | Qué contiene |
|---|--------|--------------|
| 0 | Presentación | Portada, integrantes, características del modelo, mapa de navegación |
| 1 | Análisis de los datos | Frecuencias, estadísticos, fórmulas paso a paso, χ² = 10,00, tablas acumuladas, **herramienta interactiva de U**, primeros números aleatorios, comparación de semillas, pruebas de uniformidad |
| 2 | Simulador animado | Escena evento por evento con decoración local (luz, estantería, toldo y rótulo), **HUD en vivo** (reloj, barra de avance y estado de la caja), anillo de progreso del servicio, efectos de llegada/salida, KPIs, bitácora, **gráfico de evolución en vivo** (cola, espera media y máxima), tabla de clientes y **reconstrucción manual de los 3 primeros clientes** |
| 3 | Réplicas e inferencia | Ejecución por lotes con parada automática en **Er ≤ 10 %**, IC 95 %, gráficos de convergencia, verificación contra el PDF, tablas de las 5 réplicas (§2 y §3) e inconsistencias |
| 4 | Preguntas | 13 preguntas (5 técnicas, 5 de pensamiento crítico, 3 del escenario) con respuesta del documento y complemento |
| 5 | Conclusiones | Las 7 conclusiones + conclusión general + evaluación de la conveniencia |
| 6 | Código fuente | Los 3 bloques de Python con resaltado propio y botón de copiar |

---

## Verificación contra el documento

El motor está implementado para reproducir **exactamente** las cifras del PDF. Comprobado:

| Magnitud | Documento | Sitio |
|---|---|---|
| Primeras 5 réplicas | 0,6200 · 0,5400 · 0,7800 · 0,5100 · 0,4000 | idéntico |
| IC de esas 5 réplicas | [0,3944; 0,7456], S = 0,1414, Er = 30,81 % | idéntico |
| Réplicas necesarias (n*) | 48 | idéntico |
| Parada automática | **89 réplicas** | idéntico |
| Media de espera | 0,5996 min | idéntico |
| Desviación estándar | 0,2838 min | idéntico |
| Margen de error | 0,0598 min | idéntico |
| IC 95 % | [0,5398; 0,6593] | idéntico |
| Error relativo | 9,97 % ≤ 10 % | idéntico |
| χ² (llegadas y servicio) | 10,00 | idéntico |

**Generador:** el del §5 del documento (congruencial aditivo con *j* = 24, *k* = 55, *m* = 2³¹,
semilla inicial por LCG), con dos flujos independientes `semilla` y `semilla + 1000`. Es el que
reproduce las tablas del trabajo; `numpy.random.default_rng` (§2) **no** lo hace.

---

## Inconsistencias del documento

La regla del trabajo es **no corregir en silencio**. Se detectaron y documentaron 7 discrepancias,
visibles en el Módulo 3:

1. El §2 y el §3 publican tablas distintas para las mismas 5 réplicas (generadores distintos).
2. El error relativo impreso (0,1756 / 0,51) no da 30,81 % salvo con el denominador 0,57.
3. El texto dice «43,07 % > 10 %» mientras el cálculo da 30,81 %.
4. El bloque de n = 89 rotula «h = 0,1756» cuando corresponde 0,0598 (el §4.1.4 sí dice 0,0598).
5. La reconstrucción manual (llegada en *t* = 3, generador aditivo) y la traza del §2 (llegada en *t* = 5,
   `numpy`) ambas se atribuyen a la «semilla 101».
6. Convención de intervalos de *U*: el §1.3 usa `0 ≤ U < 0,10` y el código usa `U ≤ F(x)`.
7. El PDF reporta 89 réplicas mientras que `modelo_caja.py` fija `N_MINIMO = 93`.

---

## Tecnologías

- **HTML5 / CSS3 / JavaScript** nativos (ES5+ para máxima compatibilidad), sin framework.
- **Chart.js 4.4.1** (vendorizado) para los gráficos.
- **Lucide** (vendorizado) para los iconos.
- Estadística escrita a mano (`stats.js`): gamma y beta incompletas → `chi2inv`, `tinv`, `norminv`,
  intervalo de confianza con *t* de Student.
- Responsive (1180 / 1000 / 860 / 560 px), navegación por hash, barra de progreso, tooltips,
  glosario modal y animaciones de entrada.

---

## Equipo

| Nº | Integrante |
|---|---|
| 10 | Bautista Villcacuti Cristian William |
| 82 | Llujtaparo Machaca Tania |
| 92 | Mamani Chavez Rafael Alejandro |
| 101 | Mamani Quispe Dussan David |
| 133 | Salgado Llusco Carlos Alejandro |

**Docente:** Lic. Rosa Flores Morales · **Materia:** Simulación de Sistemas · **Curso:** INF-381
