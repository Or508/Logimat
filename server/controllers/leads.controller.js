const db = require('../models/db');

exports.createLead = async (req, res) => {
    try {
        const { fullName, phone } = req.body;

        if (!fullName || !phone) {
            return res.status(400).json({ error: 'Missing full name or phone' });
        }

        // 1. Save to Database
        // Use INSERT IGNORE or ON DUPLICATE KEY UPDATE to handle existing phones
        const [result] = await db.query(
            `INSERT INTO clients (full_name, phone, registration_date, registration_time) 
             VALUES (?, ?, CURRENT_DATE, CURRENT_TIME)
             ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), updated_at = NOW()`,
            [fullName, phone]
        );

        // 2. Simulate WhatsApp Notification to Admin
        console.log(`\n🔔 [WhatsApp Sim] Sending message to Owner:`);
        console.log(`> "New Lead Received! 🚀"`);
        console.log(`> Name: ${fullName}`);
        console.log(`> Phone: ${phone}`);
        console.log(`> Time: ${new Date().toLocaleString()}\n`);

        res.status(201).json({ message: 'Lead saved successfully', leadId: result.insertId });

    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};