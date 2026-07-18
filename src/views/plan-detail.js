/**
 * Vista: Detalle de un plan estratégico (pestañas A–H).
 *  A Resumen · B Fases/Cronograma · C Flujo · D KPIs · E Cualitativo
 *  F Desviaciones · G Control · H Plan de acción
 */
import { esc, num, fecha, semaforoFromKpi, semaforoLabel } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import {
  badge, statusBadge, severityBadge, progressBar, riskIndicator, trafficLight, tendencia,
  qualScale, escalaLabel, estadoKind, openDialog,
} from '../lib/ui.js';
import { progressRing, semColor } from '../lib/charts.js';

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: 'info' },
  { id: 'fases', label: 'Fases y cronograma', icon: 'calendar' },
  { id: 'flujo', label: 'Flujo operativo', icon: 'route' },
  { id: 'kpis', label: 'KPIs cuantitativos', icon: 'chart' },
  { id: 'cualitativo', label: 'Cualitativo', icon: 'gauge' },
  { id: 'desviaciones', label: 'Desviaciones', icon: 'alert' },
  { id: 'control', label: 'Control', icon: 'shield' },
  { id: 'accion', label: 'Plan de acción', icon: 'target' },
];

/* --------------------------------- A. Resumen --------------------------------- */
function tabResumen(p) {
  return `<div class="grid grid-3">
    <div class="panel" style="grid-column: span 2">
      <div class="panel__head"><h3>Resumen ejecutivo</h3></div>
      <dl class="kv">
        <dt>Objetivo (90 días)</dt><dd>${esc(p.objetivo90)}</dd>
        <dt>Justificación</dt><dd>${esc(p.justificacion)}</dd>
        <dt>Alcance</dt><dd>${esc(p.alcance)}</dd>
        <dt>Resultado esperado</dt><dd>${esc(p.resultadoEsperado)}</dd>
        <dt>Patrocinador ejecutivo</dt><dd>${esc(p.patrocinador)}</dd>
        <dt>Líder del plan</dt><dd>${esc(p.lider)}</dd>
        <dt>Áreas participantes</dt><dd>${p.areasParticipantes.map((a) => badge(a, 'neutral', false)).join(' ')}</dd>
        <dt>Recursos / stack</dt><dd>${p.recursos.map((a) => badge(a, 'info', false)).join(' ')}</dd>
        <dt>Duración</dt><dd>${esc(p.duracion)}</dd>
        <dt>Benchmark</dt><dd>${esc(p.benchmark.practicas)}</dd>
      </dl>
    </div>
    <div class="stack">
      <div class="panel" style="text-align:center">
        <div class="panel__head" style="justify-content:center"><h3>Avance</h3></div>
        <div style="display:flex;justify-content:center;margin:6px 0 12px">${progressRing(p.avance, { color: p.color, sub: 'del plan' })}</div>
        <div class="row" style="justify-content:center;gap:8px">${statusBadge(p.estado)}${riskIndicator(p.nivelRiesgo)}</div>
      </div>
      <div class="panel">
        <div class="panel__head"><h3>Características</h3></div>
        <div class="stack">${p.caracteristicas.map((c) => `<div class="row" style="gap:8px">${icon('check', 15, '')}<span style="font-size:.86rem">${esc(c)}</span></div>`).join('')}</div>
      </div>
      <div class="panel">
        <div class="panel__head"><h3>Riesgos del plan</h3></div>
        <ul style="margin:0;padding-left:18px;font-size:.84rem" class="stack">${p.riesgos.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      </div>
    </div>
  </div>`;
}

