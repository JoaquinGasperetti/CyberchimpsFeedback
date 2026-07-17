/**
 * CyberChimps Feedback — receptor y lector de respuestas.
 *
 * Web App de Google Apps Script:
 *  - doPost: guarda cada respuesta como una fila en la Sheet (solo append,
 *    nadie puede borrar ni editar lo guardado desde afuera).
 *  - doGet:  devuelve todas las respuestas como JSON público, que es lo
 *    que lee resultados.html para mostrar las estadísticas.
 *
 * Instrucciones de deploy en apps-script/README.md del repo.
 */

// Orden fijo de columnas (coincide con los "name" del formulario)
var FIELDS = [
  "apodo",
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
  "idioma",
  "pantalla"
];

var SHEET_NAME = "Respuestas";

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    // lock para que dos requests simultáneos no dupliquen los encabezados
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (sheet.getLastRow() === 0) {
        var headers = ["fecha"].concat(FIELDS);
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length)
          .setFontWeight("bold")
          .setBackground("#1e9e4e")
          .setFontColor("#ffffff");
        sheet.setFrozenRows(1);
      }
    } finally {
      lock.releaseLock();
    }
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var row = [new Date().toISOString()];
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

function doGet() {
  try {
    var sheet = getSheet_();
    var values = sheet.getDataRange().getValues();
    var headers = values.length ? values[0] : [];
    var respuestas = [];

    for (var r = 1; r < values.length; r++) {
      if (values[r][0] === "fecha") continue; // fila de encabezados duplicada
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        var v = values[r][c];
        if (v !== "" && v !== null && v !== undefined) obj[headers[c]] = String(v);
      }
      respuestas.push(obj);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ respuestas: respuestas }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ respuestas: [], error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
