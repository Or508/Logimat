const mysql = require('mysql2');
require('dotenv').config({ path: './server/.env' }); // טוען את המשתנים

// יצירת "בריכת" חיבורים (יעיל יותר מחיבור יחיד)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // אם יש לך סיסמה ב-Workbench, שים אותה ב-.env
    database: 'smart_meeting_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// בדיקת חיבור פשוטה שתופיע בטרמינל
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database successfully!');
        connection.release();
    }
});

module.exports = promisePool;