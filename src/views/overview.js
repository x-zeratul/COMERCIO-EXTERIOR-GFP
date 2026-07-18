/**
 * Vista: Executive Overview (pantalla de inicio).
 */
import { esc, num } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { statCard, progressBar, riskIndicator, badge, statusBadge } from '../lib/ui.js';
import { barChart, hBarChart, lineChart, donut, legend, progressRing, PALETTE, semColor } from '../lib/charts.js';
import { plans } from '../data/plans.js';
import { BRAND, globalMetrics, deviationsBySeverity, actionsByStatus, responsibilitiesByArea, activityLog, planName } from '../data/meta.js';
import { importsByYear } from '../data/realtrade.js';

export function renderOverview() {
  const m = globalMetrics();
  const sev = deviationsBySeverity();
  const act = actionsByStatus();
  const resp = responsibilitiesByArea();

  const heroStats = [
    statCard({ label: 'Avance global', value: m.avance + '%', kind: m.avance >= 60 ? 'ok' : 'warn', icon: 'gauge', foot: progressBar(m.avance) }),
    statCard({ label: 'Hitos cumplidos', value: m.hitosCumplidos, unit: '/ ' + m.hitosTotal, icon: 'flag', foot: `<span class="muted">${m.hitosRiesgo} pendientes o en riesgo</span>` }),
    statCard({ label: 'Desviaciones críticas', value: m.desviacionesCriticas, kind: m.desviacionesCriticas ? 'danger' : 'ok', icon: 'alert', foot: `<span class="muted">${m.desviacionesTotal} desviaciones totales</span>` }),
    statCard({ label: 'Acciones vencidas', value: m.accionesVencidas, kind: m.accionesVencidas ? 'warn' : 'ok', icon: 'clock', foot: `<span class="muted">${m.accionesTotal} acciones en el plan</span>` }),
  ].join('');

  const avancePorPlan = barChart(plans.map((p) => ({ label: p.nombreCorto, value: p.avance, color: p.color })), { suffix: '%', height: 210 });

  const sevData = [
    { label: 'Baja', value: sev['Baja'], color: '#64748B' },
    { label: 'Media', value: sev['Media'], color: '#F5A623' },
    { label: 'Alta', value: sev['Alta'], color: '#EA7A3B' },
    { label: 'Crítica', value: sev['Crítica'], color: '#D64545' },
  ];
  const sevDonut = donut(sevData, { centerLabel: String(m.desviacionesTotal), centerSub: 'desviaciones' });

  const actEntries = Object.entries(act);
  const actData = actEntries.map(([k, v], i) => ({ label: k, value: v, color: PALETTE[i % PALETTE.length] }));

  // Evolución semanal (avance simulado por plan, marcado como ejemplo).
  const weeks = ['S4', 'S5', 'S6', 'S7', 'S8', 'S9'];
  const evolution = lineChart(plans.map((p, i) => ({
    label: p.nombreCorto, color: p.color,
    points: [Math.max(10, p.avance - 34), p.avance - 27, p.avance - 19, p.avance - 12, p.avance - 5, p.avance],
  })), weeks, { height: 210, maxHint: 100 });

  const respData = resp.map(([area, n], i) => ({ label: area, value: n, color: PALETTE[i % PALETTE.length] }));

  const kpiCorp = importsByYear.slice(-4).map((r) => ({ label: String(r.year), value: r.n, color: r.year === 2026 ? '#0072CE' : '#86C5E8' }));

  const decisiones = plans.flatMap((p) => p.planAccion
    .filter((a) => a.prioridad === 'Crítica' || a.estado === 'No iniciado')
    .map((a) => ({ plan: p.nombreCorto, a })));

  const riesgos = plans.flatMap((p) => p.riesgos.slice(0, 2).map((r) => ({ plan: p.nombreCorto, r, color: p.color })));

  return `
  <div class="page-head">
    <div class="page-head__text">
      <div class="row" style="gap:8px;margin-bottom:6px">${badge('Período ' + BRAND.periodo, 'info')}${badge(BRAND.grupo.join(' · '), 'neutral', false)}</div>
      <h1>Executive Overview</h1>
      <p class="subtitle">${esc(BRAND.mensajeEjecutivo)}</p>
    </div>
    <div class="page-head__actions">
      <a class="btn" href="#/reportes">${icon('file', 15)} Reportes</a>
      <a class="btn btn--primary" href="#/planes">${icon('layers', 15)} Ver los 3 planes</a>
    </div>
  </div>

  <section class="grid grid-4" style="margin-bottom:18px">${heroStats}</section>

  <section class="grid grid-3" style="margin-bottom:18px">
    <div class="panel" style="grid-column: span 2">
      <div class="panel__head"><h3>Avance por plan</h3><span class="panel__sub">Meta de cierre: 90 días</span></div>
      ${avancePorPlan}
    </div>
    <div class="panel">
      <div class="panel__head"><h3>Desviaciones por severidad</h3></div>
      <div style="display:flex;justify-content:center">${sevDonut}</div>
      ${legend(sevData)}
    </div>
  </section>

  <section class="grid grid-3" style="margin-bottom:18px">
    <div class="panel">
      <div class="panel__head"><h3>Acciones por estado</h3></div>
      ${hBarChart(actData, { rowH: 30, labelW: 120 })}
    </div>
    <div class="panel">
      <div class="panel__head"><h3>Evolución semanal</h3><span class="panel__sub"><span class="example-tag">Datos de ejemplo</span></span></div>
      ${evolution}
      ${legend(plans.map((p) => ({ label: p.nombreCorto, color: p.color })))}
    </div>
    <div class="panel">
      <div class="panel__head"><h3>Responsabilidades por área</h3></div>
      ${hBarChart(respData, { rowH: 28, labelW: 130 })}
    </div>
  </section>

  <section class="grid grid-3" style="margin-bottom:18px">
    <div class="panel">
      <div class="panel__head">${icon('alert', 16)}<h3>Resumen de riesgos</h3></div>
      <div class="stack">
        ${riesgos.slice(0, 6).map((x) => `<div class="row" style="align-items:flex-start;gap:8px">
          <span class="dot" style="width:8px;height:8px;border-radius:50%;background:${x.color};margin-top:6px;flex:0 0 8px"></span>
          <div><b style="font-size:.72rem;color:var(--text-muted)">${esc(x.plan)}</b><div style="font-size:.83rem">${esc(x.r)}</div></div>
        </div>`).join('')}
      </div>
    </div>
    <div class="panel">
      <div class="panel__head">${icon('target', 16)}<h3>Próximas decisiones de Gerencia</h3></div>
      <div class="stack">
        ${decisiones.length ? decisiones.slice(0, 6).map((d) => `<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:7px">
          <div><div style="font-size:.84rem;font-weight:600">${esc(d.a.iniciativa)}</div><div class="muted" style="font-size:.74rem">${esc(d.plan)} · ${esc(d.a.responsable)}</div></div>
          ${badge(d.a.prioridad, d.a.prioridad === 'Crítica' ? 'danger' : 'warn')}
        </div>`).join('') : '<p class="muted">Sin decisiones críticas pendientes.</p>'}
      </div>
    </div>
    <div class="panel">
      <div class="panel__head">${icon('activity', 16)}<h3>Actividad reciente</h3><a class="btn btn--sm btn--ghost" href="#/bitacora" style="margin-left:auto">Ver todo</a></div>
      <div class="stack">
        ${activityLog.slice(0, 5).map((a) => `<div style="border-bottom:1px solid var(--border);padding-bottom:7px">
          <div style="font-size:.83rem;font-weight:600">${esc(a.cambio)}</div>
          <div class="muted" style="font-size:.73rem">${esc(a.usuario)} · ${esc(planName(a.plan))} · ${esc(a.fecha)}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="panel" style="margin-bottom:18px">
    <div class="panel__head">${icon('chart', 16)}<h3>KPIs corporativos · Importaciones del grupo</h3>
      <span class="panel__sub">Fuente real: importaciones_master.xlsx</span></div>
    <div class="grid grid-4" style="margin-bottom:14px">
      ${statCard({ label: 'Importaciones 2026 YTD', value: '83', foot: '<span class="muted">8 países · 38 proveedores</span>' })}
      ${statCard({ label: 'Importaciones 2025', value: '288', foot: '<span class="muted">17 países</span>' })}
      ${statCard({ label: 'Valor mercancía 2026', value: 'USD 848k', foot: '<span class="muted">acumulado YTD</span>' })}
      ${statCard({ label: 'Flete 2026 YTD', value: 'USD 39k', foot: '<span class="muted">optimización en curso</span>' })}
    </div>
    <div class="grid grid-2">
      <div><h4 style="font-size:.82rem;color:var(--text-muted);margin-bottom:8px">Importaciones por año</h4>${barChart(kpiCorp, { height: 190 })}</div>
      <div><h4 style="font-size:.82rem;color:var(--text-muted);margin-bottom:8px">Accesos rápidos a los planes</h4>
        <div class="stack">
          ${plans.map((p) => `<a class="row" href="#/plan/${p.id}" style="justify-content:space-between;border:1px solid var(--border);border-radius:12px;padding:12px 14px;text-decoration:none;background:var(--bg-surface-2)">
            <div class="row" style="gap:10px">${icon(p.icon, 20, '')}<div><div style="font-weight:700;color:var(--text-strong)">${esc(p.nombre)}</div><div class="muted" style="font-size:.76rem">${esc(p.tagline)}</div></div></div>
            <div class="row" style="gap:10px">${statusBadge(p.estado)}${icon('chevronRight', 16)}</div>
          </a>`).join('')}
        </div>
      </div>
    </div>
  </section>`;
}
