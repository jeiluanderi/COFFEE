// routes/analyticsRoutes.js
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

// GET /api/analytics/summary - Admin Only
router.get('/summary', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const totalSalesQuery = await pool.query('SELECT SUM(total_price) FROM orders WHERE status = $1', ['completed']);
        const totalOrdersQuery = await pool.query('SELECT COUNT(*) FROM orders');
        const totalUsersQuery = await pool.query('SELECT COUNT(*) FROM users');
        const totalCoffeesQuery = await pool.query('SELECT COUNT(*) FROM coffees');

        const summary = {
            total_sales: parseFloat(totalSalesQuery.rows[0].sum || 0),
            total_orders: parseInt(totalOrdersQuery.rows[0].count, 10),
            total_users: parseInt(totalUsersQuery.rows[0].count, 10),
            total_coffees: parseInt(totalCoffeesQuery.rows[0].count, 10),
        };
        res.json(summary);
    } catch (err) {
        console.error('❌ Error fetching summary data:', err);
        res.status(500).json({ error: 'Failed to fetch summary data.' });
    }
});

// GET /api/analytics/sales - Admin Only
router.get('/sales', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const timeframe = req.query.timeframe || 'weekly';
    let interval = 'day';
    let intervalValue = '1 week';
    let orderClause = 'ORDER BY date_trunc ASC';

    if (timeframe === 'monthly') {
        interval = 'month';
        intervalValue = '1 month';
    }

    try {
        const queryText = `
            SELECT
                date_trunc('${interval}', created_at) as date_trunc,
                SUM(total_price) as total_sales
            FROM orders
            WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '${intervalValue}'
            GROUP BY date_trunc
            ${orderClause};
        `;
        const result = await pool.query(queryText);
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching sales analytics:', err);
        res.status(500).json({ error: 'Failed to fetch sales data.' });
    }
});

// GET /api/analytics/bar-data - Admin Only
router.get('/bar-data', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const queryText = `
            SELECT c.name as product_name, SUM(oi.quantity) as total_quantity_sold
            FROM order_items oi
            JOIN coffees c ON oi.coffee_id = c.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status = 'completed'
            GROUP BY c.name
            ORDER BY total_quantity_sold DESC
            LIMIT 10;
        `;
        const result = await pool.query(queryText);
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching product sales data:', err);
        res.status(500).json({ error: 'Failed to fetch product sales data.' });
    }
});

module.exports = router;