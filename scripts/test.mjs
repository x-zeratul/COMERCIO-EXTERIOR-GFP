/**
 * Pruebas de humo (Node nativo, sin dependencias).
 * Valida integridad del modelo de datos y los generadores puros
 * (infografía, reporte, WhatsApp, métricas). Cubre criterios de aceptación.
 *   node scripts/test.mjs
 */
import assert from 'node:assert/strict';

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log('  ✓ ' + name); passed++; }
  catch (e) { console.error('  ✗ ' + name + '\n    → ' + e.message); failed++; }
}

const { plans, getPlan } = await import('../src/data/plans.js');
const { globalMetrics, deviationsBySeverity, actionsByStatus, ROLES } = await import('../src/data/meta.js');
const { buildInfographic, INFOGRAPHIC_SIZE } = await import('../src/lib/infographic.js');
const { buildReport } = await import('../src/lib/report.js');
const { buildMessage, normalizePhone, waLink } = await import('../src/lib/whatsapp.js');
const { esc } = await import('../src/lib/dom.js');

console.log('\n== Modelo de datos: los tres planes ==');
test('Existen exactamente 3 planes', () => assert.equal(plans.length, 3));
test('Los planes esperados están presentes', () => {
  const ids = plans.map((p) => p.id).sort();
  assert.deepEqual(ids, ['control-tower', 'intelligence', 'sop']);
});
test('Cada plan conserva objetivo, alcance y fases (90 días)', () => {
  for (const p of plans) {
    assert.ok(p.objetivo90 && p.objetivo90.length > 10, `${p.id} objetivo`);
    assert.ok(p.alcance, `${p.id} alcance`);
    assert.equal(p.fases.length, 3, `${p.id} fases`);
    assert.deepEqual(p.fases.map((f) => f.nombre), ['Diagnóstico', 'Implementación', 'Consolidación']);
  }
});

console.log('\n== Cada plan: cuantitativo, cualitativo, desviaciones, control, acción ==');
for (const p of plans) {
  test(`[${p.nombreCorto}] tiene KPIs cuantitativos`, () => assert.ok(p.kpis.length >= 5));
  test(`[${p.nombreCorto}] tiene evaluación cualitativa (escala 1-5)`, () => {
    assert.ok(p.cualitativo.length >= 5);
    for (const q of p.cualitativo) assert.ok(q.calificacion >= 1 && q.calificacion <= 5);
  });
  test(`[${p.nombreCorto}] tiene desviaciones con control (causa raíz)`, () => {
    assert.ok(p.desviaciones.length >= 1);
    for (const d of p.desviaciones) {
      assert.ok(d.control && d.control.causaRaiz, `${d.codigo} sin causa raíz`);
      assert.ok(Array.isArray(d.control.cincoPorques) && d.control.cincoPorques.length >= 3);
    }
  });
  test(`[${p.nombreCorto}] tiene plan de acción`, () => assert.ok(p.planAccion.length >= 3));
  test(`[${p.nombreCorto}] tiene flujo operativo con nodos`, () => assert.ok(p.flujo.length >= 6));
}

console.log('\n== Generación de infografía ==');
for (const p of plans) {
  for (const fmt of ['vertical', 'horizontal']) {
    test(`[${p.nombreCorto}] infografía ${fmt} es SVG válido`, () => {
      const svg = buildInfographic(p, fmt);
      assert.ok(svg.startsWith('<svg'), 'no inicia con <svg');
      assert.ok(svg.includes('</svg>'), 'no cierra </svg>');
      assert.ok(svg.includes(`width="${INFOGRAPHIC_SIZE[fmt].width}"`), 'ancho correcto');
      assert.ok(svg.includes('FRIOPACKING'), 'incluye marca');
    });
  }
}

console.log('\n== Generación de reportes ==');
test('Reporte completo por plan contiene secciones clave', () => {
  const { html } = buildReport(plans[0], 'completo');
  ['Resumen ejecutivo', 'KPIs', 'cualitativa', 'Desviaciones', 'Plan de acción'].forEach((s) =>
    assert.ok(html.includes(s), 'falta: ' + s));
});
test('Reporte breve genera 1 página', () => assert.ok(buildReport(plans[1], 'breve').html.length > 200));
test('Reporte consolidado incluye los 3 planes', () => {
  const { html } = buildReport(plans, 'consolidado');
  plans.forEach((p) => assert.ok(html.includes(esc(p.nombre)), 'falta ' + p.nombre));
});

console.log('\n== WhatsApp ==');
test('buildMessage incluye plan, estado y avance', () => {
  const msg = buildMessage(plans[0], 'https://x/y');
  assert.ok(msg.includes(plans[0].nombre) && msg.includes(String(plans[0].avance)));
});
test('normalizePhone antepone código país a número local', () => {
  assert.equal(normalizePhone('987654321', '51'), '51987654321');
  assert.equal(normalizePhone('+51 987 654 321'), '51987654321');
});
test('waLink codifica el mensaje', () => {
  const url = waLink('hola mundo', '51999');
  assert.ok(url.startsWith('https://wa.me/51999?text=') && url.includes('hola%20mundo'));
});

console.log('\n== Métricas globales ==');
test('globalMetrics agrega los 3 planes', () => {
  const m = globalMetrics();
  assert.equal(m.planesActivos, 3);
  assert.ok(m.avance > 0 && m.avance <= 100);
  assert.ok(m.desviacionesTotal >= 6);
});
test('deviationsBySeverity y actionsByStatus devuelven conteos', () => {
  assert.ok(Object.values(deviationsBySeverity()).reduce((a, b) => a + b, 0) >= 6);
  assert.ok(Object.keys(actionsByStatus()).length >= 1);
});
test('Roles definen matriz de permisos', () => {
  assert.ok(Object.keys(ROLES).length >= 6);
  assert.ok(ROLES.director.permisos.includes('admin'));
  assert.ok(!ROLES.consulta.permisos.includes('admin'));
});

console.log(`\n${failed === 0 ? '✅' : '❌'} ${passed} pruebas OK, ${failed} fallidas\n`);
process.exit(failed === 0 ? 0 : 1);
