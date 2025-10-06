// routes/adminInquiriesRoutes.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET /api/admin/inquiries - Paginated, searchable route
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        // Ensure page and limit are valid numbers, default to 1 and 10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const queryValues = [];
        let whereClause = '';

        if (search) {
            whereClause = ' WHERE name ILIKE $1 OR email ILIKE $1 OR subject ILIKE $1';
            queryValues.push(`%${search}%`);
        }

        const inquiriesQuery = `
            SELECT id, name, email, phone, subject, message, status, created_at
            FROM inquiries
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}
        `;

        const totalCountQuery = `
            SELECT COUNT(*) FROM inquiries ${whereClause}
        `;

        // Get total count
        const totalCountResult = await pool.query(totalCountQuery, queryValues);
        const totalCount = parseInt(totalCountResult.rows[0].count);

        // Get paginated inquiries
        const paginatedInquiriesResult = await pool.query(inquiriesQuery, [...queryValues, limit, offset]);
        
        res.json({
            inquiries: paginatedInquiriesResult.rows,
            totalCount: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (err) {
        console.error('❌ Error fetching inquiries:', err);
        res.status(500).json({ error: 'Failed to retrieve inquiries.' });
    }
});

// @route   PUT /api/admin/inquiries/:id
// @desc    Update inquiry status
// @access  Private (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ msg: 'Status is required to update an inquiry.' });
        }

        const query = `
            UPDATE inquiries
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *;
        `;
        const values = [status, id];
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Inquiry not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/inquiries/:id
// @desc    Delete an inquiry
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM inquiries WHERE id = $1 RETURNING id', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Inquiry not found' });
        }

        res.json({ msg: 'Inquiry deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;