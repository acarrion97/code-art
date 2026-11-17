// La lotización como se ve en una foto de satélite o de dron: tierra y pasto de verdad, calles de asfalto, casas con
// tejado y su sombra larga, árboles con copa irregular, un bosque alrededor y el aire de cine (luz cálida, viñeta, bruma
// y grano). Misma geometría que `lotizacion.js` (los mismos `LOTES`), así que sirve igual con cualquier cámara del kit.
//   import { satelite } from "#piezas/satelite.js";
//   satelite(g, cam, t, { estado(lote, t) → 0 libre … 1 vendido, marca: true (libres en verde brillante, vendidos apagados), marcaAlfa: 0..1 (cuánto se ve), pulso: 0..1 (brillo de los libres),
//                         resalta: { id, u }, cine: false (sin el acabado de cine) })
import * as k from "#kit";
import { LOTES, poligono } from "./lotizacion.js";

const { azar, tramo, mezRgb, res, pto, F } = k;
const PX = 58, PZ = 84, BLOQUES_Z = 14;
const SOMBRA = [0.75, 0.42]; // hacia dónde cae la sombra (por metro de altura)
const BRUMA = "214,205,190";

const niebla = (z, ini = 110, fin = 520) => Math.pow(tramo(z, ini, fin), 1.15) * 0.85;
function traza(g, P) { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); }
const rgb = (c) => `rgb(${c})`;

// ---- lo que no cambia: árboles, manchas de tierra y el bosque, una sola vez
let datos = null, grano = null;
function hacer() {
  const a = azar(5150), arboles = [], parches = [];
  // árboles por las aceras de las calles y algunos por las parcelas
  for (let i = -2; i <= 3; i++) for (let z = -30; z < BLOQUES_Z * PZ; z += 9 + a() * 5) {
    for (const lado of [-1, 1]) if (a() < 0.78) arboles.push({ x: i * PX - PX / 2 + lado * (7.4 + a() * 1.2), z: z + a() * 4, r: 1.4 + a() * 1.5, h: 3 + a() * 2.2, v: a() });
  }
  for (const l of LOTES) { const n = a() < 0.5 ? 1 + Math.floor(a() * 2) : 0; for (let j = 0; j < n; j++) arboles.push({ x: l.x0 + 2 + a() * (l.w - 4), z: l.z0 + 2 + a() * (l.d - 4), r: 1.5 + a() * 1.6, h: 3 + a() * 2.4, v: a() }); }
  // el bosque y los potreros alrededor
  for (let n = 0; n < 1500; n++) {
    const lado = a() < 0.5 ? -1 : 1, x = lado * (150 + a() * a() * 330), z = -60 + a() * (BLOQUES_Z * PZ + 160);
    arboles.push({ x, z, r: 2.2 + a() * 2.6, h: 4 + a() * 4, v: a() });
  }
  // manchas de pasto y de tierra desnuda en el campo
  for (let n = 0; n < 220; n++) parches.push({ x: (a() - 0.5) * 900, z: -80 + a() * (BLOQUES_Z * PZ + 200), r: 14 + a() * 46, v: a() });
  return { arboles, parches };
}

function suelo(g, cam, zi, zf) {
  const S = 3000, P = poligono(cam, [[-S, 0, -S], [S, 0, -S], [S, 0, S * 2], [-S, 0, S * 2]]);
  traza(g, P); g.fillStyle = "rgb(138,126,92)"; g.fill();
  g.save(); traza(g, P); g.clip();
  for (const p of datos.parches) {
    if (p.z + p.r < zi || p.z - p.r > zf) continue;
    const Q = poligono(cam, [[p.x - p.r, 0.01, p.z - p.r * 0.7], [p.x + p.r, 0.01, p.z - p.r * 0.7], [p.x + p.r * 1.1, 0.01, p.z + p.r * 0.7], [p.x - p.r * 1.1, 0.01, p.z + p.r * 0.7]]);
    if (Q.length < 3) continue;
    const zc = Math.min(...Q.map((q) => q[2])); if (zc > 700) continue;
    g.globalAlpha = 0.5 * (1 - niebla(zc)); traza(g, Q); g.fillStyle = p.v < 0.55 ? "rgb(104,118,64)" : "rgb(170,132,96)"; g.fill();
  }
  g.restore();
}

