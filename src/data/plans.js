/**
 * MODELO DE DATOS · Tres planes estratégicos Friopacking (90 días).
 * Fuente primaria: Plan_Estrategico_Friopacking_90_dias_Actualizado.docx
 * Complementado con datos reales de importaciones_master.xlsx.
 *
 * Trazabilidad: cada plan conserva objetivo, características, recursos, fases,
 * flujo y KPIs del documento. Los datos operativos no presentes en los
 * documentos se marcan con `ejemplo:true` ("Datos de ejemplo / Pendiente de
 * validación"). NINGÚN plan se elimina, fusiona ni resume en exceso.
 */
import { trade2026Totals } from './realtrade.js';

const HOY = '2026-07-18';
const PERIODO = '19 may 2026 – 17 ago 2026';

/** Fases estándar 90 días (idénticas en los 3 planes según el documento). */
const fasesBase = (acts) => ([
  { no: 'Fase 1', nombre: 'Diagnóstico', semanas: '1–2', estado: 'done',
    actividades: acts[0] },
  { no: 'Fase 2', nombre: 'Implementación', semanas: '3–8', estado: 'active',
    actividades: acts[1] },
  { no: 'Fase 3', nombre: 'Consolidación', semanas: '9–12', estado: 'pending',
    actividades: acts[2] },
]);

const recursosBase = [
  'Gerencia General', 'Comercio Exterior', 'Compras', 'Ingeniería',
  'Logística', 'Finanzas', 'TI',
];
const stackBase = ['Microsoft 365', 'SharePoint', 'Power BI', 'Power Automate'];

/* ============================================================================
   PLAN 1 · SUPPLY CHAIN CONTROL TOWER
   ============================================================================ */
