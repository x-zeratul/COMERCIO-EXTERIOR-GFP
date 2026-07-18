/**
 * Exportación sin dependencias externas.
 *  - svgToPng: rasteriza un <svg> a PNG de alta resolución vía canvas.
 *  - downloadDataUrl / downloadText: descargas de archivos.
 *  - printElement: imprime un nodo en ventana aislada (PDF vía "Guardar como PDF").
 * Todo se ejecuta en el navegador del usuario, offline.
 */

/** Serializa un elemento SVG a string con dimensiones explícitas. */
function serializeSvg(svgEl, width, height) {
  const clone = svgEl.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', width);
  clone.setAttribute('height', height);
  return new XMLSerializer().serializeToString(clone);
}

/** Rasteriza un SVG (elemento o string) a PNG dataURL. scale para alta resolución. */
export function svgToPng(svg, { width, height, scale = 2, background = '#ffffff' } = {}) {
  return new Promise((resolve, reject) => {
    let str, w = width, h = height;
    if (typeof svg === 'string') {
      str = svg;
      if (!w || !h) {
        const vb = /viewBox=["']([\d.\s]+)["']/.exec(svg);
        if (vb) { const p = vb[1].trim().split(/\s+/).map(Number); w = w || p[2]; h = h || p[3]; }
      }
    } else {
      w = w || svg.viewBox.baseVal.width || svg.clientWidth;
      h = h || svg.viewBox.baseVal.height || svg.clientHeight;
      str = serializeSvg(svg, w, h);
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      if (background) { ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      try { resolve(canvas.toDataURL('image/png')); }
      catch (e) { reject(e); }
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(new Error('No se pudo rasterizar el SVG')); };
    img.src = url;
  });
}

/** Descarga un dataURL como archivo. */
export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
}

/** Descarga texto/HTML como archivo. */
export function downloadText(text, filename, type = 'text/plain') {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Descarga un SVG (string) como archivo .svg. */
export function downloadSvg(svgString, filename) {
  downloadText(svgString, filename, 'image/svg+xml');
}

/**
 * Imprime HTML en una ventana aislada con estilos de reporte.
 * El usuario elige "Guardar como PDF" en el diálogo de impresión.
 */
export function printHtml(innerHtml, title = 'Reporte Friopacking', styles = '') {
  const win = window.open('', '_blank', 'width=900,height=1200');
  if (!win) { alert('Habilita las ventanas emergentes para generar el PDF.'); return; }
  win.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8">
    <title>${title}</title><style>${styles}</style></head><body>${innerHtml}</body></html>`);
  win.document.close();
  win.focus();
  // Espera al render antes de imprimir.
  setTimeout(() => { win.print(); }, 400);
}
