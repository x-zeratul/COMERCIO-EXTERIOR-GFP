/**
 * Bootstrap de la aplicación ejecutiva Friopacking.
 * Ensambla shell (sidebar + topbar), router y delegación de acciones globales.
 */
import { $, on, toast } from './lib/dom.js';
import { icon, brandMark } from './lib/icons.js';
import { route, setNotFound, startRouter, navigate } from './lib/router.js';
import { getState, setState, currentRole } from './lib/store.js';
import { ROLES } from './data/meta.js';
import { plans, getPlan } from './data/plans.js';
import { openInfographic, openReport, openWhatsApp } from './lib/actions.js';
import { buildReport } from './lib/report.js';
import { printHtml } from './lib/export.js';

import { renderOverview } from './views/overview.js';
import { renderPlans } from './views/plans.js';
import { renderPlanDetail, mountPlanDetail } from './views/plan-detail.js';
import { renderActivity } from './views/activity.js';
import { renderRoles } from './views/roles.js';
import { renderReports } from './views/reports.js';

const NAV = [
  { href: '#/', label: 'Executive Overview', icon: 'home' },
  { href: '#/planes', label: 'Planes estratégicos', icon: 'layers' },
  { href: '#/reportes', label: 'Reportes', icon: 'file' },
  { href: '#/bitacora', label: 'Bitácora', icon: 'activity' },
  { href: '#/roles', label: 'Roles y permisos', icon: 'users' },
];

function shell() {
  const st = getState();
  document.getElementById('app').innerHTML = `
    <a class="skip-link" href="#main-content">Saltar al contenido</a>
    <div class="mobile-overlay" data-overlay></div>
    <aside class="sidebar" aria-label="Navegación principal">
      <div class="sidebar__brand">${brandMark(38)}
        <div class="sidebar__brand-text"><b>Friopacking</b><span>Control Estratégico</span></div>
      </div>
      <div class="sidebar__section-label">Navegación</div>
      <nav class="nav" data-nav>
        ${NAV.map((n) => `<a href="${n.href}">${icon(n.icon, 18)} <span>${n.label}</span></a>`).join('')}
      </nav>
      <div class="sidebar__section-label">Planes</div>
      <nav class="nav">
        ${plans.map((p) => `<a href="#/plan/${p.id}">${icon(p.icon, 18)} <span>${p.nombreCorto}</span></a>`).join('')}
      </nav>
      <div class="sidebar__foot">
        Plan 90 días · ${plans.length} planes activos<br>© ${new Date().getFullYear()} Friopacking S.A.C.
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="btn btn--icon btn--ghost topbar__hamburger" data-hamburger aria-label="Abrir menú">${icon('menu', 20)}</button>
        <div class="topbar__title"><b>Tablero de Planes Estratégicos</b><span>Grupo Friopacking · FRIOPACKING · FRIOTEAM · SMARTCOLD · HERMETICA</span></div>
        <div class="topbar__spacer"></div>
        <div class="role-select">
          <span class="perm-hint" style="display:none">Rol:</span>
          ${icon('users', 16)}
          <select data-role aria-label="Rol activo">
            ${Object.values(ROLES).map((r) => `<option value="${r.id}" ${r.id === st.role ? 'selected' : ''}>${r.nombre}</option>`).join('')}
          </select>
        </div>
      </header>
      <main class="content" id="main-content" data-content tabindex="-1">
        <div class="state-box">${icon('snowflake', 40)}<p>Cargando…</p></div>
      </main>
    </div>`;

  // Role selector.
  $('[data-role]').addEventListener('change', (e) => {
    setState({ role: e.target.value });
    toast('Rol: ' + currentRole().nombre, 'ok');
  });
  // Mobile nav.
  const closeNav = () => document.body.classList.remove('nav-open');
  $('[data-hamburger]').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $('[data-overlay]').addEventListener('click', closeNav);
  $('[data-nav]').addEventListener('click', closeNav);
}

function setActiveNav() {
  const hash = location.hash || '#/';
  document.querySelectorAll('.sidebar a').forEach((a) => {
    const href = a.getAttribute('href');
    const active = href === hash || (href !== '#/' && hash.startsWith(href));
    a.classList.toggle('active', href === '#/' ? hash === '#/' : active);
  });
}

const content = () => $('[data-content]');
function paint(html) { content().innerHTML = html; content().focus?.(); setActiveNav(); }

/* ------------------------------- Rutas ------------------------------- */
route('/', () => paint(renderOverview()));
route('/planes', () => paint(renderPlans()));
route('/reportes', () => paint(renderReports()));
route('/bitacora', () => paint(renderActivity()));
route('/roles', () => paint(renderRoles()));

route('/plan/:id', ({ id, query }) => {
  const p = getPlan(id);
  if (!p) { paint(`<div class="state-box">${icon('alert', 40)}<h3>Plan no encontrado</h3><p><a href="#/planes">Volver a planes</a></p></div>`); return; }
  paint(renderPlanDetail(p, query.tab || 'resumen'));
  mountPlanDetail(content(), p, (tab) => {
    const url = new URL(location.href);
    history.replaceState(null, '', `#/plan/${p.id}?tab=${tab}`);
  });
});
route('/plan/:id/infografia', ({ id }) => {
  const p = getPlan(id); if (!p) { navigate('#/planes'); return; }
  paint(renderPlanDetail(p, 'resumen')); mountPlanDetail(content(), p);
  openInfographic(p);
});
route('/plan/:id/reporte', ({ id }) => {
  const p = getPlan(id); if (!p) { navigate('#/planes'); return; }
  paint(renderPlanDetail(p, 'resumen')); mountPlanDetail(content(), p);
  openReport(p, plans);
});
setNotFound(() => paint(`<div class="state-box">${icon('alert', 40)}<h3>Página no encontrada</h3><p><a href="#/">Ir al inicio</a></p></div>`));

/* ---------------------- Delegación de acciones globales ---------------------- */
function wireGlobalActions() {
  const root = document.getElementById('app');
  on(root, 'click', '[data-action]', (e, el) => {
    const action = el.dataset.action;
    const p = el.dataset.plan ? getPlan(el.dataset.plan) : null;
    if (action === 'infographic' && p) openInfographic(p);
    else if (action === 'report' && p) openReport(p, plans);
    else if (action === 'whatsapp' && p) openWhatsApp(p);
    else if (action === 'report-consolidated') {
      const { html, styles } = buildReport(plans, 'consolidado');
      printHtml(html, 'Reporte consolidado Friopacking', styles);
    }
  });
  // Reportes directos desde el centro de reportes.
  on(root, 'click', '[data-report-plan]', (e, el) => {
    const p = getPlan(el.dataset.reportPlan);
    if (!p) return;
    const { html, styles } = buildReport(p, el.dataset.tipo || 'completo');
    printHtml(html, `Reporte ${p.nombre}`, styles);
  });
}

/* -------------------------------- Init -------------------------------- */
function init() {
  shell();
  wireGlobalActions();
  startRouter();
  window.addEventListener('hashchange', setActiveNav);
}
document.addEventListener('DOMContentLoaded', init);
