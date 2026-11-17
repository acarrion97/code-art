// «La verdad...» (dicho en susurro)
// Corte a un primer plano, de noche, con luz cálida: la cabeza de alguien de perfil y su oreja, grande. Desde la
// derecha llegan unos labios con la mano ahuecada al lado (el gesto de contar un secreto) y se quedan junto a la oreja.
// En «verdad», del susurro salen ondas suaves y polvo de luz que entran en la oreja; la oreja se enciende un poco: lo
// ha oído. La cámara se acerca despacio. En «quiero» la escena ya reposa: el plano siguiente entra con un corte o un
// fundido.
// Pieza: cópiala a video/planos/ de tu proyecto y cambia SUSURRO y OYE por las palabras de tu frase.
import * as k from "#kit";
import { v } from "#voz";
import { sombraSubtitulos } from "#piezas/subtitulos.js";

// SUSURRO: la palabra en la que salen las ondas del susurro; OYE: la de cuando la oreja ya lo ha oído (se enciende)
const SUSURRO = "verdad", OYE = "quiero";
const F = v.frase(v.palabra(SUSURRO).frase);
export const desde = () => F.inicio - 0.1;
export const entrada = "corte";

const { suave, tramo, mez, entra } = k;
const T = { ini: F.inicio - 0.1, verdad: F.t(SUSURRO), quiero: F.t(OYE), fin: F.t(OYE) + 0.4 };
const LLEGA = [T.ini + 0.05, T.verdad + 0.1];
export const momentos = { ...T, acerca: LLEGA[0], susurra: T.verdad - 0.05 };

const OREJA = { x: 390, y: 1040, s: 1.2 }, CANAL = { x: OREJA.x - 46 * OREJA.s, y: OREJA.y + 44 * OREJA.s };

