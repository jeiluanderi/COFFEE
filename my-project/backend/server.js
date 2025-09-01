// server.js

// Load environment variables from .env file. This MUST be at the very top.
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const types = require('pg').types; // Import pg types
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Configure pg to parse NUMERIC types as floats ---
// PostgreSQL's NUMERIC type has OID 1700. We tell the pg driver to parse it as a float.
types.setTypeParser(types.builtins.NUMERIC, (val) => {
    // If val is null, return null, otherwise parse as float.
    // This handles cases where a price might legitimately be NULL in the DB (though not expected for price).
    return val === null ? null : parseFloat(val);
});
// ----------------------------------------------------

const app = express();
// Port for the backend server. Default to 3001 if not specified in .env.
// This will now correctly pick up PORT=3001 from your .env file
const port = process.env.PORT || 3001;
// Secret key for JWT signing. Crucial for security, must be a strong, random string.
const JWT_SECRET = process.env.JWT_SECRET;

// --- Database Configuration ---
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE, // Ensure this matches your PostgreSQL database name
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, // Default PostgreSQL port is 5432
});

// Test the database connection when the server starts.
// This provides immediate feedback on connection status.
pool.connect((err, client, release) => {
    if (err) {
        // Log a clear error if connection fails.
        return console.error('❌ Error acquiring database client:', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release(); // Release the client back to the pool immediately after testing.
        if (err) {
            // Log error if the test query fails.
            return console.error('❌ Error executing database test query:', err.stack);
        }
        // Log success message with the current database time.
        console.log('✅ Backend: Database connected successfully at:', result.rows[0].now);
    });
});

// --- Middleware ---
// Configure CORS to allow requests from your frontend URL(s).
// Use environment variables for allowed origins for flexibility
const allowedOrigins = [
    process.env.FRONTEND_URL, // e.g., http://localhost:5173 (coffee website)
    process.env.ADMIN_URL     // e.g., http://localhost:5174 (admin folder)
].filter(Boolean); // Filter out any undefined/null values

console.log('Backend CORS: Allowed origins configured:', allowedOrigins);

app.use(
    cors({
        origin: (origin, callback) => {
            console.log(`Backend CORS: Request from origin: ${origin}`);
            // Allow requests with no origin (like same-origin requests, mobile apps, or curl requests)
            if (!origin) {
                console.log('Backend CORS: Allowing request with no origin.');
                return callback(null, true);
            }
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = `Backend CORS: Blocking request from origin: ${origin}. Not in allowed list.`;
                console.error(msg); // Log the block
                return callback(new Error(msg), false);
            }
            console.log(`Backend CORS: Allowing request from origin: ${origin}.`);
            return callback(null, true);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // This is important for sending cookies/auth headers
    })
);
// Middleware to parse incoming JSON payloads in request bodies.
app.use(express.json());

// --- Authentication Middleware ---
// Verifies the JWT token from the 'Authorization' header.
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Extract token from 'Bearer <token>' format.
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // If no token is provided, return 401 Unauthorized.
        return res.status(401).json({ error: 'Authentication failed. Token is missing.' });
    }

    // Verify the token using the secret key.
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // If token is invalid or expired, return 403 Forbidden.
            return res.status(403).json({ error: 'Authentication failed. Invalid or expired token.' });
        }
        // Attach the decoded user payload to the request object.
        req.user = user;
        next(); // Proceed to the next middleware or route handler.
    });
};

// --- Authorization Middleware ---
// Checks if the authenticated user has one of the allowed roles.
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // If req.user is not set (i.e., authenticateToken failed or or wasn't used),
        // or if the user's role is not in the allowedRoles list, return 403 Forbidden.
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
        }
        next(); // User has the required role, proceed.
    };
};

// --- Unprotected Routes ---

