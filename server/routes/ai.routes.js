const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const validationMiddleware = require('../middleware/validation.middleware');

/**
 * Routes ל-AI - פתוחים לכולם (אין צורך באימות)
 */

// POST /api/ai/analyze - יצירת הצעת מחיר ועיצוב
router.post('/analyze', 
    validationMiddleware.validateRequired(['userDescription']),
    aiController.generateQuote
);

module.exports = router;
