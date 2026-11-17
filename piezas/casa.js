// La casa de una lotización: su exterior (jardín, calle, vecinas: `exterior`) y su interior (la sala: `sala`), en 3D con
// la cámara del kit. Metros: 12 de ancho (x de -6 a 6) y 8 de fondo (z de 0 a 8); el frente mira a -z. La sala es de
// unos 7 × 6,5 m: con la cámara del kit (~43°), mayor se ve diminuta (`aprendido.md`).
//   import { exterior, sala } from "#piezas/casa.js";   // exterior(g, cam, ap, luz) · sala(g, cam, { noche })
import * as k from "#kit";
import { poligono } from "./lotizacion.js";

const { res, pto, mez, mezRgb, azar, suave: su, tramo: tr } = k;
const sh = (c, s) => c.split(",").map((v) => Math.round(+v * s)).join(",");
const traza = (g, P) => { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };

// Una cara plana con su color; solo se dibuja si mira a la cámara. n: su normal hacia fuera.
function cara(g, cam, pts, n, col, s = 1, tex = 0) {
  const c = [0, 1, 2].map((i) => pts.reduce((a, p) => a + p[i], 0) / pts.length);
  if (pto(res(c, cam.p), n) >= 0) return null;
  const P = poligono(cam, pts); if (P.length < 3) return null;
  traza(g, P); g.fillStyle = `rgb(${sh(col, s)})`; g.fill();
  if (tex > 0) { g.save(); traza(g, P); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = tex; g.drawImage(k.manchas, 0, 300, 1080, 1500); g.restore(); }
  return P;
}
// n líneas entre dos bordes de una cara (las tejas, las tablas): de a0-a1 a b0-b1.
function lineas(g, cam, a0, a1, b0, b1, n, col = "rgba(40,16,10,0.28)", ancho = 2) {
  g.save(); g.strokeStyle = col; g.lineWidth = ancho;
  for (let i = 1; i < n; i++) {
    const u = i / n, P = poligono(cam, [k.mezV(a0, b0, u), k.mezV(a1, b1, u), k.mezV(a1, b1, u + 0.0001), k.mezV(a0, b0, u + 0.0001)]);
    if (P.length < 2) continue; g.beginPath(); g.moveTo(P[0][0], P[0][1]); g.lineTo(P[1][0], P[1][1]); g.stroke();
  }
  g.restore();
}
// El aire de cine: luz cálida, viñeta y un poco de bruma.
function cine(g, fuerza = 1) {
  g.save(); g.globalCompositeOperation = "soft-light";
  const cal = g.createLinearGradient(0, 0, 1080, 1920); cal.addColorStop(0, `rgba(255,196,120,${0.5 * fuerza})`); cal.addColorStop(1, `rgba(40,80,110,${0.4 * fuerza})`); g.fillStyle = cal; g.fillRect(0, 0, 1080, 1920); g.restore();
  const vg = g.createRadialGradient(540, 960, 480, 540, 960, 1250); vg.addColorStop(0, "rgba(10,12,18,0)"); vg.addColorStop(1, `rgba(10,12,18,${0.45 * fuerza})`); g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}
// Una caja: sus caras visibles, con luz distinta en cada una.
function caja(g, cam, x, y, z, w, h, d, col, techo = null) {
  const X = x + w, Y = y + h, Z = z + d;
  cara(g, cam, [[x, y, z], [X, y, z], [X, Y, z], [x, Y, z]], [0, 0, -1], col, 0.82);
  cara(g, cam, [[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]], [0, 0, 1], col, 0.95);
  cara(g, cam, [[x, y, z], [x, y, Z], [x, Y, Z], [x, Y, z]], [-1, 0, 0], col, 0.68);
  cara(g, cam, [[X, y, z], [X, y, Z], [X, Y, Z], [X, Y, z]], [1, 0, 0], col, 0.9);
  cara(g, cam, [[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]], [0, 1, 0], techo || col, 1.12);
}
const dist = (cam, X) => { const d = res(X, cam.p); return pto(d, d); };
// Algo redondo (un árbol, una planta, una lámpara) como bola en pantalla.
function bola(g, cam, X, r, c0, c1, c2) {
  const p = k.proyecta(cam, X); if (!p) return;
  const R = k.tamano(r, p.z); if (R < 1 || p.x < -R || p.x > 1080 + R) return;
  const gr = g.createRadialGradient(p.x - R * 0.3, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
  gr.addColorStop(0, `rgb(${c0})`); gr.addColorStop(0.55, `rgb(${c1})`); gr.addColorStop(1, `rgb(${c2})`);
  g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, R, 0, 6.2832); g.fill();
}

