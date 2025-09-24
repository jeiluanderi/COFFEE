// routes/publicroutes.js

const express = require('express');
const { Pool } = require('pg');
const { authenticateToken } = require('../middleware/authMiddleware'); // Make sure this is imported if you're using it

const router = express.Router();

// DB connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// =======================
// GET /baristas
// =======================
router.get('/baristas', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, role, image_url FROM baristas'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching baristas:', err);
        res.status(500).json({ message: 'Failed to retrieve baristas.' });
    }
});

// =======================
// GET /features
// =======================
router.get('/features', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM top_features ORDER BY id'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching top features:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// =======================
// GET /facts
// =======================
router.get('/facts', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT number, text, delay FROM facts ORDER BY id'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching facts:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =======================
// GET /settings/:key
// =======================
router.get('/settings/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const result = await pool.query(
            'SELECT value FROM settings WHERE key = $1',
            [key]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching setting:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =======================
// GET /locations
// =======================
router.get('/locations', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM locations ORDER BY id'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// =======================
// GET /why-choose-us-features
// =======================
router.get('/why-choose-us-features', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM why_choose_us_features ORDER BY id'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching 'why choose us' features:", err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// =======================
// GET /about
// =======================
router.get('/about', async (req, res) => {
    try {
        const [aboutResult, featuresResult] = await Promise.all([
            pool.query(
                'SELECT years_of_experience, about_title, about_description, button_text, image_url FROM about WHERE id = 1'
            ),
            pool.query(
                'SELECT * FROM about_features ORDER BY id'
            )
        ]);

        if (aboutResult.rows.length === 0) {
            return res.status(404).json({ message: 'About content not found.' });
        }

        const about = aboutResult.rows[0];
        const features = featuresResult.rows.map(row => ({
            icon_class: row.icon_class,
            feature_title: row.feature_title,
            feature_description: row.feature_description
        }));

        res.status(200).json({ about, features });
    } catch (err) {
        console.error('Error fetching about section:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// =======================
// GET /contact
// =======================
router.get('/contact', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT phone, email, socials FROM contact_info LIMIT 1'
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            // Fallback default
            res.json({
                phone: '+012 345 6789',
                email: 'info@example.com',
                socials: [
                    { icon: 'facebook-f', url: 'https://www.facebook.com/' },
                    { icon: 'twitter', url: 'https://twitter.com/' },
                    { icon: 'linkedin-in', url: 'https://www.linkedin.com/' },
                    { icon: 'instagram', url: 'https://www.instagram.com/' }
                ]
            });
        }
    } catch (err) {
        console.error('Error fetching contact info:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// =======================
// GET /testimonials
// =======================
router.get('/testimonials', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM testimonials WHERE status = $1 ORDER BY created_at DESC', ['approved']
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching testimonials:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// =======================
// POST /testimonials (Authenticated User Submission)
// =======================
router.post('/testimonials', authenticateToken, async (req, res) => {
    const { quote, profession, imageUrl } = req.body; 
    const user = req.user;
    
    // LOG EVERYTHING
    console.log("Request body:", req.body);
    console.log("Authenticated user:", user);

    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const newTestimonial = await pool.query(
  `INSERT INTO testimonials 
   (quote, customer_name, profession, image_url, user_id) 
   VALUES ($1, $2, $3, $4, $5) RETURNING *`,
  [quote, user.username, profession, imageUrl, user.id]
);

        console.log("Inserted testimonial:", newTestimonial.rows[0]);
        res.status(201).json({ message: 'Testimonial submitted successfully and is pending approval.' });
    } catch (err) {
        console.error('Error submitting testimonial (full error):', err);
        res.status(500).json({ message: 'Failed to submit testimonial.', error: err.message });
    }
});


// =======================
// GET /services
// =======================
router.get('/services', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, image_src, icon, title, description FROM services ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching services:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router once at the very end
module.exports = router;