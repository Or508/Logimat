const adminService = require('../services/admin.service');

/**
 * Controller לניהול אדמין - מטפל רק ב-HTTP requests/responses
 * כל הלוגיקה העסקית נמצאת ב-admin.service.js
 */

/**
 * GET /api/admin/projects
 * קבלת רשימת כל הפרויקטים
 */
exports.getAllProjects = async (req, res, next) => {
    try {
        const projects = await adminService.getAllProjects();
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/admin/projects/:id
 * קבלת פרויקט ספציפי
 */
exports.getProjectById = async (req, res, next) => {
    try {
        const project = await adminService.getProjectById(req.params.id);
        res.json(project);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/admin/projects
 * יצירת פרויקט חדש
 */
exports.createProject = async (req, res, next) => {
    try {
        const project = await adminService.createProject(req.body);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/admin/projects/:id
 * עדכון פרויקט
 */
exports.updateProject = async (req, res, next) => {
    try {
        const project = await adminService.updateProject(req.params.id, req.body);
        res.json(project);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/admin/projects/:id
 * מחיקת פרויקט
 */
exports.deleteProject = async (req, res, next) => {
    try {
        await adminService.deleteProject(req.params.id);
        res.json({ message: 'פרויקט נמחק בהצלחה' });
    } catch (error) {
        next(error);
    }
};
