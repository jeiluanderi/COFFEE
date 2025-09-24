const express = require('express');
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// DB connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// ===================================
// GET all baristas with pagination
// ===================================
// Accessible by admin only to display in the admin panel
// Note the path is now just '/' because server.js handles the '/api/admin/baristas' prefix
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const baristasQuery = `
            SELECT id, name, role, image_url 
            FROM baristas
            ORDER BY id
            LIMIT $1 
            OFFSET $2;
        `;
        const baristasResult = await pool.query(baristasQuery, [limit, offset]);
        const baristas = baristasResult.rows;

        const countQuery = 'SELECT COUNT(*) FROM baristas;';
        const countResult = await pool.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count);

        res.json({ baristas, totalCount });

    } catch (err) {
        console.error('Error fetching baristas with pagination:', err);
        res.status(500).json({ message: 'Failed to retrieve baristas.' });
    }
});

// ===================================
// POST: Create a new barista
// ===================================
// Path is now just '/'
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { name, role, image_url } = req.body;
    if (!name || !role || !image_url) {
        return res.status(400).json({ message: 'Name, role, and image URL are required.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO baristas (name, role, image_url) VALUES ($1, $2, $3) RETURNING *',
            [name, role, image_url]
        );
        res.status(201).json({ message: 'Team member added successfully.', teamMember: result.rows[0] });
    } catch (err) {
        console.error('Error creating team member:', err);
        res.status(500).json({ message: 'Failed to create team member.' });
    }
});

// ===================================
// PUT: Update an existing barista
// ===================================
// Path is now just '/:id'
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { name, role, image_url } = req.body;
    if (!name || !role || !image_url) {
        return res.status(400).json({ message: 'Name, role, and image URL are required.' });
    }
    try {
        const result = await pool.query(
            'UPDATE baristas SET name = $1, role = $2, image_url = $3 WHERE id = $4 RETURNING *',
            [name, role, image_url, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Team member not found.' });
        }
        res.status(200).json({ message: 'Team member updated successfully.', teamMember: result.rows[0] });
    } catch (err) {
        console.error(`Error updating team member ID ${id}:`, err);
        res.status(500).json({ message: 'Failed to update team member.' });
    }
});

// ===================================
// DELETE: Delete a barista
// ===================================
// Path is now just '/:id'
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM baristas WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Team member not found.' });
        }
        res.status(200).json({ message: 'Team member deleted successfully.' });
    } catch (err) {
        console.error(`Error deleting team member ID ${id}:`, err);
        res.status(500).json({ message: 'Failed to delete team member.' });
    }
});

module.exports = router;