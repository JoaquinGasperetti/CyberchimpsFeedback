# 🐒 CyberChimps Feedback

Encuesta de feedback para **[CyberChimps: Co-op Puzzle](https://play.google.com/store/apps/details?id=com.HKemtrentainment.Cyberchimps)**,
publicada con GitHub Pages. HTML + CSS + JS puro, sin dependencias ni build.

- **Encuesta:** `index.html` — wizard de 6 pasos con validación
- **Resultados (públicos):** `resultados.html` — resumen con promedios,
  distribuciones y todas las respuestas individuales

## Cómo funciona el almacenamiento

Las respuestas se guardan en una Google Sheet vía un Web App de Google
Apps Script (guía completa en [apps-script/README.md](apps-script/README.md)).
La URL del deploy va en `js/config.js`:

```js
const SURVEY_ENDPOINT = "https://script.google.com/macros/s/XXXXX/exec";
```

- `POST` al endpoint agrega una fila a la Sheet (el formulario).
- `GET` al endpoint devuelve todas las respuestas como JSON público
  (lo que consume `resultados.html`).

Nadie puede editar ni borrar respuestas desde afuera: la Sheet solo la
maneja el dueño de la cuenta que hizo el deploy.

## GitHub Pages

La rama `gh-pages` es la publicada. Después de cada cambio en `main`:

```bash
git push origin main:gh-pages
```

URL: `https://joaquingasperetti.github.io/CyberchimpsFeedback/`

## Qué mide la encuesta

| Paso | Tema |
|------|------|
| 01 | Perfil: descubrimiento, compañero de juego, sesiones, dispositivo |
| 02 | Multijugador: código de sala, estabilidad, lag/desync, comunicación |
| 03 | Controles: joystick, agarrar/empujar, frustraciones |
| 04 | Puzzles: dificultad, cooperación real, Cyberdatas, timer, vidas |
| 05 | Presentación: gráficos, rendimiento, UI, anuncios |
| 06 | Veredicto: nota 1–10, recomendación, wishlist, bugs, comentarios |
