// src/backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool, types } = require('pg');

// --- Configure pg to parse NUMERIC as float ---
types.setTypeParser(types.builtins.NUMERIC, (val) => {
    return val === null ? null : parseFloat(val);
});

// --- Create Express app ---
const app = express();
const port = process.env.PORT || 3001;

// --- Database Connection ---
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test DB connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error acquiring DB client:', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('❌ Error executing DB test query:', err.stack);
        }
        console.log('✅ Database connected at:', result.rows[0].now);
    });
});

// --- CORS Configuration ---
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`Blocked by CORS: ${origin}`), false);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// --- Middleware ---
app.use(express.json());

// --- Routes ---
// Group all Admin routes together
app.use('/api/admin/inquiries', require('./routes/adminInquiriesRoutes')); 
app.use('/api/admin/coffees', require('./routes/coffeeAdminRoutes'));
app.use('/api/categories/admin', require('./routes/categoryAdminRoutes')); 
app.use('/api/admin/users', require('./routes/userAdminRoutes'));
app.use('/api/admin/baristas', require('./routes/baristaAdminRoutes.js'));
app.use('/api/admin/blogs', require('./routes/blogAdminRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes')); 
app.use('/api/admin/testimonials', require('./routes/testimonialAdminRoutes'));
app.use('/api/admin', require('./routes/factsAdminRoutes'));
app.use('/api/services', require('./routes/serviceAdminRoutes'));
app.use('/api/admin/hero-slides', require('./routes/hero-slidesAdminRoutes.js'));
app.use('/api/admin/Settings',require('./routes/SettingsAdminRoutes.js'))
// Add all public routes
app.use('/api/hero-slides', require('./routes/hero-slidesRoutes.js'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api/coffees', require('./routes/coffeeRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes')); 
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes')); // 👈 Use your original order route
app.use('/api', require('./routes/publicroutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

// --- Start Server ---
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});