/* --------------------------- B. Fases y cronograma --------------------------- */
function tabFases(p) {
  const phases = p.fases.map((f) => `<div class="phase ${f.estado}">
    <div class="phase__no">${esc(f.no)} · ${f.estado === 'done' ? 'Completada' : f.estado === 'active' ? 'En curso' : 'Pendiente'}</div>
    <div class="phase__name">${esc(f.nombre)}</div>
    <div class="phase__weeks">Semanas ${esc(f.semanas)}</div>
    <div class="phase__acts">${f.actividades.map((a) => `<div class="phase__act">${icon('chevronRight', 13)}<span>${esc(a)}</span></div>`).join('')}</div>
  </div>`).join('');

  // Gantt simplificado 12 semanas.
  const weekStart = new Date('2026-05-19');
  const dayToWeek = (iso) => {
    if (!iso) return 0;
    const d = new Date(iso + 'T00:00:00');
    return Math.max(0, Math.min(12, (d - weekStart) / (7 * 864e5)));
  };
  const gRows = p.cronograma.map((c) => {
    const start = dayToWeek(c.fechaPlan) - 1.4;
    const s = Math.max(0, start);
    const w = Math.max(1.2, (c.fechaReal ? dayToWeek(c.fechaReal) : dayToWeek(c.fechaPlan)) - s);
    const kind = c.estado === 'Completado' ? 'done' : c.diasDesv > 0 ? 'warn' : '';
    return `<div class="gantt__row">
      <div class="gantt__label" title="${esc(c.actividad)}">${esc(c.actividad)}</div>
      <div class="gantt__track">
        <div class="gantt__bar ${kind}" style="left:${(s / 12 * 100).toFixed(1)}%;width:${(w / 12 * 100).toFixed(1)}%">${c.avance}%</div>
      </div>
    </div>`;
  }).join('');

  const cronTable = `<div class="table-wrap"><table class="tbl">
    <thead><tr><th>Actividad</th><th>Responsable</th><th>Entregable</th><th>Dependencias</th><th>Estado</th><th>Avance</th><th>Fecha plan</th><th>Fecha real</th><th>Desv. (días)</th></tr></thead>
    <tbody>${p.cronograma.map((c) => `<tr>
      <td class="strong">${esc(c.actividad)}</td><td>${esc(c.responsable)}</td><td>${esc(c.entregable)}</td><td class="muted">${esc(c.dependencias)}</td>
      <td>${statusBadge(c.estado)}</td><td style="min-width:90px">${progressBar(c.avance)}</td>
      <td>${fecha(c.fechaPlan)}</td><td>${c.fechaReal ? fecha(c.fechaReal) : '<span class="faint">—</span>'}</td>
      <td class="num"><b style="color:${c.diasDesv > 0 ? 'var(--danger)' : c.diasDesv < 0 ? 'var(--ok)' : 'var(--text-muted)'}">${c.diasDesv > 0 ? '+' : ''}${c.diasDesv}</b></td>
    </tr>`).join('')}</tbody></table></div>`;

  return `
    <div class="panel" style="margin-bottom:18px">
      <div class="panel__head"><h3>Fases del plan (90 días)</h3><span class="panel__sub">Diagnóstico · Implementación · Consolidación</span></div>
      <div class="phase-track">${phases}</div>
    </div>
    <div class="panel" style="margin-bottom:18px">
      <div class="panel__head"><h3>Cronograma (Gantt simplificado)</h3></div>
      <div class="gantt__scale"><span></span><div class="gantt__weeks">${Array.from({ length: 12 }, (_, i) => `<span>S${i + 1}</span>`).join('')}</div></div>
      <div class="gantt">${gRows}</div>
      <div class="pill-legend" style="margin-top:12px"><span><i style="background:var(--brand-600)"></i>En curso</span><span><i style="background:var(--ok)"></i>Completado</span><span><i style="background:var(--warn)"></i>Con desviación</span></div>
    </div>
    <div class="panel">
      <div class="panel__head"><h3>Detalle de actividades</h3></div>
      ${cronTable}
    </div>`;
}

