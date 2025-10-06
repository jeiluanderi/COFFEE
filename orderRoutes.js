const express = require("express");
const { Pool } = require("pg");
const { authorizeRoles, authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// =======================
// DB Connection
// =======================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// =======================
// GET /orders - Admin Only
// =======================
router.get("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const queryText = `
      SELECT 
        o.id,
        o.user_id,
        o.customer_name,
        o.customer_email,
        o.total_price,
        o.status,
        o.payment_status, -- Include the payment status
        o.created_at,
        o.updated_at,
        o.shipping_address,
        o.phone_number,
        o.service_type,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'coffee_id', oi.coffee_id,
              'coffee_name', c.name,
              'quantity', oi.quantity,
              'price_at_time_of_order', oi.price_at_time_of_order
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN coffees c ON oi.coffee_id = c.id
      GROUP BY 
        o.id, o.user_id, o.customer_name, o.customer_email,
        o.total_price, o.status, o.payment_status, o.created_at, o.updated_at,
        o.shipping_address, o.phone_number, o.service_type
      ORDER BY o.created_at DESC;
    `;

    const result = await pool.query(queryText);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to retrieve orders." });
  }
});

// =======================
// POST /orders - User Checkout
// =======================
router.post("/", authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const { customerName, customerEmail, totalPrice, cartItems, shipping_address, phone_number, service_type, payment_status } = req.body;

  if (!customerName || !customerEmail || !totalPrice || !Array.isArray(cartItems) || cartItems.length === 0 || !payment_status) {
    return res.status(400).json({ message: "Invalid order data. Please ensure all required fields are present." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert payment_status into the orders table
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, total_price, shipping_address, phone_number, service_type, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [user_id, customerName, customerEmail, totalPrice, shipping_address, phone_number, service_type, payment_status]
    );
    const orderId = orderResult.rows[0].id;

    const itemQueryText = `
      INSERT INTO order_items (order_id, coffee_id, quantity, price_at_time_of_order)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of cartItems) {
      if (!item.coffee_id) {
        console.warn("Skipping invalid cart item:", item);
        continue;
      }
      await client.query(itemQueryText, [orderId, item.coffee_id, item.quantity, item.price]);
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Order submitted successfully!", orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error submitting order:", err);
    res.status(500).json({ message: "Failed to submit order. Please try again." });
  } finally {
    client.release();
  }
});

// =======================
// PUT /orders/:id - Admin Only
// =======================
router.put("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const { id } = req.params;
  const { status, payment_status, shipping_address, billing_address, payment_method, total_amount, service_type } = req.body;

  const fields = [];
  const values = [];
  let queryIndex = 1;

  if (status !== undefined) { fields.push(`status = $${queryIndex++}`); values.push(status); }
  if (payment_status !== undefined) { fields.push(`payment_status = $${queryIndex++}`); values.push(payment_status); }
  if (shipping_address !== undefined) { fields.push(`shipping_address = $${queryIndex++}`); values.push(shipping_address); }
  if (billing_address !== undefined) { fields.push(`billing_address = $${queryIndex++}`); values.push(billing_address); }
  if (payment_method !== undefined) { fields.push(`payment_method = $${queryIndex++}`); values.push(payment_method); }
  if (total_amount !== undefined) { fields.push(`total_price = $${queryIndex++}`); values.push(total_amount); }
  if (service_type !== undefined) { fields.push(`service_type = $${queryIndex++}`); values.push(service_type); }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  if (fields.length === 1) {
    return res.status(400).json({ message: "No fields provided for update." });
  }

  values.push(id);

  try {
    const result = await pool.query(
      `UPDATE orders SET ${fields.join(", ")} WHERE id = $${queryIndex} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order updated successfully", order: result.rows[0] });
  } catch (err) {
    console.error(`Error updating order ID ${id}:`, err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// =======================
// DELETE /orders/:id - Admin Only
// =======================
// DELETE /orders/:id - Admin Only, only deletes rejected or pending
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    // check status first
    const check = await pool.query("SELECT status FROM orders WHERE id = $1", [id]);
    if (check.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const status = check.rows[0].status;
    if (!["rejected"].includes(status)) {
  return res.status(400).json({ message: "Only rejected orders can be deleted" });
}

    // delete items first, then order
    await pool.query("DELETE FROM order_items WHERE order_id = $1", [id]);
    await pool.query("DELETE FROM orders WHERE id = $1 RETURNING id", [id]);

    res.status(200).json({ message: `Order ${id} deleted successfully!`, deletedOrderId: id });
  } catch (err) {
    console.error(`Error deleting order ID ${id}:`, err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
