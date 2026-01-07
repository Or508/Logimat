const clientService = require('../services/client.service');

/**
 * Controller ללקוחות - מטפל רק ב-HTTP requests/responses
 * כל הלוגיקה העסקית נמצאת ב-client.service.js
 */

/**
 * POST /api/client/register
 * רישום לקוח חדש
 */
exports.register = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'כל השדות נדרשים: name, email, phone' });
        }

        const result = await clientService.createClient({ name, email, phone });

        res.status(201).json({
            message: 'לקוח נרשם בהצלחה!',
            client: result.client,
            token: result.token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/client/check-email
 * בדיקה אם email קיים
 */
exports.checkEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ message: 'נדרש פרמטר email' });
        }

        const exists = await clientService.isEmailExists(email);
        res.json({ exists });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/client/check-phone
 * בדיקה אם טלפון קיים
 */
exports.checkPhone = async (req, res, next) => {
    try {
        const { phone } = req.query;
        
        if (!phone) {
            return res.status(400).json({ message: 'נדרש פרמטר phone' });
        }

        const exists = await clientService.isPhoneExists(phone);
        res.json({ exists });
    } catch (error) {
        next(error);
    }
};
