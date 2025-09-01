// backend/routes/coffees.js

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
 * @route GET /api/coffees - Retrieves a list of all coffee products
 * @access Public
 */
router.get('/coffees', async (req, res) => {
    try {
        const queryText = 'SELECT id, name, description, price, image_url, category_id, stock_quantity, origin, roast_level FROM coffees ORDER BY name ASC';
        const result = await pool.query(queryText);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching coffees:', err.message);
        res.status(500).json({ error: 'Failed to retrieve coffee products.' });
    }
});

/**
 * @route GET /api/coffees/:id - Retrieves a single coffee product by ID
 * @access Public
 */
router.get('/coffees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT id, name, description, price, image_url, category_id, stock_quantity, origin, roast_level FROM coffees WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Coffee product not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Error fetching coffee with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to retrieve coffee product.' });
    }
});

/**
 * @route POST /api/coffees - Adds a new coffee product
 * @access Private (Admin Only)
 */
router.post('/coffees', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { name, description, price, image_url, category_id, stock_quantity, origin, roast_level } = req.body;
    if (!name || !price || !category_id) {
        return res.status(400).json({ message: 'Name, price, and category ID are required for a new coffee.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO coffees (name, description, price, image_url, category_id, stock_quantity, origin, roast_level) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, description, price, image_url, category_id, stock_quantity, origin, roast_level',
            [name, description, price, image_url, category_id, stock_quantity || 0, origin, roast_level]
        );
        res.status(201).json({ message: 'Coffee added successfully!', coffee: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Coffee with this name already exists.' });
        }
        console.error('Error adding new coffee:', err.message);
        res.status(500).json({ error: 'Failed to add coffee product.' });
    }
});

/**
 * @route PUT /api/coffees/:id - Updates an existing coffee product
 * @access Private (Admin Only)
 */
router.put('/coffees/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, stock_quantity, origin, roast_level } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (name !== undefined) { fields.push(`name = $${queryIndex++}`); values.push(name); }
    if (description !== undefined) { fields.push(`description = $${queryIndex++}`); values.push(description); }
    if (price !== undefined) { fields.push(`price = $${queryIndex++}`); values.push(price); }
    if (image_url !== undefined) { fields.push(`image_url = $${queryIndex++}`); values.push(image_url); }
    if (category_id !== undefined) { fields.push(`category_id = $${queryIndex++}`); values.push(category_id); }
    if (stock_quantity !== undefined) { fields.push(`stock_quantity = $${queryIndex++}`); values.push(stock_quantity); }
    if (origin !== undefined) { fields.push(`origin = $${queryIndex++}`); values.push(origin); }
    if (roast_level !== undefined) { fields.push(`roast_level = $${queryIndex++}`); values.push(roast_level); }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 1 && fields[0].includes('updated_at')) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE coffees SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Coffee product not found.' });
        }
        res.status(200).json({ message: 'Coffee updated successfully!', coffee: result.rows[0] });
    } catch (err) {
        console.error(`Error updating coffee with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to update coffee product.' });
    }
});

/**
 * @route DELETE /api/coffees/:id - Deletes a coffee product
 * @access Private (Admin Only)
 */
router.delete('/coffees/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM coffees WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Coffee product not found.' });
        }
        res.status(200).json({ message: 'Coffee deleted successfully!', deletedCoffeeId: id });
    } catch (err) {
        console.error(`Error deleting coffee with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to delete coffee product.' });
    }
});

module.exports = router;
