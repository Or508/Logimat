const authService = require('../services/auth.service');

/**
 * Controller לאימות - מטפל רק ב-HTTP requests/responses
 * כל הלוגיקה העסקית נמצאת ב-auth.service.js
 */

/**
 * POST /api/admin/login
 * התחברות אדמין
 */
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'שם משתמש וסיסמה נדרשים' });
        }

        const result = await authService.loginAdmin(username, password);

        res.json({
            message: 'התחברת בהצלחה!',
            token: result.token,
            username: result.username,
            role: result.role
        });
    } catch (error) {
        next(error); // מעביר ל-error middleware
    }
};

/**
 * GET /api/admin/me
 * מחזיר פרטי המשתמש המחובר
 */
exports.getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};
