// routes/categoryRoutes.js
const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

// DB connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET /categories - Public route to fetch all categories
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name,description,icon_name FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
});

module.exports = router;