const controlTower = {
  id: 'control-tower',
  numero: '01',
  nombre: 'Supply Chain Control Tower',
  nombreCorto: 'Control Tower',
  tagline: 'Torre de control logística end-to-end',
  icon: 'radar',
  color: '#0072CE',
  objetivo90: 'Implementar una torre de control logística para monitorear el 100% de las importaciones y proyectos críticos en 90 días.',
  justificacion: 'La operación de comercio exterior del grupo (más de 280 importaciones anuales, 17 países de origen) carece de visibilidad unificada extremo a extremo, lo que genera respuestas tardías ante incidencias y sobrecostos logísticos.',
  alcance: 'Todas las importaciones y proyectos críticos de FRIOPACKING, FRIOTEAM, SMARTCOLD y HERMETICA, desde la orden al proveedor hasta la entrega al cliente y su retroalimentación.',
  resultadoEsperado: 'Visibilidad extremo a extremo, alertas automáticas, dashboard ejecutivo operativo y reuniones semanales de control con causa raíz y responsables asignados.',
  patrocinador: 'Gerencia General',
  lider: 'Jefatura de Comercio Exterior',
  areasParticipantes: recursosBase,
  recursos: stackBase,
  duracion: '90 días · ' + PERIODO,
  estado: 'En ejecución',
  nivelRiesgo: 'Medio',
  avance: 58,
  fechaActualizacion: HOY,
  proximoHito: 'Go-live del dashboard ejecutivo de embarques (Semana 8)',
  hitosCumplidos: 5,
  hitosTotal: 9,
  benchmark: { practicas: 'DHL Supply Chain · Maersk · Amazon Logistics' },
  caracteristicas: ['Visibilidad extremo a extremo', 'Alertas automáticas', 'Dashboard ejecutivo', 'Reuniones semanales'],
  fases: fasesBase([
    ['Diseño del modelo de torre de control', 'Mapeo de hitos logísticos y fuentes de datos', 'Definición de KPIs y umbrales de alerta'],
    ['Configuración de tableros en Power BI', 'Automatización de alertas con Power Automate', 'Piloto con importaciones marítimas China–Callao'],
    ['Operación en régimen, KPIs y estandarización', 'Rutina semanal tipo Control Tower', 'Manual de operación y handover a Comercio Exterior'],
  ]),
  cronograma: [
    { actividad: 'Diseño del modelo de torre de control', responsable: 'Comercio Exterior', entregable: 'Blueprint Control Tower', dependencias: '—', estado: 'Completado', avance: 100, fechaPlan: '2026-05-30', fechaReal: '2026-05-29', diasDesv: -1 },
    { actividad: 'Mapeo de hitos y fuentes de datos', responsable: 'TI', entregable: 'Diccionario de datos', dependencias: 'Blueprint', estado: 'Completado', avance: 100, fechaPlan: '2026-06-06', fechaReal: '2026-06-10', diasDesv: 4 },
    { actividad: 'Configuración de tableros Power BI', responsable: 'TI / Comercio Exterior', entregable: 'Dashboard v1', dependencias: 'Diccionario de datos', estado: 'En ejecución', avance: 70, fechaPlan: '2026-07-11', fechaReal: '', diasDesv: 0 },
    { actividad: 'Automatización de alertas', responsable: 'TI', entregable: 'Flujos Power Automate', dependencias: 'Dashboard v1', estado: 'En ejecución', avance: 45, fechaPlan: '2026-07-25', fechaReal: '', diasDesv: 0 },
    { actividad: 'Piloto marítimo China–Callao', responsable: 'Logística', entregable: 'Informe de piloto', dependencias: 'Alertas', estado: 'En planificación', avance: 10, fechaPlan: '2026-08-01', fechaReal: '', diasDesv: 0 },
    { actividad: 'Estandarización y handover', responsable: 'Comercio Exterior', entregable: 'Manual de operación', dependencias: 'Piloto', estado: 'No iniciado', avance: 0, fechaPlan: '2026-08-15', fechaReal: '', diasDesv: 0 },
  ],
  flujo: [
    { step: '1', nombre: 'Proveedor', area: 'Compras', entrada: 'Orden de compra', actividad: 'Confirmación de OC y fecha de embarque', salida: 'OC confirmada', indicador: 'Confirmación ≤ 48 h', riesgo: 'Retraso de confirmación', estado: 'ok', responsable: 'Compras', evidencias: ['OC firmada', 'Proforma'] },
    { step: '2', nombre: 'Compra', area: 'Compras', entrada: 'OC confirmada', actividad: 'Gestión de pago y documentación', salida: 'Instrucción de embarque', indicador: 'Lead time de compra', riesgo: 'Documentación incompleta', estado: 'ok', responsable: 'Compras', evidencias: ['Factura comercial'] },
    { step: '3', nombre: 'Embarque', area: 'Comercio Exterior', entrada: 'Instrucción de embarque', actividad: 'Booking y seguimiento de tracking', salida: 'BL / AWB', indicador: 'Cobertura de tracking', riesgo: 'Rolleos navieros', estado: 'warn', responsable: 'Comercio Exterior', evidencias: ['BL', 'Tracking naviero'] },
    { step: '4', nombre: 'Aduana', area: 'Comercio Exterior', entrada: 'BL / AWB', actividad: 'Nacionalización y aforo', salida: 'DAM numerada', indicador: 'Tiempo de nacionalización', riesgo: 'Canal rojo / observaciones', estado: 'warn', responsable: 'Agente de aduanas', evidencias: ['DAM', 'Liquidación'] },
    { step: '5', nombre: 'Almacén', area: 'Logística', entrada: 'Mercancía nacionalizada', actividad: 'Recepción e inspección', salida: 'Ingreso a stock', indicador: 'OTIF de recepción', riesgo: 'Daños / faltantes', estado: 'ok', responsable: 'Logística', evidencias: ['Acta de recepción'] },
    { step: '6', nombre: 'Proyecto', area: 'Ingeniería', entrada: 'Materiales disponibles', actividad: 'Asignación a proyecto / obra', salida: 'Kit de proyecto', indicador: 'Cumplimiento de hitos', riesgo: 'Faltantes críticos', estado: 'ok', responsable: 'Ingeniería', evidencias: ['Checklist de proyecto'] },
    { step: '7', nombre: 'Cliente', area: 'Comercial', entrada: 'Kit de proyecto', actividad: 'Entrega e instalación', salida: 'Acta de conformidad', indicador: 'OTIF a cliente', riesgo: 'Reprogramaciones', estado: 'ok', responsable: 'Comercial', evidencias: ['Acta de conformidad'] },
    { step: '8', nombre: 'Retroalimentación', area: 'Gerencia', entrada: 'Datos de entrega', actividad: 'Revisión de desempeño y mejora', salida: 'Acciones de mejora', indicador: 'Acciones cerradas', riesgo: 'No cierre de acciones', estado: 'warn', responsable: 'Gerencia General', evidencias: ['Minuta de control tower'] },
  ],
  kpis: [
    { kpi: 'Cobertura de seguimiento de embarques', definicion: 'Embarques con tracking activo sobre el total', formula: '(Embarques monitoreados / Embarques totales) × 100', unidad: '%', lineaBase: 45, meta: 100, actual: 78, tendencia: 'up', frecuencia: 'Semanal', fuente: 'Control Tower / ' + 'importaciones_master.xlsx', responsable: 'Comercio Exterior', fechaAct: HOY, semaforo: 'warn', comentario: 'Sobre ' + trade2026Totals.importaciones + ' importaciones 2026 YTD.' },
    { kpi: 'OTIF (On Time In Full)', definicion: 'Entregas a tiempo y completas', formula: '(Entregas OTIF / Entregas totales) × 100', unidad: '%', lineaBase: 72, meta: 90, actual: 84, tendencia: 'up', frecuencia: 'Semanal', fuente: 'Logística', responsable: 'Logística', fechaAct: HOY, semaforo: 'warn', comentario: 'Mejora sostenida desde el piloto.', ejemplo: true },
    { kpi: 'Lead Time end-to-end', definicion: 'Días desde OC hasta entrega a cliente', formula: 'Fecha entrega − Fecha OC', unidad: 'días', lineaBase: 78, meta: 60, actual: 68, tendencia: 'down', frecuencia: 'Mensual', fuente: 'Control Tower', responsable: 'Comercio Exterior', fechaAct: HOY, semaforo: 'warn', comentario: 'Foco en nacionalización y tránsito marítimo.', ejemplo: true },
    { kpi: 'Tiempo de respuesta a incidencias', definicion: 'Horas promedio para responder incidencias', formula: 'Σ tiempo respuesta / N incidencias', unidad: 'horas', lineaBase: 26, meta: 8, actual: 14, tendencia: 'down', frecuencia: 'Semanal', fuente: 'Mesa de control', responsable: 'Comercio Exterior', fechaAct: HOY, semaforo: 'warn', comentario: 'Alertas automáticas reducen la latencia.', ejemplo: true },
    { kpi: 'Cumplimiento de hitos', definicion: 'Hitos del plan cumplidos en fecha', formula: '(Hitos cumplidos / Hitos planificados) × 100', unidad: '%', lineaBase: 50, meta: 90, actual: 56, tendencia: 'up', frecuencia: 'Semanal', fuente: 'Plan 90 días', responsable: 'PMO', fechaAct: HOY, semaforo: 'warn', comentario: '5 de 9 hitos cumplidos.' },
    { kpi: 'Tiempo de nacionalización', definicion: 'Días de despacho aduanero', formula: 'Fecha levante − Fecha llegada', unidad: 'días', lineaBase: 9, meta: 4, actual: 6, tendencia: 'down', frecuencia: 'Mensual', fuente: 'Agente de aduanas', responsable: 'Comercio Exterior', fechaAct: HOY, semaforo: 'warn', comentario: 'Impacto de canal rojo en algunos embarques.', ejemplo: true },
    { kpi: 'Sobrecosto logístico', definicion: 'Sobrecosto vs presupuesto de flete', formula: '(Flete real − Flete presupuestado) / Flete presupuestado', unidad: '%', lineaBase: 18, meta: 5, actual: 9, tendencia: 'down', frecuencia: 'Mensual', fuente: 'Finanzas', responsable: 'Finanzas', fechaAct: HOY, semaforo: 'warn', comentario: 'Flete 2026 YTD USD ' + trade2026Totals.fleteTotalUsd.toLocaleString('es-PE') + '.' },
    { kpi: 'Incidencias críticas abiertas', definicion: 'Incidencias críticas sin cierre', formula: 'Conteo de incidencias críticas abiertas', unidad: 'u', lineaBase: 7, meta: 0, actual: 3, tendencia: 'down', frecuencia: 'Semanal', fuente: 'Mesa de control', responsable: 'Comercio Exterior', fechaAct: HOY, semaforo: 'warn', comentario: 'En seguimiento en control tower semanal.', ejemplo: true },
    { kpi: 'Rentabilidad de operación', definicion: 'Margen operativo de proyectos importados', formula: 'Margen / Ventas', unidad: '%', lineaBase: 21, meta: 26, actual: 23, tendencia: 'up', frecuencia: 'Mensual', fuente: 'Finanzas', responsable: 'Finanzas', fechaAct: HOY, semaforo: 'ok', comentario: 'Mejora por reducción de sobrecostos.', ejemplo: true },
  ],
  cualitativo: [
    { dimension: 'Calidad de coordinación interáreas', calificacion: 3, evidencia: 'Actas de reunión semanal', comentario: 'Coordinación aceptable; falta disciplina de cierre de compromisos.', riesgo: 'Silos entre Compras y Logística', recomendacion: 'RACI por hito y minuta con responsables', fecha: HOY },
    { dimension: 'Nivel de trazabilidad de la información', calificacion: 3, evidencia: 'Dashboard v1', comentario: 'Trazabilidad parcial; 78% de cobertura de tracking.', riesgo: 'Puntos ciegos en tránsito', recomendacion: 'Integrar API navieras', fecha: HOY },
    { dimension: 'Calidad de toma de decisiones', calificacion: 4, evidencia: 'Decisiones documentadas', comentario: 'Decisiones más ágiles con datos en tiempo casi real.', riesgo: 'Dependencia de pocas personas', recomendacion: 'Estandarizar protocolo de escalamiento', fecha: HOY },
    { dimension: 'Capacidad de respuesta', calificacion: 3, evidencia: 'Log de incidencias', comentario: 'Respuesta en 14 h promedio; meta 8 h.', riesgo: 'Sobrecarga en picos', recomendacion: 'Alertas y turnos de guardia', fecha: HOY },
    { dimension: 'Disciplina de seguimiento', calificacion: 4, evidencia: 'Rutina control tower', comentario: 'Rutina semanal instaurada y sostenida.', riesgo: 'Relajamiento post go-live', recomendacion: 'Auditoría mensual de rutina', fecha: HOY },
  ],
  desviaciones: [
    {
      codigo: 'DEV-CT-01', kpiActividad: 'Tiempo de nacionalización', descripcion: 'Despachos con canal rojo superan el objetivo de 4 días', meta: '4 días', resultado: '6 días', variacion: '+2 días (+50%)', tipo: 'Logística', severidad: 'Alta',
      causaProbable: 'Observaciones aduaneras y documentación incompleta del proveedor', impactoOperativo: 'Retraso en obras y proyectos', impactoFinanciero: 'Sobrestadía y almacenaje', responsable: 'Comercio Exterior', fechaDeteccion: '2026-06-24', fechaLimite: '2026-08-05', estado: 'En control', evidencia: 'DAM canal rojo',
      control: { causaRaiz: 'Checklist documental no estandarizado antes del embarque', tecnica: '5 Porqués', cincoPorques: ['Porque hubo observación aduanera', 'Porque faltó certificado de origen', 'Porque el proveedor no lo envió a tiempo', 'Porque no existe checklist previo al booking', 'Porque el proceso no lo exige formalmente'], contencion: 'Revisión documental express con agente de aduanas', correctiva: 'Checklist documental obligatorio pre-embarque', preventiva: 'Cláusula documental en OC y scoring de proveedores', responsable: 'Comercio Exterior', aprobador: 'Gerencia General', fechaCompromiso: '2026-08-05', avance: 60, estado: 'En ejecución', verificacion: 'Auditoría de 10 despachos', fechaCierre: '', leccion: 'La calidad documental del proveedor es el mayor driver de nacionalización.' },
    },
    {
      codigo: 'DEV-CT-02', kpiActividad: 'Cobertura de seguimiento de embarques', descripcion: 'Cobertura de tracking por debajo del 100%', meta: '100%', resultado: '78%', variacion: '−22 pp', tipo: 'Tecnológica', severidad: 'Media',
      causaProbable: 'Falta de integración con algunas navieras y couriers', impactoOperativo: 'Puntos ciegos en tránsito', impactoFinanciero: 'Bajo', responsable: 'TI', fechaDeteccion: '2026-06-30', fechaLimite: '2026-08-10', estado: 'Abierta', evidencia: 'Dashboard v1',
      control: { causaRaiz: 'No hay conector automático a portales navieros secundarios', tecnica: 'Ishikawa', cincoPorques: ['Tracking incompleto', 'Faltan fuentes integradas', 'Portales sin API', 'Captura manual intermitente', 'Sin responsable asignado por naviera'], contencion: 'Carga manual diaria de embarques no integrados', correctiva: 'Conector Power Automate a portales navieros', preventiva: 'Estándar de integración para nuevos couriers', responsable: 'TI', aprobador: 'Jefatura Comercio Exterior', fechaCompromiso: '2026-08-10', avance: 35, estado: 'En ejecución', verificacion: 'Cobertura ≥ 95%', fechaCierre: '', leccion: 'Priorizar integración por volumen de embarques.' },
    },
    {
      codigo: 'DEV-CT-03', kpiActividad: 'Sobrecosto logístico', descripcion: 'Sobrecosto de flete sobre presupuesto', meta: '≤ 5%', resultado: '9%', variacion: '+4 pp', tipo: 'Financiera', severidad: 'Media',
      causaProbable: 'Embarques aéreos de urgencia por quiebres de stock', impactoOperativo: 'Medio', impactoFinanciero: 'USD ~40k anualizado', responsable: 'Finanzas', fechaDeteccion: '2026-07-05', fechaLimite: '2026-08-20', estado: 'Abierta', evidencia: 'Reporte de fletes',
      control: { causaRaiz: 'Planificación de compras reactiva ante quiebres', tecnica: '5 Porqués', cincoPorques: ['Flete aéreo elevado', 'Urgencias de última hora', 'Quiebres de stock', 'Pronóstico débil', 'Sin planificación S&OP integrada'], contencion: 'Aprobación gerencial de aéreos de urgencia', correctiva: 'Política de modo de transporte por criticidad', preventiva: 'Integración con Plan S&OP', responsable: 'Finanzas', aprobador: 'Gerencia General', fechaCompromiso: '2026-08-20', avance: 20, estado: 'En planificación', verificacion: 'Sobrecosto ≤ 5%', fechaCierre: '', leccion: 'El sobrecosto logístico se ataca desde la planificación de demanda.' },
    },
  ],
  planAccion: [
    { codigo: 'AC-CT-01', iniciativa: 'Go-live dashboard ejecutivo', problema: 'Falta visibilidad unificada', accion: 'Publicar dashboard de embarques en Power BI', responsable: 'TI', area: 'TI', prioridad: 'Alta', inicio: '2026-06-15', fechaCompromiso: '2026-08-01', estado: 'En ejecución', progreso: 70, kpiValidacion: 'Cobertura de tracking', meta: '100%', dependencias: 'Diccionario de datos', presupuesto: 'USD 3,500', impacto: 'Visibilidad total', riesgo: 'Calidad de datos', evidencia: 'Dashboard v1', proximoPaso: 'Integrar portales navieros' },
    { codigo: 'AC-CT-02', iniciativa: 'Alertas automáticas', problema: 'Respuesta tardía a incidencias', accion: 'Flujos de alerta en Power Automate', responsable: 'TI', area: 'TI', prioridad: 'Alta', inicio: '2026-07-01', fechaCompromiso: '2026-08-10', estado: 'En ejecución', progreso: 45, kpiValidacion: 'Tiempo de respuesta', meta: '8 h', dependencias: 'Dashboard v1', presupuesto: 'USD 1,200', impacto: 'Respuesta ágil', riesgo: 'Falsos positivos', evidencia: 'Flujos configurados', proximoPaso: 'Definir umbrales por hito' },
    { codigo: 'AC-CT-03', iniciativa: 'Checklist documental pre-embarque', problema: 'Nacionalización lenta', accion: 'Estandarizar checklist y cláusula en OC', responsable: 'Comercio Exterior', area: 'Comercio Exterior', prioridad: 'Crítica', inicio: '2026-06-24', fechaCompromiso: '2026-08-05', estado: 'En ejecución', progreso: 60, kpiValidacion: 'Tiempo de nacionalización', meta: '4 días', dependencias: 'Scoring de proveedores', presupuesto: 'USD 0', impacto: 'Menos canal rojo', riesgo: 'Adopción de proveedores', evidencia: 'Checklist v1', proximoPaso: 'Auditar 10 despachos' },
    { codigo: 'AC-CT-04', iniciativa: 'Rutina Control Tower semanal', problema: 'Sin cierre de acciones', accion: 'Reunión semanal con causa raíz y responsables', responsable: 'Gerencia General', area: 'Gerencia', prioridad: 'Media', inicio: '2026-06-01', fechaCompromiso: '2026-08-15', estado: 'En ejecución', progreso: 80, kpiValidacion: 'Acciones cerradas', meta: '90%', dependencias: '—', presupuesto: 'USD 0', impacto: 'Disciplina operativa', riesgo: 'Relajamiento', evidencia: 'Minutas', proximoPaso: 'Auditoría mensual' },
  ],
  riesgos: [
    'Dependencia de calidad documental de proveedores internacionales',
    'Integración incompleta con navieras/couriers secundarios',
    'Sobrecostos por embarques aéreos de urgencia',
    'Resistencia al cambio en rutina de control',
  ],
};

