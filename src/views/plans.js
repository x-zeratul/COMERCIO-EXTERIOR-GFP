/**
 * Vista: Módulo de Planes Estratégicos (3 tarjetas premium).
 */
import { esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { badge, statusBadge, progressBar, riskIndicator } from '../lib/ui.js';
import { plans } from '../data/plans.js';

function planCard(p) {
  const critica = p.desviaciones.filter((d) => ['Alta', 'Crítica'].includes(d.severidad)).length;
  return `<article class="plan-card">
    <div class="plan-card__banner" style="background:linear-gradient(135deg, ${p.color} 0%, #0B1F33 140%)">
      <div class="plan-card__no">Plan ${esc(p.numero)}</div>
      <div class="plan-card__title">${esc(p.nombre)}</div>
      <span class="pc-icon">${icon(p.icon, 40)}</span>
    </div>
    <div class="plan-card__body">
      <p class="plan-card__desc">${esc(p.objetivo90)}</p>
      <div class="plan-card__meta">
        <div><span class="k">Responsable</span><span class="v">${esc(p.lider)}</span></div>
        <div><span class="k">Patrocinador</span><span class="v">${esc(p.patrocinador)}</span></div>
        <div><span class="k">Estado</span><span class="v">${statusBadge(p.estado)}</span></div>
        <div><span class="k">Riesgo</span><span class="v">${riskIndicator(p.nivelRiesgo)}</span></div>
      </div>
      <div>
        <div class="row" style="justify-content:space-between;margin-bottom:5px">
          <span class="muted" style="font-size:.76rem">Avance</span><b style="font-size:.82rem">${p.avance}%</b>
        </div>
        ${progressBar(p.avance)}
      </div>
      <div class="plan-card__stats">
        <div class="plan-card__stat"><b>${p.hitosCumplidos}/${p.hitosTotal}</b><span>Hitos</span></div>
        <div class="plan-card__stat"><b style="color:${critica ? 'var(--danger)' : 'var(--ok)'}">${critica}</b><span>Desv. críticas</span></div>
        <div class="plan-card__stat"><b>${p.kpis.length}</b><span>KPIs</span></div>
      </div>
      <div>
        <span class="muted" style="font-size:.72rem">Próximo hito</span>
        <div style="font-size:.8rem;font-weight:600;color:var(--text-strong)">${esc(p.proximoHito)}</div>
        <div class="source-tag" style="margin-top:4px">Actualizado: ${esc(p.fechaActualizacion)}</div>
      </div>
    </div>
    <div class="plan-card__actions">
      <a class="btn btn--primary" href="#/plan/${p.id}">${icon('eye', 15)} Ver plan</a>
      <button class="btn" data-action="infographic" data-plan="${p.id}">${icon('image', 15)} Infografía</button>
      <button class="btn" data-action="report" data-plan="${p.id}">${icon('file', 15)} Reporte</button>
      <button class="btn btn--wa" data-action="whatsapp" data-plan="${p.id}" style="grid-column:1/-1">${icon('whatsapp', 16)} Enviar por WhatsApp</button>
    </div>
  </article>`;
}

export function renderPlans() {
  return `
  <div class="page-head">
    <div class="page-head__text">
      <h1>Planes Estratégicos</h1>
      <p class="subtitle">Tres planes independientes de alto impacto en ejecución simultánea — ninguno se sustituye ni fusiona.</p>
    </div>
    <div class="page-head__actions">
      <button class="btn" data-action="report-consolidated">${icon('layers', 15)} Reporte consolidado</button>
    </div>
  </div>
  <div class="grid grid-3">
    ${plans.map(planCard).join('')}
  </div>`;
}
