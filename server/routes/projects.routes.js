const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');

/**
 * Routes לפרויקטים (ציבורי) - כולם פתוחים ללא אימות
 */

// GET /api/projects - רשימת פרויקטים זמינים
router.get('/', projectsController.getPublicProjects);

// GET /api/projects/:id - פרויקט ספציפי
router.get('/:id', projectsController.getPublicProjectById);

module.exports = router;
