// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const { Pool } = require('pg'); // Import Pool here as well
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Re-initialize pool to ensure it's accessible in this module
// This is typically done by importing the same pool instance or configuring it
// For simplicity, re-creating here, but in a larger app, you might export pool from a db.js file.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

/**
 * @route POST /api/register - Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Backend: Registering user ${email} with hashed password (first 10 chars): ${hashedPassword.substring(0, 10)}...`);
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, 'customer']
        );
        res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Email or username already exists.' });
        }
        console.error('Error during user registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @route POST /api/login - Log in an existing user
 * @access Public
 * (Includes detailed debugging logs for password comparison)
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Backend: [POST /api/login] Attempting login for email: ${email}`);
    if (!email || !password) {
        console.log('Backend: [POST /api/login] Missing email or password.');
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log(`Backend: [POST /api/login] User not found for email: ${email}`);
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        console.log(`Backend: [POST /api/login] User found: ${user.username}`);
        console.log(`Backend: [POST /api/login] Stored password hash (first 10 chars): ${user.password_hash ? user.password_hash.substring(0, 10) : 'NULL'}...`);
        console.log(`Backend: [POST /api/login] Provided password (first 5 chars): ${password ? password.substring(0, 5) : 'NULL'}...`);

        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log(`Backend: [POST /api/login] bcrypt.compare result: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Get JWT_SECRET from app settings (set in server.js)
        const JWT_SECRET = req.app.get('jwtSecret');
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        console.log(`Backend: [POST /api/login] Login successful for user: ${user.username}`);
        res.status(200).json({ message: 'Login successful!', token, user: { id: user.id, username: user.username, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name } });
    } catch (err) {
        console.error('Backend: [POST /api/login] Error during user login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
