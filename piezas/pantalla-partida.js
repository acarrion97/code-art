// La pantalla partida de los videos «sin vs. con»: izquierda, el mundo SIN el producto (frío); derecha, el mundo CON él (cálido).
//   import { lado, divisor, dueño } from "#piezas/pantalla-partida.js";
//   lado(g, false, (h) => izquierda(h, t)); lado(g, true, (h) => derecha(h, t)); divisor(g, t);   // cada mitad, en un lienzo de 540 × 1920
//   dueño(g, cx, y, color, cansado, rim): la silueta de un dueño visto de espaldas (cansado 0..1: encorvado y a un lado).
import * as k from "#kit";

// ---- la pantalla partida: izquierda, el dueño SIN Lotes al Mando (frío); derecha, el dueño CON Lotes al Mando (cálido).
// Cada mitad se dibuja en su propio lienzo de 540 × 1920 (x de 0 a 540) y se recorta a su lado.
export function lado(g, der, fn) {
  g.save(); g.translate(der ? 540 : 0, 0); g.beginPath(); g.rect(0, 0, 540, 1920); g.clip(); fn(g); g.restore();
}
export function divisor(g, t, brillo = 1) {
  g.save(); g.globalCompositeOperation = "lighter";
  const gr = g.createLinearGradient(520, 0, 560, 0); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, `rgba(255,236,190,${0.55 * brillo})`); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(500, 0, 80, 1920); g.restore();
  g.fillStyle = `rgba(255,255,255,${0.55 * brillo})`; g.fillRect(538, 0, 4, 1920);
}
// El dueño visto de espaldas, ante su pantalla: cabeza y hombros. cansado: de 0 a 1 (encorvado, a un lado).
export function dueño(g, cx, y, col, cansado = 0, rim = null) {
  g.save(); g.translate(cx, y); g.rotate(0.06 * cansado);
  g.fillStyle = col; k.redondo(g, -190, 70 + 20 * cansado, 380, 260, 110); g.fill();
  g.beginPath(); g.arc(0, -10 + 36 * cansado, 78, 0, 6.2832); g.fill();
  if (rim) { g.strokeStyle = rim; g.lineWidth = 6; g.beginPath(); g.arc(0, -10 + 36 * cansado, 78, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); k.redondo(g, -190, 70 + 20 * cansado, 380, 260, 110); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.06)"; g.beginPath(); g.arc(-26, -36 + 36 * cansado, 40, 0, 6.2832); g.fill();
  g.restore();
}
