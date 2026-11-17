// Más sombra para los subtítulos (pieza compartida), para que se lean bien sobre un fondo con detalle. El
// motor los pone encima de cada fotograma con una sombra suave; antes, cada plano llama aquí, al final de su dibuja,
// y se dibuja una sombra más fuerte con la misma forma (los mismos subtítulos en un lienzo aparte, de los que solo cae
// la sombra: el texto queda fuera de la imagen).
//   import { sombraSubtitulos } from "#piezas/subtitulos.js";   ...   sombraSubtitulos(g, t);
import * as k from "#kit";
import { v } from "#voz";
import { bloques, dibujarSubtitulos } from "../motor/lib/subtitulos.mjs";

const BLOQUES = bloques(v.palabras, v.duracion), SUBS = k.fijar(k.lienzo(1080, 1920));
export function sombraSubtitulos(g, t) {
  const c = SUBS.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1080, 1920);
  dibujarSubtitulos(c, t, BLOQUES, "arriba");
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; g.filter = "none";
  for (const [blur, al, dy] of [[28, 0.9, 6], [10, 0.85, 3]]) {
    g.shadowColor = `rgba(0,0,0,${al})`; g.shadowBlur = blur; g.shadowOffsetX = 4000; g.shadowOffsetY = dy;
    g.drawImage(SUBS, -4000, 0);
  }
  g.restore();
}
