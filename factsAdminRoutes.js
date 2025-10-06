// POST /facts (Admin Only)
const express = require('express');
const { Pool } = require('pg');
const { authorizeRoles, authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize the database connection pool using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
// Inside your admin routes file (e.g., routes/admin.js)

router.get('/facts', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const allFacts = await pool.query('SELECT * FROM facts');
        res.status(200).json(allFacts.rows);
    } catch (err) {
        console.error('Error fetching facts:', err);
        res.status(500).json({ message: 'Failed to retrieve facts.' });
    }
});
router.post('/facts', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { number, text, delay } = req.body;
    try {
        const newFact = await pool.query(
            `INSERT INTO facts (number, text, delay) VALUES ($1, $2, $3) RETURNING *`,
            [number, text, delay]
        );
        res.status(201).json(newFact.rows[0]);
    } catch (err) {
        console.error('Error creating fact:', err);
        res.status(500).json({ message: 'Failed to create fact.' });
    }
});

// PUT /facts/:id (Admin Only)
router.put('/facts/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { number, text, delay } = req.body;
    try {
        const updatedFact = await pool.query(
            `UPDATE facts SET number = $1, text = $2, delay = $3 WHERE id = $4 RETURNING *`,
            [number, text, delay, id]
        );
        if (updatedFact.rows.length === 0) {
            return res.status(404).json({ message: 'Fact not found.' });
        }
        res.status(200).json(updatedFact.rows[0]);
    } catch (err) {
        console.error('Error updating fact:', err);
        res.status(500).json({ message: 'Failed to update fact.' });
    }
});

// DELETE /facts/:id (Admin Only)
router.delete('/facts/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFact = await pool.query('DELETE FROM facts WHERE id = $1 RETURNING *', [id]);
        if (deletedFact.rows.length === 0) {
            return res.status(404).json({ message: 'Fact not found.' });
        }
        res.status(200).json({ message: 'Fact deleted successfully!' });
    } catch (err) {
        console.error('Error deleting fact:', err);
        res.status(500).json({ message: 'Failed to delete fact.' });
    }
});
module.exports = router;