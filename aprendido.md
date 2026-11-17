# Lo aprendido

Lo que ya costó un error, para no pagarlo otra vez. Se lee antes de cada video, junto con `METODO.md`,
`piezas/LEEME.md` y `plantillas.md`. El objetivo con cada video: **mejor calidad, menos costo y menos tiempo**. Al
entregar un video, propón en 2-3 líneas qué añadir aquí o a `piezas/`; entra solo lo que el creador apruebe.

## Lo que ya se corrigió (que no vuelva a pasar)

- Nada de la interfaz de Instagram encima de los videos que se enseñan (iconos, nombres, «Seguir»…), salvo que sea una
  captura de un perfil.
- En un scroll de videos, ninguno se repite.
- El pulgar va por fuera del celular (`encima` en `telefono`), nunca recortado dentro de la pantalla.
- Ninguna frase se corta a medias por un cambio de escena: el cambio llega al terminarla.
- Subtítulos con más sombra (`#piezas/subtitulos.js`) cuando el fondo tiene detalle.
- Las tildes, siempre bien: en los subtítulos, en el texto en pantalla y en la portada.
- Capturas: el nombre de la cuenta no puede quedar bajo la cámara del celular; si la captura viene recortada, barra de
  estado simulada (`#piezas/capturas.js`); nada de franjas negras donde acaba la captura.
- Lo que se dibuja tiene que leerse a la primera: una mano que parece una oreja no sirve; una oreja, de lado y derecha,
  no en diagonal. Si una forma es difícil (manos, caras, orejas), mira el fotograma grande antes de enseñarlo.
- Borradores siempre con nombre propio y versión (`escenas 1-3 v2 (borrador).mp4`), nunca el mismo nombre: al abrirlos
  se confunden.
- **Objetos que se explican** (una herramienta, una pieza, una medida):
  - Un video de referencia no siempre es mejor que lo que ya se hace: se iguala a un original solo cuando el creador lo
    pide, y en lo que pida.
  - Como el de verdad: de una sola pieza si lo es, pulido, con los huecos huecos (no una mancha negra), cada parte en su
    sitio, con bisel, sombra de contacto y materiales de verdad (`#piezas/objetos.js`). Unas cajas lisas se ven básicas.
  - Que se vea el mecanismo (qué se mueve, por dónde, contra qué); una versión translúcida («fantasma») lo explica
    mejor, sin mezclas ni tintes raros.
  - Lo que se explica, grande y en el centro; las medidas, precisas, sobre el objeto, con topes y flechas hacia dentro.
  - Cada cosa toca lo que debe tocar (la herramienta, el punto que mide).
  - Nada se solapa: las cifras, libres y fuera de la franja de los subtítulos; el texto en pantalla, con sombra.
  - Fondo neutro, sin tintes.
  - Pantalla partida: una cámara por mitad, en un solo eje y alineadas, con el objeto centrado.

## Técnica (el motor y el kit)

- **Nunca `fillText` al cargar un módulo** (texturas con letras): los subtítulos del render salen sin tildes. Las
  texturas con texto se hacen la primera vez que se dibujan (`hecha ??= hacer()`).
- `ellipse` con un barrido de 2π o más se queda en un arco pequeño: para un círculo que se dibuja de un trazo, como
  mucho 1,98π.
- Un lienzo que se reutiliza en cada fotograma: `k.fijar` vacío; el desenfoque, calentarlo la primera vez.
- Un patrón (`createPattern`) de un lienzo se copia entero en cada uso: conviértelo en imagen.
- Las capturas de pantalla de macOS llevan un espacio especial en el nombre: cópialas con un comodín (`ls -t …12.09.02*`;
  en Windows, `Get-ChildItem *12.09.02*`).
- Insertar una frase en el guion cambia los números de las siguientes: los planos que usan `v.frase(n)` hay que
  renumerarlos (todos a la vez, con una sustitución, y comprobar con `grep`). Anclar en palabras únicas evita el lío.
- Un efecto de sonido en el fotograma de un corte no suena: ponlo ≥ 0,1 s después.
- Usar otro video ya hecho dentro de este: saca sus fotogramas sin subtítulos con `motor/lib/cuadro.mjs`
  (`dibujar(proy, est, t, { subtitulos: false })`), a 15 fps y a 540 × 960; cárgalos todos al empezar con `loadImage`
  (`new Image()` + `src` se decodifica después y sale en negro). Las salidas de ffmpeg `f%04d.jpg` empiezan en 1, no en
  0. Para que se vea «dibujado», sus líneas: `edgedetect=mode=wires` y un tinte cian.