// ---------------------------------------------------------------- el exterior
const ARBOLES = [[-13, 3, 3.1], [12.5, 2, 3.4], [-9, -9, 2.2], [10, -8, 2.5], [-24, 8, 3.6], [25, 10, 3.8], [-14, 18, 3.4], [15, 20, 3.2]];
const VECINAS = [{ x0: -52, z0: -4, w: 20, d: 16, casa: 0.2 }, { x0: 34, z0: -2, w: 20, d: 16, casa: 0.6 }, { x0: -55, z0: 24, w: 20, d: 16, casa: 0.8 }, { x0: 38, z0: 26, w: 20, d: 16, casa: 0.4 }];
// ap: cuánto está abierta la puerta (0 a 1); luz: cuánto brillan las ventanas.
export function exterior(g, cam, ap = 0, luz = 0.7) {
  const sk = g.createLinearGradient(0, 0, 0, 1920);
  sk.addColorStop(0, "#4d86d6"); sk.addColorStop(0.35, "#9cc4ee"); sk.addColorStop(0.55, "#ffe2bd"); sk.addColorStop(1, "#ffe9cf");
  g.fillStyle = sk; g.fillRect(0, 0, 1080, 1920);
  // el suelo: el jardín, el camino y la calle
  const S = 900, poly = (pts, c, y = 0) => { const P = poligono(cam, pts.map(([x, z]) => [x, y, z])); if (P.length > 2) { traza(g, P); g.fillStyle = c; g.fill(); } };
  poly([[-S, -S], [S, -S], [S, S], [-S, S]], "rgb(88,168,92)");
  g.save(); const gp = poligono(cam, [[-S, 0, -S], [S, 0, -S], [S, 0, S], [-S, 0, S]]); if (gp.length > 2) { traza(g, gp); g.clip(); g.globalAlpha = 0.28; g.globalCompositeOperation = "multiply"; g.drawImage(k.manchas, 0, 600, 1080, 1320); } g.restore();
  poly([[-S, -42], [S, -42], [S, -28], [-S, -28]], "rgb(62,68,78)");
  poly([[-S, -29.4], [S, -29.4], [S, -29.1], [-S, -29.1]], "rgb(255,236,170)");
  poly([[-1.5, -29], [1.5, -29], [1.5, 0], [-1.5, 0]], "rgb(214,208,196)");
  poly([[-7.5, -2], [7.5, -2], [7.5, -0.1], [-7.5, -0.1]], "rgb(200,194,182)");
  for (let z = -29; z < -2; z += 1.5) poly([[-1.5, z], [1.5, z], [1.5, z + 0.07], [-1.5, z + 0.07]], "rgba(120,114,104,0.45)", 0.01);
  poly([[-S, -32], [S, -32], [S, -31.6], [-S, -31.6]], "rgb(206,200,188)", 0.02);
  poly([[-6, 8], [-6, 8.2], [14, 11.4], [14, 8]], "rgba(18,40,24,0.35)", 0.02);
  // las casas vecinas y los árboles, de lejos a cerca
  const cosas = [];
  for (const v of VECINAS) cosas.push({ z: dist(cam, [v.x0 + 10, 0, v.z0 + 8]), f: () => vecina(g, cam, v) });
  for (const [x, z, r] of ARBOLES) cosas.push({ z: dist(cam, [x, 0, z]), f: () => { bola(g, cam, [x, r * 1.3, z], r, "150,225,120", "52,150,76", "16,86,52"); const p = k.proyecta(cam, [x, 0, z]), q = k.proyecta(cam, [x, r * 1.1, z]); if (p && q) { g.strokeStyle = "rgb(94,66,42)"; g.lineWidth = Math.max(2, k.tamano(0.25, p.z)); g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke(); } } });
  cosas.push({ z: dist(cam, [0, 0, 4]), f: () => casa(g, cam, ap, luz) });
  cosas.sort((a, b) => b.z - a.z);
  for (const c of cosas) c.f();
  // la luz de la tarde
  g.save(); g.globalCompositeOperation = "lighter";
  const sol = g.createRadialGradient(920, 160, 30, 920, 160, 1200); sol.addColorStop(0, "rgba(255,214,140,0.4)"); sol.addColorStop(1, "rgba(255,170,90,0)");
  g.fillStyle = sol; g.fillRect(0, 0, 1080, 1920); g.restore();
  cine(g, 1);
}
function vecina(g, cam, l) {
  const w = 12, d = 9, h = 4, x0 = l.x0 + 4, z0 = l.z0 + 3, col = l.casa < 0.5 ? "244,238,226" : "232,238,246", tej = l.casa < 0.5 ? "190,82,56" : "62,94,130";
  caja(g, cam, x0, 0, z0, w, h, d, col);
  cara(g, cam, [[x0 - 0.7, h, z0 - 0.7], [x0 + w + 0.7, h, z0 - 0.7], [x0 + w + 0.7, h + 1.8, z0 + d / 2], [x0 - 0.7, h + 1.8, z0 + d / 2]], [0, 0.6, -0.8], tej, 0.8);
  cara(g, cam, [[x0 - 0.7, h, z0 + d + 0.7], [x0 + w + 0.7, h, z0 + d + 0.7], [x0 + w + 0.7, h + 1.8, z0 + d / 2], [x0 - 0.7, h + 1.8, z0 + d / 2]], [0, 0.6, 0.8], tej, 1);
}
function casa(g, cam, ap, luz) {
  const pared = "250,244,232", W = 6, H = 3.2, D = 8;
  // el techo por detrás (a dos aguas) y los laterales
  cara(g, cam, [[-W - 0.8, H, D + 0.8], [W + 0.8, H, D + 0.8], [W + 0.8, H + 2.3, D / 2], [-W - 0.8, H + 2.3, D / 2]], [0, 0.7, 0.7], "170,70,46", 0.78);
  cara(g, cam, [[-W, 0, 0], [-W, 0, D], [-W, H, D], [-W, H, 0]], [-1, 0, 0], pared, 0.7, 0.25);
  cara(g, cam, [[W, 0, 0], [W, 0, D], [W, H, D], [W, H, 0]], [1, 0, 0], pared, 0.92, 0.25);
  cara(g, cam, [[-W, 0, D], [W, 0, D], [W, H, D], [-W, H, D]], [0, 0, 1], pared, 0.95, 0.25);
  // el frente
  const F = cara(g, cam, [[-W, 0, 0], [W, 0, 0], [W, H, 0], [-W, H, 0]], [0, 0, -1], pared, 1, 0.3);
  // el zócalo de piedra y la cornisa
  cara(g, cam, [[-W, 0, -0.04], [W, 0, -0.04], [W, 0.55, -0.04], [-W, 0.55, -0.04]], [0, 0, -1], "150,138,124", 1, 0.4);
  cara(g, cam, [[-W - 0.2, H - 0.25, -0.1], [W + 0.2, H - 0.25, -0.1], [W + 0.2, H, -0.1], [-W - 0.2, H, -0.1]], [0, 0, -1], "236,230,218", 0.95);
  // los hastiales
  cara(g, cam, [[-W, H, 0], [-W, H, D], [-W, H + 2.3, D / 2]], [-1, 0, 0], pared, 0.7);
  cara(g, cam, [[W, H, 0], [W, H, D], [W, H + 2.3, D / 2]], [1, 0, 0], pared, 0.92);
  // las ventanas (a la pared del frente): se encienden con luz cálida
  for (const x of [-4.4, 2.2]) {
    const q = [[x, 0.9, -0.02], [x + 2.2, 0.9, -0.02], [x + 2.2, 2.5, -0.02], [x, 2.5, -0.02]], P = poligono(cam, q);
    if (P.length > 2) {
      traza(g, P); g.fillStyle = `rgb(${mezRgb("120,170,210", "255,222,150", luz)})`; g.fill();
      g.save(); traza(g, P); g.clip();
      const bb = P.reduce((a, q) => [Math.min(a[0], q[0]), Math.min(a[1], q[1]), Math.max(a[2], q[0]), Math.max(a[3], q[1])], [1e9, 1e9, -1e9, -1e9]);
      const rf = g.createLinearGradient(bb[0], bb[1], bb[2], bb[3]); rf.addColorStop(0, "rgba(255,255,255,0.5)"); rf.addColorStop(0.45, "rgba(255,255,255,0)"); rf.addColorStop(1, "rgba(0,30,60,0.25)"); g.fillStyle = rf; g.fillRect(bb[0], bb[1], bb[2] - bb[0], bb[3] - bb[1]);
      g.restore(); g.strokeStyle = "rgb(250,250,246)"; g.lineWidth = 7; g.stroke();
      cara(g, cam, [[x - 0.55, 0.9, -0.05], [x - 0.05, 0.9, -0.05], [x - 0.05, 2.5, -0.05], [x - 0.55, 2.5, -0.05]], [0, 0, -1], "58,92,84", 1);
      cara(g, cam, [[x + 2.25, 0.9, -0.05], [x + 2.75, 0.9, -0.05], [x + 2.75, 2.5, -0.05], [x + 2.25, 2.5, -0.05]], [0, 0, -1], "58,92,84", 1);
      cara(g, cam, [[x - 0.1, 0.78, -0.12], [x + 2.3, 0.78, -0.12], [x + 2.3, 0.92, -0.12], [x - 0.1, 0.92, -0.12]], [0, 0, -1], "236,230,218", 0.9);
    }
    const m = poligono(cam, [[x + 1.07, 0.9, -0.03], [x + 1.13, 0.9, -0.03], [x + 1.13, 2.5, -0.03], [x + 1.07, 2.5, -0.03]]);
    if (m.length > 2) { traza(g, m); g.fillStyle = "#fff"; g.fill(); }
  }
  // el hueco de la puerta: dentro, luz cálida
  const hueco = poligono(cam, [[-1, 0, -0.03], [1, 0, -0.03], [1, 2.4, -0.03], [-1, 2.4, -0.03]]);
  if (hueco.length > 2) { traza(g, hueco); g.fillStyle = `rgb(${mezRgb("94,62,40", "255,236,190", ap)})`; g.fill(); }
  // la puerta, que gira hacia dentro
  const th = ap * 1.25, cx = Math.cos(th) * 2, sz = Math.sin(th) * 2;
  const pu = poligono(cam, [[-1, 0, -0.06], [-1 + cx, 0, -0.06 + sz], [-1 + cx, 2.4, -0.06 + sz], [-1, 2.4, -0.06]]);
  if (pu.length > 2) {
    traza(g, pu); g.fillStyle = "rgb(112,70,44)"; g.fill(); g.strokeStyle = "rgb(70,42,26)"; g.lineWidth = 5; g.stroke();
    for (const [a, b] of [[0.2, 1.1], [1.3, 2.2]]) for (const [u0, u1] of [[0.16, 0.46], [0.54, 0.84]]) { const q = poligono(cam, [[-1 + cx * u0, a, -0.07 + sz * u0], [-1 + cx * u1, a, -0.07 + sz * u1], [-1 + cx * u1, b, -0.07 + sz * u1], [-1 + cx * u0, b, -0.07 + sz * u0]]); if (q.length > 2) { traza(g, q); g.strokeStyle = "rgba(60,34,20,0.7)"; g.lineWidth = 3; g.stroke(); g.fillStyle = "rgba(255,255,255,0.06)"; g.fill(); } }
    const kb = k.proyecta(cam, [-1 + cx * 0.88, 1.1, -0.09 + sz * 0.88]); if (kb) { g.fillStyle = "rgb(236,200,120)"; g.beginPath(); g.arc(kb.x, kb.y, Math.max(2, k.tamano(0.07, kb.z)), 0, 6.2832); g.fill(); }
  }
  // el tejado del frente, con su borde
  cara(g, cam, [[-W - 0.8, H, -0.8], [W + 0.8, H, -0.8], [W + 0.8, H + 2.3, D / 2], [-W - 0.8, H + 2.3, D / 2]], [0, 0.7, -0.7], "206,92,60", 0.95, 0.3);
  lineas(g, cam, [-W - 0.8, H, -0.8], [W + 0.8, H, -0.8], [-W - 0.8, H + 2.3, D / 2], [W + 0.8, H + 2.3, D / 2], 14);
  // el porche: dos columnas, el techo y el escalón
  caja(g, cam, -1.9, 2.55, -1.7, 3.8, 0.22, 1.7, "236,230,218", "190,84,56");
  caja(g, cam, -1.7, 0, -1.55, 0.22, 2.55, 0.22, "246,242,232");
  caja(g, cam, 1.48, 0, -1.55, 0.22, 2.55, 0.22, "246,242,232");
  caja(g, cam, -1.9, 0, -1.7, 3.8, 0.14, 1.7, "198,192,180");
  const fa = k.proyecta(cam, [0, 2.2, -0.2]); if (fa) { const R = k.tamano(1.3, fa.z); g.save(); g.globalCompositeOperation = "lighter"; const lg = g.createRadialGradient(fa.x, fa.y, 2, fa.x, fa.y, R); lg.addColorStop(0, `rgba(255,224,150,${0.5 * (0.4 + luz)})`); lg.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = lg; g.beginPath(); g.arc(fa.x, fa.y, R, 0, 6.2832); g.fill(); g.restore(); }
  // arbustos en la fachada
  for (const x of [-5.4, -2.8, 2.8, 5.4]) bola(g, cam, [x, 0.55, -0.9], 0.7, "120,205,110", "46,140,70", "18,86,48");
}

