#!/usr/bin/env node
// nuevo.mjs: crea la carpeta de un vídeo nuevo, con lo mínimo para empezar.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ, argumentos, ayuda, escribirJson, fallo } from "./lib/comun.mjs";

ayuda(`
node motor/nuevo.mjs "<la idea>" [--slug nombre-corto]

Crea proyectos/<fecha>-<nombre>/ y dice su ruta:
  CONTINUAR.md        la memoria del proyecto: lo decidido, los pasos con casillas y cómo seguir en un chat nuevo
  idea.md             la idea, lo que cuenta en una frase y los datos con su fuente (lo escribes tú; METODO.md, paso 1)
  guion.json          las frases (las escribes tú; paso 2)
  plan.md             frase a frase, lo que se ve, y las escenas (lo escribes tú; paso 4)
  video/mundo.js      lo que comparten los planos (el mismo objeto, el mismo cielo, la misma cámara)
  video/planos/       un archivo por plano; empieza por 01-hook.js
  sonidos.js          los efectos (si el vídeo los lleva)
  notas.md            lo que se hizo y por qué
`);

const { sueltos, op } = argumentos();
const idea = sueltos.join(" ").trim();
if (!idea) fallo('Falta la idea: node motor/nuevo.mjs "por qué el cielo es azul"');
const slug = String(op.slug || idea).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "video";
const hoy = new Date().toISOString().slice(0, 10), dir = join(RAIZ, "proyectos", `${hoy}-${slug}`);
if (existsSync(dir)) fallo(`Ya existe ${dir}. Si es otro vídeo, dale otro --slug.`);
mkdirSync(join(dir, "video", "planos"), { recursive: true });

const carpeta = `${hoy}-${slug}`;
writeFileSync(join(dir, "CONTINUAR.md"), `# ${idea}: todo lo necesario para continuar

Este archivo es la memoria del proyecto. En una conversación nueva basta con leerlo, junto con METODO.md y lo que este
pida. Al terminar cada paso, márcalo y apunta lo que haya cambiado.

## Lo decidido (con las palabras del creador)

-

## Pendiente del creador

-

## Pasos (METODO.md; marca cada uno al terminarlo)

- [ ] 1. La idea y los datos → idea.md
- [ ] 2. El guion → guion.json, **aprobado por el creador**
- [ ] 3. La voz (una sola vez, con el guion cerrado)
- [ ] 4. El plan → plan.md, con sus escenas
- [ ] 5. Escena por escena (cada una, su borrador aprobado):
  - [ ] escena 1 (el hook)
- [ ] 6. El sonido y el video entero: el borrador completo, **aprobado por el creador** (mientras lo mira: la
      miniatura y las descripciones)
- [ ] 7. El render final, la miniatura (flyer.jpg) y las descripciones (descripciones.md), entregados; lo aprendido,
      propuesto

## Para seguir en un chat nuevo

Abre una conversación nueva en la carpeta CODE ART y escribe: **«continúa el proyecto ${carpeta}»**.
`);
writeFileSync(join(dir, "idea.md"), `# ${idea}

Pedido el ${hoy}.

## Lo que cuenta, en una frase

## Los datos, cada uno con su fuente

`);
escribirJson(join(dir, "guion.json"), {
  titulo: idea, idioma: "es", subtitulos: "arriba",
  frases: [
    { texto: "", clave: "", hook: true },
    { texto: "", clave: "" },
  ],
});
writeFileSync(join(dir, "plan.md"), `# Plan: ${idea}

## Los sitios

## Frase a frase

| # | Frase (y su palabra clave) | Lo que se ve, de su primera palabra a la última | En qué palabra pasa lo fuerte | Cámara | Cómo se pasa a la siguiente |
|---|---|---|---|---|---|

## Las escenas

Lo que el creador irá aprobando, una a una (de 8 a 20 s cada una; la primera es el hook).

| Escena | Frases | Planos | Acaba en (s) | Aprobada |
|---|---|---|---|---|
| 1 (el hook) | | | | |
`);
writeFileSync(join(dir, "video", "mundo.js"), `// Lo que comparten los planos de este vídeo: el mismo objeto, el mismo cielo, la misma cámara. Si algo sale en más
// de un plano, se hace aquí una vez, para que sea siempre la misma cosa, del mismo tamaño.
import * as k from "#kit";
import { v } from "#voz";
`);
writeFileSync(join(dir, "video", "planos", "01-hook.js"), `// «(la primera frase)»
// Lo que se ve, frase a frase, de la primera palabra a la última (lo mismo que dice plan.md).
import * as k from "#kit";
import { v } from "#voz";

export const desde = 0; // el primer plano empieza en 0; los demás, en la palabra que trae lo nuevo ("palabra" o "palabra#2")

export function dibuja(g, t) {
  // t: el segundo del vídeo. Todo se calcula desde t (nada se guarda de un fotograma al siguiente).
  // v.t("palabra"): cuándo se dice esa palabra.
  g.fillStyle = "#03050a"; g.fillRect(0, 0, 1080, 1920);
}
`);
writeFileSync(join(dir, "sonidos.js"), `// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });

export default e;
`);
writeFileSync(join(dir, "notas.md"), `# ${idea}\n\nPedido el ${hoy}.\n`);
console.log(dir);
