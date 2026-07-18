/**
 * Definiciones de tipos (JSDoc) del dominio Friopacking.
 * Se usan como contrato del modelo de datos. La app es JS puro sin build,
 * por lo que estos typedefs documentan y habilitan autocompletado sin
 * requerir compilación de TypeScript.
 *
 * @typedef {'ok'|'warn'|'danger'|'info'|'neutral'} Semaforo
 * @typedef {'Baja'|'Media'|'Alta'|'Crítica'} Severidad
 *
 * @typedef {Object} Kpi
 * @property {string} kpi
 * @property {string} definicion
 * @property {string} formula
 * @property {string} unidad
 * @property {number} lineaBase
 * @property {number} meta
 * @property {number} actual
 * @property {'up'|'down'|'flat'} tendencia
 * @property {string} frecuencia
 * @property {string} fuente
 * @property {string} responsable
 * @property {string} fechaAct
 * @property {Semaforo} semaforo
 * @property {string} comentario
 * @property {boolean} [ejemplo]  // true si es dato de ejemplo/pendiente de validación
 *
 * @typedef {Object} Qualitative
 * @property {string} dimension
 * @property {1|2|3|4|5} calificacion
 * @property {string} evidencia
 * @property {string} comentario
 * @property {string} riesgo
 * @property {string} recomendacion
 * @property {string} fecha
 *
 * @typedef {Object} FlowNode
 * @property {string} step
 * @property {string} nombre
 * @property {string} area
 * @property {string} entrada
 * @property {string} actividad
 * @property {string} salida
 * @property {string} indicador
 * @property {string} riesgo
 * @property {Semaforo} estado
 * @property {string} responsable
 * @property {string[]} evidencias
 *
 * @typedef {Object} Deviation
 * @property {string} codigo
 * @property {string} kpiActividad
 * @property {string} descripcion
 * @property {string} meta
 * @property {string} resultado
 * @property {string} variacion
 * @property {string} tipo
 * @property {Severidad} severidad
 * @property {string} causaProbable
 * @property {string} impactoOperativo
 * @property {string} impactoFinanciero
 * @property {string} responsable
 * @property {string} fechaDeteccion
 * @property {string} fechaLimite
 * @property {string} estado
 * @property {string} evidencia
 * @property {Control} control
 *
 * @typedef {Object} Control
 * @property {string} causaRaiz
 * @property {string} tecnica
 * @property {string[]} cincoPorques
 * @property {string} contencion
 * @property {string} correctiva
 * @property {string} preventiva
 * @property {string} responsable
 * @property {string} aprobador
 * @property {string} fechaCompromiso
 * @property {number} avance
 * @property {string} estado
 * @property {string} verificacion
 * @property {string} fechaCierre
 * @property {string} leccion
 *
 * @typedef {Object} Action
 * @property {string} codigo
 * @property {string} iniciativa
 * @property {string} problema
 * @property {string} accion
 * @property {string} responsable
 * @property {string} area
 * @property {'Baja'|'Media'|'Alta'|'Crítica'} prioridad
 * @property {string} inicio
 * @property {string} fechaCompromiso
 * @property {string} estado
 * @property {number} progreso
 * @property {string} kpiValidacion
 * @property {string} meta
 * @property {string} dependencias
 * @property {string} presupuesto
 * @property {string} impacto
 * @property {string} riesgo
 * @property {string} evidencia
 * @property {string} proximoPaso
 *
 * @typedef {Object} Plan
 * @property {string} id
 * @property {string} numero
 * @property {string} nombre
 * @property {string} nombreCorto
 * @property {string} tagline
 * @property {string} icon
 * @property {string} color
 * @property {string} objetivo90
 * @property {string} justificacion
 * @property {string} alcance
 * @property {string} resultadoEsperado
 * @property {string} patrocinador
 * @property {string} lider
 * @property {string[]} areasParticipantes
 * @property {string[]} recursos
 * @property {string} duracion
 * @property {string} estado
 * @property {Severidad|'Bajo'|'Medio'|'Alto'} nivelRiesgo
 * @property {number} avance
 * @property {string} fechaActualizacion
 * @property {string} proximoHito
 * @property {number} hitosCumplidos
 * @property {number} hitosTotal
 * @property {Object[]} fases
 * @property {Object[]} cronograma
 * @property {FlowNode[]} flujo
 * @property {Kpi[]} kpis
 * @property {Qualitative[]} cualitativo
 * @property {Deviation[]} desviaciones
 * @property {Action[]} planAccion
 * @property {string[]} riesgos
 * @property {{practicas:string}} benchmark
 */
export const ESCALA_CUALITATIVA = ['Crítico', 'Bajo', 'Aceptable', 'Bueno', 'Excelente'];
export const SEVERIDADES = ['Baja', 'Media', 'Alta', 'Crítica'];
export const ESTADOS_ACCION = ['No iniciado', 'En planificación', 'En ejecución', 'En riesgo', 'Bloqueado', 'Completado', 'Cancelado'];
export const TIPOS_DESVIACION = ['Operativa', 'Financiera', 'Comercial', 'Logística', 'Tecnológica', 'Calidad de datos', 'Cumplimiento', 'Recursos', 'Cronograma'];
