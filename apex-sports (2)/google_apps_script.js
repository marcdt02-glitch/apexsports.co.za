

// ==========================================
// 1. API API ENDPOINT (Handle GET Requests)
// ==========================================
function doGet(e) {
    // 1. Extract Parameters
    var email = e.parameter.email;
    var id = e.parameter.id;

    // 2. Validation
    if (!email && !id) {
        return errorResponse('Missing email or id parameter');
    }

    // 3. Open Sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Athlete Data");
    if (!sheet) {
        // Debugging: List available sheets
        var allSheets = SpreadsheetApp.getActiveSpreadsheet().getSheets().map(function (s) { return s.getName(); });
        return errorResponse('Sheet "Athlete Data" not found. Available sheets: ' + allSheets.join(", "));
    }

    // 4. Search for Athlete
    var data = sheet.getDataRange().getValues();
    if (data.length === 0) return errorResponse("Sheet is empty");

    var headers = data[0];
    var athlete = null;

    // Debugging: Check for Email column
    var emailIndex = headers.findIndex(function (h) { return h.toString().toLowerCase().trim() === 'email'; });
    var idIndex = headers.findIndex(function (h) { return h.toString().toLowerCase().trim() === 'athlete id'; });

    if (emailIndex === -1 && idIndex === -1) {
        return errorResponse("Columns 'Email' or 'Athlete ID' not found in headers: " + headers.join(", "));
    }

    for (var i = 1; i < data.length; i++) {
        var row = data[i];

        // Create a temporary object for this row
        var rowObj = {};
        for (var j = 0; j < headers.length; j++) {
            rowObj[headers[j]] = row[j];
        }

        // Check if Email or ID matches (Case Insensitive)
        if (normalize(rowObj['Email']) === normalize(email) ||
            normalize(rowObj['Athlete ID']) === normalize(id)) {
            athlete = rowObj;
            break;
        }
    }

    // 5. Return Result
    if (athlete) {
        // Dynamic Mapping: Return all sheet columns as JSON keys
        var mappedData = {};

        for (var k = 0; k < headers.length; k++) {
            var headerName = headers[k].toString().trim();
            if (headerName) {
                mappedData[headerName] = athlete[headerName];
            }
        }

        // Add Metadata keys (standardized for Frontend)
        mappedData['_id'] = athlete['Athlete ID'] || 'generated-' + i;
        mappedData['_name'] = athlete['Athlete Name'] || athlete['Name'];
        mapped['_email'] = athlete['Email'];

        return successResponse(mappedData);

    } else {
        return errorResponse('Athlete not found');
    }
}

// ==========================================
// 2. AUTOMATION TRIGGERS (Auto-Timestamp)
// ==========================================
function onEdit(e) {
    var sheet = e.source.getActiveSheet();

    // Only target the 'Athlete Data' sheet
    if (sheet.getName() !== "Athlete Data") return;

    var range = e.range;
    var col = range.getColumn();
    var row = range.getRow();

    // Ignore Header Row
    if (row === 1) return;

    // Find "Last Updated" column dynamically
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var updateColIndex = headers.indexOf("Last Updated") + 1;

    // Safety Checks
    if (updateColIndex === 0) return; // Column doesn't exist
    if (col === updateColIndex) return; // Prevent infinite loop if we are editing the date itself

    // Set the Timestamp
    var date = new Date();
    var formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "dd MMM yyyy");
    sheet.getRange(row, updateColIndex).setValue(formattedDate);
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function normalize(str) {
    return str ? str.toString().toLowerCase().trim() : "";
}

function successResponse(data) {
    return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        athlete: data
    })).setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(message) {
    return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: message
    })).setMimeType(ContentService.MimeType.JSON);
}