/* ------------------------------- C. Flujo operativo ------------------------------- */
function tabFlujo(p) {
  const nodes = p.flujo.map((n, i) => `<div class="flow-node ${i === 0 ? 'sel' : ''}" data-node="${i}" tabindex="0" role="button" aria-label="${esc(n.nombre)}">
    <div class="flow-node__step">PASO ${esc(n.step)}</div>
    <div class="flow-node__name">${esc(n.nombre)}</div>
    <div class="flow-node__area">${esc(n.area)}</div>
    <div style="margin-top:6px">${trafficLight(n.estado)}</div>
    <span class="flow-node__arrow">${icon('arrowRight', 18)}</span>
  </div>`).join('');
  return `
    <div class="panel">
      <div class="panel__head"><h3>Flujo operativo interactivo</h3><span class="panel__sub">Selecciona un nodo para ver su detalle</span></div>
      <div class="flow">${nodes}</div>
      <div class="flow-detail" data-flow-detail>${flowNodeDetail(p.flujo[0])}</div>
    </div>`;
}
function flowNodeDetail(n) {
  return `<div class="panel" style="background:var(--bg-surface-2);border-style:dashed">
    <div class="panel__head"><h3>${icon('route', 16)} ${esc(n.nombre)}</h3>${trafficLight(n.estado, semaforoLabel(n.estado))}</div>
    <div class="grid grid-3">
      <dl class="kv" style="grid-template-columns:100px 1fr">
        <dt>Área</dt><dd>${esc(n.area)}</dd>
        <dt>Responsable</dt><dd>${esc(n.responsable)}</dd>
        <dt>Entrada</dt><dd>${esc(n.entrada)}</dd>
      </dl>
      <dl class="kv" style="grid-template-columns:100px 1fr">
        <dt>Actividad</dt><dd>${esc(n.actividad)}</dd>
        <dt>Salida</dt><dd>${esc(n.salida)}</dd>
        <dt>Indicador</dt><dd>${esc(n.indicador)}</dd>
      </dl>
      <dl class="kv" style="grid-template-columns:100px 1fr">
        <dt>Riesgo</dt><dd>${esc(n.riesgo)}</dd>
        <dt>Evidencias</dt><dd>${n.evidencias.map((e) => badge(e, 'info', false)).join(' ')}</dd>
      </dl>
    </div>
  </div>`;
}

/* ------------------------------ D. KPIs cuantitativos ------------------------------ */
function tabKpis(p) {
  const rows = p.kpis.map((k) => {
    const sem = semaforoFromKpi(k);
    const varAbs = k.actual - k.lineaBase;
    const varPct = k.lineaBase ? Math.round((varAbs / k.lineaBase) * 100) : 0;
    return `<tr>
      <td class="strong">${esc(k.kpi)}${k.ejemplo ? ' <span class="example-tag" title="Dato de ejemplo / pendiente de validación">ej.</span>' : ''}<div class="muted" style="font-size:.72rem;font-weight:400">${esc(k.definicion)}</div></td>
      <td class="muted" style="font-size:.75rem">${esc(k.formula)}</td>
      <td>${esc(k.unidad)}</td>
      <td class="num">${num(k.lineaBase)}</td><td class="num strong">${num(k.meta)}</td><td class="num strong">${num(k.actual)}</td>
      <td class="num">${varAbs > 0 ? '+' : ''}${num(varAbs)}</td>
      <td class="num">${varPct > 0 ? '+' : ''}${varPct}%</td>
      <td>${tendencia(k.tendencia)}</td>
      <td>${esc(k.frecuencia)}</td><td class="muted" style="font-size:.75rem">${esc(k.fuente)}</td><td>${esc(k.responsable)}</td>
      <td>${trafficLight(sem, semaforoLabel(sem))}</td>
      <td class="muted" style="font-size:.75rem;min-width:150px">${esc(k.comentario)}</td>
    </tr>`;
  }).join('');
  return `<div class="panel">
    <div class="panel__head"><h3>Base de datos cuantitativa</h3><span class="panel__sub">${p.kpis.length} indicadores</span></div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>KPI · Definición</th><th>Fórmula</th><th>Unidad</th><th>Línea base</th><th>Meta</th><th>Actual</th><th>Var. abs.</th><th>Var. %</th><th>Tend.</th><th>Frecuencia</th><th>Fuente</th><th>Responsable</th><th>Semáforo</th><th>Comentario</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <p class="muted" style="font-size:.74rem;margin-top:10px">Los indicadores marcados con <span class="example-tag">ej.</span> son datos de ejemplo/pendientes de validación. La cobertura y volumen de importaciones provienen de importaciones_master.xlsx.</p>
  </div>`;
}

