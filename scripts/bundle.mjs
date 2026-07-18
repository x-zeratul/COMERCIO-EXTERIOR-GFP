/**
 * Empaqueta la SPA modular en un ÚNICO archivo HTML autocontenido, apto para
 * un Artifact (sin recursos externos, sin imports entre archivos).
 * Salida: dist/friopacking-app.html (contenido: <style> + #app + <script>).
 *   node scripts/bundle.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const CSS = ['src/styles/tokens.css', 'src/styles/base.css', 'src/styles/components.css'];

// Orden topológico por dependencias.
const JS = [
  'src/lib/dom.js', 'src/data/types.js', 'src/data/realtrade.js', 'src/lib/icons.js',
  'src/lib/charts.js', 'src/data/plans.js', 'src/data/meta.js', 'src/lib/store.js',
  'src/lib/whatsapp.js', 'src/lib/export.js', 'src/lib/router.js', 'src/lib/ui.js',
  'src/lib/infographic.js', 'src/lib/report.js', 'src/lib/actions.js',
  'src/views/overview.js', 'src/views/plans.js', 'src/views/plan-detail.js',
  'src/views/reports.js', 'src/views/activity.js', 'src/views/roles.js', 'src/app.js',
];

function stripModule(src, path) {
  let out = src
    // Elimina import statements (líneas que empiezan por import ... ; )
    .replace(/^import\s+[^;]*?;\s*$/gm, '')
    // Elimina re-exports tipo: export { X };
    .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, '')
    // Convierte `export const/let/function/async/class` en declaración normal
    .replace(/^export\s+(async\s+function|function|const|let|class)/gm, '$1');
  // Resuelve la única colisión de nombre de nivel superior: SEM en charts.js
  if (path.endsWith('charts.js')) out = out.replace(/\bSEM\b/g, 'SEM_CH');
  return out;
}

const css = (await Promise.all(CSS.map((f) => readFile(join(ROOT, f), 'utf8')))).join('\n\n');

let js = '';
for (const f of JS) {
  const raw = await readFile(join(ROOT, f), 'utf8');
  js += `\n/* ===== ${f} ===== */\n` + stripModule(raw, f) + '\n';
}
// init seguro aunque DOMContentLoaded ya se haya disparado (Artifact iframe).
js = js.replace(
  "document.addEventListener('DOMContentLoaded', init);",
  "if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();"
);

const bundle = `<style>\n${css}\n</style>\n<div class="app" id="app"></div>\n<script>\n(function(){\n"use strict";\n${js}\n})();\n</script>\n`;

await mkdir(join(ROOT, 'dist'), { recursive: true });
await writeFile(join(ROOT, 'dist', 'friopacking-app.html'), bundle, 'utf8');
console.log('Bundle escrito: dist/friopacking-app.html (', bundle.length, 'bytes )');
