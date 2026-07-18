/**
 * Vista: Roles y permisos (RBAC simulado, arquitectura lista para auth real).
 */
import { esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { badge } from '../lib/ui.js';
import { ROLES, PERMISOS_LABEL } from '../data/meta.js';
import { getState } from '../lib/store.js';

export function renderRoles() {
  const active = getState().role;
  const perms = Object.keys(PERMISOS_LABEL);
  const rows = Object.values(ROLES).map((r) => `<tr${r.id === active ? ' style="background:var(--brand-50)"' : ''}>
    <td class="strong">${esc(r.nombre)}${r.id === active ? ' ' + badge('Rol activo', 'ok') : ''}</td>
    ${perms.map((pm) => `<td style="text-align:center">${r.permisos.includes(pm) ? `<span style="color:var(--ok)">${icon('check', 16)}</span>` : '<span class="faint">—</span>'}</td>`).join('')}
  </tr>`).join('');
  return `
  <div class="page-head"><div class="page-head__text">
    <h1>Roles y permisos</h1>
    <p class="subtitle">Matriz RBAC del sistema. El rol activo se selecciona en la barra superior. Arquitectura preparada para autenticación real (Supabase / Microsoft 365).</p>
  </div></div>
  <div class="panel">
    <div class="panel__head">${icon('users', 16)}<h3>Matriz de permisos</h3></div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>Rol</th>${perms.map((pm) => `<th style="text-align:center">${esc(PERMISOS_LABEL[pm])}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody></table></div>
    <p class="muted" style="font-size:.78rem;margin-top:10px">Para el MVP los roles se simulan y se persisten en el navegador. En producción se conectarán a un proveedor de identidad; los permisos ya condicionan acciones como generar reportes o compartir por WhatsApp.</p>
  </div>`;
}
