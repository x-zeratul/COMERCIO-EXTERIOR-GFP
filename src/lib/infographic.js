/**
 * Generador de infografías ejecutivas en SVG nativo (alta resolución).
 * Dos formatos: 'vertical' (1080×1920, apto WhatsApp/móvil) y
 * 'horizontal' (1920×1080, apto presentación). Resume UN solo plan.
 * Usa la identidad visual Friopacking. Rasterizable a PNG y exportable a PDF.
 */
import { esc, num } from './dom.js';
import { semaforoFromKpi } from './dom.js';

const C = {
  navy: '#0B1F33', blue: '#0072CE', blueDark: '#003D7A', cyan: '#23C7D9',
  ice: '#EAF7FF', white: '#FFFFFF', ink: '#0F1B27', muted: '#5b7185',
  ok: '#16A36A', warn: '#F5A623', danger: '#D64545', line: '#E2E8F0', soft: '#F4F9FD',
};
const SEM = { ok: C.ok, warn: C.warn, danger: C.danger, info: C.blue, neutral: C.muted };

/** Divide texto en líneas por longitud aproximada de caracteres. */
function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = []; let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) { if (cur) lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

function tspans(text, x, y, maxChars, lh, attrs = '') {
  return wrap(text, maxChars).map((l, i) => `<text x="${x}" y="${y + i * lh}" ${attrs}>${esc(l)}</text>`).join('');
}

/** Logo copo de nieve para infografía. */
function logo(x, y, s = 46) {
  return `<g transform="translate(${x},${y})">
    <rect width="${s}" height="${s}" rx="13" fill="url(#igbrand)"/>
    <g stroke="#EAF7FF" stroke-width="2.4" stroke-linecap="round" transform="translate(${s / 2},${s / 2})">
      <line x1="0" y1="-${s * 0.34}" x2="0" y2="${s * 0.34}"/>
      <line x1="-${s * 0.3}" y1="-${s * 0.17}" x2="${s * 0.3}" y2="${s * 0.17}"/>
      <line x1="-${s * 0.3}" y1="${s * 0.17}" x2="${s * 0.3}" y2="-${s * 0.17}"/>
    </g>
    <circle cx="${s / 2}" cy="${s / 2}" r="4" fill="#fff"/>
  </g>`;
}

function defs() {
  return `<defs>
    <linearGradient id="igbrand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.blueDark}"/><stop offset="0.6" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.cyan}"/>
    </linearGradient>
    <linearGradient id="ighead" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy}"/><stop offset="0.55" stop-color="#12395F"/><stop offset="1" stop-color="${C.blue}"/>
    </linearGradient>
  </defs>`;
}

function metricTile(x, y, w, h, kpi) {
  const sem = semaforoFromKpi(kpi);
  const col = SEM[sem];
  const val = num(kpi.actual, kpi.unidad === '%' || Number.isInteger(kpi.actual) ? 0 : 1);
  return `<g transform="translate(${x},${y})">
    <rect width="${w}" height="${h}" rx="14" fill="#fff" stroke="${C.line}"/>
    <rect width="6" height="${h}" rx="3" fill="${col}"/>
    ${tspans(kpi.kpi, 20, 34, Math.floor(w / 8.6), 19, `font-size="14" font-weight="600" fill="${C.ink}"`)}
    <text x="20" y="${h - 34}" font-size="34" font-weight="800" fill="${C.ink}">${val}<tspan font-size="15" fill="${C.muted}"> ${esc(kpi.unidad)}</tspan></text>
    <text x="20" y="${h - 13}" font-size="12" fill="${C.muted}">Meta ${num(kpi.meta)} ${esc(kpi.unidad)}</text>
    <circle cx="${w - 22}" cy="26" r="7" fill="${col}"/>
  </g>`;
}

function flowChips(nodes, x, y, w, maxPerRow = 4) {
  const gap = 10;
  const cw = (w - gap * (maxPerRow - 1)) / maxPerRow;
  const ch = 44;
  return nodes.map((n, i) => {
    const col = i % maxPerRow, row = Math.floor(i / maxPerRow);
    const cx = x + col * (cw + gap), cy = y + row * (ch + gap);
    return `<g transform="translate(${cx},${cy})">
      <rect width="${cw}" height="${ch}" rx="10" fill="${C.ice}" stroke="${C.blue}" stroke-opacity="0.25"/>
      <text x="12" y="19" font-size="10" font-weight="700" fill="${C.blue}">${esc(n.step)}</text>
      ${tspans(n.nombre, 12, 33, Math.floor(cw / 6.5), 12, `font-size="11" font-weight="600" fill="${C.ink}"`)}
    </g>`;
  }).join('');
}

/** Genera la infografía vertical (1080×1920). */
function vertical(plan) {
  const W = 1080, H = 1920, pad = 60;
  const kpis = plan.kpis.slice(0, 6);
  const critica = plan.desviaciones.filter((d) => ['Alta', 'Crítica'].includes(d.severidad));
  const acciones = plan.planAccion.slice(0, 4);
  let y = 0;
  const head = `
    <rect width="${W}" height="360" fill="url(#ighead)"/>
    ${logo(pad, 56, 64)}
    <text x="${pad + 82}" y="88" font-size="26" font-weight="800" fill="#fff">FRIOPACKING</text>
    <text x="${pad + 82}" y="116" font-size="15" fill="#9EC5E8" letter-spacing="2">PLAN ESTRATÉGICO · 90 DÍAS</text>
    <text x="${pad}" y="196" font-size="17" fill="${C.cyan}" font-weight="700">PLAN ${esc(plan.numero)}</text>
    ${tspans(plan.nombre, pad, 240, 30, 46, `font-size="40" font-weight="800" fill="#fff"`)}
    <rect x="${pad}" y="286" width="${W - pad * 2}" height="54" rx="12" fill="rgba(255,255,255,0.12)"/>
    <text x="${pad + 18}" y="320" font-size="17" fill="#EAF7FF">Avance</text>
    <text x="${pad + 110}" y="320" font-size="19" font-weight="800" fill="#fff">${plan.avance}%</text>
    <text x="${pad + 210}" y="320" font-size="17" fill="#EAF7FF">Riesgo ${esc(plan.nivelRiesgo)}</text>
    <text x="${W - pad - 18}" y="320" text-anchor="end" font-size="17" fill="#EAF7FF">${esc(plan.estado)}</text>
  `;
  y = 410;
  const obj = `<text x="${pad}" y="${y}" font-size="18" font-weight="800" fill="${C.blue}">OBJETIVO (90 DÍAS)</text>
    ${tspans(plan.objetivo90, pad, y + 30, 66, 26, `font-size="18" fill="${C.ink}"`)}`;
  y += 30 + wrap(plan.objetivo90, 66).length * 26 + 34;

  const kY = y + 34;
  const kpiTitle = `<text x="${pad}" y="${y}" font-size="18" font-weight="800" fill="${C.blue}">INDICADORES PRINCIPALES</text>`;
  const tileW = (W - pad * 2 - 20) / 2, tileH = 104;
  const tiles = kpis.map((k, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    return metricTile(pad + col * (tileW + 20), kY + row * (tileH + 16), tileW, tileH, k);
  }).join('');
  y = kY + Math.ceil(kpis.length / 2) * (tileH + 16) + 24;

  const flowTitle = `<text x="${pad}" y="${y}" font-size="18" font-weight="800" fill="${C.blue}">FLUJO OPERATIVO</text>`;
  const flow = flowChips(plan.flujo, pad, y + 16, W - pad * 2, 4);
  y = y + 16 + Math.ceil(plan.flujo.length / 4) * 54 + 30;

  const devBox = `
    <text x="${pad}" y="${y}" font-size="18" font-weight="800" fill="${C.blue}">DESVIACIONES CRÍTICAS</text>
    <g transform="translate(${pad},${y + 16})">
      <rect width="${(W - pad * 2 - 20) / 2}" height="88" rx="14" fill="${critica.length ? '#FBE9E9' : '#E6F6EF'}"/>
      <text x="24" y="52" font-size="46" font-weight="800" fill="${critica.length ? C.danger : C.ok}">${critica.length}</text>
      <text x="90" y="40" font-size="14" fill="${C.ink}">de severidad</text>
      <text x="90" y="60" font-size="14" fill="${C.ink}">Alta / Crítica</text>
    </g>
    <g transform="translate(${pad + (W - pad * 2 - 20) / 2 + 20},${y + 16})">
      <rect width="${(W - pad * 2 - 20) / 2}" height="88" rx="14" fill="${C.soft}" stroke="${C.line}"/>
      <text x="24" y="52" font-size="46" font-weight="800" fill="${C.blue}">${plan.hitosCumplidos}/${plan.hitosTotal}</text>
      <text x="150" y="40" font-size="14" fill="${C.ink}">hitos</text>
      <text x="150" y="60" font-size="14" fill="${C.ink}">cumplidos</text>
    </g>`;
  y += 16 + 88 + 30;

  const actTitle = `<text x="${pad}" y="${y}" font-size="18" font-weight="800" fill="${C.blue}">ACCIONES PRIORITARIAS</text>`;
  const acts = acciones.map((a, i) => {
    const ay = y + 18 + i * 58;
    return `<g transform="translate(${pad},${ay})">
      <rect width="${W - pad * 2}" height="48" rx="10" fill="#fff" stroke="${C.line}"/>
      <rect width="5" height="48" rx="2.5" fill="${C.blue}"/>
      ${tspans(a.iniciativa, 20, 22, 60, 15, `font-size="15" font-weight="700" fill="${C.ink}"`)}
      <text x="20" y="40" font-size="12" fill="${C.muted}">${esc(a.responsable)} · ${esc(a.estado)} · ${a.progreso}%</text>
      <text x="${W - pad * 2 - 16}" y="30" text-anchor="end" font-size="13" font-weight="700" fill="${C.blue}">${esc(a.prioridad)}</text>
    </g>`;
  }).join('');
  y += 18 + acciones.length * 58 + 20;

  const foot = `
    <line x1="${pad}" y1="${H - 128}" x2="${W - pad}" y2="${H - 128}" stroke="${C.line}"/>
    <text x="${pad}" y="${H - 92}" font-size="15" fill="${C.muted}">Próximo hito</text>
    ${tspans(plan.proximoHito, pad, H - 66, 74, 22, `font-size="16" font-weight="600" fill="${C.ink}"`)}
    <text x="${pad}" y="${H - 28}" font-size="13" fill="${C.muted}">Actualizado: ${esc(plan.fechaActualizacion)} · Fuente: Plan Estratégico 90 días · Benchmark: ${esc(plan.benchmark.practicas)}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter, Arial, sans-serif">
    ${defs()}<rect width="${W}" height="${H}" fill="${C.white}"/>
    ${head}${obj}${kpiTitle}${tiles}${flowTitle}${flow}${devBox}${actTitle}${acts}${foot}
  </svg>`;
}

/** Genera la infografía horizontal (1920×1080). */
function horizontal(plan) {
  const W = 1920, H = 1080, pad = 64;
  const kpis = plan.kpis.slice(0, 6);
  const critica = plan.desviaciones.filter((d) => ['Alta', 'Crítica'].includes(d.severidad));
  const acciones = plan.planAccion.slice(0, 4);
  const leftW = 620;
  const head = `
    <rect width="${leftW}" height="${H}" fill="url(#ighead)"/>
    ${logo(pad, 58, 64)}
    <text x="${pad + 82}" y="90" font-size="28" font-weight="800" fill="#fff">FRIOPACKING</text>
    <text x="${pad + 82}" y="118" font-size="14" fill="#9EC5E8" letter-spacing="2">PLAN ESTRATÉGICO · 90 DÍAS</text>
    <text x="${pad}" y="210" font-size="18" fill="${C.cyan}" font-weight="700">PLAN ${esc(plan.numero)}</text>
    ${tspans(plan.nombre, pad, 256, 24, 48, `font-size="42" font-weight="800" fill="#fff"`)}
    <text x="${pad}" y="392" font-size="16" font-weight="700" fill="${C.cyan}">OBJETIVO 90 DÍAS</text>
    ${tspans(plan.objetivo90, pad, 424, 46, 27, `font-size="19" fill="#EAF7FF"`)}
    <g transform="translate(${pad},640)">
      <rect width="${leftW - pad * 2}" height="70" rx="14" fill="rgba(255,255,255,0.12)"/>
      <text x="22" y="30" font-size="14" fill="#9EC5E8">AVANCE</text><text x="22" y="56" font-size="26" font-weight="800" fill="#fff">${plan.avance}%</text>
      <text x="180" y="30" font-size="14" fill="#9EC5E8">HITOS</text><text x="180" y="56" font-size="26" font-weight="800" fill="#fff">${plan.hitosCumplidos}/${plan.hitosTotal}</text>
      <text x="340" y="30" font-size="14" fill="#9EC5E8">RIESGO</text><text x="340" y="56" font-size="20" font-weight="800" fill="#fff">${esc(plan.nivelRiesgo)}</text>
    </g>
    <text x="${pad}" y="800" font-size="15" font-weight="700" fill="${C.cyan}">FLUJO OPERATIVO</text>
    ${tspans(plan.flujo.map((n) => n.nombre).join(' → '), pad, 830, 48, 26, `font-size="16" fill="#EAF7FF"`)}
    <text x="${pad}" y="${H - 42}" font-size="13" fill="#7fa8cf">Actualizado ${esc(plan.fechaActualizacion)} · Benchmark: ${esc(plan.benchmark.practicas)}</text>`;

  const rx = leftW + 56;
  const kpiTitle = `<text x="${rx}" y="120" font-size="18" font-weight="800" fill="${C.blue}">INDICADORES PRINCIPALES</text>`;
  const colW = (W - rx - pad - 40) / 3, tileH = 118;
  const tiles = kpis.map((k, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    return metricTile(rx + col * (colW + 20), 140 + row * (tileH + 18), colW, tileH, k);
  }).join('');
  const yAfter = 140 + 2 * (tileH + 18) + 20;
  const devBox = `
    <g transform="translate(${rx},${yAfter})">
      <rect width="${colW}" height="96" rx="14" fill="${critica.length ? '#FBE9E9' : '#E6F6EF'}"/>
      <text x="22" y="44" font-size="14" fill="${C.ink}">Desviaciones críticas</text>
      <text x="22" y="82" font-size="42" font-weight="800" fill="${critica.length ? C.danger : C.ok}">${critica.length}</text>
    </g>
    <g transform="translate(${rx + colW + 20},${yAfter})">
      <rect width="${colW * 2 + 20}" height="96" rx="14" fill="${C.soft}" stroke="${C.line}"/>
      <text x="22" y="34" font-size="14" font-weight="700" fill="${C.blue}">PRÓXIMO HITO</text>
      ${tspans(plan.proximoHito, 22, 62, 62, 24, `font-size="17" font-weight="600" fill="${C.ink}"`)}
    </g>`;
  const actY = yAfter + 118;
  const actTitle = `<text x="${rx}" y="${actY}" font-size="18" font-weight="800" fill="${C.blue}">ACCIONES PRIORITARIAS</text>`;
  const acts = acciones.map((a, i) => {
    const ay = actY + 18 + i * 52;
    return `<g transform="translate(${rx},${ay})">
      <rect width="${W - rx - pad}" height="42" rx="10" fill="#fff" stroke="${C.line}"/>
      <rect width="5" height="42" rx="2.5" fill="${C.blue}"/>
      <text x="20" y="27" font-size="15" font-weight="700" fill="${C.ink}">${esc(a.iniciativa)}</text>
      <text x="${W - rx - pad - 16}" y="27" text-anchor="end" font-size="13" fill="${C.muted}">${esc(a.responsable)} · ${a.progreso}%</text>
    </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter, Arial, sans-serif">
    ${defs()}<rect width="${W}" height="${H}" fill="${C.white}"/>
    ${head}${kpiTitle}${tiles}${devBox}${actTitle}${acts}
  </svg>`;
}

export function buildInfographic(plan, format = 'vertical') {
  return format === 'horizontal' ? horizontal(plan) : vertical(plan);
}
export const INFOGRAPHIC_SIZE = {
  vertical: { width: 1080, height: 1920 },
  horizontal: { width: 1920, height: 1080 },
};
