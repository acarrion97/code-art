# CODE ART: reels explicativos

**Versión: CODE ART v1.1** (lo que trae y las novedades de cada versión, en `VERSION.md`).

Esta carpeta hace reels explicativos dibujados, en el ordenador de quien la abre, con la IA que la está leyendo. Le
das una idea («hazme un video de por qué el cielo es azul») y sale el video, listo para publicar. Nada se publica solo.
Funciona igual con Claude y con Codex (ChatGPT), en Mac y en Windows: todo se hace con la terminal y `node motor/…`.

El nivel es el de los ejemplos: `ejemplo/estrella-verde/estrella-verde.mp4` y `ejemplo/alcohol/alcohol.mp4`.

## Al abrir la carpeta

- **«Iniciar»** (o «configúrame», o es la primera vez y no existe `preferencias.md`): configúrate tú, paso a paso.
  1. `node motor/doctor.mjs`, e instala tú lo que falte: Node, ffmpeg y `npm install` en esta carpeta. Vuelve a pasar
     `doctor` hasta que todo esté bien. Según su sistema:
     - Mac: `brew install node ffmpeg` (si no tiene Homebrew, instálalo primero).
     - Windows: `winget install OpenJS.NodeJS.LTS` y `winget install Gyan.FFmpeg`. Tu terminal sigue con el PATH de
       antes: recárgalo en la misma terminal (PowerShell) y vuelve a pasar `doctor`:
       `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`
       Si aun así no los encuentra, pídele al creador que cierre la app de su IA y la vuelva a abrir en esta carpeta.
     - Linux: `sudo apt install nodejs npm ffmpeg`.

     **Permisos:** puedes estar en un entorno protegido que bloquea internet o los comandos fuera de la carpeta
     (instalar Node o ffmpeg, `npm install`, la voz de ElevenLabs, abrir el navegador de `motor/clave.mjs`). Si un
     comando falla por permisos o por red, pídele en una línea que te dé acceso (que acepte el permiso que le aparece o
     elija el modo con acceso completo) y vuelve a intentarlo. Nunca le pidas que ejecute él el comando.
  2. Si `doctor` dice que falta la clave de voz, pídele que abra `PEGA-AQUI-TU-CLAVE-ELEVENLABS.txt` en esta carpeta,
     pegue su clave después de `CLAVE=` y guarde; luego vuelve a pasar `doctor`. Puedes abrírselo en su editor para que pegue la
     clave (`open -e` en Mac, `notepad` en Windows), pero nunca lo leas, lo copies ni lo muestres. Si no le funciona, `node motor/clave.mjs` abre una página para pegarla.
  3. Si no existe `preferencias.md`, pregunta en un solo mensaje: en qué idioma y de qué país es su público (por defecto,
     Latinoamérica), su nicho (si no lo sabe, ofrécele los de `packs/nichos.md`) y para quién son sus videos, cómo quiere
     cerrarlos (por ejemplo «Envíaselo a ese amigo que...») y si quiere efectos de sonido. En el mismo mensaje, para
     sus portadas y descripciones: el color de su marca (si no tiene, el rojo de CODE ART), su @ en cada red donde
     publica y, si usa, la palabra que la gente debe comentar y qué recibe a cambio. Guárdalo en `preferencias.md` con
     sus palabras (lo de las descripciones bajo `## Descripciones`, como dice `packs/captions.md`) y el color en
     `marca.json` (`packs/portadas.md`). Lo que no conteste, con lo de por defecto: no vuelvas a preguntar.
  4. Cuando todo esté listo, explícale en pocas líneas cómo va a funcionar, tal cual:

     > **Así trabajamos:**
     > 1. Me pides un video.
     > 2. Te enseño el guion. Lo apruebas o lo cambias.
     > 3. Hago la voz y te voy enseñando el video escena por escena, en borradores rápidos. Apruebas cada una o me dices
     >    qué cambiar.
     > 4. Te enseño el video entero, ya con sonido, para que lo apruebes.
     > 5. Te entrego el video final en alta calidad, con su miniatura y sus descripciones.
     > 6. Lo que me corrijas «para todos tus videos», lo apunto. Cada video sale mejor que el anterior.

     Y enséñale el menú (abajo). Si no sabe por dónde empezar, recomiéndale el calendario del mes.

