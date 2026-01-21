const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');

// POST /api/leads
router.post('/', leadsController.createLead);

module.exports = router;