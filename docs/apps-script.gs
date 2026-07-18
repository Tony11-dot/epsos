/**
 * Epsos — registration → Google Sheets webhook
 * ---------------------------------------------------------------------------
 * This is a Google Apps Script Web App that receives a POST from the site's
 * registration form and appends one row to the spreadsheet.
 *
 * SETUP (one time, ~2 minutes):
 *  1. Open the target sheet:
 *     https://docs.google.com/spreadsheets/d/1U3N1ovsUdtTDRCiRXt1q2gD23Y-CnOpD-D3WnhNuyQI/edit
 *  2. Extensions → Apps Script. Delete any sample code, paste ALL of this file.
 *  3. Click Deploy → New deployment → type: "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Deploy, authorize, and COPY the "Web app URL".
 *  4. Put that URL in the site env as SHEETS_WEBHOOK_URL (see .env.example),
 *     then redeploy / restart the site. Done — submissions now land here.
 *
 * The first submission auto-creates the header row.
 */

var SHEET_ID = "1U3N1ovsUdtTDRCiRXt1q2gD23Y-CnOpD-D3WnhNuyQI";
var TAB_NAME = "التسجيلات"; // created automatically if missing
// Column headers mirror the website's registration form labels (+ timestamp & division).
var HEADERS = ["طابع زمني", "القسم", "الاسم الشخصي", "اسم العائلة", "رقم الهاتف", "المدينة", "البريد الإلكتروني", "الدورة المهتمّ بها"];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var when = data.submittedAt ? new Date(data.submittedAt) : new Date();
    sheet.appendRow([
      when,
      data.division || "إبسوس",
      data.firstName || "",
      data.lastName || "",
      "'" + (data.phone || ""), // leading quote keeps long numbers as text
      data.city || "",
      data.email || "",
      data.course || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you open the Web App URL in a browser to confirm it's live.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "epsos-registrations" }))
    .setMimeType(ContentService.MimeType.JSON);
}
