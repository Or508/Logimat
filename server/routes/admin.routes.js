const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Routes לניהול אדמין - כולם דורשים אימות + תפקיד אדמין
 */

// Middleware להגנה על כל ה-routes - דורש אימות + תפקיד אדמין
router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.requireRole('admin', 'superadmin'));

// Routes לפרויקטים
router.get('/projects', adminController.getAllProjects);
router.get('/projects/:id', adminController.getProjectById);
router.post('/projects', adminController.createProject);
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);

module.exports = router;