// la cabeza de quien escucha: mira a la izquierda; piel, pelo y, encima, la oreja
function cabeza(g) {
  const pg = g.createRadialGradient(420, 1000, 60, 160, 1050, 900);
  pg.addColorStop(0, "#c98a64"); pg.addColorStop(0.55, "#8e563a"); pg.addColorStop(1, "#3a1f14");
  g.fillStyle = pg; g.beginPath(); g.ellipse(70, 1040, 560, 780, 0, 0, Math.PI * 2); g.fill();
  // el pelo: arriba y detrás de la oreja, hasta la nuca
  const hg = g.createLinearGradient(0, 300, 700, 1500); hg.addColorStop(0, "#1c120d"); hg.addColorStop(1, "#2e1d14");
  g.fillStyle = hg; g.beginPath();
  g.moveTo(-200, 160); g.bezierCurveTo(200, 120, 560, 330, 640, 700); g.bezierCurveTo(690, 950, 650, 1250, 560, 1560);
  g.lineTo(470, 1560); g.bezierCurveTo(520, 1300, 540, 1020, 500, 840); g.bezierCurveTo(460, 720, 340, 690, 250, 760);
  g.bezierCurveTo(150, 820, 20, 830, -200, 860); g.closePath(); g.fill();
  // el borde del pelo, encendido por la luz de la derecha
  g.save(); g.beginPath(); g.moveTo(420, 300); g.bezierCurveTo(590, 420, 650, 620, 655, 820); g.bezierCurveTo(660, 1050, 630, 1300, 560, 1560);
  g.strokeStyle = "rgba(255,160,100,0.3)"; g.lineWidth = 8; g.stroke(); g.restore();
}
// la oreja izquierda, de lado y derecha (la cara queda a la izquierda): el contorno, el hélix con su surco, el
// antihélix con sus dos brazos, la concha, la raíz del hélix, el canal, el trago, el antitrago y el lóbulo
function oreja(g, luz) {
  g.save(); g.translate(OREJA.x, OREJA.y); g.scale(OREJA.s, OREJA.s);
  const contorno = () => {
    g.beginPath(); g.moveTo(-95, -175);
    g.bezierCurveTo(-60, -262, 90, -275, 128, -170); g.bezierCurveTo(152, -90, 140, 10, 110, 90);
    g.bezierCurveTo(88, 140, 78, 180, 62, 215); g.bezierCurveTo(40, 268, -30, 275, -48, 225);
    g.bezierCurveTo(-58, 195, -62, 150, -82, 125); g.bezierCurveTo(-100, 80, -112, -60, -95, -175); g.closePath();
  };
  // la sombra que deja en la cabeza, y la oreja, iluminada desde la derecha
  g.save(); g.shadowColor = "rgba(20,8,4,0.55)"; g.shadowBlur = 34; g.shadowOffsetX = -16; g.shadowOffsetY = 8;
  const og = g.createLinearGradient(-110, 0, 150, 0); og.addColorStop(0, "#b8714e"); og.addColorStop(0.55, "#e2a27c"); og.addColorStop(1, "#f3c09c");
  contorno(); g.fillStyle = og; g.fill(); g.restore();
  g.lineCap = "round"; g.lineJoin = "round";
  // el hélix: el borde enrollado, claro, y el surco por dentro
  const helix = (e) => { g.beginPath(); g.moveTo(-72 * e, -150 * e); g.bezierCurveTo(-50 * e, -240 * e, 86 * e, -252 * e, 110 * e, -166 * e); g.bezierCurveTo(130 * e, -90 * e, 120 * e, 6 * e, 92 * e, 86 * e); g.bezierCurveTo(72 * e, 132 * e, 64 * e, 170 * e, 50 * e, 204 * e); };
  g.save(); g.translate(-5, 5); helix(1); g.strokeStyle = "rgba(120,58,34,0.35)"; g.lineWidth = 22; g.stroke(); g.restore();
  helix(1); g.strokeStyle = "#efbb97"; g.lineWidth = 20; g.stroke();
  g.save(); g.translate(8, 6); helix(0.84); g.strokeStyle = "rgba(140,70,44,0.42)"; g.lineWidth = 13; g.stroke(); g.restore();
  // la concha: el cuenco, en sombra suave
  const cg = g.createRadialGradient(-30, 50, 6, -10, 30, 120); cg.addColorStop(0, "#5a2a18"); cg.addColorStop(0.55, "#8e4c32"); cg.addColorStop(1, "#c07a56");
  g.fillStyle = cg; g.beginPath(); g.moveTo(-62, -64); g.bezierCurveTo(0, -98, 52, -40, 56, 30); g.bezierCurveTo(58, 98, 28, 140, -20, 138); g.bezierCurveTo(-60, 134, -76, 60, -72, 0); g.closePath(); g.fill();
  // el antihélix: sube por detrás de la concha y arriba se abre en dos brazos
  const antihelix = () => { g.beginPath(); g.moveTo(14, 146); g.bezierCurveTo(60, 100, 76, 20, 70, -48); g.bezierCurveTo(66, -100, 50, -150, 0, -186); };
  g.save(); g.translate(-5, 4); antihelix(); g.strokeStyle = "rgba(120,58,34,0.3)"; g.lineWidth = 22; g.stroke(); g.restore();
  g.strokeStyle = "#e2a580"; g.lineWidth = 18;
  g.beginPath(); g.moveTo(14, 146); g.bezierCurveTo(60, 100, 76, 20, 70, -48); g.bezierCurveTo(66, -100, 50, -150, 0, -186); g.stroke();
  g.lineWidth = 12; g.beginPath(); g.moveTo(62, -96); g.bezierCurveTo(30, -110, -10, -112, -46, -104); g.stroke();
  g.strokeStyle = "rgba(140,70,44,0.4)"; g.lineWidth = 5;
  g.beginPath(); g.moveTo(2, 128); g.bezierCurveTo(44, 90, 58, 20, 54, -46); g.stroke();
  // la raíz del hélix, que entra en la concha desde delante
  g.strokeStyle = "#d8977a"; g.lineWidth = 13; g.beginPath(); g.moveTo(-86, -58); g.bezierCurveTo(-50, -66, -16, -60, 8, -44); g.stroke();
  // el canal y, delante, el trago; abajo, el antitrago; el lóbulo, con su brillo
  g.fillStyle = "#24100a"; g.beginPath(); g.ellipse(-46, 44, 13, 19, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#d69270"; g.beginPath(); g.ellipse(-74, 46, 20, 34, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,210,180,0.35)"; g.beginPath(); g.ellipse(-70, 36, 7, 14, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#e4a682"; g.beginPath(); g.ellipse(16, 146, 22, 14, -0.4, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,214,186,0.3)"; g.beginPath(); g.ellipse(6, 232, 24, 16, 0, 0, Math.PI * 2); g.fill();
  // lo ha oído: la oreja se calienta
  if (luz > 0) { g.globalCompositeOperation = "lighter"; contorno(); g.fillStyle = `rgba(255,150,90,${0.2 * luz})`; g.fill(); g.globalCompositeOperation = "source-over"; }
  g.restore();
}
// quien susurra: de perfil, mirando a la izquierda; la mano ahuecada al otro lado de la boca (se ve su palma, delante
// de la cara), la cara en penumbra con el borde encendido y los labios. Origen: la boca. habla: de 0 a 1.
function susurra(g, x, y, habla) {
  g.save(); g.translate(x, y); g.scale(1.12, 1.12);
  // la mano, ahuecada al otro lado de la boca: la palma hacia nosotros, cuatro dedos hacia arriba que se curvan hacia la
  // oreja, y el pulgar abajo
  const piel = (x0, y0, x1, y1) => { const mg = g.createLinearGradient(x0, y0, x1, y1); mg.addColorStop(0, "#f2bc98"); mg.addColorStop(1, "#b8714e"); return mg; };
  const dedo = (x, y, largo, ancho, ang) => {
    g.save(); g.translate(x, y); g.rotate(ang);
    g.fillStyle = piel(-ancho, -largo, ancho, 0); k.redondo(g, -ancho / 2, -largo, ancho, largo + 20, ancho / 2); g.fill();
    g.strokeStyle = "rgba(120,58,34,0.35)"; g.lineWidth = 3;
    for (const f of [0.38, 0.68]) { g.beginPath(); g.moveTo(-ancho * 0.3, -largo * f); g.lineTo(ancho * 0.3, -largo * f + 2); g.stroke(); }
    g.restore();
  };
  // los dedos (del índice, el más lejos de la boca, al meñique), un poco abiertos y curvados hacia la oreja
  [[-176, -40, 196, 42, -0.34], [-138, -52, 222, 44, -0.24], [-98, -50, 206, 42, -0.15], [-60, -36, 168, 38, -0.07]].forEach(([x, y, l, a, ang]) => dedo(x, y, l, a, ang));
  // la palma
  g.fillStyle = piel(-200, -60, 0, 240); g.beginPath();
  g.moveTo(-200, -40); g.bezierCurveTo(-206, 60, -180, 170, -110, 230); g.bezierCurveTo(-60, 270, 10, 280, 60, 330);
  g.lineTo(90, 260); g.bezierCurveTo(30, 200, -20, 120, -36, -40); g.closePath(); g.fill();
  g.strokeStyle = "rgba(120,58,34,0.35)"; g.lineWidth = 4; g.lineCap = "round";
  g.beginPath(); g.moveTo(-170, 30); g.bezierCurveTo(-130, 60, -90, 70, -50, 60); g.stroke();
  g.beginPath(); g.moveTo(-160, 120); g.bezierCurveTo(-120, 110, -90, 80, -70, 40); g.stroke();
  // el pulgar, abajo, hacia la oreja
  dedo(-150, 170, 128, 44, -0.8);
  // la cara, en penumbra: frente, nariz, boca, barbilla y cuello, y más allá, fuera de la imagen
  const fg = g.createLinearGradient(-60, 0, 500, 0); fg.addColorStop(0, "#6a3c28"); fg.addColorStop(1, "#24130c");
  const perfil = () => {
    g.beginPath(); g.moveTo(700, -700); g.lineTo(80, -620); g.bezierCurveTo(40, -470, 50, -360, 34, -300);
    g.bezierCurveTo(10, -250, -40, -190, -66, -150); g.bezierCurveTo(-74, -132, -40, -112, -14, -108);
    g.bezierCurveTo(-18, -80, -24, -56, -44, -28); g.lineTo(2, 0); g.bezierCurveTo(-30, 18, -40, 40, -14, 64);
    g.bezierCurveTo(-30, 100, -30, 130, -16, 150); g.bezierCurveTo(30, 210, 110, 270, 200, 420); g.lineTo(700, 800); g.closePath();
  };
  perfil(); g.fillStyle = fg; g.fill();
  g.save(); perfil(); g.strokeStyle = "rgba(255,170,110,0.55)"; g.lineWidth = 6; g.stroke(); g.restore();
  // los labios, entreabiertos al hablar
  const ab = 6 * habla;
  const lg = g.createLinearGradient(-44, -50, 10, 60); lg.addColorStop(0, "#d4687a"); lg.addColorStop(1, "#8e3446");
  g.fillStyle = lg;
  g.beginPath(); g.moveTo(-14, -60); g.bezierCurveTo(-30, -52, -48, -40, -46, -26); g.bezierCurveTo(-30, -18 - ab, -10, -10 - ab, 4, -4); g.bezierCurveTo(-2, -30, -6, -50, -14, -60); g.fill();
  g.beginPath(); g.moveTo(4, 4); g.bezierCurveTo(-12, 8 + ab, -36, 14 + ab, -38, 26); g.bezierCurveTo(-34, 50, -18, 64, -6, 62); g.bezierCurveTo(4, 40, 6, 20, 4, 4); g.fill();
  g.fillStyle = "rgba(255,220,225,0.35)"; g.beginPath(); g.ellipse(-26, 40, 9, 5, 0.4, 0, Math.PI * 2); g.fill();
  g.restore();
}
// el susurro: ondas suaves que van de la boca a la oreja, y polvo de luz
const POLVO = (() => { const az = k.azar(808), l = []; for (let i = 0; i < 40; i++) l.push({ d: az(), y: (az() - 0.5) * 90, f: az() * 6.3, r: 4 + az() * 7 }); return l; })();
function ondas(g, bx, by, t, al) {
  if (al <= 0) return;
  const ang = Math.atan2(CANAL.y - by, CANAL.x - bx), largo = Math.hypot(CANAL.x - bx, CANAL.y - by);
  g.save(); g.translate(bx, by); g.rotate(ang); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    const u = ((t - T.verdad) * 0.9 + i / 4) % 1; if (u < 0) continue;
    const x = largo * u, r = 30 + 70 * u;
    g.strokeStyle = `rgba(255,228,190,${al * Math.sin(u * Math.PI) * 0.7})`; g.lineWidth = 7 - 3 * u;
    g.beginPath(); g.arc(x - r, 0, r, -0.6, 0.6); g.stroke();
  }
  for (const p of POLVO) {
    const u = ((t - T.verdad) * 0.55 + p.d) % 1; if (u < 0) continue;
    const x = largo * u, y = p.y * Math.sin(u * Math.PI) + 10 * Math.sin(t * 3 + p.f);
    k.brillo(g, x, y, p.r * 4, "255,214,160", al * 0.5 * Math.sin(u * Math.PI));
  }
  g.restore();
}

