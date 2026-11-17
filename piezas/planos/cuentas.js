// «Mira estas tres cuentas: usan este mismo formato y están llenas de videos virales. Y mira esta: acumula más de 10
// millones de vistas.»
// Corte en «Mira»: tres celulares, cada uno con la captura de una cuenta (mientras no estén, un perfil de muestra),
// llegan uno a uno y se abren en abanico; la cámara se acerca despacio. En «virales», los tres se encienden con un
// brillo y sus perfiles suben solos, enseñando más y más videos. «Y mira esta»: los de los lados se van y el del medio
// (la cuenta de más vistas) viene al frente; «acumula»: un círculo rojo, uno tras otro, en las vistas de cada video;
// «10 millones»: abajo, la cifra corre hasta «+10 M».
// Pieza: cópiala a video/planos/ de tu proyecto. Las capturas, en datos/capturas/ del proyecto (cuenta-1, cuenta-2 y
// cuenta-3; la del medio, la de más vistas, es cuenta-3), enteras y con su barra de estado. Cambia las palabras de T por
// las de tu guion, CIFRA por la que dice la voz y ETIQUETAS por dónde están las vistas en tu captura del medio.
import * as k from "#kit";
import { v } from "#voz";
import { telefono, fondo, SW, SH } from "#piezas/celular.js";
import { sombraSubtitulos } from "#piezas/subtitulos.js";
import { cargarCapturas, barraAbajo } from "#piezas/capturas.js";

const { captura, hayCaptura, cabecera } = await cargarCapturas(new URL("../../datos/capturas/", import.meta.url), ["cuenta-1", "cuenta-2", "cuenta-3"]);

export const desde = "mira";

const { suave, tramo, mez, entra } = k;
const f1 = v.frase(v.palabra("cuentas").frase);
const f2 = v.frase(f1.n + 1);
const T = {
  mira: f1.t("mira"), cuentas: f1.t("cuentas"), usan: f1.t("usan"), virales: f1.t("virales"), fin: f1.fin,
  mira7: f2.t("mira"), acumula: f2.t("acumula"), treinta: f2.t("10"), millones: f2.t("millones"), fin7: f2.fin,
};
const CIFRA = 10e6;
const LLEGA = [T.mira - 0.36, T.cuentas, T.usan];
// las vistas de los seis primeros videos de la captura del medio, en píxeles de una captura de 828 de ancho (las del
// perfil de muestra de capturas.js están aquí; en una captura de verdad, mídelas)
const ETIQUETAS = [[84, 1277], [360, 1277], [632, 1277], [80, 1767], [358, 1767], [632, 1767]];
const CIRCULO = (j) => T.acumula - 0.1 + j * 0.13;
export const momentos = { ...T, llegan: LLEGA, circulos: ETIQUETAS.map((_, j) => CIRCULO(j)) };
const cifra = (n) => (n >= 1e6 ? `${Math.round(n / 1e6)} M` : n >= 1e3 ? `${Math.round(n / 1e3)} mil` : String(Math.round(n)));
// dónde queda cada celular: en abanico (el del medio, delante)
const SITIO = [{ x: 250, y: 1060, giro: -0.16, esc: 0.62 }, { x: 830, y: 1060, giro: 0.16, esc: 0.62 }, { x: 540, y: 1010, giro: 0, esc: 0.7 }];

export function dibuja(g, t) {
  const brilla = suave(tramo(t, T.virales - 0.1, T.virales + 0.3));
  fondo(g, 540, 1000, 0.3 + 0.25 * brilla);
  const acerca = 1 + 0.06 * suave(tramo(t, T.mira, T.fin - 0.2));
  const foco = suave(tramo(t, T.mira7 - 0.25, T.mira7 + 0.45));
  g.save(); g.translate(540, 1000); g.scale(acerca, acerca); g.translate(-540, -1000);
  // los dos de los lados primero (detrás) y el del medio delante
  for (const i of [0, 1, 2]) {
    const u = entra(tramo(t, LLEGA[i] - 0.08, LLEGA[i] + 0.4)), S = SITIO[i];
    if (u <= 0) continue;
    // «Y mira esta»: los de los lados se van; el del medio viene al frente
    const medio = i === 2, sale = medio ? 0 : foco;
    if (sale >= 1) continue;
    const x = mez(540, S.x, u) + (medio ? 0 : (i ? 1 : -1) * 700 * sale), y = mez(2300, S.y, u) + (medio ? 50 * foco : 0);
    const giro = mez(0, S.giro, u) * (1 - foco), esc = medio ? mez(S.esc, 0.88, foco) / mez(1, acerca, foco) : S.esc;
    if (brilla > 0) k.brillo(g, x, y, 900, "255,190,90", 0.45 * brilla * (0.7 + 0.3 * Math.sin(t * 6 + i)) * (1 - foco));
    telefono(g, x, y, esc, giro, (gs) => {
      // el perfil sube solo en «virales» (enseña más videos)
      // (con la captura de verdad, solo lo que le sobra: abajo la tapa la barra de Instagram)
      const real = hayCaptura(`cuenta-${i + 1}`), sube = (real ? 180 : 420) * suave(tramo(t, T.virales - 0.25, T.fin - 0.2));
      gs.save(); gs.translate(0, -sube); captura(gs, `cuenta-${i + 1}`, SW, SH + 420, i); gs.restore();
      if (real) { barraAbajo(gs, SW, SH); if (sube > 0) cabecera(gs, `cuenta-${i + 1}`, SW); }
      // «acumula»: un círculo rojo en las vistas de cada video, uno tras otro
      if (medio) ETIQUETAS.forEach(([ex, ey], j) => {
        const c = tramo(t, CIRCULO(j), CIRCULO(j) + 0.25);
        if (c <= 0) return;
        const E = SW / 828;
        gs.save(); gs.strokeStyle = "#ff2a1f"; gs.lineWidth = 6; gs.lineCap = "round"; gs.shadowColor = "rgba(255,40,30,0.7)"; gs.shadowBlur = 10;
        gs.beginPath(); gs.ellipse(ex * E, ey * E - sube, 86 * E, 30 * E, -0.06, -2.2, -2.2 + Math.PI * 1.98 * suave(c)); gs.stroke(); gs.restore();
      });
    }, 1);
  }
  g.restore();
  // «10 millones»: la cifra, abajo, corre y se para en «+10 M»
  const pc = entra(tramo(t, T.treinta - 0.35, T.treinta)), salta = k.pulso(t, T.millones + 0.05, 0.12);
  if (pc > 0) {
    const n = Math.exp(mez(Math.log(1e6), Math.log(CIFRA), suave(tramo(t, T.treinta - 0.3, T.millones))));
    g.save(); g.translate(540, 1770); g.scale((0.7 + 0.3 * pc) * (1 + 0.15 * salta), (0.7 + 0.3 * pc) * (1 + 0.15 * salta));
    k.pastilla(g, 0, 0, `+${cifra(n)}`, "vistas", "255,255,255", pc, 110);
    g.restore();
  }
  if (t > T.millones && t < T.millones + 1.2) k.fogonazo(g, 540, 1770, (t - T.millones) * 1.4, 700, "255,214,120");
  sombraSubtitulos(g, t);
}
