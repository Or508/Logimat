const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); // הוספנו את זה לבדיקות

// טעינת הגדרות
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// =================================================================
// 🔍 דיאגנוסטיקה: בדיקה שהקבצים קיימים (תסתכל בטרמינל אחרי ההפעלה)
// =================================================================
const publicPath = path.join(__dirname, '../public');
console.log("📂 תיקיית האתר:", publicPath);

if (fs.existsSync(publicPath)) {
    console.log("✅ התיקייה קיימת. הקבצים בתוכה:");
    fs.readdirSync(publicPath).forEach(file => {
        console.log("   - " + file);
    });
} else {
    console.error("❌ שגיאה חמורה: השרת לא מוצא את תיקיית public!");
}

// =================================================================
// הגדרת התיקייה הסטטית
// =================================================================
app.use(express.static(publicPath));

// =================================================================
// נתיב ראשי מדויק (בלי כוכבית כדי לא לבלבל את השרת)
// =================================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// =================================================================
// גיבוי: אם הדפדפן לא מוצא קובץ, נחזיר שגיאה אמיתית ולא את דף הבית
// =================================================================
app.use((req, res) => {
    res.status(404).send("File not found: " + req.url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});