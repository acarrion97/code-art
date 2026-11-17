// Burbujas de mensaje de un chat (sin la interfaz de ninguna aplicación): la recibida, blanca con el pico a la
// izquierda, y la enviada, verde con el pico a la derecha. El ancho sale del texto.
//   import { burbuja } from "#piezas/burbujas.js";
//   const ancho = burbuja(g, x, y, "¿Sigue disponible?", alto = 150, lado = -1, tam = 56, colores);
// lado -1: recibida; (x, y) es su esquina de arriba a la izquierda. lado 1: enviada; (x, y) es su esquina de arriba a
// la derecha. Para que entre, se encoja o gire: g.save(); g.translate(…); g.scale(…); burbuja(g, 0, 0, …); g.restore().
// colores: { recibida, tinta, enviada: [c0, c1], tintaEnviada }. Una lluvia de burbujas que llena la imagen y un chat
// que se apila: `01-hook.js` del proyecto 2026-11-10-black-friday-lotes-al-mando-para-corredo.
import * as k from "#kit";

const COL = { recibida: "#ffffff", tinta: "#0b2530", enviada: ["#25e0a3", "#0b9a6c"], tintaEnviada: "#ffffff" };
export function burbuja(g, x, y, txt, h = 150, lado = -1, tam = 56, colores = {}) {
  const C = { ...COL, ...colores };
  g.save(); g.font = `800 ${tam}px Figtree`; const w = g.measureText(txt).width + h * 0.7, x0 = lado < 0 ? x : x - w;
  g.shadowColor = "rgba(0,0,0,0.4)"; g.shadowBlur = 22; g.shadowOffsetY = 8;
  if (lado < 0) g.fillStyle = C.recibida; else { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, C.enviada[0]); gr.addColorStop(1, C.enviada[1]); g.fillStyle = gr; }
  k.redondo(g, x0, y, w, h, h * 0.36); g.fill(); g.shadowColor = "transparent";
  // el pico se rellena aparte: en el mismo trazo que el cuerpo sale hueco
  g.beginPath();
  if (lado < 0) { g.moveTo(x0 + 6, y + h - 60); g.lineTo(x0 - 24, y + h + 2); g.lineTo(x0 + 60, y + h - 4); } else { g.moveTo(x0 + w - 6, y + h - 60); g.lineTo(x0 + w + 24, y + h + 2); g.lineTo(x0 + w - 60, y + h - 4); }
  g.closePath(); g.fill();
  g.fillStyle = lado < 0 ? C.tinta : C.tintaEnviada; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(txt, x0 + h * 0.35, y + h / 2 + 3);
  g.restore(); return w;
}