// ---------------------------------------------------------------- el interior: la sala
// 7,2 de ancho (x de -3,6 a 3,6) y 6,5 de fondo (z de 0 a 6,5); la ventana grande, al fondo.
export function sala(g, cam, opc = {}) {
  const noche = opc.noche || 0, W = 3.6, H = 3, D = 6.5;
  const pared = noche ? "92,104,128" : "238,230,216", suelo = "176,128,88", techo = noche ? "70,78,100" : "248,246,240";
  g.fillStyle = "#14161c"; g.fillRect(0, 0, 1080, 1920);
  // el piso de tablones: tablas finas con sus juntas
  for (let i = 0; i < 24; i++) cara(g, cam, [[-W + i * 0.3, 0, 0], [-W + (i + 1) * 0.3, 0, 0], [-W + (i + 1) * 0.3, 0, D], [-W + i * 0.3, 0, D]], [0, 1, 0], suelo, 0.84 + 0.1 * ((i * 7) % 5) / 4, 0.18);
  for (let z = 0.8; z < D; z += 0.8) { const P = poligono(cam, [[-W, 0.005, z], [W, 0.005, z], [W, 0.005, z + 0.02], [-W, 0.005, z + 0.02]]); if (P.length > 2) { traza(g, P); g.fillStyle = "rgba(50,28,14,0.35)"; g.fill(); } }
  cara(g, cam, [[-W, H, 0], [W, H, 0], [W, H, D], [-W, H, D]], [0, -1, 0], techo, 1, 0.12);
  cara(g, cam, [[-W, 0, D], [W, 0, D], [W, H, D], [-W, H, D]], [0, 0, -1], pared, 1, 0.22);
  cara(g, cam, [[-W, 0, 0], [-W, 0, D], [-W, H, D], [-W, H, 0]], [1, 0, 0], pared, 0.8, 0.22);
  cara(g, cam, [[W, 0, 0], [W, 0, D], [W, H, D], [W, H, 0]], [-1, 0, 0], pared, 0.86, 0.22);
  // los zócalos y la moldura del techo
  const zo = "250,246,238";
  cara(g, cam, [[-W, 0, D - 0.01], [W, 0, D - 0.01], [W, 0.16, D - 0.01], [-W, 0.16, D - 0.01]], [0, 0, -1], zo, 1);
  cara(g, cam, [[-W + 0.01, 0, 0], [-W + 0.01, 0, D], [-W + 0.01, 0.16, D], [-W + 0.01, 0.16, 0]], [1, 0, 0], zo, 0.85);
  cara(g, cam, [[W - 0.01, 0, 0], [W - 0.01, 0, D], [W - 0.01, 0.16, D], [W - 0.01, 0.16, 0]], [-1, 0, 0], zo, 0.9);
  cara(g, cam, [[-W, H - 0.14, D - 0.01], [W, H - 0.14, D - 0.01], [W, H, D - 0.01], [-W, H, D - 0.01]], [0, 0, -1], zo, 1);
  // la ventana grande del fondo, con el cielo, el jardín y su marco
  const V = poligono(cam, [[-2, 0.8, D - 0.02], [2, 0.8, D - 0.02], [2, 2.6, D - 0.02], [-2, 2.6, D - 0.02]]);
  if (V.length > 2) {
    traza(g, V); g.fillStyle = noche ? "rgb(18,24,56)" : "rgb(150,206,248)"; g.fill();
    g.save(); traza(g, V); g.clip();
    if (noche) { const a = azar(5); for (let i = 0; i < 90; i++) { const x = -2 + a() * 4, y = 0.8 + a() * 1.0, P = poligono(cam, [[x, y, D - 0.03], [x + 0.1, y, D - 0.03], [x + 0.1, y + 0.16, D - 0.03], [x, y + 0.16, D - 0.03]]); if (P.length > 2) { traza(g, P); g.fillStyle = a() < 0.7 ? "rgb(255,214,130)" : "rgb(160,220,255)"; g.fill(); } } }
    else {
      const gp = poligono(cam, [[-2, 0.8, D - 0.03], [2, 0.8, D - 0.03], [2, 1.45, D - 0.03], [-2, 1.45, D - 0.03]]); if (gp.length > 2) { traza(g, gp); g.fillStyle = "rgb(110,170,96)"; g.fill(); }
      for (const [x, r, c] of [[-1.5, 0.75, "86,160,92"], [-0.2, 1.0, "70,146,84"], [1.3, 0.8, "98,170,98"], [1.9, 0.5, "76,152,88"]]) { const p = k.proyecta(cam, [x, 1.15, D - 0.03]); if (p) { const R = k.tamano(r, p.z); g.fillStyle = `rgb(${c})`; g.beginPath(); g.arc(p.x, p.y, R, 0, 6.2832); g.fill(); } }
      const sl = V.reduce((a, q) => [Math.min(a[0], q[0]), Math.min(a[1], q[1]), Math.max(a[2], q[0])], [1e9, 1e9, -1e9]); const gl = g.createLinearGradient(sl[0], sl[1], sl[2], sl[1] + 600); gl.addColorStop(0, "rgba(255,255,255,0.2)"); gl.addColorStop(0.5, "rgba(255,255,255,0)"); g.fillStyle = gl; g.fillRect(sl[0], sl[1], sl[2] - sl[0], 700);
    }
    g.restore();
    traza(g, V); g.strokeStyle = "#fff"; g.lineWidth = 11; g.stroke();
    for (const x of [-0.04, -1.0, 1.0]) { const m = poligono(cam, [[x - 0.03, 0.8, D - 0.04], [x + 0.03, 0.8, D - 0.04], [x + 0.03, 2.6, D - 0.04], [x - 0.03, 2.6, D - 0.04]]); if (m.length > 2) { traza(g, m); g.fillStyle = "#fff"; g.fill(); } }
    cara(g, cam, [[-2.15, 0.72, D - 0.1], [2.15, 0.72, D - 0.1], [2.15, 0.82, D - 0.1], [-2.15, 0.82, D - 0.1]], [0, 0, -1], "250,246,238", 1);
  }
  // las cortinas, con pliegues
  for (const x of [-3.0, 2.0]) {
    cara(g, cam, [[x, 0, D - 0.06], [x + 1, 0, D - 0.06], [x + 1, 2.8, D - 0.06], [x, 2.8, D - 0.06]], [0, 0, -1], noche ? "150,90,110" : "226,190,146", 1, 0.2);
    lineas(g, cam, [x, 0, D - 0.07], [x, 2.8, D - 0.07], [x + 1, 0, D - 0.07], [x + 1, 2.8, D - 0.07], 8, "rgba(90,60,30,0.22)", 3);
  }
  cara(g, cam, [[-3.2, 2.8, D - 0.12], [3.2, 2.8, D - 0.12], [3.2, 2.88, D - 0.12], [-3.2, 2.88, D - 0.12]], [0, 0, -1], "70,56,44", 1);
  // los cuadros de la pared izquierda, con marco
  for (const [z, w, h] of [[1.4, 0.9, 1.3], [3.0, 1.4, 0.9], [4.8, 0.8, 0.8]]) {
    cara(g, cam, [[-W + 0.02, 1.0 - 0.06, z - 0.06], [-W + 0.02, 1.0 - 0.06, z + w + 0.06], [-W + 0.02, 1.0 + h + 0.06, z + w + 0.06], [-W + 0.02, 1.0 + h + 0.06, z - 0.06]], [1, 0, 0], "250,246,238", 0.9);
    cara(g, cam, [[-W + 0.03, 1.0, z], [-W + 0.03, 1.0, z + w], [-W + 0.03, 1.0 + h, z + w], [-W + 0.03, 1.0 + h, z]], [1, 0, 0], z < 2 ? "16,178,126" : z < 4 ? "70,130,170" : "230,170,70", 0.9, 0.3);
  }
  // el tapete, con borde y rayas
  cara(g, cam, [[-2.4, 0.01, 2.1], [2.4, 0.01, 2.1], [2.4, 0.01, 5.7], [-2.4, 0.01, 5.7]], [0, 1, 0], noche ? "70,98,120" : "72,120,138", 1, 0.25);
  cara(g, cam, [[-2.15, 0.012, 2.35], [2.15, 0.012, 2.35], [2.15, 0.012, 5.45], [-2.15, 0.012, 5.45]], [0, 1, 0], noche ? "86,116,138" : "110,160,170", 1);
  for (const x of [-1.4, -0.7, 0, 0.7, 1.4]) { const P = poligono(cam, [[x - 0.05, 0.014, 2.35], [x + 0.05, 0.014, 2.35], [x + 0.05, 0.014, 5.45], [x - 0.05, 0.014, 5.45]]); if (P.length > 2) { traza(g, P); g.fillStyle = "rgba(255,255,255,0.18)"; g.fill(); } }
  // la luz de la ventana sobre el piso
  g.save(); g.globalCompositeOperation = "lighter";
  const lz = poligono(cam, [[-1.7, 0.02, D - 0.2], [1.7, 0.02, D - 0.2], [2.6, 0.02, 3.2], [-0.8, 0.02, 3.2]]); if (lz.length > 2) { traza(g, lz); g.fillStyle = noche ? "rgba(255,190,120,0.1)" : "rgba(255,244,210,0.2)"; g.fill(); }
  g.restore();
  const m = [
    { z: dist(cam, [0, 0.4, 6]), f: () => { // el sofá: base, respaldo, brazos, cojines y almohadas
      caja(g, cam, -1.9, 0, 5.6, 3.8, 0.5, 0.9, "56,92,112"); caja(g, cam, -1.9, 0.5, 6.15, 3.8, 0.8, 0.35, "56,92,112"); caja(g, cam, -2.2, 0, 5.6, 0.3, 0.9, 0.9, "46,78,96"); caja(g, cam, 1.9, 0, 5.6, 0.3, 0.9, 0.9, "46,78,96");
      caja(g, cam, -1.75, 0.5, 5.65, 1.7, 0.2, 0.55, "86,128,150"); caja(g, cam, 0.05, 0.5, 5.65, 1.7, 0.2, 0.55, "86,128,150");
      caja(g, cam, -1.6, 0.7, 6.0, 0.55, 0.5, 0.18, "230,160,60"); caja(g, cam, 1.0, 0.7, 6.0, 0.55, 0.5, 0.18, "16,178,126"); caja(g, cam, 0.35, 0.7, 6.0, 0.55, 0.5, 0.18, "240,236,226"); } },
    { z: dist(cam, [0, 0.2, 4]), f: () => { // la mesa de centro con un libro, un florero y una taza
      caja(g, cam, -0.9, 0, 3.5, 1.8, 0.42, 1.0, "150,106,70", "176,130,90"); caja(g, cam, -0.3, 0.42, 3.8, 0.45, 0.26, 0.35, "255,255,255", "16,178,126");
      caja(g, cam, 0.35, 0.42, 3.65, 0.5, 0.05, 0.38, "40,66,96"); caja(g, cam, -0.75, 0.42, 3.9, 0.1, 0.2, 0.1, "210,190,160"); bola(g, cam, [-0.7, 0.72, 3.95], 0.17, "130,225,120", "46,150,76", "14,90,50"); } },
    { z: dist(cam, [3, 0.8, 5.6]), f: () => { caja(g, cam, 2.7, 0, 5.3, 0.6, 0.5, 0.6, "202,196,186"); bola(g, cam, [3.0, 1.1, 5.6], 0.6, "120,215,110", "36,140,66", "12,80,44"); bola(g, cam, [2.85, 1.55, 5.55], 0.4, "130,225,120", "46,150,76", "14,90,50"); } },
    { z: dist(cam, [-3.0, 1.6, 5.6]), f: () => { caja(g, cam, -3.05, 0, 5.55, 0.1, 1.5, 0.1, "60,60,64"); bola(g, cam, [-3.0, 1.75, 5.6], 0.36, "255,250,210", "255,226,150", noche ? "255,190,100" : "232,196,130"); } },
    { z: dist(cam, [3.2, 0.5, 2]), f: () => { // el mueble de la tele, en la pared derecha
      caja(g, cam, 3.0, 0, 1.0, 0.55, 0.55, 2.2, "104,72,48", "126,90,60"); caja(g, cam, 3.3, 0.55, 1.35, 0.08, 0.95, 1.5, "16,18,24"); } },
    { z: dist(cam, [0, 2.9, 4.4]), f: () => { // la lámpara del techo
      caja(g, cam, -0.02, 2.4, 4.4, 0.04, 0.6, 0.04, "60,60,64"); bola(g, cam, [0, 2.3, 4.42], 0.3, "255,250,220", "255,228,160", "236,190,110"); } },
  ].sort((a, b) => b.z - a.z);
  for (const o of m) o.f();
  g.save(); g.globalCompositeOperation = "lighter";
  const p = k.proyecta(cam, [0, 1.7, D]); if (p) { const R = k.tamano(4, p.z), lg = g.createRadialGradient(p.x, p.y, 20, p.x, p.y, R); lg.addColorStop(0, noche ? "rgba(255,196,120,0.16)" : "rgba(255,246,220,0.12)"); lg.addColorStop(1, "rgba(255,230,180,0)"); g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920); }
  const lp = k.proyecta(cam, [0, 2.3, 4.42]); if (lp) { const R = k.tamano(1.3, lp.z); const lg2 = g.createRadialGradient(lp.x, lp.y, 4, lp.x, lp.y, R); lg2.addColorStop(0, "rgba(255,226,160,0.22)"); lg2.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = lg2; g.fillRect(0, 0, 1080, 1920); }
  g.restore();
  cine(g, 1);
}
