const jwt = require('jsonwebtoken');

/**
 * Middleware לאימות משתמשים באמצעות JWT
 * משמש להגנה על routes שדורשים התחברות
 */
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'אין הרשאה - נדרש טוקן' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'טוקן לא תקין או פג תוקף' });
        }
        req.user = user; // שמירת פרטי המשתמש ב-request
        next();
    });
};

/**
 * Middleware לבדיקת תפקיד משתמש (role-based access)
 * משמש להגנה על routes שדורשים תפקיד ספציפי (כמו admin)
 */
exports.requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'נדרש אימות' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'אין לך הרשאה לגשת למשאב זה' });
        }

        next();
    };
};
