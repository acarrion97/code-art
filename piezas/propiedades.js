// Tarjetas de propiedades y el panel de una herramienta donde se ordenan, para videos de portafolio inmobiliario
// (corredores, proyectos, inventario): la tarjeta de un lote, una casa o un edificio de departamentos, con su estado;
// el panel oscuro con cabecera; y los marcos de «vitrina» que agrupan tarjetas.
//   import { propiedad, panel, vitrinas, TW, TH } from "#piezas/propiedades.js";
//   propiedad(g, { tipo: 0 lote | 1 casa | 2 departamentos, nombre: "Lote 12" }, estado, luz)
//     centrada en 0,0 (TW × TH = 240 × 310): g.save(); g.translate(x, y); g.scale(s, s); propiedad(…); g.restore().
//     estado: 0 libre, 1 reservado, 2 vendido, null sin pastilla. luz 0..1: resplandor (para destacar un grupo).
//   panel(g, a, luz, cabecera)   el panel (de x 36 a 1044 y de y 520 a 1475; su cabecera, hasta y 616). a 0..1: cuánto
//     ha entrado. cabecera(g): lo que va en la cabecera (el logo).
//   vitrinas(g, marcos, u, brillo, capa)   marcos: [[x, y, ancho, alto, "NOMBRE"], …]. u 0..1: cuánto han entrado.
//     brillo 0..1: una franja de luz cruza el cristal. capa "marco" va detrás de las tarjetas; "nombre", encima.
// Con cinco tarjetas por fila (a escala 0,6, cada 190 px) se leen; con seis ya se ven diminutas. Cómo se mueven 18
// tarjetas entre colocaciones (regadas, en montones, en cuadrícula, por estado): el proyecto
// 2026-11-10-corredores-todos-tus-proyectos-en-una-so (`video/mundo.js` y sus planos).
import * as k from "#kit";

const EST = [["LIBRE", "#12c48b"], ["RESERVADO", "#d9a441"], ["VENDIDO", "#7c8a9a"]];
export const TW = 240, TH = 310;
export function propiedad(g, p, estado = null, luz = 0) {
  g.save();
  g.shadowColor = luz > 0 ? `rgba(120,255,200,${0.8 * luz})` : "rgba(0,0,0,0.45)"; g.shadowBlur = 26 + 40 * luz; g.shadowOffsetY = 10;
  k.redondo(g, -TW / 2, -TH / 2, TW, TH, 28); g.fillStyle = "#f6f1e6"; g.fill(); g.shadowColor = "transparent";
  // la imagen
  g.save(); k.redondo(g, -TW / 2 + 12, -TH / 2 + 12, TW - 24, 176, 20); g.clip();
  const x0 = -TW / 2 + 12, y0 = -TH / 2 + 12, w = TW - 24, h = 176;
  if (p.tipo === 0) {
    const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, "#39d99b"); gr.addColorStop(1, "#128a62"); g.fillStyle = gr; g.fillRect(x0, y0, w, h);
    g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 5; g.beginPath(); g.moveTo(x0 + 34, y0 + 138); g.lineTo(x0 + 62, y0 + 44); g.lineTo(x0 + w - 40, y0 + 36); g.lineTo(x0 + w - 24, y0 + 132); g.closePath(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.22)"; g.fill();
    g.fillStyle = "#0c5c43"; g.beginPath(); g.arc(x0 + 58, y0 + 118, 15, 0, 6.2832); g.fill();
  } else {
    const sk = g.createLinearGradient(0, y0, 0, y0 + h); sk.addColorStop(0, "#7fc4ee"); sk.addColorStop(1, "#d9effa"); g.fillStyle = sk; g.fillRect(x0, y0, w, h);
    g.fillStyle = "#4fbf7a"; g.fillRect(x0, y0 + h - 34, w, 34);
    if (p.tipo === 1) {
      g.fillStyle = "#fbf3e2"; g.fillRect(x0 + 52, y0 + 78, 112, 68);
      g.fillStyle = "#c9553c"; g.beginPath(); g.moveTo(x0 + 38, y0 + 82); g.lineTo(x0 + 108, y0 + 30); g.lineTo(x0 + 178, y0 + 82); g.closePath(); g.fill();
      g.fillStyle = "#7a4a2b"; g.fillRect(x0 + 96, y0 + 104, 24, 42); g.fillStyle = "#6fb6e0"; g.fillRect(x0 + 62, y0 + 96, 24, 22); g.fillRect(x0 + 130, y0 + 96, 24, 22);
    } else {
      g.fillStyle = "#e9eef4"; g.fillRect(x0 + 66, y0 + 22, 84, 124); g.fillStyle = "#c5ced9"; g.fillRect(x0 + 150, y0 + 52, 34, 94);
      g.fillStyle = "#5aa7d8"; for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) g.fillRect(x0 + 76 + c * 24, y0 + 32 + r * 22, 14, 12);
    }
  }
  g.restore();
  g.fillStyle = "#0b2530"; g.font = "800 34px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(p.nombre, 0, 62);
  if (estado !== null) { const [tx, col] = EST[estado]; k.redondo(g, -92, 90, 184, 46, 23); g.fillStyle = col; g.fill(); g.fillStyle = "#fff"; g.font = "30px Anton"; g.fillText(tx, 0, 115); }
  g.restore();
}

