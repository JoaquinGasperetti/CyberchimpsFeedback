/**
 * CyberChimps Feedback — receptor de respuestas.
 *
 * Este script corre como Web App de Google Apps Script y guarda cada
 * respuesta de la encuesta como una fila en una Google Sheet PRIVADA
 * (solo la ve el dueño de la cuenta que lo deploya).
 *
 * Instrucciones completas en apps-script/README.md del repo.
 */

// Orden fijo de columnas en la hoja (coincide con los "name" del form)
var FIELDS = [
  "descubrimiento",
  "companero",
  "partidas",
  "dispositivo",
  "facilidad_codigo",
  "estabilidad",
  "problemas_red",
  "comunicacion",
  "joystick",
  "interaccion",
  "problema_controles",
  "dificultad",
  "cooperacion",
  "cyberdatas",
  "timer",
  "vidas",
  "graficos",
  "rendimiento",
  "ui",
  "anuncios",
  "puntuacion",
  "recomendacion",
  "futuro",
  "bugs",
  "sugerencias",
  "contacto",
  "idioma",
  "pantalla"
];

var SHEET_NAME = "Respuestas";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // encabezados la primera vez
    if (sheet.getLastRow() === 0) {
      var headers = ["fecha"].concat(FIELDS);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#1e9e4e")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    var row = [new Date()];
    for (var i = 0; i < FIELDS.length; i++) {
      var v = data[FIELDS[i]];
      row.push(v === undefined || v === null ? "" : String(v).slice(0, 5000));
    }
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET de cortesía para probar que el deploy está vivo desde el navegador
function doGet() {
  return ContentService
    .createTextOutput("CyberChimps feedback endpoint OK 🐒")
    .setMimeType(ContentService.MimeType.TEXT);
}
