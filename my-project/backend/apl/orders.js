// backend/routes/orders.js

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

// All routes in this file will implicitly be under /api/orders
// and will require authentication via authenticateToken middleware.
router.use(authenticateToken);

/**
 * @route GET /api/orders - Fetch orders (admin sees all, customer sees their own)
 * @access Private (Authenticated User, Admin can see all)
 */
router.get('/orders', async (req, res) => {
    try {
        let queryText = 'SELECT id, user_id, order_date, total_amount, status, shipping_address, billing_address, payment_method, payment_status FROM orders';
        let queryParams = [];

        if (req.user.role === 'customer') {
            queryText += ' WHERE user_id = $1';
            queryParams.push(req.user.id);
        }
        queryText += ' ORDER BY order_date DESC';

        const result = await pool.query(queryText, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @route POST /api/orders - Create a new order
 * @access Private (Authenticated User)
 */
router.post('/orders', async (req, res) => {
    const { total_amount, items, shipping_address, billing_address, payment_method } = req.body;
    const user_id = req.user.id;

    if (total_amount === undefined || !Array.isArray(items) || items.length === 0 || !shipping_address || !billing_address || !payment_method) {
        return res.status(400).json({ message: 'Missing required order details: total_amount, items, shipping_address, billing_address, payment_method are required.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const orderResult = await client.query(
            'INSERT INTO orders (user_id, total_amount, status, shipping_address, billing_address, payment_method, payment_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, user_id, order_date, total_amount, status, shipping_address, billing_address, payment_method, payment_status',
            [user_id, total_amount, 'pending', shipping_address, billing_address, payment_method, 'unpaid']
        );
        const newOrder = orderResult.rows[0];

        for (const item of items) {
            const { coffee_id, quantity } = item;
            const coffeePriceResult = await client.query('SELECT price FROM coffees WHERE id = $1', [coffee_id]);
            if (coffeePriceResult.rows.length === 0) {
                throw new Error(`Coffee with ID ${coffee_id} not found.`);
            }
            const price_at_order = coffeePriceResult.rows[0].price;

            await client.query(
                'INSERT INTO order_items (order_id, coffee_id, quantity, price_at_order) VALUES ($1, $2, $3, $4)',
                [newOrder.id, coffee_id, quantity, price_at_order]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order created successfully!', order: newOrder });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating new order:', err.message);
        res.status(500).json({ error: 'Failed to create order. Please try again later.' });
    } finally {
        client.release();
    }
});

/**
 * @route PUT /api/orders/:id - Update an order's status
 * @access Private (Admin Only)
 */
router.put('/orders/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { status, payment_status, shipping_address, billing_address, payment_method, total_amount } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (status !== undefined) { fields.push(`status = $${queryIndex++}`); values.push(status); }
    if (payment_status !== undefined) { fields.push(`payment_status = $${queryIndex++}`); values.push(payment_status); }
    if (shipping_address !== undefined) { fields.push(`shipping_address = $${queryIndex++}`); values.push(shipping_address); }
    if (billing_address !== undefined) { fields.push(`billing_address = $${queryIndex++}`); values.push(billing_address); }
    if (payment_method !== undefined) { fields.push(`payment_method = $${queryIndex++}`); values.push(payment_method); }
    if (total_amount !== undefined) { fields.push(`total_amount = $${queryIndex++}`); values.push(total_amount); }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);


    if (fields.length === 1 && fields[0].includes('updated_at')) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE orders SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully', order: result.rows[0] });
    } catch (err) {
        console.error(`Error updating order ID ${id}:`, err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @route DELETE /api/orders/:id - Delete an order by ID
 * @access Private (Admin Only)
 */
router.delete('/orders/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);
        const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully!', deletedOrderId: id });
    } catch (err) {
        console.error(`Error deleting order ID ${id}:`, err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
