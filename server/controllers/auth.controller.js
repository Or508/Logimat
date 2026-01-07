const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. בדיקה אם המשתמש קיים
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
        }

        const admin = rows[0];

        // 2. בדיקת סיסמה (השוואה בין מה שהוקלד למה שמוצפן ב-DB)
        const isMatch = await bcrypt.compare(password, admin.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
        }

        // 3. יצירת טוקן (אישור כניסה)
        const token = jwt.sign(
            { id: admin.id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '4h' } // הטוקן בתוקף ל-4 שעות
        );

        res.json({
            message: 'התחברת בהצלחה!',
            token: token,
            username: admin.username
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'שגיאת שרת פנימית' });
    }
};