// POST /api/register - Register a new user
// Accepts username, email, and password. Default role is 'customer'.
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Basic validation for required fields.
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Hash the password before storing it in the database for security.
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Backend: Registering user ${email} with hashed password (first 10 chars): ${hashedPassword.substring(0, 10)}...`);
        // Insert new user into the 'users' table. Default role to 'customer'.
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, 'customer']
        );
        // Respond with success message and new user details (excluding password hash).
        res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });
    } catch (err) {
        // Handle duplicate email/username error (PostgreSQL unique violation code).
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Email or username already exists.' });
        }
        // Log other server errors.
        console.error('Error during user registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/login - Log in an existing user
// Accepts email and password. Generates and returns a JWT on successful login.
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Backend: [POST /api/login] Attempting login for email: ${email}`);
    // Basic validation for required fields.
    if (!email || !password) {
        console.log('Backend: [POST /api/login] Missing email or password.');
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Retrieve user by email from the 'users' table.
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log(`Backend: [POST /api/login] User not found for email: ${email}`);
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        console.log(`Backend: [POST /api/login] User found: ${user.username}`);
        // Masking password for logs, only showing first 10 chars of hash
        console.log(`Backend: [POST /api/login] Stored password hash (first 10 chars): ${user.password_hash ? user.password_hash.substring(0, 10) : 'NULL'}...`);
        // Masking provided password for logs, only showing first 5 chars
        console.log(`Backend: [POST /api/login] Provided password (first 5 chars): ${password ? password.substring(0, 5) : 'NULL'}...`);


        // Compare the provided password with the stored hashed password.
        const isMatch = await bcrypt.compare(password, user.password_hash); // Use password_hash column
        console.log(`Backend: [POST /api/login] bcrypt.compare result: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT token containing user id, username, email, and role.
        // This token is valid for 1 hour.
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        // Respond with success message and the generated token.
        console.log(`Backend: [POST /api/login] Login successful for user: ${user.username}`);
        res.status(200).json({ message: 'Login successful!', token, user: { id: user.id, username: user.username, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name } });
    } catch (err) {
        console.error('Backend: [POST /api/login] Error during user login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @route GET /api/coffees
 * @description Retrieves a list of all coffee products from the database.
 * @access Public
 */
app.get('/api/coffees', async (req, res) => {
    console.log('Backend: [GET /api/coffees] Request received.');
    try {
        const queryText = 'SELECT id, name, description, price, image_url, category_id, stock_quantity, origin, roast_level FROM coffees ORDER BY name ASC';
        console.log('Backend: [GET /api/coffees] Executing SQL:', queryText);
        const result = await pool.query(queryText);
        console.log(`Backend: [GET /api/coffees] SQL query returned ${result.rows.length} rows.`);
        if (result.rows.length > 0) {
            result.rows.forEach((coffee, index) => {
                // This log should now show 'Type: number' if the parser is working
                console.log(`Backend: [GET /api/coffees] Item ${index}: id=${coffee.id}, name=${coffee.name}, price=${coffee.price} (Type: ${typeof coffee.price})`);
            });
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Backend: [GET /api/coffees] ERROR fetching coffees:', err.message, err.stack); // Enhanced error log with stack trace
        res.status(500).json({ error: 'Failed to retrieve coffee products.' });
    }
});

/**
 * @route GET /api/coffees/:id
 * @description Retrieves a single coffee product by its ID.
 * @access Public
 */
app.get('/api/coffees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT id, name, description, price, image_url, category_id, stock_quantity, origin, roast_level FROM coffees WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Coffee product not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Error fetching coffee with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to retrieve coffee product.' });
    }
});

/**
 * @route GET /api/categories
 * @description Retrieves a list of all coffee categories.
 * @access Public
 */
app.get('/api/categories', async (req, res) => {
    console.log('Backend: [GET /api/categories] Request received.');
    try {
        const queryText = 'SELECT id, name, description FROM categories ORDER BY name ASC';
        console.log('Backend: [GET /api/categories] Executing SQL:', queryText);
        const result = await pool.query(queryText);
        console.log(`Backend: [GET /api/categories] SQL query returned ${result.rows.length} rows.`);
        if (result.rows.length > 0) {
            result.rows.forEach((category, index) => {
                console.log(`Backend: [GET /api/categories] Category ${index}: id=${category.id}, name=${category.name}`);
            });
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Backend: [GET /api/categories] ERROR fetching categories:', err.message, err.stack);
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
});

/**
 * @route POST /api/inquiries
 * @description Handles submission of general inquiries or custom order messages.
 * @access Public
 */
app.post('/api/inquiries', async (req, res) => {
    const { name, email, phone, service_type, message } = req.body;

    // Basic validation
    if (!name || !email || !service_type || !message) {
        return res.status(400).json({ message: 'Name, email, service type, and message are required.' });
    }
    // Optional: Add more robust email/phone validation here

    try {
        const result = await pool.query(
            'INSERT INTO inquiries (name, email, phone, service_type, message) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, service_type, created_at',
            [name, email, phone, service_type, message]
        );
        res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: result.rows[0] });
    } catch (err) {
        console.error('Error submitting inquiry:', err.message);
        res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' });
    }
});


// --- Protected API Routes (require authentication via JWT) ---
// All routes below this line will require a valid JWT.
app.use(authenticateToken);

/**
 * @route GET /api/profile
 * @description Fetches the authenticated user's profile information.
 * @access Private (Authenticated User)
 */
app.get('/api/profile', (req, res) => {
    // req.user is populated by authenticateToken middleware
    // Exclude password_hash for security
    const { password_hash, ...userWithoutHash } = req.user;
    res.json({ message: 'User profile retrieved successfully', user: userWithoutHash });
});

/**
 * @route GET /api/orders - Fetch orders (admin can see all, customer only their own)
 * @description Retrieves orders based on user role.
 * @access Private (Authenticated User, Admin can see all)
 */
app.get('/api/orders', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    console.log('Backend: [GET /api/orders] Admin request received.');
    try {
        // Query to get orders and a JSON array of their items
        const queryText = `
            SELECT 
                o.id,
                o.customer_name,
                o.customer_email,
                o.total_price,
                o.status,
                o.created_at,
                o.updated_at,
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
                ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN coffees c ON oi.coffee_id = c.id
            GROUP BY o.id
            ORDER BY o.created_at DESC;
        `;
        const result = await pool.query(queryText);
        console.log(`Backend: [GET /api/orders] SQL query returned ${result.rows.length} orders.`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Backend: [GET /api/orders] ERROR fetching orders:', err.message, err.stack);
        res.status(500).json({ message: 'Failed to retrieve orders.' });
    }
});

/**
 * @route PUT /api/orders/:id - Update an order's status
 * @description Updates the status of an existing order. Requires admin role.
 * @access Private (Admin)
 */
app.put('/api/orders/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { status, payment_status, shipping_address, billing_address, payment_method, total_amount } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (status !== undefined) {
        fields.push(`status = $${queryIndex++}`);
        values.push(status);
    }
    if (payment_status !== undefined) {
        fields.push(`payment_status = $${queryIndex++}`);
        values.push(payment_status);
    }
    if (shipping_address !== undefined) {
        fields.push(`shipping_address = $${queryIndex++}`);
        values.push(shipping_address);
    }
    if (billing_address !== undefined) {
        fields.push(`billing_address = $${queryIndex++}`);
        values.push(billing_address);
    }
    if (payment_method !== undefined) {
        fields.push(`payment_method = $${queryIndex++}`);
        values.push(payment_method);
    }
    if (total_amount !== undefined) {
        fields.push(`total_amount = $${queryIndex++}`);
        values.push(total_amount);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);


    if (fields.length === 1 && fields[0].includes('updated_at')) { // Only updated_at, no actual changes
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id); // Add id for the WHERE clause

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
 * @route POST /api/orders - Create a new order. Requires authentication.
 * @access Private (Authenticated User)
 * NOTE: This is a simplified version. For a real e-commerce, you would fetch coffee prices
 * from the 'coffees' table and create entries in 'order_items' in a transaction.
 */
app.post('/api/orders', async (req, res) => {
    console.log('Backend: [POST /api/orders] Request received.');
    const { customerName, customerEmail, totalPrice, cartItems } = req.body;

    // Basic validation
    if (!customerName || !customerEmail || !totalPrice || !cartItems || cartItems.length === 0) {
        console.error('Backend: [POST /api/orders] Invalid order data received.');
        return res.status(400).json({ message: 'Invalid order data. Please ensure all required fields are present.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        // 1. Insert the main order into the "orders" table
        const orderQueryText = 'INSERT INTO orders (customer_name, customer_email, total_price) VALUES ($1, $2, $3) RETURNING id';
        const orderResult = await client.query(orderQueryText, [customerName, customerEmail, totalPrice]);
        const orderId = orderResult.rows[0].id;

        console.log(`Backend: [POST /api/orders] New order created with ID: ${orderId}.`);

        // 2. Insert each item from the cart into the "order_items" table
        const itemQueryText = 'INSERT INTO order_items (order_id, coffee_id, quantity, price_at_time_of_order) VALUES ($1, $2, $3, $4)';
        for (const item of cartItems) {
            await client.query(itemQueryText, [orderId, item.id, item.quantity, item.price]);
        }
        console.log(`Backend: [POST /api/orders] Inserted ${cartItems.length} items for order ID: ${orderId}.`);

        await client.query('COMMIT'); // Commit the transaction
        res.status(201).json({
            message: 'Order submitted successfully!',
            orderId: orderId
        });

    } catch (err) {
        await client.query('ROLLBACK'); // Rollback the transaction on error
        console.error('Backend: [POST /api/orders] ERROR submitting order:', err.message, err.stack);
        res.status(500).json({ message: 'Failed to submit order. Please try again.' });
    } finally {
        client.release();
    }
});
/*
 * @route DELETE /api/orders/:id - Delete an order by ID.
 * @description Deletes an order. Requires admin role.
 * @access Private (Admin)
 */
app.delete('/api/orders/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);
        const result2 = await pool.query(
            'DELETE FROM orders WHERE id = $1 RETURNING id',
            [id]
        );
        if (result2.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully!', deletedOrderId: id });
    } catch (err) {
        console.error(`Error deleting order ID ${id}:`, err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Admin-only API Routes (require 'admin' role) ---

/**
 * @route GET /api/inquiries (Admin)
 * @description Retrieves all inquiries. Requires admin role.
 * @access Private (Admin)
 */
app.get('/api/inquiries', authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, phone, service_type, message, status, created_at FROM inquiries ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching inquiries:', err.message);
        res.status(500).json({ error: 'Failed to retrieve inquiries.' });
    }
});

/**
 * @route PUT /api/inquiries/:id (Admin)
 * @description Updates the status or details of an inquiry. Requires admin role.
 * @access Private (Admin)
 */
app.put('/api/inquiries/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, service_type, message, status } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (name !== undefined) { fields.push(`name = $${queryIndex++}`); values.push(name); }
    if (email !== undefined) { fields.push(`email = $${queryIndex++}`); values.push(email); }
    if (phone !== undefined) { fields.push(`phone = $${queryIndex++}`); values.push(phone); }
    if (service_type !== undefined) { fields.push(`service_type = $${queryIndex++}`); values.push(service_type); }
    if (message !== undefined) { fields.push(`message = $${queryIndex++}`); values.push(message); }
    if (status !== undefined) { fields.push(`status = $${queryIndex++}`); values.push(status); }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);


    if (fields.length === 1 && fields[0].includes('updated_at')) { // Only updated_at, no actual changes
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id); // Add id for the WHERE clause

    try {
        const result = await pool.query(
            `UPDATE inquiries SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
        res.status(200).json({ message: 'Inquiry updated successfully!', inquiry: result.rows[0] });
    } catch (err) {
        console.error(`Error updating inquiry ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to update inquiry.' });
    }
});

/**
 * @route DELETE /api/inquiries/:id (Admin)
 * @description Deletes an inquiry by ID. Requires admin role.
 * @access Private (Admin)
 */
app.delete('/api/inquiries/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM inquiries WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
        res.status(200).json({ message: 'Inquiry deleted successfully!', deletedInquiryId: id });
    } catch (err) {
        console.error(`Error deleting inquiry ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to delete inquiry.' });
    }
});


