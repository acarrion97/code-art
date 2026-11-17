// El acabado de cine, para encima de cualquier toma ya dibujada (una vista de dron, una casa, un tablero):
//   import { cine, bloom, profundidad, destello, rayos, polvo, rollo, grade, vineta, granoFilm } from "#piezas/cine.js";
//   cine(g, t, { color: 0..1 (0 = frío y apagado, 1 = cálido y vivo), sol: [x, y] })   // todo junto, al final de dibuja
// O por partes: `bloom` (el resplandor de lo brillante), `profundidad` (desenfoque arriba y abajo, como una lente
// de verdad), `destello` (reflejo anamórfico de lente), `rayos` (luz volumétrica), `polvo` (partículas con bokeh),
// `rollo` (la cámara se inclina un poco: llámalo antes de dibujar y al final `g.restore()`), `grade` (la corrección
// de color) y `grano` (el grano de película).
import * as k from "#kit";

const { mez, azar } = k;
let pequeno = null, borroso = null, grano = null;
const lienzoBajo = (w, h) => { const c = k.lienzo(w, h); return c; };

// Una copia pequeña de lo ya dibujado, para desenfocarla al volver a pintarla grande (barato y suave).
function copia(g, fac) {
  const w = Math.round(1080 / fac), h = Math.round(1920 / fac);
  if (!pequeno || pequeno.width !== w) { pequeno = lienzoBajo(w, h); borroso = lienzoBajo(w, h); }
  const c = pequeno.getContext("2d"); c.globalCompositeOperation = "copy"; c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high"; c.drawImage(g.canvas, 0, 0, w, h); c.globalCompositeOperation = "source-over";
  return pequeno;
}

// El resplandor: lo más brillante se difumina y se suma a la imagen.
export function bloom(g, fuerza = 0.35, fac = 10) {
  const c = copia(g, fac), b = borroso.getContext("2d");
  b.globalCompositeOperation = "copy"; b.drawImage(c, 0, 0); b.globalCompositeOperation = "source-over";
  // lo brillante: se resta lo oscuro (multiplicando la copia por sí misma)
  b.globalCompositeOperation = "multiply"; b.drawImage(c, 0, 0); b.drawImage(c, 0, 0); b.globalCompositeOperation = "source-over";
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = fuerza; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high"; g.drawImage(borroso, 0, 0, 1080, 1920); g.restore();
}

// La profundidad de campo: se enfoca la banda del medio y arriba y abajo quedan desenfocadas (efecto lente / miniatura).
export function profundidad(g, enfoque = [0.3, 0.7], fuerza = 1, fac = 4) {
  const c = copia(g, fac), w = c.width, h = c.height;
  const m = lienzoBajo(w, h), mc = m.getContext("2d");
  mc.drawImage(c, 0, 0);
  // la máscara: opaco arriba y abajo, transparente en la banda enfocada
  mc.globalCompositeOperation = "destination-in";
  const gr = mc.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(enfoque[0], "rgba(0,0,0,0)"); gr.addColorStop(enfoque[1], "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,1)");
  mc.fillStyle = gr; mc.fillRect(0, 0, w, h);
  g.save(); g.globalAlpha = fuerza; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high"; g.drawImage(m, 0, 0, 1080, 1920); g.restore();
}

