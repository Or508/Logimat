require('dotenv').config({ path: './server/.env' });

async function checkAvailableModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("❌ שגיאה: לא נמצא מפתח API בקובץ .env");
        return;
    }

    console.log("📡 יוצר קשר עם השרתים של גוגל...");
    console.log(`🔑 משתמש במפתח שמתחיל ב: ${apiKey.substring(0, 5)}...`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ שגיאה מהשרת:", data.error.message);
        } else if (data.models) {
            console.log("✅ הצלחנו! הנה המודלים שזמינים לך:");
            // מדפיס רק את השמות הנקיים
            data.models.forEach(m => {
                console.log(`   - ${m.name.replace('models/', '')}`);
            });
        } else {
            console.log("⚠️ תגובה מוזרה מהשרת:", data);
        }

    } catch (error) {
        console.error("❌ שגיאת תקשורת:", error.message);
    }
}

checkAvailableModels();