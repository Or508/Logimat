const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const validationMiddleware = require('../middleware/validation.middleware');

/**
 * Routes ללקוחות - רישום ובדיקות
 */

// POST /api/client/register - רישום לקוח חדש
router.post('/register',
    validationMiddleware.validateRequired(['name', 'email', 'phone']),
    validationMiddleware.validateEmail('email'),
    validationMiddleware.validatePhone('phone'),
    clientController.register
);

// GET /api/client/check-email - בדיקה אם email קיים
router.get('/check-email', clientController.checkEmail);

// GET /api/client/check-phone - בדיקה אם טלפון קיים
router.get('/check-phone', clientController.checkPhone);

module.exports = router;
