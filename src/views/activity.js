/**
 * Vista: Bitácora / registro de actualizaciones.
 */
import { esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { badge } from '../lib/ui.js';
import { activityLog, planName } from '../data/meta.js';

export function renderActivity() {
  const rows = activityLog.map((a) => `<tr>
    <td class="muted" style="white-space:nowrap">${esc(a.fecha)}</td>
    <td>${esc(a.usuario)}</td>
    <td>${badge(planName(a.plan), 'info', false)}</td>
    <td class="strong">${esc(a.cambio)}</td>
    <td class="muted">${esc(a.comentario)}</td>
    <td>${esc(a.estadoAnterior)} → <b>${esc(a.estadoNuevo)}</b></td>
    <td>${badge(a.evidencia, 'neutral', false)}</td>
  </tr>`).join('');
  return `
  <div class="page-head"><div class="page-head__text">
    <h1>Bitácora de actualizaciones</h1>
    <p class="subtitle">Registro trazable de cambios sobre los planes, desviaciones y acciones.</p>
  </div></div>
  <div class="panel">
    <div class="panel__head">${icon('activity', 16)}<h3>Actividad</h3><span class="panel__sub">${activityLog.length} eventos</span></div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>Fecha</th><th>Usuario</th><th>Plan</th><th>Cambio</th><th>Comentario</th><th>Estado</th><th>Evidencia</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
  </div>`;
}
