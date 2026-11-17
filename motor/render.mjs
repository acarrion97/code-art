#!/usr/bin/env node
// render.mjs: el vídeo de verdad, con su voz y sus efectos.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { basename, dirname, extname, isAbsolute, join } from "node:path";
import { Worker } from "node:worker_threads";
import { RAIZ, argumentos, ayuda, carpetaProyecto, escribirWav, fallo, ffmpeg, leerAudio } from "./lib/comun.mjs";
import { SR } from "./lib/mezcla.mjs";
import { abrir } from "./lib/proyecto.mjs";
import { saltos } from "./lib/saltos.mjs";

ayuda(`
node motor/render.mjs <proyecto> [--borrador] [--desde s] [--hasta s] [--salida archivo.mp4] [--sobrescribir] [--hilos N]

Sin nada: el vídeo final, a 60 fps, en salida/<carpeta del proyecto>/<carpeta del proyecto>.mp4. Al acabar dice los
saltos sueltos que encuentre: míralos con ver.mjs. (La miniatura y las descripciones las hacen portada.mjs y
packs/captions.md: flyer.jpg y descripciones.md, en la misma carpeta.)
--borrador: a 30 fps y más rápido, para verlo en movimiento, en <proyecto>/revisar/borrador-v1.mp4, -v2...
--salida: el nombre del archivo. Solo un nombre ("escenas 1-3 v2 (borrador).mp4" o "Por qué el cielo es azul.mp4") va
  a su carpeta de siempre: revisar/ del proyecto si es borrador, salida/<carpeta del proyecto>/ si es el final. Una
  ruta relativa ("salida/otra/video.mp4") cuenta desde esta carpeta (la de METODO.md).
Nunca pisa un archivo que ya existe: sube la versión que lleve el nombre (v1 → v2) o le añade -v2, y lo dice. Para
  reemplazarlo (rehacer el final), --sobrescribir.
--desde y --hasta: solo ese tramo (con --borrador, para enseñar las escenas hechas: --hasta 24.5).
La voz y los efectos se mezclan como en los vídeos que funcionaron (los efectos, por debajo de la voz) y a su volumen.
`);

const VOLUMEN = -21;      // LUFS del vídeo (en estéreo), el de los vídeos aprobados; la voz y los efectos, 1 a 1
const { sueltos, op } = argumentos();
const dir = carpetaProyecto(sueltos[0]);
const proy = await abrir(dir);
const borrador = !!op.borrador, fps = Number(op.fps || (borrador ? 30 : 60));
const desde = Math.max(0, Number(op.desde || 0)), hasta = Math.min(proy.duracion, Number(op.hasta || proy.duracion));
const primero = Math.round(desde * fps), ultimo = Math.round(hasta * fps);
const nombre = basename(dir);
// adónde va: un nombre solo, a su carpeta de siempre; una ruta relativa, desde la raíz. Nunca pisa lo que ya existe
// (sube su versión o le añade -v2), salvo con --sobrescribir: un borrador nuevo no tapa al que ya se enseñó.
const carpeta = borrador ? join(dir, "revisar") : join(RAIZ, "salida", nombre);
let pedido = op.salida ? String(op.salida) : borrador ? join(carpeta, "borrador-v1.mp4") : join(carpeta, `${nombre}.mp4`);
if (op.salida && !isAbsolute(pedido)) pedido = /[\\/]/.test(pedido) ? join(RAIZ, pedido) : join(carpeta, pedido);
if (!extname(pedido)) pedido += ".mp4";
let salida = pedido;
if (!op.sobrescribir && existsSync(pedido)) {
  // si el nombre ya lleva su versión («escenas 1-3 v1 (borrador)», «borrador-v1»), sube ese número; si no, añade -v2
  const ext = extname(pedido), nom = basename(pedido, ext), donde = dirname(pedido);
  const v = [...nom.matchAll(/(^|[\s_-])v(\d+)(?=$|[\s_()-])/gi)].pop();
  const otro = (n) => join(donde, (v ? nom.slice(0, v.index + v[1].length + 1) + n + nom.slice(v.index + v[0].length) : `${nom}-v${n}`) + ext);
  for (let n = v ? Number(v[2]) + 1 : 2; existsSync(salida); n++) salida = otro(n);
  console.log(`Ya existía ${basename(pedido)}: lo guardo como ${basename(salida)} (para reemplazarlo, --sobrescribir).`);
}
const tmp = join(dir, "revisar", ".render");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
mkdirSync(dirname(salida), { recursive: true });

