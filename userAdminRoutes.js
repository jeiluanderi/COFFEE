const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs'); 
const { authorizeRoles, authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET all users with pagination (Admin Only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // 1. Get the paginated list of users
        const usersQuery = `
            SELECT id, username, email, role, created_at
            FROM users 
            ORDER BY created_at DESC
            LIMIT $1
            OFFSET $2;
        `;
        const usersResult = await pool.query(usersQuery, [limit, offset]);
        const users = usersResult.rows;

        // 2. Get the total count of all users
        const countQuery = `SELECT COUNT(*) FROM users;`;
        const countResult = await pool.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count);

        // Send a single JSON response with both the users and the total count
        res.json({ users, totalCount });

    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to retrieve users.' });
    }
});

// POST /admin/users - Create New User (Admin Only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Username, email, password, and role are required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, role]
        );
        res.status(201).json({ message: 'User created.', user: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'A user with this email or username already exists.' });
        }
        console.error('❌ Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

// PUT /admin/users/:id - Update User (Admin Only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const fields = [];
    const values = [];
    let queryIndex = 1;
    if (username !== undefined) { fields.push(`username = $${queryIndex++}`); values.push(username); }
    if (email !== undefined) { fields.push(`email = $${queryIndex++}`); values.push(email); }
    if (role !== undefined) { fields.push(`role = $${queryIndex++}`); values.push(role); }
    
    // Check if there are any fields to update other than `updated_at`
    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }
    values.push(id);
    try {
        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING id, username, email, role, created_at`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User updated successfully!', user: result.rows[0] });
    } catch (err) {
        console.error(`Error updating user ID ${id}:`, err);
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Email or username already exists.' });
        }
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

// DELETE /admin/users/:id - Delete User (Admin Only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        console.error('❌ Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});

module.exports = router;