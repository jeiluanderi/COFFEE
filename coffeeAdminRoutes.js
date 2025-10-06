const express = require('express');
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET all coffees with pagination. This route replaces the old one.
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const totalCountResult = await pool.query('SELECT COUNT(*) FROM coffees');
        const totalCount = parseInt(totalCountResult.rows[0].count);

        const coffeesQuery = `
            SELECT * FROM coffees
            ORDER BY created_at DESC
            OFFSET $1
            LIMIT $2;
        `;
        const coffeesResult = await pool.query(coffeesQuery, [offset, limit]);

        res.json({
            coffees: coffeesResult.rows,
            totalCount: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (err) {
        console.error('❌ Error fetching coffees:', err);
        res.status(500).json({ error: 'Failed to retrieve coffees.' });
    }
});

// All other routes remain the same
// CREATE coffee
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { name, description, price, image_url, category_id, stock_quantity, origin, roast_level } = req.body;
    if (!name || !price || !category_id) {
        return res.status(400).json({ message: 'Name, price, and category are required.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO coffees (name, description, price, image_url, category_id, stock_quantity, origin, roast_level)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [name, description, price, image_url, category_id, stock_quantity || 0, origin, roast_level]
        );
        res.status(201).json({ message: 'Coffee created.', coffee: result.rows[0] });
    } catch (err) {
        console.error('❌ Error creating coffee:', err);
        res.status(500).json({ error: 'Failed to create coffee.' });
    }
});

// UPDATE coffee
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(req.body)) {
        fields.push(`${key} = $${i++}`);
        values.push(value);
    }
    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields to update.' });
    }
    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE coffees SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Coffee not found.' });
        }
        res.json({ message: 'Coffee updated.', coffee: result.rows[0] });
    } catch (err) {
        console.error('❌ Error updating coffee:', err);
        res.status(500).json({ error: 'Failed to update coffee.' });
    }
});

// DELETE coffee
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM coffees WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Coffee not found.' });
        }
        res.json({ message: 'Coffee deleted.', deletedId: req.params.id });
    } catch (err) {
        console.error('❌ Error deleting coffee:', err);
        res.status(500).json({ error: 'Failed to delete coffee.' });
    }
});

module.exports = router;