// backend/routes/users.js

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

// --- User Profile Route (Authenticated User) ---

/**
 * @route GET /api/profile - Fetches the authenticated user's profile information
 * @access Private (Authenticated User)
 */
router.get('/profile', authenticateToken, (req, res) => {
    // req.user is populated by authenticateToken middleware
    // Exclude password_hash for security
    const { password_hash, ...userWithoutHash } = req.user;
    res.json({ message: 'User profile retrieved successfully', user: userWithoutHash });
});


// --- Admin-only User Management Routes ---

/**
 * @route GET /api/admin/users - Get all users
 * @access Private (Admin Only)
 */
router.get('/admin/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, first_name, last_name, role, created_at, updated_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: 'Failed to retrieve users.' });
    }
});

/**
 * @route PUT /api/admin/users/:id - Update user role or profile info
 * @access Private (Admin Only)
 */
router.put('/admin/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { username, email, first_name, last_name, role } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (username !== undefined) { fields.push(`username = $${queryIndex++}`); values.push(username); }
    if (email !== undefined) { fields.push(`email = $${queryIndex++}`); values.push(email); }
    if (first_name !== undefined) { fields.push(`first_name = $${queryIndex++}`); values.push(first_name); }
    if (last_name !== undefined) { fields.push(`last_name = $${queryIndex++}`); values.push(last_name); }
    if (role !== undefined) { fields.push(`role = $${queryIndex++}`); values.push(role); }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);


    if (fields.length === 1 && fields[0].includes('updated_at')) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING id, username, email, first_name, last_name, role, created_at, updated_at`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User updated successfully!', user: result.rows[0] });
    } catch (err) {
        console.error(`Error updating user ID ${id}:`, err.message);
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Email or username already exists.' });
        }
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

module.exports = router;
