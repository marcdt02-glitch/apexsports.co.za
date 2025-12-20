/**
 * APEX Sports - Trial Lead Automation
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet ("APEX_Trial_Leads").
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code there and paste THIS code.
 * 4. Save the project (e.g., "ApexAutomation").
 * 5. Click the clock icon (Triggers) on the left sidebar.
 * 6. Add Trigger:
 *    - Function: onFormSubmit
 *    - Event Source: From spreadsheet
 *    - Event Type: On form submit
 * 7. Save and authorize permissions.
 */

function onFormSubmit(e) {
    // 1. Get the Spreadsheet and active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1"); // Verify sheet name!
    var range = e.range;
    var row = range.getRow();

    // 2. Identify Column Indices
    // e.namedValues gives an object with header names.
    var responses = e.namedValues;

    // Helper to safely get value by potential header names
    // Adjust these strings to MATCH EXACTLY your Google Form Question Titles
    var programChoice = responses['Program Choice'] ? responses['Program Choice'][0] : "";
    if (!programChoice && responses['Which program are you interested in?']) {
        programChoice = responses['Which program are you interested in?'][0];
    }

    // 3. Conditional Logic (The Router)
    var tag = "General_Trial";
    if (programChoice && programChoice.toString().toLowerCase().indexOf("strength") > -1) {
        tag = "Strength_Trial";
    } else if (programChoice && programChoice.toString().toLowerCase().indexOf("speed") > -1) {
        tag = "Speed_Trial";
    } else if (programChoice && (programChoice.toString().toLowerCase().indexOf("keeper") > -1 || programChoice.toString().toLowerCase().indexOf("goalkeeper") > -1)) {
        tag = "Goalkeeper_Trial";
    }

    // 4. Write Data to new columns "Tag" and "VALD_Status"

    // Get headers to find column indices
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var tagColIndex = headers.indexOf("Tag") + 1;
    var valdColIndex = headers.indexOf("VALD_Status") + 1;

    // On first run, if columns don't exist, this might fail unless manually added.
    // We assume columns "Tag" and "VALD_Status" exist as per instructions.
    // If not, we append.

    if (tagColIndex === 0) {
        tagColIndex = headers.length + 1;
        sheet.getRange(1, tagColIndex).setValue("Tag");
    }

    // Re-fetch headers if we added one (brute force approach: just increment if we know we added)
    // Cleaner to just reuse logic:
    if (valdColIndex === 0) {
        var lastCol = tagColIndex > headers.length ? tagColIndex : headers.length;
        valdColIndex = lastCol + 1;
        sheet.getRange(1, valdColIndex).setValue("VALD_Status");
    }

    // Set values
    sheet.getRange(row, tagColIndex).setValue(tag);
    sheet.getRange(row, valdColIndex).setValue("Pending");

    Logger.log("Processed Row " + row + ": Tag=" + tag);
}