export function satelite(g, cam, t, opc = {}) {
  datos ??= hacer();
  const estado = opc.estado || ((l) => (l.vend ? 1 : 0));
  const zi = cam.p[2] - 60, zf = cam.p[2] + 560;
  // el cielo (solo se ve con la cámara baja) y el suelo
  const sk = g.createLinearGradient(0, 0, 0, 1920); sk.addColorStop(0, "#5d7fae"); sk.addColorStop(0.35, "#b5bfc9"); sk.addColorStop(0.5, "#f0d4b0"); sk.addColorStop(1, `rgb(${BRUMA})`);
  g.fillStyle = sk; g.fillRect(0, 0, 1080, 1920);
  suelo(g, cam, zi, zf);
  // las calles: asfalto con borde claro
  const calle = (pts, ancho) => { const P = poligono(cam, pts); if (P.length < 3) return; const zc = Math.min(...P.map((p) => p[2])); traza(g, P); g.fillStyle = `rgb(${mezRgb("78,80,84", BRUMA, niebla(zc))})`; g.fill(); };
  for (let i = -2; i <= 3; i++) { const xc = i * PX - PX / 2; calle([[xc - 6.8, 0.02, zi], [xc + 6.8, 0.02, zi], [xc + 6.8, 0.02, zf], [xc - 6.8, 0.02, zf]]); }
  for (let bz = Math.floor(zi / PZ) - 1; bz < zf / PZ + 1; bz++) { const zc = bz * PZ + 52; calle([[-3 * PX, 0.02, zc - 7.5], [3 * PX, 0.02, zc - 7.5], [3 * PX, 0.02, zc + 7.5], [-3 * PX, 0.02, zc + 7.5]]); }
  // las aceras y la raya del centro
  for (let i = -2; i <= 3; i++) {
    const xc = i * PX - PX / 2;
    for (const lado of [-1, 1]) {
      const P = poligono(cam, [[xc + lado * 6.8 - 0.4, 0.03, zi], [xc + lado * 6.8 + 0.4, 0.03, zi], [xc + lado * 6.8 + 0.4, 0.03, zf], [xc + lado * 6.8 - 0.4, 0.03, zf]]);
      if (P.length >= 3) { const zc = Math.min(...P.map((p) => p[2])); traza(g, P); g.fillStyle = `rgba(222,214,196,${0.8 * (1 - niebla(zc))})`; g.fill(); }
    }
    for (let z = Math.floor(zi / 14) * 14; z < zf; z += 14) {
      const P = poligono(cam, [[xc - 0.25, 0.04, z], [xc + 0.25, 0.04, z], [xc + 0.25, 0.04, z + 6], [xc - 0.25, 0.04, z + 6]]);
      if (P.length < 3 || P[0][2] > 330) continue; traza(g, P); g.fillStyle = `rgba(240,226,160,${0.8 * (1 - niebla(P[0][2], 60, 330))})`; g.fill();
    }
  }
  // las parcelas
  const cosas = [];
  for (const l of LOTES) {
    if (l.z0 + l.d < zi || l.z0 > zf) continue;
    const P = poligono(cam, [[l.x0, 0.05, l.z0], [l.x0 + l.w, 0.05, l.z0], [l.x0 + l.w, 0.05, l.z0 + l.d], [l.x0, 0.05, l.z0 + l.d]]);
    if (P.length < 3) continue;
    const zc = Math.min(...P.map((p) => p[2])); if (zc > 620) continue;
    const e = estado(l, t), f = niebla(zc);
    const libre = l.tono < 0.5 ? mezRgb("186,148,106", "150,134,84", l.tono * 2) : mezRgb("150,134,84", "112,132,70", (l.tono - 0.5) * 2);
    const vend = mezRgb("96,116,66", "120,118,76", l.tono);
    const col = e <= 0 ? libre : e >= 1 ? vend : mezRgb(libre, vend, e);
    traza(g, P); g.fillStyle = rgb(mezRgb(col, BRUMA, f)); g.fill();
    g.strokeStyle = `rgba(232,222,196,${0.55 * (1 - f)})`; g.lineWidth = Math.max(0.5, 1.6 - zc / 200); g.stroke();
    if (opc.marca && (opc.marcaAlfa ?? 1) > 0) {
      // los lotes llamativos: libres en verde esmeralda brillante con borde blanco; vendidos, apagados en pizarra
      const q = mezRgb("0,236,150", "70,82,100", e), al = (0.58 - 0.12 * e) * (1 - f) * (opc.marcaAlfa ?? 1);
      g.save(); traza(g, P); g.fillStyle = `rgba(${q},${al})`; g.fill();
      g.strokeStyle = e < 0.5 ? `rgba(255,255,255,${0.95 * (1 - f)})` : `rgba(150,165,182,${0.7 * (1 - f)})`; g.lineWidth = Math.max(1.4, 3.6 - zc / 130); g.stroke();
      if (e < 0.5 && opc.pulso > 0) { g.globalCompositeOperation = "lighter"; traza(g, P); g.fillStyle = `rgba(120,255,200,${0.3 * opc.pulso * (1 - f)})`; g.fill(); }
      g.restore();
    }
    if (opc.resalta && opc.resalta.id === l.id) { const u = opc.resalta.u; g.save(); g.globalCompositeOperation = "lighter"; traza(g, P); g.fillStyle = `rgba(255,255,255,${0.5 * u})`; g.fill(); g.lineWidth = 5; g.strokeStyle = `rgba(196,154,79,${u})`; g.stroke(); g.restore(); }
    if (e > 0.5 && zc < 380) cosas.push({ z: zc, casa: l, e });
  }
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.2; g.drawImage(k.manchas, 0, 0, 1080, 1920); g.restore();
  for (const a of datos.arboles) {
    if (a.z < zi || a.z > zf) continue;
    const p = k.proyecta(cam, [a.x, a.h, a.z]);
    if (!p || p.z > 560 || p.x < -200 || p.x > 1280) continue;
    cosas.push({ z: p.z, arbol: a, p });
  }
  // todas las sombras primero, luego lo que las proyecta, de lejos a cerca
  for (const c of cosas) { if (c.casa) sombraCasa(g, cam, c.casa, c.e); else sombraArbol(g, cam, c.arbol); }
  cosas.sort((a, b) => b.z - a.z);
  for (const c of cosas) { if (c.arbol) arbol(g, cam, c.arbol, c.p); else casa(g, cam, c.casa, c.e); }
  if (opc.cine !== false) cine(g, cam);
}

