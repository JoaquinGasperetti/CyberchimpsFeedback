# Conectar la encuesta a Google Sheets (respuestas seguras, resultados públicos)

Las respuestas se guardan en una Google Sheet **de tu cuenta** — nadie puede
borrarlas ni editarlas desde afuera. El mismo Web App expone las respuestas
como JSON público, que es lo que muestra `resultados.html`.

Son ~5 minutos, una sola vez:

## 1. Crear la Sheet

1. Entrá a [sheets.new](https://sheets.new) con tu cuenta de Google.
2. Nombrala como quieras, p. ej. **CyberChimps Feedback**.

## 2. Pegar el script

1. En la Sheet: **Extensiones → Apps Script**.
2. Borrá el contenido de `Code.gs` y pegá el contenido de
   [`Code.gs`](Code.gs) de esta carpeta.
3. Guardá (Ctrl+S).

## 3. Deployar como Web App

1. Arriba a la derecha: **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web** (engranaje ⚙ → Aplicación web).
3. Configuración:
   - **Ejecutar como:** *Yo* (tu cuenta)
   - **Quién tiene acceso:** *Cualquier usuario* ← necesario para que
     el formulario pueda enviar y resultados.html pueda leer.
4. **Implementar** y autorizá los permisos cuando lo pida. Si Google
   muestra "app no verificada": **Configuración avanzada → Ir a … (no
   seguro)** — es tu propio script, no hay riesgo.
5. Copiá la **URL de la aplicación web** (termina en `/exec`).

## 4. Configurar el formulario

En [`js/config.js`](../js/config.js) pegá la URL:

```js
const SURVEY_ENDPOINT = "https://script.google.com/macros/s/XXXXX/exec";
```

Commit + push (y `git push origin main:gh-pages`). Listo.

## Probar que funciona

- Abrí la URL `/exec` en el navegador: tenés que ver `{"respuestas":[]}`.
- Mandá una respuesta desde el formulario publicado: aparece como fila
  en la Sheet y en resultados.html.

## Si editás el script después

Cada cambio requiere **Implementar → Administrar implementaciones →
✏ Editar → Versión: Nueva versión → Implementar** (la URL no cambia).
