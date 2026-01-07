const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// טעינת משתני סביבה (הגדרות) - עם נתיב מדויק
dotenv.config({ path: path.join(__dirname, '.env') });

// אתחול שירות AI
const aiService = require('./services/ai.service');
try {
    aiService.initializeAI();
} catch (error) {
    console.warn('⚠️ AI Service not initialized:', error.message);
    console.warn('   (זה בסדר אם עדיין לא הוספת GEMINI_API_KEY)\n');
}

// חיבור למסד הנתונים (הפעלת הקובץ שיצרנו)
require('./config/database');

const app = express();

// --- Middlewares (הגדרות כלליות) ---
app.use(express.json()); // מאפשר לקרוא JSON שנשלח מהלקוח
app.use(cors());         // מאפשר לדפדפן לגשת לשרת

// --- Routes Import (ייבוא המחלקות השונות) ---
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const aiRoutes = require('./routes/ai.routes');
const clientRoutes = require('./routes/client.routes');
const meetingsRoutes = require('./routes/meetings.routes');
const projectsRoutes = require('./routes/projects.routes');

// --- Routing (ניתוב הבקשות) ---
app.use('/api/admin', authRoutes);      // אימות אדמין: /api/admin/login, /api/admin/me
app.use('/api/admin', adminRoutes);     // ניהול אדמין: /api/admin/projects/*
app.use('/api/ai', aiRoutes);           // AI: /api/ai/analyze
app.use('/api/client', clientRoutes);   // לקוחות: /api/client/register, /api/client/check-*
app.use('/api/meetings', meetingsRoutes); // פגישות: /api/meetings/*
app.use('/api/projects', projectsRoutes); // פרויקטים (ציבורי): /api/projects/*

// בדיקת דופק (Health Check)
app.get('/', (req, res) => {
    res.send('Smart Meeting Platform API is Running!');
});

// --- Error Handling ---
const errorMiddleware = require('./middleware/error.middleware');
app.use(errorMiddleware.notFoundHandler); // Routes שלא נמצאו
app.use(errorMiddleware.errorHandler);    // טיפול בשגיאות

// --- הפעלת השרת ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
