const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './server/.env' });

async function listModels() {
    console.log("🔍 בודק מודלים זמינים...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // טריק: אנחנו מבקשים את המודל הבסיסי רק כדי לקבל גישה לאובייקט
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        console.log("✅ החיבור הצליח! המודל gemini-pro זמין.");
        console.log("🎉 הכל תקין, אפשר להשתמש ב-'gemini-pro' בקוד שלך.");
    } catch (error) {
        console.error("❌ שגיאה:", error.message);
        console.log("נסה להריץ שוב: npm install @google/generative-ai@latest");
    }
}

listModels();