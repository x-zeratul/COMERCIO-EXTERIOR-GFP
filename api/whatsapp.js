/**
 * Serverless Function (Vercel) — Nivel 2: WhatsApp Business Cloud API.
 *
 * Envía un mensaje de texto usando la Graph API de Meta. Los secretos se leen
 * de variables de entorno (NUNCA se exponen al frontend). Si no hay
 * credenciales configuradas, responde 501 y el frontend continúa funcionando
 * con la opción wa.me (Nivel 1).
 *
 * Sin dependencias externas: usa `fetch` nativo de Node 18+ (runtime Vercel).
 *
 * Variables de entorno requeridas (ver .env.example):
 *   WHATSAPP_TOKEN            Token permanente de la app de WhatsApp
 *   WHATSAPP_PHONE_NUMBER_ID  ID del número emisor
 *   WHATSAPP_API_VERSION      (opcional) por defecto v20.0
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION || 'v20.0';

  if (!token || !phoneId) {
    return res.status(501).json({
      error: 'WhatsApp Business API no configurada. Usa la opción wa.me (Nivel 1).',
      configured: false,
    });
  }

  // Body puede llegar como objeto (Vercel) o string.
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { to, message } = body || {};

  const phone = String(to || '').replace(/[^\d]/g, '');
  if (!phone || phone.length < 8) return res.status(400).json({ error: 'Número de destino inválido.' });
  if (!message || !String(message).trim()) return res.status(400).json({ error: 'Mensaje vacío.' });

  try {
    const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: 'text',
        text: { preview_url: true, body: String(message) },
      }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return res.status(resp.status).json({ error: data?.error?.message || 'Error al enviar', details: data });
    }
    return res.status(200).json({ ok: true, id: data?.messages?.[0]?.id || null });
  } catch (err) {
    return res.status(500).json({ error: 'Fallo de conexión con la API de WhatsApp', detail: String(err) });
  }
}
