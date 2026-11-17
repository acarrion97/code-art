// Inmobiliaria: la lotización vista desde el cielo (calles, lotes libres y vendidos, casas, árboles), el globo con el
// proyecto y los compradores lejanos, y las líneas de luz que los unen. Para videos de lotizaciones, urbanizaciones y
// proyectos inmobiliarios. Usa los logos de `piezas/marca/` (Lotes al Mando); cámbialos por los de otra marca.
//   import { lotizacion, LOTES, poligono, sobreMapa, arco, celularPin, pinProyecto, avion, VERDE, AZUL, DORADO } from "#piezas/lotizacion.js";
//   lotizacion(g, cam, t, { estado, resalta: { id, u }, pintar: false, pulsoLibres })
// La casa de dentro y de fuera: `#piezas/casa.js`. Ejemplo de uso: plantillas.md («Video de producto»).
import { readFileSync } from "node:fs";
import * as k from "#kit";
import { loadImage } from "@napi-rs/canvas";

const { azar, suave, tramo, mez, F, res, pto, mezRgb } = k;

export const VERDE = "16,178,126", AZUL = "8,47,63", DORADO = "196,154,79", NARANJA = "255,150,70", ROJO = "255,70,70";
// La marca (piezas/marca/): se cargan una vez, arriba.
const marca = (n) => loadImage(readFileSync(new URL(`./marca/${n}.webp`, import.meta.url)));
export const LOGO_OSCURO = await marca("logo-horizontal-oscuro"), LOGO_CLARO = await marca("logo-horizontal-claro"), ICONO = await marca("icono-app");
const NIEBLA = "255,226,186", ASFALTO = "58,64,74", VENDIDO = "92,108,124";

// ---------------------------------------------------------------- la lotización
// Calles a lo largo de z; lotes en bloques de 2 × 4.
const BLOQUES_X = [-2, -1, 0, 1, 2], BLOQUES_Z = 14, PX = 58, PZ = 84, LW = 20, LD = 16;
export const LOTES = [];
{
  const a = azar(77);
  for (const bx of BLOQUES_X) for (let bz = 0; bz < BLOQUES_Z; bz++) for (let cx = 0; cx < 2; cx++) for (let cz = 0; cz < 4; cz++) {
    const x0 = bx * PX - LW + cx * LW, z0 = bz * PZ - 4 * LD / 2 + cz * LD + 10;
    LOTES.push({ id: LOTES.length, x0, z0, w: LW, d: LD, vend: a() < 0.42, casa: a(), tono: a(), orden: a() });
  }
}
// Los árboles, por las aceras de las calles.
const ARBOLES = [];
{
  const a = azar(91);
  for (let i = -2; i <= 3; i++) for (let z = -20; z < BLOQUES_Z * PZ; z += 12) {
    ARBOLES.push({ x: i * PX - PX / 2 + (a() < 0.5 ? -9 : 9) * 0 + (a() - 0.5) * 3 + (a() < 0.5 ? -7.2 : 7.2), z: z + a() * 6, r: 1.5 + a() * 1.1, h: 2.2 + a() * 1.4, v: a() });
  }
}

// Un polígono en el suelo (o a una altura), recortado por delante de la cámara y proyectado.
export function poligono(cam, pts) {
  const N = 0.6, c = pts.map((X) => { const d = res(X, cam.p); return [pto(d, cam.e.r), pto(d, cam.e.u), pto(d, cam.e.f)]; });
  const out = [];
  for (let i = 0; i < c.length; i++) {
    const a = c[i], b = c[(i + 1) % c.length], ia = a[2] >= N, ib = b[2] >= N;
    if (ia) out.push(a);
    if (ia !== ib) { const s = (N - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, N]); }
  }
  return out.map(([x, y, z]) => [540 + (F * x) / z, 960 - (F * y) / z, z]);
}
function traza(g, P) { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); }

const niebla = (z, ini = 90, fin = 430) => Math.pow(tramo(z, ini, fin), 1.1) * 0.92;

