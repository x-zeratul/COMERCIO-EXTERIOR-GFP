/**
 * Compartir por WhatsApp.
 * Nivel 1 (sin backend): Web Share API nativa cuando está disponible +
 * fallback a enlace oficial wa.me. Nivel 2 (producción): POST a /api/whatsapp
 * que usa WhatsApp Business Cloud API con token en variables de entorno.
 */

/** Construye el mensaje ejecutivo estándar. */
export function buildMessage(plan, link) {
  const critica = plan.desviaciones.filter((d) => ['Alta', 'Crítica'].includes(d.severidad)).length;
  return [
    '📦 *Reporte ejecutivo Friopacking*',
    `*Plan:* ${plan.nombre}`,
    `*Estado:* ${plan.estado}`,
    `*Avance:* ${plan.avance}%`,
    `*Desviaciones críticas:* ${critica}`,
    `*Próximo hito:* ${plan.proximoHito}`,
    `*Actualizado:* ${plan.fechaActualizacion}`,
    `*Reporte:* ${link}`,
  ].join('\n');
}

/** Normaliza teléfono a formato internacional sin símbolos (código país + número). */
export function normalizePhone(raw, defaultCountry = '51') {
  let d = String(raw || '').replace(/[^\d]/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);
  // Si parece número local peruano (9 dígitos) anteponer código país.
  if (d.length === 9 && defaultCountry) d = defaultCountry + d;
  return d;
}

/** URL oficial wa.me con mensaje codificado. */
export function waLink(message, phone = '') {
  const base = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Intenta Web Share API; devuelve true si se usó. */
export async function tryWebShare({ title, text, url }) {
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return true; }
    catch (e) { if (e && e.name === 'AbortError') return true; return false; }
  }
  return false;
}

/** Nivel 2: envío vía backend (WhatsApp Business Cloud API). */
export async function sendViaBackend(phone, message) {
  const res = await fetch('/api/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: phone, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
