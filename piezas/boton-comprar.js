// El botón «COMPRAR» (pieza compartida; para el CTA de un video de venta): rojo, con su canto, el carrito y la palabra.
// Centro en (x, y), 780 × 210. hunde: de 0 a 1 al apretarlo. brilla: su halo, de 0 a 1. Para cambiar la palabra, texto.
//   import { boton } from "#piezas/boton-comprar.js";   boton(g, 540, 1040, ap, brilla);
import * as k from "#kit";

export function boton(g, x, y, hunde, brilla, texto = "COMPRAR") {
  const W = 780, H = 210;
  g.save(); g.translate(x, y + 14 * hunde);
  if (brilla > 0) k.brillo(g, 0, 0, 1500, "255,80,60", 0.55 * brilla);
  // la base (el canto) y la cara
  k.redondo(g, -W / 2, -H / 2 + 26 * (1 - hunde), W, H, H / 2); g.fillStyle = "#8f140d"; g.fill();
  k.redondo(g, -W / 2, -H / 2, W, H, H / 2);
  const bg = g.createLinearGradient(0, -H / 2, 0, H / 2); bg.addColorStop(0, "#ff6a5c"); bg.addColorStop(0.5, "#ff3b30"); bg.addColorStop(1, "#d42a20");
  g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)"; k.redondo(g, -W / 2 + 40, -H / 2 + 16, W - 80, 50, 25); g.fill();
  // el carrito y la palabra
  g.save(); g.translate(-292, 4); g.strokeStyle = "#fff"; g.fillStyle = "#fff"; g.lineWidth = 9; g.lineJoin = "round"; g.lineCap = "round";
  g.beginPath(); g.moveTo(-48, -40); g.lineTo(-32, -40); g.lineTo(-16, 22); g.lineTo(40, 22); g.lineTo(52, -22); g.lineTo(-26, -22); g.stroke();
  g.beginPath(); g.arc(-8, 42, 9, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(34, 42, 9, 0, Math.PI * 2); g.fill();
  g.restore();
  g.fillStyle = "#fff"; g.font = "900 96px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(120,10,5,0.6)"; g.shadowBlur = 10; g.shadowOffsetY = 5;
  g.fillText(texto, 72, 8);
  g.restore();
}