// Dibuja el cielo, el suelo, los lotes, las casas y los árboles. opc:
//   estado(lote, t) → 0 (libre) … 1 (vendido); por defecto, el suyo de siempre.
//   resalta: { id, u } un lote que se ilumina; pintar: false para dejar los lotes sin color (el mapa «apagado»)
export function lotizacion(g, cam, t, opc = {}) {
  const estado = opc.estado || ((l) => (l.vend ? 1 : 0));
  // el cielo (se ve cuando la cámara baja)
  const sk = g.createLinearGradient(0, 0, 0, 1920);
  sk.addColorStop(0, "#35549c"); sk.addColorStop(0.3, "#8e86b8"); sk.addColorStop(0.5, "#ffc59a"); sk.addColorStop(1, `rgb(${NIEBLA})`);
  g.fillStyle = sk; g.fillRect(0, 0, 1920, 1920);
  // el suelo
  const S = 3000, suelo = poligono(cam, [[-S, 0, -S], [S, 0, -S], [S, 0, S * 2], [-S, 0, S * 2]]);
  traza(g, suelo); g.fillStyle = "rgb(176,158,118)"; g.fill();
  g.save(); traza(g, suelo); g.clip(); g.globalAlpha = 0.5; g.globalCompositeOperation = "multiply"; g.drawImage(k.manchas, 0, 700, 1080, 1220); g.restore();
  // la franja de asfalto de cada calle (entre bloques)
  const zi = cam.p[2] - 60, zf = cam.p[2] + 520;
  for (let i = -2; i <= 3; i++) {
    const xc = i * PX - PX / 2 - 0.0;
    const P = poligono(cam, [[xc - 6.5, 0, zi], [xc + 6.5, 0, zi], [xc + 6.5, 0, zf], [xc - 6.5, 0, zf]]);
    if (P.length < 3) continue;
    traza(g, P); g.fillStyle = `rgb(${ASFALTO})`; g.fill();
  }
  // las calles que cruzan
  for (let bz = Math.floor(zi / PZ) - 1; bz < zf / PZ + 1; bz++) {
    const zc = bz * PZ + 52, P = poligono(cam, [[-3 * PX, 0, zc - 7.5], [3 * PX, 0, zc - 7.5], [3 * PX, 0, zc + 7.5], [-3 * PX, 0, zc + 7.5]]);
    if (P.length < 3) continue;
    traza(g, P); g.fillStyle = `rgb(${ASFALTO})`; g.fill();
  }
  // las líneas discontinuas del centro
  g.save(); g.lineCap = "butt";
  for (let i = -2; i <= 3; i++) {
    const xc = i * PX - PX / 2;
    for (let z = Math.floor(zi / 12) * 12; z < zf; z += 12) {
      const P = poligono(cam, [[xc - 0.35, 0.02, z], [xc + 0.35, 0.02, z], [xc + 0.35, 0.02, z + 5], [xc - 0.35, 0.02, z + 5]]);
      if (P.length < 3 || P[0][2] > 300) continue;
      traza(g, P); g.fillStyle = `rgba(255,236,170,${0.85 * (1 - niebla(P[0][2], 60, 300))})`; g.fill();
    }
  }
  g.restore();
  // los lotes
  const cosas = [];
  for (const l of LOTES) {
    if (l.z0 + l.d < zi || l.z0 > zf) continue;
    const P = poligono(cam, [[l.x0, 0.03, l.z0], [l.x0 + l.w, 0.03, l.z0], [l.x0 + l.w, 0.03, l.z0 + l.d], [l.x0, 0.03, l.z0 + l.d]]);
    if (P.length < 3) continue;
    const zc = Math.min(...P.map((p) => p[2]));
    if (zc > 520) continue;
    const e = opc.pintar === false ? -1 : estado(l, t), f = niebla(zc);
    const libre = `${Math.round(mez(16, 70, l.tono * 0.4))},${Math.round(mez(170, 196, l.tono))},${Math.round(mez(112, 120, l.tono))}`;
    const col = e < 0 ? `${Math.round(206 - l.tono * 14)},${Math.round(190 - l.tono * 14)},${Math.round(150 - l.tono * 12)}` : e <= 0 ? libre : e >= 1 ? VENDIDO : mezRgb(libre, VENDIDO, e);
    traza(g, P);
    g.fillStyle = `rgb(${mezRgb(col, NIEBLA, f)})`; g.fill();
    g.strokeStyle = `rgba(255,255,255,${0.9 * (1 - f)})`; g.lineWidth = Math.max(0.6, 2.4 - zc / 120); g.stroke();
    if (opc.pulsoLibres > 0 && e === 0) { g.save(); g.globalCompositeOperation = "lighter"; traza(g, P); g.fillStyle = `rgba(120,255,190,${0.22 * opc.pulsoLibres})`; g.fill(); g.restore(); }
    if (opc.resalta && opc.resalta.id === l.id) {
      const u = opc.resalta.u; g.save(); g.globalCompositeOperation = "lighter"; traza(g, P); g.fillStyle = `rgba(255,255,255,${0.55 * u})`; g.fill(); g.lineWidth = 6; g.strokeStyle = `rgba(${DORADO},${u})`; g.stroke(); g.restore();
    }
    // la casa de los vendidos (y algunas libres con la obra empezada)
    if ((e > 0.55 || (e >= 0 && l.casa < 0.1)) && zc < 300) cosas.push({ z: zc, casa: l, e });
  }
  for (const a of ARBOLES) {
    if (a.z < zi || a.z > zf) continue;
    const p = k.proyecta(cam, [a.x, a.h, a.z]);
    if (!p || p.z > 330 || p.x < -150 || p.x > 1230) continue;
    cosas.push({ z: p.z, arbol: a, p });
  }
  cosas.sort((a, b) => b.z - a.z);
  for (const c of cosas) {
    if (c.arbol) arbol(g, cam, c.arbol, c.p);
    else casa(g, cam, c.casa, c.e);
  }
  // la neblina del horizonte
  const hz = k.proyecta(cam, [cam.p[0], 0, cam.p[2] + 4000]);
  const hy = hz ? hz.y : 0;
  if (hy > -300 && hy < 1920) {
    const hg = g.createLinearGradient(0, hy - 90, 0, hy + 380);
    hg.addColorStop(0, `rgba(${NIEBLA},0)`); hg.addColorStop(0.25, `rgba(${NIEBLA},0.55)`); hg.addColorStop(1, `rgba(${NIEBLA},0)`);
    g.fillStyle = hg; g.fillRect(0, hy - 90, 1080, 470);
  }
  // la luz de la tarde
  g.save(); g.globalCompositeOperation = "lighter";
  const sol = g.createRadialGradient(900, 200, 40, 900, 200, 1300);
  sol.addColorStop(0, "rgba(255,200,120,0.34)"); sol.addColorStop(1, "rgba(255,160,80,0)");
  g.fillStyle = sol; g.fillRect(0, 0, 1080, 1920); g.restore();
}

