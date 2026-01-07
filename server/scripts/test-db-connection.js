/**
 * סקריפט לבדיקת חיבור למסד נתונים
 * הרץ: node server/scripts/test-db-connection.js
 */

require('dotenv').config({ path: './server/.env' });
const mysql = require('mysql2');

console.log('🔍 בודק חיבור למסד נתונים...\n');
console.log('פרטי ההתחברות:');
console.log('  Host:', process.env.DB_HOST || 'localhost');
console.log('  User:', process.env.DB_USER || 'root');
console.log('  Password:', process.env.DB_PASSWORD ? '***' : '(ריק)');
console.log('  Database:', process.env.DB_NAME || 'smart_meeting_db');
console.log('');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_meeting_db'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ שגיאה בחיבור למסד הנתונים:');
        console.error('   ', err.message);
        console.error('\n💡 פתרונות אפשריים:');
        
        if (err.code === 'ECONNREFUSED') {
            console.error('   1. ודא ש-MySQL רץ על המחשב');
            console.error('   2. נסה: net start MySQL80 (ב-Windows)');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   1. בדוק שהסיסמה נכונה ב-server/.env');
            console.error('   2. או צור משתמש חדש ב-MySQL');
            console.error('   3. ראה: docs/DATABASE_SETUP.md לפרטים');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('   1. מסד הנתונים לא קיים');
            console.error('   2. צור אותו: CREATE DATABASE smart_meeting_db;');
        }
        
        process.exit(1);
    }
    
    console.log('✅ חיבור למסד הנתונים הצליח!');
    
    // בדיקה אם המסד קיים
    connection.query('SELECT DATABASE() as db', (err, results) => {
        if (err) {
            console.error('❌ שגיאה בבדיקת מסד הנתונים:', err.message);
        } else {
            console.log('✅ מחובר למסד:', results[0].db || 'לא נבחר מסד');
        }
        
        connection.end();
        process.exit(0);
    });
});
