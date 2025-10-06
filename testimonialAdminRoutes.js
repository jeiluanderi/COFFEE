// routes/testimonialAdminRoutes.js

const express = require('express');
const { Pool } = require('pg');
const { authorizeRoles, authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET / (Admin Only) - This route will handle GET /api/admin/testimonials
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const testimonialsQuery = `
            SELECT id, customer_name, profession, quote, image_url, status, created_at, updated_at
            FROM testimonials
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2;
        `;
        const countQuery = `SELECT COUNT(*) FROM testimonials;`;

        const testimonialsResult = await pool.query(testimonialsQuery, [limit, offset]);
        const countResult = await pool.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count, 10);

        // Return paginated data for the admin dashboard
        res.status(200).json({
            testimonials: testimonialsResult.rows,
            totalCount: totalCount
        });
    } catch (err) {
        console.error('Error fetching testimonials:', err);
        res.status(500).json({ message: 'Failed to fetch testimonials.' });
    }
});

// POST / (Public/User) - This route will handle POST /api/admin/testimonials if needed, but it's not ideal.
// A public route should be in a separate router.
// This is for demonstration, as your frontend doesn't use it.
router.post('/', async (req, res) => {
    const { customer_name, profession, quote, image_url } = req.body;
    try {
        const newTestimonial = await pool.query(
            `INSERT INTO testimonials (customer_name, profession, quote, image_url, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
            [customer_name, profession, quote, image_url]
        );
        res.status(201).json(newTestimonial.rows[0]);
    } catch (err) {
        console.error('Error creating testimonial:', err);
        res.status(500).json({ message: 'Failed to create testimonial.' });
    }
});

// PUT /:id (Admin Only) - This route will handle PUT /api/admin/testimonials/:id
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { customer_name, profession, quote, image_url, status } = req.body;
    try {
        const updatedTestimonial = await pool.query(
            `UPDATE testimonials SET customer_name = $1, profession = $2, quote = $3, image_url = $4, status = $5 WHERE id = $6 RETURNING *`,
            [customer_name, profession, quote, image_url, status, id]
        );
        if (updatedTestimonial.rows.length === 0) {
            return res.status(404).json({ message: 'Testimonial not found.' });
        }
        res.status(200).json(updatedTestimonial.rows[0]);
    } catch (err) {
        console.error('Error updating testimonial:', err);
        res.status(500).json({ message: 'Failed to update testimonial.' });
    }
});

// DELETE /:id (Admin Only) - This route will handle DELETE /api/admin/testimonials/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTestimonial = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);
        if (deletedTestimonial.rows.length === 0) {
            return res.status(404).json({ message: 'Testimonial not found.' });
        }
        res.status(200).json({ message: 'Testimonial deleted successfully!' });
    } catch (err) {
        console.error('Error deleting testimonial:', err);
        res.status(500).json({ message: 'Failed to delete testimonial.' });
    }
});

module.exports = router;