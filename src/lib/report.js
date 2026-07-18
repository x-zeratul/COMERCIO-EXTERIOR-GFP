/**
 * Generador de reportes ejecutivos en HTML (imprimibles a PDF vía el diálogo
 * del navegador "Guardar como PDF"). Variantes: individual, consolidado,
 * breve (1 página) y ejecutivo completo.
 */
import { esc, num, fecha } from './dom.js';
import { escalaLabel } from './ui.js';
import { currentRole } from './store.js';

const REPORT_STYLES = `
  * { box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; color: #1e293b; margin: 0; font-size: 12px; line-height: 1.5; }
  .page { padding: 40px 46px; max-width: 900px; margin: 0 auto; }
  .cover { background: linear-gradient(135deg,#0B1F33,#12395F 60%,#0072CE); color: #fff; padding: 60px 46px; border-radius: 0; margin: -40px -46px 30px; }
  .cover .kicker { color: #23C7D9; letter-spacing: 3px; font-size: 12px; font-weight: 700; }
  .cover h1 { font-size: 30px; margin: 8px 0 6px; }
  .cover .sub { color: #cfe3f5; font-size: 14px; }
  .cover .meta { margin-top: 24px; display: flex; gap: 34px; flex-wrap: wrap; }
  .cover .meta b { display: block; font-size: 22px; }
  .cover .meta span { color: #9EC5E8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  h2 { color: #003D7A; font-size: 16px; border-bottom: 2px solid #0072CE; padding-bottom: 6px; margin: 26px 0 12px; }
  h3 { color: #0F1B27; font-size: 13px; margin: 16px 0 6px; }
  p { margin: 6px 0; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 14px; font-size: 10.5px; }
  th, td { border: 1px solid #d9e2ec; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #EAF7FF; color: #003D7A; font-size: 9.5px; text-transform: uppercase; letter-spacing: .3px; }
  .kv { display: grid; grid-template-columns: 200px 1fr; gap: 4px 12px; margin: 8px 0; }
  .kv dt { color: #64748b; font-weight: 600; }
  .pill { display: inline-block; padding: 1px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
  .ok { background: #E6F6EF; color: #0c7a4d; } .warn { background: #FEF4E2; color: #a9660a; }
  .danger { background: #FBE9E9; color: #b02929; } .info { background: #EAF7FF; color: #0059B3; } .neutral { background: #EEF2F6; color:#64748b; }
  .muted { color: #64748b; } .right { text-align: right; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .box { border: 1px solid #d9e2ec; border-radius: 8px; padding: 12px; }
  .foot { margin-top: 30px; border-top: 1px solid #d9e2ec; padding-top: 10px; color: #94a3b8; font-size: 10px; }
  .ex { background:#FEF4E2; color:#a9660a; font-size:8.5px; font-weight:700; padding:0 4px; border-radius:3px; }
  @media print { .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; } th, .pill { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 0 20px; } }
`;

const semClass = (k) => ({ ok: 'ok', warn: 'warn', danger: 'danger', info: 'info', neutral: 'neutral' }[k] || 'neutral');
const estadoClass = (e) => ({ 'Completado': 'ok', 'En ejecución': 'info', 'Abierta': 'danger', 'En control': 'warn', 'En riesgo': 'warn', 'Bloqueado': 'danger' }[e] || 'neutral');

function coverBlock(plan, titulo) {
  const now = new Date().toLocaleString('es-PE');
  return `<div class="cover">
    <div class="kicker">FRIOPACKING · PLAN ESTRATÉGICO 90 DÍAS</div>
    <h1>${esc(titulo || plan.nombre)}</h1>
    <div class="sub">${esc(plan.tagline || '')} · Benchmark: ${esc(plan.benchmark?.practicas || '')}</div>
    <div class="meta">
      <div><b>${plan.avance}%</b><span>Avance</span></div>
      <div><b>${plan.hitosCumplidos}/${plan.hitosTotal}</b><span>Hitos</span></div>
      <div><b>${plan.desviaciones.length}</b><span>Desviaciones</span></div>
      <div><b>${esc(plan.nivelRiesgo)}</b><span>Riesgo</span></div>
      <div><b>${esc(plan.estado)}</b><span>Estado</span></div>
    </div>
    <div class="sub" style="margin-top:18px">Generado: ${esc(now)} · Responsable: ${esc(currentRole().nombre)}</div>
  </div>`;
}