function arbol(g, cam, a, p) {
  const r = k.tamano(a.r, p.z), f = niebla(p.z), pie = k.proyecta(cam, [a.x, 0, a.z]);
  if (r < 0.8) return;
  if (pie) { g.fillStyle = `rgba(20,30,20,${0.35 * (1 - f)})`; g.beginPath(); g.ellipse(pie.x + r * 0.5, pie.y + r * 0.1, r * 1.1, r * 0.4, 0, 0, 6.2832); g.fill(); }
  if (pie) { g.strokeStyle = `rgb(${mezRgb("90,64,40", NIEBLA, f)})`; g.lineWidth = Math.max(1, r * 0.22); g.beginPath(); g.moveTo(pie.x, pie.y); g.lineTo(p.x, p.y); g.stroke(); }
  const base = a.v < 0.5 ? "22,120,70" : "40,150,80";
  const gr = g.createRadialGradient(p.x - r * 0.3, p.y - r * 0.35, r * 0.1, p.x, p.y, r);
  gr.addColorStop(0, `rgb(${mezRgb("130,215,110", NIEBLA, f)})`); gr.addColorStop(0.55, `rgb(${mezRgb(base, NIEBLA, f)})`); gr.addColorStop(1, `rgb(${mezRgb("10,70,48", NIEBLA, f)})`);
  g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.fill();
}

