/**
 * Gráficos ejecutivos en SVG puro (sin librerías). Devuelven strings SVG.
 * Paleta consistente con los design tokens.
 */
import { esc, num } from './dom.js';

export const PALETTE = ['#0072CE', '#23C7D9', '#16A36A', '#F5A623', '#8B5CF6', '#D64545', '#0EA5B7', '#475569'];
const SEM = { ok: '#16A36A', warn: '#F5A623', danger: '#D64545', info: '#0072CE', neutral: '#64748B' };
export const semColor = (s) => SEM[s] || '#0072CE';

/** Anillo de progreso. value 0..100 */
export function progressRing(value, { size = 120, stroke = 12, color = '#0072CE', label = '', sub = '' } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, value)) / 100);
  return `<div class="ring" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#EEF2F6" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
        transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>
    <div class="ring__label"><b>${value}%</b>${sub ? `<span>${esc(sub)}</span>` : (label ? `<span>${esc(label)}</span>` : '')}</div>
  </div>`;
}

/** Donut chart. data: [{label, value, color?}] */
export function donut(data, { size = 160, thickness = 26, centerLabel = '', centerSub = '' } = {}) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  let acc = 0;
  const segs = data.map((d, i) => {
    const frac = d.value / total;
    const a0 = acc * 2 * Math.PI - Math.PI / 2;
    acc += frac;
    const a1 = acc * 2 * Math.PI - Math.PI / 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const col = d.color || PALETTE[i % PALETTE.length];
    if (frac >= 0.999) {
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="${thickness}"/>`;
    }
    return `<path d="M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}"
      fill="none" stroke="${col}" stroke-width="${thickness}"/>`;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img">
    ${segs}
    ${centerLabel ? `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="22" font-weight="800" fill="#0F1B27">${esc(centerLabel)}</text>` : ''}
    ${centerSub ? `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="10" fill="#64748B">${esc(centerSub)}</text>` : ''}
  </svg>`;
}

/** Barras verticales. data: [{label, value, color?}] */
export function barChart(data, { width = 460, height = 220, color = '#0072CE', suffix = '', pad = 34 } = {}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const bw = (width - pad * 2) / data.length;
  const chartH = height - pad - 22;
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const y = pad + chartH * (1 - f);
    return `<line class="grid-line" x1="${pad}" y1="${y}" x2="${width - 6}" y2="${y}"/>
      <text x="${pad - 6}" y="${y + 3}" text-anchor="end" font-size="9" fill="#94A3B8">${num(Math.round(max * f))}</text>`;
  }).join('');
  const bars = data.map((d, i) => {
    const h = (d.value / max) * chartH;
    const x = pad + i * bw + bw * 0.18;
    const w = bw * 0.64;
    const y = pad + chartH - h;
    const col = d.color || color;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" rx="4" fill="${col}"/>
      <text x="${(x + w / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#2B3946">${num(d.value)}${suffix}</text>
      <text x="${(x + w / 2).toFixed(1)}" y="${height - 6}" text-anchor="middle" font-size="9" fill="#64748B">${esc(d.label)}</text>`;
  }).join('');
  return `<svg width="100%" viewBox="0 0 ${width} ${height}" role="img" preserveAspectRatio="xMidYMid meet">${grid}${bars}</svg>`;
}

/** Barras horizontales. data: [{label, value, color?}] */
export function hBarChart(data, { width = 460, rowH = 30, suffix = '', color = '#0072CE', labelW = 120 } = {}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const height = data.length * rowH + 10;
  const trackW = width - labelW - 54;
  const rows = data.map((d, i) => {
    const y = 6 + i * rowH;
    const w = (d.value / max) * trackW;
    const col = d.color || color;
    return `<text x="0" y="${y + rowH / 2 + 1}" font-size="10.5" fill="#2B3946" dominant-baseline="middle">${esc(d.label)}</text>
      <rect x="${labelW}" y="${y + 4}" width="${trackW}" height="${rowH - 12}" rx="5" fill="#EEF2F6"/>
      <rect x="${labelW}" y="${y + 4}" width="${Math.max(w, 2).toFixed(1)}" height="${rowH - 12}" rx="5" fill="${col}"/>
      <text x="${(labelW + Math.max(w, 2) + 6).toFixed(1)}" y="${y + rowH / 2 + 1}" font-size="10" font-weight="700" fill="#2B3946" dominant-baseline="middle">${num(d.value)}${suffix}</text>`;
  }).join('');
  return `<svg width="100%" viewBox="0 0 ${width} ${height}" role="img" preserveAspectRatio="xMidYMid meet">${rows}</svg>`;
}

/** Línea (evolución). series: [{label,color,points:[y...]}] labels: [x...] */
export function lineChart(series, labels, { width = 480, height = 220, pad = 34, suffix = '', maxHint } = {}) {
  const allVals = series.flatMap((s) => s.points);
  const max = maxHint || Math.max(...allVals, 1);
  const min = Math.min(...allVals, 0);
  const chartH = height - pad - 20;
  const chartW = width - pad - 12;
  const xFor = (i) => pad + (chartW * i) / Math.max(labels.length - 1, 1);
  const yFor = (v) => pad + chartH * (1 - (v - min) / (max - min || 1));
  const grid = [0, 0.5, 1].map((f) => {
    const y = pad + chartH * (1 - f);
    return `<line class="grid-line" x1="${pad}" y1="${y}" x2="${width - 6}" y2="${y}"/>
      <text x="${pad - 6}" y="${y + 3}" text-anchor="end" font-size="9" fill="#94A3B8">${num(Math.round(min + (max - min) * f))}</text>`;
  }).join('');
  const xlabels = labels.map((l, i) => `<text x="${xFor(i)}" y="${height - 5}" text-anchor="middle" font-size="9" fill="#64748B">${esc(l)}</text>`).join('');
  const lines = series.map((s) => {
    const pts = s.points.map((v, i) => `${xFor(i).toFixed(1)},${yFor(v).toFixed(1)}`).join(' ');
    const dots = s.points.map((v, i) => `<circle cx="${xFor(i).toFixed(1)}" cy="${yFor(v).toFixed(1)}" r="3" fill="${s.color}"/>`).join('');
    const area = `${xFor(0).toFixed(1)},${(pad + chartH).toFixed(1)} ${pts} ${xFor(s.points.length - 1).toFixed(1)},${(pad + chartH).toFixed(1)}`;
    return `<polygon points="${area}" fill="${s.color}" opacity="0.07"/>
      <polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}`;
  }).join('');
  return `<svg width="100%" viewBox="0 0 ${width} ${height}" role="img" preserveAspectRatio="xMidYMid meet">${grid}${lines}${xlabels}</svg>`;
}

/** Leyenda para charts. items: [{label,color}] */
export function legend(items) {
  return `<div class="chart-legend">${items.map((it) => `<span><i style="background:${it.color}"></i>${esc(it.label)}</span>`).join('')}</div>`;
}
