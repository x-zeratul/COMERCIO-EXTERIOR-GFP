/**
 * Componentes UI reutilizables (funciones que devuelven HTML string).
 * Cubren: PlanStatusBadge, KpiCard, TrafficLight, RiskIndicator, EmptyState,
 * LoadingState, ErrorState, badges, dialog, etc.
 */
import { esc, num, semaforoFromKpi, semaforoLabel } from './dom.js';
import { icon } from './icons.js';

const RISK_MAP = { 'Bajo': 'ok', 'Medio': 'warn', 'Alto': 'danger', 'Baja': 'ok', 'Media': 'warn', 'Alta': 'danger', 'Crítica': 'danger' };
const ESTADO_MAP = {
  'Completado': 'ok', 'En ejecución': 'info', 'En planificación': 'neutral', 'No iniciado': 'neutral',
  'En riesgo': 'warn', 'Bloqueado': 'danger', 'Cancelado': 'neutral', 'Abierta': 'danger', 'En control': 'warn', 'Cerrada': 'ok',
};

export const estadoKind = (e) => ESTADO_MAP[e] || 'neutral';
export const riskKind = (r) => RISK_MAP[r] || 'neutral';

export function badge(text, kind = 'neutral', dot = true) {
  return `<span class="badge ${kind}">${dot ? '<span class="dot"></span>' : ''}${esc(text)}</span>`;
}

export function statusBadge(estado) { return badge(estado, estadoKind(estado)); }
export function severityBadge(sev) { return badge(sev, riskKind(sev)); }

export function trafficLight(kind, label) {
  return `<span class="tl ${kind}"><span class="light"></span>${label ? esc(label) : ''}</span>`;
}

export function riskIndicator(nivel) {
  const k = riskKind(nivel);
  return `<span class="tl ${k}"><span class="light"></span>Riesgo ${esc(nivel)}</span>`;
}

export function progressBar(value, kind) {
  const k = kind || (value >= 80 ? 'ok' : value >= 40 ? '' : 'warn');
  return `<div class="progress" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100">
    <div class="progress__bar ${k}" style="width:${Math.max(0, Math.min(100, value))}%"></div></div>`;
}

export function tendencia(t) {
  if (t === 'up') return `<span style="color:var(--ok)">${icon('trendUp', 14)}</span>`;
  if (t === 'down') return `<span style="color:var(--danger)">${icon('trendDown', 14)}</span>`;
  return '<span class="faint">→</span>';
}

/** KPI compacto en tarjeta. */
export function kpiCard(kpi) {
  const sem = semaforoFromKpi(kpi);
  return `<div class="kpi-card">
    <div class="kpi-card__top">
      <span class="kpi-card__name">${esc(kpi.kpi)}${kpi.ejemplo ? ' <span class="example-tag" title="Dato de ejemplo / pendiente de validación">ej.</span>' : ''}</span>
      ${trafficLight(sem)}
    </div>
    <div class="kpi-card__val">${num(kpi.actual, kpi.unidad === '%' ? 0 : (Number.isInteger(kpi.actual) ? 0 : 1))}<small style="font-size:.7rem;color:var(--text-muted)"> ${esc(kpi.unidad)}</small></div>
    <div class="kpi-card__meta"><span>Meta: ${num(kpi.meta)} ${esc(kpi.unidad)}</span><span>${tendencia(kpi.tendencia)}</span></div>
  </div>`;
}

/** Stat grande ejecutivo. */
export function statCard({ label, value, unit = '', foot = '', kind = '', icon: ic = '' }) {
  return `<div class="stat ${kind}">
    <div class="stat__label">${ic ? icon(ic, 14) : ''}${esc(label)}</div>
    <div class="stat__value">${value}${unit ? `<small> ${esc(unit)}</small>` : ''}</div>
    ${foot ? `<div class="stat__foot">${foot}</div>` : ''}
  </div>`;
}

export function emptyState(title, msg, ic = 'inbox') {
  return `<div class="state-box">${icon(ic, 40)}<h3>${esc(title)}</h3><p>${esc(msg)}</p></div>`;
}
export function loadingState(msg = 'Cargando…') {
  return `<div class="state-box">${icon('clock', 40)}<p>${esc(msg)}</p></div>`;
}
export function errorState(msg = 'Ocurrió un error') {
  return `<div class="state-box">${icon('alert', 40)}<h3>Error</h3><p>${esc(msg)}</p></div>`;
}

/** Escala cualitativa de 5 niveles. */
export function qualScale(value) {
  const on = `on${value}`;
  const segs = [1, 2, 3, 4, 5].map((n) => `<span class="seg ${n <= value ? on : ''}"></span>`).join('');
  return `<span class="qual-scale" title="Nivel ${value}/5">${segs}</span>`;
}

const ESCALA = ['Crítico', 'Bajo', 'Aceptable', 'Bueno', 'Excelente'];
export const escalaLabel = (v) => ESCALA[v - 1] || '—';

/** Dialog modal accesible. Devuelve API {close}. */
export function openDialog({ title, body, footer = '', wide = false, onClose }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'dialog-backdrop';
  backdrop.innerHTML = `<div class="dialog ${wide ? 'dialog--wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="dialog__head"><h3>${esc(title)}</h3>
      <button class="btn btn--icon btn--ghost" data-close aria-label="Cerrar">${icon('x', 18)}</button></div>
    <div class="dialog__body">${body}</div>
    ${footer ? `<div class="dialog__foot">${footer}</div>` : ''}
  </div>`;
  const close = () => { backdrop.remove(); document.removeEventListener('keydown', onKey); onClose && onClose(); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop || e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(backdrop);
  const first = backdrop.querySelector('.dialog');
  if (first) first.focus?.();
  return { close, el: backdrop };
}
