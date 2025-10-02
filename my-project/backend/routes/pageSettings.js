// const express = require('express');
// const { Pool } = require('pg');
// const router = express.Router();

// // --- DB Connection ---
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// // =======================
// // GET /api/page-settings/:key
// // Public route to fetch page header data by page key
// // =======================
// router.get('/:key', async (req, res) => {
//   const { key } = req.params;

//   try {
//     const result = await pool.query(
//       'SELECT id, key, title, subtitle, image_url, content FROM page_settings WHERE key = $1',
//       [key]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: 'Page header not found' });
//     }

//     res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error(`Error fetching page header for key ${key}:`, err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // =======================
// // GET /api/admin/page-settings/all
// // Admin route to fetch all page headers
// // =======================
// router.get('/all', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, key, title, subtitle, image_url, content, created_at, updated_at FROM page_settings ORDER BY id ASC'
//     );

//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error('Error fetching all page headers:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // =======================
// // POST /api/admin/page-settings
// // Admin route to create a new page header
// // =======================
// router.post('/admin', async (req, res) => {
//   const { key, title, subtitle, image_url, content } = req.body;

//   if (!key || !title) {
//     return res.status(400).json({ message: 'Key and title are required' });
//   }

//   try {
//     const result = await pool.query(
//       `INSERT INTO page_settings (key, title, subtitle, image_url, content)
//        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [key, title, subtitle || '', image_url || '', content || '']
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error creating page header:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // =======================
// // PUT /api/admin/page-settings/:id
// // Admin route to update a page header
// // =======================
// router.put('/admin/:id', async (req, res) => {
//   const { id } = req.params;
//   const { title, subtitle, image_url, content } = req.body;

//   try {
//     const result = await pool.query(
//       `UPDATE page_settings 
//        SET title = $1, subtitle = $2, image_url = $3, content = $4, updated_at = NOW()
//        WHERE id = $5 RETURNING *`,
//       [title, subtitle || '', image_url || '', content || '', id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: 'Page header not found' });
//     }

//     res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error(`Error updating page header ID ${id}:`, err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // =======================
// // DELETE /api/admin/page-settings/:id
// // Admin route to delete a page header
// // =======================
// router.delete('/admin/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query('DELETE FROM page_settings WHERE id = $1 RETURNING *', [id]);

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: 'Page header not found' });
//     }

//     res.status(200).json({ message: 'Page header deleted successfully', deleted: result.rows[0] });
//   } catch (err) {
//     console.error(`Error deleting page header ID ${id}:`, err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;
