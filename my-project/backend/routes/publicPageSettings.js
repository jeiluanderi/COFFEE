const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// --- DB Connection ---
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// GET /api/page-settings/:key
router.get('/:key', async (req, res) => {
  const { key } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, key, title, subtitle, image_url, content FROM page_settings WHERE key = $1',
      [key]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Page header not found' });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching page header for key ${key}:`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
