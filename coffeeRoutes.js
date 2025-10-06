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

// GET all coffees (public)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, description, price, image_url, category_id, stock_quantity, origin, roast_level
            FROM coffees ORDER BY name ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching coffees:', err);
        res.status(500).json({ error: 'Failed to retrieve coffees.' });
    }
});

// GET coffee by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, description, price, image_url, category_id, stock_quantity, origin, roast_level 
             FROM coffees WHERE id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Coffee not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Error fetching coffee:', err);
        res.status(500).json({ error: 'Failed to retrieve coffee.' });
    }
});

module.exports = router;