// La corrección de color: u = 0 frío y apagado (sombras azules, poco color), u = 1 cálido y vivo (luz dorada, sombras verdes).
export function grade(g, u = 1) {
  g.save();
  g.globalCompositeOperation = "soft-light";
  const a = g.createLinearGradient(0, 0, 1080, 1920);
  a.addColorStop(0, `rgba(${Math.round(mez(120, 255, u))},${Math.round(mez(170, 190, u))},${Math.round(mez(255, 110, u))},0.55)`);
  a.addColorStop(1, `rgba(${Math.round(mez(20, 20, u))},${Math.round(mez(60, 90, u))},${Math.round(mez(110, 100, u))},0.5)`);
  g.fillStyle = a; g.fillRect(0, 0, 1080, 1920);
  if (u < 1) { // menos color cuanto más frío
    g.globalCompositeOperation = "saturation"; g.globalAlpha = (1 - u) * 0.6; g.fillStyle = "rgb(128,128,128)"; g.fillRect(0, 0, 1080, 1920);
    g.globalCompositeOperation = "multiply"; g.globalAlpha = (1 - u) * 0.18; g.fillStyle = "rgb(190,205,235)"; g.fillRect(0, 0, 1080, 1920);
  }
  g.restore();
  // el contraste: las sombras se hunden y las luces se encienden un poco
  g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = 0.2;
  const c = g.createLinearGradient(0, 0, 0, 1920); c.addColorStop(0, "rgb(190,190,200)"); c.addColorStop(0.5, "rgb(128,128,128)"); c.addColorStop(1, "rgb(70,70,86)");
  g.fillStyle = c; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// La viñeta y el grano.
export function vineta(g, fuerza = 0.5) {
  const vg = g.createRadialGradient(540, 960, 460, 540, 960, 1300); vg.addColorStop(0, "rgba(6,10,16,0)"); vg.addColorStop(1, `rgba(6,10,16,${fuerza})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}
export function granoFilm(g, t, fuerza = 0.09) {
  grano ??= k.ruido(1024, 99, 700, 1, "crudo");
  const d = Math.floor(t * 24) % 7; // cambia 24 veces por segundo
  g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = fuerza; g.drawImage(grano, -(d * 37) % 120, -(d * 61) % 200, 1200, 2100); g.restore();
}

// El reflejo anamórfico de la lente: una raya horizontal y unos reflejos que se alejan del sol hacia el centro.
export function destello(g, x, y, fuerza = 1, color = "255,214,150") {
  if (fuerza <= 0) return;
  g.save(); g.globalCompositeOperation = "lighter";
  const raya = g.createLinearGradient(x - 900, y, x + 900, y); raya.addColorStop(0, `rgba(${color},0)`); raya.addColorStop(0.5, `rgba(${color},${0.5 * fuerza})`); raya.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = raya; g.fillRect(x - 900, y - 4, 1800, 8);
  const nucleo = g.createRadialGradient(x, y, 0, x, y, 260); nucleo.addColorStop(0, `rgba(255,248,230,${0.85 * fuerza})`); nucleo.addColorStop(0.25, `rgba(${color},${0.35 * fuerza})`); nucleo.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = nucleo; g.beginPath(); g.arc(x, y, 260, 0, 6.2832); g.fill();
  const dx = 540 - x, dy = 960 - y;
  [[0.45, 70, "120,200,255", 0.16], [0.8, 110, "255,160,110", 0.12], [1.15, 50, "170,255,200", 0.15], [1.5, 150, "255,200,120", 0.08]].forEach(([p, r, c, a]) => {
    const px = x + dx * p, py = y + dy * p, gr = g.createRadialGradient(px, py, 0, px, py, r); gr.addColorStop(0, `rgba(${c},0)`); gr.addColorStop(0.7, `rgba(${c},${a * fuerza})`); gr.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, 6.2832); g.fill();
  });
  g.restore();
}

// La luz volumétrica: rayos que salen del sol y se abren.
export function rayos(g, x, y, t, fuerza = 1, n = 9, color = "255,226,170") {
  if (fuerza <= 0) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < n; i++) {
    const ang = 1.0 + i * (1.2 / n) + 0.05 * Math.sin(t * 0.4 + i), ancho = 0.05 + 0.03 * ((i * 5) % 3), L = 2600;
    const gr = g.createLinearGradient(x, y, x + Math.cos(ang) * L, y + Math.sin(ang) * L); gr.addColorStop(0, `rgba(${color},${0.22 * fuerza * (0.6 + 0.4 * Math.sin(t * 0.8 + i * 2))})`); gr.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(ang - ancho) * L, y + Math.sin(ang - ancho) * L); g.lineTo(x + Math.cos(ang + ancho) * L, y + Math.sin(ang + ancho) * L); g.closePath(); g.fill();
  }
  g.restore();
}

// Polvo y partículas que flotan, con su desenfoque (bokeh): círculos suaves que suben despacio.
export function polvo(g, t, n = 26, color = "255,236,200", semilla = 7) {
  const a = azar(semilla);
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < n; i++) {
    const x0 = a() * 1080, y0 = a() * 1920, r = 6 + a() * 26, v = 14 + a() * 30, fase = a() * 6, al = 0.05 + a() * 0.13;
    const y = ((y0 - v * t) % 1990 + 1990) % 1990 - 35, x = x0 + 24 * Math.sin(t * 0.5 + fase);
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${color},${al * 1.6})`); gr.addColorStop(0.8, `rgba(${color},${al})`); gr.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  }
  g.restore();
}

// El balanceo de la cámara de dron: una leve inclinación y un zoom para que no se vean las esquinas. Llama a g.restore() al acabar.
export function rollo(g, ang) {
  g.save(); g.translate(540, 960); g.rotate(ang); const s = 1 + Math.abs(ang) * 2.2; g.scale(s, s); g.translate(-540, -960);
}

// Todo junto, al final de `dibuja`: color, resplandor, profundidad, destello, grano y viñeta.
export function cine(g, t, o = {}) {
  const u = o.color ?? 1, sol = o.sol;
  grade(g, u);
  if (o.profundidad !== false) profundidad(g, o.enfoque || [0.32, 0.72], 0.9);
  bloom(g, 0.3 + 0.15 * u);
  if (sol) { rayos(g, sol[0], sol[1], t, 0.5 * u); destello(g, sol[0], sol[1], 0.7 * u); }
  if (o.polvo !== false) polvo(g, t, 22, u > 0.5 ? "255,236,200" : "200,220,255");
  vineta(g, 0.34 + 0.1 * (1 - u));
  granoFilm(g, t, 0.07 + 0.05 * (1 - u));
}
