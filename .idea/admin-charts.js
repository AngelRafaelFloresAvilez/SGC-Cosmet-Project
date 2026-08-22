/* ---------------------------------------------------------------------------
 * admin-charts.js
 * Graficas SVG sin dependencias, con el mismo lenguaje visual del prototipo:
 * area suavizada de linea verde y barras verde claro.
 * ------------------------------------------------------------------------- */
(function () {
  const PAD = { top: 14, right: 12, bottom: 30, left: 42 };

  function niceMax(value, fallback) {
    const target = Math.max(value, fallback || 10);
    const magnitude = Math.pow(10, Math.floor(Math.log10(target)));
    return Math.ceil(target / magnitude) * magnitude;
  }

  function formatTick(value, asMoney) {
    if (!asMoney) return String(value);
    if (value >= 1000) return `${value / 1000}k`;
    return String(value);
  }

  // Curva de Catmull-Rom convertida a bezier: da el trazo suave del diseño.
  function smoothPath(points) {
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const p0 = points[index - 1] || points[index];
      const p1 = points[index];
      const p2 = points[index + 1];
      const p3 = points[index + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      path += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
    }
    return path;
  }

  /**
   * Grafica de area con linea y puntos.
   * @param {HTMLElement} container
   * @param {Array<{label:string, value:number}>} data
   * @param {{money?:boolean, ticks?:number, legend?:string}} options
   */
  function lineChart(container, data, options) {
    if (!container) return;
    const config = options || {};
    if (!data.length) {
      container.innerHTML = '<p class="muted" style="text-align:center;padding-top:90px">Sin datos suficientes</p>';
      return;
    }

    const width = 640;
    const height = 240;
    const innerWidth = width - PAD.left - PAD.right;
    const innerHeight = height - PAD.top - PAD.bottom;
    const tickCount = config.ticks || 5;
    const max = niceMax(Math.max(...data.map((point) => point.value)), config.money ? 5000 : 10);

    const points = data.map((point, index) => ({
      x: PAD.left + (data.length === 1 ? innerWidth / 2 : (index / (data.length - 1)) * innerWidth),
      y: PAD.top + innerHeight - (point.value / max) * innerHeight
    }));

    const line = smoothPath(points);
    const area = `${line} L ${points[points.length - 1].x} ${PAD.top + innerHeight} L ${points[0].x} ${PAD.top + innerHeight} Z`;

    const gridLines = [];
    const axisLabels = [];
    for (let index = 0; index <= tickCount; index += 1) {
      const value = (max / tickCount) * index;
      const y = PAD.top + innerHeight - (index / tickCount) * innerHeight;
      gridLines.push(`<line class="chart-grid-line" x1="${PAD.left}" y1="${y}" x2="${width - PAD.right}" y2="${y}"></line>`);
      axisLabels.push(`<text class="chart-axis-text" x="${PAD.left - 8}" y="${y + 4}" text-anchor="end">${formatTick(value, config.money)}</text>`);
    }

    // Con muchos puntos se rota/saltea para que las etiquetas no se encimen.
    const step = data.length > 10 ? Math.ceil(data.length / 8) : 1;
    const xLabels = data.map((point, index) => (
      index % step === 0
        ? `<text class="chart-axis-text" x="${points[index].x}" y="${height - 8}" text-anchor="middle">${point.label}</text>`
        : ''
    )).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img">
        <defs>
          <linearGradient id="adminAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#87a973" stop-opacity="0.42"></stop>
            <stop offset="100%" stop-color="#87a973" stop-opacity="0.02"></stop>
          </linearGradient>
        </defs>
        ${gridLines.join('')}
        ${axisLabels.join('')}
        <path class="chart-area-fill" d="${area}"></path>
        <path class="chart-line" d="${line}"></path>
        ${points.map((point, index) => `<circle class="chart-dot" cx="${point.x}" cy="${point.y}" r="3.5"><title>${data[index].label}: ${data[index].value}</title></circle>`).join('')}
        ${xLabels}
      </svg>
      ${config.legend ? `<div class="chart-legend"><span class="dot"></span>${config.legend}</div>` : ''}
    `;
  }

  /**
   * Grafica de barras verticales.
   */
  function barChart(container, data, options) {
    if (!container) return;
    const config = options || {};
    if (!data.length) {
      container.innerHTML = '<p class="muted" style="text-align:center;padding-top:90px">Sin datos suficientes</p>';
      return;
    }

    const width = 460;
    const height = 240;
    const innerWidth = width - PAD.left - PAD.right;
    const innerHeight = height - PAD.top - PAD.bottom;
    const tickCount = config.ticks || 4;
    const max = niceMax(Math.max(...data.map((point) => point.value)), 10);
    const slot = innerWidth / data.length;
    const barWidth = slot * 0.82;

    const gridLines = [];
    const axisLabels = [];
    for (let index = 0; index <= tickCount; index += 1) {
      const value = (max / tickCount) * index;
      const y = PAD.top + innerHeight - (index / tickCount) * innerHeight;
      gridLines.push(`<line class="chart-grid-line" x1="${PAD.left}" y1="${y}" x2="${width - PAD.right}" y2="${y}"></line>`);
      axisLabels.push(`<text class="chart-axis-text" x="${PAD.left - 8}" y="${y + 4}" text-anchor="end">${value}</text>`);
    }

    const bars = data.map((point, index) => {
      const barHeight = (point.value / max) * innerHeight;
      const x = PAD.left + slot * index + (slot - barWidth) / 2;
      const y = PAD.top + innerHeight - barHeight;
      return `
        <rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${Math.max(barHeight, 0)}" rx="2">
          <title>${point.label}: ${point.value}</title>
        </rect>
        <text class="chart-axis-text" x="${x + barWidth / 2}" y="${PAD.top - 2}" text-anchor="middle">${point.label}</text>
      `;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img">
        ${gridLines.join('')}
        ${axisLabels.join('')}
        ${bars}
      </svg>
    `;
  }

  window.sgcAdminCharts = { lineChart, barChart };
})();
