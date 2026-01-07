const db = require('../config/database');

/**
 * שירות פגישות - מטפל בכל הפעולות הקשורות לפגישות וזמנים
 * אחראי על: יצירת slots, הזמנת פגישות, בדיקת זמינות
 */

/**
 * מקבל רשימת כל הפגישות
 * @param {object} filters - {client_id, date, status}
 * @returns {Promise<Array>}
 */
exports.getAllMeetings = async (filters = {}) => {
    let query = 'SELECT * FROM meetings WHERE 1=1';
    const params = [];

    if (filters.client_id) {
        query += ' AND client_id = ?';
        params.push(filters.client_id);
    }

    if (filters.date) {
        query += ' AND DATE(scheduled_at) = ?';
        params.push(filters.date);
    }

    if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
    }

    query += ' ORDER BY scheduled_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
};

/**
 * מקבל פגישה לפי ID
 * @param {number} meetingId
 * @returns {Promise<object>}
 */
exports.getMeetingById = async (meetingId) => {
    const [rows] = await db.execute(
        `SELECT m.*, c.name as client_name, c.email as client_email 
         FROM meetings m 
         LEFT JOIN clients c ON m.client_id = c.id 
         WHERE m.id = ?`,
        [meetingId]
    );
    
    if (rows.length === 0) {
        throw new Error('פגישה לא נמצאה');
    }
    
    return rows[0];
};

/**
 * בודק אם זמן מסוים זמין להזמנה
 * @param {string} datetime - תאריך ושעה בפורמט YYYY-MM-DD HH:mm:ss
 * @returns {Promise<boolean>}
 */
exports.isSlotAvailable = async (datetime) => {
    const [rows] = await db.execute(
        `SELECT id FROM meetings 
         WHERE scheduled_at = ? AND status IN ('scheduled', 'confirmed')`,
        [datetime]
    );
    
    return rows.length === 0;
};

/**
 * יוצר פגישה חדשה
 * @param {object} meetingData - {client_id, scheduled_at, notes}
 * @returns {Promise<object>}
 */
exports.createMeeting = async (meetingData) => {
    const { client_id, scheduled_at, notes } = meetingData;

    // בדיקת זמינות
    if (!(await exports.isSlotAvailable(scheduled_at))) {
        throw new Error('הזמן המבוקש תפוס');
    }

    const [result] = await db.execute(
        `INSERT INTO meetings (client_id, scheduled_at, notes, status) 
         VALUES (?, ?, ?, 'scheduled')`,
        [client_id, scheduled_at, notes || '']
    );

    return exports.getMeetingById(result.insertId);
};

/**
 * מעדכן פגישה
 * @param {number} meetingId
 * @param {object} meetingData
 * @returns {Promise<object>}
 */
exports.updateMeeting = async (meetingId, meetingData) => {
    const { scheduled_at, notes, status } = meetingData;

    // אם מעדכנים זמן, בודקים זמינות
    if (scheduled_at) {
        const meeting = await exports.getMeetingById(meetingId);
        if (meeting.scheduled_at !== scheduled_at && !(await exports.isSlotAvailable(scheduled_at))) {
            throw new Error('הזמן המבוקש תפוס');
        }
    }

    const updates = [];
    const params = [];

    if (scheduled_at) {
        updates.push('scheduled_at = ?');
        params.push(scheduled_at);
    }

    if (notes !== undefined) {
        updates.push('notes = ?');
        params.push(notes);
    }

    if (status) {
        updates.push('status = ?');
        params.push(status);
    }

    if (updates.length === 0) {
        return exports.getMeetingById(meetingId);
    }

    params.push(meetingId);

    const [result] = await db.execute(
        `UPDATE meetings SET ${updates.join(', ')} WHERE id = ?`,
        params
    );

    if (result.affectedRows === 0) {
        throw new Error('פגישה לא נמצאה');
    }

    return exports.getMeetingById(meetingId);
};

/**
 * מוחק פגישה
 * @param {number} meetingId
 * @returns {Promise<void>}
 */
exports.deleteMeeting = async (meetingId) => {
    const [result] = await db.execute('DELETE FROM meetings WHERE id = ?', [meetingId]);
    
    if (result.affectedRows === 0) {
        throw new Error('פגישה לא נמצאה');
    }
};