/* ------------------------------ E. Cualitativo ------------------------------ */
function tabCualitativo(p) {
  const prom = (p.cualitativo.reduce((a, q) => a + q.calificacion, 0) / p.cualitativo.length).toFixed(1);
  const rows = p.cualitativo.map((q) => `<div class="qual-row">
    <div>
      <div class="row" style="gap:10px;margin-bottom:3px"><b style="font-size:.9rem">${esc(q.dimension)}</b>${badge(escalaLabel(q.calificacion), q.calificacion >= 4 ? 'ok' : q.calificacion === 3 ? 'warn' : 'danger')}</div>
      <div class="muted" style="font-size:.8rem">${esc(q.comentario)}</div>
      <div style="font-size:.76rem;margin-top:4px"><b class="muted">Recomendación:</b> ${esc(q.recomendacion)}</div>
      <div class="row" style="gap:14px;margin-top:5px;font-size:.72rem" class="muted">
        <span class="muted">Evidencia: ${esc(q.evidencia)}</span><span class="muted">Riesgo: ${esc(q.riesgo)}</span><span class="faint">${fecha(q.fecha)}</span>
      </div>
    </div>
    <div style="text-align:right">${qualScale(q.calificacion)}<div style="font-size:1.4rem;font-weight:800;color:var(--text-strong);margin-top:6px">${q.calificacion}<span style="font-size:.8rem;color:var(--text-muted)">/5</span></div></div>
  </div>`).join('');
  return `<div class="panel">
    <div class="panel__head"><h3>Presentación cualitativa</h3>
      <span class="panel__actions">${badge('Promedio ' + prom + '/5', prom >= 4 ? 'ok' : prom >= 3 ? 'warn' : 'danger')}</span></div>
    <div class="pill-legend" style="margin-bottom:8px"><span>Escala:</span>
      <span><i style="background:var(--danger)"></i>1 Crítico</span><span><i style="background:#ef8a3d"></i>2 Bajo</span>
      <span><i style="background:var(--warn)"></i>3 Aceptable</span><span><i style="background:#6bb56b"></i>4 Bueno</span><span><i style="background:var(--ok)"></i>5 Excelente</span></div>
    ${rows}
  </div>`;
}

/* ------------------------------ F. Desviaciones ------------------------------ */
function tabDesviaciones(p) {
  const rows = p.desviaciones.map((d) => `<tr data-dev="${esc(d.codigo)}" style="cursor:pointer">
    <td class="strong">${esc(d.codigo)}</td>
    <td>${esc(d.descripcion)}<div class="muted" style="font-size:.72rem">${esc(d.kpiActividad)}</div></td>
    <td>${esc(d.meta)}</td><td class="strong">${esc(d.resultado)}</td><td>${esc(d.variacion)}</td>
    <td>${badge(d.tipo, 'neutral', false)}</td>
    <td>${severityBadge(d.severidad)}</td>
    <td>${esc(d.responsable)}</td>
    <td>${fecha(d.fechaLimite)}</td>
    <td>${badge(d.estado, estadoKind(d.estado))}</td>
    <td>${icon('eye', 15)}</td>
  </tr>`).join('');
  return `<div class="panel">
    <div class="panel__head"><h3>Registro de desviaciones</h3><span class="panel__sub">${p.desviaciones.length} registradas · clic para ver control</span></div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>Código</th><th>Descripción</th><th>Meta</th><th>Resultado</th><th>Variación</th><th>Tipo</th><th>Severidad</th><th>Responsable</th><th>Fecha límite</th><th>Estado</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table></div>
  </div>`;
}

