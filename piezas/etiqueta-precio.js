// La etiqueta de precio gigante de una oferta, que se parte en dos: la mitad de arriba (dos líneas: la ocasión y lo que
// se ofrece), la mitad de abajo «de antes» (el precio normal, que se tacha) y la mitad de abajo nueva (la oferta, en
// verde). Mide EW × EH (800 × 560), centrada en 0,0, y se parte en y = CORTE: se dibuja dentro de un
// g.save(); g.translate(cx, cy); g.rotate(ang); g.scale(s, s); … g.restore().
//   import { etiquetaArriba, etiquetaNormal, etiquetaOferta, CORTE, EW, EH } from "#piezas/etiqueta-precio.js";
//   etiquetaNormal(g, tacha 0..1, "PRECIO NORMAL");   // antes del tajo (después, trasladada y girada: se cae)
//   etiquetaOferta(g, late 0..1, "-50%");             // la mitad nueva, que sube y encaja
//   etiquetaArriba(g, "BLACK FRIDAY", "PRIMER MES");  // siempre la última, encima
// Colores de Lotes al Mando por defecto; `colores` los cambia: { arriba: [c0, c1], abajo: [c0, c1], oferta: [c0, c1],
// borde, tinta, ocasion }. Cómo se anima (caída, tajo de luz, encaje): `01-hook.js` del proyecto
// 2026-11-10-black-friday-lotes-al-mando-50-de-descue.
const COL = { arriba: ["#0d4a61", "#061f2b"], abajo: ["#0a3a4d", "#051a24"], oferta: ["#21e3a6", "#0b9a6c"], borde: "#d9b064", bordeOferta: "#eafff6", tinta: "#f3ead6", ocasion: "#d9b064", tacha: "#ff4b3e" };
export const CORTE = 20, EW = 800, EH = 560;

function espaciado(g, txt, x, y, sep) {
  const ws = [...txt].map((c) => g.measureText(c).width), total = ws.reduce((a, b) => a + b, 0) + sep * (txt.length - 1);
  let cx = x - total / 2; const al = g.textAlign; g.textAlign = "left";
  [...txt].forEach((c, i) => { g.fillText(c, cx, y); cx += ws[i] + sep; });
  g.textAlign = al;
}
// que el texto quepa: baja el tamaño hasta que mida `ancho` como mucho
function letra(g, txt, tam, ancho) { g.font = `${tam}px Anton`; const w = g.measureText(txt).width; if (w > ancho) g.font = `${Math.floor(tam * ancho / w)}px Anton`; }
function forma(g, y0, y1) {
  const w = EW / 2, h = EH / 2, c = 90, r = 34;
  g.beginPath();
  if (y0 <= -h) { g.moveTo(-w + c, -h); g.lineTo(w - c, -h); g.lineTo(w, -h + c); } else { g.moveTo(-w, y0); g.lineTo(w, y0); }
  if (y1 >= h) { g.lineTo(w, h - r); g.quadraticCurveTo(w, h, w - r, h); g.lineTo(-w + r, h); g.quadraticCurveTo(-w, h, -w, h - r); } else { g.lineTo(w, y1); g.lineTo(-w, y1); }
  if (y0 <= -h) g.lineTo(-w, -h + c); else g.lineTo(-w, y0);
  g.closePath();
}
function cuerpo(g, y0, y1, [c0, c1], borde) {
  g.save();
  g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 60; g.shadowOffsetY = 26;
  forma(g, y0, y1); const gr = g.createLinearGradient(-EW / 2, y0, EW / 2, y1); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fill();
  g.shadowColor = "transparent";
  g.save(); forma(g, y0, y1); g.clip(); g.globalCompositeOperation = "lighter";
  const lz = g.createRadialGradient(-260, y0 - 40, 10, -260, y0 - 40, 620); lz.addColorStop(0, "rgba(255,255,255,0.22)"); lz.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = lz; g.fillRect(-EW, -EH, 2 * EW, 2 * EH);
  g.restore();
  forma(g, y0, y1); g.lineWidth = 9; g.strokeStyle = borde; g.stroke();
  g.restore();
}
// La mitad de arriba: la ocasión (pequeña, espaciada) y lo que se ofrece (grande).
export function etiquetaArriba(g, ocasion = "BLACK FRIDAY", titulo = "PRIMER MES", colores = {}) {
  const C = { ...COL, ...colores };
  cuerpo(g, -EH / 2, CORTE, C.arriba, C.borde);
  g.beginPath(); g.arc(0, -232, 24, 0, 6.2832); g.fillStyle = "#020a0f"; g.fill(); g.lineWidth = 8; g.strokeStyle = C.borde; g.stroke();
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = C.ocasion; g.font = "58px Anton"; espaciado(g, ocasion, 0, -160, 10);
  g.fillStyle = C.tinta; letra(g, titulo, 140, 700); g.fillText(titulo, 0, -64);
}
// La mitad de abajo de antes: el precio normal, que se tacha (tacha 0..1).
export function etiquetaNormal(g, tacha = 0, texto = "PRECIO NORMAL", colores = {}) {
  const C = { ...COL, ...colores };
  cuerpo(g, CORTE, EH / 2, C.abajo, C.borde);
  g.save(); g.textAlign = "center"; g.textBaseline = "middle"; g.globalAlpha *= 0.82; g.fillStyle = C.tinta; letra(g, texto, 112, 700); g.fillText(texto, 0, 154); g.restore();
  if (tacha > 0) { g.save(); g.lineCap = "round"; g.lineWidth = 16; g.strokeStyle = C.tacha; g.shadowColor = "rgba(255,75,62,0.7)"; g.shadowBlur = 18; g.beginPath(); g.moveTo(-330, 176); g.lineTo(-330 + 660 * tacha, 176 - 44 * tacha); g.stroke(); g.restore(); }
}
// La mitad de abajo nueva: la oferta (late 0..1 la hace latir).
export function etiquetaOferta(g, late = 0, texto = "-50%", colores = {}) {
  const C = { ...COL, ...colores };
  cuerpo(g, CORTE, EH / 2, C.oferta, C.bordeOferta);
  g.save(); g.translate(0, 156); const s = 1 + 0.06 * late; g.scale(s, s);
  g.textAlign = "center"; g.textBaseline = "middle"; letra(g, texto, 232, 700);
  g.shadowColor = "rgba(3,40,30,0.45)"; g.shadowBlur = 0; g.shadowOffsetY = 8; g.fillStyle = "#ffffff"; g.fillText(texto, 0, 0);
  g.restore();
}