// ---- las casas
const medidas = (l, e) => { const w = l.w * 0.56, d = l.d * 0.52, h = 3.6 * Math.min(1, e + 0.2); return { w, d, h, x0: l.x0 + (l.w - w) / 2 + (l.casa - 0.5) * 2, z0: l.z0 + (l.d - d) / 2 }; };
function sombraCasa(g, cam, l, e) {
  const { w, d, h, x0, z0 } = medidas(l, e), sx = SOMBRA[0] * (h + 1.6), sz = SOMBRA[1] * (h + 1.6);
  const P = poligono(cam, [[x0, 0.06, z0], [x0 + w, 0.06, z0], [x0 + w + sx, 0.06, z0 + sz], [x0 + w + sx, 0.06, z0 + d + sz], [x0 + sx, 0.06, z0 + d + sz], [x0, 0.06, z0 + d]]);
  if (P.length < 3) return; traza(g, P); g.fillStyle = `rgba(24,22,18,${0.42 * (1 - niebla(Math.min(...P.map((p) => p[2]))))})`; g.fill();
}
function casa(g, cam, l, e) {
  const { w, d, h, x0, z0 } = medidas(l, e), P = (x, y, z) => [x0 + x, y, z0 + z];
  const tipo = l.casa, pared = tipo < 0.4 ? "222,216,202" : tipo < 0.75 ? "232,206,168" : "206,212,216";
  const tejado = tipo < 0.3 ? "168,88,62" : tipo < 0.6 ? "132,138,146" : tipo < 0.85 ? "150,84,60" : "88,104,124";
  const pc = k.proyecta(cam, [x0 + w / 2, 0, z0 + d / 2]), f = pc ? niebla(pc.z) : 0;
  const caras = [
    { n: [0, 0, -1], q: [P(0, 0, 0), P(w, 0, 0), P(w, h, 0), P(0, h, 0)], s: 0.8 },
    { n: [0, 0, 1], q: [P(0, 0, d), P(w, 0, d), P(w, h, d), P(0, h, d)], s: 1 },
    { n: [-1, 0, 0], q: [P(0, 0, 0), P(0, 0, d), P(0, h, d), P(0, h, 0)], s: 0.7 },
    { n: [1, 0, 0], q: [P(w, 0, 0), P(w, 0, d), P(w, h, d), P(w, h, 0)], s: 0.92 },
  ];
  for (const c of caras) {
    const m = [x0 + w / 2 + c.n[0] * w / 2, h / 2, z0 + d / 2 + c.n[2] * d / 2];
    if (pto(res(m, cam.p), c.n) >= 0) continue;
    const Q = poligono(cam, c.q); if (Q.length < 3) continue;
    traza(g, Q); g.fillStyle = rgb(mezRgb(pared.split(",").map((v) => Math.round(+v * c.s)).join(","), BRUMA, f)); g.fill();
  }
  // el tejado a dos aguas: la vertiente al sol, clara; la otra, en sombra
  const R1 = poligono(cam, [P(-0.7, h, -0.7), P(w + 0.7, h, -0.7), P(w + 0.7, h + 1.5, d / 2), P(-0.7, h + 1.5, d / 2)]);
  const R2 = poligono(cam, [P(-0.7, h, d + 0.7), P(w + 0.7, h, d + 0.7), P(w + 0.7, h + 1.5, d / 2), P(-0.7, h + 1.5, d / 2)]);
  for (const [Q, s] of [[R1, 0.72], [R2, 1.04]]) { if (Q.length < 3) continue; traza(g, Q); g.fillStyle = rgb(mezRgb(tejado.split(",").map((v) => Math.min(255, Math.round(+v * s))).join(","), BRUMA, f)); g.fill(); g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 1; g.stroke(); }
}