/* ============================================================================
   PLAN 2 · SALES & OPERATIONS PLANNING (S&OP)
   ============================================================================ */
const sop = {
  id: 'sop',
  numero: '02',
  nombre: 'Sales & Operations Planning (S&OP)',
  nombreCorto: 'S&OP',
  tagline: 'Planificación integrada de demanda y suministro',
  icon: 'sliders',
  color: '#1677FF',
  objetivo90: 'Implementar un proceso integrado de planificación entre Comercial, Ingeniería, Compras, Logística y Finanzas.',
  justificacion: 'Las decisiones de demanda, capacidad y abastecimiento se toman de forma aislada, generando quiebres, sobrestock y decisiones no alineadas al plan financiero único.',
  alcance: 'Ciclo mensual S&OP para las líneas de negocio del grupo, con pronóstico de demanda, priorización de proyectos y plan financiero consensuado.',
  resultadoEsperado: 'Reunión mensual S&OP operando, pronóstico de demanda formal, priorización de proyectos y un plan financiero único aprobado por Gerencia.',
  patrocinador: 'Gerencia General',
  lider: 'Gerencia Comercial / Planeamiento',
  areasParticipantes: recursosBase,
  recursos: stackBase,
  duracion: '90 días · ' + PERIODO,
  estado: 'En ejecución',
  nivelRiesgo: 'Medio',
  avance: 42,
  fechaActualizacion: HOY,
  proximoHito: 'Segundo ciclo mensual S&OP con plan financiero único (Semana 8)',
  hitosCumplidos: 3,
  hitosTotal: 8,
  benchmark: { practicas: 'Unilever · Nestlé · Schneider Electric' },
  caracteristicas: ['Reunión mensual S&OP', 'Pronóstico de demanda', 'Priorización de proyectos', 'Plan financiero único'],
  fases: fasesBase([
    ['Diseño del modelo S&OP y calendario', 'Definición de roles y del comité ejecutivo', 'Diagnóstico de precisión de pronóstico actual'],
    ['Configuración de pronóstico de demanda', 'Primer ciclo S&OP piloto', 'Matriz de priorización de proyectos'],
    ['Operación mensual, KPIs y estandarización', 'Plan financiero único consolidado', 'Manual del proceso S&OP'],
  ]),
  cronograma: [
    { actividad: 'Diseño del modelo y calendario S&OP', responsable: 'Planeamiento', entregable: 'Modelo S&OP', dependencias: '—', estado: 'Completado', avance: 100, fechaPlan: '2026-05-30', fechaReal: '2026-06-01', diasDesv: 2 },
    { actividad: 'Roles y comité ejecutivo', responsable: 'Gerencia General', entregable: 'Carta del comité', dependencias: 'Modelo S&OP', estado: 'Completado', avance: 100, fechaPlan: '2026-06-06', fechaReal: '2026-06-06', diasDesv: 0 },
    { actividad: 'Modelo de pronóstico de demanda', responsable: 'Comercial', entregable: 'Forecast v1', dependencias: 'Comité', estado: 'En ejecución', avance: 55, fechaPlan: '2026-07-11', fechaReal: '', diasDesv: 0 },
    { actividad: 'Primer ciclo S&OP piloto', responsable: 'Planeamiento', entregable: 'Acta ciclo 1', dependencias: 'Forecast v1', estado: 'En ejecución', avance: 40, fechaPlan: '2026-07-20', fechaReal: '', diasDesv: 0 },
    { actividad: 'Matriz de priorización de proyectos', responsable: 'Ingeniería', entregable: 'Ranking de proyectos', dependencias: 'Ciclo 1', estado: 'En planificación', avance: 15, fechaPlan: '2026-08-01', fechaReal: '', diasDesv: 0 },
    { actividad: 'Plan financiero único', responsable: 'Finanzas', entregable: 'Plan financiero aprobado', dependencias: 'Ranking', estado: 'No iniciado', avance: 0, fechaPlan: '2026-08-15', fechaReal: '', diasDesv: 0 },
  ],
  flujo: [
    { step: '1', nombre: 'Ventas', area: 'Comercial', entrada: 'Pipeline comercial', actividad: 'Registro de demanda y oportunidades', salida: 'Demanda comercial', indicador: 'Cobertura de pipeline', riesgo: 'Demanda no registrada', estado: 'ok', responsable: 'Comercial', evidencias: ['CRM / pipeline'] },
    { step: '2', nombre: 'Pronóstico', area: 'Planeamiento', entrada: 'Demanda comercial', actividad: 'Consolidación del forecast', salida: 'Forecast consensuado', indicador: 'Precisión del pronóstico', riesgo: 'Sesgo del forecast', estado: 'warn', responsable: 'Planeamiento', evidencias: ['Forecast v1'] },
    { step: '3', nombre: 'Ingeniería', area: 'Ingeniería', entrada: 'Forecast', actividad: 'Evaluación de factibilidad y capacidad', salida: 'Requerimientos técnicos', indicador: 'Capacidad comprometida', riesgo: 'Cuellos de botella', estado: 'warn', responsable: 'Ingeniería', evidencias: ['BOM / capacidad'] },
    { step: '4', nombre: 'Compras', area: 'Compras', entrada: 'Requerimientos técnicos', actividad: 'Plan de abastecimiento', salida: 'Plan de compras', indicador: 'Cumplimiento de abastecimiento', riesgo: 'Lead time largo', estado: 'ok', responsable: 'Compras', evidencias: ['Plan de compras'] },
    { step: '5', nombre: 'Logística', area: 'Logística', entrada: 'Plan de compras', actividad: 'Plan de distribución y transporte', salida: 'Plan logístico', indicador: 'Nivel de servicio', riesgo: 'Capacidad logística', estado: 'ok', responsable: 'Logística', evidencias: ['Plan logístico'] },
    { step: '6', nombre: 'Finanzas', area: 'Finanzas', entrada: 'Planes operativos', actividad: 'Consolidación financiera', salida: 'Plan financiero único', indicador: 'Cumplimiento financiero', riesgo: 'Descalce presupuestal', estado: 'warn', responsable: 'Finanzas', evidencias: ['Plan financiero'] },
    { step: '7', nombre: 'Comité S&OP', area: 'Gerencia', entrada: 'Plan financiero único', actividad: 'Consenso y decisiones', salida: 'Plan aprobado', indicador: 'Decisiones ejecutadas', riesgo: 'Falta de consenso', estado: 'ok', responsable: 'Gerencia General', evidencias: ['Acta de comité'] },
    { step: '8', nombre: 'Ejecución', area: 'Operaciones', entrada: 'Plan aprobado', actividad: 'Ejecución y seguimiento', salida: 'Resultados', indicador: 'Proyectos priorizados ejecutados', riesgo: 'Desvío de plan', estado: 'warn', responsable: 'Operaciones', evidencias: ['Tablero de ejecución'] },
  ],
  kpis: [
    { kpi: 'Precisión del pronóstico', definicion: 'Exactitud del forecast vs real', formula: '100 − MAPE', unidad: '%', lineaBase: 58, meta: 80, actual: 66, tendencia: 'up', frecuencia: 'Mensual', fuente: 'Planeamiento', responsable: 'Planeamiento', fechaAct: HOY, semaforo: 'warn', comentario: 'Primer ciclo mejora la base.', ejemplo: true },
    { kpi: 'Cumplimiento del plan de abastecimiento', definicion: 'Órdenes según plan', formula: '(Órdenes en plan / Órdenes totales) × 100', unidad: '%', lineaBase: 70, meta: 92, actual: 79, tendencia: 'up', frecuencia: 'Mensual', fuente: 'Compras', responsable: 'Compras', fechaAct: HOY, semaforo: 'warn', comentario: 'Depende de lead time de proveedores.', ejemplo: true },
    { kpi: 'Cumplimiento financiero del plan', definicion: 'Ejecución vs plan financiero', formula: '(Ejecutado / Planificado) × 100', unidad: '%', lineaBase: 74, meta: 95, actual: 82, tendencia: 'up', frecuencia: 'Mensual', fuente: 'Finanzas', responsable: 'Finanzas', fechaAct: HOY, semaforo: 'warn', comentario: 'Plan financiero único en construcción.', ejemplo: true },
    { kpi: 'Proyectos priorizados ejecutados', definicion: 'Proyectos del ranking ejecutados', formula: '(Ejecutados / Priorizados) × 100', unidad: '%', lineaBase: 55, meta: 85, actual: 61, tendencia: 'up', frecuencia: 'Mensual', fuente: 'Ingeniería', responsable: 'Ingeniería', fechaAct: HOY, semaforo: 'warn', comentario: 'Matriz de priorización en curso.', ejemplo: true },
    { kpi: 'Nivel de servicio', definicion: 'Pedidos atendidos a tiempo', formula: '(Pedidos a tiempo / Totales) × 100', unidad: '%', lineaBase: 88, meta: 96, actual: 91, tendencia: 'up', frecuencia: 'Mensual', fuente: 'Logística', responsable: 'Logística', fechaAct: HOY, semaforo: 'warn', comentario: 'Estable con leve mejora.', ejemplo: true },
    { kpi: 'Variación demanda vs capacidad', definicion: 'Brecha entre demanda y capacidad', formula: '(Demanda − Capacidad) / Capacidad', unidad: '%', lineaBase: 22, meta: 8, actual: 15, tendencia: 'down', frecuencia: 'Mensual', fuente: 'Planeamiento', responsable: 'Planeamiento', fechaAct: HOY, semaforo: 'warn', comentario: 'Rebalanceo de capacidad requerido.', ejemplo: true },
    { kpi: 'Forecast bias', definicion: 'Sesgo sistemático del pronóstico', formula: 'Σ(Forecast − Real) / Σ Real', unidad: '%', lineaBase: 12, meta: 3, actual: 7, tendencia: 'down', frecuencia: 'Mensual', fuente: 'Planeamiento', responsable: 'Planeamiento', fechaAct: HOY, semaforo: 'warn', comentario: 'Sesgo a la sobreestimación.', ejemplo: true },
    { kpi: 'Backlog', definicion: 'Pedidos pendientes de atención', formula: 'Conteo de pedidos en backlog', unidad: 'u', lineaBase: 34, meta: 12, actual: 21, tendencia: 'down', frecuencia: 'Mensual', fuente: 'Operaciones', responsable: 'Operaciones', fechaAct: HOY, semaforo: 'warn', comentario: 'Reducción por priorización.', ejemplo: true },
    { kpi: 'Rentabilidad proyectada vs real', definicion: 'Margen real vs proyectado', formula: 'Margen real − Margen proyectado', unidad: 'pp', lineaBase: -4, meta: 0, actual: -2, tendencia: 'up', frecuencia: 'Mensual', fuente: 'Finanzas', responsable: 'Finanzas', fechaAct: HOY, semaforo: 'warn', comentario: 'Brecha en reducción.', ejemplo: true },
  ],
  cualitativo: [
    { dimension: 'Calidad del consenso entre áreas', calificacion: 3, evidencia: 'Actas de comité', comentario: 'Consenso incipiente; aún prevalecen visiones de área.', riesgo: 'Decisiones no alineadas', recomendacion: 'Reglas de decisión del comité', fecha: HOY },
    { dimension: 'Madurez del proceso S&OP', calificacion: 2, evidencia: 'Diagnóstico inicial', comentario: 'Proceso en etapa inicial (reactivo a integrado).', riesgo: 'Retroceso a silos', recomendacion: 'Calendario S&OP fijo y patrocinio ejecutivo', fecha: HOY },
    { dimension: 'Nivel de alineación estratégica', calificacion: 3, evidencia: 'Plan financiero borrador', comentario: 'Alineación media con la estrategia financiera.', riesgo: 'Objetivos contradictorios', recomendacion: 'Vincular KPIs a objetivos corporativos', fecha: HOY },
    { dimension: 'Calidad de las decisiones', calificacion: 3, evidencia: 'Decisiones documentadas', comentario: 'Decisiones más informadas con datos.', riesgo: 'Datos incompletos', recomendacion: 'Tablero único S&OP', fecha: HOY },
    { dimension: 'Participación de las áreas', calificacion: 4, evidencia: 'Asistencia a comité', comentario: 'Alta participación en los primeros ciclos.', riesgo: 'Desgaste', recomendacion: 'Agenda eficiente y decisiones visibles', fecha: HOY },
  ],
  desviaciones: [
    {
      codigo: 'DEV-SOP-01', kpiActividad: 'Precisión del pronóstico', descripcion: 'MAPE por encima del objetivo', meta: '≥ 80%', resultado: '66%', variacion: '−14 pp', tipo: 'Comercial', severidad: 'Alta',
      causaProbable: 'Datos históricos dispersos y demanda no registrada en CRM', impactoOperativo: 'Quiebres y sobrestock', impactoFinanciero: 'Capital inmovilizado', responsable: 'Planeamiento', fechaDeteccion: '2026-06-28', fechaLimite: '2026-08-18', estado: 'En control', evidencia: 'Forecast v1',
      control: { causaRaiz: 'Sin proceso formal de captura de demanda', tecnica: 'Ishikawa', cincoPorques: ['Pronóstico impreciso', 'Datos históricos incompletos', 'Demanda no registrada', 'CRM subutilizado', 'Sin incentivo a registrar'], contencion: 'Consolidación manual con Comercial', correctiva: 'Proceso formal de captura en CRM', preventiva: 'Revisión mensual de sesgo y precisión', responsable: 'Comercial', aprobador: 'Gerencia Comercial', fechaCompromiso: '2026-08-18', avance: 40, estado: 'En ejecución', verificacion: 'MAPE mensual', fechaCierre: '', leccion: 'La disciplina de registro comercial es base del forecast.' },
    },
    {
      codigo: 'DEV-SOP-02', kpiActividad: 'Variación demanda vs capacidad', descripcion: 'Brecha de capacidad en picos', meta: '≤ 8%', resultado: '15%', variacion: '+7 pp', tipo: 'Operativa', severidad: 'Media',
      causaProbable: 'Capacidad de ingeniería no dimensionada por proyectos simultáneos', impactoOperativo: 'Retrasos de proyecto', impactoFinanciero: 'Penalidades', responsable: 'Ingeniería', fechaDeteccion: '2026-07-02', fechaLimite: '2026-08-22', estado: 'Abierta', evidencia: 'Análisis de capacidad',
      control: { causaRaiz: 'Sin plan de capacidad vinculado al forecast', tecnica: '5 Porqués', cincoPorques: ['Brecha de capacidad', 'Proyectos concurrentes', 'Sin plan de capacidad', 'Forecast desconectado de capacidad', 'Proceso S&OP en implementación'], contencion: 'Priorización manual de proyectos', correctiva: 'Plan de capacidad integrado al S&OP', preventiva: 'Escenarios de demanda-capacidad', responsable: 'Ingeniería', aprobador: 'Gerencia General', fechaCompromiso: '2026-08-22', avance: 25, estado: 'En planificación', verificacion: 'Brecha ≤ 8%', fechaCierre: '', leccion: 'La capacidad debe planificarse junto a la demanda.' },
    },
    {
      codigo: 'DEV-SOP-03', kpiActividad: 'Cumplimiento financiero del plan', descripcion: 'Ejecución por debajo del plan financiero', meta: '≥ 95%', resultado: '82%', variacion: '−13 pp', tipo: 'Financiera', severidad: 'Media',
      causaProbable: 'Plan financiero único aún no consolidado', impactoOperativo: 'Bajo', impactoFinanciero: 'Descalce de caja', responsable: 'Finanzas', fechaDeteccion: '2026-07-08', fechaLimite: '2026-08-25', estado: 'Abierta', evidencia: 'Plan financiero borrador',
      control: { causaRaiz: 'Planes de área no consolidados en un único plan', tecnica: '5 Porqués', cincoPorques: ['Cumplimiento bajo', 'Planes desalineados', 'Sin plan único', 'S&OP en implementación', 'Falta de gobernanza financiera'], contencion: 'Seguimiento quincenal de caja', correctiva: 'Consolidar plan financiero único', preventiva: 'Revisión financiera en cada ciclo S&OP', responsable: 'Finanzas', aprobador: 'Gerencia General', fechaCompromiso: '2026-08-25', avance: 30, estado: 'En ejecución', verificacion: 'Cumplimiento ≥ 95%', fechaCierre: '', leccion: 'El plan financiero único cierra el ciclo S&OP.' },
    },
  ],
  planAccion: [
    { codigo: 'AC-SOP-01', iniciativa: 'Comité S&OP mensual', problema: 'Decisiones aisladas', accion: 'Instaurar comité ejecutivo mensual', responsable: 'Gerencia General', area: 'Gerencia', prioridad: 'Alta', inicio: '2026-06-06', fechaCompromiso: '2026-08-20', estado: 'En ejecución', progreso: 60, kpiValidacion: 'Decisiones ejecutadas', meta: '90%', dependencias: '—', presupuesto: 'USD 0', impacto: 'Alineación', riesgo: 'Agenda no efectiva', evidencia: 'Actas', proximoPaso: 'Reglas de decisión' },
    { codigo: 'AC-SOP-02', iniciativa: 'Modelo de pronóstico', problema: 'Forecast impreciso', accion: 'Implementar forecast estadístico + consenso', responsable: 'Planeamiento', area: 'Planeamiento', prioridad: 'Crítica', inicio: '2026-06-15', fechaCompromiso: '2026-08-18', estado: 'En ejecución', progreso: 55, kpiValidacion: 'Precisión del pronóstico', meta: '80%', dependencias: 'Datos CRM', presupuesto: 'USD 2,000', impacto: 'Menos quiebres', riesgo: 'Datos incompletos', evidencia: 'Forecast v1', proximoPaso: 'Captura formal de demanda' },
    { codigo: 'AC-SOP-03', iniciativa: 'Matriz de priorización', problema: 'Proyectos sin priorizar', accion: 'Ranking de proyectos por valor y capacidad', responsable: 'Ingeniería', area: 'Ingeniería', prioridad: 'Alta', inicio: '2026-07-10', fechaCompromiso: '2026-08-15', estado: 'En planificación', progreso: 15, kpiValidacion: 'Proyectos priorizados ejecutados', meta: '85%', dependencias: 'Ciclo 1', presupuesto: 'USD 0', impacto: 'Foco de recursos', riesgo: 'Criterios no consensuados', evidencia: 'Ranking v0', proximoPaso: 'Validar criterios' },
    { codigo: 'AC-SOP-04', iniciativa: 'Plan financiero único', problema: 'Planes descoordinados', accion: 'Consolidar un plan financiero aprobado', responsable: 'Finanzas', area: 'Finanzas', prioridad: 'Alta', inicio: '2026-07-20', fechaCompromiso: '2026-08-25', estado: 'No iniciado', progreso: 0, kpiValidacion: 'Cumplimiento financiero', meta: '95%', dependencias: 'Ranking', presupuesto: 'USD 0', impacto: 'Control financiero', riesgo: 'Descalce', evidencia: '—', proximoPaso: 'Estructurar plantilla' },
  ],
  riesgos: [
    'Madurez inicial del proceso y riesgo de retorno a silos',
    'Calidad y disponibilidad de datos históricos de demanda',
    'Brecha de capacidad de ingeniería en picos',
    'Consolidación tardía del plan financiero único',
  ],
};

