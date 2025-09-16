// Code.gs File google app script code  for google sheet database connection
function doPost(e) {
    // আপনার Google Sheet এর ID এখানে যুক্ত করুন
    var sheet = SpreadsheetApp.openById("1ar4qiPjQpklqcx02wG2V_W8JY-ZwpXy_2XtkY-gVQiM").getSheetByName("Database");
    
    // ফর্ম থেকে পাঠানো ডাটা রিসিভ করুন
    var data = JSON.parse(e.postData.contents);
  
    // Google Sheet-এ নতুন একটি সারি যুক্ত করুন
    sheet.appendRow([
      data.number,
      data.name,
      data.work,
      data.sar,
      data.paymentType,
      data.date
    ]);
  
    // সফল হলে রেসপন্স দিন
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Database'); 
  const nextNumber = getNextNumber(sheet);
  return ContentService.createTextOutput(JSON.stringify({ nextNumber })).setMimeType(ContentService.MimeType.JSON);
}

function getNextNumber(sheet) {
  const lastRow = sheet.getLastRow();
  return lastRow > 0 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;
}


/**
 * ✅ API Routing for Google Sheet
 * 📦 type=balance → Returns total balance from Column D
 * 📦 (default)    → Returns next serial number from Column A
 */

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");

    // ✅ Route: type=balance
    if (e && e.parameter && e.parameter.type === "balance") {
      const range = sheet.getRange("D2:D");
      const values = range.getValues();

      let total = 0;
      for (let i = 0; i < values.length; i++) {
        const val = parseFloat(values[i][0]);
        if (!isNaN(val)) {
          total += val;
        }
      }

      const response = {
        totalBalance: total
      };

      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ✅ Default: Next Number generator (Column A)
    const lastRow = sheet.getLastRow();
    const lastValue = sheet.getRange(lastRow, 1).getValue();
    const nextNumber = parseInt(lastValue) + 1;

    const response = {
      nextNumber: nextNumber
    };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    const errResponse = {
      error: true,
      message: error.message
    };
    return ContentService
      .createTextOutput(JSON.stringify(errResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}