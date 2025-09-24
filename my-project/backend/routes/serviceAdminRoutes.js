// src/backend/routes/serviceAdminRoutes.js

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

// POST route - Handles POST requests to /api/services
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { image_src, icon, title, description } = req.body;
    
    try {
        const newService = await pool.query(
            `INSERT INTO services (image_src, icon, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
            [image_src, icon, title, description]
        );
        
        res.status(201).json(newService.rows[0]);
    } catch (err) {
        console.error('Error creating service:', err);
        res.status(500).json({ message: 'Failed to create service.' });
    }
});

// PUT route - Handles PUT requests to /api/services/:id
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { image_src, icon, title, description } = req.body;
    
    const updates = [];
    const values = [];
    let queryIndex = 1;

    if (image_src !== undefined) {
        updates.push(`image_src = $${queryIndex++}`);
        values.push(image_src);
    }
    if (icon !== undefined) {
        updates.push(`icon = $${queryIndex++}`);
        values.push(icon);
    }
    if (title !== undefined) {
        updates.push(`title = $${queryIndex++}`);
        values.push(title);
    }
    if (description !== undefined) {
        updates.push(`description = $${queryIndex++}`);
        values.push(description);
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update.' });
    }

    values.push(id); 
    
    try {
        const updatedService = await pool.query(
            `UPDATE services SET ${updates.join(', ')} WHERE id = $${queryIndex} RETURNING *`,
            values
        );

        if (updatedService.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found.' });
        }
        res.status(200).json(updatedService.rows[0]);
    } catch (err) {
        console.error('Error updating service:', err);
        res.status(500).json({ message: 'Failed to update service.' });
    }
});

// DELETE route - Handles DELETE requests to /api/services/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const deletedService = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
        if (deletedService.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found.' });
        }
        res.status(200).json({ message: 'Service deleted successfully!' });
    } catch (err) {
        console.error('Error deleting service:', err);
        res.status(500).json({ message: 'Failed to delete service.' });
    }
});

module.exports = router;