/**
 * @route POST /api/coffees
 * @description Adds a new coffee product. Requires admin role.
 * @access Private (Admin)
 */
app.post('/api/coffees', authorizeRoles('admin'), async (req, res) => {
    const { name, description, price, image_url, category_id, stock_quantity, origin, roast_level } = req.body;
    if (!name || !price || !category_id) {
        return res.status(400).json({ message: 'Name, price, and category ID are required for a new coffee.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO coffees (name, description, price, image_url, category_id, stock_quantity, origin, roast_level) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, description, price, image_url, category_id, stock_quantity, origin, roast_level',
            [name, description, price, image_url, category_id, stock_quantity || 0, origin, roast_level] // Default stock_quantity to 0 if not provided
        );
        res.status(201).json({ message: 'Coffee added successfully!', coffee: result.rows[0] });
    } catch (err) {
        console.error('Error adding new coffee:', err.message);
        if (err.code === '23505') { // Unique violation for coffee name
            return res.status(409).json({ message: 'Coffee with this name already exists.' });
        }
        res.status(500).json({ error: 'Failed to add coffee product.' });
    }
});

/**
 * @route PUT /api/coffees/:id
 * @description Updates an existing coffee product. Requires admin role.
 * @access Private (Admin)
 */
app.put('/api/coffees/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, stock_quantity, origin, roast_level } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (name !== undefined) { fields.push(`name = $${queryIndex++}`); values.push(name); }
    if (description !== undefined) { fields.push(`description = $${queryIndex++}`); values.push(description); }
    if (price !== undefined) { fields.push(`price = $${queryIndex++}`); values.push(price); }
    if (image_url !== undefined) { fields.push(`image_url = $${queryIndex++}`); values.push(image_url); }
    if (category_id !== undefined) { fields.push(`category_id = $${queryIndex++}`); values.push(category_id); }
    if (stock_quantity !== undefined) { fields.push(`stock_quantity = $${queryIndex++}`); values.push(stock_quantity); }
    if (origin !== undefined) { fields.push(`origin = $${queryIndex++}`); values.push(origin); }
    if (roast_level !== undefined) { fields.push(`roast_level = $${queryIndex++}`); values.push(roast_level); }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);


    if (fields.length === 1 && fields[0].includes('updated_at')) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id); // Add id for the WHERE clause

    try {
        const result = await pool.query(
            `UPDATE coffees SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Coffee product not found.' });
        }
        res.status(200).json({ message: 'Coffee updated successfully!', coffee: result.rows[0] });
    } catch (err) {
        console.error(`Error updating coffee with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to update coffee product.' });
    }
});

