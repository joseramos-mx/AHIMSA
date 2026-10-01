# Hero media

Pon aquí los archivos que usa el hero:

- `hero.mp4` — video principal (fallback universal)
- `hero.webm` — video optimizado para navegadores modernos
- `hero.jpg` — poster/imagen fija de fallback. Es la que carga primero y define el LCP, así que debe estar siempre.

Recomendaciones:

- Resolución: 1920×1080 o 2560×1440.
- Duración: 8–15 s en loop, sin cortes bruscos.
- Peso objetivo: `.mp4` < 2.5 MB, `.webm` < 1.8 MB.
- Sin audio (el video entra `muted`).
- `hero.jpg` ~ 150–250 KB, formato JPG o WebP optimizado.

Si no vas a usar video todavía, abre `components/Hero.tsx` y cambia la
constante `USE_VIDEO_BG` a `false`. Con eso el hero usa sólo `hero.jpg`
vía `next/image`.
