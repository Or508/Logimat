const express = require('express');
const router = express.Router();
const meetingsController = require('../controllers/meetings.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Routes לפגישות - חלק פתוח (בדיקת זמינות), חלק דורש אימות
 */

// GET /api/meetings/check-availability - בדיקת זמינות (פתוח לכולם)
router.get('/check-availability', meetingsController.checkAvailability);

// כל השאר דורש אימות
router.use(authMiddleware.authenticateToken);

// GET /api/meetings - רשימת פגישות
router.get('/', meetingsController.getAllMeetings);

// GET /api/meetings/:id - פגישה ספציפית
router.get('/:id', meetingsController.getMeetingById);

// POST /api/meetings - יצירת פגישה
router.post('/', meetingsController.createMeeting);

// PUT /api/meetings/:id - עדכון פגישה
router.put('/:id', meetingsController.updateMeeting);

// DELETE /api/meetings/:id - מחיקת פגישה
router.delete('/:id', meetingsController.deleteMeeting);

module.exports = router;
