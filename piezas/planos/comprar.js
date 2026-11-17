// «Dale clic al botón comprar y empieza hoy.»
// Corte en «Dale»: un botón «COMPRAR» enorme, rojo y brillante, que late suave. El pulgar llega desde abajo y lo aprieta
// en «comprar»: el botón se hunde, un fogonazo y confeti de colores. «empieza hoy»: un anillo de luz se abre y el botón
// queda encendido y reposa un momento antes del corte.
// Pieza: cópiala a video/planos/ de tu proyecto. APRIETA es la palabra en la que el pulgar aprieta el botón y BRILLA,
// la del anillo de luz (si tu frase no la tiene, el anillo sale medio segundo después); TEXTO, lo que dice el botón.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, pulgar } from "#piezas/celular.js";
import { sombraSubtitulos } from "#piezas/subtitulos.js";
import { boton } from "#piezas/boton-comprar.js";

const APRIETA = "comprar", BRILLA = "empieza", TEXTO = "COMPRAR";
const F = v.frase(v.palabra(APRIETA).frase);
export const desde = () => F.inicio - 0.04;

const { suave, tramo, mez, entra } = k;
const talVez = (p) => { try { return F.t(p); } catch { return null; } };
const T = { ini: F.inicio, comprar: F.t(APRIETA), empieza: talVez(BRILLA) ?? F.t(APRIETA) + 0.5, fin: F.fin, final: F.fin - 0.1 };
export const momentos = { ...T, aprieta: T.comprar + 0.02 };
const CONFETI = (() => { const az = k.azar(1515), l = []; for (let i = 0; i < 90; i++) { const a = az() * Math.PI * 2, s = 600 + az() * 1400; l.push({ vx: Math.cos(a) * s, vy: Math.sin(a) * s - 700, giro: (az() - 0.5) * 16, c: ["#ff3b30", "#ffd23f", "#4a90e2", "#7ed321", "#bd10e0", "#ffffff"][i % 6], w: 14 + az() * 18 }); } return l; })();

export function dibuja(g, t) {
  const ap = k.pulso(t, T.comprar + 0.04, 0.07) > 0.05 ? k.pulso(t, T.comprar + 0.04, 0.07) : 0;
  fondo(g, 540, 1040, 0.3 + 0.35 * suave(tramo(t, T.comprar, T.comprar + 0.4)));
  const ent = entra(tramo(t, T.ini - 0.04, T.ini + 0.35)), late = 0.03 * Math.sin((t - T.ini) * 5) * (1 - suave(tramo(t, T.comprar - 0.2, T.comprar)));
  const s = mez(0.6, 1, ent) * (1 + late);
  g.save(); g.translate(540, 1040); g.scale(s, s); g.translate(-540, -1040);
  // el anillo de luz que se abre en «empieza»
  const an = tramo(t, T.empieza - 0.1, T.empieza + 0.9);
  if (an > 0 && an < 1) { g.save(); g.strokeStyle = `rgba(255,214,150,${0.8 * (1 - an)})`; g.lineWidth = 14 * (1 - an) + 2; g.beginPath(); g.ellipse(540, 1040, 420 + 500 * an, 140 + 300 * an, 0, 0, Math.PI * 2); g.stroke(); g.restore(); }
  boton(g, 540, 1040, ap, suave(tramo(t, T.comprar, T.comprar + 0.3)), TEXTO);
  g.restore();
  if (t > T.comprar) k.fogonazo(g, 540, 1040, (t - T.comprar) * 1.4, 1000, "255,200,150");
  // el confeti
  const w = t - T.comprar - 0.02;
  if (w > 0 && w < 2.5) for (const p of CONFETI) {
    const x = 540 + p.vx * w * (1 - 0.3 * w), y = 1040 + p.vy * w + 1400 * w * w;
    if (y > 2000) continue;
    g.save(); g.translate(x, y); g.rotate(p.giro * w); g.fillStyle = p.c; g.globalAlpha = 1 - tramo(w, 1.6, 2.5); g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore();
  }
  // el pulgar: llega desde abajo a la derecha, aprieta en «comprar» y se retira un poco
  const dx = k.claves([[T.ini, 1300], [T.comprar - 0.15, 690], [T.comprar, 650], [T.comprar + 0.25, 700], [T.final, 760]]), dy = k.claves([[T.ini, 2300], [T.comprar - 0.15, 1110], [T.comprar, 1080], [T.comprar + 0.25, 1190], [T.final, 1290]]);
  if (t > T.ini) pulgar(g, dx(t), dy(t), -0.55, ap, 1700);
  sombraSubtitulos(g, t);
}
