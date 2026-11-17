// Capturas de pantalla de celular (pieza compartida): perfiles de Instagram/TikTok dentro del celular, que se vean como
// en un celular de verdad. Una captura recortada (sin la barra de estado) lleva encima una barra simulada (hora, señal,
// wifi y batería), para que su cabecera no quede debajo de la cámara; abajo, la barra de Instagram tapa donde acaba la
// captura; y al subir un perfil, su cabecera queda fija (`cabecera`). Las capturas enteras (alto/ancho ≥ 2) van tal cual.
// Mientras falte una captura, se dibuja un perfil de muestra (`perfilMuestra`): el plano funciona igual y, al llegar la
// captura, solo cambia la imagen.
//   const cap = await cargarCapturas(new URL("../../datos/capturas/", import.meta.url), ["cuenta-1", "perfil"]);
//   cap.captura(gs, "perfil", SW, SH); barraAbajo(gs, SW, SH);
import * as k from "#kit";
import { loadImage } from "@napi-rs/canvas";
import { existsSync, readFileSync, readdirSync } from "node:fs";

// la barra de estado simulada (en píxeles de una captura de 828 de ancho; s: la escala)
export function barraEstado(g, w, s) {
  g.save(); g.scale(s, s);
  g.fillStyle = "#0c1014"; g.fillRect(0, 0, w / s, 100);
  g.fillStyle = "#fff"; g.font = "600 34px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("12:31", 108, 52);
  for (let n = 0; n < 4; n++) { k.redondo(g, 618 + n * 11, 62 - (10 + n * 5), 8, 10 + n * 5, 2); g.fill(); }
  g.lineWidth = 5; g.strokeStyle = "#fff"; g.lineCap = "round";
  for (const r of [8, 17, 26]) { g.beginPath(); g.arc(690, 64, r, -Math.PI * 0.75, -Math.PI * 0.25); g.stroke(); }
  g.lineWidth = 2.5; g.globalAlpha = 0.5; k.redondo(g, 726, 38, 56, 28, 9); g.stroke(); g.globalAlpha = 1;
  k.redondo(g, 730, 42, 40, 20, 6); g.fill(); k.redondo(g, 785, 47, 4, 10, 2); g.fill();
  g.restore();
}

