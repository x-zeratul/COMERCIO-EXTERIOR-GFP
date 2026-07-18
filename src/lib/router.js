/**
 * Router hash minimalista. Rutas:
 *  #/                       overview
 *  #/planes                 lista de planes
 *  #/plan/:id               detalle (con ?tab=)
 *  #/plan/:id/infografia    infografía
 *  #/plan/:id/reporte       reporte
 *  #/reportes               centro de reportes
 *  #/bitacora               actividad
 *  #/roles                  roles y permisos
 */
const routes = [];
let notFound = () => {};

export function route(pattern, handler) { routes.push({ pattern, handler }); }
export function setNotFound(fn) { notFound = fn; }

function parse(hash) {
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  const clean = path.replace(/^\/+|\/+$/g, '');
  const parts = clean === '' ? [] : clean.split('/');
  const params = Object.fromEntries(new URLSearchParams(query));
  return { parts, params, path: '/' + clean };
}

function match(pattern, parts) {
  const pp = pattern.replace(/^\/+|\/+$/g, '');
  const segs = pp === '' ? [] : pp.split('/');
  if (segs.length !== parts.length) return null;
  const out = {};
  for (let i = 0; i < segs.length; i++) {
    if (segs[i].startsWith(':')) out[segs[i].slice(1)] = decodeURIComponent(parts[i]);
    else if (segs[i] !== parts[i]) return null;
  }
  return out;
}

export function resolve() {
  const { parts, params, path } = parse(location.hash || '#/');
  for (const r of routes) {
    const m = match(r.pattern, parts);
    if (m) { r.handler({ ...m, query: params, path }); return; }
  }
  notFound({ path });
}

export function navigate(to) { location.hash = to.startsWith('#') ? to : '#' + to; }

export function startRouter() {
  window.addEventListener('hashchange', () => { resolve(); window.scrollTo(0, 0); });
  resolve();
}