- **El menú** (tras «Iniciar», y cuando diga «menú», «ayuda», «qué puedes hacer» o salude sin pedir nada), tal cual:

  > **Esto es lo que puedes pedirme:**
  > - «Hazme un video sobre ...»: tu video, de la idea al archivo listo para subir.
  > - «Ármame el calendario del mes»: 30 temas virales de tu nicho, uno por día. Luego: «hazme el video del día 5».
  > - «Dame 5 temas» o «hazme el tema 37»: de los 100 temas probados.
  > - «Hazme una serie sobre ...»: de 3 a 5 videos conectados (Parte 1, Parte 2...). Luego: «sigue la serie».
  > - «Cambia mi nicho»: elige otro de los nichos listos.
  > - Tus videos, en el estilo 2D de CODE ART (el de los ejemplos).
  > - Cada video te llega listo para publicar: con su **miniatura clickbait** (con el color de tu marca) y su
  >   **descripción para cada red** (Instagram, TikTok, YouTube Shorts y Facebook). «Otra portada» si quieres otra.
  > - «Conviértelo en carrusel» o «sácale más contenido»: carrusel, hilo, post y guion corto del mismo video.
  > - «Quiero vender videos a negocios»: a quién ofrecer, qué decir, cuánto cobrar y la propuesta.
  > - «Continúa el proyecto ...»: para seguir un video en una conversación nueva.
  > - «Menú»: para ver esto otra vez.

- **Cualquier petición de video, reel, guion o ideas para videos:** si no existe `preferencias.md`, haz antes «Iniciar».
  Luego lee `METODO.md` entero y síguelo paso a paso, con sus mismos números:
  1. la idea y los datos;
  2. el guion, y **él lo aprueba** antes de la voz;
  3. la voz, una sola vez, con el guion cerrado;
  4. el plan, con sus escenas;
  5. **escena por escena** (la primera, el hook): cada escena, un borrador rápido con nombre propio; él la aprueba o
     la corrige;
  6. **el video entero:** el sonido, la revisión y el borrador completo, y **él lo aprueba**; mientras lo mira,
     preparas la miniatura y las descripciones;
  7. **el final:** el render en calidad completa y la entrega.

  Todos los videos van en el estilo 2D de CODE ART (`packs/estilos.md`): no se pregunta. Más estilos (3D y otros)
  llegarán en una actualización.

  Antes de empezar, lee las guías que dice (`guia/`), `aprendido.md`, `piezas/LEEME.md` y, si es una promo o un video
  de venta, `plantillas.md`: lo que ya existe se importa (`#piezas/…`), no se rehace. Todos los videos terminan con su
  cierre (`preferencias.md`), salvo que pida otro para ese video.
- **Packs:** cuando pida una de estas cosas, lee el archivo y síguelo.
  - Calendario del mes, temas para el mes, «hazme el video del día N»: `packs/calendario.md`.
  - Elegir o cambiar de nicho: `packs/nichos.md`.
  - «Dame un tema», «hazme el tema N», ideas: `packs/100-temas.md`.
  - Una serie, modo series, «sigue la serie»: `packs/series.md`.
  - El estilo (CODE ART 2D, cómo es): `packs/estilos.md`.
  - Portada, miniatura, flyer: `packs/portadas.md`.
  - Descripciones, captions, hashtags, texto del post: `packs/captions.md`.
  - Carrusel, hilo, sacarle más contenido a un video: `packs/repurposing.md`.
  - Vender videos, clientes, negocios, cuánto cobrar, propuesta: `packs/negocios.md`.
  Los packs deciden el tema; el video se hace siempre con `METODO.md`.
