// backend/routes/categories.js

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // Import auth middleware

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

/**
 * @route GET /api/categories - Retrieves a list of all coffee categories
 * @access Public
 */
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, description FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching categories:', err.message);
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
});

/**
 * @route POST /api/categories - Adds a new category
 * @access Private (Admin Only)
 */
router.post('/categories', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description',
            [name, description]
        );
        res.status(201).json({ message: 'Category added successfully!', category: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Category with this name already exists.' });
        }
        console.error('Error adding new category:', err.message);
        res.status(500).json({ error: 'Failed to add category.' });
    }
});

module.exports = router;
