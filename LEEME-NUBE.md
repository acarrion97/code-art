# CODE ART en otro dispositivo

Esta es la copia en la nube de las **funciones** de CODE ART (motor, guías, packs, piezas, sonidos, letras, ejemplos y
preferencias). No lleva tu clave de voz ni los videos ya hechos (`proyectos/` y `salida/` quedan vacíos).

## Para usarla en otro ordenador
1. Clona el repositorio (privado) y abre la carpeta con Claude Code o Codex.
2. Di «Iniciar»: instala Node, ffmpeg y `npm install`, y vuelve a pasar `doctor`.
3. Pega tu clave de ElevenLabs en `PEGA-AQUI-TU-CLAVE-ELEVENLABS.txt` (crea el archivo con `CLAVE=` y tu clave; no se sube).
4. Pídele un video como siempre.

Para traer cambios nuevos: `git pull`. Para subir lo aprendido (`aprendido.md`, `piezas/`, `preferencias.md`):
`git add -A && git commit -m "..." && git push`. Los videos hechos viven solo en el ordenador donde se hicieron.
