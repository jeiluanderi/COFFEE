// routes/categoryAdminRoutes.js (Corrected Code)
const express = require('express');
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET /api/admin/categories - Paginated route for the admin dashboard
// This path now matches both /admin and /admin/
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const totalCountResult = await pool.query('SELECT COUNT(*) FROM categories');
        const totalCount = parseInt(totalCountResult.rows[0].count);

        const categoriesQuery = `
            SELECT id, name FROM categories
            ORDER BY name ASC
            OFFSET $1
            LIMIT $2;
        `;
        const categoriesResult = await pool.query(categoriesQuery, [offset, limit]);

        res.json({
            categories: categoriesResult.rows,
            totalCount: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (err) {
        console.error('❌ Error fetching categories:', err);
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
});

// POST /api/admin/categories - Create a new category
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
            [name]
        );
        res.status(201).json({ message: 'Category added successfully!', category: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'A category with this name already exists.' });
        }
        console.error('❌ Error adding category:', err);
        res.status(500).json({ error: 'Failed to add category.' });
    }
});

// PUT /api/admin/categories/:id - Update an existing category
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'New category name is required.' });
    }
    try {
        const result = await pool.query(
            'UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name',
            [name, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.json({ message: 'Category updated successfully!', category: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'A category with this name already exists.' });
        }
        console.error('❌ Error updating category:', err);
        res.status(500).json({ error: 'Failed to update category.' });
    }
});

// DELETE /api/admin/categories/:id - Delete a category
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.json({ message: 'Category deleted successfully.' });
    } catch (err) {
        console.error('❌ Error deleting category:', err);
        res.status(500).json({ error: 'Failed to delete category.' });
    }
});

module.exports = router;