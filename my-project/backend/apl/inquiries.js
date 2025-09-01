// backend/routes/inquiries.js

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
 * @route POST /api/inquiries - Handles submission of general inquiries or custom order messages
 * @access Public
 */
router.post('/inquiries', async (req, res) => {
    const { name, email, phone, service_type, message } = req.body;

    if (!name || !email || !service_type || !message) {
        return res.status(400).json({ message: 'Name, email, service type, and message are required.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO inquiries (name, email, phone, service_type, message) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, service_type, created_at',
            [name, email, phone, service_type, message]
        );
        res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: result.rows[0] });
    } catch (err) {
        console.error('Error submitting inquiry:', err.message);
        res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' });
    }
});

// --- Admin-only Inquiry Routes ---

/**
 * @route GET /api/inquiries (Admin) - Retrieves all inquiries
 * @access Private (Admin Only)
 */
router.get('/inquiries', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, phone, service_type, message, status, created_at FROM inquiries ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching inquiries:', err.message);
        res.status(500).json({ error: 'Failed to retrieve inquiries.' });
    }
});

/**
 * @route PUT /api/inquiries/:id (Admin) - Updates inquiry details
 * @access Private (Admin Only)
 */
router.put('/inquiries/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, service_type, message, status } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (name !== undefined) { fields.push(`name = $${queryIndex++}`); values.push(name); }
    if (email !== undefined) { fields.push(`email = $${queryIndex++}`); values.push(email); }
    if (phone !== undefined) { fields.push(`phone = $${queryIndex++}`); values.push(phone); }
    if (service_type !== undefined) { fields.push(`service_type = $${queryIndex++}`); values.push(service_type); }
    if (message !== undefined) { fields.push(`message = $${queryIndex++}`); values.push(message); }
    if (status !== undefined) { fields.push(`status = $${queryIndex++}`); values.push(status); }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 1 && fields[0].includes('updated_at')) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE inquiries SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
        res.status(200).json({ message: 'Inquiry updated successfully!', inquiry: result.rows[0] });
    } catch (err) {
        console.error(`Error updating inquiry ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to update inquiry.' });
    }
});

/**
 * @route DELETE /api/inquiries/:id (Admin) - Deletes an inquiry by ID
 * @access Private (Admin Only)
 */
router.delete('/inquiries/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM inquiries WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
        res.status(200).json({ message: 'Inquiry deleted successfully!', deletedInquiryId: id });
    } catch (err) {
        console.error(`Error deleting inquiry ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to delete inquiry.' });
    }
});

module.exports = router;