function kpiTable(plan) {
  return `<table><thead><tr><th>KPI</th><th>Unidad</th><th class="right">Base</th><th class="right">Meta</th><th class="right">Actual</th><th>Semáforo</th><th>Responsable</th></tr></thead><tbody>
    ${plan.kpis.map((k) => `<tr>
      <td>${esc(k.kpi)}${k.ejemplo ? ' <span class="ex">EJ</span>' : ''}</td>
      <td>${esc(k.unidad)}</td><td class="right">${num(k.lineaBase)}</td><td class="right">${num(k.meta)}</td>
      <td class="right"><b>${num(k.actual)}</b></td>
      <td><span class="pill ${semClass(k.semaforo)}">${esc(k.semaforo)}</span></td>
      <td>${esc(k.responsable)}</td></tr>`).join('')}
  </tbody></table>`;
}

function qualTable(plan) {
  return `<table><thead><tr><th>Dimensión</th><th>Nivel</th><th>Comentario</th><th>Recomendación</th></tr></thead><tbody>
    ${plan.cualitativo.map((q) => `<tr><td>${esc(q.dimension)}</td><td>${q.calificacion}/5 · ${esc(escalaLabel(q.calificacion))}</td><td>${esc(q.comentario)}</td><td>${esc(q.recomendacion)}</td></tr>`).join('')}
  </tbody></table>`;
}

function devTable(plan) {
  return `<table><thead><tr><th>Código</th><th>Descripción</th><th>Meta</th><th>Resultado</th><th>Sev.</th><th>Causa raíz</th><th>Acción correctiva</th></tr></thead><tbody>
    ${plan.desviaciones.map((d) => `<tr>
      <td><b>${esc(d.codigo)}</b></td><td>${esc(d.descripcion)}</td><td>${esc(d.meta)}</td><td>${esc(d.resultado)}</td>
      <td><span class="pill ${d.severidad === 'Crítica' || d.severidad === 'Alta' ? 'danger' : 'warn'}">${esc(d.severidad)}</span></td>
      <td>${esc(d.control.causaRaiz)}</td><td>${esc(d.control.correctiva)}</td></tr>`).join('')}
  </tbody></table>`;
}

function actTable(plan) {
  return `<table><thead><tr><th>Código</th><th>Iniciativa</th><th>Responsable</th><th>Prioridad</th><th>Estado</th><th class="right">Prog.</th><th>Compromiso</th></tr></thead><tbody>
    ${plan.planAccion.map((a) => `<tr>
      <td><b>${esc(a.codigo)}</b></td><td>${esc(a.iniciativa)}</td><td>${esc(a.responsable)}</td>
      <td>${esc(a.prioridad)}</td><td><span class="pill ${estadoClass(a.estado)}">${esc(a.estado)}</span></td>
      <td class="right">${a.progreso}%</td><td>${fecha(a.fechaCompromiso)}</td></tr>`).join('')}
  </tbody></table>`;
}

/** Reporte completo por plan. */
function fullPlanReport(plan) {
  return `${coverBlock(plan)}
    <h2>1. Resumen ejecutivo</h2>
    <div class="kv">
      <dt>Objetivo</dt><dd>${esc(plan.objetivo90)}</dd>
      <dt>Justificación</dt><dd>${esc(plan.justificacion)}</dd>
      <dt>Alcance</dt><dd>${esc(plan.alcance)}</dd>
      <dt>Resultado esperado</dt><dd>${esc(plan.resultadoEsperado)}</dd>
      <dt>Patrocinador</dt><dd>${esc(plan.patrocinador)}</dd>
      <dt>Líder</dt><dd>${esc(plan.lider)}</dd>
      <dt>Áreas participantes</dt><dd>${esc(plan.areasParticipantes.join(', '))}</dd>
      <dt>Duración</dt><dd>${esc(plan.duracion)}</dd>
    </div>
    <h2>2. Estado general y KPIs</h2>${kpiTable(plan)}
    <h2>3. Evaluación cualitativa</h2>${qualTable(plan)}
    <h2>4. Desviaciones y análisis de causa raíz</h2>${devTable(plan)}
    <h2>5. Plan de acción</h2>${actTable(plan)}
    <h2>6. Riesgos y próximos hitos</h2>
    <ul>${plan.riesgos.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    <p><b>Próximo hito:</b> ${esc(plan.proximoHito)}</p>
    <h2>7. Decisiones requeridas por Gerencia</h2>
    <ul>${plan.planAccion.filter((a) => a.prioridad === 'Crítica' || a.estado === 'No iniciado').map((a) => `<li>${esc(a.iniciativa)} — ${esc(a.proximoPaso)}</li>`).join('') || '<li>Sin decisiones críticas pendientes.</li>'}</ul>
    <div class="foot">Friopacking S.A.C. · Reporte generado automáticamente desde la aplicación ejecutiva · Fuente: Plan Estratégico 90 días (documento base) + importaciones_master.xlsx · Los indicadores marcados EJ son datos de ejemplo/pendientes de validación.</div>`;
}

