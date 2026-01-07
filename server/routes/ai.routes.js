const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.post('/analyze', aiController.generateQuote);

module.exports = router;