// const express = require('express');
// const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const { authenticateToken } = require('../middleware/auth');
// const { Pool } = require('pg');

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

// /**
//  * @route POST /api/orders
//  * @desc Creates a new order after verifying payment
//  * @access Private (requires token)
//  */
// router.post('/', authenticateToken, async (req, res) => {
//     const {
//         customerName,
//         customerEmail,
//         totalPrice,
//         cartItems,
//         shipping_address,
//         phone_number,
//         paymentIntentId // The key from the frontend
//     } = req.body;

//     const client = await pool.connect();
//     try {
//         // Step 1: Verify the payment intent with Stripe to ensure it was successful
//         const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//         if (paymentIntent.status !== 'succeeded') {
//             return res.status(400).json({ message: 'Payment verification failed. Please try again.' });
//         }

//         // Start a database transaction
//         await client.query('BEGIN');

//         // Step 2: Insert the new order into the `orders` table
//         const orderResult = await client.query(
//             `INSERT INTO orders (customer_name, customer_email, total_price, shipping_address, phone_number, payment_status, payment_intent_id) 
//              VALUES ($1, $2, $3, $4, $5, 'paid', $6) RETURNING id`,
//             [customerName, customerEmail, totalPrice, shipping_address, phone_number, paymentIntentId]
//         );
//         const orderId = orderResult.rows[0].id;

//         // Step 3: Insert each cart item into the `order_items` table
//         const orderItemsQuery = `INSERT INTO order_items (order_id, coffee_id, quantity, price) VALUES ($1, $2, $3, $4)`;
//         for (const item of cartItems) {
//             await client.query(orderItemsQuery, [orderId, item.coffee_id, item.quantity, item.price]);
//         }

//         // Commit the transaction
//         await client.query('COMMIT');

//         // Respond to the client
//         res.status(201).json({ 
//             message: 'Order placed successfully and payment confirmed.', 
//             orderId: orderId 
//         });

//     } catch (error) {
//         // Rollback the transaction on error
//         await client.query('ROLLBACK');
//         console.error('Error placing order:', error);
//         if (error.raw && error.raw.code === 'resource_missing') {
//             // Specific error for a missing Stripe payment intent
//             return res.status(400).json({ message: 'Invalid payment ID. Payment could not be verified.' });
//         }
//         res.status(500).json({ message: 'Failed to place order. An unexpected error occurred.', error: error.message });
//     } finally {
//         client.release();
//     }
// });

// module.exports = router;