export function deviationDetail(d) {
  const c = d.control;
  const cycle = ['Detectar', 'Analizar', 'Asignar', 'Corregir', 'Verificar', 'Cerrar', 'Estandarizar'];
  const onStep = c.estado === 'Cerrada' ? 6 : c.avance >= 60 ? 3 : c.avance >= 30 ? 2 : 1;
  return `
    <div class="grid grid-2" style="margin-bottom:16px">
      <dl class="kv" style="grid-template-columns:130px 1fr">
        <dt>Código</dt><dd><b>${esc(d.codigo)}</b></dd>
        <dt>KPI / actividad</dt><dd>${esc(d.kpiActividad)}</dd>
        <dt>Descripción</dt><dd>${esc(d.descripcion)}</dd>
        <dt>Meta / Resultado</dt><dd>${esc(d.meta)} → <b>${esc(d.resultado)}</b> (${esc(d.variacion)})</dd>
        <dt>Tipo / Severidad</dt><dd>${badge(d.tipo, 'neutral', false)} ${severityBadge(d.severidad)}</dd>
      </dl>
      <dl class="kv" style="grid-template-columns:130px 1fr">
        <dt>Causa probable</dt><dd>${esc(d.causaProbable)}</dd>
        <dt>Impacto operativo</dt><dd>${esc(d.impactoOperativo)}</dd>
        <dt>Impacto financiero</dt><dd>${esc(d.impactoFinanciero)}</dd>
        <dt>Detección / Límite</dt><dd>${fecha(d.fechaDeteccion)} → ${fecha(d.fechaLimite)}</dd>
        <dt>Estado</dt><dd>${badge(d.estado, estadoKind(d.estado))}</dd>
      </dl>
    </div>
    <h4 style="color:var(--brand-700);font-size:.9rem;margin-bottom:6px">Control de desviación</h4>
    <div class="dev-cycle">${cycle.map((s, i) => `<span class="dev-cycle__step ${i <= onStep ? 'on' : ''}">${esc(s)}</span>${i < cycle.length - 1 ? `<span class="dev-cycle__arr">${icon('arrowRight', 13)}</span>` : ''}`).join('')}</div>
    <div class="grid grid-2" style="margin-top:14px">
      <div class="panel" style="background:var(--bg-surface-2)">
        <b style="font-size:.82rem">Análisis de causa raíz · ${esc(c.tecnica)}</b>
        <div style="margin:8px 0"><span class="muted" style="font-size:.78rem">Causa raíz:</span> ${esc(c.causaRaiz)}</div>
        <ol class="five-whys">${c.cincoPorques.map((w) => `<li>${esc(w)}</li>`).join('')}</ol>
      </div>
      <div class="panel" style="background:var(--bg-surface-2)">
        <dl class="kv" style="grid-template-columns:120px 1fr;font-size:.82rem">
          <dt>Contención</dt><dd>${esc(c.contencion)}</dd>
          <dt>Correctiva</dt><dd>${esc(c.correctiva)}</dd>
          <dt>Preventiva</dt><dd>${esc(c.preventiva)}</dd>
          <dt>Responsable</dt><dd>${esc(c.responsable)}</dd>
          <dt>Aprobador</dt><dd>${esc(c.aprobador)}</dd>
          <dt>Compromiso</dt><dd>${fecha(c.fechaCompromiso)}</dd>
          <dt>Verificación</dt><dd>${esc(c.verificacion)}</dd>
          <dt>Lección aprendida</dt><dd>${esc(c.leccion)}</dd>
        </dl>
        <div style="margin-top:8px"><span class="muted" style="font-size:.76rem">Avance del control</span>${progressBar(c.avance)}</div>
      </div>
    </div>`;
}

/* ------------------------------ G. Control ------------------------------ */
function tabControl(p) {
  const cycle = ['Detectar', 'Analizar', 'Asignar', 'Corregir', 'Verificar', 'Cerrar', 'Estandarizar'];
  const cards = p.desviaciones.map((d) => {
    const c = d.control;
    return `<div class="panel" style="margin-bottom:14px">
      <div class="panel__head">
        <h3 style="font-size:.95rem">${esc(d.codigo)} · ${esc(d.kpiActividad)}</h3>
        <span class="panel__actions">${severityBadge(d.severidad)}${badge(c.estado, estadoKind(c.estado))}</span>
      </div>
      <div class="grid grid-3">
        <div><span class="muted" style="font-size:.74rem">Causa raíz (${esc(c.tecnica)})</span><p style="font-size:.83rem">${esc(c.causaRaiz)}</p></div>
        <div><span class="muted" style="font-size:.74rem">Acción correctiva</span><p style="font-size:.83rem">${esc(c.correctiva)}</p></div>
        <div><span class="muted" style="font-size:.74rem">Acción preventiva</span><p style="font-size:.83rem">${esc(c.preventiva)}</p></div>
      </div>
      <div class="row" style="justify-content:space-between;margin-top:10px">
        <span class="muted" style="font-size:.76rem">Responsable: <b>${esc(c.responsable)}</b> · Aprobador: ${esc(c.aprobador)} · Compromiso: ${fecha(c.fechaCompromiso)}</span>
        <button class="btn btn--sm" data-dev="${esc(d.codigo)}">${icon('eye', 14)} Ver ciclo completo</button>
      </div>
      <div style="margin-top:8px">${progressBar(c.avance)}</div>
    </div>`;
  }).join('');
  return `<div class="panel" style="margin-bottom:16px;background:var(--grad-brand-soft)">
      <div class="panel__head"><h3>Ciclo de control de desviaciones</h3></div>
      <div class="dev-cycle">${cycle.map((s, i) => `<span class="dev-cycle__step on">${esc(s)}</span>${i < cycle.length - 1 ? `<span class="dev-cycle__arr">${icon('arrowRight', 13)}</span>` : ''}`).join('')}</div>
      <p class="muted" style="font-size:.8rem;margin-top:8px">Metodología: revisión semanal tipo Control Tower / Comité, análisis causa raíz (5 Porqués · Ishikawa), responsable y fecha compromiso, verificación y estandarización.</p>
    </div>${cards}`;
}

