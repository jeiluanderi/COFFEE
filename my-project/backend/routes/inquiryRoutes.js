const express = require('express');
const { Pool } = require('pg');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// DB connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// =======================
// POST /inquiries - Public
// =======================
router.post('/', async (req, res) => {
    // Note the change from 'service_type' to 'subject'
    const { name, email, phone, subject, message } = req.body;

    // The validation now checks for 'subject' instead of 'service_type'
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO inquiries (name, email, phone, subject, message) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, name, email, subject, created_at`,
            [name, email, phone, subject, message]
        );
        res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: result.rows[0] });
    } catch (err) {
        console.error('Error submitting inquiry:', err);
        res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' });
    }
});

// Admin-only route to get all inquiries
router.get('/', authorizeRoles(['admin']), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching inquiries:', err);
        res.status(500).json({ error: 'Failed to fetch inquiries.' });
    }
});

module.exports = router;