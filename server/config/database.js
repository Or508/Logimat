const mysql = require('mysql2');
const path = require('path');

// טעינת משתני סביבה
require('dotenv').config({ 
    path: path.join(__dirname, '..', '.env')
});

let pool = null;
let promisePool = null;
let isDatabaseAvailable = false;

// נסה להתחבר רק אם יש הגדרות
if (process.env.DB_HOST || process.env.DB_USER) {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'smart_meeting_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            connectTimeout: 3000
        });

        promisePool = pool.promise();

        // בדיקת חיבור (אסינכרוני, לא עוצר את השרת)
        pool.getConnection((err, connection) => {
            if (err) {
                console.warn('⚠️  Database not available:', err.message);
                console.warn('   ℹ️  Server will work without database - AI features will work!\n');
                isDatabaseAvailable = false;
            } else {
                console.log('✅ Connected to MySQL Database successfully!');
                isDatabaseAvailable = true;
                connection.release();
            }
        });
    } catch (error) {
        isDatabaseAvailable = false;
    }
} else {
    console.log('ℹ️  Database not configured - server will work without database\n');
}

// Export - מחזיר proxy שמטפל בחסרון מסד נתונים
const dbProxy = {
    execute: async (...args) => {
        if (!isDatabaseAvailable || !promisePool) {
            throw new Error('Database is not available. This feature requires a database connection.');
        }
        return promisePool.execute(...args);
    },
    
    query: async (...args) => {
        if (!isDatabaseAvailable || !promisePool) {
            throw new Error('Database is not available. This feature requires a database connection.');
        }
        return promisePool.query(...args);
    }
};

module.exports = dbProxy;
