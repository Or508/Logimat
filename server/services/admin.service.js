const db = require('../config/database');

/**
 * שירות ניהול - מטפל בכל הפעולות שמבצע אדמין
 * אחראי על: CRUD של פרויקטים, פגישות, מדיה, זמינות
 */

/**
 * מקבל רשימת כל הפרויקטים
 * @returns {Promise<Array>}
 */
exports.getAllProjects = async () => {
    const [rows] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
    return rows;
};

/**
 * מקבל פרויקט לפי ID
 * @param {number} projectId
 * @returns {Promise<object>}
 */
exports.getProjectById = async (projectId) => {
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    if (rows.length === 0) {
        throw new Error('פרויקט לא נמצא');
    }
    
    return rows[0];
};

/**
 * יוצר פרויקט חדש
 * @param {object} projectData
 * @returns {Promise<object>}
 */
exports.createProject = async (projectData) => {
    const { type, title, description, min_budget, max_budget } = projectData;
    
    const [result] = await db.execute(
        `INSERT INTO projects (type, title, description, min_budget, max_budget) 
         VALUES (?, ?, ?, ?, ?)`,
        [type, title, description, min_budget, max_budget]
    );
    
    return exports.getProjectById(result.insertId);
};

/**
 * מעדכן פרויקט קיים
 * @param {number} projectId
 * @param {object} projectData
 * @returns {Promise<object>}
 */
exports.updateProject = async (projectId, projectData) => {
    const { type, title, description, min_budget, max_budget } = projectData;
    
    const [result] = await db.execute(
        `UPDATE projects 
         SET type = ?, title = ?, description = ?, min_budget = ?, max_budget = ?
         WHERE id = ?`,
        [type, title, description, min_budget, max_budget, projectId]
    );
    
    if (result.affectedRows === 0) {
        throw new Error('פרויקט לא נמצא');
    }
    
    return exports.getProjectById(projectId);
};

/**
 * מוחק פרויקט
 * @param {number} projectId
 * @returns {Promise<void>}
 */
exports.deleteProject = async (projectId) => {
    const [result] = await db.execute('DELETE FROM projects WHERE id = ?', [projectId]);
    
    if (result.affectedRows === 0) {
        throw new Error('פרויקט לא נמצא');
    }
};
