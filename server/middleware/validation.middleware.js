/**
 * Middleware לתיקוף נתונים בסיסי
 * יכול להורחב עם ספריית validation כמו joi או express-validator
 */

/**
 * בודק אם שדות חובה קיימים ב-body
 * @param {string[]} fields - רשימת שדות חובה
 */
exports.validateRequired = (fields) => {
    return (req, res, next) => {
        const missing = fields.filter(field => !req.body[field]);

        if (missing.length > 0) {
            return res.status(400).json({
                message: `שדות חסרים: ${missing.join(', ')}`
            });
        }

        next();
    };
};

/**
 * בודק אם שדה הוא email תקין
 */
exports.validateEmail = (fieldName = 'email') => {
    return (req, res, next) => {
        const email = req.body[fieldName];
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'כתובת אימייל לא תקינה' });
            }
        }
        next();
    };
};

/**
 * בודק אם שדה הוא מספר טלפון תקין (ישראל)
 */
exports.validatePhone = (fieldName = 'phone') => {
    return (req, res, next) => {
        const phone = req.body[fieldName];
        if (phone) {
            const phoneRegex = /^0[0-9]{9}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: 'מספר טלפון לא תקין (צריך 10 ספרות)' });
            }
        }
        next();
    };
};