- Voz: lo que se pronuncia raro va en `dicho` («CODE ART» → «coud art», «ChatGPT» → «chat yi pi ti», «Claude» →
  «clod», «IA» → «i a», «2,5 millones» → «dos millones y medio», «30» → «treinta»). Para susurrar una frase, su
  `dicho` empieza por `[whispers]` (sale ~6 dB más baja y no se pronuncia la etiqueta).
- Dentro de algo que se desvanece, cada parte usa `g.globalAlpha *= x`, nunca `= x`: si no, se queda opaca y
  desaparece de golpe al final. Al revisar saltos, busca `globalAlpha =`.
- Las texturas `k.red` y `k.red2` (modo "lineas") en multiplicar vuelven piedra agrietada el metal, la madera y la pared: en metal, como mucho al
  10 %; la madera, con vetas dibujadas.
- Saltos que avisa el render cada 0,067 s dentro de un clip a 15 fps, o en los cortes propios de un video que se
  enseña en el celular, son del clip: se miran una vez y se aceptan.
- `revisar.mjs` avisa de cortes parecidos entre fondos oscuros distintos: si son sitios distintos y se ven distintos,
  se acepta.

- **Escenas en 3D (cámara del kit):** ve unos 43° de ancho. Una sala, de unos 7 × 6,5 m y la cámara a ~4 m de la pared
  del fondo; en una sala más grande los muebles salen diminutos. Si el fondo es claro, un degradado oscuro detrás de los
  subtítulos para que se lean.
- **Un gesto que sale de pantalla** (pulgar, mano): su punto final, fuera del encuadre del todo (`y: 2150`); si acaba
  dentro, aparece o desaparece de golpe.
- **Símbolos raros** («✓» y similares) pueden no existir en la letra: se dibujan a mano con líneas.
- **Un tramo quieto de más de 3-4 s** (un mapa, un globo): zoom o movimiento lento para que no se sienta parado.
- **Vista de dron / satélite que se vea real:** `#piezas/satelite.js` (tierra y pasto naturales, calles de asfalto,
  casas con sombra larga, bosque, bruma, luz cálida y viñeta). Colores planos y saturados se ven de juguete. No uses
  `k.red` como grano: son grietas; el grano, con `k.ruido(..., "crudo")` a muy poca opacidad.
- **Una casa que se vea de verdad** (`#piezas/casa.js`): paredes con textura, tejas, marcos y postigos, porche, piso de
  tablones, zócalos, cortinas, cuadros con marco y luz cálida. Un recorrido por dentro necesita 1,5 s como mínimo: cruza
  la puerta unas palabras antes de lo que dice la voz.
- **Cambios de estado que se vean:** un destello (fogonazo, anillo y chispas) cuando algo pasa a «vendido», y colores
  vivos para lo libre contra apagados para lo vendido.
- **Acabado de cine (`#piezas/cine.js`):** color frío/cálido, resplandor, profundidad de campo, destello de lente, rayos,
  polvo, grano y balanceo de dron, al final de `dibuja`. Va desde el inicio de la escena: si se enciende a mitad de una
  toma (por ejemplo al pasar del celular a pantalla llena) se ve un salto. El grano, fino (~1024 px): grueso se ve
  pixelado. Las copias desenfocadas se pintan con `imageSmoothingQuality = "high"`.
- **`satelite.js` y los recortes:** su suelo cubre toda la pantalla; si lo mueves o lo metes en una ventana, recorta con
  `clip` antes de dibujarlo, o tapa todo lo de detrás.
- **Del celular a pantalla llena sin salto:** deja el celular (`telefono`) a escala `LLENA * 1,14` hasta el final de la
  escena en vez de cambiar a dibujo directo; el cambio mueve el encuadre. Un efecto de sonido, a ≥ 0,1 s de un corte.
- **Cargar imágenes de otro sitio de la carpeta:** `loadImage(new URL(...))` falla con el espacio de «CODE ART»; lee el
  archivo con `readFileSync` y pásalo a `loadImage`.
- **Un mismo escenario en varias escenas** (el monitor con el tablero): exporta sus funciones del primer plano y úsalas
  en los siguientes, para no cortar dentro del mismo sitio y que los cambios de módulo sean deslizamientos.
- **Siempre con `--sobrescribir`** al re-renderizar un video ya entregado.

## Costo y tiempo

- **Renders con cine:** el borrador completo tarda ~1 min y el final, ~14 min (60 fps). Lánzalos en segundo plano y
  no digas que están listos hasta que terminen.

