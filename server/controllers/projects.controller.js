const projectService = require('../services/project.service');

/**
 * Controller לפרויקטים (ציבורי) - מטפל רק ב-HTTP requests/responses
 * כל הלוגיקה העסקית נמצאת ב-project.service.js
 */

/**
 * GET /api/projects
 * קבלת רשימת פרויקטים זמינים לציבור (עם סינונים אופציונליים)
 */
exports.getPublicProjects = async (req, res, next) => {
    try {
        const filters = {
            type: req.query.type,
            min_price: req.query.min_price ? parseInt(req.query.min_price) : null,
            max_price: req.query.max_price ? parseInt(req.query.max_price) : null
        };

        const projects = await projectService.getPublicProjects(filters);
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/projects/:id
 * קבלת פרויקט ספציפי לציבור
 */
exports.getPublicProjectById = async (req, res, next) => {
    try {
        const project = await projectService.getPublicProjectById(req.params.id);
        res.json(project);
    } catch (error) {
        next(error);
    }
};
