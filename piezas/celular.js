// El celular (pieza compartida; para promos y videos de venta): una pantalla de SW × SH, el doble de
// alta que de ancha; un reel (1080 × 1920) va a lo ancho, con una franja negra arriba y abajo. A escala 1080 / SW,
// centrado, la pantalla llena la imagen y las franjas quedan fuera: así un video puede «meterse» en el celular sin
// ningún salto. También: el fondo de noche, el pulgar (por fuera del celular, con `encima`), los gestos y los clips.
//   import { telefono, reel, fondo, pulgar, gesto, cargarClips, CEL, SW, SH } from "#piezas/celular.js";
import * as k from "#kit";
import { loadImage } from "@napi-rs/canvas";
import { readdirSync, readFileSync } from "node:fs";

export const SW = 648, SH = 1296, BISEL = 18, PW = SW + 2 * BISEL, PH = SH + 2 * BISEL, RADIO = 92;
export const C = SW / 1080, BARRA = (SH - 1920 * C) / 2;
export const LLENA = 1080 / SW; // la escala a la que la pantalla llena la imagen
// dónde está el celular cuando se ve entero (el mismo en el gancho, al final del chat y en el cuerpo)
export const CEL = { x: 540, y: 1010, esc: 0.93 };

// El fondo detrás del celular: azul noche hacia morado, con una luz cálida detrás.
export function fondo(g, cx = 540, cy = 1000, luz = 0.3) {
  const fg = g.createLinearGradient(0, 0, 0, 1920);
  fg.addColorStop(0, "#0d0a24"); fg.addColorStop(0.5, "#1c1238"); fg.addColorStop(1, "#0a0718");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  const l = g.createRadialGradient(cx, cy, 60, cx, cy, 950);
  l.addColorStop(0, `rgba(255,170,90,${luz})`); l.addColorStop(0.5, `rgba(255,110,70,${luz * 0.35})`); l.addColorStop(1, "rgba(255,110,70,0)");
  g.fillStyle = l; g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

// El celular, con el centro de su pantalla en (cx, cy), a escala esc, girado giro. pantalla(g): dibuja lo de dentro
// en coordenadas de la pantalla (0..SW, 0..SH), recortado a la pantalla. reflejo: el brillo del cristal (0 en primera
// persona). encima(g): lo que va por fuera, encima del celular (el pulgar), en las mismas coordenadas, sin recortar.
export function telefono(g, cx, cy, esc, giro, pantalla, reflejo = 1, encima = null) {
  g.save(); g.translate(cx, cy); g.rotate(giro); g.scale(esc, esc); g.translate(-PW / 2, -PH / 2);
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60; g.shadowOffsetY = 30;
  k.redondo(g, 0, 0, PW, PH, RADIO); g.fillStyle = "#1a1c21"; g.fill(); g.restore();
  k.redondo(g, 0, 0, PW, PH, RADIO); k.metal(g, 0, PW, ["#4a4f58", "#c9ced6", "#6c727c", "#e6e9ee", "#3d4149"]);
  k.redondo(g, 5, 5, PW - 10, PH - 10, RADIO - 5); g.fillStyle = "#0b0c0f"; g.fill();
  g.fillStyle = "#8a9099"; k.redondo(g, -5, 250, 7, 70, 3); g.fill(); k.redondo(g, -5, 340, 7, 110, 3); g.fill(); k.redondo(g, PW - 2, 300, 7, 150, 3); g.fill();
  g.save(); g.translate(BISEL, BISEL);
  k.redondo(g, 0, 0, SW, SH, RADIO - BISEL); g.clip();
  g.fillStyle = "#000"; g.fillRect(0, 0, SW, SH);
  pantalla(g);
  g.fillStyle = "#000"; k.redondo(g, SW / 2 - 72, 16, 144, 38, 19); g.fill();
  if (reflejo > 0) {
    const rf = g.createLinearGradient(0, 0, SW, SH);
    rf.addColorStop(0, "rgba(255,255,255,0.08)"); rf.addColorStop(0.35, "rgba(255,255,255,0)"); rf.addColorStop(1, "rgba(255,255,255,0.03)");
    g.globalAlpha = reflejo; g.fillStyle = rf; g.fillRect(0, 0, SW, SH); g.globalAlpha = 1;
  }
  g.restore();
  if (encima) { g.save(); g.translate(BISEL, BISEL); encima(g); g.restore(); }
  g.restore();
}
// Un reel (dibujado en 1080 × 1920 por dibuja(g)) dentro de la pantalla, a lo ancho.
export function reel(g, dibuja, dx = 0) {
  g.save(); g.translate(dx, BARRA); g.scale(C, C); g.beginPath(); g.rect(0, 0, 1080, 1920); g.clip();
  dibuja(g);
  g.restore();
}

// ---------------------------------------------------------------- los clips
// Fotogramas de otros videos (sacados con ffmpeg a 15 fps, un .jpg por fotograma) en <carpeta>/<nombre>/. Devuelve
// clip(g, nombre, s): el clip a pantalla de reel (1080 × 1920) en su segundo s (al acabar, vuelve a empezar).
//   const clip = await cargarClips(new URL("../datos/clips/", import.meta.url), ["clip-1", "clip-2"]);
export async function cargarClips(carpeta, nombres) {
  const CLIPS = {};
  for (const nombre of nombres) {
    const dir = new URL(`${nombre}/`, carpeta);
    CLIPS[nombre] = await Promise.all(readdirSync(dir).filter((f) => f.endsWith(".jpg")).sort().map((f) => loadImage(readFileSync(new URL(f, dir)))));
  }
  return (g, nombre, s) => {
    const fs = CLIPS[nombre], n = fs.length, i = ((Math.floor(Math.max(0, s) * 15) % n) + n) % n;
    g.drawImage(fs[i], 0, 0, 1080, 1920);
  };
}

// ---------------------------------------------------------------- el pulgar
// Un pulgar visto desde arriba (la uña hacia nosotros): la yema toca en (x, y); el resto del dedo sale hacia ang
// (radianes, 0 = hacia abajo). aprieta: de 0 a 1 mientras toca. largo: lo que mide el dedo (que salga de la imagen).
export function pulgar(g, x, y, ang, aprieta = 0, largo = 900) {
  const W = 150, L = largo;
  const forma = () => {
    g.beginPath(); g.moveTo(-W / 2, W / 2);
    g.arc(0, W / 2, W / 2, Math.PI, 0);
    g.bezierCurveTo(W * 0.52, L * 0.35, W * 0.62, L * 0.7, W * 0.66, L); g.lineTo(-W * 0.66, L);
    g.bezierCurveTo(-W * 0.62, L * 0.7, -W * 0.52, L * 0.35, -W / 2, W / 2); g.closePath();
  };
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(1 - 0.04 * aprieta, 1 - 0.04 * aprieta); g.translate(0, -W * 0.3);
  g.save(); g.translate(16 + 8 * (1 - aprieta), 22 + 12 * (1 - aprieta)); g.filter = "blur(16px)"; forma(); g.fillStyle = "rgba(0,0,0,0.38)"; g.fill(); g.restore();
  forma();
  const piel = g.createLinearGradient(-W * 0.66, 0, W * 0.66, 0);
  piel.addColorStop(0, "#a8694c"); piel.addColorStop(0.22, "#dea383"); piel.addColorStop(0.5, "#f3c6a6"); piel.addColorStop(0.78, "#d99c7c"); piel.addColorStop(1, "#9c5f44");
  g.fillStyle = piel; g.fill();
  g.save(); forma(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18; g.drawImage(k.manchas, -W, 0, W * 2, L); g.restore();
  k.redondo(g, -W * 0.3, W * 0.1, W * 0.6, W * 0.78, W * 0.26);
  const una = g.createLinearGradient(0, W * 0.1, 0, W * 0.9);
  una.addColorStop(0, "#fbe9e2"); una.addColorStop(0.5, "#f1cfc3"); una.addColorStop(1, "#e3b0a0");
  g.fillStyle = una; g.fill(); g.strokeStyle = "rgba(150,80,60,0.45)"; g.lineWidth = 2; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.45)"; k.redondo(g, -W * 0.2, W * 0.16, W * 0.12, W * 0.42, W * 0.06); g.fill();
  g.strokeStyle = "rgba(120,60,40,0.35)"; g.lineWidth = 2.2;
  for (const yy of [W * 1.7, W * 1.82]) { g.beginPath(); g.moveTo(-W * 0.3, yy); g.quadraticCurveTo(0, yy + 10, W * 0.3, yy); g.stroke(); }
  g.restore();
}
// Un gesto: pasa por sus puntos sin tirones. puntos: [segundo, {x, y}]; toques: los tramos en que la yema aprieta.
export function gesto(t, puntos, toques) {
  if (t < puntos[0][0] || t > puntos[puntos.length - 1][0]) return null;
  const cx = k.claves(puntos.map(([tt, p]) => [tt, p.x])), cy = k.claves(puntos.map(([tt, p]) => [tt, p.y]));
  const ap = Math.max(0, ...toques.map(([a, b]) => k.tramo(t, a - 0.05, a) * (1 - k.tramo(t, b, b + 0.06))));
  return { x: cx(t), y: cy(t), ap };
}
