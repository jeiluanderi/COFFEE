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

// GET all blog posts (public endpoint)
// Note: This endpoint is public and does not require authentication.
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching blog posts:', err);
        res.status(500).json({ error: 'Failed to retrieve blog posts.' });
    }
});

// GET a single blog post by ID (public endpoint)
// This is for a future single blog post page
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Error fetching blog post:', err);
        res.status(500).json({ error: 'Failed to retrieve blog post.' });
    }
});

module.exports = router;