// Una casa: caja con tejado, sus caras según de dónde se mira.
function casa(g, cam, l, e) {
  const w = l.w * 0.62, d = l.d * 0.6, h = 4 * Math.min(1, e + 0.25), x0 = l.x0 + (l.w - w) / 2, z0 = l.z0 + (l.d - d) / 2;
  const P = (x, y, z) => [x0 + x, y, z0 + z];
  const paredes = l.casa < 0.35 ? "244,240,230" : l.casa < 0.7 ? "250,224,190" : "226,236,244";
  const tejado = l.casa < 0.5 ? "196,84,56" : "58,92,128";
  const caras = [
    { n: [0, 0, -1], q: [P(0, 0, 0), P(w, 0, 0), P(w, h, 0), P(0, h, 0)], c: paredes, s: 0.85 },
    { n: [0, 0, 1], q: [P(0, 0, d), P(w, 0, d), P(w, h, d), P(0, h, d)], c: paredes, s: 1 },
    { n: [-1, 0, 0], q: [P(0, 0, 0), P(0, 0, d), P(0, h, d), P(0, h, 0)], c: paredes, s: 0.7 },
    { n: [1, 0, 0], q: [P(w, 0, 0), P(w, 0, d), P(w, h, d), P(w, h, 0)], c: paredes, s: 0.95 },
  ];
  const f = 0;
  for (const c of caras) {
    const m = [x0 + w / 2 + c.n[0] * w / 2, h / 2, z0 + d / 2 + c.n[2] * d / 2];
    if (pto(res(m, cam.p), c.n) >= 0) continue;
    const Q = poligono(cam, c.q); if (Q.length < 3) continue;
    traza(g, Q); g.fillStyle = `rgb(${c.c.split(",").map((v) => Math.round(+v * c.s)).join(",")})`; g.fill();
  }
  const R = poligono(cam, [P(-0.8, h, -0.8), P(w + 0.8, h, -0.8), P(w + 0.8, h + 1.6, d / 2), P(-0.8, h + 1.6, d / 2)]);
  const R2 = poligono(cam, [P(-0.8, h, d + 0.8), P(w + 0.8, h, d + 0.8), P(w + 0.8, h + 1.6, d / 2), P(-0.8, h + 1.6, d / 2)]);
  for (const [Q, s] of [[R, 0.8], [R2, 1]]) { if (Q.length < 3) continue; traza(g, Q); g.fillStyle = `rgb(${tejado.split(",").map((v) => Math.round(+v * s)).join(",")})`; g.fill(); }
}

// ---------------------------------------------------------------- el mundo (el globo)
// La Tierra del kit es un mapa plano dentro de un círculo: un punto (u, v) del mapa se queda pegado a su sitio.
export function sobreMapa(u, v, cx, cy, rad, gira) {
  const w = rad * 4, off = (((gira % 1) + 1) % 1) * w;
  const x = cx - rad + ((((u * w - off) % w) + w) % w), y = cy - rad + v * rad * 2;
  return { x, y, ok: (x - cx) ** 2 + (y - cy) ** 2 < rad * rad * 0.9 };
}
export const SITIOS = {
  proyecto: { u: 0.215, v: 0.6 }, comprador: { u: 0.405, v: 0.34 }, rival: { u: 0.31, v: 0.28 },
};
// los compradores de todo el mundo, para «abierta al mundo»
export const COMPRADORES = [
  { u: 0.405, v: 0.34 }, { u: 0.26, v: 0.3 }, { u: 0.34, v: 0.52 }, { u: 0.45, v: 0.58 }, { u: 0.155, v: 0.42 },
  { u: 0.12, v: 0.64 }, { u: 0.5, v: 0.36 }, { u: 0.29, v: 0.72 }, { u: 0.225, v: 0.27 }, { u: 0.43, v: 0.46 },
];