- **Las palabras raras del hook se deciden antes de la voz:** cambiar «cupiera» por «estuviera» después rehízo la voz
  entera. Si el creador duda de una palabra, que la vea en el guion antes de aprobarlo.

- **Un chat por video.** Para seguir uno en otra conversación, «continúa el proyecto …» (lee su `CONTINUAR.md`).
- **Cerrar el guion antes de la voz:** cada cambio de frase rehace la voz entera (cuesta dinero en ElevenLabs y mueve
  todos los tiempos). Junta los cambios del creador y haz la voz una vez.
- **El cierre también se cierra antes de la voz,** y la toma se comprueba escuchándola o transcribiéndola (una vez dijo
  «a posar» por «a hacer»).
- **Escena por escena:** cada escena se enseña en un borrador corto (`--hasta`) y se aprueba antes de la siguiente.
  Enseñar el video entero en cada ronda llegó a costar ~24 versiones en ~4 h; casi la mitad de las notas eran de forma.
- **Objeto nuevo, primero su fotograma:** si el kit no sabe dibujar el objeto, primero un fotograma grande para que el
  creador apruebe el look; luego su escena.
- **Miniatura y descripciones mientras el creador mira el borrador completo** (`METODO.md`, paso 6): no dependen de su
  visto bueno; se entregan con el render final (paso 7), que así sale en cuanto aprueba.
- **Datos con letra pequeña:** cada «nunca» o «siempre» lleva en `idea.md` su línea «Cuidado» (un río «sin puentes»
  puede tenerlos en sus afluentes), para que el guion no diga más de lo que dice la fuente.
- **Ver antes que renderizar:** `ver.mjs` (un segundo, un tramo, una frase) tarda segundos; un borrador, ~1 min.
  Render en calidad completa solo al final.
- **Piezas antes que código nuevo:** mira `piezas/` antes de dibujar un celular, una captura, un botón o una portada.
- **Plantillas:** si el video es una promo o una venta, empieza por `plantillas.md`.
- **Agentes con cuidado:** solo si tu IA los tiene y el creador dice que sí. Un agente que hereda toda la conversación
  cuesta muchísimo (uno costó ~1 M de tokens). Úsalos solo para piezas grandes e independientes, con encargos cerrados (un archivo nuevo cada uno,
  sin tocar los demás), y pídeles que devuelvan lo que hay que pegar (los sonidos) en vez de editar archivos compartidos.

## De «Por qué tu cliente vio tu lotización y nunca te escribió» (Lotes al Mando)

- **Estética de Lotes al Mando:** colores vivos, no apagados. Un baño de color encima de cada toma (`vida` en `mundo.js` del proyecto: verde azulado arriba, azul en medio, violeta y un toque dorado abajo, con `overlay` y `soft-light`) más `cine` con `color` alto. Subtítulos en Anton, mayúsculas, las ya dichas en azul claro. Portadas con el estilo `capitulo` (`packs/portadas.md`).
- **Mismo celular y misma sala en varias escenas:** el plano que sigue lleva `export const entrada = "sigue"`, y así `revisar.mjs` no lo avisa como salto.
- **Cambio de color de un video a mitad:** `vida` con `fuerza` menor (0,35) en el mundo cálido de día; el frío de noche, con fuerza 1.
- **Un dato de otro país o de otro sector** (el informe de NAR de EE. UU. sobre compra de vivienda) no se dice con cifra en un video para lotes de Latinoamérica: el guion usa solo la idea («primero miran por internet»), y la línea «Cuidado» queda en `idea.md`.
- **Una cifra que solo aparece en fuentes secundarias** (la de «responder en una hora», HBR 2011) se descarta.
- **Renders:** el borrador con sonido tarda ~3,5 min; el final a 60 fps, ~6,5 min en esta máquina. Siempre en segundo plano.

## De la serie «Ecuador necesita una nueva generación en IA» (ISPADE, 4 partes)

