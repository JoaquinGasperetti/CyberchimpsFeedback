# 🐒 CyberChimps Feedback

Encuesta de feedback para **[CyberChimps: Co-op Puzzle](https://play.google.com/store/apps/details?id=com.HKemtrentainment.Cyberchimps)**,
publicada con GitHub Pages. HTML + CSS + JS puro, sin dependencias ni build.

- **Encuesta:** `index.html` — wizard de 6 pasos con validación
- **Resultados (públicos):** `resultados.html` — resumen con promedios,
  distribuciones y todas las respuestas individuales

## Cómo funciona el almacenamiento

Las respuestas se guardan en un blob público de [jsonblob.com](https://jsonblob.com)
(sin cuentas ni claves). La URL del blob va en `js/config.js`:

```js
const STORE_URL = "https://jsonblob.com/api/jsonBlob/<id>";
```

Cada envío lee el blob, agrega la respuesta y lo vuelve a guardar
(con reintentos). `resultados.html` lee el mismo blob.

> ⚠ Al ser un almacenamiento público y editable, cualquiera con la URL
> podría modificar los datos, y jsonblob borra blobs tras ~30 días sin
> actividad. Para una encuesta casual alcanza; conviene hacer respaldos
> descargando la URL del blob de vez en cuando.

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