/**
 * @route DELETE /api/coffees/:id
 * @description Deletes a coffee product. Requires admin role.
 * @access Private (Admin)
 */
app.delete('/api/coffees/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM coffees WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Coffee product not found.' });
        }
        res.status(200).json({ message: 'Coffee deleted successfully!', deletedCoffeeId: id });
    } catch (err) {
        console.error(`Error deleting coffee with ID ${id}:`, err.message);
        res.status(500).json({ error: 'Failed to delete coffee product.' });
    }
});

/**
 * @route POST /api/categories
 * @description Adds a new category. Requires admin role.
 * @access Private (Admin)
 */
app.post('/api/categories', authorizeRoles('admin'), async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description',
            [name, description]
        );
        res.status(201).json({ message: 'Category added successfully!', category: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ message: 'Category with this name already exists.' });
        }
        console.error('Error adding new category:', err.message);
        res.status(500).json({ error: 'Failed to add category.' });
    }
});

/**
 * @route GET /api/admin/users - Get all users (Admin only)
 * @description Retrieves a list of all users. Requires admin role.
 * @access Private (Admin)
 */
app.get('/api/admin/users', authorizeRoles('admin'), async (req, res) => {
    try {
        // Select all user fields except password_hash for security
        const result = await pool.query('SELECT id, username, email, first_name, last_name, role, created_at, updated_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: 'Failed to retrieve users.' });
    }
});

/**
 * @route PUT /api/admin/users/:id - Update user role (Admin only)
 * @description Updates a user's role or other profile info. Requires admin role.
 * @access Private (Admin)
 */
app.put('/api/admin/users/:id', authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { username, email, first_name, last_name, role } = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (username !== undefined) { fields.push(`username = $${queryIndex++}`); values.push(username); }
    if (email !== undefined) { fields.push(`email = $${queryIndex++}`); values.push(email); }
    if (first_name !== undefined) { fields.push(`first_name = $${queryIndex++}`); values.push(first_name); }
    if (last_name !== undefined) { fields.push(`last_name = $${queryIndex++}`); values.push(last_name); }
    if (role !== undefined) { fields.push(`role = $${queryIndex++}`); values.push(role); }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);


    if (fields.length === 1 && fields[0].includes('updated_at')) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id); // Add id for the WHERE clause

    try {
        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING id, username, email, first_name, last_name, role, created_at, updated_at`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User updated successfully!', user: result.rows[0] });
    } catch (err) {
        console.error(`Error updating user ID ${id}:`, err.message);
        if (err.code === '23505') { // Unique violation for email/username
            return res.status(409).json({ message: 'Email or username already exists.' });
        }
        res.status(500).json({ error: 'Failed to update user.' });
    }
});


// --- Start the Server ---
app.listen(port, () => {
    console.log(`🚀 Backend server listening at http://localhost:${port}`);
    console.log(`Frontend URL configured for CORS: ${process.env.FRONTEND_URL}`);
});