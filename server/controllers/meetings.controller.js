const meetingService = require('../services/meeting.service');

/**
 * Controller לפגישות - מטפל רק ב-HTTP requests/responses
 * כל הלוגיקה העסקית נמצאת ב-meeting.service.js
 */

/**
 * GET /api/meetings
 * קבלת רשימת פגישות (עם סינונים אופציונליים)
 */
exports.getAllMeetings = async (req, res, next) => {
    try {
        const filters = {
            client_id: req.query.client_id,
            date: req.query.date,
            status: req.query.status
        };

        const meetings = await meetingService.getAllMeetings(filters);
        res.json(meetings);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/meetings/:id
 * קבלת פגישה ספציפית
 */
exports.getMeetingById = async (req, res, next) => {
    try {
        const meeting = await meetingService.getMeetingById(req.params.id);
        res.json(meeting);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/meetings
 * יצירת פגישה חדשה
 */
exports.createMeeting = async (req, res, next) => {
    try {
        const meeting = await meetingService.createMeeting(req.body);
        res.status(201).json(meeting);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/meetings/:id
 * עדכון פגישה
 */
exports.updateMeeting = async (req, res, next) => {
    try {
        const meeting = await meetingService.updateMeeting(req.params.id, req.body);
        res.json(meeting);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/meetings/:id
 * מחיקת פגישה
 */
exports.deleteMeeting = async (req, res, next) => {
    try {
        await meetingService.deleteMeeting(req.params.id);
        res.json({ message: 'פגישה נמחקה בהצלחה' });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/meetings/check-availability
 * בדיקת זמינות זמן
 */
exports.checkAvailability = async (req, res, next) => {
    try {
        const { datetime } = req.query;
        
        if (!datetime) {
            return res.status(400).json({ message: 'נדרש פרמטר datetime' });
        }

        const isAvailable = await meetingService.isSlotAvailable(datetime);
        res.json({ available: isAvailable, datetime });
    } catch (error) {
        next(error);
    }
};
