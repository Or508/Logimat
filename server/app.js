const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// טעינת משתני סביבה (הגדרות)
dotenv.config({ path: './server/.env' });
const aiRoutes = require('./routes/ai.routes');



// חיבור למסד הנתונים (הפעלת הקובץ שיצרנו)
require('./models/db');

const app = express();

// --- Middlewares (הגדרות כלליות) ---
app.use(express.json()); // מאפשר לקרוא JSON שנשלח מהלקוח
app.use(cors());         // מאפשר לדפדפן לגשת לשרת
app.use('/api/ai', aiRoutes);
// --- Routes Import (ייבוא המחלקות השונות) ---
// כאן אנחנו "מפצלים" את העומס לקבצים אחרים
const authRoutes = require('./routes/auth.routes');
// בעתיד נוסיף כאן:
// const projectRoutes = require('./routes/projects.routes');
// const meetingRoutes = require('./routes/meetings.routes');

// --- Routing (ניתוב הבקשות) ---
// כל בקשה שמתחילה ב-/api/admin תלך לקובץ auth.routes
app.use('/api/admin', authRoutes); 

// בדיקת דופק (Health Check)
app.get('/', (req, res) => {
    res.send('Smart Meeting Platform API is Running!');
});

// --- הפעלת השרת ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});