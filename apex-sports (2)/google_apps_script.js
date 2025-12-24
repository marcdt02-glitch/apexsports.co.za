// VERSION: v16.2 (Data Sync Update)
function doGet(e) {
    try {
        var email = e.parameter.email;
        var pin = e.parameter.pin; // The new security key
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Athlete Data");

        // 1. Health Check
        if (!email || !sheet) return res({ status: "error", message: "APEX Engine Ready. Missing 'email' parameter." });

        // 2. Fetch Data
        var data = sheet.getDataRange().getValues();
        if (!data || data.length === 0) return res({ status: "error", message: "Sheet is empty." });

        var headers = data[0];
        // Safe Header Find
        var emailIdx = headers.findIndex(function (h) { return String(h).toLowerCase().trim() === "email"; });
        var pinIdx = headers.findIndex(function (h) { return String(h).toLowerCase().trim() === "passcode"; });

        if (emailIdx === -1) return res({ status: "error", message: "Checking Sheet: No 'Email' column found." });

        // 3. Search for Athlete
        var athleteRow = null;
        for (var i = 1; i < data.length; i++) {
            // Safe String Conversion
            var cellVal = data[i][emailIdx];
            if (cellVal === null || cellVal === undefined) continue;

            var rowEmail = String(cellVal).toLowerCase().trim();
            // Safe Check vs Input Email
            if (email && rowEmail === String(email).toLowerCase().trim()) {
                athleteRow = data[i];
                break;
            }
        }

        // 4. Validate & Return
        if (athleteRow) {
            // PASSCODE CHECK
            if (pinIdx !== -1) {
                var pinCell = athleteRow[pinIdx];
                var storedPin = (pinCell === null || pinCell === undefined) ? "" : String(pinCell).trim();

                // Strict Check
                if (storedPin !== "" && storedPin !== pin) {
                    return res({ status: "security_error", message: "Invalid Passcode." });
                }
            }

            // Map Data
            var athleteData = {};
            headers.forEach(function (h, idx) {
                if (h !== null && h !== undefined && String(h).trim() !== "") {
                    var key = String(h).trim();
                    var val = athleteRow[idx];
                    athleteData[key] = (val === null || val === undefined) ? "" : val;
                }
            });

            // Logic Keys (Normalize for Frontend)
            athleteData["consent"] = athleteData["Parent Consent"];
            athleteData["readiness_score"] = athleteData["Readiness Score (%)"];
            athleteData["groin_time"] = athleteData["Groin Time to Max (s)"];

            // v19.0: Tier Logic & Access Control
            var tier = (athleteData["Product Tier"] || athleteData["Package"] || "").toString().toLowerCase();
            var isApex = tier.indexOf("apex membership") !== -1 || tier.indexOf("elite") !== -1 || tier.indexOf("testing s&c") !== -1 || email === 'admin@apexsports.co.za';
            var isMentorship = tier.indexOf("mentorship") !== -1;

            var access = {
                tier: tier,
                isFullAccess: isApex,
                showMentorship: isApex || isMentorship,
                showReports: isApex,
                showStrengthDials: isApex, // Locked for Camp
                showWellnessHistory: isApex
            };

            // v19.0: Fetch History (Last 10 Logs)
            var history = [];
            try {
                var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logs");
                if (logSheet) {
                    var logData = logSheet.getDataRange().getValues();
                    var logHeaders = logData[0];
                    var logEmailIdx = logHeaders.findIndex(function (h) { return String(h).toLowerCase().trim() === "email"; });

                    if (logEmailIdx !== -1) {
                        // Filter logs for this athlete
                        var athleteLogs = logData.slice(1).filter(function (row) {
                            return String(row[logEmailIdx]).toLowerCase().trim() === email.toLowerCase().trim();
                        });
                        // Take last 10, newest first
                        history = athleteLogs.slice(-10).reverse().map(function (row) {
                            // Map relevant history columns (adjust keys as needed based on actual Log sheet)
                            // Assuming similar structure or key metrics
                            return {
                                date: row[0], // Assuming Date is first
                                readiness: row[logHeaders.indexOf("Readiness Score (%)")] || 0,
                                soreness: row[logHeaders.indexOf("Soreness Score")] || 0,
                                sleep: row[logHeaders.indexOf("Sleep Score")] || 0
                            };
                        });
                    }
                }
            } catch (e) {
                // Ignore history errors, return empty array
            }

            return res({ status: "success", athlete: athleteData, access: access, history: history });
        }

        return res({ status: "error", message: "Athlete not found." });

    } catch (err) {
        return res({ status: "error", message: "System Error: " + String(err) + " Stack: " + String(err.stack) });
    }
}

function res(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function onEdit(e) {
    var sheet = e.source.getActiveSheet();
    var r = e.range;

    // Guard Clauses
    if (sheet.getName() !== "Athlete Data") return;
    if (r.getRow() === 1) return; // Header row

    // Find 'Last Updated' Column
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var updateCol = headers.indexOf("Last Updated") + 1;

    // Update Timestamp (if column exists and we aren't editing it)
    if (updateCol > 0 && r.getColumn() !== updateCol) {
        sheet.getRange(r.getRow(), updateCol).setValue(Utilities.formatDate(new Date(), "GMT+2", "dd MMM yyyy"));
    }
}