export function dibuja(g, t) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#120805"); fg.addColorStop(0.5, "#1f0f08"); fg.addColorStop(1, "#090403");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 860, 980, 1200, "255,150,80", 0.3);
  // la cámara se acerca despacio a la oreja
  const z = 1 + 0.08 * suave(tramo(t, T.ini, T.fin));
  g.save(); g.translate(560, 1060); g.scale(z, z); g.translate(-560, -1060);
  cabeza(g);
  const habla = t > T.verdad - 0.1 ? 0.5 + 0.5 * Math.sin((t - T.verdad) * 22) : 0, oye = suave(tramo(t, T.verdad + 0.3, T.quiero));
  oreja(g, oye * (0.8 + 0.2 * Math.sin(t * 5)));
  // quien susurra llega desde la derecha y se queda junto a la oreja
  const u = entra(tramo(t, LLEGA[0], LLEGA[1])), bx = mez(1460, 860, u) + 6 * Math.sin(t * 1.6), by = CANAL.y - 10;
  ondas(g, bx - 46, by, t, suave(tramo(t, T.verdad - 0.1, T.verdad + 0.2)));
  susurra(g, bx, by, habla);
  g.restore();
  // la viñeta, y un velo arriba para el subtítulo
  const vg = g.createRadialGradient(560, 1060, 300, 560, 1060, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.75)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
  const vt = g.createLinearGradient(0, 0, 0, 560); vt.addColorStop(0, "rgba(0,0,0,0.55)"); vt.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = vt; g.fillRect(0, 0, 1080, 560);
  sombraSubtitulos(g, t);
}