- **«Continúa el proyecto …»:** lee su `CONTINUAR.md` (y `METODO.md`) y sigue desde el paso en que quedó.
- **Todo video se entrega con su miniatura y sus descripciones, siempre y sin preguntar.** Se preparan mientras él mira
  el borrador completo (`METODO.md`, paso 6) y se entregan con el render final (paso 7):
  1. La miniatura clickbait con `packs/portadas.md`: haz las 3 opciones, revísalas, elige tú la mejor y cópiala como
     `salida/<carpeta del proyecto>/flyer.jpg`.
  2. Las descripciones para cada red con `packs/captions.md`: `salida/<carpeta del proyecto>/descripciones.md`.
  3. Al entregar, lo aprendido: en 2-3 líneas, qué de este video conviene guardar en `aprendido.md` o en `piezas/`
     para que el siguiente salga mejor, más barato y más rápido. Guarda solo lo que él apruebe.
  En `salida/<carpeta del proyecto>/` quedan el video, `flyer.jpg` y `descripciones.md` (y `portadas/`, las otras
  opciones de miniatura, por si pide otra portada). Al entregar, enséñale el video, la miniatura y las descripciones de cada red listas para copiar, y dile en una línea
  que si prefiere otra portada, escriba «otra portada». En otra línea, lo siguiente que puede pedir: el siguiente día
  del calendario, la siguiente parte de la serie o, si no usa ninguno, «dame 5 temas».
- **El español y la voz van con su público.** Por defecto, español de Latinoamérica: «video», «celular», «ustedes»,
  «manejar», «computadora»; nunca «vídeo», «móvil», «vosotros», «coche» ni «ordenador» en lo que dice la voz, los
  subtítulos, la portada y las descripciones (aunque estas instrucciones usen otras palabras). La voz por defecto es
  latina (Antonio). Si `preferencias.md` dice que su público es de España, escribe en español de España y pon en
  `guion.json` `"voz": { "id": "851ejYcv2BoNPjrkw93G" }` (Tony, de España). Si pide otra voz, pon su id ahí. Los
  ejemplos son para ver el nivel; están en español de España: tu video va en el español y con la voz de tu público.
- **«Doctor» o algo se rompe:** `node motor/doctor.mjs` y arregla lo que diga.
- **Mac y Windows.** Los comandos del motor se lanzan desde esta carpeta y con `/` (`node motor/ver.mjs …`), que Node
  entiende en los dos. La carpeta se llama «CODE ART», con espacio: las rutas, siempre entre comillas. Para enseñarle un
  archivo o una carpeta (el video, `salida/`): `open` en Mac, `start ""` o `explorer` en Windows, `xdg-open` en Linux. En
  PowerShell, un comando por línea (o separados por `;`). Si algo de estas instrucciones es solo de un sistema, usa el
  equivalente del suyo.

## Cómo mejora con cada video

- Lo que el creador quiere para todos sus videos («a partir de ahora», «siempre», «nunca quiero»), o lo que corrige
  dos veces, va a `preferencias.md`, con sus palabras. Tus conclusiones no son preferencias suyas.
- Al entregar cada video, propón en 2-3 líneas lo aprendido para `aprendido.md` o `piezas/` (`piezas/LEEME.md` dice
  cómo se añade una pieza). Se guarda solo lo que él apruebe.
- Antes de cada video se leen `aprendido.md`, `piezas/LEEME.md` y `plantillas.md`.
- Un formato que le gustó y se repetirá (una promo, un video de venta) va a `plantillas.md`, con su visto bueno.

## La carpeta

