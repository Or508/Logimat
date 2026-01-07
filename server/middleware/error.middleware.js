/**
 * Middleware מרכזי לטיפול בשגיאות
 * מטפל בכל השגיאות שנזרקות בקוד ומחזיר תגובה תקינה ללקוח
 */

exports.errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // שגיאת אימות
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'טוקן לא תקין' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'טוקן פג תוקף' });
    }

    // שגיאת מסד נתונים
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'הרשומה כבר קיימת במערכת' });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ message: 'הפנייה לרשומה שלא קיימת' });
    }

    // שגיאה כללית
    const statusCode = err.statusCode || 500;
    const message = err.message || 'שגיאת שרת פנימית';

    res.status(statusCode).json({
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Middleware לתפיסת routes שלא נמצאו
 */
exports.notFoundHandler = (req, res) => {
    res.status(404).json({ message: 'הנתיב המבוקש לא נמצא' });
};
