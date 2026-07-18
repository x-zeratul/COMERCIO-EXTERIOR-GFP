/**
 * Estado ligero de la app (rol activo, preferencias). Persistencia en
 * localStorage. Capa desacoplada: reemplazable por auth/servicios reales.
 */
import { ROLES } from '../data/meta.js';

const KEY = 'friopacking.state.v1';
const listeners = new Set();

const defaults = { role: 'gerente', phone: '' };

function load() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { ...defaults }; }
}

let state = load();

export function getState() { return { ...state }; }
export function currentRole() { return ROLES[state.role] || ROLES.gerente; }
export function can(permiso) { return currentRole().permisos.includes(permiso); }

export function setState(patch) {
  state = { ...state, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* modo privado */ }
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
