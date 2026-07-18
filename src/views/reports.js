/**
 * Vista: Centro de reportes.
 */
import { esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { badge, statusBadge } from '../lib/ui.js';
import { plans } from '../data/plans.js';

export function renderReports() {
  const cards = plans.map((p) => `<div class="panel">
    <div class="panel__head">${icon(p.icon, 18)}<h3 style="font-size:.98rem">${esc(p.nombreCorto)}</h3>${statusBadge(p.estado)}</div>
    <p class="muted" style="font-size:.82rem;min-height:38px">${esc(p.objetivo90)}</p>
    <div class="stack" style="margin-top:8px">
      <button class="btn btn--block" data-report-plan="${p.id}" data-tipo="completo" style="justify-content:flex-start">${icon('file', 15)} Reporte completo</button>
      <button class="btn btn--block" data-report-plan="${p.id}" data-tipo="breve" style="justify-content:flex-start">${icon('file', 15)} Resumen 1 página</button>
      <div class="row" style="gap:8px">
        <button class="btn" data-action="infographic" data-plan="${p.id}" style="flex:1">${icon('image', 15)} Infografía</button>
        <button class="btn btn--wa" data-action="whatsapp" data-plan="${p.id}" style="flex:1">${icon('whatsapp', 15)} WhatsApp</button>
      </div>
    </div>
  </div>`).join('');
  return `
  <div class="page-head"><div class="page-head__text">
    <h1>Centro de reportes</h1>
    <p class="subtitle">Genera reportes ejecutivos en PDF (vía impresión del navegador), infografías y envíos por WhatsApp.</p>
  </div>
  <div class="page-head__actions">
    <button class="btn btn--primary" data-action="report-consolidated">${icon('layers', 15)} Reporte consolidado (3 planes)</button>
  </div></div>
  <div class="grid grid-3">${cards}</div>
  <div class="panel" style="margin-top:18px;background:var(--grad-brand-soft)">
    <div class="panel__head">${icon('info', 16)}<h3>Cómo se generan los PDF</h3></div>
    <p class="muted" style="font-size:.84rem">Al generar un reporte se abre una vista imprimible; en el diálogo de impresión selecciona <b>“Guardar como PDF”</b>. Las infografías se descargan en PNG/SVG de alta resolución. No se requiere backend ni conexión externa.</p>
  </div>`;
}