/* ------------------------------ H. Plan de acción ------------------------------ */
const KANBAN_COLS = ['No iniciado', 'En planificación', 'En ejecución', 'En riesgo', 'Bloqueado', 'Completado'];
function actionTable(p) {
  return `<div class="table-wrap"><table class="tbl">
    <thead><tr><th>Código</th><th>Iniciativa</th><th>Acción</th><th>Responsable</th><th>Área</th><th>Prioridad</th><th>Estado</th><th>Progreso</th><th>KPI validación</th><th>Meta</th><th>Compromiso</th><th>Presupuesto</th><th>Próximo paso</th></tr></thead>
    <tbody>${p.planAccion.map((a) => `<tr>
      <td class="strong">${esc(a.codigo)}</td><td class="strong">${esc(a.iniciativa)}<div class="muted" style="font-size:.72rem;font-weight:400">${esc(a.problema)}</div></td>
      <td style="font-size:.8rem">${esc(a.accion)}</td><td>${esc(a.responsable)}</td><td>${esc(a.area)}</td>
      <td>${badge(a.prioridad, a.prioridad === 'Crítica' ? 'danger' : a.prioridad === 'Alta' ? 'warn' : 'neutral')}</td>
      <td>${badge(a.estado, estadoKind(a.estado))}</td><td style="min-width:80px">${progressBar(a.progreso)}</td>
      <td style="font-size:.78rem">${esc(a.kpiValidacion)}</td><td>${esc(a.meta)}</td><td>${fecha(a.fechaCompromiso)}</td><td>${esc(a.presupuesto)}</td>
      <td class="muted" style="font-size:.78rem">${esc(a.proximoPaso)}</td>
    </tr>`).join('')}</tbody></table></div>`;
}
function actionKanban(p) {
  return `<div class="kanban">${KANBAN_COLS.map((col) => {
    const items = p.planAccion.filter((a) => a.estado === col);
    return `<div class="kanban__col">
      <div class="kanban__col-head">${esc(col)}<span class="count">${items.length}</span></div>
      ${items.map((a) => `<div class="kanban__card" style="border-left-color:${a.prioridad === 'Crítica' ? 'var(--danger)' : a.prioridad === 'Alta' ? 'var(--warn)' : 'var(--brand-500)'}">
        <b>${esc(a.iniciativa)}</b>
        <div class="mini">${esc(a.responsable)} · ${esc(a.prioridad)}</div>
        <div style="margin-top:6px">${progressBar(a.progreso)}</div>
      </div>`).join('') || '<div class="muted" style="font-size:.74rem;padding:8px">—</div>'}
    </div>`;
  }).join('')}</div>`;
}
function actionTimeline(p) {
  const sorted = [...p.planAccion].sort((a, b) => new Date(a.fechaCompromiso) - new Date(b.fechaCompromiso));
  return `<div class="stack">${sorted.map((a) => `<div class="row" style="align-items:stretch;gap:14px">
    <div style="flex:0 0 96px;text-align:right;padding-top:12px"><b style="font-size:.8rem">${fecha(a.fechaCompromiso)}</b></div>
    <div style="flex:0 0 auto;display:flex;flex-direction:column;align-items:center"><span style="width:14px;height:14px;border-radius:50%;background:${a.estado === 'Completado' ? 'var(--ok)' : 'var(--brand-500)'};margin-top:12px"></span><span style="flex:1;width:2px;background:var(--border)"></span></div>
    <div class="panel" style="flex:1;margin-bottom:8px;padding:12px 14px">
      <div class="row" style="justify-content:space-between"><b style="font-size:.86rem">${esc(a.codigo)} · ${esc(a.iniciativa)}</b>${badge(a.estado, estadoKind(a.estado))}</div>
      <div class="muted" style="font-size:.78rem;margin-top:3px">${esc(a.responsable)} · ${esc(a.area)} · Impacto: ${esc(a.impacto)}</div>
    </div>
  </div>`).join('')}</div>`;
}
function actionCalendar(p) {
  const byMonth = {};
  p.planAccion.forEach((a) => {
    const key = new Date(a.fechaCompromiso + 'T00:00:00').toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
    (byMonth[key] = byMonth[key] || []).push(a);
  });
  return `<div class="grid grid-3">${Object.entries(byMonth).map(([mes, items]) => `<div class="panel">
    <div class="panel__head"><h3 style="font-size:.9rem;text-transform:capitalize">${esc(mes)}</h3><span class="badge neutral">${items.length}</span></div>
    <div class="stack">${items.map((a) => `<div style="border-left:3px solid ${a.prioridad === 'Crítica' ? 'var(--danger)' : 'var(--brand-500)'};padding:4px 0 4px 10px">
      <div style="font-size:.82rem;font-weight:600">${esc(a.iniciativa)}</div>
      <div class="muted" style="font-size:.72rem">${fecha(a.fechaCompromiso)} · ${esc(a.estado)}</div></div>`).join('')}</div>
  </div>`).join('')}</div>`;
}
function actionSummary(p) {
  const byEstado = {};
  p.planAccion.forEach((a) => { byEstado[a.estado] = (byEstado[a.estado] || 0) + 1; });
  const prog = Math.round(p.planAccion.reduce((s, a) => s + a.progreso, 0) / p.planAccion.length);
  return `<div class="grid grid-4" style="margin-bottom:14px">
      <div class="stat"><div class="stat__label">Iniciativas</div><div class="stat__value">${p.planAccion.length}</div></div>
      <div class="stat ok"><div class="stat__label">Progreso promedio</div><div class="stat__value">${prog}%</div></div>
      <div class="stat"><div class="stat__label">En ejecución</div><div class="stat__value">${byEstado['En ejecución'] || 0}</div></div>
      <div class="stat warn"><div class="stat__label">Pend. de iniciar</div><div class="stat__value">${byEstado['No iniciado'] || 0}</div></div>
    </div>
    <div class="stack">${p.planAccion.map((a) => `<div class="panel" style="padding:12px 14px">
      <div class="row" style="justify-content:space-between"><b style="font-size:.86rem">${esc(a.iniciativa)}</b>${badge(a.prioridad, a.prioridad === 'Crítica' ? 'danger' : a.prioridad === 'Alta' ? 'warn' : 'neutral')}</div>
      <div class="muted" style="font-size:.78rem;margin:4px 0">${esc(a.accion)} — <b>Impacto esperado:</b> ${esc(a.impacto)}</div>
      <div class="row" style="gap:12px"><span style="flex:1">${progressBar(a.progreso)}</span><span style="font-size:.76rem;font-weight:700">${a.progreso}%</span></div>
    </div>`).join('')}</div>`;
}
const ACTION_VIEWS = {
  tabla: { label: 'Tabla', icon: 'list', render: actionTable },
  kanban: { label: 'Kanban', icon: 'grid', render: actionKanban },
  timeline: { label: 'Timeline', icon: 'activity', render: actionTimeline },
  calendario: { label: 'Calendario', icon: 'calendar', render: actionCalendar },
  resumen: { label: 'Resumen', icon: 'info', render: actionSummary },
};
function tabAccion(p) {
  return `<div class="panel">
    <div class="panel__head"><h3>Plan de acción</h3>
      <span class="panel__actions"><div class="chips" data-action-views>
        ${Object.entries(ACTION_VIEWS).map(([k, v], i) => `<button class="chip ${i === 0 ? 'active' : ''}" data-aview="${k}">${icon(v.icon, 13)} ${v.label}</button>`).join('')}
      </div></span>
    </div>
    <div data-action-body>${actionTable(p)}</div>
  </div>`;
}