// La barra de abajo de Instagram (inicio, reels, mensajes, buscar, perfil), fija abajo de la pantalla (w × h): tapa el
// final de la captura, que no llega hasta abajo.
export const ALTO_BARRA = 76;
export function barraAbajo(g, w, h) {
  g.save(); g.translate(0, h - ALTO_BARRA);
  g.fillStyle = "#0c1014"; g.fillRect(0, 0, w, ALTO_BARRA); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(0, 0, w, 1);
  g.strokeStyle = "#fff"; g.fillStyle = "#fff"; g.lineWidth = 3.2; g.lineJoin = "round"; g.lineCap = "round";
  const y = 32, xs = [1, 3, 5, 7, 9].map((n) => (w * n) / 10);
  // inicio
  g.beginPath(); g.moveTo(xs[0] - 13, y - 2); g.lineTo(xs[0], y - 14); g.lineTo(xs[0] + 13, y - 2); g.lineTo(xs[0] + 13, y + 13); g.lineTo(xs[0] - 13, y + 13); g.closePath(); g.fill();
  // reels
  k.redondo(g, xs[1] - 14, y - 14, 28, 28, 8); g.stroke(); g.beginPath(); g.moveTo(xs[1] - 4, y - 6); g.lineTo(xs[1] + 7, y); g.lineTo(xs[1] - 4, y + 6); g.closePath(); g.fill();
  // mensajes
  g.beginPath(); g.moveTo(xs[2] - 15, y - 12); g.lineTo(xs[2] + 15, y - 14); g.lineTo(xs[2] + 2, y + 14); g.lineTo(xs[2] - 2, y + 1); g.closePath(); g.stroke();
  // buscar
  g.beginPath(); g.arc(xs[3] - 3, y - 3, 10, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(xs[3] + 5, y + 5); g.lineTo(xs[3] + 13, y + 13); g.stroke();
  // perfil
  g.fillStyle = "#3a4a8a"; g.beginPath(); g.arc(xs[4], y, 14, 0, Math.PI * 2); g.fill(); g.lineWidth = 2; g.stroke();
  g.restore();
}

// Un perfil de muestra (sin ninguna cuenta de verdad), en la pantalla (w × h), desde arriba: la cabecera, la cuenta, sus
// cifras, los botones y una cuadrícula de videos con sus vistas. i cambia el color, el nombre y los videos. Las vistas de
// los seis primeros videos quedan, en píxeles de una captura de 828 de ancho, en x 84 · 360 · 632 e y 1277 · 1767.
const MUESTRA = {
  nombres: ["cuenta.ejemplo1", "cuenta.ejemplo2", "cuenta.ejemplo3"],
  colores: [["#ff3b30", "#ffb347"], ["#2e86de", "#7ee8fa"], ["#8e44ad", "#ff6ec7"]],
  titulos: [["¿Por qué el cielo", "ES AZUL?"], ["El río más", "LARGO"], ["¿Cuánto pesa", "UNA NUBE?"], ["El animal más", "RÁPIDO"],
    ["¿Qué hay en", "EL CENTRO?"], ["El lugar más", "FRÍO"], ["¿Por qué flota", "EL HIELO?"], ["La montaña más", "ALTA"],
    ["¿Cómo vuela", "UN AVIÓN?"], ["El desierto", "MÁS SECO"], ["¿Por qué brilla", "LA LUNA?"], ["El volcán más", "GRANDE"]],
  vistas: ["8,2 mill.", "5,7 mill.", "4,9 mill.", "2,6 mill.", "2,2 mill.", "1,9 mill.", "1,4 mill.", "954 mil", "812 mil", "640 mil", "512 mil", "430 mil"],
  fondos: [["#1d2b64", "#f8cdda"], ["#0f2027", "#2c5364"], ["#3a1c71", "#d76d77"], ["#134e5e", "#71b280"], ["#41295a", "#2f0743"], ["#16222a", "#3a6073"]],
};
export function perfilMuestra(g, w, h, i = 0) {
  const s = w / 828, H = h / s, [c1, c2] = MUESTRA.colores[i % 3];
  g.save(); g.scale(s, s);
  g.fillStyle = "#000"; g.fillRect(0, 0, 828, H);
  barraEstado(g, 828, 1);
  // la barra del nombre
  g.fillStyle = "#0c1014"; g.fillRect(0, 100, 828, 80);
  g.strokeStyle = "#fff"; g.lineWidth = 5; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(52, 124); g.lineTo(36, 140); g.lineTo(52, 156); g.stroke();
  g.fillStyle = "#fff"; g.font = "800 36px Figtree"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(MUESTRA.nombres[i % 3], 82, 141);
  for (let n = 0; n < 3; n++) { g.beginPath(); g.arc(760 + n * 14, 141, 4, 0, Math.PI * 2); g.fill(); }
  // la foto de perfil, con su aro, y las cifras
  const ag = g.createLinearGradient(40, 220, 200, 380); ag.addColorStop(0, c1); ag.addColorStop(1, c2);
  g.fillStyle = ag; g.beginPath(); g.arc(120, 300, 82, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#000"; g.beginPath(); g.arc(120, 300, 74, 0, Math.PI * 2); g.fill();
  g.fillStyle = ag; g.beginPath(); g.arc(120, 300, 68, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.92)"; g.beginPath(); g.arc(120, 286, 22, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(120, 340, 38, 22, 0, Math.PI, 0); g.fill();
  [["158", "publicaciones"], ["310 mil", "seguidores"], ["3", "seguidos"]].forEach(([n, l], j) => {
    const x = 300 + j * 180;
    g.fillStyle = "#fff"; g.font = "800 34px Figtree"; g.textAlign = "left"; g.fillText(n, x, 282);
    g.fillStyle = "#e8e8e8"; g.font = "500 26px Figtree"; g.fillText(l, x, 320);
  });
  g.fillStyle = "#fff"; g.font = "700 28px Figtree"; g.fillText("Videos que enseñan algo en segundos", 40, 430);
  g.fillStyle = "#cfcfcf"; g.font = "500 26px Figtree"; g.fillText("Ciencia, lugares y datos curiosos", 40, 470);
  // los botones
  [["Seguir", "#4a5df9", 40, 360], ["Mensaje", "#25292e", 414, 360]].forEach(([tx, col, x, bw]) => {
    g.fillStyle = col; k.redondo(g, x, 520, bw, 66, 14); g.fill();
    g.fillStyle = "#fff"; g.font = "700 28px Figtree"; g.textAlign = "center"; g.fillText(tx, x + bw / 2, 554); g.textAlign = "left";
  });
  // las pestañas: la cuadrícula y los reels (marcada)
  g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 3;
  k.redondo(g, 196, 650, 34, 34, 4); g.stroke(); g.beginPath(); g.moveTo(207, 650); g.lineTo(207, 684); g.moveTo(219, 650); g.lineTo(219, 684); g.moveTo(196, 661); g.lineTo(230, 661); g.moveTo(196, 673); g.lineTo(230, 673); g.stroke();
  g.strokeStyle = "#fff"; k.redondo(g, 597, 650, 34, 34, 8); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(609, 657); g.lineTo(624, 667); g.lineTo(609, 677); g.closePath(); g.fill();
  g.fillRect(552, 760, 276, 3); g.fillStyle = "rgba(255,255,255,0.15)"; g.fillRect(0, 762, 828, 1);
  // la cuadrícula de videos: 3 columnas de 274 × 488, desde y 810
  const tw = 274, th = 488, y0 = 810;
  for (let n = 0; n < 12; n++) {
    const x = (n % 3) * (tw + 3), y = y0 + Math.floor(n / 3) * (th + 3);
    if (y > H) break;
    const m = (n + i * 4) % 12, [f1, f2] = MUESTRA.fondos[(n + i) % MUESTRA.fondos.length];
    g.save(); g.beginPath(); g.rect(x, y, tw, th); g.clip();
    const fg = g.createLinearGradient(x, y, x, y + th); fg.addColorStop(0, f1); fg.addColorStop(1, f2); g.fillStyle = fg; g.fillRect(x, y, tw, th);
    // la cosa del video: una esfera con luz
    const cx = x + tw / 2, cy = y + th * 0.6, r = 70 + ((n * 37) % 30);
    k.brillo(g, cx, cy, r * 3.2, "255,220,160", 0.35);
    const eg = g.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r); eg.addColorStop(0, "#fff6d8"); eg.addColorStop(0.5, MUESTRA.colores[(n + i) % 3][1]); eg.addColorStop(1, MUESTRA.colores[(n + i) % 3][0]);
    g.fillStyle = eg; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    // el título, arriba: la segunda línea en amarillo
    const [l1, l2] = MUESTRA.titulos[m];
    g.textAlign = "center"; g.fillStyle = "#fff"; g.font = "800 26px Figtree"; g.fillText(l1, x + tw / 2, y + 60);
    g.fillStyle = "#ffd23f"; g.font = "900 34px Figtree"; g.fillText(l2, x + tw / 2, y + 100);
    // las vistas, abajo a la izquierda
    const vg = g.createLinearGradient(0, y + th - 120, 0, y + th); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = vg; g.fillRect(x, y + th - 120, tw, 120);
    g.fillStyle = "#fff"; g.beginPath(); g.moveTo(x + 22, y + th - 34); g.lineTo(x + 22, y + th - 10); g.lineTo(x + 41, y + th - 22); g.closePath(); g.fill();
    g.textAlign = "left"; g.font = "700 26px Figtree"; g.fillText(MUESTRA.vistas[n], x + 50, y + th - 21);
    g.restore();
  }
  g.restore();
}

// Carga las capturas (<carpeta>/<nombre>.png|jpg|webp) y devuelve sus funciones. Si falta una, `captura` dibuja el
// perfil de muestra (i: cuál de los tres), para que el plano funcione mientras llega.
export async function cargarCapturas(carpeta, nombres) {
  const FOTOS = {};
  for (const nombre of nombres) {
    const f = existsSync(carpeta) && readdirSync(carpeta).find((x) => x.replace(/\.(png|jpe?g|webp)$/i, "") === nombre);
    if (f) FOTOS[nombre] = await loadImage(readFileSync(new URL(f, carpeta)));
  }
  const hayCaptura = (nombre) => !!FOTOS[nombre];
  // lo que baja una captura recortada (en sus píxeles), por la barra de estado simulada
  const bajaCaptura = (nombre) => { const img = FOTOS[nombre]; return img && img.height / img.width < 2 ? 100 * (img.width / 828) : 0; };
  // la captura en la pantalla (w × h), a lo ancho, desde arriba
  function captura(g, nombre, w, h, i = 0) {
    const img = FOTOS[nombre];
    if (!img) { perfilMuestra(g, w, h, i); return; }
    const e = w / img.width, b = bajaCaptura(nombre) * e;
    if (b) barraEstado(g, w, b / 100);
    g.drawImage(img, 0, b, w, Math.min(img.height * e, h * 1.5));
  }
  // su cabecera (barra de estado y nombre de la cuenta: los primeros 180 px de 828), fija arriba mientras sube
  function cabecera(g, nombre, w, alto = 180) {
    const img = FOTOS[nombre]; if (!img) return;
    const e = img.width / 828;
    g.drawImage(img, 0, 0, img.width, alto * e, 0, 0, w, (alto * w) / 828);
    g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(0, (alto * w) / 828 - 1, w, 1);
  }
  return { captura, hayCaptura, bajaCaptura, cabecera, foto: (nombre) => FOTOS[nombre] };
}
