// El título de una portada (pieza compartida; para enseñar portadas dentro de un video): dos líneas arriba, sobre un velo oscuro;
// la primera blanca y la segunda (la clave) más grande, en el rojo de la marca. En un lienzo de 1080 × 1920.
//   import { titulo } from "#piezas/titulo-portada.js";   titulo(c, "¿Por qué los mapas", "TE MIENTEN?");
const ROJO = "#ff3b30";
// el título: dos líneas, la segunda (la clave) en rojo y más grande, sobre un velo oscuro arriba
export function titulo(c, l1, l2) {
  const vg = c.createLinearGradient(0, 0, 0, 900);
  vg.addColorStop(0, "rgba(0,0,0,0.78)"); vg.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = vg; c.fillRect(0, 0, 1080, 900);
  c.textAlign = "center"; c.textBaseline = "middle"; c.shadowColor = "rgba(0,0,0,0.7)"; c.shadowBlur = 20; c.shadowOffsetY = 6;
  c.font = "800 92px Figtree";
  const w1 = c.measureText(l1).width, e1 = Math.min(1, 980 / w1);
  c.save(); c.translate(540, 330); c.scale(e1, e1); c.fillStyle = "#fff"; c.fillText(l1, 0, 0); c.restore();
  c.font = "900 118px Figtree";
  const w = c.measureText(l2).width, esc = Math.min(1, 1000 / w);
  c.save(); c.translate(540, 470); c.scale(esc, esc); c.fillStyle = "#7a0d08"; c.fillText(l2, 6, 8); c.fillStyle = ROJO; c.fillText(l2, 0, 0); c.restore();
  c.shadowColor = "rgba(0,0,0,0)";
}