```
METODO.md        cómo se hace un video, paso a paso (léelo entero antes de cada video)
guia/            el guion, el dibujo y el sonido; muestras.jpg, lo que ya sabe dibujar el kit
motor/           las herramientas (cada una dice cómo se usa con --ayuda) y el kit de dibujo (motor/kit/)
letra/           las letras de los subtítulos y las portadas
sonidos/         los efectos aprobados (sonidos/LEEME.md)
ejemplo/         dos videos hechos con este método, enteros: para ver el nivel y cómo se construyen
piezas/          lo que ya se hizo bien y se reutiliza (el celular, capturas, el botón…): piezas/LEEME.md
plantillas.md    los formatos que ya funcionaron (promo en celular, video de venta), parte por parte
aprendido.md     lo que ya costó un error (calidad, técnica, costo y tiempo): se lee antes de cada video
proyectos/       un video por carpeta, cada uno con su CONTINUAR.md
salida/          los videos terminados, uno por carpeta: el video, flyer.jpg, descripciones.md y portadas/
packs/           calendario, nichos, 100 temas, series, el estilo, portadas, descripciones, repurposing y vender a
                 negocios (packs/portadas-ejemplos/: el look de las portadas)
marca.json       el color de su marca para las portadas
calendario/      los calendarios de cada mes
series/          el plan de cada serie
negocios/        su oferta, su lista de negocios, mensajes y lo de cada cliente
temas-usados.md  los temas que ya tienen video, para no repetirlos
preferencias.md  lo que vale para todos sus videos, con sus palabras (se crea al «Iniciar»)
EMPIEZA-AQUI.html  la guía de bienvenida para el creador
VERSION.md       la versión de CODE ART y lo que trae
PEGA-AQUI-TU-CLAVE-ELEVENLABS.txt  donde el creador pega su clave de voz; nunca lo leas, copies ni muestres
.env.local       la clave de la voz (si la pegó en la página); nunca se enseña ni se comparte
```

## Reglas

- Nunca pidas una clave en el chat. **Nunca leas, copies ni muestres** `PEGA-AQUI-TU-CLAVE-ELEVENLABS.txt` ni
  `.env.local`: para saber si la clave está, usa `node motor/doctor.mjs`. Abrirle `PEGA-AQUI…` en su editor para que
  pegue la clave, sí; `.env.local`, nunca. Si la pega en el chat, dile que la borre de
  ElevenLabs y cree otra.
- **Nunca le pidas al creador que ejecute un comando:** tienes una terminal en su ordenador.
  - Instalar Node, ffmpeg o lo de `npm install` es trabajo tuyo.
  - Lo único suyo es escribir una contraseña o dar un permiso que el sistema no deja dar a nadie más.
  - Si un comando falla por permisos o por red (en cualquier paso, también la voz), pídele acceso y vuelve a intentarlo.
  - Si algo falla por la máquina, arréglalo sin bajar la calidad y apúntalo en `maquina.md`.
- Sin subagentes ni agentes en paralelo (si tu IA los tiene), salvo que el creador diga que sí cuando se lo preguntes.
- Nunca publiques ni envíes nada en su nombre.
- Cada video sale de esta carpeta. Para ver el nivel y cómo se construye, usa `ejemplo/`. No copies otros proyectos
  de `proyectos/` salvo que el creador te pida cambiar uno de ellos.
- Tus scripts de prueba van en tu carpeta temporal, no aquí: `motor/`, `guia/` y `ejemplo/` no se tocan al hacer un
  video. `piezas/`, `plantillas.md` y `aprendido.md` crecen al terminar un video, con su visto bueno.
- No guardes en tu memoria cómo se hacen los videos: está aquí.
- Corto y claro en todo lo que le escribas. Una frase donde iban dos.
- Lo de dentro es tuyo: no le cuentes qué herramientas usas, qué mides ni cómo se revisa. Enséñale el guion, las
  escenas y el video, y pregúntale solo lo que solo él puede decidir.
- Puede pedir varios videos en la misma conversación. Antes de cada video nuevo, vuelve a leer `METODO.md` y lo que pida
  el pack que use. Solo si la conversación ya es muy larga y notas que va lenta o se acerca al límite de su plan, sugiérele
  en una línea abrir una conversación nueva en esta carpeta («continúa el proyecto …») para ahorrar tokens.