const TAB_RENDER = {
  resumen: tabResumen, fases: tabFases, flujo: tabFlujo, kpis: tabKpis,
  cualitativo: tabCualitativo, desviaciones: tabDesviaciones, control: tabControl, accion: tabAccion,
};

/* --------------------------------- Shell --------------------------------- */
export function renderPlanDetail(p, activeTab = 'resumen') {
  const tab = TABS.find((t) => t.id === activeTab) ? activeTab : 'resumen';
  return `
  <div class="page-head">
    <div class="page-head__text">
      <div class="row" style="gap:8px;margin-bottom:6px">
        <a class="btn btn--sm btn--ghost" href="#/planes">${icon('chevronRight', 14)} Planes</a>
        ${badge('Plan ' + p.numero, 'info')}${statusBadge(p.estado)}${riskIndicator(p.nivelRiesgo)}
      </div>
      <h1>${esc(p.nombre)}</h1>
      <p class="subtitle">${esc(p.tagline)} · Líder: ${esc(p.lider)} · Actualizado ${esc(p.fechaActualizacion)}</p>
    </div>
    <div class="page-head__actions">
      <button class="btn" data-action="infographic" data-plan="${p.id}">${icon('image', 15)} Infografía</button>
      <button class="btn" data-action="report" data-plan="${p.id}">${icon('file', 15)} Reporte</button>
      <button class="btn btn--wa" data-action="whatsapp" data-plan="${p.id}">${icon('whatsapp', 16)} WhatsApp</button>
    </div>
  </div>
  <div class="tabs" role="tablist" data-tabs>
    ${TABS.map((t) => `<button class="tab ${t.id === tab ? 'active' : ''}" role="tab" data-tab="${t.id}">${icon(t.icon, 14)} ${t.label}</button>`).join('')}
  </div>
  <div class="tabpanel" data-tabpanel>${TAB_RENDER[tab](p)}</div>`;
}

