/**
 * Utilidades DOM mínimas (sin frameworks). Renderizado por template strings
 * con escape seguro + un pequeño helper de eventos delegados.
 */

/** Escapa texto para insertar como HTML de forma segura. */
export function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Formatea número con separador de miles es-PE. */
export function num(n, dec = 0) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return Number(n).toLocaleString('es-PE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/** Formato moneda USD compacto. */
export function usd(n) {
  if (!n && n !== 0) return '—';
  if (Math.abs(n) >= 1000) return 'USD ' + (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k';
  return 'USD ' + num(n);
}

/** Query helpers. */
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Delegación de eventos: on(root, 'click', '[data-x]', handler). */
export function on(root, type, selector, handler) {
  root.addEventListener(type, (e) => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) handler(e, target);
  });
}

/** Semáforo a partir de un valor vs meta (mayor es mejor por defecto). */
export function semaforoFromKpi(kpi) {
  if (kpi.semaforo) return kpi.semaforo;
  const higherBetter = !['días', 'horas', 'u', 'pp'].includes(kpi.unidad) || kpi.tendencia === 'up';
  const ratio = kpi.meta ? kpi.actual / kpi.meta : 1;
  if (higherBetter) return ratio >= 0.95 ? 'ok' : ratio >= 0.8 ? 'warn' : 'danger';
  return kpi.actual <= kpi.meta ? 'ok' : kpi.actual <= kpi.meta * 1.5 ? 'warn' : 'danger';
}

const SEM_LABEL = { ok: 'En meta', warn: 'En alerta', danger: 'Crítico', info: 'Informativo', neutral: 'Neutro' };
export const semaforoLabel = (s) => SEM_LABEL[s] || s;

/** Fecha corta legible. */
export function fecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Toast notifications. */
export function toast(msg, kind = '') {
  let wrap = $('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast ' + kind;
  t.setAttribute('role', 'status');
  t.innerHTML = esc(msg);
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3200);
}
