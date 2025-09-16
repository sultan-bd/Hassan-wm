// Code.gs File google app script code for google sheet database connection
function doPost(e) {
    // আপনার Google Sheet এর ID এখানে যুক্ত করুন
    var sheet = SpreadsheetApp.openById("1B641lhc69vbtq6RFYN6EmiA6ynLRRx2ZRkndJ4D7kHc").getSheetByName("Database");
    
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
    
    // Telegram এ মেসেজ পাঠান (নতুন ফিচার - এরর হলেও Google Sheet এ ডেটা সেভ হয়ে যাবে)
    try {
        sendTelegramNotification(data);
    } catch (error) {
        console.error("Telegram notification error:", error);
        // এরর হলেও আপনার পুরাতন সিস্টেম বিঘ্নিত হবে না
    }
    
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

// আপনার Telegram Bot Token এবং Channel ID
const TELEGRAM_BOT_TOKEN = "7641485234:AAFsfbRt_REAOs5QBZBWcQYwrwKB99Yq9II";
const TELEGRAM_CHANNEL_ID = "-1002709426567";

// Telegram এ নোটিফিকেশন পাঠানোর ফাংশন
function sendTelegramNotification(data) {
    // বর্তমান সময় পান
    var currentDate = new Date();
    var formattedDate = formatArabicDateTime(currentDate);
    
    // সুন্দর মেসেজ টেমপ্লেট তৈরি করুন
    var message = createTelegramMessage(data, formattedDate);
    
    // Telegram Bot API URL
    var telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // API এর জন্য payload তৈরি করুন
    var payload = {
        'chat_id': TELEGRAM_CHANNEL_ID,
        'text': message,
        'parse_mode': 'HTML',
        'disable_web_page_preview': true
    };
    
    // HTTP POST request পাঠান
    var options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
        },
        'payload': JSON.stringify(payload)
    };
    
    var response = UrlFetchApp.fetch(telegramUrl, options);
    var result = JSON.parse(response.getContentText());
    
    if (result.ok) {
        console.log('✅ Telegram message sent successfully to channel!');
    } else {
        console.error('❌ Telegram API Error:', result.description);
        throw new Error(`Telegram API Error: ${result.description}`);
    }
}

// সুন্দর মেসেজ টেমপ্লেট তৈরি করার ফাংশন
function createTelegramMessage(data, formattedDate) {
    var messageTemplate = `
<b>الاسم:</b> ${data.name || 'غير متوفر'}\n
<b>العمل:</b> ${data.work || 'غير متوفر'}\n
<b>نوع الدفع:</b> ${data.paymentType || 'غير متوفر'}\n
<b>المبلغ:</b> ${data.sar || 'غير متوفر'} ريال\n
<b>التاريخ:</b> ${data.date || 'غير متوفر'}\n
<b>وقت الإرسال:</b> ${formattedDate}\n
    `.trim();
    
    return messageTemplate;
}

// আরবি তারিখ ও সময় ফরম্যাট করার ফাংশন
function formatArabicDateTime(date) {
    var months = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    var day = date.getDate();
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    
    // 12-hour format এ convert করুন
    var timeOfDay = hours >= 12 ? 'مساءً' : 'صباحًا';
    var displayHours = hours % 12;
    displayHours = displayHours ? displayHours : 12; // 0 হলে 12 দেখান
    
    // Minutes এ leading zero যোগ করুন
    var displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${day} ${month} ${year} ${timeOfDay} ${displayHours}:${displayMinutes}`;
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