// Una línea de luz curva entre dos puntos de pantalla, que se dibuja de a a su final (u de 0 a 1).
export function arco(g, A, B, u, color = VERDE, al = 1, alza = 0.3, grosor = 7) {
  if (u <= 0 || al <= 0) return null;
  const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 - Math.hypot(B.x - A.x, B.y - A.y) * alza;
  const pt = (s) => [(1 - s) * (1 - s) * A.x + 2 * s * (1 - s) * mx + s * s * B.x, (1 - s) * (1 - s) * A.y + 2 * s * (1 - s) * my + s * s * B.y];
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const [gr, a, c] of [[grosor * 3.4, 0.16, color], [grosor * 1.6, 0.4, color], [grosor * 0.55, 1, "255,255,255"]]) {
    g.strokeStyle = `rgba(${c},${a * al})`; g.lineWidth = gr; g.beginPath();
    const [x0, y0] = pt(0); g.moveTo(x0, y0);
    for (let i = 1; i <= 40; i++) { const [x, y] = pt((i / 40) * u); g.lineTo(x, y); }
    g.stroke();
  }
  g.restore();
  return pt(u);
}

// Un celular pequeño que brilla sobre el mapa (el comprador). viva: 0 (a oscuras) … 1 (encendido).
export function celularPin(g, x, y, tam, viva = 1, color = NARANJA) {
  brillo(g, x, y, tam * 4.2 * (0.25 + 0.75 * viva), color, 0.9 * viva);
  g.save(); g.translate(x, y - tam * 0.55);
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 16; g.shadowOffsetY = 6;
  k.redondo(g, -tam * 0.34, -tam * 0.6, tam * 0.68, tam * 1.2, tam * 0.1); g.fillStyle = "#14171c"; g.fill();
  g.shadowColor = "transparent"; g.shadowBlur = 0;
  const pg = g.createLinearGradient(0, -tam * 0.5, 0, tam * 0.5);
  pg.addColorStop(0, `rgb(${mezRgb("30,36,46", "255,214,160", viva)})`); pg.addColorStop(1, `rgb(${mezRgb("20,24,32", color, viva)})`);
  k.redondo(g, -tam * 0.28, -tam * 0.52, tam * 0.56, tam * 1.04, tam * 0.07); g.fillStyle = pg; g.fill();
  g.restore();
}
// Un pin del proyecto (marca verde con su punto dorado).
export function pinProyecto(g, x, y, tam, viva = 1, t = 0) {
  brillo(g, x, y, tam * 5 * (0.8 + 0.2 * Math.sin(t * 5)) * viva, VERDE, 0.85 * viva);
  g.save(); g.translate(x, y);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 14; g.shadowOffsetY = 6;
  g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-tam * 0.7, -tam * 0.7, -tam * 0.7, -tam * 1.7, 0, -tam * 1.7);
  g.bezierCurveTo(tam * 0.7, -tam * 1.7, tam * 0.7, -tam * 0.7, 0, 0); g.closePath();
  g.fillStyle = `rgb(${VERDE})`; g.fill(); g.shadowColor = "transparent"; g.shadowBlur = 0;
  g.strokeStyle = "#ffffff"; g.lineWidth = tam * 0.1; g.stroke();
  g.fillStyle = `rgb(${DORADO})`; g.beginPath(); g.arc(0, -tam * 1.05, tam * 0.3, 0, 6.2832); g.fill();
  g.restore();
}
const brillo = k.brillo;

// El avión de papel: una flecha que apunta a ang.
export function avion(g, x, y, tam, ang, al = 1) {
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 14;
  g.fillStyle = "#ffffff"; g.beginPath();
  g.moveTo(tam, 0); g.lineTo(-tam * 0.7, -tam * 0.62); g.lineTo(-tam * 0.35, 0); g.lineTo(-tam * 0.7, tam * 0.62); g.closePath(); g.fill();
  g.shadowColor = "transparent"; g.fillStyle = "#cfd8e6"; g.beginPath(); g.moveTo(tam, 0); g.lineTo(-tam * 0.35, 0); g.lineTo(-tam * 0.7, tam * 0.62); g.closePath(); g.fill();
  g.restore();
}

export { suave };
