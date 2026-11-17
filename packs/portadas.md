# Generador de portadas (flyers)

Se usa cuando el creador dice algo como «hazme la portada», «hazme el flyer», «portadas para mis videos», «cambia la
portada», «otra portada», y **siempre en cada vídeo, sin preguntar**: se prepara mientras el creador mira el borrador
completo (`METODO.md`, paso 6) y se entrega con el render final (paso 7). Todo vídeo se entrega con su flyer.

Lo que sale, por cada vídeo: un flyer de 1080 × 1920 clickbait pero honesto, sobre un momento del propio vídeo, dentro
de las zonas seguras de TikTok, Reels, Shorts y la cuadrícula del perfil. La herramienta es `node motor/portada.mjs`
(`--ayuda` para todo). Dibuja el fotograma **sin subtítulos**: no hay nada que tapar.

## El look

Mira las tres portadas de `packs/portadas-ejemplos/` antes de hacer la primera: ese es el nivel. Una línea blanca
arriba, **la palabra clave enorme, en mayúsculas y en color, con sombra sólida**, otra línea blanca debajo, sobre una
banda oscura que se funde con la imagen, y una etiqueta amarilla inclinada que remata la curiosidad. Es el estilo
**impacto** (el de siempre).

## 1. La marca (solo la primera vez)

Si `preferencias.md` aún no tiene su apartado `## Portadas` (normalmente se contesta al «Iniciar»), pregunta en un solo
mensaje corto (lo que ya diga `preferencias.md` no se pregunta; `marca.json` viene con el rojo de CODE ART, que vale
mientras no diga otro color):
1. **El color de su marca.** Es lo único que cambia: va en la palabra clave (la que en los ejemplos sale en rojo). Si
   no tiene, se queda el rojo de CODE ART (#FF3B30). Si sube su logo o una portada suya, saca el color de ahí y confírmalo.
   El fondo oscuro, el texto blanco y la etiqueta amarilla no se cambian: son los que garantizan que todo se lea.
2. **¿Quiere probar los otros estilos?** Por defecto impacto. Si quiere ver opciones, hazle una portada de prueba en
   cada uno con un vídeo suyo (o con `ejemplo/alcohol`):
   - **impacto:** el de los ejemplos.
   - **limpio:** la imagen casi entera; el título en una tarjeta clara redondeada, con la clave en su color.
   - **bloque:** un bloque oscuro arriba cortado en diagonal, la clave sobre una caja de su color.
3. **¿Su nombre o su @ en el flyer?** Por defecto no: el flyer vende el tema, no la marca.

Guárdalo en `marca.json` (y una línea en `preferencias.md`):

```json
{"acento": "#FF3B30", "estilo": "impacto"}
```

**Contraste.** La herramienta mide el contraste del color de la marca con lo que tiene detrás (mínimo 4,5:1, el de
WCAG). Si no llega (un azul marino o un morado oscuro sobre la banda oscura), lo aclara lo justo manteniendo el tono y
avisa: «Uso #6E82DA, el más parecido que se lee bien». Díselo al creador en una línea, y si prefiere otro tono,
pruébalo. Si su color se confunde con la etiqueta amarilla, la etiqueta pasa a blanca sola. Nunca saltes el aviso
poniendo un color que no se lee: una portada que no se lee no se toca.

Si luego dice «a partir de ahora...» o corrige lo mismo dos veces, actualiza `marca.json`.

## 2. Entender el vídeo

Lee su `guion.json` e `idea.md`. Lo que promete el flyer tiene que pasar de verdad en el vídeo. Usa solo
datos del vídeo: no inventes cifras.

Elige 3 momentos donde **la cosa del gancho** se ve grande y clara (no transiciones a medias ni pantallas vacías):
`node motor/ver.mjs <proyecto> planos` y mira la hoja.

## 3. El texto

- **El título:** de 3 a 9 palabras, en dos o tres líneas, que se entienda solo. Clickbait honesto: contradice lo que la
  gente cree, plantea un misterio o una cifra que sorprende, y el vídeo lo cumple. Nunca algo falso.
- **La palabra o frase clave** *entre asteriscos*: va enorme, en mayúsculas y en el color de la marca. Mejor una o dos
  palabras cortas («NADA», «SIN CABEZA», «NO EXISTE»): es la que hace parar el dedo.
- **La etiqueta** (opcional, de 2 a 6 palabras, «|» para partirla en dos líneas): remata la curiosidad sin dar la
  respuesta («Spoiler: no es lo que crees», «y nadie te lo dijo»). Si taparía lo importante, no la pongas.

## 4. Hacerlo

```
node motor/portada.mjs <proyecto> --titulo "Tu tuerca *se afloja* sola" --segundos 2.1,9.5,17 --etiqueta "aunque la aprietes|con todas tus fuerzas"
```

- `--dy 200` baja la imagen si lo importante queda detrás del título (lo importante, entre y 750 y 1450).
- `--acento "#hex"` cambia el color de la clave solo para esta portada (si el creador prefiere otro color para un
  vídeo concreto).

## 5. Revisar antes de enseñarlo

Mira `portadas/rejilla.jpg` y cada `portada-N-zonas.jpg`:
- **Verde:** libre de botones y textos de TikTok, Reels y Shorts. **Amarillo:** el recorte 3:4 de la cuadrícula del
  perfil. El título y la etiqueta van dentro de los dos.
- Todo se lee de un vistazo en el móvil (míralo pequeño, en la rejilla). Ninguna palabra se corta; la etiqueta no tapa lo importante; lo que promete pasa en el vídeo.
- Arregla y repite hasta que esté bien. Los `-zonas.jpg` son solo para revisar.

## 6. Entregar

Elige tú la mejor de las 3 (la que mejor se lee pequeña, con lo importante bien visible y que más ganas da de tocar) y
cópiala como `salida/<proyecto>/flyer.jpg`. Enséñale el flyer (y `rejilla.jpg` por si prefiere otra: si elige otra, se
copia esa). Si dice «otra portada», haz 3 nuevas con otro título o etiqueta. `flyer.jpg` es la única miniatura que se
entrega. Luego, las descripciones (`packs/captions.md`): van siempre con el vídeo.

## Estilo «capitulo» (Lotes al Mando)
`marca.json` lo tiene por defecto. `node motor/portada.mjs <proyecto> --titulo "La ventana pública de tu *proyecto*" --capitulo 1 --subtitulo "Disponible aunque no estés"`: letra Anton, píldora verde «CAPÍTULO N», subtítulo entre líneas doradas y banda blanca con el logo. Referencias en `piezas/marca/referencia-portadas/`. Los subtítulos de los videos también usan Anton, en mayúsculas, con la palabra clave en verde.
