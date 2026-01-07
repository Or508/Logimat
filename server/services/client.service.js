const db = require('../config/database');
const jwt = require('jsonwebtoken');

/**
 * שירות לקוח - מטפל בכל הפעולות של לקוחות
 * אחראי על: רישום לקוח, בדיקת email/phone, הנפקת טוקן ללקוח
 */

/**
 * בודק אם email קיים במערכת
 * @param {string} email
 * @returns {Promise<boolean>}
 */
exports.isEmailExists = async (email) => {
    const [rows] = await db.execute('SELECT id FROM clients WHERE email = ?', [email]);
    return rows.length > 0;
};

/**
 * בודק אם טלפון קיים במערכת
 * @param {string} phone
 * @returns {Promise<boolean>}
 */
exports.isPhoneExists = async (phone) => {
    const [rows] = await db.execute('SELECT id FROM clients WHERE phone = ?', [phone]);
    return rows.length > 0;
};

/**
 * יוצר לקוח חדש
 * @param {object} clientData - {name, email, phone}
 * @returns {Promise<object>}
 */
exports.createClient = async (clientData) => {
    const { name, email, phone } = clientData;

    // בדיקות
    if (await exports.isEmailExists(email)) {
        throw new Error('כתובת אימייל כבר רשומה במערכת');
    }

    if (await exports.isPhoneExists(phone)) {
        throw new Error('מספר טלפון כבר רשום במערכת');
    }

    const [result] = await db.execute(
        'INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)',
        [name, email, phone]
    );

    const client = await exports.getClientById(result.insertId);
    
    // יצירת טוקן ללקוח
    const token = jwt.sign(
        { id: client.id, role: 'client', email: client.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    return {
        client,
        token
    };
};

/**
 * מקבל לקוח לפי ID
 * @param {number} clientId
 * @returns {Promise<object>}
 */
exports.getClientById = async (clientId) => {
    const [rows] = await db.execute('SELECT id, name, email, phone, created_at FROM clients WHERE id = ?', [clientId]);
    
    if (rows.length === 0) {
        throw new Error('לקוח לא נמצא');
    }
    
    return rows[0];
};

/**
 * מקבל לקוח לפי email
 * @param {string} email
 * @returns {Promise<object|null>}
 */
exports.getClientByEmail = async (email) => {
    const [rows] = await db.execute('SELECT id, name, email, phone FROM clients WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
};
