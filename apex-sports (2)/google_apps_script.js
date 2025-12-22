/**
 * APEX Sports - Backend Automation
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet > Extensions > Apps Script.
 * 2. Paste this code, overwriting everything.
 * 3. Save.
 * 4. Deploy > New Deployment > Type: Web App > Execute as: Me > Who has access: Anyone.
 * 5. Copy the Web App URL and provide it to the Developer if changed.
 */

// ----------------------------------------------------
// 1. API Endpoint (GET Request)
// ----------------------------------------------------
function doGet(e) {
    var email = e.parameter.email;
    var id = e.parameter.id;

    // Return Error if no search term
    if (!email && !id) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Missing email or id parameter'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Athlete Data"); // Ensure Sheet Name matches!
    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Sheet "Athlete Data" not found'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var athlete = null;

    // Helper to normalize strings for comparison
    var normalize = function (str) { return str ? str.toString().toLowerCase().trim() : ""; };

    // Find Athlete
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var rowObj = {};

        // Map row to object based on headers
        for (var j = 0; j < headers.length; j++) {
            rowObj[headers[j]] = row[j];
        }

        // Check match
        if (normalize(rowObj['Email']) === normalize(email) || normalize(rowObj['Athlete ID']) === normalize(id)) {
            athlete = rowObj;
            break;
        }
    }

    if (athlete) {
        // Basic Mapping to standardize keys (optional, but helpful for frontend)
        // Dynamic Mapping for v8.0 (Returns all columns as keys)
        var mapped = {};
        for (var k = 0; k < headers.length; k++) {
            var header = headers[k].toString().trim();
            if (header) {
                mapped[header] = athlete[header];
            }
        }

        // Add standardized metadata
        mapped['_id'] = athlete['Athlete ID'] || 'generated-' + i;
        mapped['_name'] = athlete['Athlete Name'] || athlete['Name'];
        mapped['_email'] = athlete['Email'];

        return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            athlete: mapped
        })).setMimeType(ContentService.MimeType.JSON);

        return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            athlete: mapped
        })).setMimeType(ContentService.MimeType.JSON);

    } else {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Athlete not found'
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// ----------------------------------------------------
// 2. Auto-Timestamp (onEdit Trigger)
// ----------------------------------------------------
function onEdit(e) {
    var sheet = e.source.getActiveSheet();

    // Only run on 'Athlete Data' sheet
    if (sheet.getName() !== "Athlete Data") return;

    var range = e.range;
    var col = range.getColumn();
    var row = range.getRow();

    // Skip header row
    if (row === 1) return;

    // Get 'Last Updated' column index
    // We assume it's a specific column, or we find it.
    // Converting header finding to caching might be faster, but this is safer:
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var updateColIndex = headers.indexOf("Last Updated") + 1;

    // If column doesn't exist, Create it? Or exit?
    // Let's protect against infinite loops (if we edit the Last Updated col itself)
    if (updateColIndex === 0) return; // Column not found
    if (col === updateColIndex) return; // Don't trigger on own update

    // Set Date
    var date = new Date();
    var formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "dd MMM yyyy");

    sheet.getRange(row, updateColIndex).setValue(formattedDate);
}
