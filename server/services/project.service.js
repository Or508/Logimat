const db = require('../config/database');

/**
 * שירות פרויקטים - מטפל בכל הפעולות הקשורות לפרויקטים (לקוח ציבורי)
 * אחראי על: קריאת פרויקטים, סינון, חיפוש
 */

/**
 * מקבל רשימת פרויקטים זמינים לציבור (public)
 * @param {object} filters - {type, min_price, max_price}
 * @returns {Promise<Array>}
 */
exports.getPublicProjects = async (filters = {}) => {
    let query = 'SELECT id, type, title, description, min_budget, max_budget, created_at FROM projects WHERE 1=1';
    const params = [];

    if (filters.type) {
        query += ' AND type = ?';
        params.push(filters.type);
    }

    if (filters.min_price) {
        query += ' AND max_budget >= ?';
        params.push(filters.min_price);
    }

    if (filters.max_price) {
        query += ' AND min_budget <= ?';
        params.push(filters.max_price);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
};

/**
 * מקבל פרויקט ספציפי לציבור
 * @param {number} projectId
 * @returns {Promise<object>}
 */
exports.getPublicProjectById = async (projectId) => {
    const [rows] = await db.execute(
        'SELECT id, type, title, description, min_budget, max_budget, created_at FROM projects WHERE id = ?',
        [projectId]
    );
    
    if (rows.length === 0) {
        throw new Error('פרויקט לא נמצא');
    }
    
    return rows[0];
};