/* ============================================================================
   PLAN 3 · CENTRO DE INTELIGENCIA OPERACIONAL
   ============================================================================ */
const intelligence = {
  id: 'intelligence',
  numero: '03',
  nombre: 'Centro de Inteligencia Operacional',
  nombreCorto: 'Inteligencia Operacional',
  tagline: 'Datos únicos para decisiones en tiempo real',
  icon: 'chart',
  color: '#23C7D9',
  objetivo90: 'Centralizar indicadores estratégicos para decisiones en tiempo real.',
  justificacion: 'Los indicadores viven dispersos en Excel y sistemas aislados, con baja confiabilidad y sin gobierno de datos, dificultando decisiones basadas en evidencia.',
  alcance: 'KPIs corporativos del grupo integrados desde ERP, Excel e importaciones hacia un DataMart y tableros Power BI con gobierno de datos.',
  resultadoEsperado: 'KPIs corporativos centralizados, tableros Power BI disponibles, DataMart operativo y gobierno de datos establecido.',
  patrocinador: 'Gerencia General',
  lider: 'Jefatura de TI',
  areasParticipantes: recursosBase,
  recursos: stackBase,
  duracion: '90 días · ' + PERIODO,
  estado: 'En ejecución',
  nivelRiesgo: 'Alto',
  avance: 48,
  fechaActualizacion: HOY,
  proximoHito: 'DataMart central con KPIs corporativos automatizados (Semana 8)',
  hitosCumplidos: 4,
  hitosTotal: 8,
  benchmark: { practicas: 'Microsoft · Toyota · Siemens' },
  caracteristicas: ['KPIs corporativos', 'Power BI', 'DataMart', 'Gobierno de datos'],
  fases: fasesBase([
    ['Diseño del modelo de datos y catálogo de KPIs', 'Inventario de fuentes (ERP, Excel, importaciones)', 'Diagnóstico de calidad de datos'],
    ['Construcción del DataMart y Power Query', 'Automatización de KPIs corporativos', 'Tableros Power BI por área'],
    ['Operación, gobierno de datos y adopción', 'Auditoría de calidad y remediación', 'Manual de gobierno y capacitación'],
  ]),
  cronograma: [
    { actividad: 'Catálogo de KPIs corporativos', responsable: 'TI / Gerencia', entregable: 'Catálogo de KPIs', dependencias: '—', estado: 'Completado', avance: 100, fechaPlan: '2026-05-30', fechaReal: '2026-05-30', diasDesv: 0 },
    { actividad: 'Inventario de fuentes de datos', responsable: 'TI', entregable: 'Mapa de fuentes', dependencias: 'Catálogo', estado: 'Completado', avance: 100, fechaPlan: '2026-06-06', fechaReal: '2026-06-08', diasDesv: 2 },
    { actividad: 'Diagnóstico de calidad de datos', responsable: 'TI', entregable: 'Informe de calidad', dependencias: 'Mapa de fuentes', estado: 'Completado', avance: 100, fechaPlan: '2026-06-13', fechaReal: '2026-06-13', diasDesv: 0 },
    { actividad: 'Construcción del DataMart', responsable: 'TI', entregable: 'DataMart v1', dependencias: 'Informe de calidad', estado: 'En ejecución', avance: 60, fechaPlan: '2026-07-18', fechaReal: '', diasDesv: 0 },
    { actividad: 'Automatización de KPIs (Power Query)', responsable: 'TI', entregable: 'KPIs automatizados', dependencias: 'DataMart v1', estado: 'En ejecución', avance: 40, fechaPlan: '2026-08-01', fechaReal: '', diasDesv: 0 },
    { actividad: 'Gobierno de datos y adopción', responsable: 'TI / Gerencia', entregable: 'Manual de gobierno', dependencias: 'KPIs automatizados', estado: 'En planificación', avance: 10, fechaPlan: '2026-08-15', fechaReal: '', diasDesv: 0 },
  ],
  flujo: [
    { step: '1', nombre: 'ERP / Excel / Importaciones', area: 'TI / Comercio Exterior', entrada: 'Datos transaccionales', actividad: 'Extracción de fuentes', salida: 'Datos crudos', indicador: 'N.º de fuentes integradas', riesgo: 'Fuentes no estandarizadas', estado: 'warn', responsable: 'TI', evidencias: ['importaciones_master.xlsx', 'ERP'] },
    { step: '2', nombre: 'Power Query', area: 'TI', entrada: 'Datos crudos', actividad: 'Transformación y limpieza', salida: 'Datos normalizados', indicador: 'Calidad del dato', riesgo: 'Reglas de limpieza frágiles', estado: 'warn', responsable: 'TI', evidencias: ['Consultas Power Query'] },
    { step: '3', nombre: 'Base central (DataMart)', area: 'TI', entrada: 'Datos normalizados', actividad: 'Modelado y consolidación', salida: 'DataMart', indicador: 'Completitud', riesgo: 'Modelo incompleto', estado: 'warn', responsable: 'TI', evidencias: ['Modelo dimensional'] },
    { step: '4', nombre: 'Power BI', area: 'TI', entrada: 'DataMart', actividad: 'Publicación de tableros', salida: 'Dashboards', indicador: 'Disponibilidad del dashboard', riesgo: 'Baja disponibilidad', estado: 'ok', responsable: 'TI', evidencias: ['Reportes Power BI'] },
    { step: '5', nombre: 'Gerencia', area: 'Gerencia', entrada: 'Dashboards', actividad: 'Análisis y decisión', salida: 'Decisiones', indicador: '% decisiones soportadas por datos', riesgo: 'Baja adopción', estado: 'warn', responsable: 'Gerencia General', evidencias: ['Minutas de decisión'] },
    { step: '6', nombre: 'Acciones', area: 'Áreas operativas', entrada: 'Decisiones', actividad: 'Ejecución y retroalimentación', salida: 'Resultados y mejora', indicador: 'Acciones ejecutadas', riesgo: 'Sin cierre de ciclo', estado: 'warn', responsable: 'Áreas', evidencias: ['Tablero de acciones'] },
  ],
  kpis: [
    { kpi: '% de KPIs automatizados', definicion: 'KPIs con carga automática', formula: '(KPIs automatizados / KPIs totales) × 100', unidad: '%', lineaBase: 20, meta: 90, actual: 52, tendencia: 'up', frecuencia: 'Quincenal', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'warn', comentario: 'DataMart en construcción.', ejemplo: true },
    { kpi: 'Disponibilidad del dashboard', definicion: 'Uptime de los tableros', formula: '(Tiempo disponible / Tiempo total) × 100', unidad: '%', lineaBase: 90, meta: 99, actual: 97, tendencia: 'up', frecuencia: 'Mensual', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'ok', comentario: 'Servicio Power BI estable.', ejemplo: true },
    { kpi: 'Tiempo de actualización', definicion: 'Latencia de refresco de datos', formula: 'Δt entre refrescos', unidad: 'horas', lineaBase: 24, meta: 4, actual: 12, tendencia: 'down', frecuencia: 'Semanal', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'warn', comentario: 'Objetivo: refresco 4× al día.', ejemplo: true },
    { kpi: '% decisiones soportadas por datos', definicion: 'Decisiones con evidencia en tablero', formula: '(Decisiones con datos / Totales) × 100', unidad: '%', lineaBase: 30, meta: 80, actual: 48, tendencia: 'up', frecuencia: 'Mensual', fuente: 'Gerencia', responsable: 'Gerencia General', fechaAct: HOY, semaforo: 'warn', comentario: 'Adopción en crecimiento.', ejemplo: true },
    { kpi: 'Calidad del dato', definicion: 'Índice de calidad (exactitud)', formula: 'Registros válidos / Totales', unidad: '%', lineaBase: 74, meta: 95, actual: 85, tendencia: 'up', frecuencia: 'Quincenal', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'warn', comentario: 'Remediación en curso.', ejemplo: true },
    { kpi: 'Completitud', definicion: 'Campos completos requeridos', formula: '(Campos completos / Requeridos) × 100', unidad: '%', lineaBase: 78, meta: 97, actual: 88, tendencia: 'up', frecuencia: 'Quincenal', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'warn', comentario: 'Faltantes en fuentes legacy.', ejemplo: true },
    { kpi: 'Consistencia', definicion: 'Coherencia entre fuentes', formula: '(Registros consistentes / Totales) × 100', unidad: '%', lineaBase: 72, meta: 95, actual: 83, tendencia: 'up', frecuencia: 'Quincenal', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'warn', comentario: 'Reglas de conciliación aplicadas.', ejemplo: true },
    { kpi: 'N.º de fuentes integradas', definicion: 'Fuentes conectadas al DataMart', formula: 'Conteo de fuentes', unidad: 'u', lineaBase: 2, meta: 8, actual: 5, tendencia: 'up', frecuencia: 'Mensual', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'warn', comentario: 'ERP, Excel, importaciones y 2 más.', ejemplo: true },
    { kpi: 'Adopción por usuarios', definicion: 'Usuarios activos del tablero', formula: '(Usuarios activos / Objetivo) × 100', unidad: '%', lineaBase: 25, meta: 80, actual: 54, tendencia: 'up', frecuencia: 'Mensual', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'warn', comentario: 'Capacitación pendiente.', ejemplo: true },
    { kpi: 'Incidentes de calidad de datos', definicion: 'Incidentes reportados', formula: 'Conteo de incidentes', unidad: 'u', lineaBase: 12, meta: 2, actual: 6, tendencia: 'down', frecuencia: 'Mensual', fuente: 'TI', responsable: 'TI', fechaAct: HOY, semaforo: 'warn', comentario: 'Descendente con gobierno de datos.', ejemplo: true },
  ],
  cualitativo: [
    { dimension: 'Confiabilidad percibida del dato', calificacion: 3, evidencia: 'Encuesta a usuarios', comentario: 'Confianza media; mejora con remediación.', riesgo: 'Rechazo de tableros', recomendacion: 'Sello de calidad de datos', fecha: HOY },
    { dimension: 'Adopción por usuarios', calificacion: 3, evidencia: 'Analítica de uso', comentario: 'Adopción creciente pero desigual por área.', riesgo: 'Uso de Excel paralelo', recomendacion: 'Plan de adopción y campeones de datos', fecha: HOY },
    { dimension: 'Calidad del gobierno de datos', calificacion: 2, evidencia: 'Política borrador', comentario: 'Gobierno incipiente, sin roles formales.', riesgo: 'Datos sin dueño', recomendacion: 'Nombrar data owners por dominio', fecha: HOY },
    { dimension: 'Facilidad de interpretación', calificacion: 4, evidencia: 'Feedback de tableros', comentario: 'Tableros claros y ejecutivos.', riesgo: 'Sobrecarga de métricas', recomendacion: 'Diseño enfocado en decisiones', fecha: HOY },
    { dimension: 'Cultura de decisiones basadas en datos', calificacion: 3, evidencia: 'Minutas de decisión', comentario: 'En transición de intuición a evidencia.', riesgo: 'Decisiones sin datos', recomendacion: 'Ritual de decisión con tablero', fecha: HOY },
  ],
  desviaciones: [
    {
      codigo: 'DEV-CI-01', kpiActividad: 'Calidad del dato', descripcion: 'Índice de calidad por debajo del objetivo', meta: '≥ 95%', resultado: '85%', variacion: '−10 pp', tipo: 'Calidad de datos', severidad: 'Alta',
      causaProbable: 'Datos legacy en Excel sin validación de entrada', impactoOperativo: 'Decisiones sobre datos erróneos', impactoFinanciero: 'Indirecto', responsable: 'TI', fechaDeteccion: '2026-06-20', fechaLimite: '2026-08-12', estado: 'En control', evidencia: 'Informe de calidad',
      control: { causaRaiz: 'Ausencia de validaciones y reglas de entrada en fuentes', tecnica: 'Ishikawa', cincoPorques: ['Calidad baja', 'Datos legacy inconsistentes', 'Sin validación de entrada', 'Captura manual en Excel', 'Sin gobierno de datos'], contencion: 'Reglas de limpieza en Power Query', correctiva: 'Validaciones en el origen y catálogo de datos', preventiva: 'Gobierno de datos con data owners', responsable: 'TI', aprobador: 'Gerencia General', fechaCompromiso: '2026-08-12', avance: 55, estado: 'En ejecución', verificacion: 'Índice ≥ 95%', fechaCierre: '', leccion: 'La calidad se asegura en el origen, no en el reporte.' },
    },
    {
      codigo: 'DEV-CI-02', kpiActividad: '% de KPIs automatizados', descripcion: 'Automatización por debajo del objetivo', meta: '≥ 90%', resultado: '52%', variacion: '−38 pp', tipo: 'Tecnológica', severidad: 'Media',
      causaProbable: 'DataMart en construcción y fuentes sin API', impactoOperativo: 'Carga manual de KPIs', impactoFinanciero: 'Bajo', responsable: 'TI', fechaDeteccion: '2026-07-01', fechaLimite: '2026-08-15', estado: 'Abierta', evidencia: 'DataMart v1',
      control: { causaRaiz: 'Modelo de datos en desarrollo', tecnica: '5 Porqués', cincoPorques: ['Automatización parcial', 'DataMart incompleto', 'Fuentes sin conector', 'Priorización por volumen', 'Recursos de TI limitados'], contencion: 'Refresco manual programado', correctiva: 'Completar DataMart y conectores', preventiva: 'Estándar de integración de nuevas fuentes', responsable: 'TI', aprobador: 'Jefatura TI', fechaCompromiso: '2026-08-15', avance: 45, estado: 'En ejecución', verificacion: 'Automatización ≥ 90%', fechaCierre: '', leccion: 'Automatizar primero los KPIs de mayor uso ejecutivo.' },
    },
    {
      codigo: 'DEV-CI-03', kpiActividad: 'Adopción por usuarios', descripcion: 'Adopción por debajo del objetivo', meta: '≥ 80%', resultado: '54%', variacion: '−26 pp', tipo: 'Recursos', severidad: 'Media',
      causaProbable: 'Falta de capacitación y uso de Excel paralelo', impactoOperativo: 'Bajo aprovechamiento', impactoFinanciero: 'Costo hundido de la inversión', responsable: 'TI', fechaDeteccion: '2026-07-05', fechaLimite: '2026-08-20', estado: 'Abierta', evidencia: 'Analítica de uso',
      control: { causaRaiz: 'Sin plan de gestión del cambio', tecnica: '5 Porqués', cincoPorques: ['Baja adopción', 'Sin capacitación', 'Sin plan de cambio', 'Cultura de Excel', 'Sin incentivos de uso'], contencion: 'Sesiones de onboarding', correctiva: 'Plan de adopción con campeones de datos', preventiva: 'Ritual de decisión con tablero', responsable: 'TI / Gerencia', aprobador: 'Gerencia General', fechaCompromiso: '2026-08-20', avance: 30, estado: 'En planificación', verificacion: 'Adopción ≥ 80%', fechaCierre: '', leccion: 'La tecnología sin gestión del cambio no genera adopción.' },
    },
  ],
  planAccion: [
    { codigo: 'AC-CI-01', iniciativa: 'DataMart central', problema: 'Datos dispersos', accion: 'Construir DataMart e integrar fuentes', responsable: 'TI', area: 'TI', prioridad: 'Crítica', inicio: '2026-06-15', fechaCompromiso: '2026-08-01', estado: 'En ejecución', progreso: 60, kpiValidacion: 'Fuentes integradas', meta: '8', dependencias: 'Informe de calidad', presupuesto: 'USD 4,000', impacto: 'Fuente única de verdad', riesgo: 'Fuentes legacy', evidencia: 'DataMart v1', proximoPaso: 'Conectar ERP' },
    { codigo: 'AC-CI-02', iniciativa: 'Automatización de KPIs', problema: 'Carga manual', accion: 'Automatizar KPIs con Power Query', responsable: 'TI', area: 'TI', prioridad: 'Alta', inicio: '2026-07-01', fechaCompromiso: '2026-08-15', estado: 'En ejecución', progreso: 40, kpiValidacion: '% KPIs automatizados', meta: '90%', dependencias: 'DataMart', presupuesto: 'USD 0', impacto: 'Datos frescos', riesgo: 'Fuentes sin API', evidencia: 'Consultas PQ', proximoPaso: 'Priorizar KPIs de gerencia' },
    { codigo: 'AC-CI-03', iniciativa: 'Gobierno de datos', problema: 'Datos sin dueño', accion: 'Definir política y data owners', responsable: 'Gerencia / TI', area: 'Gerencia', prioridad: 'Alta', inicio: '2026-07-15', fechaCompromiso: '2026-08-20', estado: 'En planificación', progreso: 15, kpiValidacion: 'Calidad del dato', meta: '95%', dependencias: '—', presupuesto: 'USD 0', impacto: 'Confiabilidad', riesgo: 'Falta de adopción', evidencia: 'Política borrador', proximoPaso: 'Nombrar data owners' },
    { codigo: 'AC-CI-04', iniciativa: 'Plan de adopción', problema: 'Baja adopción', accion: 'Capacitación y campeones de datos', responsable: 'TI', area: 'TI', prioridad: 'Media', inicio: '2026-07-20', fechaCompromiso: '2026-08-25', estado: 'No iniciado', progreso: 0, kpiValidacion: 'Adopción por usuarios', meta: '80%', dependencias: 'Tableros', presupuesto: 'USD 800', impacto: 'Uso efectivo', riesgo: 'Resistencia', evidencia: '—', proximoPaso: 'Diseñar onboarding' },
  ],
  riesgos: [
    'Calidad y consistencia de datos en fuentes legacy',
    'DataMart y automatización aún en construcción',
    'Gobierno de datos incipiente, sin data owners formales',
    'Baja adopción por cultura de Excel paralelo',
  ],
};

/** @type {import('./types.js').Plan[]} */
export const plans = [controlTower, sop, intelligence];

export const getPlan = (id) => plans.find((p) => p.id === id) || null;

export const META = { HOY, PERIODO };
