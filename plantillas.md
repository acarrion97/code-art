# Plantillas

Formatos que ya se hicieron y funcionaron: su estructura, para que el siguiente de ese tipo salga en menos pasos. Son un
punto de partida, no un molde: el guion lo decide el creador y el video se hace con `METODO.md`. Las piezas, en
`piezas/`.

## Promo en celular: «comenta la palabra» (~25 s)

Para promocionar este tipo de videos. Todo pasa en un celular en primera persona, sin cortes (todos los planos
`entrada = "sigue"`, una escena común):
1. Reel 1 a pantalla completa: un gancho con un dato visual y una cifra que corre.
2. Scroll. Reel 2: «¿Por qué…?» (solo la pregunta).
3. Scroll. Reel 3: «¿Sabías que…?», con la frase entera antes de seguir.
4. Desliz a la izquierda al perfil; «Seguir»; la cuadrícula sube; abre la portada del reel 1.
5. Comentarios; la cámara se aleja y se ve la mano con el celular; escribe la palabra del CTA; publica.
6. Llegan comentarios iguales y las vistas suben. Cierre: el del creador, con su palabra.

Piezas: `celular.js` (`telefono`, `reel`, `pulgar`, `gesto`, `cargarClips`). Los reels de dentro, de videos ya hechos
(sus fotogramas sin subtítulos: `aprendido.md`, Técnica). Sin interfaz de Instagram sobre los reels.

## Video de producto: «tu proyecto abierto al mundo» (Lotes al Mando, ~40 s)

Para explicar lo que hace la plataforma, con la idea de la marca. Sin cortes bruscos; el mismo mundo dibujado de cielo a
celular:
1. Gancho (2 frases): la lotización vista desde arriba y el globo; un comprador de otro país («país» es la palabra clave).
2. Mapa en el celular del comprador; elige un lote (libres/vendidos en tiempo real).
3. Recorrido virtual: entra a la casa por dentro.
4. Pide la cotización desde el celular.
5. Del otro lado, el tablero del dueño: el cliente llega, el equipo, el cobro.
6. Letrero y mundo final: el proyecto abierto al mundo.
7. Cierre de la marca con su demo gratuita.

Piezas: `celular.js`, `lotizacion.js`, `casa.js` y los logos de `piezas/marca/`. El video entero está en
`proyectos/2026-10-30-tu-proyecto-abierto-al-mundo-comprador-a/` para ver cómo se armó cada plano.

## Video de producto: «todo lo que ofrece» (~45 s)

Para mostrar la plataforma entera, dividida en dos mitades (lo que vende y lo que controla). Ejemplo: Lotes al Mando.
1. Hook (2 frases): la imagen de dron se encoge hasta una tarjeta con el logo; entran las funciones (verde: vender;
   dorado: controlar).
2. La vitrina: el celular con la app y una barra de pestañas que se enciende con cada palabra (mapa, renders,
   recorrido, en vivo); el último cambio, con destello.
3. El control (corte en «detrás»): un cristal se desliza; módulos que se deslizan (inventario, equipo, clientes hasta el cobro).
4. Remate: las dos mitades se juntan en la tarjeta del hook; el logo; «Demo gratuita» late en el CTA.
El proyecto entero (`2026-10-31-todo-lo-que-ofrece-lotes-al-mando/video/planos/`) sirve de modelo: copia los planos y
cambia las palabras.

## Serie «sin vs. con» (partes de ~40 s)

Para comparar lo que pasa sin y con el producto. Ejemplo: «Con y sin Lotes al Mando» (`series/con-y-sin-lotes-al-mando/`).
1. Hook en el mundo «sin»: frío, apagado, luz dura (`cine(g, t, { color: 0.06 })`), con el rótulo «PARTE N DE M».
2. Corte a «con»: amanece, el color pasa a cálido, y la cosa que resuelve (aquí, la ventana pública) se abre.
3. Dentro del producto: toma de dron, ubicación, estados en vivo con destello.
4. El dueño atiende solo lo importante (o «la mañana del dueño»: despierta con la notificación de una solicitud); remate con el producto, el gancho a la siguiente parte («Eso, en la Parte 2») y el cierre.
El proyecto `2026-11-04-serie-con-y-sin-lotes-al-mando-parte-1-l/video/planos/` sirve de modelo.
**El cierre de la serie** (última parte): pantalla partida con los dos finales (`#piezas/pantalla-partida.js`), la misma
situación a cada lado, la diferencia que se enciende en uno, la pregunta «¿Cuál de los dos quieres ser?», las portadas
de todas las partes (`salida/*/flyer.jpg`) y la demo.

## Video de venta: «botón comprar» (~1:30-2:00)

Para la página de venta de un producto o un servicio.

| Parte | Lo que se dice | Lo que se ve |
|---|---|---|
| Gancho | «Es tu momento de aprender a…» (lo que se vende, con lo que más desea quien mira) | Un celular; el pulgar (por fuera) hace scroll por videos distintos con sus vistas subiendo. |
| Lo fácil | los pasos en una frase («le das una idea… y listo») | Lo que se hace, pasando: una ventana de chat, entra la carpeta, se escribe la idea, sale el resultado. |
| Por qué funciona | la razón, en palabras de la calle (la gente se queda hasta el final, lo guarda, lo comparte) | El resultado; barra de progreso, guardar, compartir; un muro de celulares con portadas distintas. |
| Prueba | «Mira estas tres cuentas…» y «Y mira esta: acumula más de N millones» | 3 capturas enteras en abanico (`planos/cuentas.js`); la de más vistas al frente, círculos rojos, la cifra. |
| Para cualquiera | «Imagínate un video así para…» (3 o 4 negocios) | Una calle de negocios; la portada de cada uno (`titulo-portada.js`). |
| Caso real | «¿No me crees? Mira este perfil…» y dónde comprobarlo | La captura (`capturas.js`), zoom y círculo rojo en la cifra; dónde buscarlo. |
| Objeciones | lo que no hace falta (salir en cámara, saber editar, tener seguidores) | Tres cosas tachadas con una X roja. |
| Diferencia | por qué este y no otro, sin insultar a nadie | Lo de otros, apagado y con pocas vistas; se transforma en lo de este; «este video» dentro de un celular. |
| La oferta | qué incluye, en una frase | Lo que se compra, abierto: sus partes, la idea que entra, lo que sale. |
| Urgencia | «Mientras lo piensas…» | Reloj de arena; las vistas se van al celular de otro. |
| CTA | «Dale clic al botón comprar y empieza hoy» | El botón (`boton-comprar.js`, `planos/comprar.js`); el pulgar aprieta en «comprar». |
| Remate | lo sencillo que es, lo que vale, por qué ahora y, en susurro, un secreto que invita a entrar | Los pasos; la etiqueta de precio; el calendario; la oreja y el susurro (`planos/susurro.js`); una puerta y el botón. |

Pedir al creador antes de la voz: las capturas (enteras, con su barra de estado), las cifras que se dicen (con su
captura de prueba), lo que incluye la compra, el CTA y la palabra o el botón del cierre. Decirle al entregar en qué
segundo suena «comprar» (para su página).
