/**
 * Acciones ejecutivas compartidas: Infografía, Reporte y WhatsApp.
 * Cada una abre un diálogo funcional. Sin dependencias externas.
 */
import { esc, toast } from './dom.js';
import { icon } from './icons.js';
import { openDialog } from './ui.js';
import { can } from './store.js';
import { buildInfographic, INFOGRAPHIC_SIZE } from './infographic.js';
import { buildReport } from './report.js';
import { svgToPng, downloadDataUrl, downloadSvg, printHtml } from './export.js';
import { buildMessage, normalizePhone, waLink, tryWebShare, sendViaBackend } from './whatsapp.js';

const slug = (s) => String(s).toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
const planLink = (plan) => `${location.origin}${location.pathname}#/plan/${plan.id}`;

/* ------------------------------- INFOGRAFÍA ------------------------------- */
export function openInfographic(plan) {
  let format = 'vertical';
  const body = `
    <div class="ig-toolbar">
      <div class="chips" role="tablist" aria-label="Formato de infografía">
        <button class="chip active" data-fmt="vertical">${icon('image', 14)} Vertical · WhatsApp</button>
        <button class="chip" data-fmt="horizontal">${icon('image', 14)} Horizontal · Presentación</button>
      </div>
    </div>
    <div class="ig-frame" data-ig-frame>${buildInfographic(plan, format)}</div>
    <p class="muted" style="margin-top:10px;font-size:.78rem">Resume únicamente <b>${esc(plan.nombre)}</b>. Alta resolución (${INFOGRAPHIC_SIZE.vertical.width}×${INFOGRAPHIC_SIZE.vertical.height}) apta para móvil y presentaciones.</p>`;
  const footer = `
    <button class="btn" data-act="svg">${icon('download', 15)} SVG</button>
    <button class="btn" data-act="print">${icon('print', 15)} Imprimir / PDF</button>
    <button class="btn" data-act="share">${icon('share', 15)} Compartir</button>
    <button class="btn btn--primary" data-act="png">${icon('image', 15)} Descargar PNG</button>`;
  const dlg = openDialog({ title: `Infografía · ${plan.nombre}`, body, footer, wide: true });
  const root = dlg.el;
  const frame = () => root.querySelector('[data-ig-frame]');
  const currentSvg = () => frame().querySelector('svg');

  root.querySelectorAll('[data-fmt]').forEach((btn) => btn.addEventListener('click', () => {
    root.querySelectorAll('[data-fmt]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    format = btn.dataset.fmt;
    frame().innerHTML = buildInfographic(plan, format);
  }));

  const getPng = async () => {
    const size = INFOGRAPHIC_SIZE[format];
    return svgToPng(currentSvg(), { width: size.width, height: size.height, scale: format === 'vertical' ? 1.4 : 1.2 });
  };

  root.querySelector('[data-act="png"]').addEventListener('click', async () => {
    try { toast('Generando PNG…'); const url = await getPng();
      downloadDataUrl(url, `infografia-${slug(plan.nombreCorto)}-${format}.png`); toast('PNG descargado', 'ok'); }
    catch (e) { toast('No se pudo generar el PNG', 'danger'); }
  });
  root.querySelector('[data-act="svg"]').addEventListener('click', () => {
    downloadSvg(buildInfographic(plan, format), `infografia-${slug(plan.nombreCorto)}-${format}.svg`); toast('SVG descargado', 'ok');
  });
  root.querySelector('[data-act="print"]').addEventListener('click', () => {
    const size = INFOGRAPHIC_SIZE[format];
    printHtml(`<div style="text-align:center">${buildInfographic(plan, format)}</div>`,
      `Infografía ${plan.nombre}`,
      `@page{size:${format === 'vertical' ? 'portrait' : 'landscape'};margin:0} body{margin:0} svg{width:100%;height:auto}`);
  });
  root.querySelector('[data-act="share"]').addEventListener('click', async () => {
    try {
      const url = await getPng();
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `infografia-${slug(plan.nombreCorto)}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: plan.nombre, text: `Infografía ${plan.nombre} — Friopacking` });
        toast('Compartido', 'ok');
      } else {
        const shared = await tryWebShare({ title: plan.nombre, text: `Infografía ${plan.nombre} — Friopacking`, url: planLink(plan) });
        if (!shared) { downloadDataUrl(url, `infografia-${slug(plan.nombreCorto)}.png`); toast('Descargado (compartir no disponible)', 'ok'); }
      }
    } catch (e) { toast('No se pudo compartir', 'danger'); }
  });
}

/* -------------------------------- REPORTE -------------------------------- */
export function openReport(plan, allPlans) {
  if (!can('reportar')) { toast('Tu rol no permite generar reportes', 'danger'); return; }
  const body = `
    <p class="muted" style="margin-bottom:14px">Selecciona el tipo de reporte a generar. Se abrirá el diálogo de impresión del navegador; elige <b>“Guardar como PDF”</b>.</p>
    <div class="grid" style="gap:10px">
      <button class="btn btn--block" data-rep="completo" style="justify-content:flex-start">${icon('file', 16)} Reporte ejecutivo completo · ${esc(plan.nombreCorto)}</button>
      <button class="btn btn--block" data-rep="breve" style="justify-content:flex-start">${icon('file', 16)} Reporte breve (1 página) · ${esc(plan.nombreCorto)}</button>
      <button class="btn btn--block" data-rep="consolidado" style="justify-content:flex-start">${icon('layers', 16)} Reporte consolidado (3 planes)</button>
    </div>`;
  const dlg = openDialog({ title: `Generar reporte · ${plan.nombre}`, body });
  dlg.el.querySelectorAll('[data-rep]').forEach((btn) => btn.addEventListener('click', () => {
    const tipo = btn.dataset.rep;
    const { html, styles } = tipo === 'consolidado' ? buildReport(allPlans, 'consolidado') : buildReport(plan, tipo);
    printHtml(html, `Reporte ${plan.nombre}`, styles);
    toast('Abriendo reporte para PDF…', 'ok');
    dlg.close();
  }));
}

/* -------------------------------- WHATSAPP ------------------------------- */
export function openWhatsApp(plan) {
  if (!can('compartir')) { toast('Tu rol no permite compartir por WhatsApp', 'danger'); return; }
  const link = planLink(plan);
  const defaultMsg = buildMessage(plan, link);
  const body = `
    <div class="field">
      <label for="wa-country">Código de país</label>
      <select id="wa-country">
        <option value="51">🇵🇪 Perú (+51)</option>
        <option value="52">🇲🇽 México (+52)</option>
        <option value="54">🇦🇷 Argentina (+54)</option>
        <option value="56">🇨🇱 Chile (+56)</option>
        <option value="57">🇨🇴 Colombia (+57)</option>
        <option value="34">🇪🇸 España (+34)</option>
        <option value="1">🇺🇸 EE. UU. (+1)</option>
      </select>
    </div>
    <div class="field">
      <label for="wa-phone">Número (opcional)</label>
      <input id="wa-phone" type="tel" inputmode="numeric" placeholder="Ej. 987654321" autocomplete="tel"/>
      <span class="hint">Si lo dejas vacío, WhatsApp te permitirá elegir el contacto.</span>
      <span class="err" data-err hidden>Número inválido.</span>
    </div>
    <div class="field">
      <label for="wa-msg">Mensaje</label>
      <textarea id="wa-msg" rows="9">${esc(defaultMsg)}</textarea>
    </div>
    <p class="muted" style="font-size:.76rem">Nivel 1 (activo): Web Share / enlace oficial wa.me. Nivel 2 (opcional): envío por WhatsApp Business Cloud API vía backend seguro <code>/api/whatsapp</code>.</p>`;
  const footer = `
    <button class="btn" data-wa="backend">${icon('inbox', 15)} Enviar por API</button>
    <button class="btn" data-wa="share">${icon('share', 15)} Compartir</button>
    <button class="btn btn--wa" data-wa="link">${icon('whatsapp', 16)} Abrir WhatsApp</button>`;
  const dlg = openDialog({ title: `Enviar por WhatsApp · ${plan.nombre}`, body, footer });
  const root = dlg.el;
  const getMsg = () => root.querySelector('#wa-msg').value;
  const getPhone = () => {
    const raw = root.querySelector('#wa-phone').value.trim();
    if (!raw) return '';
    return normalizePhone(raw, root.querySelector('#wa-country').value);
  };
  const validate = () => {
    const raw = root.querySelector('#wa-phone').value.trim();
    const err = root.querySelector('[data-err]');
    if (raw && !/^\d{6,15}$/.test(raw.replace(/\D/g, ''))) { err.hidden = false; return false; }
    err.hidden = true; return true;
  };

  root.querySelector('[data-wa="link"]').addEventListener('click', () => {
    if (!validate()) return;
    window.open(waLink(getMsg(), getPhone()), '_blank', 'noopener');
    toast('Abriendo WhatsApp…', 'ok');
  });
  root.querySelector('[data-wa="share"]').addEventListener('click', async () => {
    const shared = await tryWebShare({ title: `Reporte ${plan.nombre}`, text: getMsg(), url: link });
    if (shared) toast('Compartido', 'ok');
    else { window.open(waLink(getMsg(), getPhone()), '_blank', 'noopener'); toast('Compartir nativo no disponible; abriendo wa.me', ''); }
  });
  root.querySelector('[data-wa="backend"]').addEventListener('click', async (e) => {
    if (!validate()) return;
    const phone = getPhone();
    if (!phone) { toast('Ingresa un número para el envío por API', 'danger'); return; }
    const btn = e.currentTarget; btn.disabled = true;
    try {
      await sendViaBackend(phone, getMsg());
      toast('Mensaje enviado por WhatsApp Business API', 'ok'); dlg.close();
    } catch (err) {
      toast('API no configurada — usa “Abrir WhatsApp” (wa.me)', 'danger');
    } finally { btn.disabled = false; }
  });
}