/** Wire de interacciones dentro del contenido del detalle. */
export function mountPlanDetail(root, p, onTabChange) {
  const panel = root.querySelector('[data-tabpanel]');

  const wirePanel = () => {
    // Flujo: selección de nodos.
    const detail = panel.querySelector('[data-flow-detail]');
    panel.querySelectorAll('[data-node]').forEach((node) => {
      const sel = () => {
        panel.querySelectorAll('[data-node]').forEach((n) => n.classList.remove('sel'));
        node.classList.add('sel');
        detail.innerHTML = flowNodeDetail(p.flujo[+node.dataset.node]);
      };
      node.addEventListener('click', sel);
      node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(); } });
    });
    // Desviaciones: abrir detalle.
    panel.querySelectorAll('[data-dev]').forEach((el) => el.addEventListener('click', () => {
      const d = p.desviaciones.find((x) => x.codigo === el.dataset.dev);
      if (d) openDialog({ title: `Desviación ${d.codigo}`, body: deviationDetail(d), wide: true });
    }));
    // Plan de acción: cambio de vista.
    const aviews = panel.querySelector('[data-action-views]');
    const abody = panel.querySelector('[data-action-body]');
    if (aviews && abody) {
      aviews.querySelectorAll('[data-aview]').forEach((btn) => btn.addEventListener('click', () => {
        aviews.querySelectorAll('[data-aview]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        abody.innerHTML = ACTION_VIEWS[btn.dataset.aview].render(p);
      }));
    }
  };
  wirePanel();

  // Tabs.
  root.querySelectorAll('[data-tab]').forEach((btn) => btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    root.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('active', b === btn));
    panel.innerHTML = TAB_RENDER[id](p);
    wirePanel();
    onTabChange && onTabChange(id);
  }));
}