/** Reporte breve de 1 página. */
function briefReport(plan) {
  const critica = plan.desviaciones.filter((d) => ['Alta', 'Crítica'].includes(d.severidad));
  return `${coverBlock(plan, plan.nombre + ' — Resumen 1 página')}
    <div class="grid2">
      <div class="box"><h3>Objetivo 90 días</h3><p>${esc(plan.objetivo90)}</p>
        <h3>Próximo hito</h3><p>${esc(plan.proximoHito)}</p></div>
      <div class="box"><h3>Indicadores clave</h3>
        <table><tbody>${plan.kpis.slice(0, 5).map((k) => `<tr><td>${esc(k.kpi)}</td><td class="right"><b>${num(k.actual)} ${esc(k.unidad)}</b></td><td class="right muted">meta ${num(k.meta)}</td></tr>`).join('')}</tbody></table>
      </div>
    </div>
    <h2>Desviaciones críticas (${critica.length})</h2>
    ${critica.length ? `<ul>${critica.map((d) => `<li><b>${esc(d.codigo)}</b>: ${esc(d.descripcion)} — ${esc(d.control.correctiva)}</li>`).join('')}</ul>` : '<p class="muted">Sin desviaciones críticas.</p>'}
    <h2>Acciones prioritarias</h2>
    <ul>${plan.planAccion.slice(0, 4).map((a) => `<li><b>${esc(a.iniciativa)}</b> — ${esc(a.responsable)} · ${esc(a.estado)} (${a.progreso}%)</li>`).join('')}</ul>
    <div class="foot">Friopacking S.A.C. · Resumen ejecutivo · ${esc(new Date().toLocaleDateString('es-PE'))}</div>`;
}

/** Reporte consolidado de los 3 planes. */
function consolidatedReport(plans) {
  const now = new Date().toLocaleString('es-PE');
  const avg = Math.round(plans.reduce((a, p) => a + p.avance, 0) / plans.length);
  return `<div class="cover">
      <div class="kicker">FRIOPACKING · TABLERO ESTRATÉGICO</div>
      <h1>Reporte Consolidado — 3 Planes Estratégicos</h1>
      <div class="sub">Período 90 días · Generado ${esc(now)} · Responsable: ${esc(currentRole().nombre)}</div>
      <div class="meta"><div><b>${avg}%</b><span>Avance global</span></div>
        <div><b>${plans.length}</b><span>Planes</span></div>
        <div><b>${plans.reduce((a, p) => a + p.desviaciones.length, 0)}</b><span>Desviaciones</span></div>
        <div><b>${plans.reduce((a, p) => a + p.hitosCumplidos, 0)}/${plans.reduce((a, p) => a + p.hitosTotal, 0)}</b><span>Hitos</span></div>
      </div>
    </div>
    <h2>Panorama por plan</h2>
    <table><thead><tr><th>Plan</th><th>Objetivo</th><th class="right">Avance</th><th>Estado</th><th>Riesgo</th><th class="right">Desv.</th></tr></thead><tbody>
      ${plans.map((p) => `<tr><td><b>${esc(p.nombre)}</b></td><td>${esc(p.objetivo90)}</td><td class="right">${p.avance}%</td>
        <td><span class="pill ${estadoClass(p.estado)}">${esc(p.estado)}</span></td><td>${esc(p.nivelRiesgo)}</td><td class="right">${p.desviaciones.length}</td></tr>`).join('')}
    </tbody></table>
    ${plans.map((p, i) => `<h2>${i + 1}. ${esc(p.nombre)}</h2>${kpiTable(p)}
      <h3>Desviaciones y acciones</h3>${devTable(p)}`).join('')}
    <div class="foot">Friopacking S.A.C. · Reporte consolidado · Fuente: Plan Estratégico 90 días + importaciones_master.xlsx</div>`;
}

/** API pública. tipo: 'completo' | 'breve' | 'consolidado' */
export function buildReport(planOrPlans, tipo = 'completo') {
  let html;
  if (tipo === 'consolidado') html = `<div class="page">${consolidatedReport(planOrPlans)}</div>`;
  else if (tipo === 'breve') html = `<div class="page">${briefReport(planOrPlans)}</div>`;
  else html = `<div class="page">${fullPlanReport(planOrPlans)}</div>`;
  return { html, styles: REPORT_STYLES };
}
export { REPORT_STYLES };
