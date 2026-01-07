const aiService = require('../services/ai.service');

/**
 * Controller ל-AI - מטפל רק ב-HTTP requests/responses
 * כל הלוגיקה העסקית נמצאת ב-ai.service.js
 */

/**
 * POST /api/ai/analyze
 * יצירת הצעת מחיר ועיצוב לאתר
 */
exports.generateQuote = async (req, res, next) => {
    try {
        const { userDescription } = req.body;

        if (!userDescription) {
            return res.status(400).json({ message: 'אנא כתוב תיאור לאתר' });
        }

        const result = await aiService.generateWebsiteQuote(userDescription);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
