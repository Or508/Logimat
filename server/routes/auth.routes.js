const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Routes לאימות - פתוחים לכולם (אין צורך ב-middleware)
 */

// POST /api/admin/login - התחברות אדמין
router.post('/login', authController.login);

// GET /api/admin/me - פרטי המשתמש המחובר (דורש אימות)
router.get('/me', authMiddleware.authenticateToken, authController.getMe);

module.exports = router;