// ---- El panel de la herramienta
export function panel(g, a = 1, luz = 0, cabecera = null) {
  if (a <= 0) return;
  g.save(); g.globalAlpha *= Math.min(1, a * 1.5); g.translate(540, 1020); g.scale(0.9 + 0.1 * a, 0.9 + 0.1 * a); g.translate(-540, -1020);
  g.shadowColor = luz > 0 ? `rgba(90,255,190,${0.8 * luz})` : "rgba(0,0,0,0.5)"; g.shadowBlur = 50 + 50 * luz; g.shadowOffsetY = luz > 0 ? 0 : 20;
  k.redondo(g, 36, 520, 1008, 955, 46); const bg = g.createLinearGradient(0, 520, 0, 1475); bg.addColorStop(0, "#0e4e66"); bg.addColorStop(1, "#06212d"); g.fillStyle = bg; g.fill(); g.shadowColor = "transparent";
  g.lineWidth = 4; g.strokeStyle = `rgba(217,176,100,${0.6 + 0.4 * luz})`; g.stroke();
  g.save(); k.redondo(g, 36, 520, 1008, 955, 46); g.clip(); g.fillStyle = "rgba(4,22,30,0.75)"; g.fillRect(36, 520, 1008, 96); g.restore();
  if (cabecera) cabecera(g); // p. ej. el logo: (g) => logo(g, 62, 531, 300)
  g.restore();
}
// capa: "marco" (detrás de las tarjetas) o "nombre" (encima)
export function vitrinas(g, marcos, u, brillo = 0, capa = "marco") {
  if (u <= 0) return;
  marcos.forEach(([x, y, w, h, nom], i) => {
    const a = k.entra(k.tramo(u, i * 0.2, 0.6 + i * 0.2)); if (a <= 0) return;
    g.save(); g.globalAlpha *= a;
    if (capa === "nombre") { g.font = "32px Anton"; const tw = g.measureText(nom).width + 40; g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 12; g.shadowOffsetY = 4; k.redondo(g, x + w - tw - 14, y - 22, tw, 46, 23); g.fillStyle = "#12c48b"; g.fill(); g.shadowColor = "transparent"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(nom, x + w - tw / 2 - 14, y + 2); g.restore(); return; }
    k.redondo(g, x, y, w, h, 26); g.fillStyle = "rgba(255,255,255,0.06)"; g.fill(); g.lineWidth = 3; g.strokeStyle = "rgba(120,255,200,0.55)"; g.stroke();
    // el brillo del cristal
    if (brillo > 0 && brillo < 1) { g.save(); k.redondo(g, x, y, w, h, 26); g.clip(); g.globalCompositeOperation = "lighter"; const bx = x - 300 + (w + 600) * brillo; const gr = g.createLinearGradient(bx, 0, bx + 260, 0); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, `rgba(220,255,240,${0.45 * Math.sin(brillo * Math.PI)})`); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(bx, y, 260, h); g.restore(); }
    g.restore();
  });
}
