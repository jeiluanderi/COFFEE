// POST /hero-slides (Admin Only)
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

// GET /hero-slides - Fetch all hero slides (Admin Only)
// This route is crucial for your frontend to display the list of slides.
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM hero ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching hero slides:', err);
        res.status(500).json({ message: 'Failed to retrieve hero slides.' });
    }
});

// POST /hero-slides - Create a new hero slide (Admin Only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { image_src, title, button_text, button_href } = req.body;
    // Add validation to ensure required fields are present
    if (!image_src || !title) {
        return res.status(400).json({ message: 'Image source and title are required.' });
    }
    try {
        const newSlide = await pool.query(
            `INSERT INTO hero (image_src, title, button_text, button_href) VALUES ($1, $2, $3, $4) RETURNING *`,
            [image_src, title, button_text, button_href]
        );
        res.status(201).json(newSlide.rows[0]);
    } catch (err) {
        console.error('Error creating hero slide:', err);
        res.status(500).json({ message: 'Failed to create slide.' });
    }
});

// PUT /hero-slides/:id - Update an existing hero slide (Admin Only)
// The route path is now just '/', matching the mount path in server.js
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { image_src, title, button_text, button_href } = req.body;
    
    // Create a dynamic query to handle partial updates
    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (image_src !== undefined) { fields.push(`image_src = $${queryIndex++}`); values.push(image_src); }
    if (title !== undefined) { fields.push(`title = $${queryIndex++}`); values.push(title); }
    if (button_text !== undefined) { fields.push(`button_text = $${queryIndex++}`); values.push(button_text); }
    if (button_href !== undefined) { fields.push(`button_href = $${queryIndex++}`); values.push(button_href); }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }
    
    values.push(id);
    
    try {
        const updatedSlide = await pool.query(
            `UPDATE hero SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`,
            values
        );
        if (updatedSlide.rows.length === 0) {
            return res.status(404).json({ message: 'Hero slide not found.' });
        }
        res.status(200).json(updatedSlide.rows[0]);
    } catch (err) {
        console.error('Error updating hero slide:', err);
        res.status(500).json({ message: 'Failed to update slide.' });
    }
});

// DELETE /hero-slides/:id - Delete a hero slide (Admin Only)
// The route path is now just '/', matching the mount path in server.js
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSlide = await pool.query('DELETE FROM hero WHERE id = $1 RETURNING *', [id]);
        if (deletedSlide.rows.length === 0) {
            return res.status(404).json({ message: 'Hero slide not found.' });
        }
        res.status(200).json({ message: 'Hero slide deleted successfully!' });
    } catch (err) {
        console.error('Error deleting hero slide:', err);
        res.status(500).json({ message: 'Failed to delete slide.' });
    }
});

module.exports = router;