- **Subtítulos apagados por tramos (p. ej. en el cierre):** el motor no tiene opción. Se consigue desde el plano, al cargarlo: se sustituyen las palabras de esas frases en `v.palabras` por una sola palabra vacía con `inicio: 999` (así el subtítulo anterior no se queda hasta el final y no sale ningún recuadro). Leer antes los tiempos (`v.frase(n).t(...)`), porque después ya no existen.
- **Portadas con otra marca:** `motor/portada.mjs` trae un morado y un amarillo fijos (el flag `--oscuro` no los cambia). Para una marca con otra paleta, usar una copia fuera de `motor/` (en la carpeta temporal, con un enlace a `node_modules`) que fije `M.oscuro`, `M.sticker` y `M.sticker_texto`. El estilo `capitulo` pone el logo de Lotes al Mando: no sirve para otras marcas.
- **Fondo blanco:** letra de subtítulos azul marino (`ESTILO.tinta`, `ESTILO.marca`, `ESTILO.dicha` desde `video/mundo.js`; no se toca `motor/`), sombras suaves en vez de brillos (`lighter` no se ve), y la persona con ropa oscura (la blanca se pierde). La revisión avisa de «subtítulo sobre fondo casi blanco»: es una falsa alarma si la letra es oscura.
- **Fondo negro:** el azul marino de la marca no se ve solo; se usa su versión luminosa (#6FA0FF) y brillos. Un logo con fondo gris va en una tarjeta blanca.
- **Logo con fondo gris sobre blanco:** quitarle el fondo por luminosidad y saturación (`(218 - l) / 36` y `(sat - 9) / 34` como alfa) y ponerlo directo sobre el blanco.
- **Cada parte de una serie sale con el mismo cierre** (logo, datos, botón de WhatsApp, sin subtítulos): se copia el plano de cierre de la parte anterior y se cambia el número de frase.
- **Música:** no hay en `sonidos/`. Se sintetizó una cama electrónica sencilla (pad, arpegio, bombo y un golpe en el logo) y se mezcló a -15 dB en `sonidos/efectos.wav`; si se vuelve a lanzar `sonido.mjs`, hay que volver a mezclarla (el original queda en `efectos-solo.wav`).
- **Contorno de un país a mano** (Ecuador): vale como aproximado; si importa, pedir un contorno oficial.

## De «Black Friday: 50 % el primer mes» (Lotes al Mando)

- **Portadas de Lotes al Mando mientras `marca.json` sea de otra marca** (ahora, ISPADE): `motor/portada.mjs` lee `marca.json` (estilo, azul y dorado). Se guarda una copia, se pone `marca-lotes-al-mando.json` como `marca.json`, se hacen las portadas (estilo `capitulo`, con `--subtitulo`) y se devuelve el original en el mismo comando.
- **Portada con algo grande en el centro** (una etiqueta, un celular): `--dy 340` la baja para que el título no la tape.
- **Oferta o descuento:** la etiqueta de precio que se parte (`#piezas/etiqueta-precio.js`) como hilo del video: cae en el hook, vuelve a mitad y cierra con una barra de tiempo que se vacía. Sin precio ni fecha si el creador no los da.
- **Muchos destellos a la vez** (una oleada de lotes que se venden) con `cine` encima blanquean la imagen: poca opacidad, menos a lo lejos, y anillos solo en los cercanos.
- **La última escena y el borrador completo, juntos:** con las demás aprobadas, enseñar el cierre dentro del completo con sonido ahorra una ronda.

## De «Black Friday para corredores inmobiliarios» (Lotes al Mando)

- **«Corredor inmobiliario», no «corredor» a secas:** el creador lo corrigió con la voz ya hecha y hubo que rehacerla. A quién se le habla, con su nombre completo, se cierra en el guion.
- **El celular, que se vea entero:** pidió «el teléfono un poco más pequeño» en el hook; a escala ~1,04 (centro y ≈ 1215) se ve entero con aire alrededor. A 1,2 llena demasiado.
- **Chats:** `#piezas/burbujas.js`. Un pico dibujado en el mismo trazo que el cuerpo de la burbuja sale hueco: se rellena aparte.
- **Dos planos sobre el mismo fondo** (tablero → calendario) se avisan como salto: el segundo con `entrada = "sigue"`, y el panel de antes se desliza fuera mientras entra el nuevo (se exporta su función del primer plano).
- **Un mapa en el celular más de 3 s:** varias ventas en vivo seguidas y un vuelo de la cámara; si no, la revisión lo da por quieto.

## De «Corredores: todas tus propiedades en un solo lugar» (Lotes al Mando)

- **Un panel con muchas tarjetas:** cinco por fila como mucho (escala 0,6, cada 190 px); con seis se ven diminutas y medio cuadro queda vacío. `#piezas/propiedades.js`.
- **Las mismas cosas en todo el video** (18 tarjetas): una lista y una función por colocación (regadas, en montones, en cuadrícula, por estado), y cada plano mezcla de una a otra. Los planos seguidos, con `entrada = "sigue"`.
- **Lo que un plano dibuja encima de todo** (números, un «?») y sigue en el plano siguiente: en una función exportada, o desaparece de golpe al cambiar de plano.
- **El título de la portada, corto** (cuatro o cinco palabras): con siete tapa la imagen. Con `--dy 330`.
- **Dos escenas finales dentro del borrador completo:** se aprobó a la primera; vale cuando las anteriores salieron sin cambios.


## De la miniserie «El misterio del 3, 6 y 9» (3 partes, tema espiritual)

- **Estilo línea fina sobre negro** (referencia del creador): fondo `#000` con cuadrícula de puntos muy tenue, trazo dorado/blanco de 2-4 px con un poco de glow, nodos de luz, rótulos pequeños en mayúsculas y diagramas (triángulos, círculos, regla, cruz, puerta). El `mundo.js` de `proyectos/2026-11-12-misterio-369-parte-1-el-3-en-todo/video/` trae los ayudantes (`trazo`, `arco`, `nodo`, `rotulo`, `numeroLinea`, `figura`, `triangulo`, `aros`) para copiarlos a otro video de este estilo. Subtítulos en dorado (`ESTILO.marca`) con lo dicho en gris.
- **El creador no quiere morados** de fondo: negro puro. `motor/portada.mjs` trae una banda y una etiqueta fijas (morado y amarillo): para fondo negro, usar una copia fuera de `motor/` (con `node_modules` enlazado y las rutas `./lib/` absolutas) que fije `M.oscuro = "#000000"`.
- **Otra voz de otra persona** (un video de referencia) no se clona: se propone una voz masculina parecida de ElevenLabs y se rehace la voz. Antonio con `estabilidad 0,5` y `velocidad 0,97` sonó más calmo; cambiarla después de aprobar el guion costó rehacer las tres voces.
- **Un texto largo del creador** (≈2:30) se parte en una miniserie de 3 partes de 35-50 s, con un gancho al principio de cada una y una frase de enlace al final de la anterior; el texto se mantiene, solo se añaden ganchos y enlaces.
- **Sonido mínimo sin huecos** (efectos suaves): un golpe hondo al empezar, `aire` en cada plano, `clic` en la palabra clave, `tic` suave cada ~1 s y `sube` al final, todo calculado desde `v.frases`. La revisión de «cortes parecidos» da falsos avisos cuando todo es negro.
- **El creador quiere ver siempre los videos en la conversación** (`SendUserFile`).

## De las historias en línea fina (entropía, sapiens, gorila)

- **Historia con más peso** (la que el creador pidió «más poderosa»): un estudio o un hecho real que se cuenta paso a paso (año, quién, qué hicieron, qué pasó), una cifra honesta («cerca de la mitad») y una vuelta emocional que le habla al que mira («la persona con la que discutes no miente: ve otro mundo»). Lo que es metáfora se dice como metáfora y lo que es de un autor se atribuye (Harari, Schrödinger, Eddington, Seth).
- **Gráficos que parecen interactivos** (un video no se toca, pero se siente así): un reproductor con su play, un contador que sube, un panel de 20 figuras que se encienden, un cursor que recorre una regla con su valor (nm), una prueba que desaparece y se rellena, burbujas que se multiplican, un cuadro de comentario que se escribe y un marcador que se guarda. Cada uno, en su palabra.
- **Piezas de dibujo reutilizables** (en `video/mundo.js` de `proyectos/2026-11-13-gorila-que-no-viste/`): `ojo`, `cerebro`, `gorila` (con golpe de pecho), `figura`, `sapiens` (esqueleto), `huevo` (cáscara en trozos), `lluvia` (ruido que se desvía de un aro). Copiarlas, no rehacerlas.
- **Sonido rico:** una base (golpe hondo al empezar, `aire` en cada plano, `clic` en la clave, `tic` suave cada ~1 s) más un efecto por gesto: `toque` al pulsar, un `tic` por cada pase (el plano exporta sus momentos), `golpe` por cada golpe en el pecho, `late` doble en la revelación, `pitido` cuando algo desaparece, `cristal` para colores, `estallido` al fundirse, `aviso` al llegar un mensaje. Los momentos salen de `v.t()` y de lo que exportan los planos.
- **Miniatura:** si la etiqueta tapa lo importante, elegir otro fotograma (un ojo o un número grande aguanta mejor que una figura en la parte baja).
- **Un cierre que pide guardar y compartir** («Guarda este video y envíaselo a…») se dibuja como el gesto: un marcador que se llena y un mensaje que viaja entre dos círculos.
