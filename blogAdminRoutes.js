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

// ✅ GET all blog posts (admin view)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM blog_posts ORDER BY created_at DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching blog posts:', err);
        res.status(500).json({ error: 'Failed to retrieve blog posts.' });
    }
});

// ✅ CREATE a new blog post
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { title, content, author, image_url } = req.body;
    if (!title || !content || !author) {
        return res.status(400).json({ message: 'Title, content, and author are required.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO blog_posts (title, content, author, image_url) VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, content, author, image_url]
        );
        res.status(201).json({ message: 'Blog post created.', post: result.rows[0] });
    } catch (err) {
        console.error('❌ Error creating blog post:', err);
        res.status(500).json({ error: 'Failed to create blog post.' });
    }
});

// ✅ GET a single blog post by ID (admin view)
router.get('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM blog_posts WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Error fetching blog post:', err);
        res.status(500).json({ error: 'Failed to retrieve blog post.' });
    }
});

// ✅ UPDATE a blog post
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { title, content, author, image_url } = req.body;
    const fields = [];
    const values = [];
    let i = 1;

    if (title !== undefined) {
        fields.push(`title = $${i++}`);
        values.push(title);
    }
    if (content !== undefined) {
        fields.push(`content = $${i++}`);
        values.push(content);
    }
    if (author !== undefined) {
        fields.push(`author = $${i++}`);
        values.push(author);
    }
    if (image_url !== undefined) {
        fields.push(`image_url = $${i++}`);
        values.push(image_url);
    }
    
    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields to update.' });
    }
    
    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE blog_posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }
        res.json({ message: 'Blog post updated.', post: result.rows[0] });
    } catch (err) {
        console.error('❌ Error updating blog post:', err);
        res.status(500).json({ error: 'Failed to update blog post.' });
    }
});

// ✅ DELETE a blog post
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }
        res.json({ message: 'Blog post deleted.', id: result.rows[0].id });
    } catch (err) {
        console.error('❌ Error deleting blog post:', err);
        res.status(500).json({ error: 'Failed to delete blog post.' });
    }
});

module.exports = router;