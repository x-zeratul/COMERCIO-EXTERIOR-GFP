/**
 * Metadatos corporativos: marca, roles/permisos, bitácora y cálculos globales.
 */
import { plans } from './plans.js';

export const BRAND = {
  empresa: 'Friopacking S.A.C.',
  grupo: ['FRIOPACKING', 'FRIOTEAM', 'SMARTCOLD', 'HERMETICA'],
  eslogan: 'Ingeniería en cadena de frío',
  periodo: '90 días',
  mensajeEjecutivo:
    'Tres planes estratégicos de alto impacto en ejecución simultánea para elevar el control logístico, la planificación integrada y la inteligencia de datos del grupo Friopacking.',
};

/** Roles y matriz de permisos (RBAC simulado, arquitectura lista para auth real). */
export const ROLES = {
  director: {
    id: 'director', nombre: 'Director Ejecutivo',
    permisos: ['ver', 'crear', 'editar', 'aprobar', 'cerrar', 'reportar', 'compartir', 'admin'],
  },
  gerente: {
    id: 'gerente', nombre: 'Gerente General',
    permisos: ['ver', 'crear', 'editar', 'aprobar', 'cerrar', 'reportar', 'compartir'],
  },
  lider: {
    id: 'lider', nombre: 'Líder del plan',
    permisos: ['ver', 'crear', 'editar', 'cerrar', 'reportar', 'compartir'],
  },
  responsable: {
    id: 'responsable', nombre: 'Responsable de área',
    permisos: ['ver', 'editar', 'reportar', 'compartir'],
  },
  analista: {
    id: 'analista', nombre: 'Analista',
    permisos: ['ver', 'reportar'],
  },
  consulta: {
    id: 'consulta', nombre: 'Usuario de consulta',
    permisos: ['ver'],
  },
};

export const PERMISOS_LABEL = {
  ver: 'Ver', crear: 'Crear', editar: 'Editar', aprobar: 'Aprobar',
  cerrar: 'Cerrar desviaciones', reportar: 'Generar reportes',
  compartir: 'Compartir WhatsApp', admin: 'Administrar usuarios',
};

/** Bitácora / registro de actualizaciones (ejemplo trazable). */
export const activityLog = [
  { fecha: '2026-07-18 09:12', usuario: 'J. Comercio Exterior', plan: 'control-tower', cambio: 'Actualización de KPI Cobertura de tracking', comentario: 'Sube a 78% tras integrar 2 navieras', estadoAnterior: '71%', estadoNuevo: '78%', evidencia: 'Dashboard v1' },
  { fecha: '2026-07-17 16:40', usuario: 'Planeamiento', plan: 'sop', cambio: 'Cierre de primer ciclo S&OP piloto', comentario: 'Acta de comité firmada', estadoAnterior: 'En ejecución', estadoNuevo: 'Ciclo 1 cerrado', evidencia: 'Acta ciclo 1' },
  { fecha: '2026-07-17 11:05', usuario: 'TI', plan: 'intelligence', cambio: 'Avance DataMart', comentario: '5.ª fuente integrada', estadoAnterior: '4 fuentes', estadoNuevo: '5 fuentes', evidencia: 'DataMart v1' },
  { fecha: '2026-07-16 15:22', usuario: 'Finanzas', plan: 'control-tower', cambio: 'Nueva desviación DEV-CT-03', comentario: 'Sobrecosto logístico 9%', estadoAnterior: '—', estadoNuevo: 'Abierta', evidencia: 'Reporte de fletes' },
  { fecha: '2026-07-15 10:00', usuario: 'Gerencia General', plan: 'sop', cambio: 'Aprobación de matriz de priorización (criterios)', comentario: 'Criterios de valor y capacidad', estadoAnterior: 'Borrador', estadoNuevo: 'Aprobado', evidencia: 'Minuta' },
  { fecha: '2026-07-14 17:30', usuario: 'TI', plan: 'intelligence', cambio: 'Control DEV-CI-01 en ejecución', comentario: 'Reglas de validación en origen', estadoAnterior: '40%', estadoNuevo: '55%', evidencia: 'Informe de calidad' },
];

export const planName = (id) => (plans.find((p) => p.id === id)?.nombreCorto ?? id);

/* ------------------------------------------------------------------ */
/* Cálculos globales derivados del modelo de datos                     */
/* ------------------------------------------------------------------ */
const sevRank = { 'Crítica': 3, 'Alta': 2, 'Media': 1, 'Baja': 0 };

export function globalMetrics() {
  const avance = Math.round(plans.reduce((a, p) => a + p.avance, 0) / plans.length);
  const hitosCumplidos = plans.reduce((a, p) => a + p.hitosCumplidos, 0);
  const hitosTotal = plans.reduce((a, p) => a + p.hitosTotal, 0);
  const desviaciones = plans.flatMap((p) => p.desviaciones);
  const criticas = desviaciones.filter((d) => sevRank[d.severidad] >= 2).length;
  const acciones = plans.flatMap((p) => p.planAccion);
  const hoy = new Date('2026-07-18');
  const vencidas = acciones.filter((a) => a.estado !== 'Completado' && a.fechaCompromiso && new Date(a.fechaCompromiso) < hoy).length;
  const hitosRiesgo = plans.reduce((a, p) => a + (p.hitosTotal - p.hitosCumplidos), 0);
  return {
    avance, hitosCumplidos, hitosTotal, hitosRiesgo,
    desviacionesTotal: desviaciones.length,
    desviacionesCriticas: criticas,
    accionesTotal: acciones.length,
    accionesVencidas: vencidas,
    planesActivos: plans.length,
  };
}

/** Conteo de desviaciones por severidad (todas). */
export function deviationsBySeverity() {
  const acc = { 'Baja': 0, 'Media': 0, 'Alta': 0, 'Crítica': 0 };
  plans.flatMap((p) => p.desviaciones).forEach((d) => { acc[d.severidad] = (acc[d.severidad] || 0) + 1; });
  return acc;
}

/** Conteo de acciones por estado (todas). */
export function actionsByStatus() {
  const acc = {};
  plans.flatMap((p) => p.planAccion).forEach((a) => { acc[a.estado] = (acc[a.estado] || 0) + 1; });
  return acc;
}

/** Distribución de responsabilidades por área (nodos de flujo + acciones). */
export function responsibilitiesByArea() {
  const acc = {};
  plans.forEach((p) => {
    p.planAccion.forEach((a) => { acc[a.area] = (acc[a.area] || 0) + 1; });
  });
  return Object.entries(acc).sort((a, b) => b[1] - a[1]);
}
