// src/backend/routes/hero-slidesRoutes.js

const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET /hero-slides - Fetch all public hero slides
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            // Ensure no extra spaces, especially at the end of lines
            `SELECT id, image_src, title, button_text, button_href FROM hero ORDER BY id`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching public hero slides:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;