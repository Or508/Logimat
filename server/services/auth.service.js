const dbConfig = require('../config/database');
const db = dbConfig.db;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * שירות אימות - מטפל בכל הלוגיקה של התחברות ומתן טוקנים
 * אחראי על: בדיקת משתמשים, השוואת סיסמאות, יצירת טוקנים
 */

/**
 * בודק פרטי התחברות ומחזיר טוקן אם תקין
 * @param {string} username - שם משתמש
 * @param {string} password - סיסמה (לא מוצפנת)
 * @returns {Promise<{token: string, username: string}>}
 */
exports.loginAdmin = async (username, password) => {
    if (!db) {
        throw new Error('מסד נתונים לא זמין. אנא הגדר חיבור למסד נתונים ב-.env');
    }
    
    // 1. בדיקה אם המשתמש קיים
    const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
    
    if (rows.length === 0) {
        throw new Error('שם משתמש או סיסמה שגויים');
    }

    const admin = rows[0];

    // 2. בדיקת סיסמה (השוואה בין מה שהוקלד למה שמוצפן ב-DB)
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
        throw new Error('שם משתמש או סיסמה שגויים');
    }

    // 3. יצירת טוקן (אישור כניסה)
    const token = jwt.sign(
        { id: admin.id, role: admin.role, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: '4h' }
    );

    return {
        token,
        username: admin.username,
        role: admin.role
    };
};

/**
 * מחזיר פרטי משתמש לפי ID
 * @param {number} userId - מזהה משתמש
 * @returns {Promise<object>}
 */
exports.getUserById = async (userId) => {
    if (!db) {
        throw new Error('מסד נתונים לא זמין. אנא הגדר חיבור למסד נתונים ב-.env');
    }
    
    const [rows] = await db.execute('SELECT id, username, role FROM admins WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
        throw new Error('משתמש לא נמצא');
    }

    return rows[0];
};