// ---- los árboles
function sombraArbol(g, cam, a) {
  const sx = SOMBRA[0] * a.h, sz = SOMBRA[1] * a.h, p = k.proyecta(cam, [a.x + sx * 0.6, 0, a.z + sz * 0.6]);
  if (!p || p.z > 560) return; const r = k.tamano(a.r * 1.15, p.z); if (r < 0.7) return;
  g.fillStyle = `rgba(20,24,16,${0.4 * (1 - niebla(p.z))})`; g.beginPath(); g.ellipse(p.x, p.y, r * 1.1, r * 0.5 + r * 0.25 * Math.min(1, Math.abs(cam.p[1]) / 200), 0, 0, 6.2832); g.fill();
}
function arbol(g, cam, a, p) {
  const r = k.tamano(a.r, p.z), f = niebla(p.z); if (r < 0.7) return;
  const base = a.v < 0.35 ? "46,86,44" : a.v < 0.7 ? "58,100,48" : "78,108,52";
  const gr = g.createRadialGradient(p.x - r * 0.3, p.y - r * 0.35, r * 0.1, p.x, p.y, r);
  gr.addColorStop(0, rgb(mezRgb("120,160,84", BRUMA, f))); gr.addColorStop(0.6, rgb(mezRgb(base, BRUMA, f))); gr.addColorStop(1, rgb(mezRgb("22,48,30", BRUMA, f)));
  g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.fill();
  if (r > 5) { // copa irregular: unos bultos más
    for (let j = 0; j < 4; j++) { const an = a.v * 20 + j * 1.7, rr = r * 0.5; g.fillStyle = rgb(mezRgb(j % 2 ? "70,112,56" : "38,74,40", BRUMA, f)); g.globalAlpha = 0.7; g.beginPath(); g.arc(p.x + Math.cos(an) * r * 0.5, p.y + Math.sin(an) * r * 0.5, rr, 0, 6.2832); g.fill(); g.globalAlpha = 1; }
  }
}

// ---- el aire de cine
function cine(g, cam) {
  // luz cálida de tarde desde un lado y bruma del aire
  g.save(); g.globalCompositeOperation = "soft-light";
  const cal = g.createLinearGradient(0, 0, 1080, 1920); cal.addColorStop(0, "rgba(255,190,110,0.55)"); cal.addColorStop(0.55, "rgba(255,230,190,0.1)"); cal.addColorStop(1, "rgba(30,70,100,0.5)");
  g.fillStyle = cal; g.fillRect(0, 0, 1080, 1920); g.restore();
  g.save(); g.globalCompositeOperation = "lighter";
  const sol = g.createRadialGradient(960, 120, 20, 960, 120, 1100); sol.addColorStop(0, "rgba(255,206,140,0.38)"); sol.addColorStop(1, "rgba(255,170,90,0)");
  g.fillStyle = sol; g.fillRect(0, 0, 1080, 1920); g.restore();
  // el horizonte
  const hz = k.proyecta(cam, [cam.p[0], 0, cam.p[2] + 4000]), hy = hz ? hz.y : -999;
  if (hy > -300 && hy < 1920) { const hg = g.createLinearGradient(0, hy - 80, 0, hy + 340); hg.addColorStop(0, `rgba(${BRUMA},0)`); hg.addColorStop(0.3, `rgba(${BRUMA},0.6)`); hg.addColorStop(1, `rgba(${BRUMA},0)`); g.fillStyle = hg; g.fillRect(0, hy - 80, 1080, 420); }
  // la viñeta
  const vg = g.createRadialGradient(540, 960, 520, 540, 960, 1250); vg.addColorStop(0, "rgba(10,14,20,0)"); vg.addColorStop(1, "rgba(10,14,20,0.4)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
  // el grano de película
  g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = 0.09; g.drawImage(grano ??= k.ruido(512, 99, 120, 1, "crudo"), 0, 0, 1080, 1920); g.restore();
}
