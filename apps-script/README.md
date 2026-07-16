# Conectar la encuesta a tu Google Sheet privada

Las respuestas se guardan en una Google Sheet **de tu cuenta**: nadie más
puede verlas (la Sheet queda privada como cualquier documento tuyo de Drive).
El formulario solo tiene permiso para *agregar* filas a través del Web App,
nunca para leerlas.

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
   - **Quién tiene acceso:** *Cualquier usuario* ← necesario para que el
     formulario público pueda enviar; solo permite ejecutar `doPost`,
     no ver la Sheet.
4. **Implementar** y autorizá los permisos cuando lo pida
   (avanzado → ir al proyecto si Google muestra la advertencia de
   "app no verificada": es tu propio script).
5. Copiá la **URL de la aplicación web** (termina en `/exec`).

## 4. Configurar el formulario

1. En este repo, abrí [`js/config.js`](../js/config.js).
2. Pegá la URL:

   ```js
   const SURVEY_ENDPOINT = "https://script.google.com/macros/s/XXXXX/exec";
   ```

3. Commit + push. Listo: cada envío aparece como una fila nueva en la
   pestaña **Respuestas** de tu Sheet, con fecha y hora.

## Probar que funciona

- Abrí la URL `/exec` en el navegador: tenés que ver
  `CyberChimps feedback endpoint OK 🐒`.
- Mandá una respuesta de prueba desde el formulario publicado y revisá
  la Sheet.

## Si editás el script después

Cada cambio requiere **Implementar → Administrar implementaciones →
✏ Editar → Versión: Nueva versión → Implementar** (la URL no cambia).