// --- la imagen, en trozos, cada uno en un hilo
const nh = Math.max(1, Math.min(Number(op.hilos || Math.min(8, cpus().length - 1)), Math.ceil((ultimo - primero) / 60)));
const t0 = Date.now(), total = ultimo - primero, hechos = new Array(nh).fill(0);
let avisado = 0;
const trozos = [];
for (let i = 0; i < nh; i++) {
  const a = primero + Math.floor((total * i) / nh), b = primero + Math.floor((total * (i + 1)) / nh), seg = join(tmp, `trozo-${String(i).padStart(2, "0")}.mp4`);
  const w = new Worker(new URL("./lib/hilo.mjs", import.meta.url), { workerData: { dir, primero: a, ultimo: b, fps, salida: seg, calidad: borrador ? "borrador" : "final" } });
  trozos.push({ seg, fin: new Promise((ok, mal) => {
    w.on("message", (m) => {
      hechos[i] = m.hechos;
      const pct = Math.floor((100 * hechos.reduce((x, y) => x + y, 0)) / total);
      if (pct >= avisado + 20) { avisado = pct - (pct % 20); console.log(`  ${avisado} %`); }
      if (m.fin) ok();
    });
    w.on("error", mal);
    w.on("exit", (c) => (c ? mal(new Error(`el hilo ${i} acabó con ${c}`)) : ok()));
  }) });
}
await Promise.all(trozos.map((x) => x.fin));
const lista = join(tmp, "lista.txt");
writeFileSync(lista, trozos.map((x) => `file '${x.seg.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`).join("\n") + "\n");
const imagen = join(tmp, "imagen.mp4");
ffmpeg(["-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", imagen]);

// --- el sonido: la voz y los efectos, a su volumen
const voz = leerAudio(join(dir, "voz", "voz.wav"), SR), fx = join(dir, "sonidos", "efectos.wav");
const efectos = existsSync(fx) ? leerAudio(fx, SR) : null;
const a0 = Math.round(desde * SR), a1 = Math.min(voz.length, Math.round(hasta * SR)), mezcla = new Float32Array(Math.max(0, a1 - a0));
for (let i = 0; i < mezcla.length; i++) mezcla[i] = voz[a0 + i] + (efectos ? efectos[a0 + i] || 0 : 0);
const crudo = join(tmp, "sonido.wav");
escribirWav(crudo, mezcla, SR);
// lo fuerte que suena en estéreo (el mismo sonido a los dos lados, sin bajarlo), en LUFS integrados; ffmpeg lo escribe
// al final de su salida de errores
const ESTEREO = "pan=stereo|c0=c0|c1=c0";
let lufs = VOLUMEN;
const medida = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", crudo, "-af", `${ESTEREO},ebur128`, "-f", "null", "-"], { encoding: "utf8" });
const I = [...String(medida.stderr).matchAll(/I:\s+(-?\d+(\.\d+)?) LUFS/g)].pop();
if (I) lufs = Number(I[1]);
const ganancia = Math.max(-12, Math.min(18, VOLUMEN - lufs));
ffmpeg(["-i", imagen, "-i", crudo, "-filter_complex", `[1:a]${ESTEREO},volume=${ganancia.toFixed(2)}dB,alimiter=limit=0.89:level=false[a]`, "-map", "0:v", "-map", "[a]",
  "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", salida]);
rmSync(tmp, { recursive: true, force: true });
const seg = ((Date.now() - t0) / 1000).toFixed(0);
console.log(`${salida} (${(hasta - desde).toFixed(2)} s, ${fps} fps, ${total} fotogramas, ${nh} hilos, ${seg} s)`);

// --- los saltos: dónde mirar
if (!borrador) {
  const cortes = proy.planos.slice(1).map((p) => p.desde);
  const s = saltos(salida, fps, cortes);
  const raros = s.sueltos.filter((x) => !x.enCorte);
  if (raros.length) console.log(`Saltos sueltos fuera de los cortes (míralos con ver.mjs; si no son un fogonazo o un choque buscado, arréglalos): ${raros.map((x) => (desde + x.t).toFixed(2)).join(", ")} s`);
  if (s.repetidos.length) console.log(`Fotogramas repetidos en pleno movimiento (un tirón): ${s.repetidos.map((t) => (desde + t).toFixed(2)).join(", ")} s`);
}
