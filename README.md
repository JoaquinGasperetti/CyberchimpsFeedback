# 🐒 CyberChimps Feedback

Encuesta de feedback para **[CyberChimps: Co-op Puzzle](https://play.google.com/store/apps/details?id=com.HKemtrentainment.Cyberchimps)**,
publicada con GitHub Pages. HTML + CSS + JS puro, sin dependencias.

## Estructura

```
index.html        Encuesta de 6 pasos con validación
css/style.css     Tema cyber-jungle (neón verde sobre oscuro)
js/main.js        Wizard, ratings, validación y envío
js/config.js      URL del endpoint que guarda las respuestas
apps-script/      Script + guía para recibir respuestas en una
                  Google Sheet privada (solo las ve el dueño)
assets/           Banner e ícono oficiales del juego
```

## Puesta en marcha

1. **Respuestas privadas** — seguí [apps-script/README.md](apps-script/README.md)
   para crear tu Google Sheet + Web App y pegá la URL en `js/config.js`.
   Hasta entonces el form corre en modo demo (no envía nada).
2. **GitHub Pages** — la rama `gh-pages` se publica automáticamente; la
   encuesta queda en
   `https://joaquingasperetti.github.io/CyberchimpsFeedback/`.
   Después de cada cambio en `main`, actualizala con:

   ```bash
   git push origin main:gh-pages
   ```

   (Si preferís servir directo desde `main`: Settings → Pages → Source →
   `main` / root, y borrá `gh-pages`.)

## Qué mide la encuesta

| Paso | Tema |
|------|------|
| 01 | Perfil: descubrimiento, compañero de juego, sesiones, dispositivo |
| 02 | Multijugador: código de sala, estabilidad, lag/desync, comunicación |
| 03 | Controles: joystick, agarrar/empujar, frustraciones |
| 04 | Puzzles: dificultad, cooperación real, Cyberdatas, timer, vidas |
| 05 | Presentación: gráficos, rendimiento, UI, anuncios |
| 06 | Veredicto: nota 1–10, recomendación, wishlist, bugs, comentarios |
